import type { Metadata } from 'next';
import CyklusPageClient from './CyklusPageClient';
import { buildPublicMetadata, requestLocale } from '../../src/lib/publicMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const metadata = buildPublicMetadata({
    locale,
    path: '/cyklus',
    title: locale === 'en' ? 'Cyklus diagnostic card game | SYNTHOMA' : 'Diagnostická karetní hra Cyklus | SYNTHOMA',
    description: locale === 'en' ? 'Play twelve choices across four unstable values and see what your decisions leave behind.' : 'Projdi dvanáct voleb, čtyři nestabilní hodnoty a zjisti, co po tvých rozhodnutích zůstane.',
    imageAlt: locale === 'en' ? 'Cyklus diagnostic card game' : 'Diagnostická karetní hra Cyklus',
  });
  return { ...metadata, alternates: { ...metadata.alternates, types: { 'application/json': '/api/public/v1/cyklus/rules' } } };
}

export default async function CyklusPage() {
  return (
    <main id="cyklus-game" className="cyklus-page cyklus-game-shell" tabIndex={-1}>
      <CyklusPageClient />
    </main>
  );
}
