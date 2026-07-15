import Link from 'next/link';

export default function HomeMemorySignal() {
  return (
    <footer className="synthoma-home__memory">
      <span>LOG [SUBJECT_CONTACT]: Rozhraní tě registruje.</span>
      <span>Integrita paměti není podmínkou vstupu. Bohužel.</span>
      <Link href="/ai/api">PŘÍSTUP PRO AI / AI ACCESS</Link>
    </footer>
  );
}
