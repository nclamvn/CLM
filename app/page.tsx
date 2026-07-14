import { Container } from '@/components/shared/Container';

/**
 * Trang nen TIP-01. Chua dung section that (Landing thuoc TIP-04).
 * Hien wordmark .touch dung font va mau token, kem tagline that de kiem
 * ket xuat tieng Viet co dau, serif italic do focal, va nhan mono.
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
            touch
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
            Chạm đúng đối tác, bằng những match{' '}
            <em
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--dot)',
              }}
            >
              chứng-minh-được
            </em>
            .
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
            Provenance-backed B2B matching
          </p>
        </div>
      </Container>
    </main>
  );
}
