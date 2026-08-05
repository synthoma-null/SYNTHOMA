export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function PATCH() {
  return NextResponse.json(
    { error: 'Veřejné profily nejsou podporovány. Profil zůstává soukromý.' },
    { status: 410 },
  );
}
