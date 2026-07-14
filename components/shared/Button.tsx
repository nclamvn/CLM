import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost';

type BaseProps = {
  variant?: Variant;
  /** Hien mui ten truot phai khi hover (span.ar). */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkButton = BaseProps & {
  href: string;
};

type NativeButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

/**
 * Nut dung chung. Co href thi render Link (dieu huong that), khong thi render
 * button. Bien primary/ghost, trang thai hover/focus tu CSS, disabled thiet ke.
 * Neu truyen onClick, component phai nam trong cay client.
 */
export function Button(props: LinkButton | NativeButton) {
  const { variant = 'primary', arrow = false, children, className = '' } = props;
  const classes = `btn btn-${variant} ${className}`.trim();
  const inner = (
    <>
      {children}
      {arrow ? (
        <span className="ar" aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, arrow: _a, children: _c, className: _cn, href: _h, ...rest } = props as NativeButton;
  return (
    <button className={classes} {...rest}>
      {inner}
    </button>
  );
}
