'use client';
import { useEffect } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.tabIndex !== -1 && el.getClientRects().length > 0,
  );
}

/**
 * Centralised dialog focus management. Any element rendered with
 * `role="dialog" aria-modal="true"` automatically receives keyboard focus on
 * open, traps Tab/Shift+Tab inside, and restores focus to the trigger on close.
 * Escape-to-close is handled separately by AcademyContext.
 */
export function ModalA11y() {
  useEffect(() => {
    let lastFocused: HTMLElement | null = null;
    let activeDialog: HTMLElement | null = null;

    const currentDialog = (): HTMLElement | null => {
      const dialogs = Array.from(
        document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]'),
      );
      return dialogs[dialogs.length - 1] ?? null;
    };

    const sync = () => {
      const dialog = currentDialog();
      if (dialog && dialog !== activeDialog) {
        if (!activeDialog) lastFocused = document.activeElement as HTMLElement | null;
        activeDialog = dialog;
        const [first] = focusables(dialog);
        (first ?? dialog).focus({ preventScroll: true });
      } else if (!dialog && activeDialog) {
        activeDialog = null;
        lastFocused?.focus?.({ preventScroll: true });
        lastFocused = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !activeDialog) return;
      const items = focusables(activeDialog);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      if (!activeDialog) return;
      if (!activeDialog.contains(e.target as Node)) {
        const [first] = focusables(activeDialog);
        (first ?? activeDialog).focus({ preventScroll: true });
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, []);

  return null;
};
