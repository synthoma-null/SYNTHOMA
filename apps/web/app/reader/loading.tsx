export default function Loading() {
  return (
    <div className="reader-skeleton" aria-busy="true" aria-label="Načítání čtečky">
      <div className="reader-skeleton__header">
        <div className="reader-skeleton__line reader-skeleton__line--title" />
      </div>
      <div className="reader-skeleton__body">
        <div className="reader-skeleton__line reader-skeleton__line--full" />
        <div className="reader-skeleton__line reader-skeleton__line--long" />
        <div className="reader-skeleton__line reader-skeleton__line--medium" />
        <div className="reader-skeleton__line reader-skeleton__line--full" />
        <div className="reader-skeleton__line reader-skeleton__line--short" />
      </div>
      <div className="reader-skeleton__scanline" />
    </div>
  );
}
