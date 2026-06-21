import "./globals.css";
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Úvod | SYNTHOMA',
  description: 'Úvodní stránka cyberpunkové interaktivní čtečky a knihovny SYNTHOMA.',
  alternates: {
    canonical: 'https://www.synthoma.cz/landing-intro',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingIntroLayout({ children }: PropsWithChildren) {
  return (
    <section>
      {children}
    </section>
  );
}
