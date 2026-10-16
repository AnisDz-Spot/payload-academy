'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  isPro: boolean;
  completedLessons: number;
  streak: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user, totalXp, openAuthModal } = useAcademy();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(data?.error || 'Failed to load leaderboard');
        setEntries(data.entries || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load leaderboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const myRank = user ? entries.findIndex((e) => e.userId === user.id) : -1;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ marginBottom: 8 }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 13 }}>← Back to dashboard</Link>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 6px', letterSpacing: '-0.5px', color: 'var(--text)' }}>
        🏆 XP Leaderboard
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Ranked by total XP earned from completed lessons, passed quizzes, study streaks, notes and certifications.
      </p>

      {user && myRank >= 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: 'var(--text)' }}>Your rank: <strong>#{myRank + 1}</strong> of {entries.length}</span>
          <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>⚡ {totalXp} XP</span>
        </div>
      )}

      {!user && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: 'var(--muted)' }}>
          <button
            onClick={() => openAuthModal('login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0, font: 'inherit' }}
          >
            Sign in
          </button>{' '}
          to record your XP and appear on the leaderboard.
        </div>
      )}

      {loading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading rankings…</div>}

      {error && !loading && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, fontSize: 14, color: 'var(--muted)' }}>
          Couldn&apos;t load the leaderboard right now ({error}).
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, fontSize: 14, color: 'var(--muted)' }}>
          No rankings yet — be the first to complete a lesson!
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          {entries.map((entry, i) => {
            const isMe = user?.id === entry.userId;
            return (
              <div
                key={entry.userId}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                  background: isMe ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--card)',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <div style={{ width: 34, textAlign: 'center', fontWeight: 800, fontSize: 14, color: 'var(--muted)' }}>
                  {MEDALS[i] || `#${i + 1}`}
                </div>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #FB923C, #EA580C)', color: '#fff',
                  display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14,
                }}>
                  {(entry.name?.[0] || '?').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.name}{isMe ? ' (you)' : ''}{entry.isPro ? ' ✦' : ''}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Lvl {entry.level} · {entry.completedLessons} lessons{entry.streak > 1 ? ` · 🔥 ${entry.streak}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                  ⚡ {entry.xp}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
