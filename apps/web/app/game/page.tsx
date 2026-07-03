import type { Metadata } from 'next';
import GameClient from './GameClient';

export const metadata: Metadata = {
  title: 'Prázdnota na tahu | SYNTHOMA',
  description: 'Tahová kooperativní karetní hra v univerzu SYNTHOMA. Stabilizuj sektory. Poraz Nekonečný Formulář.',
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
