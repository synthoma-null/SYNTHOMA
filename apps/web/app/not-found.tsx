import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="synthoma-system-state" aria-labelledby="not-found-title">
      <section className="synthoma-system-state__panel">
        <p className="synthoma-system-state__code">ROUTE // 404 // MEMORY ADDRESS EMPTY</p>
        <h1 id="not-found-title">TADY NIC NEZŮSTALO</h1>
        <p>Archiv tvrdí, že tato cesta nikdy neexistovala. Archiv lže, ale tentokrát nemáme lepší adresu.</p>
        <div className="synthoma-system-state__actions"><Link className="os-command" href="/">ZPĚT DO UZLU</Link><Link className="os-command" href="/books">OTEVŘÍT KNIHOVNU</Link></div>
      </section>
    </main>
  );
}
