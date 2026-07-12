export type SynthomaCommandIconName = 'home' | 'library' | 'archive' | 'cyklus' | 'identity' | 'settings' | 'audio';

export default function SynthomaCommandIcon({ name }: { name: SynthomaCommandIconName }) {
  if (name === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6"/></svg>;
  if (name === 'library') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22Z"/><path d="M4 5.5V22M8 6h8M8 10h7"/></svg>;
  if (name === 'archive') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v14H4Z"/><path d="M3 3h18v4H3ZM9 11h6"/></svg>;
  if (name === 'cyklus') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M18.5 15.5A8 8 0 1 1 20 12"/><path d="m20 12-3.5-3.5"/></svg>;
  if (name === 'identity') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
  if (name === 'settings') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6.2L14.7 3h-4L10 6.2a7 7 0 0 0-1.6.9l-2.3-1-2 3.4L6.2 11a7 7 0 0 0 0 2l-2.1 1.5 2 3.4 2.3-1a7 7 0 0 0 1.6.9l.7 3.2h4l.3-3.2a7 7 0 0 0 1.6-.9l2.3 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>;
}
