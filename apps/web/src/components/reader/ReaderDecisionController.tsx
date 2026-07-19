'use client';

import { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChoiceTracking } from '../../hooks/useChoiceTracking';
import { bindReaderDecisions, type ReaderDecisionLocale } from '../../lib/readerDecisionController';

interface Props {
  rootId: string;
  chapterId: string;
  collection: string;
  locale: ReaderDecisionLocale;
}

export default function ReaderDecisionController({ rootId, chapterId, collection, locale }: Props) {
  const router = useRouter();
  const { scoreFromNode } = useChoiceTracking(chapterId, collection);

  useLayoutEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    try {
      return bindReaderDecisions({
        root,
        chapterId,
        locale,
        onCommitted: (option) => scoreFromNode(option),
        onNavigate: (href) => {
          if (href.startsWith('#')) {
            document.querySelector(href)?.scrollIntoView({ behavior: 'auto', block: 'start' });
            return;
          }
          if (href.startsWith('/')) {
            router.push(href);
            return;
          }
          window.location.assign(href);
        },
      });
    } catch (error) {
      console.error('[ReaderDecisionController]', error);
      root.dataset.readerDecisions = 'error';
      root.classList.remove('reader-decisions-pending');
      root.removeAttribute('inert');
      root.setAttribute('aria-busy', 'false');
      root.querySelectorAll<HTMLElement>('.choice-link').forEach((option) => {
        option.setAttribute('aria-disabled', 'true');
        option.removeAttribute('href');
      });
    }
  }, [chapterId, locale, rootId, router, scoreFromNode]);

  return null;
}
