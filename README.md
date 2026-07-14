# .touch

Website `.touch`, provenance-backed B2B matching. Next.js App Router, TypeScript, Tailwind.

Repo do Thợ (Claude Code) dựng theo gói kế hoạch trong `KnowledgeBase/touch_hub` (VISION, BLUEPRINT, STANDARDS, TASK_GRAPH, DESIGN_SPEC). Đây là website prototype, tách khỏi engine PoC cào-lọc-match (backend riêng).

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm run check:emdash   # cổng cứng: 0 em-dash toàn source
```

## Cấu trúc (đang dựng theo TIP)

```
app/         layout, page, globals.css, fonts, icon
components/  shared (Container...), landing, hub, globe  (dựng dần theo TASK_GRAPH)
lib/         tokens, content, demo-data
public/fonts woff2 self-host (Be Vietnam Pro, Fraunces italic, IBM Plex Mono)
scripts/     check-emdash.mjs (cổng QA)
```

## Trạng thái TIP

- TIP-01 scaffold: xong (khung Next.js, token, font self-host, wordmark).
- TIP-02..07: theo `TASK_GRAPH.md`.

## Ghi chú

- Font self-host qua `next/font/local`, mỗi weight một woff2 gộp subset latin + vietnamese.
- Deploy-agnostic: hosting chưa chốt. Site URL đặt qua `NEXT_PUBLIC_SITE_URL`, mặc định localhost.
