'use client';

import { useState } from 'react';

interface Profile {
  publicProfile: boolean;
  showPsycheMap: boolean;
  showProgress: boolean;
  showChoices: boolean;
}

interface Props {
  profile: Profile | null;
}

export default function PrivacyPanel({ profile: initial }: Props) {
  const [profile, setProfile] = useState<Profile>(
    initial ?? {
      publicProfile: false,
      showPsycheMap: false,
      showProgress: true,
      showChoices: false,
    },
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const toggle = (key: keyof Profile) =>
    setProfile((p) => ({ ...p, [key]: !p[key] }));

  const save = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/me/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setStatus(res.ok ? 'saved' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const handleExport = () => {
    window.location.href = '/api/me/export';
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    const res = await fetch('/api/me/delete', { method: 'DELETE' });
    if (res.ok) {
      window.location.href = '/';
    }
  };

  const toggleItems: { key: keyof Profile; label: string; desc: string }[] = [
    { key: 'publicProfile', label: 'Veřejný profil', desc: 'Zobrazit profil na /u/přezdívka' },
    { key: 'showPsycheMap', label: 'Veřejná psychémapa', desc: 'Zobrazit psychometrickou mapu veřejně' },
    { key: 'showProgress', label: 'Veřejný postup', desc: 'Zobrazit čtenářský postup veřejně' },
    { key: 'showChoices', label: 'Veřejná rozhodnutí', desc: 'Zobrazit historii voleb veřejně' },
  ];

  return (
    <section className="privacy-panel">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [PRIVACY_CONFIG]:</span>
        <span className="psyche-log-msg">&#8222;Soukromí subjektu. Vše je defaultně soukromé.&#8220;</span>
      </div>

      <div className="privacy-toggles">
        {toggleItems.map(({ key, label, desc }) => (
          <div key={key} className="privacy-row">
            <div className="privacy-row-text">
              <span className="privacy-row-label">{label}</span>
              <span className="privacy-row-desc">{desc}</span>
            </div>
            <button
              className={`toggle-btn${profile[key] ? ' active' : ''}`}
              onClick={() => toggle(key)}
              aria-pressed={profile[key] ? 'true' : 'false'}
            >
              {profile[key] ? 'ZAP' : 'VYP'}
            </button>
          </div>
        ))}
      </div>

      <button className="btn settings-save" onClick={save} disabled={status === 'saving'}>
        {status === 'saving' ? 'UKLÁDÁM...' : status === 'saved' ? '✓ ULOŽENO' : 'ULOŽIT SOUKROMÍ'}
      </button>
      {status === 'error' && <p className="settings-error">Chyba uložení.</p>}

      <div className="privacy-data">
        <h2 className="mnem-section-title">DATA & BEZPEČNOST</h2>
        <button className="btn privacy-export-btn" onClick={handleExport}>
          EXPORTOVAT DATA (JSON)
        </button>
        <button
          className={`btn privacy-delete-btn${deleteConfirm ? ' danger' : ''}`}
          onClick={handleDelete}
        >
          {deleteConfirm ? '⚠ POTVRDIT SMAZÁNÍ IDENTITY' : 'SMAZAT ÚČET'}
        </button>
        {deleteConfirm && (
          <p className="privacy-delete-warn">
            Tato akce je nevratná. Všechna data budou trvale smazána.
          </p>
        )}
      </div>
    </section>
  );
}
