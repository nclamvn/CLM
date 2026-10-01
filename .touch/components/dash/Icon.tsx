/* Line icons 1.5px stroke, frame 20, rounded - theo handbook muc 3.5 / 5. Token color qua currentColor. */
import type { ReactElement } from 'react';

type IconName =
  | 'home' | 'layers' | 'cpu' | 'shield' | 'gauge' | 'alert' | 'doc' | 'branch' | 'gear'
  | 'check' | 'search' | 'bell' | 'lock' | 'chevron' | 'people' | 'target';

const P: Record<IconName, ReactElement> = {
  home: <path d="M3 9.5 10 3.5l7 6V16a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1z" />,
  layers: <><path d="M10 3 3 6.7l7 3.7 7-3.7z" /><path d="M3.4 10.2 10 13.7l6.6-3.5M3.4 13.3 10 16.8l6.6-3.5" /></>,
  cpu: <><rect x="5.5" y="5.5" width="9" height="9" rx="1.5" /><rect x="8.5" y="8.5" width="3" height="3" rx="0.5" /><path d="M8 3v2M12 3v2M8 15v2M12 15v2M3 8h2M3 12h2M15 8h2M15 12h2" /></>,
  shield: <><path d="M10 3 4.5 5v4.5c0 3.4 2.4 5.6 5.5 6.8 3.1-1.2 5.5-3.4 5.5-6.8V5z" /><path d="M7.5 10l1.7 1.7L13 8" /></>,
  gauge: <><path d="M4 14a6 6 0 1 1 12 0" /><path d="M10 13l3-3" /></>,
  alert: <><path d="M10 4 3.5 16h13z" /><path d="M10 9v3M10 14.2v.1" /></>,
  doc: <><path d="M6 3h5l3 3v11H6z" /><path d="M11 3v3h3M8 11h4M8 13.5h4" /></>,
  branch: <><circle cx="6.5" cy="5.5" r="1.8" /><circle cx="6.5" cy="14.5" r="1.8" /><circle cx="13.5" cy="5.5" r="1.8" /><path d="M6.5 7.3v5.4M13.5 7.3c0 3-2 4-5 4.7" /></>,
  gear: <><circle cx="10" cy="10" r="2.5" /><path d="M10 3v2.2M10 14.8V17M3 10h2.2M14.8 10H17M5 5l1.6 1.6M13.4 13.4 15 15M15 5l-1.6 1.6M6.6 13.4 5 15" /></>,
  check: <path d="M4 10.2l3.4 3.4L15.5 6" />,
  search: <><circle cx="9" cy="9" r="5" /><path d="M13 13l3.5 3.5" /></>,
  bell: <><path d="M6 8a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5H4.5S6 12 6 8z" /><path d="M8.5 16a1.6 1.6 0 0 0 3 0" /></>,
  lock: <><rect x="5" y="9" width="10" height="7.5" rx="1.5" /><path d="M7 9V6.8a3 3 0 0 1 6 0V9" /></>,
  chevron: <path d="M6 8.5l4 4 4-4" />,
  target: <><circle cx="10" cy="10" r="6.5" /><circle cx="10" cy="10" r="3" /><path d="M10 2v3M10 15v3M2 10h3M15 10h3" /></>,
  people: <><circle cx="7.5" cy="7" r="2.2" /><path d="M3.5 16c0-2.4 1.8-4 4-4s4 1.6 4 4" /><path d="M13 6.2a2.2 2.2 0 0 1 0 4.3M13.5 12.4c1.9.3 3 1.8 3 3.6" /></>,
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}
