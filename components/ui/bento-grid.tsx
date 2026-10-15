'use client';

import React from 'react';

export const BentoGrid = ({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className = '',
  title,
  description,
  header,
  icon,
  children,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-200 shadow-input dark:shadow-none p-5 border border-[var(--border)] bg-[var(--card)] justify-between flex flex-col space-y-4 hover:border-orange-500/50 cursor-pointer ${className}`}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        {icon}
        <div className="font-bold text-[var(--text)] mb-1 mt-2 text-base">
          {title}
        </div>
        <div className="font-normal text-[var(--muted)] text-xs leading-relaxed">
          {description}
        </div>
        {children}
      </div>
    </div>
  );
};
