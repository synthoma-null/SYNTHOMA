import type { Metadata } from 'next';
import InstallClient from './InstallClient';

export const metadata: Metadata = {
  title: 'Nainstalovat SYNTHOMU',
  description: 'Instalace SYNTHOMY jako aplikace s podporou offline čtení.',
  alternates: { canonical: 'https://www.synthoma.cz/install' },
};

export default function InstallPage() {
  return <InstallClient />;
}
