'use client'
import React, { useEffect, useRef } from 'react';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { playAchievementFanfare } from '@/lib/sound';

export const CelebrationOverlay: React.FC = () => {
  const { showCelebration, dismissCelebration, celebrationModule, completedLessons, soundEnabled } = useAcademy();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti animation & sound
  useEffect(() => {
    if (!showCelebration) return;
    if (soundEnabled) playAchievementFanfare();
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#f97316', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; rotation: number; vr: number; alpha: number;
    }[] = [];

    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
        alpha: 1,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.y > canvas.height + 20) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // gravity
        p.rotation += p.vr;
        p.alpha = Math.max(0, p.alpha - 0.005);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const timeout = setTimeout(dismissCelebration, 5500);
    return () => { cancelAnimationFrame(raf); clearTimeout(timeout); };
  }, [showCelebration, dismissCelebration, soundEnabled]);

  if (!showCelebration) return null;

  const completedCount = Object.keys(completedLessons).length;
  const totalModules = [...new Set(LESSONS.map(l => l.m))].length;
  const completedModules = [...new Set(
    LESSONS.filter(l => completedLessons[l.id]).map(l => l.m)
  )].length;

  return (
    <div className="celebration-overlay" onClick={dismissCelebration}>
      <canvas ref={canvasRef} className="celebration-canvas" />
      <div className="celebration-card" onClick={e => e.stopPropagation()}>
        <div className="celebration-emoji">🎉</div>
        <h2 className="celebration-title">Module Complete!</h2>
        <p className="celebration-module">{celebrationModule}</p>
        <p className="celebration-desc">
          You&apos;ve mastered all lessons in this module. Keep the momentum going!
        </p>
        <div className="celebration-stats">
          <div className="celebration-stat">
            <span className="celebration-stat-num">{completedCount}</span>
            <span className="celebration-stat-label">Lessons Done</span>
          </div>
          <div className="celebration-stat">
            <span className="celebration-stat-num">{completedModules}/{totalModules}</span>
            <span className="celebration-stat-label">Modules Mastered</span>
          </div>
        </div>
        <button className="sb-btn" onClick={dismissCelebration}>
          Continue Learning →
        </button>
      </div>
    </div>
  );
};
