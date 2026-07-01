"use client";

import { useCallback, type RefObject } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { saveLastChapterPath, saveReaderResume } from "../lib/readerState";
import { CHAPTERS } from "../content/booksManifest";

function softFail(scope: string, err: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[useChoiceHandlers:${scope}]`, err);
  }
}

function findTargetInCache(cacheHtml: string, id: string): HTMLElement | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="_cache">${cacheHtml}</div>`, "text/html");
    const holder = doc.getElementById("_cache");
    return holder ? (holder.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null) : null;
  } catch {
    return null;
  }
}

export type ChoiceHandlerActions = {
  lockChoiceGroup: (chosen: HTMLElement, root: HTMLElement) => void;
  scoreFromNode: (node: Element | null) => void;
  persistChoiceState: (node: HTMLElement, container: HTMLElement) => void;
  announce: (msg: string) => void;
  renderNextSegment: (html: string, mode: "typed" | "instant") => void;
};

export type UseChoiceHandlersOptions = {
  hostRef: RefObject<HTMLElement | null>;
  storyCacheRef: RefObject<string>;
  continueRef: RefObject<(() => void) | null>;
  router: AppRouterInstance;
  srcUrl: string;
} & ChoiceHandlerActions;

/**
 * Bind click/touch handlers to choice links and data-action elements inside the reader host.
 * Delegates rendering to the provided `renderNextSegment` action so the same segment renderer
 * is used for data-next, continuation, and fallback section jumps.
 */
export function useChoiceHandlers(options: UseChoiceHandlersOptions) {
  const {
    hostRef,
    storyCacheRef,
    continueRef,
    router,
    srcUrl,
    lockChoiceGroup,
    scoreFromNode,
    persistChoiceState,
    announce,
    renderNextSegment,
  } = options;

  const bindChoiceHandlersLocal = useCallback(() => {
    const root = hostRef.current;
    if (!root) return;

    // EchoGhost refresh is the single source of truth for echo-ghost effects
    try {
      (window as any).EchoGhost?.refresh(root);
    } catch {}

    // data-action navigation helpers
    root.querySelectorAll<HTMLElement>("[data-action]").forEach((el) => {
      if (el.dataset.boundAction === "1") return;
      el.dataset.boundAction = "1";
      el.addEventListener("click", (e: Event) => {
        const action = el.dataset.action;
        if (action === "open-profile") {
          e.preventDefault();
          try {
            document.dispatchEvent(new CustomEvent("synthoma:open-profile"));
          } catch {}
        }
      });
    });

    root.querySelectorAll<HTMLElement>(".choice-link").forEach((el) => {
      const node = el as HTMLElement;
      if (node.dataset.boundGeneral === "1") return;

      node.addEventListener("focus", () => {
        const label = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (label) announce(`Fokus na volbu: ${label}`);
      });

      node.addEventListener("click", (e: Event) => {
        const h = hostRef.current;
        if (h) lockChoiceGroup(node, h);
        const href =
          node.getAttribute("href") ||
          node.getAttribute("data-href") ||
          node.getAttribute("data-next") ||
          "";

        // data-next: in-cache section jump
        try {
          const dataNext = node.getAttribute("data-next") || "";
          if (dataNext && storyCacheRef.current) {
            const target = findTargetInCache(storyCacheRef.current, dataNext);
            if (target) {
              e.preventDefault();
              scoreFromNode(node);
              try {
                const host2 = hostRef.current;
                if (host2) persistChoiceState(node, host2);
              } catch {}
              try {
                saveReaderResume({ chapterPath: srcUrl, dataNext });
              } catch {}
              renderNextSegment(target.innerHTML, "typed");
              return;
            }
          }
        } catch {}

        // pending continuation segment (e.g. next MBTI group in the same chapter)
        if (continueRef.current) {
          e.preventDefault();
          const h2 = hostRef.current;
          if (h2) lockChoiceGroup(node, h2);
          scoreFromNode(node);
          try {
            const host2 = hostRef.current;
            if (host2) persistChoiceState(node, host2);
          } catch {}
          try {
            const dn = node.getAttribute("data-next") || "";
            if (dn) saveReaderResume({ chapterPath: srcUrl, dataNext: dn });
          } catch {}
          const label = (node.textContent || "").replace(/\s+/g, " ").trim();
          if (label) announce(`Zvoleno: ${label}. Pokračuji…`);
          const fn = continueRef.current;
          continueRef.current = null;
          fn && fn();
          return;
        }

        e.preventDefault();
        if (!href) {
          scoreFromNode(node);
          try {
            const host2 = hostRef.current;
            if (host2) persistChoiceState(node, host2);
          } catch {}
          try {
            const dn = node.getAttribute("data-next") || "";
            if (dn) {
              saveReaderResume({ chapterPath: srcUrl, dataNext: dn });
            } else {
              const par = node.closest("p.choice") as HTMLElement | null;
              const pid = par?.id || "";
              if (pid) saveReaderResume({ chapterPath: srcUrl, hash: `#${pid}` });
            }
          } catch {}
          const label = (node.textContent || "").replace(/\s+/g, " ").trim();
          if (label) announce(`Zvoleno: ${label}.`);
          return;
        }

        if (href.startsWith("http")) {
          window.open(href, "_blank");
        } else if (href.startsWith("#")) {
          const section = document.querySelector(href);
          section?.scrollIntoView({ behavior: "smooth" });
          const h2 = hostRef.current;
          if (h2) lockChoiceGroup(node, h2);
          scoreFromNode(node);
          try {
            const host2 = hostRef.current;
            if (host2) persistChoiceState(node, host2);
          } catch {}
          try {
            saveReaderResume({ chapterPath: srcUrl, hash: href });
          } catch {}
          const label = (node.textContent || "").replace(/\s+/g, " ").trim();
          if (label) announce(`Zvoleno: ${label}.`);
        } else {
          // Site route
          if (href.startsWith("/")) {
            if (/^\/books\/.+\.html(\?.*)?(#.*)?$/i.test(href)) {
              // Resolve legacy /books/<collection>/<filename>.html to /chapter/<id>
              try {
                const hrefPath = href.split("?")[0] ?? href;
                const filenameRaw = decodeURIComponent(hrefPath.split("/").pop() ?? "");
                const matched = CHAPTERS.find(
                  (ch) => ch.filename === filenameRaw || ch.filename_en === filenameRaw,
                );
                if (matched) {
                  scoreFromNode(node);
                  try {
                    const host2 = hostRef.current;
                    if (host2) persistChoiceState(node, host2);
                  } catch {}
                  saveLastChapterPath(`/chapter/${matched.id}`);
                  router.push(`/chapter/${encodeURIComponent(matched.id)}`);
                  return;
                }
              } catch {}
              // Fallback: legacy ?u= if no manifest match
              try {
                saveLastChapterPath(href);
              } catch {}
              router.push(`/reader?u=${encodeURIComponent(href)}`);
            } else {
              router.push(href);
            }
            return;
          }
          // Fallback: in-document section jump using story-cache
          try {
            const cacheHtml = storyCacheRef.current || "";
            if (cacheHtml && href) {
              const target = findTargetInCache(cacheHtml, href);
              if (target) {
                e.preventDefault();
                renderNextSegment(target.innerHTML, "typed");
                return;
              }
            }
          } catch {}
          // Fallback: treat as external chapter path
          let path = href;
          if (!(path.startsWith("/") || path.startsWith("http") || path.startsWith("#"))) {
            path = "/" + path;
          }
          router.push(`/reader?u=${encodeURIComponent(path)}`);
        }
      });

      node.dataset.boundGeneral = "1";
    });
  }, [
    hostRef,
    storyCacheRef,
    continueRef,
    router,
    srcUrl,
    lockChoiceGroup,
    scoreFromNode,
    persistChoiceState,
    announce,
    renderNextSegment,
  ]);

  return { bindChoiceHandlers: bindChoiceHandlersLocal };
}
