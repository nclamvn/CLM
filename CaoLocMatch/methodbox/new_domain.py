#!/usr/bin/env python3
"""new_domain.py · Scaffold một domain mới cho Refinery.

  python new_domain.py <ten_domain> "<nhãn thực thể>"

Tạo:
  domains/<ten>/domain.yaml      · template có chú thích, điền vào
  domains/<ten>/claims.jsonl     · rỗng, đổ claim đã trích + đóng băng vào đây
  domains/<ten>/snapshots/       · để bản chụp raw của nguồn
  domains/<ten>/README.md        · nhắc quy trình 6 bước

Sau khi điền: python refinery.py domains/<ten>  rồi  python bites.py domains/<ten>
"""
import os, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))

DOMAIN_TEMPLATE = '''domain: {name}
entity_label: "{label}"

schema:
  type_field: null          # tên field phân loại thực thể, hoặc null
  fields:                    # liệt kê field; thêm field "để trống" để minh hoạ honest-null
    - ten
    - field_2
    - field_3

rollup_field: field_2        # field để tính phân bố (đổi cho hợp domain)

universe:
  estimate: 100              # MẪU SỐ: ước lượng tổng thể, để đo coverage. Bắt buộc nếu công bố phân bố.
  basis: "Mô tả vũ trụ mẫu + cơ sở ước lượng"

refresh_days:
  default: 180               # ngưỡng độ tươi mặc định; thêm field cụ thể nếu cần

alias_map: {{}}                # "biến thể": "canonical" — chỉ gộp khi chắc cùng một thực thể

ambiguous_clusters: []       # [["a","b","c"]] — cụm KHÔNG được tự gộp, phải hỏi người
'''

CLAIM_EXAMPLE = {
    "entity": "TEN_THUC_THE",
    "field": "ten",
    "value": "Giá trị",
    "evidence_span": "đoạn text gốc verbatim PHẢI nằm trong snapshot",
    "extraction": "verbatim",
    "tier": "A",
    "capture": {"url": "https://nguon/x", "fetched_at": "2026-01-01T00:00:00Z",
                "snapshot": "nguon_x.html", "source": "nguon.tld"},
}

README = '''# Domain: {name}

Quy trình 6 bước (xem refinery/README.md cho chi tiết):

1. Sửa `domain.yaml`: schema.fields, type_field, rollup_field, universe.estimate (mẫu số).
2. Cào nguồn, lưu mỗi trang vào `snapshots/<ten>.html` (bản chụp raw).
3. Đổ claim đã trích vào `claims.jsonl`, mỗi value kèm `evidence_span` verbatim + `capture.snapshot`.
4. `python refinery.py domains/{name}`        # build + present
5. `python bites.py domains/{name}`           # chứng minh mọi cổng cắn
6. Honest-null "—" cho field trống, disputed giữ trọn, phân bố kèm mẫu số.

Một dòng claims.jsonl mẫu nằm sẵn trong file (xoá khi bắt đầu thật).
'''


def main():
    if len(sys.argv) < 2:
        sys.exit('usage: new_domain.py <ten_domain> "<nhãn thực thể>"')
    name = sys.argv[1].strip()
    label = sys.argv[2] if len(sys.argv) > 2 else name
    ddir = os.path.join(HERE, "domains", name)
    if os.path.exists(ddir):
        sys.exit(f"Domain đã tồn tại: {ddir}")
    os.makedirs(os.path.join(ddir, "snapshots"))
    with open(os.path.join(ddir, "domain.yaml"), "w", encoding="utf-8") as f:
        f.write(DOMAIN_TEMPLATE.format(name=name, label=label))
    with open(os.path.join(ddir, "claims.jsonl"), "w", encoding="utf-8") as f:
        f.write(json.dumps(CLAIM_EXAMPLE, ensure_ascii=False) + "\n")
    with open(os.path.join(ddir, "snapshots", ".gitkeep"), "w") as f:
        f.write("")
    with open(os.path.join(ddir, "README.md"), "w", encoding="utf-8") as f:
        f.write(README.format(name=name))
    print(f"Đã tạo domain: domains/{name}/")
    print(f"  domain.yaml · claims.jsonl (1 dòng mẫu) · snapshots/ · README.md")
    print(f"Tiếp: điền domain.yaml + claims.jsonl + snapshots, rồi:")
    print(f"  python refinery.py domains/{name}")


if __name__ == "__main__":
    main()
