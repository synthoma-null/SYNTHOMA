'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const res = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError('Subjekt nerozpoznán. Zkontroluj přístupový otisk.');
      } else {
        router.replace('/profile');
        router.refresh();
      }
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-log">
        <span className="auth-log-prefix">LOG [AUTH_GATE]:</span>
        <span className="auth-log-msg">&#8222;Subjekt nerozpoznán. Zadej přístupový otisk.&#8220;</span>
      </div>

      <div className="auth-field">
        <label htmlFor="auth-identifier" className="auth-label">PŘEZDÍVKA NEBO E-MAIL</label>
        <input
          id="auth-identifier"
          className="auth-input"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={isPending}
          required
          placeholder="subjekt nebo e-mail"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password" className="auth-label">HESLO</label>
        <input
          id="auth-password"
          className="auth-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
          placeholder="••••••••"
        />
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <button className="auth-submit btn" type="submit" disabled={isPending}>
        {isPending ? 'SYNCHRONIZACE...' : 'ZAHÁJIT SYNCHRONIZACI'}
      </button>

      <p className="auth-switch">
        Nový subjekt?{' '}
        <Link href="/register" className="auth-link">REGISTROVAT IDENTITU</Link>
      </p>
      <p className="auth-switch">
        <Link href="/" className="auth-link">← ZPĚT NA SYNTHOMA</Link>
      </p>
    </form>
  );
}
