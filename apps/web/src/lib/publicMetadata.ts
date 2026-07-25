import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PUBLIC_SITE_URL, type PublicLocale } from '../server/public-ai/config';
import { SYNTHOMA_ASSETS } from './brandAssets';

export const SYNTHOMA_DESCRIPTOR = {
  cs: 'SYNTHOMA je interaktivní psychologický román, diagnostická karetní hra a živý archiv uvnitř rozbitého terapeutického systému.',
  en: 'SYNTHOMA is an interactive psychological novel, a diagnostic card game, and a living archive inside a broken therapeutic system.',
} as const;

export function localeFromRequestHeaders(requestHeaders: Headers): PublicLocale {
  return requestHeaders.get('x-synthoma-locale') === 'en' ? 'en' : 'cs';
}

export async function requestLocale(): Promise<PublicLocale> {
  try {
    return localeFromRequestHeaders(await headers());
  } catch {
    return 'cs';
  }
}

function localizedUrl(path: string, locale: PublicLocale): string {
  const url = new URL(path, PUBLIC_SITE_URL);
  if (locale === 'en') url.searchParams.set('locale', 'en');
  return url.toString();
}

export function buildPublicMetadata(input: {
  locale: PublicLocale;
  path: string;
  title: string;
  description: string;
  imageAlt: string;
}): Metadata {
  const canonical = localizedUrl(input.path, input.locale);
  const czech = localizedUrl(input.path, 'cs');
  const english = localizedUrl(input.path, 'en');
  const image = `${PUBLIC_SITE_URL}${SYNTHOMA_ASSETS.openGraph}`;
  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
      languages: { cs: czech, en: english, 'x-default': czech },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'SYNTHOMA',
      title: input.title,
      description: input.description,
      locale: input.locale === 'en' ? 'en_US' : 'cs_CZ',
      alternateLocale: input.locale === 'en' ? ['cs_CZ'] : ['en_US'],
      images: [{ url: image, width: 1200, height: 630, alt: input.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
