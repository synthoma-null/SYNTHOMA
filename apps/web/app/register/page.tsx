import type { Metadata } from 'next';
import RegisterForm from '../components/auth/RegisterForm';
import BgVideo from '../components/BgVideo';

export const metadata: Metadata = {
  title: 'SYNTHOMA – REGISTRACE SUBJEKTU',
  description: 'Vytvoření nové identity v systému SYNTHOMA.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="glitch-bg auth-page-wrap">
      <BgVideo src="/video/SYNTHOMA32.webm" />
      <main className="auth-home-main" role="main" aria-label="Registrace">
        <h1 className="glitch-master auth-home-title" data-text="SUBJEKT INIT" aria-label="SUBJEKT INIT">
          <span className="glitch-fake1" aria-hidden>SUBJEKT INIT</span>
          <span className="glitch-fake2" aria-hidden>SUBJEKT INIT</span>
          <span className="glitch-real" aria-hidden>SUBJEKT INIT</span>
          <span className="sr-only">SUBJEKT INIT</span>
        </h1>
        <section className="auth-home-panel os-surface os-surface--glass" aria-label="Registrace">
          <RegisterForm />
        </section>
      </main>
    </div>
  );
}
