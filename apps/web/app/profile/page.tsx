import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNTHOMA – SUBJEKT',
  description: 'Soukromý profil subjektu v systému SYNTHOMA.',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  // Profile is shown as a popup overlay via ProfilePanelClient in the global layout
  redirect('/?login=1');
}
