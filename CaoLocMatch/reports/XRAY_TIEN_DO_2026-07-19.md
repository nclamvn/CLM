# X-Ray Bao cao tien do - Du an CaoLocMatch - 2026-07-19

X-Ray toan du an. Moi con so duoi day VERIFY tan dia va chay lai gate (khong tong hop tu tri nho); lenh tai lap o muc cuoi. Du an nay la **CaoLocMatch** (provenance-backed B2B matching PoC, segment solo entrepreneur), KHONG lien quan RtR.

## 1. Tom tat dieu hanh
Guong ky thuat lan dau co CA HAI chieu that va deu qua gate:
- Chieu CUNG: 14 don vi VN co bang chung nang luc (domain `don_vi_cncl`).
- Chieu CAU: ban do chinh sach 124 claim tier A (khung cong nghe chien luoc QD 21/2026).
- Site `.touch` Hub render registry that, evidence bam-la-kiem-duoc.
- Engine PoC (Phase A) xong tren du lieu synthetic, 10 rang can.

NHUNG "match chung-minh-duoc" giua hai chieu CHUA chay (match van demo, dung nhan). Va cot moc cang nhat: **deadline dataset Tuyet 20/07 (NGAY MAI) nghen o input NGUOI, khong phai may.**

## 2. Trang thai 4 cau phan (verified, exit code that)

| Cau phan | Vi tri | Bang chung gate (chay 19/07) | Version |
|---|---|---|---|
| Site touch-hub | `/Users/os/.touch` | check:emdash 0 dash; Hub Muc 3 render 14 don vi that | pushed `ea45bad` |
| Supply `don_vi_cncl` | `/Users/os/CNCLData` | refinery exit 0; bites moi rang CAN exit 0; 64 claim / 14 don vi / 7 nguon; coverage 17.5% | pushed `303ea12` (private) |
| Demand khung CNCL | `RtR/KB/Dataset_CongNgheChienLuoc` | span-gate PASS 124/124 exit 0; 124 claim / 9 snapshot | CHUA version (khong git) |
| Engine PoC | `/Users/os/CaoLocMatch` | refinery(synthetic) exit 0; Phase A xong; 10 rang can | pushed `8235b58` |

## 3. Hai chieu du lieu (nguyen lieu matching)

**CUNG - 14 don vi:**
- Nhom 9 hang khong vu tru (7): Viettel High Tech, Realtime Robotics (RtR), Phenikaa-X, HTI Technology, CT Group, MiSmart, XBStation.
- Nhom 1 cong nghe so (7): VNPT, FPT, Viettel AI, Tap doan Viettel, VinAI, VinBigData, Zalo.
- Tier claim A 12 / B 52; 2 o corroborated (FPT, VNPT `nhom_cncl`, mst tier A + vneconomy tier B).
- FAIRNESS: 6 claim `favors=rtr` (Realtime Robotics, mot don vi UAV trong du lieu - khong phai lien ket to chuc).
- Ambiguity: cum ten Viettel (3) + Vin (2) flag `ambiguous_clusters`, khong tu gop.

**CAU - 124 claim khung chinh sach:** 10 nhom + 30 san pham (QD 21/2026), chuong trinh QD 2815 (6 SP tien phong, co UAV), bo may QD 769 (To Cong tac Chinh phu), muc tieu 2030. Gan toan tang A gov.

**MATCH:** chua chay (thieu buoc noi cung<->cau). La manh cuoi tu nhien cua vong lap; KHONG bi chan boi deadline PoC.

## 4. Version control

| Repo | GitHub | HEAD |
|---|---|---|
| touch-hub | nclamvn/touch-hub | `ea45bad` |
| cncl-data (private) | nclamvn/cncl-data | `303ea12` |
| CaoLocMatch | nclamvn/CaoLocMatch | `8235b58` |

RUI RO version: dataset khung CAU (124 claim) + PoC docs moi (`03a`, `07`) nam duoi `RtR/KnowledgeBase/` - KHONG phai git repo, chua co lich su. An toan tren dia nhung chua backup version. De nghi: repo rieng `cncl-framework` (private), khong dinh RtR.

## 5. Deadline 20/07 (NGAY MAI) - muc canh bao cao nhat

Chuoi phu thuoc CUNG (doc `PHASE_A_completion.md` + `02_PRE_REGISTRATION` + `03_KHAO_SAT_PAIN`):
1. Phase A may XONG 17/07 (som hon lich rieng 21-22/07). May KHONG phai cho nghen.
2. Nghen o INPUT nguoi: (a) phong van pain **chua hen** (tinh den phien 18/07) = goc re, khong phong van thi khong co dataset that; (b) baseline thu cong Tuyet phai nop TRUOC khi mo khoa output engine (pre-reg 02); (c) Lam duyet mau 10% (pre-reg 01 muc 5).
3. Dung cu da san: field kit `03a` (Tho dung, verbatim tu 03), bien ban `07` (Lam dung). Viec con lai la NGUOI: Lam gui thu hen Tuyet, chot gio truoc 20/07.

CANH BAO so 1: neu phong van chua dien ra truoc 20/07, dataset that khong ve kip, Phase B truot. Day la rui ro hang dau va la viec cua NGUOI, khong phai may. [Trang thai phong van can Lam xac nhan lai - lan cuoi ghi nhan la CHUA hen.]

## 6. Lan ranh giu duoc (tinh toan ven)
- SM1/SM2 khoa theo domain solo-entrepreneur da ky; CNCL la lam giau chu dong, KHONG thay.
- KHONG chay engine tren du lieu THAT cua Tuyet truoc baseline nguoi (pre-reg 02), ke ca "chay xem thu".
- Phep thu pain falsification: AI khong sinh, khong goi y, khong dien o nao - giu hieu luc SM3.
- Du an tach khoi RtR (dinh chinh 18/07, da sua memory).

## 7. Viec mo va uu tien
1. [NGUOI, gap] Lam gui thu hen Tuyet, phong van pain truoc 20/07. **Don bay lon nhat.**
2. [May, cho] Sau phong van + baseline: bien bao cao pain thanh claim theo 01, mo Phase B.
3. [May, tuy chon] Version dataset khung CAU (repo `cncl-framework` private).
4. [May, tuy chon] CNCL Pha 2: 8 nhom con lai cua `don_vi_cncl`.
5. [May, xa] Match chung-minh-duoc cung <-> cau (khi ca hai chieu du day).

## Lenh tai lap (exit code doc tran, khong pipe)
```
cd /Users/os/CNCLData && python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?      # 0
cd /Users/os/CNCLData && python3 methodbox/bites.py domains/don_vi_cncl                    # moi rang CAN
cd /Users/os/RtR/KnowledgeBase/Dataset_CongNgheChienLuoc && python3 check_spans.py ; echo $?   # 0, 124/124
cd /Users/os/CaoLocMatch && python3 methodbox/refinery.py domains/dich_vu_solo_entrepreneur ; echo $?  # 0 (synthetic Phase A)
```
