/* TIP-PORTAL-V1 muc 1.1 + 14: moi route link dinh nghia tap trung. */
export type PortalRouteKey = 'landing' | 'hub' | 'dashboard';

export interface PortalRoute {
  key: PortalRouteKey;
  href: string;
  label: string;
  desc: string;
}

/** 3 cap do cua cung mot san pham (dung cho PortalSwitcher). */
export const PORTAL_ROUTES: PortalRoute[] = [
  { key: 'landing', href: '/', label: 'Landing', desc: 'Giới thiệu engine' },
  { key: 'hub', href: '/hub', label: 'Hub', desc: 'Workspace matching' },
  { key: 'dashboard', href: '/dashboard', label: 'Dashboard', desc: 'Control room dự án' },
];

/** Deep link dung chung (tranh hardcode rai rac). */
export const ROUTE = {
  landing: '/',
  hub: '/hub',
  dashboard: '/dashboard',
  hubRegistry: '/hub?view=registry',
  hubProvenance: '/hub?view=provenance',
} as const;
