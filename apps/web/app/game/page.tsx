import type { Metadata } from 'next';
import GameClient from './GameClient';

export const metadata: Metadata = {
  title: 'Nezlob Prázdnotu | SYNTHOMA',
  description: 'Online tahová hra pro 2–6 hráčů v univerzu SYNTHOMA. Přesuň fragmenty do Jádra dřív, než tě pohltí Prázdnota.',
  alternates: {
    canonical: 'https://www.synthoma.cz/game',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function GamePage() {
  return <GameClient />;
}
