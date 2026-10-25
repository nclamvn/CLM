# .touch

Web của CàoLọcMatch: trang đầu một màn và bảng điều khiển cung cầu công nghệ chiến lược. Next.js 15 (App Router), TypeScript, xuất tĩnh; mọi dữ liệu sinh lúc build từ sổ nguồn, không có máy chủ dữ liệu. Tổng quan dự án ở [README của kho](../README.md).

## Chạy

```
npm ci
npx next build && npx next start -p 3200      # http://localhost:3200 (cổng 3000 trên máy anh Lâm là dự án khác)
node scripts/gen-cncl-data.mjs && node scripts/gen-hub-data.mjs   # sinh lại dữ liệu từ sổ nguồn
```

Kiểm định không chạy riêng ở đây: dùng `../CaoLocMatch/chay_het_cong.sh`, chuỗi đó chạy mọi `scripts/check-*.mjs` và `scripts/bite-*.mjs` của web cùng các cổng của sổ nguồn.

## Cấu trúc

```
app/                 trang đầu (/), bảng điều khiển (/dashboard/*), /hub chuyển về bảng điều khiển
components/          theo màn: modau, cauthat, dieuphoi, hoidap, hoso, phuongphap, proof (bản chụp, lớp phủ nguồn)
lib/                 hàm thuần dùng chung cho web và cổng (mo-dau, hoi-dap, kiem-toan, dieu-phoi, lich-su-lo...)
lib/*.json           dữ liệu đã sinh; KHÔNG sửa tay
public/evidence/     bản chụp trang nguồn mà câu nguồn trỏ tới
scripts/gen-*.mjs    sinh dữ liệu web
scripts/check-*.mjs  cổng (exit 0 sạch, 2 vi phạm, 3 không chạy được)
scripts/bite-*.mjs   bộ thử tự cài lỗi cho từng cổng, dựng cảnh trong thư mục tạm
styles/              token đơn sắc, bảng màu dữ liệu, phông Inter và Noto Serif
```

## Luật của web

- Mọi số trên màn đọc từ `lib/*.json`; cổng đếm lại độc lập.
- Mọi câu nguồn hiện ra qua `hienCau` (gỡ dấu markdown, không mất chữ) và mở được bản chụp trong cửa sổ trên trang.
- Đơn sắc; màu chỉ cho đồ hoạ dữ liệu. Chữ không nhỏ hơn 12px. Nhãn tiếng Việt theo bảng thuật ngữ. Không dùng gạch ngang dài.
- Menu nhóm theo việc; mỗi trang thuộc đúng một mục (`scripts/check-menu.mjs`).
