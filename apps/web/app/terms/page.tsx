import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'SYNTHOMA \u2013 Podm\u00ednky pou\u017eit\u00ed',
  description: 'Podm\u00ednky pou\u017eit\u00ed webu SYNTHOMA.cz, interaktivn\u00ed \u010dte\u010dky, archivu, u\u017eivatelsk\u00e9ho \u00fa\u010dtu, mem\u016f a digit\u00e1ln\u00edho obsahu.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return <TermsClient />;
}

