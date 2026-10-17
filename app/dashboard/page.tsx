'use client'
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Spotlight } from '@/components/ui/spotlight';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { FlipWords } from '@/components/ui/flip-words';

export default function DashboardPage() {
  const {
    completedLessons,
    completedQuizzes,
    examScore,
    canTakeExam,
    canClaimCertificate,
    isAdmin,
    bookmarks,
    streak,
    studyDays,
    toggleTheme,
    setCurrentLessonIndex,
    unlockedAchievements,
    totalXp,
  } = useAcademy();

  // All distinct modules
  const modules = useMemo(() => {
    const list: { name: string; total: number; done: number; lessons: typeof LESSONS }[] = [];
    LESSONS.forEach(l => {
      let m = list.find(item => item.name === l.m);
      if (!m) {
        m = { name: l.m, total: 0, done: 0, lessons: [] };
        list.push(m);
      }
      m.total++;
      m.lessons.push(l);
      if (completedLessons[l.id]) m.done++;
    });
    return list;
  }, [completedLessons]);

  const totalCompleted = Object.keys(completedLessons).length;
  const progressPercent = Math.round((totalCompleted / LESSONS.length) * 100);
  const bookmarksList = useMemo(() => {
    return LESSONS.filter(l => bookmarks[l.id]);
  }, [bookmarks]);

  // Role readiness scores
  const roleScores = useMemo(() => {
    const roles = {
      frontend: { label: 'Frontend & UI', total: 0, done: 0 },
      backend:  { label: 'Backend & APIs', total: 0, done: 0 },
      devops:   { label: 'DevOps & Infra', total: 0, done: 0 },
    };
    LESSONS.forEach(l => {
      l.r.forEach(r => {
        if (r in roles) {
          const roleKey = r as keyof typeof roles;
          roles[roleKey].total++;
          if (completedLessons[l.id]) roles[roleKey].done++;
        }
      });
    });
    return roles;
  }, [completedLessons]);

  // Level computation based on XP
  const level = Math.floor(totalXp / 300) + 1;
  const currentLevelXp = totalXp % 300;
  const nextLevelXp = 300;
  const levelProgressPct = Math.round((currentLevelXp / nextLevelXp) * 100);

  return (
    <div className="standalone-page">
      {/* Header */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>P</i>
            <span>Learning Dashboard</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/final-exam" className="t">🎓 Final Exam</Link>
            <Link href="/certificate" className="t">📜 Certificate</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="standalone-main relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#f97316" />
        <div className="wrap relative z-10" style={{ maxWidth: 1040 }}>
          <div className="kick">Analytics &amp; Mastery</div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Learning Trajectory</h1>
          <div className="lead" style={{ marginBottom: 24 }}>
            Comprehensive breakdown of your Payload 3.x mastery in{' '}
            <FlipWords words={['Next.js App Router', 'Lexical AST Rich Text', 'PostgreSQL & Drizzle', 'Custom RBAC Matrix', 'Live Preview Studio']} />
          </div>

          {/* Upgrade Banner — shown when not yet certified */}
          {!canClaimCertificate && (
            <div className="upgrade-banner">
              <div className="upgrade-banner-text">
                <strong>🚀 Unlock the Full Payload Academy</strong> — Get all {LESSONS.length} lessons, interactive tools, Final Exam &amp; your Certificate of Mastery.
                Plans from <strong>$19/month</strong> or <strong>$99/year</strong> · 30-day money-back guarantee.
              </div>
              <Link href="/pricing" className="upgrade-banner-cta">
                View Plans &amp; Pricing →
              </Link>
            </div>
          )}

          {/* Top Metric Cards (Aceternity CardSpotlight) */}
          <div className="dash-metrics-grid">
            <CardSpotlight className="dash-metric-card">
              <span className="dash-metric-icon">🚀</span>
              <div className="dash-metric-val">{progressPercent}%</div>
              <div className="dash-metric-label">{totalCompleted} of {LESSONS.length} Lessons Completed</div>
              <div className="dash-bar-bg" style={{ marginTop: 10 }}>
                <div className="dash-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </CardSpotlight>

            <CardSpotlight className="dash-metric-card">
              <span className="dash-metric-icon">🔥</span>
              <div className="dash-metric-val">{streak} Days</div>
              <div className="dash-metric-label">Current Study Streak</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                {studyDays.length} active study {studyDays.length === 1 ? 'day' : 'days'} recorded
              </div>
            </CardSpotlight>

            <CardSpotlight className="dash-metric-card">
              <span className="dash-metric-icon">⚡</span>
              <div className="dash-metric-val">Lvl {level}</div>
              <div className="dash-metric-label">{totalXp} Total XP Earned</div>
              <div className="dash-bar-bg" style={{ marginTop: 10 }}>
                <div className="dash-bar-fill" style={{ width: `${levelProgressPct}%`, background: 'linear-gradient(90deg, #eab308, #f59e0b)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                {currentLevelXp}/{nextLevelXp} XP to Level {level + 1}
              </div>
            </CardSpotlight>

            <CardSpotlight className="dash-metric-card">
              <span className="dash-metric-icon">🎓</span>
              <div className="dash-metric-val">
                {examScore !== null && examScore >= 80
                  ? '🏆 Certified'
                  : (isAdmin ? 'Admin Mode' : (canTakeExam ? 'Exam Ready' : `${progressPercent}%`))}
              </div>
              <div className="dash-metric-label">
                {examScore !== null
                  ? `Passed with ${examScore}% (≥ 80%)`
                  : canTakeExam
                  ? 'Ready for Final Exam'
                  : `${Object.keys(completedQuizzes).length}/${LESSONS.length} Quizzes Passed`}
              </div>
              <div style={{ marginTop: 8 }}>
                {canClaimCertificate ? (
                  <Link href="/certificate" className="dash-link-btn" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    🏆 View Certificate →
                  </Link>
                ) : canTakeExam ? (
                  <Link href="/final-exam" className="dash-link-btn">
                    🎓 Start Final Exam →
                  </Link>
                ) : (
                  <Link href="/" className="dash-link-btn">
                    📖 Continue Learning →
                  </Link>
                )}
              </div>
            </CardSpotlight>
          </div>

          {/* ═══════════ GAMIFIED MILESTONE BADGES ═══════════ */}
          <div className="dash-section-card" style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 className="dash-section-title" style={{ margin: 0 }}>🏆 Milestone Badges &amp; Achievements</h2>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  Unlocked {unlockedAchievements.length} of {ACHIEVEMENTS.length} mastery achievements
                </div>
              </div>
              <span className="chip" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', borderColor: 'rgba(234, 179, 8, 0.3)', fontWeight: 700 }}>
                ⚡ {totalXp} XP
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {ACHIEVEMENTS.map(ach => {
                const isUnlocked = unlockedAchievements.some(a => a.id === ach.id);
                const rarityColor = ach.rarity === 'legendary' ? '#ec4899' : ach.rarity === 'epic' ? '#a855f7' : ach.rarity === 'rare' ? '#3b82f6' : '#10b981';

                return (
                  <div
                    key={ach.id}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${isUnlocked ? 'var(--border)' : 'rgba(255,255,255,0.06)'}`,
                      background: isUnlocked ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.2)',
                      opacity: isUnlocked ? 1 : 0.45,
                      filter: isUnlocked ? 'none' : 'grayscale(80%)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      position: 'relative',
                    }}
                  >
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{ach.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{ach.title}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: rarityColor, textTransform: 'uppercase' }}>
                          +{ach.xp} XP
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>
                        {ach.description}
                      </div>
                      <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: isUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: isUnlocked ? '#10b981' : 'var(--muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {isUnlocked ? '✓ UNLOCKED' : 'LOCKED'}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: '1px 5px',
                            borderRadius: 4,
                            background: 'rgba(0,0,0,0.3)',
                            color: rarityColor,
                            textTransform: 'uppercase',
                          }}
                        >
                          {ach.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Readiness Section */}
          <div className="dash-section-card" style={{ marginTop: 28 }}>
            <h2 className="dash-section-title">💼 Role Competency Breakdown</h2>
            <div className="dash-roles-grid">
              {Object.entries(roleScores).map(([key, item]) => {
                const pct = Math.round((item.done / (item.total || 1)) * 100);
                return (
                  <div key={key} className="dash-role-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="dash-bar-bg">
                      <div className="dash-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                      {item.done}/{item.total} required topics mastered
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module-by-Module Progress */}
          <div className="dash-section-card" style={{ marginTop: 28 }}>
            <h2 className="dash-section-title">📚 Curriculum Mastery by Module</h2>
            <div className="dash-modules-list">
              {modules.map(mod => {
                const modPct = Math.round((mod.done / mod.total) * 100);
                const isComplete = mod.done === mod.total;
                return (
                  <div key={mod.name} className="dash-mod-row">
                    <div className="dash-mod-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`dash-mod-status ${isComplete ? 'done' : ''}`}>
                          {isComplete ? '✓' : `${mod.done}/${mod.total}`}
                        </span>
                        <span className="dash-mod-name">{mod.name}</span>
                      </div>
                      <span className="dash-mod-pct">{modPct}%</span>
                    </div>
                    <div className="dash-bar-bg">
                      <div
                        className="dash-bar-fill"
                        style={{
                          width: `${modPct}%`,
                          background: isComplete ? 'var(--green)' : 'var(--accent)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Developer Tools Grid (Aceternity BentoGrid) */}
          <div className="dash-section-card" style={{ marginTop: 28 }}>
            <h2 className="dash-section-title">⚡ Interactive Developer Workbench</h2>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
              Specialized interactive studios for exploring Payload CMS architecture and debugging.
            </div>

            <BentoGrid className="max-w-full">
              <Link href="/live-preview-simulator" style={{ textDecoration: 'none' }} className="md:col-span-2">
                <BentoGridItem
                  title="Live Preview Simulator"
                  description="Split-screen simulator of the postMessage preview flow with multi-device viewports."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">🖥️</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">PREVIEW SIM</span>}
                />
              </Link>

              <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
                <BentoGridItem
                  title="XP Leaderboard"
                  description="See where you rank against other learners by total XP, lessons completed and streaks."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">🏆</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">RANKED</span>}
                />
              </Link>

              <Link href="/rbac-matrix" style={{ textDecoration: 'none' }}>
                <BentoGridItem
                  title="Visual RBAC Matrix"
                  description="Simulate user personas, inspect RLS SQL queries & generate access functions."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">🛡️</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">SECURITY</span>}
                />
              </Link>

              <Link href="/lexical-inspector" style={{ textDecoration: 'none' }}>
                <BentoGridItem
                  title="Lexical AST Inspector"
                  description="Inspect JSON Abstract Syntax Trees, custom blocks, and React Server Component serializers."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">📜</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">RICH TEXT</span>}
                />
              </Link>

              <Link href="/schema-builder" style={{ textDecoration: 'none' }}>
                <BentoGridItem
                  title="Visual Schema Studio"
                  description="Design Collections, generate types & preview the Admin UI instantly."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">⚙️</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">COLLECTIONS</span>}
                />
              </Link>

              <Link href="/query-simulator" style={{ textDecoration: 'none' }}>
                <BentoGridItem
                  title="Query & REST Simulator"
                  description="Test Local API, REST with cURL & GraphQL with simulated database responses."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">🧪</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">API TESTING</span>}
                />
              </Link>

              <Link href="/config-linter" style={{ textDecoration: 'none' }} className="md:col-span-2">
                <BentoGridItem
                  title="Config & Security Linter"
                  description="Audit your payload.config.ts for security vulnerabilities and 100% production readiness."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">🔒</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">SECURITY AUDIT</span>}
                />
              </Link>

              <Link href="/db-visualizer" style={{ textDecoration: 'none' }}>
                <BentoGridItem
                  title="Drizzle SQL Visualizer"
                  description="Map Collections to PostgreSQL DDL, indices, foreign keys & migrations."
                  header={
                    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 border border-cyan-500/20 p-4 items-center justify-center">
                      <span className="text-4xl">🗄️</span>
                    </div>
                  }
                  icon={<span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">DATABASE</span>}
                />
              </Link>
            </BentoGrid>
          </div>

          {/* Bookmarks & Saved Notes */}
          {bookmarksList.length > 0 && (
            <div className="dash-section-card" style={{ marginTop: 28 }}>
              <h2 className="dash-section-title">🔖 Bookmarked Lessons for Review</h2>
              <div className="dash-bookmarks-grid">
                {bookmarksList.map(l => (
                  <Link
                    key={l.id}
                    href="/"
                    onClick={() => {
                      const idx = LESSONS.indexOf(l);
                      if (idx >= 0) setCurrentLessonIndex(idx);
                    }}
                    className="dash-bookmark-item"
                  >
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{l.m}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: '2px 0 6px' }}>{l.t}</div>
                    <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>Open Lesson →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
