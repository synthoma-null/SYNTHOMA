import type { Metadata } from "next";
import { promises as fs } from 'fs';
import path from 'path';
import AutorClient from "./AutorClient";

export const metadata: Metadata = {
  title: "Autor | SYNTHOMA",
  description: "Informace o autorovi a záměru projektu SYNTHOMA.",
  alternates: {
    canonical: "https://www.synthoma.cz/autor",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AutorPage() {
  // Load author content for server-side fallback
  let authorContent = "";
  try {
    const authorPath = path.join(process.cwd(), 'public', 'data', 'SYNTHOMAAUTOR.html');
    authorContent = await fs.readFile(authorPath, 'utf8');
  } catch {}

  return (
    <>
      {/* Server-side fallback for crawlers and no-JS */}
      <noscript>
        <div 
          className="autor-fallback"
          dangerouslySetInnerHTML={{ __html: authorContent }}
        />
      </noscript>
      <AutorClient />
    </>
  );
}
