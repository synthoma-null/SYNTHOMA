import type { Metadata } from 'next';
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Čtečka | SYNTHOMA',
  description: 'Interaktivní čtečka pro glitch-noir příběhy v univerzu SYNTHOMA.',
  alternates: {
    canonical: 'https://www.synthoma.cz/reader',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return children;
}
