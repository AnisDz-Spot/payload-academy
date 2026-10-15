'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SparklesCore = ({
  id,
  className = '',
  background = 'transparent',
  minSize = 1,
  maxSize = 3,
  particleDensity = 60,
  particleColor = '#f97316',
}: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const count = particleDensity;
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, [maxSize, minSize, particleDensity]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ background }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${p.size * 2}px ${particleColor}`,
          }}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
