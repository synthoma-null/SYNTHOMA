import type { Metadata } from 'next';
import LoginForm from '../components/auth/LoginForm';
import BgVideo from '../components/BgVideo';

export const metadata: Metadata = {
  title: 'SYNTHOMA – AUTH GATE',
  description: 'Přihlášení subjektu do systému SYNTHOMA.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="glitch-bg auth-page-wrap">
      <BgVideo src="/video/SYNTHOMA32.webm" />
      <main className="auth-home-main" role="main" aria-label="Přihlášení">
        <h1 className="glitch-master auth-home-title" data-text="AUTH GATE" aria-label="AUTH GATE">
          <span className="glitch-fake1" aria-hidden>AUTH GATE</span>
          <span className="glitch-fake2" aria-hidden>AUTH GATE</span>
          <span className="glitch-real" aria-hidden>AUTH GATE</span>
          <span className="sr-only">AUTH GATE</span>
        </h1>
        <section className="auth-home-panel os-surface os-surface--glass" aria-label="Přihlášení">
          <LoginForm />
        </section>
      </main>
    </div>
  );
}
