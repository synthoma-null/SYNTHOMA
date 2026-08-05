import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AdminContentTab from './AdminContentTab';
import type { AdminContentChapterDetail, AdminContentSnapshot } from './types';

const chapter = {
  id: '0-1-start',
  title: '[START]',
  titleEn: '[START]',
  ordinal: '0-1',
  summary: 'Začátek diagnostiky.',
  sortOrder: 2,
  visibility: 'published' as const,
  accessPolicy: 'free' as const,
  effectiveAccessPolicy: 'free' as const,
  mnemCost: null,
  isCustom: false,
  overridden: false,
  hasBodyOverride: false,
  updatedAt: null,
};

const snapshot: AdminContentSnapshot = {
  books: [{
    id: 'synthoma-null',
    slug: 'synthoma-null',
    title: 'SYNTHOMA-NULL',
    shortTitle: 'SYNTHOMA-NULL',
    description: 'Interaktivní kniha.',
    cover: null,
    language: 'cs',
    sortOrder: 1,
    status: 'ongoing',
    visibility: 'published',
    accessPolicy: 'free',
    isCustom: false,
    overridden: false,
    updatedAt: null,
    chapters: [chapter],
  }],
};

const detail: AdminContentChapterDetail = {
  ...chapter,
  bookId: 'synthoma-null',
  bodyHtml: '<p class="text">Původní text.</p>',
  bodyHtmlEn: '',
};

function ok(payload: unknown) {
  return Promise.resolve({ ok: true, json: async () => payload });
}

describe('AdminContentTab chapter studio', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => ok(snapshot))
      .mockImplementationOnce(() => ok(detail))
      .mockImplementationOnce(() => ok(snapshot));
  });

  it('opens editing immediately in a dialog, inserts a SYNTHOMA effect, previews it and saves the chapter', async () => {
    const onChanged = jest.fn();
    render(<AdminContentTab onChanged={onChanged} />);

    fireEvent.click(await screen.findByRole('button', { name: 'EDITOVAT' }));

    const studio = await screen.findByRole('dialog', { name: 'Editor kapitoly' });
    await waitFor(() => expect(studio).toHaveAttribute('aria-busy', 'false'));
    expect(within(studio).getByRole('heading', { name: 'Knihovna efektů' })).toBeInTheDocument();
    expect(within(studio).getByRole('region', { name: 'ŽIVÝ NÁHLED' })).toBeInTheDocument();
    expect(within(studio).getByText('Původní text.')).toBeInTheDocument();

    fireEvent.click(within(studio).getByRole('button', { name: /^DATOVÝ PROUD:/ }));
    const editor = within(studio).getByRole('textbox', { name: 'HTML kapitoly česky' });
    expect((editor as HTMLTextAreaElement).value).toContain('<span class="datastream">data proudí</span>');
    expect(within(studio).getByText('data proudí')).toHaveClass('datastream');

    fireEvent.click(within(studio).getByRole('button', { name: 'ULOŽIT KAPITOLU' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Editor kapitoly' })).not.toBeInTheDocument());

    const saveCall = (global.fetch as jest.Mock).mock.calls[2];
    expect(saveCall[0]).toBe('/api/admin/content');
    expect(saveCall[1]).toMatchObject({ method: 'PATCH' });
    const payload = JSON.parse(saveCall[1].body as string);
    expect(payload.bodyHtml).toContain('<span class="datastream">data proudí</span>');
    expect(payload).not.toHaveProperty('isCustom');
    expect(onChanged).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Kapitola byla uložena.');
  });

  it('shows the editor immediately while the chapter body is still loading', async () => {
    let resolveDetail!: (value: Awaited<ReturnType<typeof ok>>) => void;
    const pendingDetail = new Promise<Awaited<ReturnType<typeof ok>>>((resolve) => {
      resolveDetail = resolve;
    });
    global.fetch = jest.fn()
      .mockImplementationOnce(() => ok(snapshot))
      .mockImplementationOnce(() => pendingDetail);

    render(<AdminContentTab onChanged={jest.fn()} />);
    fireEvent.click(await screen.findByRole('button', { name: 'EDITOVAT' }));

    const studio = await screen.findByRole('dialog', { name: 'Editor kapitoly' });
    expect(studio).toHaveAttribute('aria-busy', 'true');
    expect(within(studio).getByRole('status')).toHaveTextContent('Načítám text kapitoly');
    expect(within(studio).getByRole('button', { name: 'ULOŽIT KAPITOLU' })).toBeDisabled();

    resolveDetail(await ok(detail));
    await waitFor(() => expect(studio).toHaveAttribute('aria-busy', 'false'));
    expect(within(studio).getByText('Původní text.')).toBeInTheDocument();
  });

  it('keeps the English body optional and previews the selected language', async () => {
    render(<AdminContentTab onChanged={jest.fn()} />);
    fireEvent.click(await screen.findByRole('button', { name: 'EDITOVAT' }));

    const studio = await screen.findByRole('dialog', { name: 'Editor kapitoly' });
    await waitFor(() => expect(studio).toHaveAttribute('aria-busy', 'false'));
    fireEvent.click(within(studio).getByRole('tab', { name: /ENGLISH/ }));

    expect(within(studio).getByRole('textbox', { name: 'HTML kapitoly anglicky' })).not.toBeRequired();
    expect(within(studio).getByText('Anglická verze zatím nemá obsah.')).toBeInTheDocument();
  });
});
