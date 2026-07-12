import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import '../../src/styles/synthoma-os/intro.css';

export const metadata: Metadata = {
  title: 'Inicializace | SYNTHOMA',
  description: 'Krátká inicializační sekvence systému SYNTHOMA OS.',
  alternates: { canonical: 'https://www.synthoma.cz/landing-intro' },
  robots: { index: false, follow: true },
};

export default function LandingIntroLayout({ children }: PropsWithChildren) {
  return children;
}
