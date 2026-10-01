'use client';

/** Nut in hoac luu PDF cho trang bao cao (dung CSS @media print chung). */
export function NutIn() {
  return <button type="button" className="reg-pill hs-in" onClick={() => window.print()}>In hoặc lưu PDF</button>;
}
