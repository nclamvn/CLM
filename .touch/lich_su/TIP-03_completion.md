# Completion Report, TIP-03 Quả cầu (port canvas)

Thợ: Claude Code. Ngày: 2026-07-14. Trạng thái: HOÀN THÀNH, chờ X-Ray. Chưa commit.

## Phạm vi đã làm
Port logic quả cầu dot-map từ reference sang React client component, giữ nguyên thuật toán và hành vi, cleanup đầy đủ, tôn trọng prefers-reduced-motion.

## Files
Mới:
- `components/globe/globe-core.ts`: logic thuần, không React, không state. Port line-for-line từ khối "Matching Sphere" của SOT. `createGlobe(canvas, {reducedMotion})` trả về `{destroy}`.
- `components/globe/Globe.tsx`: client component, useRef canvas, useEffect init, cleanup `destroy()` khi unmount, đọc `prefers-reduced-motion`. Canvas aria-hidden (trang trí).
- `app/dev/globe/page.tsx` + `GlobeDemo.tsx`: demo nội bộ (404 production) với nút mount/unmount để kiểm cleanup và chú thích Cầu/Cung/Khớp.
Sửa:
- `app/globals.css`: thêm `.globe-canvas` (width 100%, aspect-ratio 1). Không đụng token.

563 dòng source TIP-03.

## Đối chiếu thuật toán với SOT (parity)
- Số chấm N = **1337**, khớp đúng SOT ("~1.337 chấm, ≈28% land"). Kiểm bằng cách chạy lại thuật toán sinh node trong trình duyệt.
- Giữ nguyên: landmask 24 ellipse + Nam Cực (lat<-68), lưới lat 3.1 độ, cols = round(128*cos(lat)), xoay trục Y (rot3 Y rồi X tilt), parallax chuột (mmx/mmy lerp 0.04), intro scale-in (ease cubic), chiếu sáng hướng L, guide rings (2 vòng), bóng tiếp đất elip, viền rìa gradient, vòng đời match (xám khi nối, đỏ khi đạt, node lớn đỏ có quầng + vòng, xung đỏ, dấu ◆ nở), tối đa 4 cặp, cổng chọn cặp dot>0.25. Mọi hằng số giữ nguyên.
- Kỷ luật đỏ: RED [228,52,30] chỉ ở vòng đời match (cung, node đạt, xung, ◆), đúng bản đồ đỏ. Node lục địa và rings trung tính.
- Thị giác: ảnh chụp xác nhận dot-map lục địa, rings, bóng, và 4 cung match đỏ với node đạt phình to có quầng. Khớp reference.

## Cleanup (kiểm bằng mount/unmount lặp, đo được)
- `destroy()`: set alive=false, cancelAnimationFrame, ResizeObserver.disconnect, removeEventListener mousemove.
- Bộ đếm `window.__globeActive`: mount = 1, unmount = **0**, remount = **1** (không tích luỹ). Canvas rời DOM khi unmount. Không leak rAF hay listener.

## Reduced-motion
- reducedMotion true: vẽ một khung tĩnh (rotY cố định 0.6, không parallax, không match), KHÔNG chạy rAF, KHÔNG gắn mousemove. ResizeObserver vẫn redraw khung tĩnh khi đổi kích thước.
- Kiểm ở mức code path. Tool tự động không mô phỏng được emulated media, đề nghị Con người xác nhận bằng cách bật reduced-motion ở OS.

## Hiệu năng
- Không đo được fps qua rAF trong ngữ cảnh này: tab tự động là `document.hidden = true` nên trình duyệt throttle rAF về 0 (đo ra 0 frame trong 2s là do throttle, không phải globe đứng). Ảnh chụp cho thấy globe có animate khi trang có focus.
- Thay bằng chi phí compute mỗi khung (đồng bộ, không phụ thuộc rAF): project toàn bộ 1337 node = **0.065ms/khung**, dưới xa ngân sách 16.6ms của 60fps. Cộng với việc thuật toán trùng khít SOT (vốn chạy mượt), fps >= 50 gần như chắc chắn.
- Đề nghị X-Ray xác nhận fps chính xác trên cửa sổ foreground thật.

## Cổng
- em-dash/en-dash: 0.
- build: PASS, 0 cảnh báo. Route `/dev/globe` 3.54 kB.
- console: trống, 0 lỗi, 0 cảnh báo, không hydration warning.

## Quyết định tự quyết (ghi lại)
1. Dùng ResizeObserver quan sát canvas (theo BLUEPRINT mục 5) thay cho window resize của reference. Chính xác hơn với kích thước phần tử, và dọn bằng disconnect.
2. Thêm bộ đếm dev `window.__globeActive` trong globe-core để kiểm cleanup định lượng. Chi phí không đáng kể, không ảnh hưởng production.
3. mousemove vẫn gắn ở window (parallax theo chuột toàn màn như SOT), gỡ sạch khi destroy.
4. Canvas aria-hidden vì là trang trí; ý nghĩa Cầu/Cung/Khớp truyền qua chú thích văn bản kèm ngoài (đúng DESIGN_SPEC mục 6).

## Chưa làm (đúng non-goals)
Không dữ liệu thật vào quả cầu, không WebGL. Chưa đặt Globe vào hero (thuộc TIP-04) với .globe-wrap và legend chính thức.

## Đề xuất
Xin X-Ray, đặc biệt fps trên foreground và cleanup. Sau khi đạt, tôi tạo commit mốc "TIP-03 globe" rồi mở TIP-04 (Landing) vì Landing cần cả TIP-02 và TIP-03.
