# CaoLocMatch · engine PoC (Tuan 2)

Workspace rieng cua Tho, tach khoi repo website .touch. Theo TIP 05 va cac van
ban da ky trong `KnowledgeBase/CaoLocMatch_PoC/` (01 spec dataset, 02
pre-registration, 04 schema match provenance).

## Cai dat (lam TRUOC khi chay bat ky lenh nao)

Tren macOS co Homebrew Python (da kiem tren may Lam 16/08/2026, PEP 668 chan `--user` don thuan):

```
python3 -m pip install --user --break-system-packages -r requirements.txt
```

Moi truong khong bi PEP 668 chan thi bo `--break-system-packages`.

Thieu PyYAML se lam MOI lenh dung ngay o dong dau voi thong bao "Can PyYAML".
Day la loi moi truong, khong phai loi du lieu: khong co gi bi ghi hong, cu cai roi chay lai.

## Cau truc

```
methodbox/        ban sao NGUYEN VAN Refinery MethodBox (refinery.py, bites.py,
                  new_domain.py) tu PhuongPhap_ChuyenGiao. Khong sua mot byte.
domains/dich_vu_solo_entrepreneur/
  domain.yaml     khung theo 01 (universe 1500, alias_map, ambiguous_clusters)
  claims.jsonl    du lieu SYNTHETIC Phase A (dataset that thay vao o Phase B)
  snapshots/      ban chup nguon (synthetic)
make_synthetic.py sinh du lieu tong hop, tu kiem evidence_span verbatim
match_engine.py   match engine theo schema 04 (fact layer, overlay rule,
                  gate fail-loud, score tai lap, ENGINE_VERSION)
match_bites.py    4 rang match gate (04.C)
check_dash.py     cong 0 em-dash/en-dash cho file Tho sinh
out/              facts.jsonl, matches.jsonl, blocked.jsonl, report.json
```

## Lenh tai lap tung buoc

```bash
python3 make_synthetic.py                                   # sinh du lieu Phase A
python3 methodbox/refinery.py domains/dich_vu_solo_entrepreneur   # pipeline 7 giai doan
python3 methodbox/bites.py domains/dich_vu_solo_entrepreneur      # 6 rang core (+N/A gates)
python3 match_engine.py run domains/dich_vu_solo_entrepreneur     # build match + gate
python3 match_engine.py validate domains/dich_vu_solo_entrepreneur out/matches.jsonl
python3 match_engine.py validate ... --require-signoff   # Phase B: bat nguoi gac cong that ky
python3 match_engine.py sign out/matches.jsonl "<ten>" <ngay>  # ghi signoff SAU khi nguoi gac cong duyet
python3 match_bites.py                                      # 4 rang match gate
python3 check_dash.py                                       # cong dash
```

## Ky luat

Fail-loud exit 2 moi cong; khong co canh bao roi cho qua. A3: disputed khong tu
resolve (khong thanh fact), honest-null giu nguyen, tier C la claim va phai tu
khai `unverified` khi lam can cu. Score tai lap: cung registry + cung
ENGINE_VERSION ra cung digest. Phase B chi chay khi dataset that ve va Lam duyet
mau 10% theo 01 muc 5; output engine KHOA cho toi khi baseline thu cong cua
Tuyet nop (02).
