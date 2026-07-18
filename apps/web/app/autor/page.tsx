import type { Metadata } from "next";
import AutorClient from "./AutorClient";
import { getPublicAuthor } from '../../src/server/public-ai/contentService';
import { buildPublicMetadata, requestLocale } from '../../src/lib/publicMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return buildPublicMetadata({
    locale,
    path: '/autor',
    title: locale === 'en' ? 'Author and origin | SYNTHOMA' : 'Autor a vznik projektu | SYNTHOMA',
    description: locale === 'en' ? 'Meet Tomáš Valíček (WalliCzech) and the reason SYNTHOMA connects story, music, code and a diagnostic game.' : 'Poznej Tomáše Valíčka (WalliCzech) a důvod, proč SYNTHOMA propojuje příběh, hudbu, kód a diagnostickou hru.',
    imageAlt: locale === 'en' ? 'Author and origin of SYNTHOMA' : 'Autor a vznik projektu SYNTHOMA',
  });
}

export default async function AutorPage() {
  const locale = await requestLocale();
  const author = await getPublicAuthor(locale);
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
      <AutorClient initialHtml={author.html} locale={locale} />
    </>
  );
}
