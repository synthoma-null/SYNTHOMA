import type { Metadata } from 'next';
import OfflineClient from './OfflineClient';

export const metadata: Metadata = {
  title: 'Spojení přerušeno | SYNTHOMA',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineClient />;
}
