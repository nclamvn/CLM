import type { ElementType, ReactNode } from 'react';

type ContainerProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/**
 * Khung noi dung chuan: max-width 1600px, padding clamp(22px, 4.5vw, 80px),
 * canh giua. Dung o moi section (DESIGN_SPEC muc 4, .wrap trong reference).
 */
export function Container({ as: Tag = 'div', children, className = '' }: ContainerProps) {
  return (
    <Tag
      className={className}
      style={{
        maxWidth: 'var(--maxw)',
        marginInline: 'auto',
        paddingInline: 'clamp(22px, 4.5vw, 80px)',
      }}
    >
      {children}
    </Tag>
  );
}
