'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademy } from '@/context/AcademyContext';
import { playPop, playSuccessChime, playToggleClick } from '@/lib/sound';

interface TourStep {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: { icon: string; title: string; desc: string }[];
  actionLabel?: string;
  actionHref?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'curriculum',
    badge: 'Step 1 of 4 • Curriculum',
    badgeColor: '#6366f1',
    icon: '⚡',
    title: 'Master Payload CMS 3.x & Next.js 16',
    subtitle: 'From zero to production-grade architecture',
    description: 'Explore 50 comprehensive lessons across 10 structured modules covering Collections, Fields, Hooks, Access Control, Lexical Rich Text, AI/RAG integrations, and Server Actions.',
    highlights: [
      { icon: '📦', title: '50 Deep-Dive Lessons', desc: 'Real-world production schemas, Next.js 16 App Router patterns, and full-stack architecture.' },
      { icon: '🛡️', title: 'Zero to Pro Mastery', desc: 'Granular field & collection access control, custom hooks, and safe database transactions.' },
      { icon: '🚀', title: 'Modern Stack', desc: 'TypeScript, PostgreSQL / SQLite / MongoDB adapters, and S3 / Cloudflare R2 storage.' }
    ]
  },
  {
    id: 'interactive',
    badge: 'Step 2 of 4 • Practice',
    badgeColor: '#10b981',
    icon: '💻',
    title: 'Live Code Challenges & Quizzes',
    subtitle: 'Learn by doing with instant browser validation',
    description: 'Every lesson includes live TypeScript code challenges, runnable schema snippets, and checkpoint quizzes with detailed explanations and XP streaks.',
    highlights: [
      { icon: '▶️', title: 'In-Browser Code Runner', desc: 'Execute live TypeScript schema validations and test API endpoints directly.' },
      { icon: '🎯', title: 'Knowledge Checkpoints', desc: 'Answer interactive quiz questions to reinforce concepts and earn mastery XP.' },
      { icon: '🔥', title: 'Daily Study Streaks', desc: 'Keep your streak alive and track your progress on your personal dashboard.' }
    ]
  },
  {
    id: 'tools',
    badge: 'Step 3 of 4 • Developer Tools',
    badgeColor: '#ec4899',
    icon: '🛠️',
    title: 'Aceternity Floating Dock & Power Tools',
    subtitle: 'Supercharge your learning with integrated dev tools',
    description: 'Access developer utilities right from the bottom floating dock or hit ⌘K anytime for instant global search and keyboard navigation.',
    highlights: [
      { icon: '📐', title: 'Visual Schema Builder', desc: 'Design collections with drag-and-drop fields and export TypeScript configs.' },
      { icon: '🔍', title: 'Query Playground', desc: 'Test Payload Local API queries and filter operators in real time.' },
      { icon: '⏱️', title: 'Pomodoro Focus Timer', desc: '25-minute deep work intervals with synthesized audio chimes.' },
      { icon: '⌨️', title: 'Command Palette (⌘K)', desc: 'Jump to any lesson, search topics, or toggle tools in milliseconds.' }
    ]
  },
  {
    id: 'certification',
    badge: 'Step 4 of 4 • Credential',
    badgeColor: '#f59e0b',
    icon: '🏆',
    title: 'Pro Certification & LinkedIn Badge',
    subtitle: 'Prove your expertise with verifiable credentials',
    description: 'Complete the curriculum, pass the 80-question Pro Certification Exam, and unlock your tamper-proof holographic certificate with 1-click LinkedIn profile integration.',
    highlights: [
      { icon: '✨', title: 'Holographic Glare Certificate', desc: 'Interactive 3D foil credential customized with your name and completion hash.' },
      { icon: '🔗', title: 'Public Verification Link', desc: 'Shareable /verify/[id] page for employers, clients, and team leads.' },
      { icon: '💼', title: '1-Click LinkedIn Integration', desc: 'Add your credential directly to your LinkedIn Licenses & Certifications.' }
    ]
  }
];

export const OnboardingModal: React.FC = () => {
  const { activeModal, setActiveModal, soundEnabled } = useAcademy();
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isOpen = activeModal === 'onboarding';

  // Automatically check if user is first-time visitor on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onboarded = localStorage.getItem('pa-onboarded-v1');
    if (!onboarded) {
      // Delay slightly for smooth initial page load experience
      const timer = setTimeout(() => {
        setActiveModal('onboarding');
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [setActiveModal]);

  const handleClose = useCallback(() => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('pa-onboarded-v1', 'true');
    }
    setActiveModal('none');
    if (soundEnabled) playToggleClick();
  }, [dontShowAgain, setActiveModal, soundEnabled]);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      if (soundEnabled) playPop();
    } else {
      // Finished tour
      if (typeof window !== 'undefined') {
        localStorage.setItem('pa-onboarded-v1', 'true');
      }
      if (soundEnabled) playSuccessChime();
      setActiveModal('none');
    }
  }, [currentStep, soundEnabled, setActiveModal]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      if (soundEnabled) playPop();
    }
  }, [currentStep, soundEnabled]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleClose]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999 }}>
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container with Aceternity glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(18, 20, 29, 0.97) 0%, rgba(10, 11, 16, 0.99) 100%)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(99, 102, 241, 0.25)'
          }}
        >
          {/* Top ambient color flare */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500"
            style={{ background: step.badgeColor }}
          />

          {/* Header Bar */}
          <div className="relative flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300"
                style={{
                  backgroundColor: `${step.badgeColor}20`,
                  color: step.badgeColor,
                  borderColor: `${step.badgeColor}40`
                }}
              >
                {step.badge}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Tour"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Area with Step Transitions */}
          <div className="relative px-6 py-6 min-h-[340px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Title & Subtitle */}
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${step.badgeColor}30, ${step.badgeColor}10)`
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: '#ffffff' }}>
                      {step.title}
                    </h2>
                    <p className="text-sm font-medium mt-1" style={{ color: '#94a3b8' }}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Main Body Description */}
                <p
                  className="text-sm sm:text-base leading-relaxed font-normal"
                  style={{ color: '#f8fafc', fontSize: '15px', lineHeight: '1.65' }}
                >
                  {step.description}
                </p>

                {/* Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {step.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-start"
                      style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                    >
                      <div className="text-xl mb-1.5">{h.icon}</div>
                      <div className="text-xs font-bold mb-1" style={{ color: '#ffffff' }}>{h.title}</div>
                      <div className="text-xs leading-snug" style={{ color: '#cbd5e1', fontSize: '12px' }}>{h.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation Bar */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-white/10 bg-black/40 gap-3">
            {/* Step indicator dots & Don't show toggle */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentStep(idx);
                      if (soundEnabled) playPop();
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentStep === idx
                        ? 'w-6 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                        : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Don't show again checkbox */}
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none hover:text-white" style={{ color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={e => setDontShowAgain(e.target.checked)}
                  className="rounded bg-neutral-800 border-neutral-700 text-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
                />
                Don&apos;t show on startup
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold hover:bg-white/10 border border-white/15 transition-colors cursor-pointer"
                  style={{ color: '#e2e8f0' }}
                >
                  Back
                </button>
              )}

              <button
                onClick={handleClose}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                style={{ color: '#94a3b8' }}
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: currentStep === TOUR_STEPS.length - 1
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                }}
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    <span>Start Learning</span>
                    <span>🚀</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
