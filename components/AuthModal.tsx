'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademy } from '@/context/AcademyContext';
import { playPop, playSuccessChime, playToggleClick } from '@/lib/sound';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const AVATARS = ['👨‍💻', '👩‍💻', '🚀', '⚡', '🛡️', '🧙‍♂️', '🧠', '💎'];

export const AuthModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    soundEnabled,
  } = useAcademy();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [mergeGuest, setMergeGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOpen = activeModal === 'auth';

  if (!isOpen) return null;

  const handleClose = () => {
    if (soundEnabled) playToggleClick();
    setErrorMsg(null);
    setActiveModal('none');
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    if (soundEnabled) playPop();
    setAuthModalTab(tab);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (authModalTab === 'login') {
      const res = await login(email, password, mergeGuest);
      setIsLoading(false);
      if (res.success) {
        if (soundEnabled) playSuccessChime();
      } else {
        setErrorMsg(res.error || 'Failed to sign in');
      }
    } else {
      const res = await register(email, password, name, avatar, mergeGuest);
      setIsLoading(false);
      if (res.success) {
        if (soundEnabled) playSuccessChime();
      } else {
        setErrorMsg(res.error || 'Failed to create account');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Auth Modal</h2>
        {authModalTab === 'login' && (
          <form>
            <div>
              <input type="email" placeholder="Email" required />
            </div>
            <div>
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Loading…' : 'Sign In'}</button>
          </form>
        )}
        {authModalTab === 'register' && (
          <form>
            <div>
              <input type="text" placeholder="Name" required />
            </div>
            <div>
              <input type="email" placeholder="Email" required />
            </div>
            <div>
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Loading…' : 'Create Account'}</button>
          </form>
        )}
      </div>
    </div>
  );
};