import Link from 'next/link';
import { hub } from '@/lib/content';

/** Thanh tren Hub: wordmark, chuyen nganh, search, DEMO DATA, ve trang chu, avatar. */
export function HubTopBar() {
  return (
    <header className="hub-top">
      <div className="l">
        <div className="brand" style={{ fontSize: 19 }}>
          <span className="accentdot" />
          touch
        </div>
        <button type="button" className="dom-switch">
          {hub.domainLabel} <b>{hub.domainValue}</b> <span aria-hidden="true">▾</span>
        </button>
      </div>
      <button type="button" className="hub-search">
        <span aria-hidden="true">⌕</span> {hub.searchPlaceholder}
      </button>
      <div className="r">
        <span className="demo-tag">{hub.demoTag}</span>
        <Link className="nav-login" href="/" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
          {hub.backHome}
        </Link>
        <div className="avatar" aria-hidden="true">
          {hub.avatar}
        </div>
      </div>
    </header>
  );
}
