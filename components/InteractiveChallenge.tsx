'use client'
import React, { useState } from 'react';
import { Challenge } from '@/data/types';
import { useAcademy } from '@/context/AcademyContext';
import { getChallengeSpec } from '@/data/challengeSuite';
import { playSuccessChime } from '@/lib/sound';

interface Props {
  lessonId: string;
  challenge: Challenge;
}

export const InteractiveChallenge: React.FC<Props> = ({ lessonId, challenge }) => {
  const { toggleComplete, completedLessons, soundEnabled } = useAcademy();
  const spec = getChallengeSpec(lessonId);
  const defaultStarter = challenge.starterCode || spec.starterCode;

  const [code, setCode] = useState(defaultStarter);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{ passed: boolean; message: string; details?: string[] } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const [lastLesson, setLastLesson] = useState(lessonId);
  if (lastLesson !== lessonId) {
    setLastLesson(lessonId);
    setCode(defaultStarter);
    setTestResult(null);
    setShowHint(false);
  }

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/challenge/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, code: code.trim() }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setTestResult({
          passed: false,
          message: '🔒 Sign in to your account to run graded challenges.',
        });
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Grading service unavailable.');
      }

      const checks: { passed: boolean; label: string; hint?: string }[] = data.checks || [];
      const syntaxErrors: string[] = data.syntaxErrors || [];

      if (syntaxErrors.length > 0) {
        setTestResult({
          passed: false,
          message: '⛔ Syntax error — fix your TypeScript before tests can run:',
          details: syntaxErrors.map((e) => `✗ ${e}`),
        });
        return;
      }

      if (data.passed) {
        if (soundEnabled) playSuccessChime();
        setTestResult({
          passed: true,
          message: '🎉 All Verification Tests Passed! Excellent engineering.',
          details: checks.map((c) => `✓ ${c.label}`),
        });
        if (!completedLessons[lessonId]) {
          toggleComplete(lessonId);
        }
      } else {
        setTestResult({
          passed: false,
          message: '⚠️ Test verification failed. Requirements missing:',
          details: checks.map((c) => (c.passed ? `✓ ${c.label}` : `✗ ${c.label} — Hint: ${c.hint}`)),
        });
      }
    } catch (err) {
      setTestResult({
        passed: false,
        message: `⚠️ ${err instanceof Error ? err.message : 'Could not reach the grading service.'}`,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="challenge-section-card" style={{ marginTop: 32 }}>
      <div className="challenge-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="challenge-icon" style={{ fontSize: 24 }}>⚡</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Interactive Code Challenge</h3>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Hands-on practice &amp; AST-based grading on the server</span>
          </div>
        </div>
        {challenge.docsPath && (
          <a
            href={`https://payloadcms.com/docs/${challenge.docsPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="docs-cta-link"
            style={{ fontSize: 12, padding: '4px 10px' }}
          >
            📖 Official Docs ↗
          </a>
        )}
      </div>

      <div className="try" style={{ margin: '14px 0', fontSize: 14, lineHeight: 1.6 }}>
        <b>Task:</b> {challenge.challengeText || 'Implement the schema, access rules, or hooks described in this lesson.'}
      </div>

      {/* Code Editor Container */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--code-bg)',
          marginTop: 12,
        }}
      >
        {/* Editor Toolbar */}
        <div
          style={{
            background: 'var(--card)',
            borderBottom: '1px solid var(--border)',
            padding: '8px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)', fontWeight: 600 }}>
            solution.ts (TypeScript)
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="quick-mark-btn"
              onClick={() => setCode(defaultStarter)}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              ↺ Reset Code
            </button>
            <button
              className="quick-mark-btn"
              onClick={() => setShowHint((p) => !p)}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              💡 {showHint ? 'Hide Solution' : 'Solution Hint'}
            </button>
          </div>
        </div>

        {/* Code Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={7}
          spellCheck={false}
          style={{
            width: '100%',
            background: 'transparent',
            color: 'var(--codet)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.55,
            padding: 14,
            border: 'none',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Solution Hint Box */}
      {showHint && (
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: 12, borderRadius: 6, marginTop: 10, fontSize: 12 }}>
          <b>💡 Suggested Reference Implementation:</b>
          <pre style={{ margin: '6px 0 0 0', padding: 10, background: 'var(--code-bg)', color: 'var(--codet)', borderRadius: 4, overflowX: 'auto' }}>
            <code>
              {challenge.solutionCode || spec.solutionCode}
            </code>
          </pre>
        </div>
      )}

      {/* Action & Results Bar */}
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="quick-mark-btn"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            padding: '8px 20px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {isRunning ? '⏳ Running Test Assertions...' : '▶ Run Verification Tests'}
        </button>

        {testResult && (
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              background: testResult.passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: testResult.passed ? '#10b981' : '#ef4444',
              border: `1px solid ${testResult.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            {testResult.message}
          </div>
        )}
      </div>

      {/* Test Check Details */}
      {testResult?.details && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
          {testResult.details.map((d, i) => (
            <div key={i} style={{ color: d.startsWith('✓') ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
