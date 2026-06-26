import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import ProfileDashboard from '../../src/components/profile/ProfileDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNTHOMA – SUBJEKT',
  description: 'Soukromý profil subjektu v systému SYNTHOMA.',
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return <ProfileDashboard userId={session.user.id} nickname={session.user.name ?? ''} />;
}
