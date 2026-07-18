/** @jest-environment node */

import fs from 'node:fs';
import path from 'node:path';
import { headers } from 'next/headers';
import sitemap from './sitemap';
import { generateMetadata as homeMetadata } from './page';
import { generateMetadata as booksMetadata } from './books/page';
import { generateMetadata as archiveMetadata } from './archive/page';
import { generateMetadata as authorMetadata } from './autor/page';
import { generateMetadata as cyklusMetadata } from './cyklus/page';

jest.mock('next/headers', () => ({ headers: jest.fn() }));
jest.mock('../src/components/library/SynthomaLibrary', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/components/archive/SynthomaArchive', () => ({ __esModule: true, default: () => null }));
jest.mock('../src/components/cyklus/CyklusClient', () => ({ __esModule: true, default: () => null }));
jest.mock('./autor/AutorClient', () => ({ __esModule: true, default: () => null }));

const mockedHeaders = headers as jest.MockedFunction<typeof headers>;
const metadataFactories = [homeMetadata, booksMetadata, archiveMetadata, authorMetadata, cyklusMetadata];

describe('public discovery contracts', () => {
  beforeEach(() => {
    mockedHeaders.mockResolvedValue(new Headers({ 'x-synthoma-locale': 'cs' }) as never);
  });

  it('gives every main public entry unique crawlable social metadata', async () => {
    const entries = await Promise.all(metadataFactories.map((factory) => factory()));
    expect(new Set(entries.map((entry) => entry.title)).size).toBe(entries.length);
    expect(new Set(entries.map((entry) => entry.description)).size).toBe(entries.length);
    for (const entry of entries) {
      expect(entry.alternates?.canonical).toMatch(/^https:\/\/www\.synthoma\.cz/);
      expect(entry.alternates?.languages).toMatchObject({ cs: expect.any(String), en: expect.any(String), 'x-default': expect.any(String) });
      expect(entry.openGraph).toMatchObject({ title: entry.title, description: entry.description, locale: 'cs_CZ' });
      expect(entry.twitter).toMatchObject({ card: 'summary_large_image', title: entry.title });
    }
  });

  it('localizes the homepage descriptor, canonical and social locale', async () => {
    mockedHeaders.mockResolvedValue(new Headers({ 'x-synthoma-locale': 'en' }) as never);
    const entry = await homeMetadata();
    expect(entry.description).toBe('SYNTHOMA is an interactive psychological novel, a diagnostic card game, and a living archive inside a broken therapeutic system.');
    expect(entry.alternates?.canonical).toBe('https://www.synthoma.cz/?locale=en');
    expect(entry.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('keeps every public human entry in the sitemap with a stable content date', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toEqual(expect.arrayContaining([
      'https://www.synthoma.cz',
      'https://www.synthoma.cz/books',
      'https://www.synthoma.cz/archive',
      'https://www.synthoma.cz/autor',
      'https://www.synthoma.cz/cyklus',
      'https://www.synthoma.cz/chapter/0-inf-restart',
    ]));
    expect(entries.every((entry) => entry.lastModified instanceof Date && entry.lastModified.toISOString() === '2026-07-18T00:00:00.000Z')).toBe(true);
  });

  it('keeps public content ordered while Cyklus remains a dedicated game route', () => {
    const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const shell = read('src/components/synthoma-os/SynthomaShell.tsx');
    const cycle = read('app/cyklus/page.tsx');
    const archive = read('app/archive/page.tsx');
    const books = read('app/books/page.tsx');
    expect(shell.indexOf('<div className="synthoma-shell__content">')).toBeLessThan(shell.indexOf('<SynthomaCommandHeader />'));
    expect(cycle).toContain('<main id="cyklus-game" className="cyklus-page cyklus-game-shell"');
    expect(cycle).not.toContain('cyklus-public-intro');
    expect(cycle).not.toContain('cyklus-ai-discovery');
    expect(archive.indexOf('archive-public-content')).toBeLessThan(archive.indexOf('<SynthomaArchive'));
    expect(books.indexOf('<noscript>')).toBeLessThan(books.indexOf('<SynthomaLibrary'));
  });

  it('keeps real Author content server-loaded instead of a loading placeholder', () => {
    const page = fs.readFileSync(path.join(process.cwd(), 'app/autor/page.tsx'), 'utf8');
    const englishAuthor = fs.readFileSync(path.join(process.cwd(), 'public/data/SYNTHOMAAUTOR_en.html'), 'utf8');
    expect(page).toContain('await getPublicAuthor(locale)');
    expect(page).toContain('initialHtml={author.html}');
    expect(page).not.toMatch(/Loading|Načítám/);
    expect(englishAuthor).toContain('WalliCzech');
    expect(englishAuthor).toContain('SYNTHOMA was not born as a planned product');
  });
});
