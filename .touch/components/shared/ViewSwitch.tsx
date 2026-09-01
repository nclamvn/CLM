import Link from 'next/link';
import { ui } from '@/lib/content';

type Surface = 'landing' | 'hub';

/**
 * Pill chuyen Landing / Hub. La hai route that (/ va /hub) de chia se link va
 * SEO. `fixed` bat ban noi giua duoi man theo mock; mac dinh tinh de tai dung.
 */
export function ViewSwitch({
  active,
  fixed = false,
}: {
  active: Surface;
  fixed?: boolean;
}) {
  return (
    <nav
      className={`viewswitch ${fixed ? 'viewswitch-fixed' : ''}`.trim()}
      aria-label="Chuyển bề mặt Landing và Hub"
    >
      <Link
        href="/"
        className={active === 'landing' ? 'on' : ''}
        aria-current={active === 'landing' ? 'page' : undefined}
      >
        {ui.viewLanding}
      </Link>
      <Link
        href="/hub"
        className={active === 'hub' ? 'on' : ''}
        aria-current={active === 'hub' ? 'page' : undefined}
      >
        {ui.viewHub}
      </Link>
    </nav>
  );
}
