'use client';

import { useEffect, useState } from 'react';

const MOBILE_LAYOUT_QUERY = '(max-width: 767px)';

export default function useCyklusMobileLayout() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_LAYOUT_QUERY);
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  return mobile;
}
