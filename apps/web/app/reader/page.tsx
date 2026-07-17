import { permanentRedirect } from 'next/navigation';
import { resolveChapterId } from '../../src/content/catalog';

export default async function LegacyReaderPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string; u?: string; locale?: string }>;
}) {
  const query = await searchParams;
  const reference = query.chapter ?? query.u;
  const chapterId = reference ? resolveChapterId(reference) : undefined;

  if (!chapterId) permanentRedirect('/books');
  const locale = query.locale === 'en' ? '?locale=en' : '';
  permanentRedirect(`/chapter/${encodeURIComponent(chapterId)}${locale}`);
}
