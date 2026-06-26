'use client';

import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';

export default function SessionProviderClient({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
