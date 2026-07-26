'use client';

import Link from 'next/link';
import { useLang } from '../../lib/LangContext';

export default function SynthomaFooter() {
  const { lang } = useLang();
  const suffix = lang === 'en' ? '?locale=en' : '';
  const copy = lang === 'en'
    ? { label: 'System links', author: 'AUTHOR', api: 'AI / API', terms: 'TERMS', privacy: 'PRIVACY', status: 'PUBLIC CHANNEL // ONLINE' }
    : { label: 'Systémové odkazy', author: 'AUTOR', api: 'AI / API', terms: 'PODMÍNKY', privacy: 'SOUKROMÍ', status: 'VEŘEJNÝ KANÁL // ONLINE' };

  return (
    <footer className="synthoma-global-footer">
      <p className="synthoma-global-footer__status">{copy.status}</p>
      <nav aria-label={copy.label}>
        <Link href={`/autor${suffix}`}>{copy.author}</Link>
        <Link href={`/ai/api${suffix}`}>{copy.api}</Link>
        <Link href={`/terms${suffix}`}>{copy.terms}</Link>
        <Link href={`/privacy${suffix}`}>{copy.privacy}</Link>
      </nav>
      <p className="synthoma-global-footer__signature">SYNTHOMA // MEMORY SYSTEM</p>
    </footer>
  );
}
