'use client';

import ContentPurchaseDialog from './access/ContentPurchaseDialog';

interface Props {
  chapterId: string;
  chapterTitle: string;
  mnemCost: number;
  onClose: () => void;
  onPurchased?: () => void;
}

export default function PaywallModal({ chapterId, chapterTitle, onClose, onPurchased }: Props) {
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
