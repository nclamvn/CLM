import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/shared/Container';
import { GlobeDemo } from './GlobeDemo';

/**
 * Trang demo Globe cho TIP-03. Chi hien o dev, 404 o production.
 */
export const metadata: Metadata = {
  title: 'Globe (dev)',
  robots: { index: false, follow: false },
};

export default function GlobeDevPage() {
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
        <p
          className="mono"
          style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: 36 }}
        >
          Matching sphere · TIP-03
        </p>
        <GlobeDemo />
      </Container>
    </main>
  );
}
