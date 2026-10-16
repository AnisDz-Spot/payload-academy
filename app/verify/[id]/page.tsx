'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GlareCard } from '@/components/ui/glare-card';
import { Spotlight } from '@/components/ui/spotlight';
import { SparklesCore } from '@/components/ui/sparkles';

interface VerifiedCertificate {
  id: string;
  recipientName: string;
  score: number;
  issuedAt: string;
  verifyUrl: string;
  badgeUrl: string;
}

type Status = 'loading' | 'valid' | 'invalid' | 'notfound' | 'error';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certId = (params?.id as string) || '';
  const [status, setStatus] = useState<Status>(certId ? 'loading' : 'notfound');
  const [cert, setCert] = useState<VerifiedCertificate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!certId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/verify/${encodeURIComponent(certId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.status === 404) {
          setStatus('notfound');
          return;
        }
        if (!res.ok) {
          setStatus('error');
          return;
        }
        setCert(data.certificate as VerifiedCertificate);
        setStatus(data.valid ? 'valid' : 'invalid');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [certId]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://payload-academy.dev/verify/${certId}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const issueYear = cert ? new Date(cert.issuedAt).getFullYear() : 2026;
  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Payload+CMS+3.x+Certified+Master+Engineer&organizationName=Payload+CMS&issueYear=${issueYear}&certUrl=${encodeURIComponent(shareUrl)}&certId=${encodeURIComponent(certId)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm officially certified as a Payload CMS 3.x Master Engineer! 🏆 Verified Credential: ${shareUrl}`)}`;

  const isVerified = status === 'valid';
  const issuedStr = cert
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const badge = (() => {
    if (status === 'loading') {
      return { cls: 'bg-slate-500/15 border-slate-500/30 text-slate-300', dot: 'bg-slate-400', label: 'Verifying credential…' };
    }
    if (isVerified) {
      return { cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', dot: 'bg-emerald-400 animate-pulse', label: 'Officially Verified Authentic Credential' };
    }
    if (status === 'invalid') {
      return { cls: 'bg-red-500/15 border-red-500/30 text-red-400', dot: 'bg-red-400', label: 'Signature Invalid — Credential Tampered' };
    }
    if (status === 'notfound') {
      return { cls: 'bg-amber-500/15 border-amber-500/30 text-amber-400', dot: 'bg-amber-400', label: 'No Credential Found' };
    }
    return { cls: 'bg-red-500/15 border-red-500/30 text-red-400', dot: 'bg-red-400', label: 'Verification Unavailable' };
  })();

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Academy</Link>
          <div className="logo-small">
            <i>P</i>
            <span>Official Credential Registry</span>
          </div>
          <Link href="/pricing" className="t">💳 Pricing</Link>
        </div>
      </header>

      <main className="standalone-main relative overflow-hidden" style={{ minHeight: '90vh' }}>
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill={isVerified ? '#10b981' : '#f59e0b'} />

        <div className="wrap relative z-10" style={{ maxWidth: 860 }}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-bold text-xs uppercase tracking-widest mb-4 ${badge.cls}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {badge.label}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
              Payload 3.x Master Credential
            </h1>

            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              {isVerified
                ? 'This credential confirms official mastery in architecting, securing, and deploying enterprise Payload CMS 3.x applications.'
                : status === 'loading'
                  ? 'Looking up this credential in the registry…'
                  : 'This credential could not be confirmed against the registry. It may have been mistyped or never issued.'}
            </p>
          </div>

          {(isVerified || status === 'invalid') && cert && (
            <div className="relative mb-10">
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={25} particleColor={isVerified ? '#10b981' : '#f59e0b'} minSize={1} maxSize={2.5} />
              </div>

              <GlareCard className={`p-8 md:p-10 bg-[#090d16] border ${isVerified ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-1">
                      VERIFICATION ID: {cert.id}
                    </div>
                    <div className="text-2xl font-black text-white">
                      {cert.recipientName}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Certified Payload 3.x Engineer · Score {cert.score}%
                    </div>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-2 ${isVerified ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}>
                    <span>{isVerified ? '✓' : '✕'}</span> {isVerified ? 'VERIFIED ACTIVE' : 'SIGNATURE INVALID'}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Verified Engineering Proficiencies:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-200">
                    {[
                      'Next.js 16 App Router & RSC Architecture',
                      'Multi-Tenant RBAC & Row-Level Security',
                      'Lexical Rich Text AST & Serializers',
                      'PostgreSQL & SQLite Drizzle Schemas',
                      'Live Preview & Draft Workflows',
                      'ACID Transactions & Background Queues',
                    ].map((skill) => (
                      <div key={skill} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-emerald-400">✓</span> {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-white/10 text-xs text-gray-400 font-mono">
                  <div>ISSUED: {issuedStr}</div>
                  <div>ISSUER: Payload Academy Verification Node #01</div>
                </div>
              </GlareCard>
            </div>
          )}

          {status === 'notfound' && (
            <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center mb-10">
              <div className="text-5xl mb-3">🔍</div>
              <div className="text-lg font-bold text-white mb-1">Credential not found</div>
              <p className="text-sm text-gray-400 m-0">
                No certificate with the ID <code className="text-orange-400">{certId || '(none)'}</code> exists in the registry.
              </p>
            </div>
          )}

          {/* Social Share & Profile Actions */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
            <h3 className="text-base font-bold text-white m-0">Share or Verify this Credential</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0a66c2] hover:bg-[#004182] transition duration-150 flex items-center gap-2"
              >
                <span>💼</span> Add to LinkedIn Profile
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-black hover:bg-gray-800 border border-white/20 transition duration-150 flex items-center gap-2"
              >
                <span>🐦</span> Post to X / Twitter
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-gray-200 bg-white/10 hover:bg-white/20 transition duration-150 flex items-center gap-2"
              >
                <span>🔗</span> {copied ? 'Copied to Clipboard!' : 'Copy Verification Link'}
              </button>

              {cert && (
                <a
                  href={cert.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 transition duration-150 flex items-center gap-2"
                >
                  <span>🏅</span> Open Badge JSON ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
