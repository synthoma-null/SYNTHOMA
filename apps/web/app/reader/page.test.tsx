import { permanentRedirect } from 'next/navigation';
import LegacyReaderPage from './page';

jest.mock('next/navigation', () => ({
  permanentRedirect: jest.fn((target: string) => { throw new Error(`NEXT_REDIRECT:${target}`); }),
}));

describe('/reader legacy redirect', () => {
  beforeEach(() => jest.clearAllMocks());

  it('permanently redirects canonical IDs and legacy filenames', async () => {
    await expect(LegacyReaderPage({ searchParams: Promise.resolve({ chapter: '0-0-null' }) }))
      .rejects.toThrow('NEXT_REDIRECT:/chapter/0-0-null');
    await expect(LegacyReaderPage({ searchParams: Promise.resolve({ u: '/books/SYNTHOMA-NULL/0-1%20%5BSTART%5D.html' }) }))
      .rejects.toThrow('NEXT_REDIRECT:/chapter/0-1-start');
    expect(permanentRedirect).toHaveBeenCalledTimes(2);
  });

  it('does not turn an unknown path into an open redirect', async () => {
    await expect(LegacyReaderPage({ searchParams: Promise.resolve({ u: 'https://example.com/private' }) }))
      .rejects.toThrow('NEXT_REDIRECT:/books');
  });
});
