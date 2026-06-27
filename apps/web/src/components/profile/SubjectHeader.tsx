'use client';

import { useLang } from '../../lib/LangContext';

interface Props {
  nickname: string;
  title: string;
  createdAt: string;
  choiceCount: number;
  readingCount: number;
  mnemBalance: number;
}

export default function SubjectHeader({ nickname, title, createdAt, choiceCount, readingCount, mnemBalance }: Props) {
  const { t } = useLang();
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
            <dt>{t('subject.stat.archiveTrace')}</dt>
            <dd>{mnemBalance} mnems</dd>
          </div>
          <div className="subject-stat">
            <dt>{t('subject.stat.fragments')}</dt>
            <dd>{readingCount}</dd>
          </div>
          <div className="subject-stat">
            <dt>{t('subject.stat.decisions')}</dt>
            <dd>{choiceCount}</dd>
          </div>
          <div className="subject-stat">
            <dt>{t('subject.stat.firstSync')}</dt>
            <dd>{since}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
