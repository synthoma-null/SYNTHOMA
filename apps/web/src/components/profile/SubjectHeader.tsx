'use client';

interface Props {
  nickname: string;
  title: string;
  choiceCount: number;
  readingCount: number;
  mnemBalance: number;
}

export default function SubjectHeader({ nickname, title, choiceCount, readingCount, mnemBalance }: Props) {
  return (
    <header className="subject-header" aria-label="Identita subjektu">
      <div className="subject-header__identity">
        <p className="subject-log-label">SUBJECT // VERIFIED</p>
        <h1 className="subject-nickname">{nickname}</h1>
        <p className="subject-role-title">{title}</p>
        <span className="subject-verification"><i aria-hidden="true" /> VERIFIED</span>
      </div>

      <dl className="subject-stats" aria-label="Hlavní údaje subjektu">
        <div className="subject-stat"><dt>MNEM</dt><dd>{mnemBalance}</dd></div>
        <div className="subject-stat"><dt>ROZHODNUTÍ</dt><dd>{choiceCount}</dd></div>
        <div className="subject-stat"><dt>FRAGMENTY</dt><dd>{readingCount}</dd></div>
      </dl>
    </header>
  );
}
