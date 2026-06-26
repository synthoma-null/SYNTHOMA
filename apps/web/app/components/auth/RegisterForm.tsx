'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registrace selhala.');
        return;
      }
      await signIn('credentials', {
        identifier: form.nickname,
        password: form.password,
        redirect: false,
      });
      router.replace('/profile');
      router.refresh();
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-log">
        <span className="auth-log-prefix">LOG [SUBJECT_REGISTRATION]:</span>
        <span className="auth-log-msg">&#8222;Vytvářím nový subjekt. Paměťový otisk bude přiřazen k identitě.&#8220;</span>
      </div>

      <div className="auth-field">
        <label htmlFor="reg-email" className="auth-label">E-MAIL</label>
        <input
          id="reg-email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set('email')}
          disabled={isPending}
          required
          placeholder="subjekt@synthoma.cz"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-nickname" className="auth-label">PŘEZDÍVKA (3–24 znaků)</label>
        <input
          id="reg-nickname"
          className="auth-input"
          type="text"
          autoComplete="username"
          value={form.nickname}
          onChange={set('nickname')}
          disabled={isPending}
          required
          placeholder="Přezdívka_01"
          pattern="^[a-zA-Z0-9_]{3,24}$"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password" className="auth-label">HESLO</label>
        <input
          id="reg-password"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          disabled={isPending}
          required
          placeholder="min. 8 znaků"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password-confirm" className="auth-label">HESLO ZNOVU</label>
        <input
          id="reg-password-confirm"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          value={form.passwordConfirm}
          onChange={set('passwordConfirm')}
          disabled={isPending}
          required
          placeholder="••••••••"
        />
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <button className="auth-submit btn" type="submit" disabled={isPending}>
        {isPending ? 'INICIALIZACE IDENTITY...' : 'REGISTROVAT SUBJEKT'}
      </button>

      <p className="auth-switch">
        Existující subjekt?{' '}
        <Link href="/login" className="auth-link">PŘIHLÁSIT SE</Link>
      </p>
      <p className="auth-switch">
        <Link href="/" className="auth-link">← ZPĚT NA SYNTHOMA</Link>
      </p>
    </form>
  );
}
