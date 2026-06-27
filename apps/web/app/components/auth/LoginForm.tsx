'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../src/lib/LangContext';

export default function LoginForm() {
  const router = useRouter();
  const { t } = useLang();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setError('');
    setIsPending(true);
    try {
      const res = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        const code = res?.error ?? 'unknown';
        setError(`${t('auth.login.error')} (${code})`);
      } else {
        // Navigate home, then open profile popup after session propagates
        router.replace('/?login=1');
        router.refresh();
      }
    } catch {
      setError(t('auth.login.network'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-log">
        <span className="auth-log-prefix">LOG [AUTH_GATE]:</span>
        <span className="auth-log-msg">&#8222;{t('auth.login.log')}&#8220;</span>
      </div>

      <div className="auth-field">
        <label htmlFor="auth-identifier" className="auth-label">{t('auth.login.identifier')}</label>
        <input
          id="auth-identifier"
          className="auth-input"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          disabled={isPending}
          required
          placeholder={t('auth.login.identifier.placeholder')}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password" className="auth-label">{t('auth.login.password')}</label>
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
        {isPending ? t('auth.login.pending') : t('auth.login.submit')}
      </button>

      <p className="auth-switch">
        {t('auth.login.switch')}{' '}
        <Link href="/register" className="auth-link">{t('id.register')}</Link>
      </p>
      <p className="auth-switch">
        <Link href="/" className="auth-link">{t('auth.login.back')}</Link>
      </p>
    </form>
  );
}
