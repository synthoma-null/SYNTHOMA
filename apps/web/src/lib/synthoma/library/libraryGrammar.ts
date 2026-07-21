export function formatCollectionCount(count: number, locale: 'cs' | 'en'): string {
  if (locale === 'en') return `${count} ${count === 1 ? 'collection' : 'collections'}`;
  if (count === 1) return '1 sbírka';
  if (count >= 2 && count <= 4) return `${count} sbírky`;
  return `${count} sbírek`;
}
