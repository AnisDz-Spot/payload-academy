'use client';

import React, { useRef } from 'react';

export const GlareCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isPointerInside = useRef(false);
  const refElement = useRef<HTMLDivElement>(null);
  const state = useRef({
    glare: {
      x: 50,
      y: 50,
    },
    background: {
      x: 50,
      y: 50,
    },
    rotate: {
      x: 0,
      y: 0,
    },
  });

  const containerStyle = {
    '--m-x': '50%',
    '--m-y': '50%',
    '--r-x': '0deg',
    '--r-y': '0deg',
    '--bg-x': '50%',
    '--bg-y': '50%',
    '--duration': '300ms',
    '--foil-svg': `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    '--step': '5%',
    '--pattern': 'var(--foil-svg) center/100% no-repeat',
    '--rainbow':
      'repeating-linear-gradient( 0deg,rgb(255,119,115) calc(var(--step) * 1),rgba(255,237,95,1) calc(var(--step) * 2),rgba(168,255,95,1) calc(var(--step) * 3),rgba(131,255,247,1) calc(var(--step) * 4),rgba(120,148,255,1) calc(var(--step) * 5),rgb(216,117,255) calc(var(--step) * 6),rgb(255,119,115) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat',
    '--diagonal':
      'repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat',
    '--shade':
      'radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat',
    backgroundBlendMode: 'overlay, hue, hard-light',
  } as React.CSSProperties;

  const updateStyles = () => {
    if (refElement.current) {
      const { background, rotate, glare } = state.current;
      refElement.current.style.setProperty('--m-x', `${glare.x}%`);
      refElement.current.style.setProperty('--m-y', `${glare.y}%`);
      refElement.current.style.setProperty('--r-x', `${rotate.x}deg`);
      refElement.current.style.setProperty('--r-y', `${rotate.y}deg`);
      refElement.current.style.setProperty('--bg-x', `${background.x}%`);
      refElement.current.style.setProperty('--bg-y', `${background.y}%`);
    }
  };

  return (
    <div
      style={{ perspective: '800px' }}
      className="inline-block relative w-full"
    >
      <div
        ref={refElement}
        style={containerStyle}
        className={`relative isolate [contain:layout_style] [will-change:transform] [transition:transform_var(--duration)_ease,box-shadow_var(--duration)_ease] duration-[var(--duration)] ease-out border border-[var(--border)] rounded-2xl overflow-hidden hover:[box-shadow:0_25px_50px_-12px_rgba(0,0,0,0.5)] ${className}`}
        onPointerMove={(event) => {
          const rotateFactor = 0.4;
          const rect = event.currentTarget.getBoundingClientRect();
          const position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
          const percentage = {
            x: (100 / rect.width) * position.x,
            y: (100 / rect.height) * position.y,
          };
          const delta = {
            x: percentage.x - 50,
            y: percentage.y - 50,
          };

          const { background, rotate, glare } = state.current;
          background.x = 50 + percentage.x / 4 - 12.5;
          background.y = 50 + percentage.y / 3 - 16.67;
          rotate.x = -(delta.y / 3.5) * rotateFactor;
          rotate.y = (delta.x / 3.5) * rotateFactor;
          glare.x = percentage.x;
          glare.y = percentage.y;

          updateStyles();
        }}
        onPointerEnter={() => {
          isPointerInside.current = true;
          if (refElement.current) {
            setTimeout(() => {
              if (isPointerInside.current) {
                refElement.current?.style.setProperty('--duration', '0s');
              }
            }, 300);
          }
        }}
        onPointerLeave={() => {
          isPointerInside.current = false;
          if (refElement.current) {
            refElement.current.style.removeProperty('--duration');
            refElement.current.style.setProperty('--r-x', `0deg`);
            refElement.current.style.setProperty('--r-y', `0deg`);
          }
        }}
      >
        <div className="h-full grid will-change-transform origin-center transition-transform duration-[var(--duration)] ease-out [transform:rotateY(var(--r-y))_rotateX(var(--r-x))] rounded-2xl overflow-hidden">
          <div className="w-full h-full grid [grid-area:1/1] mix-blend-soft-light opacity-0 hover:opacity-100 transition-opacity duration-300 [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.4)_10%,_rgba(255,255,255,0.2)_20%,_rgba(0,0,0,0.5)_90%)]" />
          <div className="w-full h-full grid [grid-area:1/1] mix-blend-color-dodge opacity-0 hover:opacity-80 transition-opacity duration-300 [background:var(--rainbow)] [background-size:200%_700%]" />
          <div className="w-full h-full grid [grid-area:1/1] z-10">{children}</div>
        </div>
      </div>
    </div>
  );
};
