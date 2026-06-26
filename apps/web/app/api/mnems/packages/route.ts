export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { PACKAGES } from '../../../../src/content/booksManifest';

export async function GET() {
  return NextResponse.json({ packages: PACKAGES });
}
