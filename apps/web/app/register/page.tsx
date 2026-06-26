import type { Metadata } from 'next';
import RegisterForm from '../components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'SYNTHOMA – REGISTRACE SUBJEKTU',
  description: 'Vytvoření nové identity v systému SYNTHOMA.',
};

export default function RegisterPage() {
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
      <main className="auth-home-main" role="main" aria-label="Registrace">
        <h1 className="glitch-master auth-home-title" data-text="SUBJEKT INIT" aria-label="SUBJEKT INIT">
          <span className="glitch-fake1" aria-hidden>SUBJEKT INIT</span>
          <span className="glitch-fake2" aria-hidden>SUBJEKT INIT</span>
          <span className="glitch-real" aria-hidden>SUBJEKT INIT</span>
          <span className="sr-only">SUBJEKT INIT</span>
        </h1>
        <section className="panel glass auth-home-panel" aria-label="Registrace">
          <RegisterForm />
        </section>
      </main>
    </div>
  );
}
