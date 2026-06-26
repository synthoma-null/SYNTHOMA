import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import AdminDashboard from '../components/admin/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNTHOMA – ADMIN TERMINÁL',
  description: 'Administrátorský terminál systému SYNTHOMA.',
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const role = (session.user as { role?: string }).role;

  if (role !== 'admin') {
    return (
      <main className="admin-access-denied-page">
        <div className="admin-access-denied">
          <p className="admin-log-prefix">LOG [ACCESS_DENIED]:</p>
          <p className="admin-access-msg">&#8222;Tento terminál není určen pro běžné subjekty.&#8220;</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <AdminDashboard />
    </main>
  );
}
