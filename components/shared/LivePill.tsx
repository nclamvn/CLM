import type { ReactNode } from 'react';
import { ui } from '@/lib/content';

/**
 * Pill trang thai voi cham do pulse (bang do). Cham dung aria-hidden vi la
 * trang tri; hieu ung pulse tat khi prefers-reduced-motion.
 */
export function LivePill({ children = ui.livePill }: { children?: ReactNode }) {
  return (
    <span className="live-pill">
      <span className="ld" aria-hidden="true" /> {children}
    </span>
  );
}
