"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { readStorageJSON, writeStorageJSON } from "../lib/browser";

function softFail(scope: string, err: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[useChoiceTracking:${scope}]`, err);
  }
}

function queueLocalTrace(payload: Record<string, unknown>): void {
  try {
    const stored = JSON.parse(localStorage.getItem("synthoma_local_trace") || "[]") as unknown[];
    stored.push({ ...payload, createdAt: new Date().toISOString() });
    localStorage.setItem("synthoma_local_trace", JSON.stringify(stored.slice(-200)));
  } catch {}
}

/**
 * Track choice events including MBTI scores, stability/pressure/shadow deltas,
 * entity relations, functions and emotions. Queue locally on non-ok responses
 * or network failures so choices are never silently lost.
 */
export function useChoiceTracking(chapterIdProp?: string, collectionProp?: string) {
  const { status: sessionStatus } = useSession();
  const applyMbtiScore = useCallback((node: Element | null): string => {
    const tagsAttr = (node?.getAttribute("data-tags") || "").trim();
    if (!node || !tagsAttr) return "";
    try {
      const parts = tagsAttr.split(",").map((s) => s.trim()).filter(Boolean);
      if (!parts.length) return tagsAttr;
      const valid = new Set(["I", "E", "N", "S", "F", "T", "J", "P"]);
      const hasWeights = parts.some((p) => /[+-]\d+$/i.test(p));
      const key = "mbtiScores";
      let data = readStorageJSON<Record<string, number>>(key, {});
      if (hasWeights) {
        for (const p of parts) {
          const up = (p || "").toUpperCase();
          const m = up.match(/^([IENSFTJP])([+-]\d+)$/);
          if (!m || !m[1] || !m[2]) continue;
          const letter = m[1] as string;
          const delta = parseInt(m[2] as string, 10);
          if (!valid.has(letter)) continue;
          const cur = typeof data[letter] === "number" ? (data[letter] as number) : 0;
          data[letter] = cur + (isFinite(delta) ? delta : 0);
        }
      } else {
        const first = (parts[0] || "").toUpperCase();
        if (valid.has(first)) {
          const cur = typeof data[first] === "number" ? (data[first] as number) : 0;
          data[first] = cur + 1;
        }
      }
      writeStorageJSON(key, data);
      writeStorageJSON(key, data, "session");
    } catch (err) {
      softFail("applyMbtiScore", err);
    }
    return tagsAttr;
  }, []);

  const trackChoiceEvent = useCallback(async (node: Element | null, tagsAttr: string): Promise<void> => {
    if (!node) return;
    try {
      const el = node as HTMLElement;
      const choiceText = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 200);
      const chapterId = chapterIdProp || "";
      const collection = collectionProp || "SYNTHOMA-NULL";
      const blockId = el.dataset.blockId || el.closest("[id]")?.id || undefined;
      const choiceId = el.dataset.choiceId || undefined;
      const nextBlockId = el.dataset.next || el.dataset.nextBlockId || undefined;
      const tone = el.dataset.tone || undefined;

      const parseDelta = (raw: string) => {
        const out: Record<string, number> = {};
        if (!raw) return out;
        for (const part of raw.split(",")) {
          const [k, v] = part.split(":");
          if (k && v) out[k.trim()] = parseInt(v.trim(), 10) || 0;
        }
        return out;
      };
      const functionDelta = parseDelta(el.dataset.functions || "");
      const emotionDelta = parseDelta(el.dataset.emotions || "");

      // Fallback: MBTI dimension tags map to cognitive functions used by the psyche stats.
      if (tagsAttr && Object.keys(functionDelta).length === 0) {
        const tagMap: Record<string, string> = { N: "Ni", S: "Se", F: "Fe", T: "Ti" };
        for (const tag of tagsAttr.split(",")) {
          const key = tagMap[tag.trim().toUpperCase()];
          if (key) functionDelta[key] = (functionDelta[key] || 0) + 1;
        }
      }

      const parseIntOrUndefined = (raw: string | undefined) =>
        raw !== undefined ? (parseInt(raw, 10) || 0) : undefined;
      const stabilityDelta = parseIntOrUndefined(el.dataset.stability);
      const pressureDelta = parseIntOrUndefined(el.dataset.pressure);
      const shadowDelta = parseIntOrUndefined(el.dataset.shadow);

      const entityDelta: Record<string, Record<string, number>> = {};
      for (const attr of el.getAttributeNames()) {
        if (!attr.startsWith("data-entity-")) continue;
        const entity = attr.replace("data-entity-", "");
        const raw = el.getAttribute(attr) || "";
        const metrics: Record<string, number> = {};
        for (const part of raw.split(",")) {
          const [k, v] = part.split(":");
          if (k && v) metrics[k.trim()] = parseInt(v.trim(), 10) || 0;
        }
        if (Object.keys(metrics).length) entityDelta[entity] = metrics;
      }

      const payload = {
        collection,
        chapterId,
        blockId,
        choiceId,
        choiceText,
        nextBlockId,
        tags: tagsAttr ? tagsAttr.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        functionDelta: Object.keys(functionDelta).length ? functionDelta : undefined,
        emotionDelta: Object.keys(emotionDelta).length ? emotionDelta : undefined,
        tone,
        stabilityDelta,
        pressureDelta,
        shadowDelta,
        entityDelta: Object.keys(entityDelta).length ? entityDelta : undefined,
      };

      if (!chapterId) {
        // No chapterId: always store locally so nothing is silently lost
        queueLocalTrace(payload);
        return;
      }

      if (sessionStatus !== "authenticated") {
        queueLocalTrace(payload);
        return;
      }

      try {
        const res = await fetch("/api/me/choices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          // 401, 403, 500, etc. — queue locally so the choice is not lost
          queueLocalTrace(payload);
          return;
        }
      } catch {
        // Network failure — queue locally
        queueLocalTrace(payload);
      }
    } catch (err) {
      softFail("trackChoiceEvent", err);
    }
  }, [chapterIdProp, collectionProp, sessionStatus]);

  const scoreFromNode = useCallback((node: Element | null) => {
    const tagsAttr = applyMbtiScore(node);
    trackChoiceEvent(node, tagsAttr);
    try {
      document.dispatchEvent(new CustomEvent("synthoma:choice-made"));
    } catch {}
  }, [applyMbtiScore, trackChoiceEvent]);

  return { applyMbtiScore, trackChoiceEvent, scoreFromNode };
}
