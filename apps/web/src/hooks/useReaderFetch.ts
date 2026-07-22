"use client";

import { useEffect, useState } from "react";
import { CHAPTERS } from '../content/booksManifest';
import { validateReaderFlowDocument } from '../lib/typewriterContent';

function softFail(scope: string, err: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[useReaderFetch:${scope}]`, err);
  }
}

function encodePathPreserve(url: string): string {
  try {
    if (/^https?:\/\//i.test(url)) return url;
    const split = url.split(/([?#].*$)/, 2);
    const pathWithHost = split[0] ?? url;
    const rest = split[1] ?? "";
    const parts = pathWithHost.split("/").map((seg, i) => {
      if (i === 0 && seg === "") return "";
      try {
        return encodeURIComponent(decodeURIComponent(seg));
      } catch {
        return encodeURIComponent(seg);
      }
    });
    return parts.join("/") + rest;
  } catch {
    return url;
  }
}

const STYLESHEET_WHITELIST = ["/styles.css", "/synth-gate.css"];
const VALID_CHAPTER_IDS = new Set(CHAPTERS.map((chapter) => chapter.id));
const VALID_CHAPTER_FILENAMES = new Set(
  CHAPTERS.flatMap((chapter) => [chapter.filename, chapter.filename_en].filter((name): name is string => Boolean(name))),
);

function attachStylesheets(doc: Document) {
  try {
    const styleLinks = Array.from(
      doc.querySelectorAll("link[rel=\"stylesheet\"][href]")
    ) as HTMLLinkElement[];
    styleLinks.forEach((lnk) => {
      const href = (lnk.getAttribute("href") || "").trim();
      if (!href) return;
      if (!STYLESHEET_WHITELIST.includes(href)) return;
      if (document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
      const tag = document.createElement("link");
      tag.rel = "stylesheet";
      tag.href = href;
      document.head.appendChild(tag);
    });
  } catch (err) {
    softFail("attachStylesheets", err);
  }
}

export type UseReaderFetchResult = {
  doc: Document | null;
  storyCache: string;
  error: string | null;
  isLoading: boolean;
};

/**
 * Fetch and parse the chapter HTML. Attach whitelisted external stylesheets.
 */
export function useReaderFetch(srcUrl: string, onFetchError?: (status: number) => void): UseReaderFetchResult {
  const [doc, setDoc] = useState<Document | null>(null);
  const [storyCache, setStoryCache] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        setDoc(null);
        setStoryCache("");
        const finalUrl = encodePathPreserve(srcUrl);
        const res = await fetch(finalUrl, { cache: "no-store" });
        if (!res.ok) {
          onFetchError?.(res.status);
          throw new Error(`HTTP ${res.status}`);
        }
        const raw = await res.text();
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(raw, "text/html");
        const flowErrors = validateReaderFlowDocument(parsedDoc, {
          validChapterIds: VALID_CHAPTER_IDS,
          validChapterFilenames: VALID_CHAPTER_FILENAMES,
        });
        if (flowErrors.length) {
          throw new Error(`Reader flow validation failed: ${flowErrors.join(' ')}`);
        }
        attachStylesheets(parsedDoc);
        const cacheEl = parsedDoc.querySelector("#story-cache") as HTMLElement | null;
        const cache = cacheEl ? cacheEl.innerHTML : "";
        if (!cancelled) {
          setDoc(parsedDoc);
          setStoryCache(cache);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Načítání selhalo");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [srcUrl, onFetchError]);

  return { doc, storyCache, error, isLoading };
}
