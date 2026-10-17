'use client'
import React from 'react';
import { AcademyProvider } from '@/context/AcademyContext';
import { SchemaBuilderModal } from '@/components/SchemaBuilderModal';
import { CommandPaletteModal } from '@/components/CommandPaletteModal';
import { BackupModal } from '@/components/BackupModal';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { AiAssistantModal } from '@/components/AiAssistantModal';
import { PomodoroModal } from '@/components/PomodoroModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { AuthModal } from '@/components/AuthModal';
import { ModalA11y } from '@/components/ModalA11y';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AcademyProvider>
      {children}
      {/* Global Interactive Modals & Overlays available everywhere */}
      <SchemaBuilderModal />
      <CommandPaletteModal />
      <BackupModal />
      <ShortcutsModal />
      <CelebrationOverlay />
      <AiAssistantModal />
      <PomodoroModal />
      <OnboardingModal />
      <AuthModal />
      <ModalA11y />
      <ServiceWorkerRegister />
    </AcademyProvider>
  );
};
