import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/shared/Button';
import { SectionTag } from '@/components/shared/SectionTag';
import { LivePill } from '@/components/shared/LivePill';
import { TierBadge } from '@/components/shared/TierBadge';
import { ViewSwitch } from '@/components/shared/ViewSwitch';
import { MatchCard } from '@/components/shared/MatchCard';
import { demoMatch } from '@/lib/content';

/**
 * Trang demo noi bo cho TIP-02. Chi hien o dev, 404 o production de khong lo
 * ra site that. Dung soi tung primitive va cac trang thai.
 */
export const metadata: Metadata = {
  title: 'Primitives (dev)',
  robots: { index: false, follow: false },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '26px 0', borderBottom: '1px solid var(--line)' }}>
      <div
        className="mono"
        style={{ fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: 16 }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
}

export default function PrimitivesDemo() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <main style={{ padding: '48px 0 120px' }}>
      <Container>
        <div className="brand" style={{ fontSize: 26, marginBottom: 6 }}>
          <span className="accentdot" />
          touch
        </div>
        <p className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-3)' }}>
          Shared primitives · TIP-02
        </p>

        <Row label="Button · primary / ghost / arrow / disabled">
          <Button variant="primary" href="#">
            Yêu cầu demo
          </Button>
          <Button variant="primary" href="#" arrow>
            Yêu cầu demo
          </Button>
          <Button variant="ghost" href="#">
            Xem Hub hoạt động
          </Button>
          <Button variant="primary" disabled>
            Đang xử lý
          </Button>
        </Row>

        <Row label="SectionTag (đỏ, mono in hoa)">
          <SectionTag>The pipeline</SectionTag>
          <SectionTag>The atomic unit</SectionTag>
        </Row>

        <Row label="LivePill (chấm đỏ pulse)">
          <LivePill />
          <LivePill>Live · demo data</LivePill>
        </Row>

        <Row label="TierBadge (A đặc / B viền / C accent-soft)">
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Nguồn cung
            <TierBadge level="A">TIER A</TierBadge>
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Nguồn cầu
            <TierBadge level="B">TIER B</TierBadge>
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Chưa kiểm
            <TierBadge level="C">CLAIM</TierBadge>
          </span>
        </Row>

        <Row label="ViewSwitch (active: landing / hub)">
          <ViewSwitch active="landing" />
          <ViewSwitch active="hub" />
        </Row>

        <div style={{ padding: '30px 0' }}>
          <div
            className="mono"
            style={{ fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: 16 }}
          >
            MatchCard · mặc định
          </div>
          <div style={{ maxWidth: 520 }}>
            <MatchCard data={demoMatch} />
          </div>

          <div
            className="mono"
            style={{ fontSize: 10.5, letterSpacing: '0.14em', color: 'var(--ink-3)', margin: '34px 0 16px' }}
          >
            MatchCard · flush (nhúng trong khung Hub)
          </div>
          <div
            style={{
              maxWidth: 520,
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}
          >
            <MatchCard data={demoMatch} flush />
          </div>
        </div>
      </Container>
    </main>
  );
}
