import type { Metadata } from 'next';
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Přesměrování kapitoly | SYNTHOMA',
  description: 'Kompatibilní přesměrování na kanonickou stránku kapitoly SYNTHOMA-NULL.',
  alternates: { canonical: 'https://www.synthoma.cz/books' },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return children;
}
