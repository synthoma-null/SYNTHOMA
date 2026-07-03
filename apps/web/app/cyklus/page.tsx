import type { Metadata } from 'next';
import CyklusClient from '../../src/components/cyklus/CyklusClient';

export const metadata: Metadata = {
  title: 'SYNTHOMA: CYKLUS',
  description: 'Swipe-based psychological roguelite. Balance stats, collect items, survive the cycles.',
};

export default function CyklusPage() {
  return (
    <main className="cyklus-page">
      <CyklusClient />
    </main>
  );
}
