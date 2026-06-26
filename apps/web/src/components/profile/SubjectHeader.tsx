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
    <header className="subject-header">
      <div className="subject-header-inner">
        <div className="subject-title-block">
          <p className="subject-log-label">LOG [SUBJECT_LOADED]:</p>
          <h1 className="subject-nickname glitch" data-text={nickname}>{nickname}</h1>
          <p className="subject-role-title">{title}</p>
        </div>
        <dl className="subject-stats">
          <div className="subject-stat">
            <dt>ARCHIVNÍ STOPA</dt>
            <dd>{mnemBalance} mnemů</dd>
          </div>
          <div className="subject-stat">
            <dt>FRAGMENTY</dt>
            <dd>{readingCount}</dd>
          </div>
          <div className="subject-stat">
            <dt>ROZHODNUTÍ</dt>
            <dd>{choiceCount}</dd>
          </div>
          <div className="subject-stat">
            <dt>PRVNÍ SYNCHRONIZACE</dt>
            <dd>{since}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
