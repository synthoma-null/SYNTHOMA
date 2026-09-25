"use client";
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isIntroCompleteForDocument } from '../../src/lib/intro';

export default function FirstVisitRedirectClient() {
  const pathname = usePathname();
  const router = useRouter();
  const checked = useRef(false);
  useEffect(() => {
    if (checked.current) return;
    document.documentElement.removeAttribute('data-synthoma-intro-pending');
    if (pathname === '/' && !isIntroCompleteForDocument()) {
      checked.current = true;
      router.replace(`/landing-intro${window.location.search}`);
    }
  }, [pathname, router]);
  return null;
}
