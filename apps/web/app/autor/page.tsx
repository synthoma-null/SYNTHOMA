import type { Metadata } from "next";
import AutorClient from "./AutorClient";

export const metadata: Metadata = {
  title: "Autor | SYNTHOMA",
  description: "Informace o autorovi a zĂˇmÄ›ru projektu SYNTHOMA.",
  alternates: {
    canonical: "https://www.synthoma.cz/autor",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AutorPage() {
  return <AutorClient />;
}
