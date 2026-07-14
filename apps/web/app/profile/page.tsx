import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SYNTHOMA – SUBJEKT',
  description: 'Soukromý profil subjektu v systému SYNTHOMA.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  // The global panel selects a local or signed-in dossier from the current session.
  redirect('/?profile=1');
}
