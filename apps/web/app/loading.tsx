export default function Loading() {
  return (
    <main className="synthoma-system-state" aria-busy="true" aria-label="Načítání SYNTHOMA OS">
      <section className="synthoma-system-state__panel">
        <p className="synthoma-system-state__code">MEMORY CHANNEL // CONNECTING</p>
        <h1>NAČÍTÁM STOPU</h1>
        <div className="synthoma-system-state__loader" aria-hidden="true" />
      </section>
    </main>
  );
}
