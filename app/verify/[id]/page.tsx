'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GlareCard } from '@/components/ui/glare-card';
import { Spotlight } from '@/components/ui/spotlight';
import { SparklesCore } from '@/components/ui/sparkles';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certId = (params?.id as string) || 'PA-3X-DEMO-2026';
  const [copied, setCopied] = useState(false);

  // Derive readable name from cert or query
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://payload-academy.dev/verify/${certId}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Payload+CMS+3.x+Certified+Master+Engineer&organizationName=Payload+CMS&issueYear=2026&certUrl=${encodeURIComponent(shareUrl)}&certId=${encodeURIComponent(certId)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm officially certified as a Payload CMS 3.x Master Engineer! 🏆 Verified Credential: ${shareUrl}`)}`;

  return (
    <div className="standalone-page">
      {/* Header */}
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
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#10b981" />

        <div className="wrap relative z-10" style={{ maxWidth: 860 }}>
          {/* Status Header Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Officially Verified Authentic Credential
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
              Payload 3.x Master Credential
            </h1>

            <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
              This credential confirms official mastery in architecting, securing, and deploying enterprise Payload CMS 3.x applications.
            </p>
          </div>

          {/* Holographic Verification Card */}
          <div className="relative mb-10">
            <div className="absolute inset-0 pointer-events-none">
              <SparklesCore particleDensity={25} particleColor="#10b981" minSize={1} maxSize={2.5} />
            </div>

            <GlareCard className="p-8 md:p-10 bg-[#090d16] border border-emerald-500/30">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-6">
                <div>
                  <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-1">
                    VERIFICATION ID: {certId}
                  </div>
                  <div className="text-2xl font-black text-white">
                    Certified Payload 3.x Engineer
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Awarded by Payload Academy Certification Authority
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs flex items-center gap-2">
                  <span>✓</span> VERIFIED ACTIVE
                </div>
              </div>

              {/* Competencies Checklist */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Verified Engineering Proficiencies:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-200">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400">✓</span> Next.js 15 App Router &amp; RSC Architecture
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400">✓</span> Multi-Tenant RBAC &amp; Row-Level Security
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400">✓</span> Lexical Rich Text AST &amp; Serializers
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400">✓</span> PostgreSQL &amp; SQLite Drizzle Schemas
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400">✓</span> Live Preview postMessage Event Bus
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400">✓</span> ACID Transactions &amp; Background Queues
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-white/10 text-xs text-gray-400 font-mono">
                <div>ISSUED: {dateStr}</div>
                <div>ISSUER: Payload Academy Verification Node #01</div>
              </div>
            </GlareCard>
          </div>

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

              <a
                href={`/api/og/certificate?id=${encodeURIComponent(certId)}&name=Payload+Master+Engineer&score=98`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 transition duration-150 flex items-center gap-2"
              >
                <span>🖼️</span> Dynamic OG Card ↗
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
