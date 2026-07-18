import type { Metadata } from 'next';
import SynthomaHome from "../src/components/home/SynthomaHome";
import { buildPublicMetadata, requestLocale, SYNTHOMA_DESCRIPTOR } from '../src/lib/publicMetadata';
import "../src/styles/synthoma-os/home.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return buildPublicMetadata({
    locale,
    path: '/',
    title: locale === 'en' ? 'SYNTHOMA | Interactive novel, card game and living archive' : 'SYNTHOMA | Interaktivní román, karetní hra a živý archiv',
    description: SYNTHOMA_DESCRIPTOR[locale],
    imageAlt: locale === 'en' ? 'SYNTHOMA interactive story world' : 'Interaktivní svět SYNTHOMA',
  });
}

export default function HomePage() {
  return <SynthomaHome />;
}
