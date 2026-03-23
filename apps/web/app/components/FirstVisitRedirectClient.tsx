"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { readStorage, writeStorage } from "../../src/lib/browser";

export default function FirstVisitRedirectClient() {
  const router = useRouter();
  useEffect(() => {
    try {
      const first = readStorage("visited_once", null);
      if (!first) {
        writeStorage("visited_once", "1");
        router.replace("/landing-intro");
      }
    } catch {}
  }, [router]);
  return null;
}
