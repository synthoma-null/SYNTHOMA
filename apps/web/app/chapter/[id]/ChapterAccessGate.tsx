'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ContentAccess } from '../../../src/content/catalog';
import ContentPurchaseDialog from '../../../src/components/access/ContentPurchaseDialog';

interface Props {
  chapterId: string;
  chapterTitle: string;
  access: ContentAccess;
  unavailable: boolean;
  locale?: 'cs' | 'en';
  databaseErrorRef?: string;
}

export default function ChapterAccessGate({ chapterId, chapterTitle, access, unavailable, locale = 'cs', databaseErrorRef }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const en = locale === 'en';
  return (
    <main className="story chapter-access-gate" id="main-content">
      <section className="panel glass os-surface">
        <p className="os-status__code">LOG [{databaseErrorRef ? 'CHAPTER_ACCESS' : unavailable ? 'CONTENT_UNAVAILABLE' : 'ACCESS_REQUIRED'}]</p>
        <h1>{chapterTitle}</h1>
        <p>
          {databaseErrorRef
            ? en ? 'Chapter access could not be verified. The content remains safely locked until the database returns.' : 'Přístup ke kapitole se teď nepodařilo ověřit. Obsah zůstává bezpečně uzamčený, dokud se databáze znovu nepřihlásí k vlastní práci.'
            : unavailable
            ? en ? 'The fragment is registered but has not been published yet.' : 'Fragment je evidovaný, ale ještě nebyl publikován.'
            : en ? 'The fragment exists. Its access imprint is still missing.' : 'Fragment existuje. Přístupový otisk zatím chybí.'}
        </p>
        {databaseErrorRef ? (
          <>
            <p className="os-status__reference">REF {databaseErrorRef}</p>
            <button className="btn" type="button" onClick={() => router.refresh()}>{en ? 'TRY AGAIN' : 'ZKUSIT ZNOVU'}</button>
          </>
        ) : !unavailable && access.canPurchase ? (
          <button className="btn" type="button" onClick={() => setOpen(true)}>
            {en ? 'UNLOCK FOR' : 'ODEMKNOUT ZA'} {access.mnemCost} MNEM
          </button>
        ) : null}
        <a className="btn btn-outline" href={en ? '/books?locale=en' : '/books'}>{en ? 'BACK TO LIBRARY' : 'ZPĚT DO KNIHOVNY'}</a>
      </section>
      {open && !databaseErrorRef ? (
        <ContentPurchaseDialog
          contentType="chapter"
          contentId={chapterId}
          title={chapterTitle}
          onClose={() => setOpen(false)}
          onPurchased={() => {
            setOpen(false);
            router.replace(`/chapter/${encodeURIComponent(chapterId)}${en ? '?locale=en' : ''}`);
            router.refresh();
          }}
        />
      ) : null}
    </main>
  );
}
