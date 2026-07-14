import type { Metadata } from "next";
import AutorClient from "./AutorClient";
import { getPublicAuthor } from '../../src/server/public-ai/contentService';

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
  const author = await getPublicAuthor('cs');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: author.title,
    url: author.canonicalUrl,
    dateModified: author.updatedAt,
    mainEntity: {
      '@type': 'Person',
      name: 'Tomáš Valíček',
      alternateName: 'WalliCzech',
      url: author.canonicalUrl,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AutorClient initialHtml={author.html} />
    </>
  );
}
