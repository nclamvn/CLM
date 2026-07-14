import { Container } from '@/components/shared/Container';
import { brand, tagline } from '@/lib/content';

/**
 * Trang nen. Chua dung section that (Landing thuoc TIP-04).
 * Moi chuoi lay tu lib/content.ts de giu mot nguon duy nhat.
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container>
        <div style={{ maxWidth: 640 }}>
          <div className="brand" style={{ fontSize: 40 }}>
            <span className="accentdot" />
            {brand.wordmark}
          </div>
          <p
            style={{
              marginTop: 22,
              fontSize: 20,
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: 'var(--ink-2)',
              lineHeight: 1.5,
            }}
          >
            {tagline.lead}
            <em
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--dot)',
              }}
            >
              {tagline.focal}
            </em>
            {tagline.tail}
          </p>
          <p
            className="mono"
            style={{
              marginTop: 30,
              fontSize: 10.5,
              letterSpacing: '0.16em',
              color: 'var(--ink-3)',
            }}
          >
            {brand.positioning}
          </p>
        </div>
      </Container>
    </main>
  );
}
