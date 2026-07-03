import type { Metadata } from 'next';
import RoomClient from './RoomClient';

export const metadata: Metadata = {
  title: 'Herní místnost | SYNTHOMA',
  robots: { index: false, follow: false },
};

export default function RoomPage() {
  return <RoomClient />;
}
