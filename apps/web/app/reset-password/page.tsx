import type { Metadata } from 'next';
import PasswordResetForm from './PasswordResetForm';

export const metadata: Metadata = { title: 'Obnovení hesla | SYNTHOMA', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default function PasswordResetPage() { return <main className="auth-page"><div className="auth-container"><PasswordResetForm /></div></main>; }
