'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useLang } from '../../src/lib/LangContext';

export default function PasswordResetForm() {
  const { lang } = useLang();
  const en = lang === 'en';
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setToken(new URLSearchParams(window.location.hash.slice(1)).get('token') || ''); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (token && (password !== confirm || password.length < 8 || new TextEncoder().encode(password).length > 72)) {
      setError(en ? 'Use matching passwords with at least 8 characters (at most 72 bytes).' : 'Hesla se musí shodovat a mít alespoň 8 znaků (nejvýše 72 bajtů).');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/auth/password-reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(token ? { action: 'reset', token, password } : { action: 'request', email, locale: lang }) });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error === 'INVALID_TOKEN'
          ? en ? 'The link has expired or was already used. Request a new one.' : 'Odkaz vypršel nebo již byl použit. Vyžádej si nový.'
          : result.error === 'RATE_LIMITED'
            ? en ? 'Too many attempts. Try again later.' : 'Příliš mnoho pokusů. Zkus to později.'
            : en ? 'Password recovery is temporarily unavailable. Contact null1@synthoma.cz.' : 'Obnovení hesla je dočasně nedostupné. Napiš na null1@synthoma.cz.');
        return;
      }
      setDone(true);
      setPassword(''); setConfirm('');
      if (token) window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    } catch { setError(en ? 'Connection failed. Try again.' : 'Připojení selhalo. Zkus to znovu.'); }
    finally { setBusy(false); }
  }

  return <>
    <h1 className="auth-title">{en ? 'Reset password' : 'Obnovení hesla'}</h1>
    {done ? <p role="status">{token
      ? en ? 'Password changed. Sign in with your new password.' : 'Heslo bylo změněno. Přihlas se novým heslem.'
      : en ? 'If this email belongs to an account, you will receive a recovery link. Check your spam folder too.' : 'Pokud k e-mailu existuje účet, obdržíš odkaz pro obnovu. Zkontroluj také spam.'}</p>
      : <form className="auth-form" onSubmit={submit}>
        {token ? <>
          <div className="auth-field"><label htmlFor="reset-password">{en ? 'New password' : 'Nové heslo'}</label><input className="auth-input" id="reset-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="auth-field"><label htmlFor="reset-confirm">{en ? 'Repeat password' : 'Heslo znovu'}</label><input className="auth-input" id="reset-confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
        </> : <div className="auth-field"><label htmlFor="reset-email">E-mail</label><input className="auth-input" id="reset-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(e) => setEmail(e.target.value)} /></div>}
        {error && <p role="alert">{error}</p>}
        <button className="auth-submit btn" disabled={busy}>{busy ? (en ? 'Please wait…' : 'Chvilku…') : token ? (en ? 'Save password' : 'Uložit heslo') : (en ? 'Send recovery link' : 'Poslat odkaz pro obnovu')}</button>
      </form>}
    <p><Link href={en ? '/login?locale=en' : '/login'}>{en ? 'Back to sign in' : 'Zpět na přihlášení'}</Link></p>
    {token && !done && <p><a href={en ? '/reset-password?locale=en' : '/reset-password'}>{en ? 'Request a new link' : 'Vyžádat nový odkaz'}</a></p>}
  </>;
}
