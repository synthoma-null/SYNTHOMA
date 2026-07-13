'use client';

import ContentPurchaseDialog from '../../src/components/access/ContentPurchaseDialog';

interface Props {
  chapterId: string;
  chapterTitle: string;
  onClose: () => void;
  onPurchased?: () => void;
}

export default function ChapterLockModal({ chapterId, chapterTitle, onClose, onPurchased }: Props) {
  return (
    <ContentPurchaseDialog
      contentType="chapter"
      contentId={chapterId}
      title={chapterTitle}
      onClose={onClose}
      {...(onPurchased ? { onPurchased } : {})}
    />
  );
}
