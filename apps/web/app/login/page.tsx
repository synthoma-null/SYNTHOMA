import type { Metadata } from 'next';
import LoginForm from '../components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'SYNTHOMA – AUTH GATE',
  description: 'Přihlášení subjektu do systému SYNTHOMA.',
};

export default function LoginPage() {
  return (
    <div className="glitch-bg auth-page-wrap">
      <div aria-hidden className="video-background">
        <video
          src="/video/SYNTHOMA32.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="active"
        />
      </div>
      <main className="auth-home-main" role="main" aria-label="Přihlášení">
        <h1 className="glitch-master auth-home-title" data-text="AUTH GATE" aria-label="AUTH GATE">
          <span className="glitch-fake1" aria-hidden>AUTH GATE</span>
          <span className="glitch-fake2" aria-hidden>AUTH GATE</span>
          <span className="glitch-real" aria-hidden>AUTH GATE</span>
          <span className="sr-only">AUTH GATE</span>
        </h1>
        <section className="panel glass auth-home-panel" aria-label="Přihlášení">
          <LoginForm />
        </section>
      </main>
    </div>
  );
}
