import { Fragment } from 'react';
import { hub } from '@/lib/content';

/**
 * Rail trai Hub. Muc "Bảng điều khiển" dang active; cac muc con lai la khung
 * dieu huong cua prototype, chua noi trang that o Phase 1 (inert, van focus duoc).
 */
export function HubRail() {
  return (
    <aside className="rail" aria-label="Điều hướng Hub">
      {hub.rail.map((g) => (
        <Fragment key={g.group}>
          <div className="grp mono">{g.group}</div>
          {g.items.map((it) => (
            <button
              key={it.label}
              type="button"
              className={it.active ? 'on' : ''}
              aria-current={it.active ? 'page' : undefined}
            >
              <span className="i" aria-hidden="true">
                {it.ic}
              </span>{' '}
              {it.label}
            </button>
          ))}
        </Fragment>
      ))}
    </aside>
  );
}
