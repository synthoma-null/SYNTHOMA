export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  firstChapter: string;
  chapters: Chapter[];
  lastReadAt?: Date;
  progress?: number;
}

export interface Chapter {
  id: string;
  title: string;
  path: string;
  order: number;
  isRead: boolean;
}

// Typ průběhu čtení ukládaný v localStorage
type ReadingProgress = Record<string, {
  lastReadAt?: string | Date;
  progress?: number;
  chapters?: Record<string, boolean>;
}>;

function safeParse<T>(src: string | null, fallback: T): T {
  if (!src) return fallback;
  try {
    return JSON.parse(src) as T;
  } catch {
    return fallback;
  }
}

// Mock data - v reálné aplikaci by toto bylo načítáno z API nebo souborového systému
export const library: Book[] = [
  {
    id: 'synthoma-null',
    title: 'SYNTHOMA NULL',
    author: 'SYNTHOMA TEAM',
    description: 'Interaktivní příběh o hledání smyslu v digitálním světě.',
    coverImage: '/images/covers/synthoma-null.jpg',
    firstChapter: '0-1 [START].html',
    chapters: [
      { id: 'start', title: 'START', path: '0-1 [START].html', order: 1, isRead: false },
      { id: 'run', title: 'RUN', path: '0-2 [RUN].html', order: 2, isRead: false },
      { id: 'restart', title: 'RESTART', path: '0-∞ [RESTART].html', order: 3, isRead: false },
    ],
    lastReadAt: new Date(),
    progress: 0
  },
  // Další knihy by přibyly zde
];

// Získání všech knih
export const getAllBooks = async (): Promise<Book[]> => {
  // V produkčním prostředí by zde bylo načítání z API
  return Promise.resolve(library);
};

// Získání jedné knihy podle ID
export const getBookById = async (id: string): Promise<Book | undefined> => {
  const books = await getAllBooks();
  return books.find(book => book.id === id);
};

// Uložení průběhu čtení
export const saveReadingProgress = async (bookId: string, chapterId: string, progress: number) => {
  // V produkčním prostředí by zde bylo volání API pro uložení
  const book = library.find(b => b.id === bookId);
  if (book) {
    book.lastReadAt = new Date();
    book.progress = progress;
    
    // Označit kapitolu jako přečtenou
    const chapter = book.chapters.find(c => c.id === chapterId);
    if (chapter) {
      chapter.isRead = true;
    }
    
    // Uložit do localStorage pro okamžitou aktualizaci UI
    if (typeof window !== 'undefined') {
      const readingProgress = safeParse<ReadingProgress>(localStorage.getItem('readingProgress'), {});
      readingProgress[bookId] = {
        lastReadAt: book.lastReadAt?.toISOString?.() ?? String(book.lastReadAt ?? ''),
        progress,
        chapters: book.chapters.reduce((acc, ch) => ({
          ...acc,
          [ch.id]: ch.isRead
        }), {})
      };
      localStorage.setItem('readingProgress', JSON.stringify(readingProgress));
    }
  }
};

// Načtení uloženého průběhu čtení
export const loadReadingProgress = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    return safeParse<ReadingProgress>(localStorage.getItem('readingProgress'), {});
  } catch (e) {
    console.error('Chyba při načítání průběhu čtení:', e);
    return {};
  }
};
