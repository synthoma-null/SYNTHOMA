'use client';

import { sanitizeChapterHtml } from '../../../src/lib/sanitizeChapterHtml';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  cover: string;
  sortOrder: number;
  status: 'complete' | 'ongoing';
  visibility: AdminContentVisibility;
  accessPolicy: AdminContentAccess;
};

type ChapterDraft = {
  id: string;
  bookId: string;
  title: string;
  titleEn: string;
  ordinal: string;
  summary: string;
  sortOrder: number;
  visibility: AdminContentVisibility;
  accessPolicy: AdminContentAccess;
  mnemCost: number;
  bodyHtml: string;
  bodyHtmlEn: string;
  isCustom: boolean;
};

type EditorLocale = 'cs' | 'en';
type EffectTemplate = {
  id: string;
  label: string;
  description: string;
  prefix: string;
  suffix: string;
  placeholder: string;
};

const chapterTemplate = '<section class="story-block">\n  <p>Text nové kapitoly…</p>\n</section>';

const EFFECT_GROUPS: Array<{ label: string; effects: EffectTemplate[] }> = [
  {
    label: 'STRUKTURA',
    effects: [
      { id: 'paragraph', label: 'ODSTAVEC', description: 'Běžný čitelný odstavec.', prefix: '<p class="text">', suffix: '</p>', placeholder: 'Text odstavce…' },
      { id: 'heading', label: 'NADPIS', description: 'Nadpis uvnitř kapitoly.', prefix: '<h2>', suffix: '</h2>', placeholder: 'Název sekce' },
      { id: 'log', label: 'SYSTÉMOVÝ LOG', description: 'Terminálový záznam se scanline efektem.', prefix: '<p class="log fx-scanline">', suffix: '</p>', placeholder: 'LOG [SIGNAL]: zpráva systému' },
      { id: 'silence', label: 'TICHO', description: 'Klidný blok bez záře a rušivých efektů.', prefix: '<p class="text fx-silence">', suffix: '</p>', placeholder: 'Ticho zůstalo déle, než mělo.' },
    ],
  },
  {
    label: 'HLASY',
    effects: [
      { id: 'system', label: 'SYSTÉM', description: 'Dialog systémového hlasu.', prefix: '<p class="dialog dialog-line" data-speaker="system" data-tone="chladně, formálně" tabindex="0" role="button" aria-label="Dialog: Systém. Tón: chladně, formálně.">', suffix: '</p>', placeholder: '„Systémová zpráva.“' },
      { id: 'null', label: 'NULL-1', description: 'Dialog NULL-1.', prefix: '<p class="dialogN dialog-line" data-speaker="null-1" data-tone="tiše, nejistě" tabindex="0" role="button" aria-label="Dialog: NULL-1. Tón: tiše, nejistě.">', suffix: '</p>', placeholder: '„Tohle si nepamatuju.“' },
      { id: 'sarkasma', label: 'SARKASMA', description: 'Dialog Sarkasmy s jemným glitch efektem.', prefix: '<p class="dialogS glitchy fx-flicker dialog-line" data-speaker="sarkasma" data-tone="jízlivě" tabindex="0" role="button" aria-label="Dialog: Sarkasma. Tón: jízlivě.">', suffix: '</p>', placeholder: '„To určitě dopadne skvěle.“' },
      { id: 'glitchka', label: 'GLITCHKA', description: 'Dialog Glitchky.', prefix: '<p class="dialogG dialog-line" data-speaker="glitchka" data-tone="živě, roztříštěně" tabindex="0" role="button" aria-label="Dialog: Glitchka. Tón: živě, roztříštěně.">', suffix: '</p>', placeholder: '„Signál pořád dýchá.“' },
    ],
  },
  {
    label: 'EFEKTY TEXTU',
    effects: [
      { id: 'datastream', label: 'DATOVÝ PROUD', description: 'Proudící barevný signál přes text.', prefix: '<span class="datastream">', suffix: '</span>', placeholder: 'data proudí' },
      { id: 'corrupt', label: 'POŠKOZENÍ', description: 'Jemné barevné rozpojení a jitter.', prefix: '<span class="corrupt">', suffix: '</span>', placeholder: 'poškozený fragment' },
      { id: 'blood', label: 'NEON BLOOD', description: 'Pulzující červený neon.', prefix: '<span class="neon-blood">', suffix: '</span>', placeholder: 'kritický signál' },
      { id: 'memory', label: 'PAMĚŤOVÁ STOPA', description: 'Opožděná kopie vzpomínky za textem.', prefix: '<span class="fx-memory-bleed is-revealing" data-memory="ozvěna">', suffix: '</span>', placeholder: 'nic se nestalo' },
      { id: 'identity', label: 'ROZŠTĚPENÍ', description: 'Cyanovo-magentové rozštěpení identity.', prefix: '<span class="fx-identity-split is-revealing" data-copy="NULL-1">', suffix: '</span>', placeholder: 'NULL-1' },
      { id: 'warning', label: 'VAROVÁNÍ', description: 'BIOS varování se zvýrazněným signálem.', prefix: '<span class="bios-warning">', suffix: '</span>', placeholder: 'PŘÍSTUP ODEPŘEN' },
    ],
  },
];

const sanitizePreviewHtml = sanitizeChapterHtml;

function draftFromBook(book: AdminContentBook): BookDraft {
  return {
    id: book.id,
    title: book.title,
    shortTitle: book.shortTitle,
    description: book.description,
    cover: book.cover ?? '',
    sortOrder: book.sortOrder,
    status: book.status,
    visibility: book.visibility,
    accessPolicy: book.accessPolicy,
  };
}

function draftFromChapter(detail: AdminContentChapterDetail): ChapterDraft {
  return {
    id: detail.id,
    bookId: detail.bookId,
    title: detail.title,
    titleEn: detail.titleEn ?? '',
    ordinal: detail.ordinal,
    summary: detail.summary,
    sortOrder: detail.sortOrder,
    visibility: detail.visibility,
    accessPolicy: detail.accessPolicy,
    mnemCost: detail.mnemCost ?? 64,
    bodyHtml: detail.bodyHtml,
    bodyHtmlEn: detail.bodyHtmlEn,
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
  const [revisions, setRevisions] = useState<Array<{ id: string; createdAt: string }>>([]);
  const [editorLocale, setEditorLocale] = useState<EditorLocale>('cs');
  const [loading, setLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const htmlEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedBookIdRef = useRef<string | null>(null);

  const selectedBook = useMemo(
    () => snapshot.books.find((book) => book.id === selectedBookId) ?? null,
    [selectedBookId, snapshot.books],
  );
  const editorHtml = chapterDraft ? (editorLocale === 'cs' ? chapterDraft.bodyHtml : chapterDraft.bodyHtmlEn) : '';
  const previewHtml = useMemo(() => sanitizePreviewHtml(editorHtml), [editorHtml]);

  const applySnapshot = useCallback((next: AdminContentSnapshot, preferredBookId?: string) => {
    setSnapshot(next);
    const nextId = preferredBookId ?? selectedBookIdRef.current ?? next.books[0]?.id ?? null;
    const validId = next.books.some((book) => book.id === nextId) ? nextId : next.books[0]?.id ?? null;
    selectedBookIdRef.current = validId;
    setSelectedBookId(validId);
    const book = next.books.find((item) => item.id === validId) ?? next.books[0];
    if (book) setBookDraft(draftFromBook(book));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [applySnapshot]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!chapterDraft) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving && !chapterLoading) {
        setChapterDraft(null);
        setCreatingChapter(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [chapterDraft, chapterLoading, saving]);

  function selectBook(book: AdminContentBook) {
    selectedBookIdRef.current = book.id;
    setSelectedBookId(book.id);
    setBookDraft(draftFromBook(book));
    setCreatingBook(false);
    setChapterDraft(null);
    setCreatingChapter(false);
    setFeedback(null);
    setError(null);
  }

  function startBook() {
    setCreatingBook(true);
    selectedBookIdRef.current = null;
    setSelectedBookId(null);
    setChapterDraft(null);
    setCreatingChapter(false);
    setBookDraft({
      id: '', title: '', shortTitle: '', description: '', cover: '',
      sortOrder: snapshot.books.length + 10, status: 'ongoing', visibility: 'hidden', accessPolicy: 'free',
    });
  }

  async function saveBook(event: FormEvent) {
    event.preventDefault();
    if (!bookDraft) return;
    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const response = await fetch('/api/admin/content', {
        method: creatingBook ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'book', ...bookDraft, language: 'cs' }),
      });
      const next = await readAdminResponse<AdminContentSnapshot>(response);
      applySnapshot(next, bookDraft.id);
      setCreatingBook(false);
      setFeedback('Kniha byla uložena.');
      onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function patchBook(patch: Partial<BookDraft>, message: string) {
    if (!selectedBook) return;
    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'book', id: selectedBook.id, ...patch }),
      });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response), selectedBook.id);
      setFeedback(message);
      onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function editChapter(chapter: AdminContentChapter) {
    if (!selectedBook) return;
    setRevisions([]);
    setChapterLoading(true);
    setError(null);
    setFeedback(null);
    setCreatingChapter(false);
    setEditorLocale('cs');
    setChapterDraft({
      id: chapter.id,
      bookId: selectedBook.id,
      title: chapter.title,
      titleEn: chapter.titleEn ?? '',
      ordinal: chapter.ordinal,
      summary: chapter.summary,
      sortOrder: chapter.sortOrder,
      visibility: chapter.visibility,
      accessPolicy: chapter.accessPolicy,
      mnemCost: chapter.mnemCost ?? 64,
      bodyHtml: '',
      bodyHtmlEn: '',
      isCustom: chapter.isCustom,
    });
    try {
      const response = await fetch(`/api/admin/content?chapterId=${encodeURIComponent(chapter.id)}`, { cache: 'no-store' });
      setChapterDraft(draftFromChapter(await readAdminResponse<AdminContentChapterDetail>(response)));
    } catch (requestError) {
      setChapterDraft(null);
      setError(errorMessage(requestError));
    } finally {
      setChapterLoading(false);
    }
  }

  async function loadHistory() {
    if (!chapterDraft) return;
    setError(null);
    try {
      const response = await fetch(`/api/admin/content?chapterId=${encodeURIComponent(chapterDraft.id)}&history=1`, { cache: 'no-store' });
      const data = await readAdminResponse<{ revisions: Array<{ id: string; createdAt: string }> }>(response);
      setRevisions(data.revisions);
      if (!data.revisions.length) setFeedback('Tato kapitola zatím nemá uloženou předchozí verzi.');
    } catch (requestError) { setError(errorMessage(requestError)); }
  }

  async function loadRevision(revisionId: string) {
    if (!chapterDraft || !revisionId) return;
    setChapterLoading(true); setError(null);
    try {
      const response = await fetch(`/api/admin/content?chapterId=${encodeURIComponent(chapterDraft.id)}&revisionId=${encodeURIComponent(revisionId)}`, { cache: 'no-store' });
      const restored = await readAdminResponse<AdminContentChapterDetail>(response);
      setChapterDraft({ ...draftFromChapter(restored), visibility: 'hidden' });
      setFeedback('Starší verze je načtena v editoru jako skrytý koncept. Zkontroluj náhled a ulož ji.');
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setChapterLoading(false); }
  }

  function startChapter() {
    if (!selectedBook) return;
    setRevisions([]);
    setCreatingChapter(true);
    setFeedback(null);
    setError(null);
    setEditorLocale('cs');
    setChapterDraft({
      id: '', bookId: selectedBook.id, title: '', titleEn: '', ordinal: '', summary: '',
      sortOrder: selectedBook.chapters.length, visibility: 'hidden', accessPolicy: 'free',
      mnemCost: 64, bodyHtml: chapterTemplate, bodyHtmlEn: '', isCustom: true,
    });
  }

  function closeChapterEditor() {
    if (chapterLoading) return;
    setChapterDraft(null);
    setCreatingChapter(false);
  }

  function updateEditorHtml(value: string) {
    if (!chapterDraft) return;
    setChapterDraft(editorLocale === 'cs'
      ? { ...chapterDraft, bodyHtml: value }
      : { ...chapterDraft, bodyHtmlEn: value });
  }

  function insertEffect(effect: EffectTemplate) {
    const editor = htmlEditorRef.current;
    if (!editor || !chapterDraft) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = editorHtml.slice(start, end) || effect.placeholder;
    const insertion = `${effect.prefix}${selected}${effect.suffix}`;
    updateEditorHtml(`${editorHtml.slice(0, start)}${insertion}${editorHtml.slice(end)}`);
    requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(start + effect.prefix.length, start + effect.prefix.length + selected.length);
    });
  }

  async function saveChapter(event: FormEvent) {
    event.preventDefault();
    if (!chapterDraft) return;
    setSaving(true);
    setError(null);
    setFeedback(null);
    const { isCustom: _isCustom, ...editableChapter } = chapterDraft;
    const payload = {
      entity: 'chapter',
      ...editableChapter,
      bodyHtmlEn: chapterDraft.bodyHtmlEn.trim(),
      mnemCost: chapterDraft.accessPolicy === 'entitlement' ? chapterDraft.mnemCost : null,
    };
    try {
      const response = await fetch('/api/admin/content', {
        method: creatingChapter ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response), chapterDraft.bookId);
      closeChapterEditor();
      setFeedback('Kapitola byla uložena.');
      onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function patchChapter(chapter: AdminContentChapter, patch: Record<string, unknown>, message: string) {
    setSaving(true);
    setError(null);
    setFeedback(null);
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'chapter', id: chapter.id, ...patch }),
      });
      applySnapshot(await readAdminResponse<AdminContentSnapshot>(response), selectedBook?.id);
      setFeedback(message);
      onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-state" role="status">Načítám katalog knih…</div>;

  return (
    <section className="admin-workspace admin-content-manager os-surface" aria-labelledby="admin-content-title">
      <div className="admin-section-header">
        <div>
          <span className="admin-eyebrow">LIBRARY // CONTENT</span>
          <h2 id="admin-content-title">Knihy a kapitoly</h2>
          <p>Viditelnost, přístup a text kapitol se mění přímo v databázi. Původní soubory zůstávají jako bezpečný základ.</p>
        </div>
        <div className="admin-button-row">
          <button className="admin-action admin-action--secondary" type="button" onClick={() => void load()} disabled={saving}>OBNOVIT</button>
          <button className="admin-action" type="button" onClick={startBook}>PŘIDAT KNIHU</button>
        </div>
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
              <div className="admin-content-form__heading">
                <div><span className="admin-eyebrow">{creatingBook ? 'NEW BOOK' : bookDraft.id}</span><h3>{creatingBook ? 'Nová kniha' : 'Nastavení knihy'}</h3></div>
                {!creatingBook && selectedBook ? <span className="admin-role">{selectedBook.isCustom ? 'DATABÁZOVÁ' : selectedBook.overridden ? 'UPRAVENÁ' : 'VÝCHOZÍ'}</span> : null}
              </div>
              <div className="admin-content-fields">
                <label>ID knihy<input value={bookDraft.id} disabled={!creatingBook} onChange={(event) => setBookDraft({ ...bookDraft, id: event.target.value.toLowerCase() })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
                <label>Název<input value={bookDraft.title} onChange={(event) => setBookDraft({ ...bookDraft, title: event.target.value })} required /></label>
                <label>Krátký název<input value={bookDraft.shortTitle} onChange={(event) => setBookDraft({ ...bookDraft, shortTitle: event.target.value })} /></label>
                <label>Pořadí<input type="number" value={bookDraft.sortOrder} onChange={(event) => setBookDraft({ ...bookDraft, sortOrder: Number(event.target.value) })} /></label>
                <label>Stav<select value={bookDraft.status} onChange={(event) => setBookDraft({ ...bookDraft, status: event.target.value as BookDraft['status'] })}><option value="ongoing">Rozepsaná</option><option value="complete">Dokončená</option></select></label>
                <label>Viditelnost<select value={bookDraft.visibility} onChange={(event) => setBookDraft({ ...bookDraft, visibility: event.target.value as AdminContentVisibility })}><option value="published">Viditelná</option><option value="hidden">Skrytá</option></select></label>
                <label>Výchozí přístup kapitol<select value={bookDraft.accessPolicy} onChange={(event) => setBookDraft({ ...bookDraft, accessPolicy: event.target.value as AdminContentAccess })}><option value="inherit">Podle jednotlivých kapitol</option><option value="free">Všechny odemknout</option><option value="entitlement">Všechny zamknout</option></select></label>
                <label>Obálka (cesta nebo URL)<input value={bookDraft.cover} onChange={(event) => setBookDraft({ ...bookDraft, cover: event.target.value })} /></label>
                <label className="admin-content-field--wide">Popis<textarea rows={4} value={bookDraft.description} onChange={(event) => setBookDraft({ ...bookDraft, description: event.target.value })} /></label>
              </div>
              <div className="admin-button-row">
                <button className="admin-action" type="submit" disabled={saving}>{saving ? 'UKLÁDÁM…' : 'ULOŽIT KNIHU'}</button>
                {!creatingBook && selectedBook ? (
                  <button className="admin-action admin-action--secondary" type="button" disabled={saving} onClick={() => void patchBook({ visibility: selectedBook.visibility === 'published' ? 'hidden' : 'published' }, selectedBook.visibility === 'published' ? 'Kniha byla skryta.' : 'Kniha je znovu viditelná.')}>
                    {selectedBook.visibility === 'published' ? 'SKRÝT CELOU KNIHU' : 'ZVEŘEJNIT KNIHU'}
                  </button>
                ) : null}
              </div>
            </form>
          ) : <div className="admin-state">Vyber knihu nebo vytvoř novou.</div>}

          {selectedBook && !creatingBook ? (
            <section className="admin-chapter-manager" aria-labelledby="admin-chapters-title">
              <div className="admin-content-subheader">
                <div><h3 id="admin-chapters-title">Kapitoly</h3><p>Rychlé přepínače se projeví okamžitě ve čtečce i knihovně.</p></div>
                <button className="admin-action admin-action--small" type="button" onClick={startChapter}>PŘIDAT KAPITOLU</button>
              </div>
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
        </div>
      </div>

      {chapterDraft && typeof document !== 'undefined' ? createPortal((
        <div className="admin-chapter-editor-layer">
          <form className="admin-chapter-studio" onSubmit={saveChapter} role="dialog" aria-modal="true" aria-labelledby="chapter-editor-title" aria-busy={chapterLoading}>
            <header className="admin-chapter-studio__header">
              <div>
                <span className="admin-eyebrow">{creatingChapter ? 'NEW CHAPTER' : `CHAPTER // ${chapterDraft.id}`}</span>
                <h2 id="chapter-editor-title">{creatingChapter ? 'Nová kapitola' : 'Editor kapitoly'}</h2>
                <p>Piš HTML, vkládej připravené efekty a výsledek kontroluj v živém náhledu.</p>
              </div>
              <div className="admin-button-row">
                <button className="admin-action admin-action--secondary" type="button" onClick={closeChapterEditor} disabled={saving || chapterLoading}>ZAVŘÍT</button>
                <button className="admin-action" type="submit" disabled={saving || chapterLoading}>{saving ? 'UKLÁDÁM…' : 'ULOŽIT KAPITOLU'}</button>
              </div>
            </header>

            {chapterLoading ? (
              <div className="admin-chapter-loading" role="status">
                <span>CHAPTER // FETCH</span>
                <strong>Načítám text kapitoly…</strong>
                <small>Editor se otevřel; čekám na aktuální obsah z databáze.</small>
              </div>
            ) : null}

            <div className="admin-chapter-studio__body">
              <aside className="admin-chapter-settings" aria-label="Nastavení kapitoly">
                <div className="admin-chapter-settings__title"><span>01</span><strong>ZÁKLADNÍ ÚDAJE</strong></div>
                <label>ID kapitoly<input value={chapterDraft.id} disabled={!creatingChapter} onChange={(event) => setChapterDraft({ ...chapterDraft, id: event.target.value.toLowerCase() })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
                <label>Kniha<select value={chapterDraft.bookId} onChange={(event) => setChapterDraft({ ...chapterDraft, bookId: event.target.value })}>{snapshot.books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}</select></label>
                <label>Název<input value={chapterDraft.title} onChange={(event) => setChapterDraft({ ...chapterDraft, title: event.target.value })} required /></label>
                <label>Anglický název<input value={chapterDraft.titleEn} onChange={(event) => setChapterDraft({ ...chapterDraft, titleEn: event.target.value })} /></label>
                <div className="admin-chapter-settings__row">
                  <label>Označení<input value={chapterDraft.ordinal} onChange={(event) => setChapterDraft({ ...chapterDraft, ordinal: event.target.value })} placeholder="03" /></label>
                  <label>Pořadí<input type="number" value={chapterDraft.sortOrder} onChange={(event) => setChapterDraft({ ...chapterDraft, sortOrder: Number(event.target.value) })} /></label>
                </div>
                {!creatingChapter && <button type="button" className="admin-action admin-action--secondary" disabled={saving || chapterLoading} onClick={() => void loadHistory()}>NAČÍST HISTORII VERZÍ</button>}
                {!creatingChapter && revisions.length > 0 && <label>Historie verzí<select defaultValue="" disabled={chapterLoading || saving} onChange={event => void loadRevision(event.target.value)}>
                  <option value="">Načíst předchozí verzi do editoru…</option>
                  {revisions.map(revision => <option key={revision.id} value={revision.id}>{new Date(revision.createdAt).toLocaleString('cs-CZ')}</option>)}
                </select></label>}
                {creatingChapter && <p>Nová kapitola se nejdříve uloží jako skrytý koncept.</p>}
                <label>Viditelnost<select disabled={creatingChapter} value={chapterDraft.visibility} onChange={(event) => setChapterDraft({ ...chapterDraft, visibility: event.target.value as AdminContentVisibility })}><option value="published">Viditelná</option><option value="hidden">Skrytá</option></select></label>
                <label>Přístup<select value={chapterDraft.accessPolicy} onChange={(event) => setChapterDraft({ ...chapterDraft, accessPolicy: event.target.value as AdminContentAccess })}><option value="inherit">Podle knihy</option><option value="free">Odemčená zdarma</option><option value="entitlement">Zamčená za MNEM</option></select></label>
                <label>Cena MNEM<input type="number" min="1" value={chapterDraft.mnemCost} disabled={chapterDraft.accessPolicy !== 'entitlement'} onChange={(event) => setChapterDraft({ ...chapterDraft, mnemCost: Number(event.target.value) })} /></label>
                <label>Shrnutí<textarea rows={4} value={chapterDraft.summary} onChange={(event) => setChapterDraft({ ...chapterDraft, summary: event.target.value })} /></label>
                <p className="admin-inline-warning">Skripty, vložené styly a nebezpečné odkazy se v náhledu i při uložení odstraní.</p>
              </aside>

              <main className="admin-chapter-compose">
                <div className="admin-chapter-locale-tabs" role="tablist" aria-label="Jazyk obsahu">
                  <button type="button" role="tab" aria-selected={editorLocale === 'cs'} className={editorLocale === 'cs' ? 'is-active' : undefined} onClick={() => setEditorLocale('cs')}>ČESKY <span>POVINNÉ</span></button>
                  <button type="button" role="tab" aria-selected={editorLocale === 'en'} className={editorLocale === 'en' ? 'is-active' : undefined} onClick={() => setEditorLocale('en')}>ENGLISH <span>VOLITELNÉ</span></button>
                </div>

                <section className="admin-effect-library" aria-labelledby="effect-library-title">
                  <div className="admin-effect-library__intro">
                    <div><span className="admin-eyebrow">SYNTHOMA // CSS</span><h3 id="effect-library-title">Knihovna efektů</h3></div>
                    <p>Označ text a klikni na efekt. Bez výběru se vloží připravený příklad.</p>
                  </div>
                  {EFFECT_GROUPS.map((group) => (
                    <div className="admin-effect-group" key={group.label}>
                      <span>{group.label}</span>
                      <div>
                        {group.effects.map((effect) => (
                          <button key={effect.id} type="button" title={effect.description} aria-label={`${effect.label}: ${effect.description}`} onClick={() => insertEffect(effect)}>{effect.label}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <div className="admin-chapter-workbench">
                  <section className="admin-code-pane" aria-labelledby="chapter-html-title">
                    <header><div><span>02</span><strong id="chapter-html-title">HTML // {editorLocale.toUpperCase()}</strong></div><small>{editorHtml.length.toLocaleString('cs-CZ')} znaků</small></header>
                    <textarea
                      ref={htmlEditorRef}
                      className="admin-html-editor"
                      aria-label={`HTML kapitoly ${editorLocale === 'cs' ? 'česky' : 'anglicky'}`}
                      spellCheck={false}
                      value={editorHtml}
                      onChange={(event) => updateEditorHtml(event.target.value)}
                      required={editorLocale === 'cs'}
                    />
                  </section>

                  <section className="admin-preview-pane" aria-labelledby="chapter-preview-title">
                    <header><div><span>03</span><strong id="chapter-preview-title">ŽIVÝ NÁHLED</strong></div><small>AKTUÁLNÍ MOTIV</small></header>
                    <div className="admin-preview-viewport">
                      {previewHtml ? (
                        <article className="admin-chapter-preview chapter-reader__article SYNTHOMAREADER choices-shown typewriter-instant">
                          <div className="chapter-content" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </article>
                      ) : <div className="admin-preview-empty">Anglická verze zatím nemá obsah.</div>}
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </form>
        </div>
      ), document.body) : null}
    </section>
  );
}
