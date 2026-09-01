import type { ReactNode } from 'react';
import type { Tier } from '@/lib/content';

/**
 * Nhan tier A/B/C dang mono. A dac, B vien, C nen accent-soft.
 * Khong phai o do (theo ban do do), giu trung tinh.
 */
export function TierBadge({ level, children }: { level: Tier; children: ReactNode }) {
  return <span className={`tier tier${level}`}>{children}</span>;
}
