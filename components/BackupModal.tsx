'use client'
import React, { useState } from 'react';
import { useAcademy } from '@/context/AcademyContext';

export const BackupModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    completedLessons,
    userNotes,
  } = useAcademy();

  const isOpen = activeModal === 'backup';
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      version: '3.x',
      exportDate: new Date().toISOString(),
      done: completedLessons,
      notes: userNotes,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus('✅ Backup exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.done) localStorage.setItem('pa-done', JSON.stringify(parsed.done));
        if (parsed.notes) localStorage.setItem('pa-notes', JSON.stringify(parsed.notes));
        setStatus('✅ Backup restored! Reloading page...');
        setTimeout(() => window.location.reload(), 800);
      } catch {
        setStatus('❌ Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal('none'); }}>
        <div className="modal" style={{ maxWidth: 560 }} role="dialog" aria-modal="true" aria-label="Backup and restore progress">
        <div className="modal-head">
          <h2>💾 Progress &amp; Notes Backup</h2>
          <button className="modal-close" aria-label="Close" onClick={() => setActiveModal('none')}>&times;</button>
        </div>
        <div className="backup-modal-body">
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
            Export your complete learning history, completed lessons, and personal notes to a JSON backup file or restore from a previous session.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="sb-btn" onClick={handleExport}>⬇ Export Backup (.json)</button>
            <label className="sb-btn sec" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
              ⬆ Restore from File
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
          {status && <div style={{ fontSize: 13, color: 'var(--green)', marginTop: 8 }}>{status}</div>}
        </div>
      </div>
    </div>
  );
};
