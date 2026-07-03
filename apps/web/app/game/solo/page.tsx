import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solo průchod | SYNTHOMA',
  description: 'Narrative roguelite. Procházej sektory Prázdnoty sám.',
  robots: { index: false, follow: false },
};

export default function SoloPage() {
  redirect('/cyklus');
}
