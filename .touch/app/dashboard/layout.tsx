import type { Metadata } from 'next';
import '@/styles/dashboard.css';
import { DashShell } from '@/components/dash/DashShell';

export const metadata: Metadata = {
  title: 'Bảng điều khiển · .touch',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashShell>{children}</DashShell>;
}
