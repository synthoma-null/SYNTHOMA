"use client";

import { useCallback, type RefObject } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { saveLastChapterPath, saveReaderResume } from "../lib/readerState";
import { CHAPTERS } from "../content/booksManifest";
import type { ReaderFlowState } from "../lib/readerDecisionController";

function canonicalChapterRoute(reference: string): string | null {
  try {
    const path = decodeURIComponent(reference).split("#")[0]?.split("?")[0] ?? reference;
    const filename = path.split("/").pop() ?? path;
    const chapter = CHAPTERS.find((candidate) =>
      candidate.id === reference
      || candidate.filename === filename
      || candidate.filename_en === filename,
    );
    return chapter ? `/chapter/${encodeURIComponent(chapter.id)}` : null;
  } catch {
    return null;
  }
}

function softFail(scope: string, error: unknown): void {
  if (process.env.NODE_ENV !== "production") console.warn(`[useChoiceHandlers:${scope}]`, error);
}

function findTargetInCache(cacheHtml: string, id: string): HTMLElement | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="_cache">${cacheHtml}</div>`, "text/html");
    const holder = doc.getElementById("_cache");
    return holder?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ?? null;
  } catch {
    return null;
  }
}

function showMissingTarget(host: HTMLElement | null, target: string): void {
  console.error(`[TypewriterReader] Missing choice target: ${target}`);
  if (!host || host.querySelector('[data-reader-flow-error="missing-target"]')) return;
  const message = document.createElement('p');
  message.className = 'reader-decision-status reader-decision-status--error';
  message.dataset.readerFlowError = 'missing-target';
  message.setAttribute('role', 'alert');
  message.textContent = 'LOG [CHOICE_TARGET_MISSING]: Pokračování nebylo nalezeno.';
  host.appendChild(message);
}

export type ChoiceHandlerActions = {
  lockChoiceGroup: (chosen: HTMLElement, root: HTMLElement) => void;
  scoreFromNode: (node: Element | null) => void;
  persistChoiceState: (node: HTMLElement, container: HTMLElement) => void;
  announce: (message: string) => void;
  renderNextSegment: (html: string, mode: "typed" | "instant") => void;
  setFlowState: (state: ReaderFlowState) => void;
};

export type UseChoiceHandlersOptions = {
  hostRef: RefObject<HTMLElement | null>;
  storyCacheRef: RefObject<string>;
  continueRef: RefObject<(() => void) | null>;
  router: AppRouterInstance;
  srcUrl: string;
} & ChoiceHandlerActions;

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
    setFlowState,
  } = options;

  const bindChoiceHandlersLocal = useCallback(() => {
    const root = hostRef.current;
    if (!root) return;

    try {
      (window as any).EchoGhost?.refresh(root);
    } catch {}

    root.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => {
      if (element.dataset.boundAction === "1") return;
      element.dataset.boundAction = "1";
      element.addEventListener("click", (event: Event) => {
        if (element.dataset.action !== "open-profile") return;
        event.preventDefault();
        document.dispatchEvent(new CustomEvent("synthoma:open-profile"));
      });
    });

    root.querySelectorAll<HTMLElement>(".choice-link").forEach((node) => {
      if (node.dataset.boundGeneral === "1") return;

      node.addEventListener("focus", () => {
        const label = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (label) announce(`Fokus na volbu: ${label}`);
      });

      node.addEventListener("click", (event: Event) => {
        event.preventDefault();
        if (node.dataset.action) return;
        const group = node.closest<HTMLElement>('[data-choice-group], .choices, .choice-group');
        if (group?.classList.contains('choices-locked') || node.dataset.readerResolving === 'true') return;

        const href = node.getAttribute("href") || node.getAttribute("data-href") || "";
        const dataNext = node.getAttribute("data-next") || "";
        const commitChoice = () => {
          const host = hostRef.current;
          if (host) {
            lockChoiceGroup(node, host);
            persistChoiceState(node, host);
          }
          scoreFromNode(node);
          const label = (node.textContent || "").replace(/\s+/g, " ").trim();
          if (label) announce(`Zvoleno: ${label}.`);
        };

        if (dataNext) {
          const target = findTargetInCache(storyCacheRef.current, dataNext);
          if (!target) {
            showMissingTarget(hostRef.current, dataNext);
            setFlowState('WAITING_FOR_CHOICE');
            return;
          }
          node.dataset.readerResolving = 'true';
          setFlowState('RESOLVING_CHOICE');
          commitChoice();
          try {
            saveReaderResume({ chapterPath: srcUrl, dataNext });
          } catch (error) {
            softFail('resume-data-next', error);
          }
          renderNextSegment(target.innerHTML, "typed");
          return;
        }

        if (href) {
          node.dataset.readerResolving = 'true';
          setFlowState('RESOLVING_CHOICE');
          commitChoice();

          if (href.startsWith("#")) {
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
            try {
              saveReaderResume({ chapterPath: srcUrl, hash: href });
            } catch (error) {
              softFail('resume-hash', error);
            }
            setFlowState('CHAPTER_COMPLETE');
            return;
          }

          let destination = href;
          const legacyChapter = /^\/books\/.+\.html(\?.*)?(#.*)?$/i.test(href)
            || (!href.startsWith('/') && !href.startsWith('http'));
          if (legacyChapter) {
            const path = href.startsWith('/') ? href : `/${href}`;
            destination = canonicalChapterRoute(path) ?? '/books';
          }
          if (destination.startsWith('/chapter/')) saveLastChapterPath(destination);
          setFlowState('CHAPTER_COMPLETE');
          window.setTimeout(() => {
            if (destination.startsWith('/')) router.push(destination);
            else window.location.assign(destination);
          }, 350);
          return;
        }

        if (continueRef.current) {
          node.dataset.readerResolving = 'true';
          setFlowState('RESOLVING_CHOICE');
          commitChoice();
          const continuation = continueRef.current;
          continueRef.current = null;
          continuation();
          return;
        }

        setFlowState('RESOLVING_CHOICE');
        commitChoice();
        setFlowState('CHAPTER_COMPLETE');
      });

      node.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          node.click();
          return;
        }
        if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
        const group = node.closest<HTMLElement>('[data-choice-group], .choices, .choice-group');
        if (!group || group.classList.contains('choices-locked')) return;
        const choices = Array.from(group.querySelectorAll<HTMLElement>('.choice-link'));
        const current = choices.indexOf(node);
        if (current < 0 || choices.length < 2) return;
        event.preventDefault();
        const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
        choices[(current + direction + choices.length) % choices.length]?.focus();
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
    setFlowState,
  ]);

  return { bindChoiceHandlers: bindChoiceHandlersLocal };
}
