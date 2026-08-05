'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AdminContentAccess,
  AdminContentBook,
  AdminContentChapter,
  AdminContentChapterDetail,
  AdminContentSnapshot,
  AdminContentVisibility,
} from './types';
import { errorMessage, readAdminResponse } from './utils';

type BookDraft = {
  id: string; title: string; shortTitle: string; description: string; cover: string;
  sortOrder: number; status: 'complete' | 'ongoing'; visibility: AdminContentVisibility;
  accessPolicy: AdminContentAccess;
};
type ChapterDraft = {
  id: string; bookId: string; title: string; titleEn: string; ordinal: string; summary: string;
  sortOrder: number; visibility: AdminContentVisibility; accessPolicy: AdminContentAccess;
  mnemCost: number; bodyHtml: string; bodyHtmlEn: string; isCustom: boolean;
};

const chapterTemplate = '<section class="story-block">\n  <p>Text nové kapitoly…</p>\n</section>';

function draftFromBook(book: AdminContentBook): BookDraft {
  return {
    id: book.id, title: book.title, shortTitle: book.shortTitle, description: book.description,
    cover: book.cover ?? '', sortOrder: book.sortOrder, status: book.status,
    visibility: book.visibility, accessPolicy: book.accessPolicy,
  };
}

function draftFromChapter(detail: AdminContentChapterDetail): ChapterDraft {
  return {
    id: detail.id, bookId: detail.bookId, title: detail.title, titleEn: detail.titleEn ?? '',
    ordinal: detail.ordinal, summary: detail.summary, sortOrder: detail.sortOrder,
    visibility: detail.visibility, accessPolicy: detail.accessPolicy,
    mnemCost: detail.mnemCost ?? 64, bodyHtml: detail.bodyHtml, bodyHtmlEn: detail.bodyHtmlEn,
    isCustom: detail.isCustom,
  };
}

function accessLabel(policy: 'free' | 'entitlement') {
  return policy === 'free' ? 'VOLNĚ' : 'ZAMČENO';
}

export default function AdminContentTab({ onChanged }: { onChanged: () => void }) {
  const [snapshot, setSnapshot] = useState<AdminContentSnapshot>({ books: [] });
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [bookDraft, setBookDraft] = useState<BookDraft | null>(null);
  const [creatingBook, setCreatingBook] = useState(false);
  const [chapterDraft, setChapterDraft] = useState<ChapterDraft | null>(null);
  const [creatingChapter, setCreatingChapter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedBook = useMemo(
    () => snapshot.books.find((book) => book.id === selectedBookId) ?? null,
    [selectedBookId, snapshot.books],
  );

  const applySnapshot = useCallback((next: AdminContentSnapshot, preferredBookId?: string) => {
    setSnapshot(next);
    const nextId = preferredBookId ?? selectedBookId ?? next.books[0]?.id ?? null;
    setSelectedBookId(next.books.some((book) => book.id === nextId) ? nextId : next.books[0]?.id ?? null);
    const book = next.books.find((item) => item.id === nextId) ?? next.books[0];
    if (book) setBookDraft(draftFromBook(book));
  }, [selectedBookId]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally { setLoading(false); }
  }, [applySnapshot]);

  useEffect(() => { void load(); }, [load]);

  function selectBook(book: AdminContentBook) {
    setSelectedBookId(book.id); setBookDraft(draftFromBook(book)); setCreatingBook(false);
    setChapterDraft(null); setCreatingChapter(false); setFeedback(null); setError(null);
  }

  function startBook() {
    setCreatingBook(true); setSelectedBookId(null); setChapterDraft(null); setCreatingChapter(false);
    setBookDraft({ id: '', title: '', shortTitle: '', description: '', cover: '', sortOrder: snapshot.books.length + 10, status: 'ongoing', visibility: 'published', accessPolicy: 'free' });
  }

  async function saveBook(event: FormEvent) {
    event.preventDefault();
    if (!bookDraft) return;
    setSaving(true); setError(null); setFeedback(null);
    try {
      const response = await fetch('/api/admin/content', {
        method: creatingBook ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'book', ...bookDraft, language: 'cs' }),
      });
      const next = await readAdminResponse<AdminContentSnapshot>(response);
      applySnapshot(next, bookDraft.id); setCreatingBook(false); setFeedback('Kniha byla uložena.'); onChanged();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(false); }
  }

  async function patchBook(patch: Partial<BookDraft>, message: string) {
    if (!selectedBook) return;
    setSaving(true); setError(null); setFeedback(null);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'book', id: selectedBook.id, ...patch }),
      });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response), selectedBook.id);
      setFeedback(message); onChanged();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(false); }
  }

  async function editChapter(chapter: AdminContentChapter) {
    setSaving(true); setError(null); setFeedback(null);
    try {
      const response = await fetch(`/api/admin/content?chapterId=${encodeURIComponent(chapter.id)}`, { cache: 'no-store' });
      setChapterDraft(draftFromChapter(await readAdminResponse<AdminContentChapterDetail>(response)));
      setCreatingChapter(false);
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(false); }
  }

  function startChapter() {
    if (!selectedBook) return;
    setCreatingChapter(true); setFeedback(null); setError(null);
    setChapterDraft({
      id: '', bookId: selectedBook.id, title: '', titleEn: '', ordinal: '', summary: '',
      sortOrder: selectedBook.chapters.length, visibility: 'published', accessPolicy: 'free',
      mnemCost: 64, bodyHtml: chapterTemplate, bodyHtmlEn: '', isCustom: true,
    });
  }

  async function saveChapter(event: FormEvent) {
    event.preventDefault();
    if (!chapterDraft) return;
    setSaving(true); setError(null); setFeedback(null);
    const payload = {
      entity: 'chapter', ...chapterDraft,
      bodyHtmlEn: chapterDraft.bodyHtmlEn.trim() || undefined,
      mnemCost: chapterDraft.accessPolicy === 'entitlement' ? chapterDraft.mnemCost : null,
    };
    try {
      const response = await fetch('/api/admin/content', {
        method: creatingChapter ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response), chapterDraft.bookId);
      setChapterDraft(null); setCreatingChapter(false); setFeedback('Kapitola byla uložena.'); onChanged();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(false); }
  }

  async function patchChapter(chapter: AdminContentChapter, patch: Record<string, unknown>, message: string) {
    setSaving(true); setError(null); setFeedback(null);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'chapter', id: chapter.id, ...patch }),
      });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response), selectedBook?.id);
      setFeedback(message); onChanged();
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="admin-state" role="status">Načítám katalog knih…</div>;

  return (
    <section className="admin-workspace admin-content-manager" aria-labelledby="admin-content-title">
      <div className="admin-section-header">
        <div><span className="admin-eyebrow">LIBRARY // CONTENT</span><h2 id="admin-content-title">Knihy a kapitoly</h2><p>Viditelnost, přístup a text kapitol se mění přímo v databázi. Původní soubory zůstávají jako bezpečný základ.</p></div>
        <div className="admin-button-row"><button className="admin-action admin-action--secondary" type="button" onClick={() => void load()} disabled={saving}>OBNOVIT</button><button className="admin-action" type="button" onClick={startBook}>PŘIDAT KNIHU</button></div>
      </div>
      {error ? <p className="admin-feedback admin-feedback--error" role="alert">{error}</p> : null}
      {feedback ? <p className="admin-feedback admin-feedback--ok" role="status">{feedback}</p> : null}

      <div className="admin-library-layout">
        <aside className="admin-book-list" aria-label="Knihy">
          {snapshot.books.map((book) => (
            <button key={book.id} type="button" className={selectedBookId === book.id ? 'is-active' : undefined} onClick={() => selectBook(book)}>
              <span><strong>{book.shortTitle || book.title}</strong><small>{book.chapters.length} kapitol</small></span>
              <span className={`admin-content-status admin-content-status--${book.visibility}`}>{book.visibility === 'published' ? 'VIDITELNÁ' : 'SKRYTÁ'}</span>
            </button>
          ))}
        </aside>

        <div className="admin-library-editor">
          {bookDraft ? (
            <form className="admin-content-form" onSubmit={saveBook}>
              <div className="admin-content-form__heading"><div><span className="admin-eyebrow">{creatingBook ? 'NEW BOOK' : bookDraft.id}</span><h3>{creatingBook ? 'Nová kniha' : 'Nastavení knihy'}</h3></div>{!creatingBook && selectedBook ? <span className="admin-role">{selectedBook.isCustom ? 'DATABÁZOVÁ' : selectedBook.overridden ? 'UPRAVENÁ' : 'VÝCHOZÍ'}</span> : null}</div>
              <div className="admin-content-fields">
                <label>ID knihy<input value={bookDraft.id} disabled={!creatingBook} onChange={(e) => setBookDraft({ ...bookDraft, id: e.target.value.toLowerCase() })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
                <label>Název<input value={bookDraft.title} onChange={(e) => setBookDraft({ ...bookDraft, title: e.target.value })} required /></label>
                <label>Krátký název<input value={bookDraft.shortTitle} onChange={(e) => setBookDraft({ ...bookDraft, shortTitle: e.target.value })} /></label>
                <label>Pořadí<input type="number" value={bookDraft.sortOrder} onChange={(e) => setBookDraft({ ...bookDraft, sortOrder: Number(e.target.value) })} /></label>
                <label>Stav<select value={bookDraft.status} onChange={(e) => setBookDraft({ ...bookDraft, status: e.target.value as BookDraft['status'] })}><option value="ongoing">Rozepsaná</option><option value="complete">Dokončená</option></select></label>
                <label>Viditelnost<select value={bookDraft.visibility} onChange={(e) => setBookDraft({ ...bookDraft, visibility: e.target.value as AdminContentVisibility })}><option value="published">Viditelná</option><option value="hidden">Skrytá</option></select></label>
                <label>Výchozí přístup kapitol<select value={bookDraft.accessPolicy} onChange={(e) => setBookDraft({ ...bookDraft, accessPolicy: e.target.value as AdminContentAccess })}><option value="inherit">Podle jednotlivých kapitol</option><option value="free">Všechny odemknout</option><option value="entitlement">Všechny zamknout</option></select></label>
                <label>Obálka (cesta nebo URL)<input value={bookDraft.cover} onChange={(e) => setBookDraft({ ...bookDraft, cover: e.target.value })} /></label>
                <label className="admin-content-field--wide">Popis<textarea rows={4} value={bookDraft.description} onChange={(e) => setBookDraft({ ...bookDraft, description: e.target.value })} /></label>
              </div>
              <div className="admin-button-row"><button className="admin-action" type="submit" disabled={saving}>{saving ? 'UKLÁDÁM…' : 'ULOŽIT KNIHU'}</button>{!creatingBook && selectedBook ? <button className="admin-action admin-action--secondary" type="button" disabled={saving} onClick={() => void patchBook({ visibility: selectedBook.visibility === 'published' ? 'hidden' : 'published' }, selectedBook.visibility === 'published' ? 'Kniha byla skryta.' : 'Kniha je znovu viditelná.')}>{selectedBook.visibility === 'published' ? 'SKRÝT CELOU KNIHU' : 'ZVEŘEJNIT KNIHU'}</button> : null}</div>
            </form>
          ) : <div className="admin-state">Vyber knihu nebo vytvoř novou.</div>}

          {selectedBook && !creatingBook ? (
            <section className="admin-chapter-manager" aria-labelledby="admin-chapters-title">
              <div className="admin-content-subheader"><div><h3 id="admin-chapters-title">Kapitoly</h3><p>Rychlé přepínače se projeví okamžitě ve čtečce i knihovně.</p></div><button className="admin-action admin-action--small" type="button" onClick={startChapter}>PŘIDAT KAPITOLU</button></div>
              <div className="admin-chapter-list">
                {selectedBook.chapters.map((chapter) => (
                  <article key={chapter.id} className={chapter.visibility === 'hidden' ? 'is-hidden' : undefined}>
                    <div className="admin-chapter-order">{chapter.ordinal}</div>
                    <div className="admin-chapter-copy"><strong>{chapter.title}</strong><span>{chapter.id} · {accessLabel(chapter.effectiveAccessPolicy)}{chapter.effectiveAccessPolicy === 'entitlement' ? ` · ${chapter.mnemCost ?? 64} MNEM` : ''}</span></div>
                    <div className="admin-button-row">
                      <button className="admin-action admin-action--small admin-action--secondary" type="button" disabled={saving} onClick={() => void patchChapter(chapter, { accessPolicy: chapter.effectiveAccessPolicy === 'free' ? 'entitlement' : 'free', mnemCost: chapter.mnemCost ?? 64 }, chapter.effectiveAccessPolicy === 'free' ? 'Kapitola byla zamčena.' : 'Kapitola byla odemčena.')}>{chapter.effectiveAccessPolicy === 'free' ? 'ZAMKNOUT' : 'ODEMKNOUT'}</button>
                      <button className="admin-action admin-action--small admin-action--secondary" type="button" disabled={saving} onClick={() => void patchChapter(chapter, { visibility: chapter.visibility === 'published' ? 'hidden' : 'published' }, chapter.visibility === 'published' ? 'Kapitola byla skryta.' : 'Kapitola je znovu viditelná.')}>{chapter.visibility === 'published' ? 'SKRÝT' : 'ZVEŘEJNIT'}</button>
                      <button className="admin-action admin-action--small" type="button" disabled={saving} onClick={() => void editChapter(chapter)}>EDITOVAT</button>
                    </div>
                  </article>
                ))}
                {!selectedBook.chapters.length ? <div className="admin-state">Kniha zatím nemá žádné kapitoly.</div> : null}
              </div>
            </section>
          ) : null}

          {chapterDraft ? (
            <form className="admin-content-form admin-chapter-editor" onSubmit={saveChapter}>
              <div className="admin-content-form__heading"><div><span className="admin-eyebrow">{creatingChapter ? 'NEW CHAPTER' : chapterDraft.id}</span><h3>{creatingChapter ? 'Nová kapitola' : 'Editor kapitoly'}</h3></div><button className="admin-action admin-action--small admin-action--secondary" type="button" onClick={() => { setChapterDraft(null); setCreatingChapter(false); }}>ZAVŘÍT</button></div>
              <div className="admin-content-fields">
                <label>ID kapitoly<input value={chapterDraft.id} disabled={!creatingChapter} onChange={(e) => setChapterDraft({ ...chapterDraft, id: e.target.value.toLowerCase() })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
                <label>Kniha<select value={chapterDraft.bookId} onChange={(e) => setChapterDraft({ ...chapterDraft, bookId: e.target.value })}>{snapshot.books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}</select></label>
                <label>Název<input value={chapterDraft.title} onChange={(e) => setChapterDraft({ ...chapterDraft, title: e.target.value })} required /></label>
                <label>Označení kapitoly<input value={chapterDraft.ordinal} onChange={(e) => setChapterDraft({ ...chapterDraft, ordinal: e.target.value })} placeholder="např. 03" /></label>
                <label>Pořadí<input type="number" value={chapterDraft.sortOrder} onChange={(e) => setChapterDraft({ ...chapterDraft, sortOrder: Number(e.target.value) })} /></label>
                <label>Viditelnost<select value={chapterDraft.visibility} onChange={(e) => setChapterDraft({ ...chapterDraft, visibility: e.target.value as AdminContentVisibility })}><option value="published">Viditelná</option><option value="hidden">Skrytá</option></select></label>
                <label>Přístup<select value={chapterDraft.accessPolicy} onChange={(e) => setChapterDraft({ ...chapterDraft, accessPolicy: e.target.value as AdminContentAccess })}><option value="inherit">Podle knihy / výchozí</option><option value="free">Odemčená zdarma</option><option value="entitlement">Zamčená za MNEM</option></select></label>
                <label>Cena MNEM<input type="number" min="1" value={chapterDraft.mnemCost} disabled={chapterDraft.accessPolicy !== 'entitlement'} onChange={(e) => setChapterDraft({ ...chapterDraft, mnemCost: Number(e.target.value) })} /></label>
                <label className="admin-content-field--wide">Shrnutí<textarea rows={3} value={chapterDraft.summary} onChange={(e) => setChapterDraft({ ...chapterDraft, summary: e.target.value })} /></label>
                <label className="admin-content-field--wide">Obsah kapitoly (bezpečné HTML)<textarea className="admin-html-editor" rows={18} value={chapterDraft.bodyHtml} onChange={(e) => setChapterDraft({ ...chapterDraft, bodyHtml: e.target.value })} required /></label>
                <details className="admin-content-field--wide admin-translation-editor"><summary>Anglická verze (volitelné)</summary><label>Anglický název<input value={chapterDraft.titleEn} onChange={(e) => setChapterDraft({ ...chapterDraft, titleEn: e.target.value })} /></label><label>Anglické HTML<textarea className="admin-html-editor" rows={12} value={chapterDraft.bodyHtmlEn} onChange={(e) => setChapterDraft({ ...chapterDraft, bodyHtmlEn: e.target.value })} /></label></details>
              </div>
              <p className="admin-inline-warning">Skripty, vložené styly a nebezpečné odkazy se při uložení automaticky odstraní.</p>
              <div className="admin-button-row"><button className="admin-action" type="submit" disabled={saving}>{saving ? 'UKLÁDÁM…' : 'ULOŽIT KAPITOLU'}</button></div>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
