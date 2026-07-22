'use client';

import { useEffect, useState } from 'react';
import { getConsent, saveConsent } from '../../lib/consent';
import { useLang } from '../../lib/LangContext';

type Prefs = {
  preferences: boolean;
  analytics: boolean;
  readerTrace: boolean;
};

export default function CookieConsent() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ preferences: true, analytics: false, readerTrace: false });

  useEffect(() => {
    if (!getConsent()) {
      setShow(true);
    }
  }, []);

  const accept = (state: Prefs) => {
    saveConsent(state);
    setShow(false);
    setDetail(false);
  };

  if (!show) return null;

  return (
    <div className="cc-overlay" role="dialog" aria-modal="true" aria-label={t('cc.aria')}>
      <div className="cc-panel os-surface--glass">
        <div className="cc-log">
          <span className="cc-log-prefix">{t('cc.log.prefix')}</span>
          <span className="cc-log-msg">{t('cc.log.msg')}</span>
        </div>

        {!detail ? (
          <>
            <p className="cc-body">
              {t('cc.body')}
            </p>
            <p className="cc-body cc-flavor">
              {t('cc.flavor')}
            </p>
            <div className="cc-actions">
              <button
                className="cc-btn cc-btn-primary"
                onClick={() => accept({ preferences: true, analytics: true, readerTrace: true })}
              >
                {t('cc.accept.all')}
              </button>
              <button
                className="cc-btn cc-btn-secondary"
                onClick={() => accept({ preferences: false, analytics: false, readerTrace: false })}
              >
                {t('cc.accept.necessary')}
              </button>
              <button
                className="cc-btn cc-btn-ghost"
                onClick={() => setDetail(true)}
              >
                {t('cc.configure')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cc-categories">
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.necessary')}</span>
                  <span className="cc-cat-badge cc-always">{t('cc.cat.always')}</span>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.necessary.desc')}</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.preferences')}</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.preferences}
                      aria-label={t('cc.cat.preferences')}
                      onChange={e => setPrefs(p => ({ ...p, preferences: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.preferences.desc')}</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.analytics')}</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      aria-label={t('cc.cat.analytics')}
                      onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.analytics.desc')}</p>
              </div>
              <div className="cc-category">
                <div className="cc-cat-header">
                  <span className="cc-cat-name">{t('cc.cat.reader')}</span>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={prefs.readerTrace}
                      aria-label={t('cc.cat.reader')}
                      onChange={e => setPrefs(p => ({ ...p, readerTrace: e.target.checked }))}
                    />
                    <span className="cc-toggle-slider" />
                  </label>
                </div>
                <p className="cc-cat-desc">{t('cc.cat.reader.desc')}</p>
              </div>
            </div>
            <div className="cc-actions">
              <button className="cc-btn cc-btn-primary" onClick={() => accept(prefs)}>
                {t('cc.save')}
              </button>
              <button
                className="cc-btn cc-btn-ghost"
                onClick={() => setDetail(false)}
              >
                {t('cc.back')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
