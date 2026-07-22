import { permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';
import { resolveChapterId } from '../../src/content/catalog';
import { isReaderInfoPath } from '../../src/content/readerInfo';

export default async function LegacyReaderPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string; u?: string; locale?: string }>;
}) {
  const query = await searchParams;
  const reference = query.chapter ?? query.u;
  if (isReaderInfoPath(reference)) {
    const { default: ReaderContent } = await import('./ReaderContent');
    return (
      <Suspense fallback={null}>
        <ReaderContent />
      </Suspense>
    );
  }
  const chapterId = reference ? resolveChapterId(reference) : undefined;

  if (!chapterId) permanentRedirect('/books');
  const locale = query.locale === 'en' ? '?locale=en' : '';
  permanentRedirect(`/chapter/${encodeURIComponent(chapterId)}${locale}`);
}
