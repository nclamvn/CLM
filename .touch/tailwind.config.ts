import type { Config } from 'tailwindcss';
import { colors, layout, radius } from './lib/tokens';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: colors.paper,
        'paper-2': colors.paper2,
        'paper-3': colors.paper3,
        'paper-4': colors.paper4,
        ink: colors.ink,
        'ink-2': colors.ink2,
        'ink-3': colors.ink3,
        line: colors.line,
        'line-2': colors.line2,
        accent: colors.accent,
        'accent-d': colors.accentD,
        'accent-soft': colors.accentSoft,
        ok: colors.ok,
        'ok-soft': colors.okSoft,
        dot: colors.dot,
        'dot-text': colors.dotText,
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: radius.DEFAULT,
        s: radius.s,
      },
      maxWidth: {
        content: layout.maxWidth,
      },
      letterSpacing: {
        tightest: '-.03em',
        mono: '.08em',
      },
      transitionTimingFunction: {
        nav: 'cubic-bezier(.62,.05,.15,1)',
      },
    },
  },
  plugins: [],
};

export default config;
