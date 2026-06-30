import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'SYNTHOMA – Ochrana osobních údajů',
  description: 'Zásady ochrany osobních údajů pro web SYNTHOMA.cz, interaktivní čtečku, archiv, uživatelské účty, mnemy, platby, cookies a lokální úložiště.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}

