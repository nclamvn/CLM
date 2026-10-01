import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { HoSoDonVi, type HoSo, type HoSoMeta } from '@/components/hoso/HoSoDonVi';
import hoSo from '@/lib/hub-ho-so.json';
import registry from '@/lib/cncl-registry.json';
import type { CnclUnit } from '@/lib/cncl-registry';
import { ngayVN } from '@/lib/dinh-dang';
import kiemToan from '@/lib/hub-kiem-toan.json';
import { KiemToan, type HoSoKiemToan } from '@/components/hoso/KiemToan';

type DuLieu = { meta: HoSoMeta; units: HoSo[] };
const D = hoSo as unknown as DuLieu;
const R = registry as unknown as { units: CnclUnit[] };
const KT = kiemToan as unknown as Record<string, HoSoKiemToan>;

/** Dung tinh ca 44 trang luc build: slug nao khong co trong du lieu thi 404, khong dung trang rong. */
export function generateStaticParams() {
  return D.units.map((u) => ({ slug: u.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hs = D.units.find((u) => u.slug === slug);
  return { title: `${hs?.ten ?? 'Hồ sơ đơn vị'} - .touch`, robots: { index: false, follow: false } };
}

export default async function HoSoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hs = D.units.find((u) => u.slug === slug);
  if (!hs) notFound();
  const u = R.units.find((x) => x.name === hs.ten);
  if (!u) notFound();
  return (
    <>
      <DashTopBar title="Hồ sơ đơn vị" subtitle={`${hs.ten} · ${hs.dem.cauNguon} câu nguồn · dữ liệu ${ngayVN(D.meta.mocNgay)}`} />
      <div className="dash-content">
        <HoSoDonVi hs={hs} bangChung={u.evidence} meta={D.meta} />
        {KT[u.name] && <KiemToan kt={KT[u.name]} bangChung={u.evidence} />}
      </div>
    </>
  );
}
