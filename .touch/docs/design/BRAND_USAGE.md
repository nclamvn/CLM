# .touch Brand Usage Rules

Component logo DUY NHAT: `components/brand/TouchBrand.tsx`. KHONG dung logo `.touch` thu cong (dot + text) o bat ky trang nao. Moi be mat (sidebar, icon rail, mobile header, auth screen) deu import component nay.

## API

```tsx
<TouchBrand mode="full | compact | mark" theme="dark | light" size="xs | sm | md | lg" href? subtitle? />
```

- `full`: dot + wordmark + subtitle (subtitle decorative).
- `compact`: dot + wordmark.
- `mark`: chi dot (icon rail thu gon).

## Quy tac bat buoc

- Dot luon dung `var(--brand-dot-red)`. KHONG doi mau theo hover / active / disabled.
- Wordmark: trang tren dark, den tren light, qua `var(--brand-wordmark)` (set boi `.touch-brand--dark` / `.touch-brand--light`).
- KHONG gradient tren chu. KHONG glow / shadow tren logo.
- KHONG tach dot khoi chu. KHONG dung logo bang text o tung trang.
- `aria-label=".touch"`. Subtitle la `aria-hidden`, khong nam trong accessible name.
- Safe-area + kich thuoc khoa bang token: `--brand-dot-size`, `--brand-lockup-gap`, `--brand-dot-offset`, `--brand-word-size`, `--brand-word-line` (theo `.touch-brand--{size}`).
- Component token-only: khong raw color / spacing / font (token guard quet `components/brand`).

## Token

`--brand-dot-red` (= `--color-brand-dot`), `--brand-word-dark`, `--brand-word-light`, `--brand-descriptor`. Kich thuoc theo size class trong `styles/touch-theme.css`.

## Visual test

Trang `/dev/tokens` render cac variant (full / compact / mark, cac size) de kiem thi giac; screenshot luu o `reports/brand-variants.png`.
