'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { FREE_LESSON_COUNT } from '@/data/curriculum';

import { FloatingDock, FloatingDockItem } from '@/components/ui/floating-dock';
import {
  BookOpen,
  LayoutDashboard,
  CreditCard,
  Database,
  Terminal,
  ShieldCheck,
  BookText,
  Award,
  Sparkles,
  Home,
  Layers,
} from 'lucide-react';

const DOCK_ITEMS: FloatingDockItem[] = [
  { title: 'Home', href: '/start', icon: <Home size={20} strokeWidth={1.8} /> },
  { title: 'Course', href: '/', icon: <BookOpen size={20} strokeWidth={1.8} /> },
  { title: 'Lessons', href: '/lessons', icon: <Layers size={20} strokeWidth={1.8} /> },
  { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.8} /> },
  { title: 'Pricing', href: '/pricing', icon: <CreditCard size={20} strokeWidth={1.8} /> },
  { title: 'Schema Studio', href: '/schema-builder', icon: <Database size={20} strokeWidth={1.8} /> },
  { title: 'Simulator', href: '/query-simulator', icon: <Terminal size={20} strokeWidth={1.8} /> },
  { title: 'Linter', href: '/config-linter', icon: <ShieldCheck size={20} strokeWidth={1.8} /> },
  { title: 'Glossary', href: '/glossary', icon: <BookText size={20} strokeWidth={1.8} /> },
  { title: 'Exam', href: '/final-exam', icon: <Award size={20} strokeWidth={1.8} /> },
  { title: 'Certificate', href: '/certificate', icon: <Sparkles size={20} strokeWidth={1.8} /> },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    setActiveModal,
    toggleTheme,
    theme,
    toggleSidebar,
    completedLessons,
    streak,
    isAdmin,
    toggleAdmin,
    isPro,
    togglePro,
    soundEnabled,
    toggleSound,
    user,
    isGuest,
    syncStatus,
    openAuthModal,
    logout,
    syncNow,
  } = useAcademy();

  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close dropdowns on click outside safely
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const completedCount = Object.keys(completedLessons).length;
  const progressPct = Math.round((completedCount / LESSONS.length) * 100);

  return (
    <>
      <header className={`app-navbar${scrolled ? ' scrolled' : ''}`}>
        {/* ── Top Progress Ribbon ── */}
        <div className="navbar-progress-ribbon">
          <div className="navbar-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="navbar-inner">
          {/* ── LEFT: Brand Logo & Mobile Toggle ── */}
          <div className="navbar-left">
            <button
              className="navbar-hamburger"
              onClick={toggleSidebar}
              aria-label="Toggle Lessons Sidebar"
            >
              <span /><span /><span />
            </button>

            <Link href="/" className="navbar-brand">
              <Image src="/logo-mark.svg" alt="Payload Academy" width={28} height={28} unoptimized className="navbar-logo-icon" />
              <div className="navbar-brand-info">
                <span className="navbar-brand-title">Payload Academy</span>
                <span className="navbar-brand-tag">v3.x</span>
              </div>
            </Link>
          </div>

          {/* ── RIGHT: User Progress, Search & Tools ── */}
        <div className="navbar-right-cluster">
          {/* Admin Mode Badge Toggle */}
          {isAdmin && (
            <button
              onClick={toggleAdmin}
              className="navbar-action-btn"
              title="Admin Mode Active (Bypassing Gating) - Click to Toggle Off"
              style={{
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#eab308',
                borderColor: 'rgba(234, 179, 8, 0.4)',
                fontSize: 12,
                fontWeight: 700,
                padding: '0 10px',
                height: 32,
              }}
            >
              👑 Admin
            </button>
          )}

          {/* Progress & Streak Badge */}
          <Link href="/dashboard" className="navbar-stats-chip" title="View Learning Dashboard">
            {streak > 0 && <span className="navbar-streak-fire">🔥 {streak}d</span>}
            <div className="navbar-mini-progress">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="9" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                <circle
                  cx="12" cy="12" r="9"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 9}`}
                  strokeDashoffset={`${2 * Math.PI * 9 * (1 - progressPct / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 12 12)"
                />
              </svg>
              <span className="navbar-progress-text">{progressPct}%</span>
            </div>
          </Link>

          {/* Quick Search Spotlight Button */}
          <button
            className="navbar-search-pill"
            onClick={() => setActiveModal('command')}
            title="Search Lessons (Ctrl+K or /)"
          >
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M13.5 13.5L18 18" strokeLinecap="round" />
            </svg>
            <span className="navbar-search-placeholder">Search…</span>
            <kbd className="navbar-kbd">⌘K</kbd>
          </button>

          {/* AI Assistant Button */}
          <button
            className="navbar-action-btn ai-btn"
            onClick={() => setActiveModal('ai')}
            title="Ask Payload 3.x AI Assistant"
          >
            <span className="ai-sparkle">✨</span>
            <span className="btn-text">AI</span>
          </button>

          {/* Pomodoro Focus Timer */}
          <button
            className="navbar-icon-btn"
            onClick={() => setActiveModal('pomodoro')}
            title="Focus / Pomodoro Timer"
            aria-label="Focus / Pomodoro timer"
          >
            <span aria-hidden="true">🍅</span>
          </button>

          {/* More Tools Dropdown */}
          <div className="navbar-dropdown-wrap" ref={toolsMenuRef}>
            <button
              className={`navbar-icon-btn${toolsDropdownOpen ? ' active' : ''}`}
              onClick={() => setToolsDropdownOpen(p => !p)}
              title="More Developer Tools"
              aria-label="More developer tools"
              aria-haspopup="menu"
              aria-expanded={toolsDropdownOpen}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <circle cx="10" cy="4" r="1.8" />
                <circle cx="10" cy="10" r="1.8" />
                <circle cx="10" cy="16" r="1.8" />
              </svg>
            </button>

            {toolsDropdownOpen && (
              <div className="navbar-dropdown-panel">
                <div className="dropdown-section-header">Simulators &amp; Sandboxes</div>
                <Link
                  href="/live-preview-simulator"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">🖥️</span>
                  <div>
                    <div className="dropdown-label">Live Preview Studio</div>
                    <div className="dropdown-sub">postMessage simulator &amp; frame</div>
                  </div>
                </Link>

                <Link
                  href="/rbac-matrix"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">🛡️</span>
                  <div>
                    <div className="dropdown-label">Visual RBAC Matrix</div>
                    <div className="dropdown-sub">Persona simulation &amp; RLS SQL</div>
                  </div>
                </Link>

                <Link
                  href="/lexical-inspector"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">📜</span>
                  <div>
                    <div className="dropdown-label">Lexical AST Inspector</div>
                    <div className="dropdown-sub">JSON AST explorer &amp; React serializer</div>
                  </div>
                </Link>

                <button
                  className="navbar-dropdown-item"
                  onClick={() => { setActiveModal('schema'); setToolsDropdownOpen(false); }}
                >
                  <span className="dropdown-icon">⚡</span>
                  <div>
                    <div className="dropdown-label">Schema Builder</div>
                    <div className="dropdown-sub">Visual collection &amp; field generator</div>
                  </div>
                </button>

                <Link
                  href="/terminal"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">💻</span>
                  <div>
                    <div className="dropdown-label">CLI Workbench</div>
                    <div className="dropdown-sub">Interactive Payload 3.x shell</div>
                  </div>
                </Link>

                <Link
                  href="/db-visualizer"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">🗄️</span>
                  <div>
                    <div className="dropdown-label">Drizzle SQL Visualizer</div>
                    <div className="dropdown-sub">ER diagrams &amp; migrations</div>
                  </div>
                </Link>

                <div className="dropdown-divider" />
                <div className="dropdown-section-header">Overrides &amp; Controls</div>

                {/* Admin Mode Toggle */}
                <button
                  className="navbar-dropdown-item"
                  onClick={() => { toggleAdmin(); setToolsDropdownOpen(false); }}
                  style={{ background: isAdmin ? 'rgba(234, 179, 8, 0.08)' : undefined }}
                >
                  <span className="dropdown-icon">👑</span>
                  <div>
                    <div className="dropdown-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      Admin Mode
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 99, background: isAdmin ? '#eab308' : 'var(--border)', color: isAdmin ? '#000' : 'var(--muted)', fontWeight: 700 }}>
                        {isAdmin ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>
                    <div className="dropdown-sub">Bypass prerequisites for Exam</div>
                  </div>
                </button>

                {/* Pro Membership Toggle */}
                <button
                  className="navbar-dropdown-item"
                  onClick={() => { togglePro(); setToolsDropdownOpen(false); }}
                  style={{ background: isPro ? 'rgba(249, 115, 22, 0.08)' : undefined }}
                >
                  <span className="dropdown-icon">⚡</span>
                  <div>
                    <div className="dropdown-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      Pro Subscription
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 99, background: isPro ? '#f97316' : 'var(--border)', color: isPro ? '#fff' : 'var(--muted)', fontWeight: 700 }}>
                        {isPro ? 'UNLOCKED' : 'FREE TIER'}
                      </span>
                    </div>
                    <div className="dropdown-sub">Simulate Pro access (Lessons {FREE_LESSON_COUNT + 1}–{LESSONS.length})</div>
                  </div>
                </button>

                {/* Sound FX Toggle */}
                <button
                  className="navbar-dropdown-item"
                  onClick={() => { toggleSound(); setToolsDropdownOpen(false); }}
                >
                  <span className="dropdown-icon">{soundEnabled ? '🔊' : '🔇'}</span>
                  <div>
                    <div className="dropdown-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      UI Sound Effects
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 99, background: soundEnabled ? '#10b981' : 'var(--border)', color: soundEnabled ? '#fff' : 'var(--muted)', fontWeight: 700 }}>
                        {soundEnabled ? 'ON' : 'MUTED'}
                      </span>
                    </div>
                    <div className="dropdown-sub">Synthesized audio &amp; chimes</div>
                  </div>
                </button>

                <div className="dropdown-divider" />
                <div className="dropdown-section-header">Resources &amp; Shortcuts</div>

                {/* Guided Tour Modal */}
                <button
                  className="navbar-dropdown-item"
                  onClick={() => { setActiveModal('onboarding'); setToolsDropdownOpen(false); }}
                >
                  <span className="dropdown-icon">✨</span>
                  <div>
                    <div className="dropdown-label">Onboarding Tour</div>
                    <div className="dropdown-sub">4-step academy walkthrough</div>
                  </div>
                </button>

                <Link
                  href="/study-guide"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">📚</span>
                  <div>
                    <div className="dropdown-label">Study Guide</div>
                    <div className="dropdown-sub">Certification cheatsheet</div>
                  </div>
                </Link>

                <Link
                  href="/lessons"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">🗂️</span>
                  <div>
                    <div className="dropdown-label">Lesson Library</div>
                    <div className="dropdown-sub">Index of all {LESSONS.length} lessons</div>
                  </div>
                </Link>

                <Link
                  href="/blog"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">📝</span>
                  <div>
                    <div className="dropdown-label">Articles</div>
                    <div className="dropdown-sub">In-depth Payload 3.x guides</div>
                  </div>
                </Link>

                <Link
                  href="/blog"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">📝</span>
                  <div>
                    <div className="dropdown-label">Articles</div>
                    <div className="dropdown-sub">In-depth Payload 3.x guides</div>
                  </div>
                </Link>

                <Link
                  href="/flashcards"
                  className="navbar-dropdown-item"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <span className="dropdown-icon">🃏</span>
                  <div>
                    <div className="dropdown-label">Glossary Flashcards</div>
                    <div className="dropdown-sub">Spaced drilling of key terms</div>
                  </div>
                </Link>

                <button
                  className="navbar-dropdown-item"
                  onClick={() => { setActiveModal('backup'); setToolsDropdownOpen(false); }}
                >
                  <span className="dropdown-icon">💾</span>
                  <div>
                    <div className="dropdown-label">Backup &amp; Restore</div>
                    <div className="dropdown-sub">Export or import progress JSON</div>
                  </div>
                </button>

                <button
                  className="navbar-dropdown-item"
                  onClick={() => { setActiveModal('shortcuts'); setToolsDropdownOpen(false); }}
                >
                  <span className="dropdown-icon">⌨️</span>
                  <div>
                    <div className="dropdown-label">Keyboard Shortcuts</div>
                    <div className="dropdown-sub">Hotkeys and speed navigation</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="navbar-icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          {/* ── User Account / Auth Button ── */}
          {isGuest ? (
            <button
              onClick={() => openAuthModal('login')}
              className="navbar-action-btn"
              title="Sign In or Create Account"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(79,70,229,0.12) 100%)',
                color: '#a5b4fc',
                borderColor: 'rgba(99,102,241,0.35)',
                fontSize: 12,
                fontWeight: 700,
                padding: '0 12px',
                height: 32,
                gap: 6,
              }}
            >
              <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" />
              </svg>
              Sign In
            </button>
          ) : (
            <div className="navbar-dropdown-wrap" ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(p => !p)}
                title={user?.email || 'Account'}
                aria-label={user?.email ? `Account menu for ${user.email}` : 'Account menu'}
                aria-haspopup="menu"
                aria-expanded={userDropdownOpen}
                className="navbar-icon-btn"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  fontSize: 16,
                  background: 'rgba(99,102,241,0.18)',
                  borderColor: syncStatus === 'synced' ? 'rgba(16,185,129,0.5)' : 'rgba(99,102,241,0.35)',
                }}
              >
                {user?.avatar || '👨‍💻'}
              </button>
              {/* Sync status dot */}
              <span
                title={`Sync: ${syncStatus}`}
                role="status"
                aria-label={`Sync status: ${syncStatus}`}
                style={{
                  position: 'absolute',
                  bottom: 0, right: 0,
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: syncStatus === 'synced' ? '#10b981' : syncStatus === 'syncing' ? '#f59e0b' : '#6b7280',
                  border: '1.5px solid var(--bg)',
                  pointerEvents: 'none',
                }}
              />

              {userDropdownOpen && (
                <div
                  className="navbar-dropdown-panel"
                  style={{ right: 0, left: 'auto', minWidth: 220 }}
                >
                  {/* User Info */}
                  <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{user?.name || user?.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{user?.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      {user?.isPro ? (
                        <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: 'rgba(249,115,22,0.15)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)', fontWeight: 700 }}>⚡ PRO</span>
                      ) : (
                        <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', fontWeight: 700 }}>FREE</span>
                      )}
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                        {syncStatus === 'synced' ? '✓ Synced' : syncStatus === 'syncing' ? '⟳ Syncing…' : '○ Offline'}
                      </span>
                    </div>
                  </div>

                  <button
                    className="navbar-dropdown-item"
                    onClick={() => { syncNow(); setUserDropdownOpen(false); }}
                  >
                    <span className="dropdown-icon">☁️</span>
                    <div>
                      <div className="dropdown-label">Sync Progress Now</div>
                      <div className="dropdown-sub">Save progress to your account</div>
                    </div>
                  </button>

                  <Link
                    href="/dashboard"
                    className="navbar-dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">📊</span>
                    <div>
                      <div className="dropdown-label">My Dashboard</div>
                      <div className="dropdown-sub">Progress, achievements & streaks</div>
                    </div>
                  </Link>

                  <Link
                    href="/pricing"
                    className="navbar-dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">⚡</span>
                    <div>
                      <div className="dropdown-label">Upgrade to Pro</div>
                      <div className="dropdown-sub">Unlock all {LESSONS.length} lessons &amp; certificate</div>
                    </div>
                  </Link>

                  <button
                    className="navbar-dropdown-item"
                    onClick={async () => { await logout(); setUserDropdownOpen(false); }}
                    style={{ color: '#f87171' }}
                  >
                    <span className="dropdown-icon">→</span>
                    <div>
                      <div className="dropdown-label" style={{ color: '#f87171' }}>Sign Out</div>
                      <div className="dropdown-sub">You can still browse free lessons</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileNavOpen(p => !p)}
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileNavOpen ? (
                <path d="M4 4l12 12M4 16L16 4" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Nav Dropdown ── */}
      {mobileNavOpen && (
        <div className="navbar-mobile-drawer">
          <div className="navbar-mobile-tabs">
            {DOCK_ITEMS.map(tab => {
              const isActive = tab.href === '/'
                ? pathname === '/'
                : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`navbar-mobile-tab-item${isActive ? ' active' : ''}`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {tab.title}
                </Link>
              );
            })}
          </div>
          <div className="navbar-mobile-actions">
            <button
              className="navbar-mobile-action-btn"
              onClick={() => { toggleAdmin(); setMobileNavOpen(false); }}
              style={{ color: isAdmin ? '#eab308' : undefined }}
            >
              👑 Admin Mode: {isAdmin ? 'Active (Bypassed)' : 'Off'}
            </button>
            <button
              className="navbar-mobile-action-btn"
              onClick={() => { setActiveModal('ai'); setMobileNavOpen(false); }}
            >
              ✨ Payload AI Assistant
            </button>
            <button
              className="navbar-mobile-action-btn"
              onClick={() => { setActiveModal('schema'); setMobileNavOpen(false); }}
            >
              ⚡ Schema Builder
            </button>
            <button
              className="navbar-mobile-action-btn"
              onClick={() => { setActiveModal('pomodoro'); setMobileNavOpen(false); }}
            >
              🍅 Pomodoro Focus Timer
            </button>
          </div>
        </div>
      )}
    </header>

    {/* ── FLOATING DOCK (Fixed relative to viewport vw) ── */}
    <FloatingDock items={DOCK_ITEMS} />
  </>
  );
};
