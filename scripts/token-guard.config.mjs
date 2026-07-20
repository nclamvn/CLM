// Cau hinh token guard vong dau. Chi quet giao dien moi (token-based).
export default {
  // thu muc quet de quy (them file don le o scanFiles)
  scanDirs: ['components/dash', 'components/brand', 'components/portal', 'app/dashboard'],
  scanFiles: ['styles/dashboard.css', 'styles/touch-landing.css'],
  scanExt: ['.css', '.tsx', '.ts'],

  // KHONG quet: file token goc + svg data + build
  allowedFiles: ['styles/touch-theme.css', 'styles/touch-portal.css', 'styles/touch-design-tokens.json'],
  excludeExt: ['.svg', '.map', '.json', '.png', '.woff2', '.ttf'],

  // spacing whitelist (vong dau chi warning)
  allowedSpacing: ['0', '1px', '2px', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px', '80px'],
};
