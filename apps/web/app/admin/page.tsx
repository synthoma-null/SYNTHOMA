import "../../src/styles/reader.css";
import "../../src/styles/book-reader-base.css";
import "../../src/styles/effects-books/null.css";
import "../../src/styles/effects-books/konec-podpory.css";
import "../../src/styles/effects-books/neon-0.css";
import "../../src/styles/admin.css";
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import AdminDashboard from '../components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'SYNTHOMA – ADMINISTRACE',
  description: 'Zabezpečený administrační panel systému SYNTHOMA.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const role = (session.user as { role?: string }).role;
  if (role !== 'admin') {
    return (
      <main className="admin-access-denied-page">
        <section className="admin-access-denied" aria-labelledby="admin-denied-title">
          <span className="admin-eyebrow">ACCESS // DENIED</span>
          <h1 id="admin-denied-title">Přístup zamítnut</h1>
          <p>Tento panel je dostupný pouze administrátorům systému.</p>
          <Link className="admin-action" href="/">ZPĚT NA HLAVNÍ STRÁNKU</Link>
        </section>
      </main>
    );
  }

  return <main className="admin-page"><AdminDashboard /></main>;
}
