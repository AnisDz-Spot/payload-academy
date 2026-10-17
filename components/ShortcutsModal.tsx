'use client'
import React from 'react';
import { useAcademy } from '@/context/AcademyContext';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'Open Command Search' },
  { keys: ['/'],         action: 'Open Command Search' },
  { keys: ['?'],         action: 'Show Keyboard Shortcuts' },
  { keys: ['→', 'J'],   action: 'Next Lesson' },
  { keys: ['←', 'K'],   action: 'Previous Lesson' },
  { keys: ['M'],         action: 'Toggle Mark as Complete' },
  { keys: ['B'],         action: 'Toggle Bookmark on Lesson' },
  { keys: ['Esc'],       action: 'Close any open modal / sidebar' },
];

export const ShortcutsModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAcademy();
  if (activeModal !== 'shortcuts') return null;

  return (
    <div className="modal-overlay" onClick={() => setActiveModal('none')}>
      <div
        className="modal-box"
        style={{ maxWidth: 440 }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">Keyboard Shortcuts</div>
            <div className="modal-sub">Navigate the academy at the speed of thought</div>
          </div>
          <button className="modal-close" aria-label="Close" onClick={() => setActiveModal('none')}>✕</button>
        </div>

        <div style={{ padding: '16px 24px 24px' }}>
          <div className="shortcuts-list">
            {SHORTCUTS.map(({ keys, action }) => (
              <div key={action} className="shortcut-row">
                <span className="shortcut-action">{action}</span>
                <div className="shortcut-keys">
                  {keys.map((k, i) => (
                    <React.Fragment key={k}>
                      {i > 0 && <span className="shortcut-or">or</span>}
                      <kbd className="kbd">{k}</kbd>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
            Press <kbd className="kbd">?</kbd> anywhere to show this panel
          </p>
        </div>
      </div>
    </div>
  );
};
