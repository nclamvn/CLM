/**
 * Token nguồn dùng lại trong TS. Đồng bộ 1:1 với biến CSS trong app/globals.css
 * và với design/reference_landing_hub.html (mục 2 DESIGN_SPEC).
 * Bản đồ đỏ: `dot` la accent duy nhat, dung tiet che theo STANDARDS muc 3.
 */
export const colors = {
  paper: '#FBFBFC',
  paper2: '#FFFFFF',
  paper3: '#F4F4F6',
  paper4: '#EBEBEE',
  ink: '#111113',
  ink2: '#3E3E45',
  /* Toi hon reference (#8A8A92) de chu nho dat AA tren cac nen sang (TIP-06). */
  ink3: '#696971',
  line: '#E7E7EB',
  line2: '#D6D6DC',
  accent: '#2C2C33',
  accentD: '#111113',
  accentSoft: '#EFEFF2',
  ok: '#3E3E45',
  okSoft: '#EEEEF1',
  dot: '#E4341E',
  /* Do danh cho chu nho: cung ho voi dot, toi hon de dat AA 4.5:1 (TIP-06). */
  dotText: '#D42B16',
} as const;

export const radius = {
  DEFAULT: '14px',
  s: '9px',
} as const;

export const layout = {
  maxWidth: '1600px',
  pagePadding: 'clamp(22px, 4.5vw, 80px)',
} as const;

export const motion = {
  navUnderline: 'cubic-bezier(.62,.05,.15,1)',
} as const;

export type ColorToken = keyof typeof colors;
