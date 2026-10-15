'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademy } from '@/context/AcademyContext';
import { playPop, playSuccessChime, playToggleClick } from '@/lib/sound';

const AVATARS = ['👨‍💻', '👩‍💻', '🚀', '⚡', '🛡️', '🧙‍♂️', '🧠', '💎'];

export const AuthModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    soundEnabled,
  } = useAcademy();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [mergeGuest, setMergeGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Email verification pending state
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const [devPreviewUrl, setDevPreviewUrl] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const isOpen = activeModal === 'auth';

  if (!isOpen) return null;

  const handleClose = () => {
    if (soundEnabled) playToggleClick();
    setErrorMsg(null);
    setEmailSent(false);
    setSentToEmail('');
    setDevPreviewUrl('');
    setResendMsg('');
    setActiveModal('none');
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    if (soundEnabled) playPop();
    setAuthModalTab(tab);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (authModalTab === 'login') {
      const res = await login(email, password, mergeGuest);
      setIsLoading(false);
      if (res.success) {
        if (soundEnabled) playSuccessChime();
      } else if ((res as { code?: string }).code === 'EMAIL_NOT_VERIFIED') {
        // Show the resend panel instead of raw error
        setSentToEmail(email);
        setEmailSent(true);
        setResendMsg('Your email is not verified. We have sent a fresh link — please check your inbox.');
      } else {
        setErrorMsg(res.error || 'Failed to sign in');
      }
    } else {
      const res = await register(email, password, name, avatar, mergeGuest);
      setIsLoading(false);
      if (res.success) {
        if (soundEnabled) playSuccessChime();
        setSentToEmail(email);
        setDevPreviewUrl((res as { previewUrl?: string }).previewUrl || '');
        setEmailSent(true);
      } else {
        setErrorMsg(res.error || 'Failed to create account');
      }
    }
  };

  async function handleResend() {
    setResendLoading(true);
    setResendMsg('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sentToEmail }),
      });
      const data = await res.json();
      if (data.previewUrl) setDevPreviewUrl(data.previewUrl);
      setResendMsg(res.ok ? 'Verification email resent! Check your inbox.' : (data.error || 'Could not resend.'));
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999 }}>
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container with Aceternity glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(10, 15, 29, 0.99) 100%)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(99, 102, 241, 0.3)',
          }}
        >
          {/* Top ambient color flare */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500"
            style={{ background: authModalTab === 'register' ? '#10b981' : '#6366f1' }}
          />

          {/* Header Bar */}
          <div className="relative flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xs font-bold">
                P
              </span>
              <span className="text-sm font-bold text-white tracking-wide">
                Payload Academy Account
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Auth Modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Email Sent / Verification Pending State ── */}
          {emailSent ? (
            <div style={{ padding: '32px 28px 28px', textAlign: 'center' }}>
              {/* Icon */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                border: '2px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34,
              }}>📬</div>

              <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 10 }}>
                Check your inbox!
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75, marginBottom: 20 }}>
                We sent a verification link to{' '}
                <strong style={{ color: '#a5b4fc' }}>{sentToEmail}</strong>.<br />
                Click the link to activate your account — it expires in <strong style={{ color: '#f8fafc' }}>24 hours</strong>.
              </div>

              {/* Dev Ethereal preview link */}
              {devPreviewUrl && (
                <div style={{
                  padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>🔧 DEV — Ethereal Email Preview</div>
                  <a href={devPreviewUrl} target="_blank" rel="noopener noreferrer"
                     style={{ fontSize: 11, color: '#818cf8', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {devPreviewUrl}
                  </a>
                </div>
              )}

              {/* Resend button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  style={{
                    padding: '11px 20px', borderRadius: 11, fontSize: 13, fontWeight: 700,
                    background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.3)',
                    cursor: resendLoading ? 'not-allowed' : 'pointer',
                    opacity: resendLoading ? 0.6 : 1, transition: 'opacity 0.2s',
                  }}
                >
                  {resendLoading ? '⟳ Sending…' : '↺ Resend verification email'}
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '10px 20px', borderRadius: 11, fontSize: 13, fontWeight: 600,
                    background: 'rgba(255,255,255,0.04)', color: '#64748b',
                    border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                  }}
                >
                  Close — I'll check my email
                </button>
              </div>

              {resendMsg && (
                <div style={{
                  marginTop: 12, fontSize: 12, padding: '8px 12px', borderRadius: 8,
                  color: resendMsg.includes('resent') ? '#34d399' : '#f87171',
                  background: resendMsg.includes('resent') ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                  border: `1px solid ${resendMsg.includes('resent') ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                }}>
                  {resendMsg}
                </div>
              )}

              <div style={{ marginTop: 20, fontSize: 11, color: '#475569' }}>
                Didn't receive it? Check your spam folder or try a different email address.
              </div>
            </div>
          ) : (
            <>


          {/* Tab Switcher */}
          <div className="relative px-6 pt-5">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'register'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="relative px-6 py-5 space-y-4">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {authModalTab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    Choose Avatar
                  </label>
                  <div className="flex items-center gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => {
                          setAvatar(av);
                          if (soundEnabled) playPop();
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                          avatar === av
                            ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-110'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Minimum 6 characters.
              </span>
            </div>

            {/* Merge guest progress checkbox */}
            <label className="flex items-center gap-2 pt-1 text-xs text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={mergeGuest}
                onChange={(e) => setMergeGuest(e.target.checked)}
                className="rounded bg-neutral-800 border-neutral-700 text-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span>Sync existing course progress to this account</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              style={{
                background:
                  authModalTab === 'register'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              }}
            >
              {isLoading ? (
                <span>Loading...</span>
              ) : authModalTab === 'register' ? (
                <>
                  <span>Create Account &amp; Save Progress</span>
                  <span>🚀</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Guest Continue Banner */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-neutral-400 hover:text-white underline transition-colors cursor-pointer"
              >
                Continue browsing free courses as Guest (No account needed)
              </button>
            </div>
          </form>
          </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

