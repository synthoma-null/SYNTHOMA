'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../src/lib/LangContext';

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useLang();
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setError('');
    setIsPending(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t('auth.register.error.generic'));
        return;
      }
      await signIn('credentials', {
        identifier: form.nickname,
        password: form.password,
        redirect: false,
      });
      router.replace('/?login=1');
      router.refresh();
    } catch {
      setError(t('auth.register.network'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-log">
        <span className="auth-log-prefix">LOG [SUBJECT_REGISTRATION]:</span>
        <span className="auth-log-msg">&#8222;{t('auth.register.log')}&#8220;</span>
      </div>

      <div className="auth-field">
        <label htmlFor="reg-email" className="auth-label">{t('auth.register.email')}</label>
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
        <label htmlFor="reg-nickname" className="auth-label">{t('auth.register.nickname')}</label>
        <input
          id="reg-nickname"
          className="auth-input"
          type="text"
          autoComplete="username"
          value={form.nickname}
          onChange={set('nickname')}
          disabled={isPending}
          required
          placeholder="Nickname_01"
          pattern="^[a-zA-Z0-9_]{3,24}$"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password" className="auth-label">{t('auth.register.password')}</label>
        <input
          id="reg-password"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          disabled={isPending}
          required
          placeholder={t('auth.register.password.placeholder')}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password-confirm" className="auth-label">{t('auth.register.passwordConfirm')}</label>
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
        {isPending ? t('auth.register.pending') : t('auth.register.submit')}
      </button>

      <p className="auth-switch">
        {t('auth.register.switch')}{' '}
        <Link href="/login" className="auth-link">{t('id.login')}</Link>
      </p>
      <p className="auth-switch">
        <Link href="/" className="auth-link">{t('auth.register.back')}</Link>
      </p>
    </form>
  );
}
