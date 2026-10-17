'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { GlareCard } from '@/components/ui/glare-card';
import { LampContainer } from '@/components/ui/lamp';
import { SparklesCore } from '@/components/ui/sparkles';
import { Spotlight } from '@/components/ui/spotlight';

export default function CertificatePage() {
  const {
    toggleTheme,
    completedLessons,
    completedQuizzes,
    canTakeExam,
    canClaimCertificate,
    isAdmin,
    toggleAdmin,
    examScore,
  } = useAcademy();

  const [userName, setUserName] = useState('Payload Master Engineer');
  const [certId, setCertId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const issuedRef = useRef(false);

  const completedLessonsCount = Object.keys(completedLessons).length;
  const completedQuizzesCount = Object.keys(completedQuizzes).length;
  const totalLessons = LESSONS.length;

  const displayScore = examScore !== null ? examScore : (isAdmin ? 100 : 80);

  // Deterministic preview ID shown when the credential has not been issued by
  // the server (guest / not-yet-claimed). A real, signed ID replaces it once
  // /api/certificate/issue succeeds.
  const previewCertId =
    'PA-3X-' +
    Math.abs(
      (userName || 'Payload Master Engineer').split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 0)
    )
      .toString(16)
      .toUpperCase()
      .padStart(8, '0');
  const effectiveCertId = certId || previewCertId;

  useEffect(() => {
    if (!canClaimCertificate || issuedRef.current) return;
    issuedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/certificate/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.id) setCertId(data.id as string);
      } catch {
        // Stay in preview mode; the canvas still renders an unverified preview.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canClaimCertificate, userName]);

  // ── Canvas Drawing with Official Signature (Unconditional Hook) ───
  useEffect(() => {
    if (!canvasRef.current || !canClaimCertificate) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width, h = canvas.height;
    const name = (userName || 'Payload Master Engineer').trim();

    const drawCertificate = (sigImg?: HTMLImageElement) => {
      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.5, '#111827');
      bgGrad.addColorStop(1, '#060911');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Outer gold border
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, w - 60, h - 60);

      // Inner accent border
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(42, 42, w - 84, h - 84);

      // Top Badge Icon
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(w / 2 - 28, 65, 56, 56, 12);
      else ctx.rect(w / 2 - 28, 65, 56, 56);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('P', w / 2, 105);

      // Organization Header
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillText('PAYLOAD ACADEMY · OFFICIAL VERIFIED CREDENTIAL', w / 2, 150);

      // Certificate Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px "Inter", sans-serif';
      ctx.fillText('Certificate of Payload 3.x Mastery', w / 2, 205);

      // Subtitle
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px "Inter", sans-serif';
      ctx.fillText('This official credential is proudly awarded to', w / 2, 255);

      // Recipient Name
      const nameGrad = ctx.createLinearGradient(w / 2 - 280, 0, w / 2 + 280, 0);
      nameGrad.addColorStop(0, '#fb923c');
      nameGrad.addColorStop(0.5, '#ffffff');
      nameGrad.addColorStop(1, '#f97316');
      ctx.fillStyle = nameGrad;
      ctx.font = 'bold 44px "Inter", sans-serif';
      ctx.fillText(name, w / 2, 320);

      // Decorative underline
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 200, 345);
      ctx.lineTo(w / 2 + 200, 345);
      ctx.stroke();

      // Achievement Description
      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px "Inter", sans-serif';
      ctx.fillText(
        `For achieving ${displayScore}% on the comprehensive Final Mastery Assessment and demonstrating full proficiency in:`,
        w / 2,
        390
      );

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText(
        'Collections & Schemas · Row-Level Access Control · Next.js 16 Server Actions · Lexical Rich Text',
        w / 2,
        425
      );
      ctx.fillText(
        'Virtual Join Fields · ACID Transactions · Background Jobs · Vector AI/RAG Embeddings · Production Deployment',
        w / 2,
        452
      );

      // ── Official Signature from public/signature.png ──
      const sigX = w / 2 - 90;
      const sigY = 490;
      if (sigImg && sigImg.complete && sigImg.naturalWidth > 0) {
        ctx.drawImage(sigImg, sigX, sigY, 180, 60);
      } else {
        // Fallback cursive script text
        ctx.fillStyle = '#f97316';
        ctx.font = 'italic 26px "Inter", cursive';
        ctx.fillText('Alex Currie-Clark', w / 2, 535);
      }

      // Signature line & title
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 120, 560);
      ctx.lineTo(w / 2 + 120, 560);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText('Authorized Signature · Lead Payload Architect', w / 2, 578);

      // Footer Metadata
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const shownCertId = effectiveCertId;

      ctx.fillStyle = '#64748b';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('ISSUE DATE: ' + dateStr, 70, h - 70);
      ctx.fillText('VERIFICATION ID: ' + shownCertId, 70, h - 50);

      ctx.textAlign = 'right';
      ctx.fillText(`MASTER SCORE: ${displayScore}% · HONORS`, w - 70, h - 70);
      ctx.fillText(certId ? 'VERIFIED AUTHENTIC CREDENTIAL ✓' : 'PREVIEW · CLAIM TO VERIFY', w - 70, h - 50);
    };

    // Load signature image from /signature.png
    const signatureImage = new Image();
    signatureImage.src = '/signature.png';
    signatureImage.onload = () => {
      drawCertificate(signatureImage);
    };
    signatureImage.onerror = () => {
      drawCertificate();
    };

    drawCertificate();
  }, [userName, examScore, displayScore, isAdmin, canClaimCertificate, certId, effectiveCertId]);

  const handleDownload = () => {
    if (!canvasRef.current || !canClaimCertificate) return;
    const link = document.createElement('a');
    link.download = `Payload-3.x-Mastery-Certificate-${userName.replace(/\s+/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // ── Locked Gating View (Exam not passed and not Admin) ────────────
  if (!canClaimCertificate) {
    return (
      <div className="standalone-page">
        <header className="standalone-header">
          <div className="standalone-header-inner">
            <Link href="/" className="back-link">← Back to Course</Link>
            <div className="logo-small">
              <i>P</i>
              <span>Certificate of Mastery</span>
            </div>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </header>

        <main className="standalone-main">
          <div className="wrap" style={{ maxWidth: 740 }}>
            <div className="exam-summary-card" style={{ textAlign: 'center', padding: '44px 32px' }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>🔒</div>
              <div className="kick" style={{ color: '#f59e0b' }}>Prerequisites Incomplete</div>
              <h1 style={{ margin: '8px 0 12px' }}>Certificate of Mastery Locked</h1>
              <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.6 }}>
                Official verification credentials and downloads are granted strictly upon achieving a passing score of <b>80% or higher</b> on the Final Mastery Exam.
              </p>

              {/* Requirements Checklist */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 22, textAlign: 'left', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 1. Complete Lessons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{completedLessonsCount >= totalLessons ? '✅' : '○'}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>1. Complete all {totalLessons} Curriculum Lessons</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
                    {completedLessonsCount}/{totalLessons}
                  </span>
                </div>

                {/* 2. Pass Quizzes */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{completedQuizzesCount >= totalLessons ? '✅' : '○'}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>2. Pass all {totalLessons} Lesson Quick Quizzes</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
                    {completedQuizzesCount}/{totalLessons}
                  </span>
                </div>

                {/* 3. Final Exam Score >= 80% */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{examScore !== null && examScore >= 80 ? '✅' : '○'}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>3. Pass Final Comprehensive Exam (Score ≥ 80%)</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: examScore !== null && examScore >= 80 ? 'var(--green)' : '#f59e0b' }}>
                    {examScore !== null ? `${examScore}%` : 'Not Attempted'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {canTakeExam ? (
                  <Link href="/final-exam" className="sb-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
                    🎓 Take Final Exam (80% to Pass) →
                  </Link>
                ) : (
                  <Link href="/" className="sb-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
                    📖 Resume Lessons &amp; Quizzes →
                  </Link>
                )}

                <button
                  type="button"
                  onClick={toggleAdmin}
                  className="sb-btn sec"
                  style={{ padding: '10px 20px', fontSize: 14, borderColor: '#eab308', color: '#eab308' }}
                  title="Bypass prerequisites as an administrator"
                >
                  👑 Admin: Enable Override &amp; Preview
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Unlocked View ────────────────────────────────────────────────
  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>P</i>
            <span>Certificate of Mastery</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/final-exam" className="t">🎓 Final Exam</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      <main className="standalone-main relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#10b981" />
        <div className="wrap relative z-10" style={{ maxWidth: 980 }}>
          {/* Lamp Spotlight Header */}
          <LampContainer className="mb-4">
            <div className="kick" style={{ color: '#10b981' }}>Verified Credential Unlocked</div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-center tracking-tight text-white mb-2">
              Official Certificate of Mastery
            </h1>
            <p className="lead text-center text-slate-300 max-w-xl mx-auto">
              Certified mastery credential awarded for scoring <b>{displayScore}%</b> on the Final Mastery Exam.
            </p>
          </LampContainer>

          {/* Recipient customizer & Download Button */}
          <div className="cert-customizer-card">
            <div className="cert-input-row">
              <label htmlFor="name-input">Certificate Recipient Name:</label>
              <input
                id="name-input"
                type="text"
                className="cert-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name..."
              />
            </div>
            <button className="sb-btn cert-download-btn" onClick={handleDownload}>
              📥 Download High-Res Certificate (PNG)
            </button>
          </div>

          {/* Holographic GlareCard Wrapped Canvas Render */}
          <div className="relative mt-8">
            <div className="absolute inset-0 h-full w-full pointer-events-none">
              <SparklesCore
                minSize={1.5}
                maxSize={3}
                particleDensity={40}
                particleColor="#f97316"
              />
            </div>
            <GlareCard className="p-2 bg-[#090d16] flex items-center justify-center">
              <canvas
                id="certCanvas"
                ref={canvasRef}
                width={1200}
                height={750}
                className="cert-canvas w-full h-auto rounded-xl"
              />
            </GlareCard>
          </div>

          {/* Social Share & Verification Row */}
          {(() => {
            const verifyUrl = typeof window !== 'undefined'
              ? `${window.location.origin}/verify/${effectiveCertId}`
              : `https://payload-academy.dev/verify/${effectiveCertId}`;

            const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Payload+CMS+3.x+Certified+Master+Engineer&organizationName=Payload+CMS&issueYear=2026&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(effectiveCertId)}`;

            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just became an officially certified Payload CMS 3.x Master Engineer with a score of ${displayScore}%! 🏆 Verified Credential: ${verifyUrl}`)}`;

            return (
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <div className="text-xs font-mono font-bold text-orange-400">
                      CREDENTIAL ID: {effectiveCertId} {certId ? '' : '· PREVIEW'}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">Share Your Certified Achievement</div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {certId
                        ? 'This credential is signed and stored in the public registry.'
                        : 'Sign in with a Pro account to claim a signed, publicly verifiable credential.'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#004182] transition duration-150 flex items-center gap-2"
                    >
                      <span>💼</span> Add to LinkedIn
                    </a>

                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-black hover:bg-gray-800 border border-white/20 transition duration-150 flex items-center gap-2"
                    >
                      <span>🐦</span> Post to X
                    </a>

                    <Link
                      href={`/verify/${effectiveCertId}`}
                      className="px-4 py-2 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition duration-150 flex items-center gap-2"
                    >
                      <span>🔍</span> Public Registry →
                    </Link>

                    {certId && (
                      <a
                        href={`/api/badges/${certId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 transition duration-150 flex items-center gap-2"
                      >
                        <span>🏅</span> Open Badge JSON ↗
                      </a>
                    )}

                    <a
                      href={`/api/og/certificate?id=${encodeURIComponent(effectiveCertId)}&name=${encodeURIComponent(userName || 'Payload Master Engineer')}&score=${displayScore}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 transition duration-150 flex items-center gap-2"
                    >
                      <span>🖼️</span> Dynamic OG Badge ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
