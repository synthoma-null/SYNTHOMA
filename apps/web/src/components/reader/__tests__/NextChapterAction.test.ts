import type { ContentAccess } from '../../../content/catalog';
import { resolveNextChapterAction } from '../nextChapterActionModel';

const lockedAccess: ContentAccess = {
  contentType: 'chapter',
  contentId: '0-4-defragmentation',
  state: 'locked',
  reason: 'purchase_required',
  canAccess: false,
  canPurchase: true,
  mnemCost: 64,
  title: '0-4 [DEFRAGMENTATION]',
  purchasePackageIds: ['act-1'],
  prerequisiteChapterId: null,
};

describe('NextChapterAction', () => {
  it('offers purchase instead of 404 when the next chapter exists but is locked', () => {
    expect(resolveNextChapterAction(
      { id: lockedAccess.contentId, title: lockedAccess.title },
      lockedAccess,
    )).toBe('purchase');
  });

  it('does not offer any action when there is no next chapter', () => {
    expect(resolveNextChapterAction(null, lockedAccess)).toBe('none');
  });
});
