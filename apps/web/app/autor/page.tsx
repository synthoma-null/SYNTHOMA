import type { Metadata } from "next";
import AutorClient from "./AutorClient";

export const metadata: Metadata = {
  title: "Autor | SYNTHOMA",
  description: "Informace o autorovi a záměru projektu SYNTHOMA.",
  alternates: {
    canonical: "https://synthoma.cz/autor",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AutorPage() {
  return <AutorClient />;
}
