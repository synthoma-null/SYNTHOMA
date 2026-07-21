import type { Lang } from '../../i18n';

const CATEGORY_LABELS: Record<string, Record<Lang, string>> = {
  zaklad: { cs: 'JÁDRO SVĚTA', en: 'WORLD CORE' },
  'základ': { cs: 'JÁDRO SVĚTA', en: 'WORLD CORE' },
  postavy: { cs: 'ENTITY', en: 'ENTITIES' },
  lokace: { cs: 'MÍSTA A SEKTORY', en: 'PLACES AND SECTORS' },
  mechaniky: { cs: 'MECHANIKY', en: 'MECHANICS' },
  fragmenty: { cs: 'IDENTITA A FRAGMENTY', en: 'IDENTITY AND FRAGMENTS' },
  tajemstvi: { cs: 'TAJEMSTVÍ', en: 'SECRETS' },
  design: { cs: 'AUTORSKÁ BIBLE', en: 'AUTHOR BIBLE' },
  'systemy-protokoly': { cs: 'SYSTÉMY A PROTOKOLY', en: 'SYSTEMS AND PROTOCOLS' },
  mista: { cs: 'MÍSTA', en: 'PLACES' },
  udalosti: { cs: 'UDÁLOSTI', en: 'EVENTS' },
  koncepty: { cs: 'KONCEPTY', en: 'CONCEPTS' },
};

export function getArchiveCategoryLabel(category: string, lang: Lang): string {
  return CATEGORY_LABELS[category.toLocaleLowerCase()]?.[lang] ?? category.toLocaleUpperCase();
}
