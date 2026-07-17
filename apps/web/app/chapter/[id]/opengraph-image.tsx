import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { getChapterCatalogEntry } from '../../../src/content/catalog';
import { getChapterPresentation } from '../../../src/content/chapterPresentation';

export const alt = 'Kapitola SYNTHOMA-NULL';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BASE_URL = 'https://www.synthoma.cz';

export default async function ChapterOpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = getChapterCatalogEntry(id);
  if (!chapter) notFound();
  const presentation = getChapterPresentation(chapter.id);
  const poster = `${BASE_URL}${presentation?.poster ?? '/books/SYNTHOMA-NULL/SYNTHOMA_cover.png'}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%', height: '100%', display: 'flex', position: 'relative',
        alignItems: 'flex-end', padding: '62px 68px', overflow: 'hidden',
        color: '#f4f5ff', backgroundColor: '#050507',
        backgroundImage: `linear-gradient(90deg, rgba(5,5,7,.96) 0%, rgba(5,5,7,.78) 52%, rgba(5,5,7,.34) 100%), url(${poster})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '850px' }}>
        <div style={{ display: 'flex', color: '#50f2e7', fontSize: 24, letterSpacing: '0.12em' }}>
          SYNTHOMA // MEMORY TRACE {String((chapter.order ?? 0) + 1).padStart(2, '0')}
        </div>
        <div style={{ display: 'flex', fontSize: 66, lineHeight: 1.05, fontWeight: 700 }}>
          {chapter.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: 27, color: '#c8cadb' }}>
          <span>SYNTHOMA-NULL</span><span style={{ color: '#ff4fd8' }}>{'//'}</span><span>INTERAKTIVNÍ ROMÁN</span>
        </div>
      </div>
    </div>,
    size,
  );
}
