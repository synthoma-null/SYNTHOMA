"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { readStorage } from "../../src/lib/browser";
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from "../../src/lib/intro";

export default function FirstVisitRedirectClient() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== '/') return;
    try {
      const seenVersion = readStorage(SYNTHOMA_INTRO_STORAGE_KEY, null);
      if (seenVersion !== SYNTHOMA_INTRO_VERSION) {
        document.documentElement.setAttribute('data-synthoma-intro-pending', 'true');
        router.replace("/landing-intro");
      } else {
        document.documentElement.removeAttribute('data-synthoma-intro-pending');
      }
    } catch {}
  }, [pathname, router]);
  return null;
}
