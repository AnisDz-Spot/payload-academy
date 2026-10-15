'use client';

import React from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export const ProPaywallBanner: React.FC<{ lessonTitle: string; moduleName: string }> = ({
  lessonTitle,
  moduleName,
}) => {
  const { togglePro, toggleAdmin, isAdmin } = useAcademy();

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl">
      {/* Blurred background preview mockup */}
      <div
        className="absolute inset-0 opacity-15 filter blur-sm pointer-events-none select-none"
        style={{
          background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        }}
      />

      <CardSpotlight className="p-8 md:p-10 border border-orange-500/30 bg-gradient-to-b from-gray-900/90 to-black/95 backdrop-blur-xl text-center relative z-10 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-wider mb-4">
          <span>🔒 Pro Curriculum</span> · <span>{moduleName}</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
          Unlock &ldquo;{lessonTitle}&rdquo; with Pro
        </h2>

        <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
          This lesson is part of the Advanced Payload 3.x Curriculum. Upgrade to a Pro or Lifetime plan to get instant access to all 50 lessons, interactive code sandboxes, and the official certification exam.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <div className="text-xs font-bold text-white">40 Advanced Lessons</div>
              <div className="text-[11px] text-gray-400">All 10 Modules Unlocked</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <div className="text-xs font-bold text-white">Enterprise Tools</div>
              <div className="text-[11px] text-gray-400">RBAC Matrix & AST Inspector</div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <div className="text-xs font-bold text-white">Official Certificate</div>
              <div className="text-[11px] text-gray-400">Verified Payload 3.x Credential</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/25 transition duration-200 transform hover:scale-[1.02] text-center"
          >
            🚀 View Subscription Plans ($19/mo) →
          </Link>

          <button
            type="button"
            onClick={togglePro}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition duration-150"
            title="Toggle Pro mode in local session for previewing"
          >
            ⚡ Simulate Pro Unlock
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>🔒 Cancel anytime</span>
          <span>•</span>
          <span>🛡️ 30-day money-back guarantee</span>
          <span>•</span>
          <span>⚡ Instant access</span>
        </div>
      </CardSpotlight>
    </div>
  );
};
