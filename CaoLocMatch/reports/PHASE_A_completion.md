# Completion Report · Tuan 2 Phase A (TIP 05, muc 1-4)

Ngay: 17/07/2026 (Phase A xong truoc lich 21-22/07). Workspace: `/Users/os/CaoLocMatch`
(git rieng, tach khoi repo website). Du lieu Phase A la SYNTHETIC co chu dich,
KHONG phai du lieu that; moi con so duoi day chi chung minh may chay va rang can,
KHONG mang y nghia SM1.

## Files / lines (Tho sinh)

| File | Dong | Vai tro |
|---|---|---|
| match_engine.py | 312 | fact layer + overlay rule + gate 04 + validate CLI |
| make_synthetic.py | 145 | sinh du lieu tong hop, tu kiem span verbatim |
| match_bites.py | 126 | 4 rang match gate |
| check_dash.py | 29 | cong 0 em/en-dash (methodbox/ nguyen van, khong quet) |
| domain.yaml + claims.jsonl | 66 | khung 01 + 41 claim / 5 snapshot |
| README.md | 43 | lenh tai lap tung buoc |

methodbox/ = ban sao nguyen van refinery.py, bites.py, new_domain.py (khong sua 1 byte).

## Bang 10 rang (tat ca chay tren ban sao, exit code 2 = can)

| # | Rang (ten TIP) | Ten trong engine | Ket qua |
|---|---|---|---|
| 1 | SPAN_NOT_FOUND | SPAN_NOT_FOUND | CAN, exit 2 |
| 2 | TIER_INCONSISTENT | SOURCED_ATTR (tier/extraction/field/capture hop le) | CAN, exit 2 |
| 3 | ALIAS_UNKNOWN / AMBIGUOUS_MERGED | AMBIGUOUS_MERGE_UNFLAGGED | CAN, exit 2 |
| 4 | DENOMINATOR_MISSING | DISTRIBUTION_NO_DENOMINATOR | CAN, exit 2 |
| 5 | (core) CAPTURE_MISSING | CAPTURE_MISSING | CAN, exit 2 |
| 6 | (core) IDEMPOTENT | IDEMPOTENT | CAN, exit 2 |
| 7 | MATCH_CHAIN_BROKEN | MATCH_CHAIN_BROKEN | CAN, exit 2 |
| 8 | MATCH_FACT_NO_EVIDENCE | MATCH_FACT_NO_EVIDENCE | CAN, exit 2 |
| 9 | MATCH_RATIONALE_MISSING | MATCH_RATIONALE_MISSING | CAN, exit 2 |
| 10 | MATCH_CLAIM_AS_FACT | MATCH_CLAIM_AS_FACT | CAN, exit 2 |

FALSIFICATION_MISSING: N/A, PoC fact-only, khong ap insight extraction (TIP ghi
"neu ap insight"). Positive control ca hai suite: ban sach PASS exit 0.

## Thong ke registry (synthetic)

12 thuc the (7 cung, 5 cau), 120 cell: 38 fact dung duoc (37 sourced, 1
corroborated), 4 fact tier claim, 1 cell disputed (capacity Ke toan Binh Minh,
giu ca hai gia tri, khong resolve), 81 cell honest-null. 100% fact tra duoc
evidence_span + tier + snapshot_ref (dieu kien tien quyet 1 cua 04 dat).

## Thong ke match (synthetic)

5 ung vien, 5 dat gate, 0 bi chan (du lieu sach chu dich; kha nang CHAN da chung
minh bang 4 rang tiem loi o tren). MATCH-0003 (Shop Me Xiu voi Mat Bao
Marketing) can cu chinh o tier claim: engine TU KHAI 4 dong unverified, gate
xac nhan; xoa khai bao la rang MATCH_CLAIM_AS_FACT can. Truy nguon: match ->
fact_id -> evidence -> snapshot = 3 buoc (< 5). Phan tach trong/ngoai vung quan
he nguoi bao chung: honest-null (chua co danh sach vung quan he, cho Phase B).

## Engine version va tai lap

`cao-loc-match/0.1.0 rule=overlay_capability_need_v1`. Score = 0.7 x overlap
token (need trong capability) + 0.2 x trung binh trong so tier (A=1, B=0.75,
C=0.3) + 0.1 x cung location. Chay 2 lan lien tiep: digest_matches
`f8066a1d1597abe5` giong het (score tai lap, dieu kien tien quyet 2 dat).
Lenh tai lap tung buoc trong README.md.

## Escalation

Khong cham lan nao trong 6 lan. Mot quyet dinh tu quyet da ghi: methodbox/
giu nguyen van (co em-dash noi tai cua phuong phap goc) va nam ngoai pham vi
cong dash cua Tho; cong chi quet file Tho sinh.

## Trang thai

Phase A xong: san sang nhan dataset that. Phase B cho: (a) dataset ve, (b) Lam
duyet mau 10% theo 01 muc 5, (c) baseline thu cong cua Tuyet nop truoc khi
output engine mo khoa (02). Tho se chi bao so, khong ket luan SM1.
