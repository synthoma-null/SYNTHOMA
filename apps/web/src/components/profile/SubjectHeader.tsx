'use client';

interface Props {
  nickname: string;
  title: string;
  createdAt: string;
  choiceCount: number;
  readingCount: number;
  mnemBalance: number;
}

export default function SubjectHeader({ nickname, title, createdAt, choiceCount, readingCount, mnemBalance }: Props) {
  const since = new Date(createdAt).toLocaleDateString('cs-CZ');

  return (
    <aside className="subject-header" aria-label="Identita subjektu">
      <div className="subject-header__signal" aria-hidden="true"><span /><span /><span /><span /></div>
      <p className="subject-log-label">SUBJECT // VERIFIED</p>
      <h1 className="subject-nickname">{nickname}</h1>
      <p className="subject-role-title">{title}</p>
      <span className="subject-verification"><i aria-hidden="true" /> VERIFIED</span>

      <dl className="subject-stats">
        <div className="subject-stat"><dt>MNEM</dt><dd>{mnemBalance}</dd></div>
        <div className="subject-stat"><dt>ROZHODNUTÍ</dt><dd>{choiceCount}</dd></div>
        <div className="subject-stat"><dt>FRAGMENTY</dt><dd>{readingCount}</dd></div>
        <div className="subject-stat"><dt>PRVNÍ SYNC</dt><dd>{since}</dd></div>
      </dl>

      <p className="subject-system-status"><span>SYSTÉMOVÝ STAV</span>Identita konzistentní. Odchylky přijatelné.</p>
    </aside>
  );
}
