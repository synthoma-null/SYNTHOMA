'use client';

import { useState } from 'react';
import { useLang } from '../../lib/LangContext';

export default function PrivacyPanel() {
  const { t } = useLang();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleExport = () => {
    window.location.href = '/api/me/export';
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setDeleteError(null);
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/me/delete', { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Účet se nepodařilo smazat.');
      }
      window.location.href = '/';
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Účet se nepodařilo smazat.');
      setDeleting(false);
    }
  };

  return (
    <section className="privacy-panel">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [PRIVACY_CONFIG]:</span>
        <span className="psyche-log-msg">Soukromý profil. Data se veřejně nezobrazují.</span>
      </div>

      <div className="privacy-data">
        <h2 className="mnem-section-title">{t('privacy.data.title')}</h2>
        <button className="btn privacy-export-btn" onClick={handleExport}>
          {t('privacy.export')}
        </button>
        <button
          className={`btn privacy-delete-btn${deleteConfirm ? ' danger' : ''}`}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'MAŽU…' : deleteConfirm ? t('privacy.delete.confirm') : t('privacy.delete')}
        </button>
        {deleteConfirm && !deleting && (
          <button
            className="btn privacy-export-btn"
            type="button"
            onClick={() => { setDeleteConfirm(false); setDeleteError(null); }}
          >
            ZRUŠIT
          </button>
        )}
        {deleteConfirm && (
          <p className="privacy-delete-warn">
            {t('privacy.delete.warn')}
          </p>
        )}
        {deleteError && <p className="privacy-delete-warn" role="alert">{deleteError}</p>}
      </div>
    </section>
  );
}
