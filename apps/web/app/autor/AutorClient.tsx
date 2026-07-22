"use client";

import Link from 'next/link';
import { useBackgroundMotionAllowed } from '../../src/hooks/useBackgroundMotionAllowed';
import { useVideoVisibility } from '../../src/lib/useVideoVisibility';
import ReaderCommandUtilities from '../../src/components/reader/ReaderCommandUtilities';
import ReaderDialogController from '../../src/components/reader/ReaderDialogController';

export default function AutorClient({ initialHtml, locale }: { initialHtml: string; locale: 'cs' | 'en' }) {
  const videoRef = useVideoVisibility();
  const motionAllowed = useBackgroundMotionAllowed();
  const copy = locale === 'en'
    ? { node: 'NODE', library: 'LIBRARY', identity: 'AUTHOR', title: 'Author and origin of SYNTHOMA' }
    : { node: 'UZEL', library: 'KNIHOVNA', identity: 'AUTOR', title: 'Autor a vznik SYNTHOMY' };

  return (
    <main className="chapter-reader author-reader" id="main-content" data-content-kind="author">
      <div aria-hidden className="video-background">
        {motionAllowed ? <video
          ref={videoRef}
          src="/video/SYNTHOMA12.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="active"
        /> : null}
      </div>

      <header className="chapter-reader__command-bar author-reader__command-bar">
        <div className="chapter-reader__route-commands">
          <Link className="chapter-reader__command" href={locale === 'en' ? '/?locale=en' : '/'}>{copy.node}</Link>
          <Link className="chapter-reader__command" href={locale === 'en' ? '/books?locale=en' : '/books'}>{copy.library}</Link>
        </div>
        <span className="chapter-reader__identity" aria-current="page">
          <span className="chapter-reader__sequence">{copy.identity}</span>
          <span>{copy.title}</span>
        </span>
        <div className="chapter-reader__command-end">
          <ReaderCommandUtilities articleId="author-reader-article" locale={locale} />
        </div>
      </header>

      <article
        className="chapter-reader__article SYNTHOMAREADER author-reader__article"
        id="author-reader-article"
        aria-label={locale === 'en' ? 'About the author' : 'O autorovi'}
        lang={locale}
        tabIndex={-1}
      >
        <div
          className="chapter-content autor-semantic-content"
          id="author-reader-content"
          dangerouslySetInnerHTML={{ __html: initialHtml }}
        />
      </article>
      <ReaderDialogController rootId="author-reader-content" />

      <p className="chapter-reader__machine-links">
        <a href={`/ai/${locale}/author.md`}>MARKDOWN</a>
        {' // '}
        <a href={`/api/public/v1/author?locale=${locale}`}>JSON</a>
      </p>
    </main>
  );
}
