import type { ReactNode } from 'react';

/**
 * Nhan section EN mono in hoa, mau do (bang do trong DESIGN_SPEC muc 2).
 * Class .mono lo font mono + uppercase + letter-spacing tren .sec-tag do.
 */
export function SectionTag({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`sec-tag mono ${className}`.trim()}>{children}</span>;
}
