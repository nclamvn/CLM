/**
 * goc.mjs · Tim goc duong dan, chay duoc o CA HAI moi truong.
 *
 * VI SAO TACH RA THANH MODULE RIENG (24/08/2026): logic nay bi chep tay vao hai script, va
 * mot ban co try/catch con ban kia thi khong. Ban thieu do sap ngay tren may anh Lam voi
 * `ENOENT: scandir '/sessions'`, dung luc anh dinh chup man hinh.
 *
 * Loi nay khong bi bat vi moi truong nao cung CHI CO MOT goc: may Mac co /Users/os va khong
 * co /sessions; may Linux cua Claude co /sessions va khong co /Users/os. Nen moi ban chi
 * duoc chay o dung noi ma nhanh kia khong bao gio thuc thi. Test o mot moi truong khong noi
 * duoc gi ve moi truong con lai.
 *
 * LUAT: khong duoc de mot goc VANG MAT lam sap chuong trinh. Vang mat la trang thai binh
 * thuong o day, khong phai loi.
 *
 * Tu kiem: node scripts/goc.mjs --tu-kiem
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Danh sach goc co the co. Goc nao khong ton tai thi bo qua, khong nem loi. */
export function cacGoc(nenLinux = '/sessions') {
  const ds = ['/Users/os'];
  try {
    for (const d of readdirSync(nenLinux, { withFileTypes: true })) {
      if (d.isDirectory()) ds.push(join(nenLinux, d.name, 'mnt'));
    }
  } catch {
    // NUOT CO Y: khong co thu muc phien Linux la TRANG THAI BINH THUONG, khong phai loi.
    // May that co /Users/os va khong co /sessions; may Linux thi nguoc lai. Moi moi truong
    // chi co MOT goc, nen vang mat mot goc khong duoc lam sap chuong trinh.
    //
    // Cho nuot nay CO PHEP THU RIENG: `node scripts/goc.mjs --tu-kiem` dung mot thu muc nen
    // khong ton tai de ep dung nhanh nay chay, roi kiem ket qua. Khac han cac cho nuot khac
    // o cho no khong chi duoc khai, no duoc CHUNG MINH.
  }
  return ds;
}

/** Tra ve duong dan dau tien ton tai, hoac null. */
export function goc(...duoi) {
  for (const g of cacGoc()) {
    const p = join(g, ...duoi);
    if (existsSync(p)) return p;
  }
  return null;
}

/** Nhu goc() nhung THIEU thi bao ro va thoat, khong de den luc doc file moi vo. */
export function tim(nhan, ...duoi) {
  const p = goc(...duoi);
  if (!p) {
    console.error(`KHONG THAY ${nhan}: ${duoi.join('/')} o cac goc ${cacGoc().join(', ')}`);
    process.exit(2);
  }
  return p;
}

if (process.argv[1] && process.argv[1].endsWith('goc.mjs') && process.argv.includes('--tu-kiem')) {
  let ok = true;
  // Canh chinh la ca da sap: goc Linux KHONG TON TAI.
  try {
    const ds = cacGoc('/khong-he-co-thu-muc-nay');
    const dung = ds.length === 1 && ds[0] === '/Users/os';
    console.log(`${'goc Linux vang mat thi khong sap'.padEnd(38)} : ` +
      (dung ? 'OK (tra ve dung mot goc /Users/os)' : `SAI !! ${JSON.stringify(ds)}`));
    ok = ok && dung;
  } catch (e) {
    console.log(`${'goc Linux vang mat thi khong sap'.padEnd(38)} : SAI !! nem loi ${e.code || e.message}`);
    ok = false;
  }
  // Goc that phai tim duoc it nhat mot noi, neu khong thi moi truong nay hong.
  const co = cacGoc().some((g) => existsSync(g));
  console.log(`${'moi truong hien tai co goc dung duoc'.padEnd(38)} : ` +
    (co ? `OK (${cacGoc().filter((g) => existsSync(g)).join(', ')})` : 'SAI !! khong goc nao ton tai'));
  ok = ok && co;
  console.log('-'.repeat(62));
  console.log('TU KIEM GOC:', ok ? 'DAT' : 'KHONG DAT');
  process.exit(ok ? 0 : 1);
}
