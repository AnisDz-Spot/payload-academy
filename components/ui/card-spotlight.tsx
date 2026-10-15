'use client';

import React, { useState } from 'react';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';

export const CardSpotlight = ({
  children,
  radius = 280,
  color = '#f97316',
  className = '',
  style,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden group/spotlight rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: 'transparent',
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-transparent"
          style={{ mixBlendMode: 'screen' }}
        />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
