import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Button } from '@/components/shared/Button';
import { notFound } from '@/lib/content';

/** 404 dung thuong hieu: wordmark, giong fail-loud, hai loi ra (trang dau, bang dieu khien). */
export default function NotFound() {
  return (
    <main id="main" className="nf">
      <Container className="nf-in">
        <div className="brand">
          <span className="accentdot" />
          touch
        </div>
        <div className="nf-code mono">{notFound.code}</div>
        <h1>
          {notFound.titlePre}
          <em>{notFound.titleEm}</em>
          {notFound.titleTail}
        </h1>
        <p>{notFound.p}</p>
        <div className="hero-cta">
          <Button variant="primary" href="/" arrow>
            {notFound.home}
          </Button>
          <Button variant="ghost" href="/dashboard">
            {notFound.dashboard}
          </Button>
        </div>
      </Container>
    </main>
  );
}
