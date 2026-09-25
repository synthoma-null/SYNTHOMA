'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { flushReadingProgress } from '../../src/lib/readingSync';

export default function ReadingSyncClient() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return;
    const flush = () => { void flushReadingProgress(userId).catch(() => {}); };
    flush();
    window.addEventListener('online', flush);
    const timer = window.setInterval(flush, 15000);
    return () => { window.removeEventListener('online', flush); window.clearInterval(timer); };
  }, [status, userId]);
  return null;
}
