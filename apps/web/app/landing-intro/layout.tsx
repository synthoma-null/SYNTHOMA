import "./globals.css";
import type { PropsWithChildren } from "react";

export default function LandingIntroLayout({ children }: PropsWithChildren) {
  return (
    <section>
      {children}
    </section>
  );
}
