/** @jest-environment node */
import { getPublicBooks, getPublicChapters } from '../contentService';
import { getManagedContentCatalog, mergeManagedContent } from '../../content/managedContent';
jest.mock('../../content/managedContent', () => ({ ...jest.requireActual('../../content/managedContent'), getManagedContentCatalog: jest.fn() }));
beforeEach(() => { jest.clearAllMocks(); (getManagedContentCatalog as jest.Mock).mockResolvedValue(mergeManagedContent({ books: [], chapters: [] })); });
it('loads one catalog snapshot for all chapter documents', async () => {
  const chapters = await getPublicChapters('cs');
  expect(chapters.length).toBeGreaterThan(20);
  expect(getManagedContentCatalog).toHaveBeenCalledTimes(1);
});
it('shares one snapshot across the complete book index', async () => {
  expect((await getPublicBooks('cs')).length).toBeGreaterThan(1);
  expect(getManagedContentCatalog).toHaveBeenCalledTimes(1);
});
