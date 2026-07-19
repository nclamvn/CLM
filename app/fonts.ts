import localFont from 'next/font/local';

/**
 * Font self-host qua next/font/local. File woff2 nam trong public/fonts,
 * moi weight la mot file full-charset (co subset vietnamese) de tranh FOUT
 * va phu du dau tieng Viet. Bien CSS gan vao :root cho DESIGN_SPEC muc 3.
 */

export const beVietnamPro = localFont({
  src: [
    { path: '../public/fonts/BeVietnamPro-300.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/BeVietnamPro-400.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/BeVietnamPro-500.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/BeVietnamPro-600.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/BeVietnamPro-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const fraunces = localFont({
  src: [
    { path: '../public/fonts/Fraunces-400italic.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/Fraunces-500italic.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
});

export const ibmPlexMono = localFont({
  src: [
    { path: '../public/fonts/IBMPlexMono-400.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/IBMPlexMono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});
