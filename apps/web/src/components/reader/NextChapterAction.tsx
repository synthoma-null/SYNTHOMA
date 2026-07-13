'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ContentAccess } from '../../content/catalog';
import ContentPurchaseDialog from '../access/ContentPurchaseDialog';
import { resolveNextChapterAction, type NextChapter } from './nextChapterActionModel';

interface Props {
  nextChapter: NextChapter | null;
  access: ContentAccess | undefined;
  onPurchased?: (chapter: NextChapter) => void;
}

export { resolveNextChapterAction } from './nextChapterActionModel';

export default function NextChapterAction({ nextChapter, access, onPurchased }: Props) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const action = resolveNextChapterAction(nextChapter, access);
  if (!nextChapter || action === 'none') return null;

  return (
    <nav className="reader-next-action" aria-label="Další kapitola">
      <span>DALŠÍ PAMĚŤ</span>
      <strong>{nextChapter.title}</strong>
      {action === 'continue' ? (
        <Link className="btn" href={nextChapter.route ?? `/chapter/${encodeURIComponent(nextChapter.id)}`}>
          POKRAČOVAT
        </Link>
      ) : action === 'purchase' ? (
        <button className="btn" type="button" onClick={() => setPurchaseOpen(true)}>
          ODEMKNOUT ZA {access?.mnemCost} MNEM
        </button>
      ) : action === 'loading' ? (
        <span>OVĚŘUJI PŘÍSTUP…</span>
      ) : (
        <span>NEDOSTUPNÉ</span>
      )}
      {purchaseOpen ? (
        <ContentPurchaseDialog
          contentType="chapter"
          contentId={nextChapter.id}
          title={nextChapter.title}
          onClose={() => setPurchaseOpen(false)}
          onPurchased={() => {
            setPurchaseOpen(false);
            onPurchased?.(nextChapter);
          }}
        />
      ) : null}
    </nav>
  );
}
