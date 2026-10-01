import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { HoiDap } from '@/components/hoidap/HoiDap';

export const metadata: Metadata = {
  title: 'Hỏi đáp có nguồn · .touch',
  description: 'Hỏi sổ nguồn bằng tiếng Việt; câu trả lời là câu nguồn nguyên văn, không có nguồn thì không trả lời.',
};

export default function HoiDapPage() {
  return (
    <>
      <DashTopBar title="Hỏi đáp có nguồn" subtitle="Hỏi bằng tiếng Việt, trả lời bằng câu nguồn nguyên văn kèm bản chụp" />
      <div className="dash-content"><HoiDap /></div>
    </>
  );
}
