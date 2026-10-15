'use client'
import React, { useState, useEffect } from 'react';
import { useAcademy } from '@/context/AcademyContext';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroModal: React.FC = () => {
  const { activeModal, setActiveModal } = useAcademy();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Timer loop: ticks down while running, and auto-advances to the next
  // phase when the countdown reaches zero.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional timer/phase-advance state updates */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'focus') {
        setCompletedSessions(p => p + 1);
        setMode('shortBreak');
        setTimeLeft(MODE_DURATIONS.shortBreak);
      } else {
        setMode('focus');
        setTimeLeft(MODE_DURATIONS.focus);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (activeModal !== 'pomodoro') return null;

  const total = MODE_DURATIONS[mode];
  const progressPct = ((total - timeLeft) / total) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const switchMode = (m: TimerMode) => {
    setMode(m);
    setTimeLeft(MODE_DURATIONS[m]);
    setIsRunning(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal('none')}>
      <div
        className="modal-box"
        style={{ maxWidth: 460, textAlign: 'center' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">🍅 Focus / Pomodoro Timer</div>
            <div className="modal-sub">Deep work study sessions for maximum retention</div>
          </div>
          <button className="modal-close" onClick={() => setActiveModal('none')}>✕</button>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {/* Mode Selector */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
            <button
              className={`alpha-btn ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => switchMode('focus')}
            >
              25m Focus
            </button>
            <button
              className={`alpha-btn ${mode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => switchMode('shortBreak')}
            >
              5m Break
            </button>
            <button
              className={`alpha-btn ${mode === 'longBreak' ? 'active' : ''}`}
              onClick={() => switchMode('longBreak')}
            >
              15m Long Break
            </button>
          </div>

          {/* Big Time Display */}
          <div className="pomodoro-display">
            <div className="pomodoro-time">{formattedTime}</div>
            <div className="pomodoro-mode-label">
              {mode === 'focus' ? '🎯 Focus Session' : '☕ Rest & Refresh'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="dash-bar-bg" style={{ margin: '20px 0', height: 8 }}>
            <div className="dash-bar-fill" style={{ width: `${progressPct}%`, transition: 'width 1s linear' }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button
              className="sb-btn"
              onClick={() => setIsRunning(p => !p)}
              style={{ minWidth: 120, fontSize: 14 }}
            >
              {isRunning ? '⏸ Pause' : '▶ Start Focus'}
            </button>
            <button
              className="quick-mark-btn"
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(MODE_DURATIONS[mode]);
              }}
            >
              ↺ Reset
            </button>
          </div>

          {/* Footer Stats */}
          <div style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <span>Sessions completed today: <b>{completedSessions}</b></span>
            <span>Est. Focus: <b>{completedSessions * 25} mins</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};
