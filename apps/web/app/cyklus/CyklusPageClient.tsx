'use client';

import dynamic from 'next/dynamic';

const CyklusClient = dynamic(() => import('../../src/components/cyklus/CyklusClient'), {
  ssr: false,
  loading: () => (
    <section className="cyklus-route-loading" role="status" aria-live="polite">
      <span>CYKLUS // INITIALIZACE</span>
      <strong>Načítám diagnostické jádro…</strong>
    </section>
  ),
});

export default function CyklusPageClient() {
  return <CyklusClient />;
}
