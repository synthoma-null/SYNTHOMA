'use client';

import { useLang } from '../../lib/LangContext';

export default function HomeSystemStatus() {
  const { t } = useLang();
  return (
    <div className="synthoma-home__system" aria-label={t('home.system.aria')}>
      <span>NODE // CENTRAL</span>
      <strong>SYSTEM AVAILABLE</strong>
      <span>MEMORY CHANNEL // UNSTABLE</span>
    </div>
  );
}
