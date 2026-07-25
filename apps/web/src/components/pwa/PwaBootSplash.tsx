'use client';

import { useEffect, useState } from 'react';
import { SYNTHOMA_ASSETS } from '../../lib/brandAssets';
import { isStandaloneDisplay } from '../../lib/pwa';

const MIN_VISIBLE_MS = 850;
const MAX_VISIBLE_MS = 2500;

export default function PwaBootSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isStandaloneDisplay()) return;
    setVisible(true);
    const startedAt = Date.now();
    let hideTimer = 0;
    const readyTimer = window.setTimeout(() => {
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      hideTimer = window.setTimeout(() => setVisible(false), remaining);
    }, 0);
    const safetyTimer = window.setTimeout(() => setVisible(false), MAX_VISIBLE_MS);
    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className="pwa-boot-splash" data-visible={visible ? 'true' : 'false'} aria-hidden="true">
      <img src={SYNTHOMA_ASSETS.logo} alt="" />
    </div>
  );
}
