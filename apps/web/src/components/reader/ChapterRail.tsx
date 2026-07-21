interface ChapterRailProps {
  book: string;
  ordinal: string;
  position: number;
  total: number;
}

export default function ChapterRail({ book, ordinal, position, total }: ChapterRailProps) {
  return (
    <aside className="chapter-rail" aria-hidden="true">
      <span className="chapter-rail__book">{book}</span>
      <span className="chapter-rail__number">{ordinal}</span>
      <span className="chapter-rail__progress">{String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <span className="chapter-rail__signal" />
    </aside>
  );
}
