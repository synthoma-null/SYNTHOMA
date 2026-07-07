import type { Metadata } from 'next';
import { CyklusVoidHubClient } from '@/components/cyklus/CyklusVoidHubClient';

export const metadata: Metadata = {
  title: 'SYNTHOMA – Prázdnota',
  description: 'Meta prostor cyklu SYNTHOMA: kapsa, crafting, místnosti, loadout a protokoly.',
  robots: { index: false, follow: false },
};

export default function CyklusVoidPage() {
  return (
    <main className="glitch-bg cyklus-void-page" role="main" aria-label="Prázdnota cyklu SYNTHOMA">
      <CyklusVoidHubClient playHref="/cyklus" />
    </main>
  );
}
