// AUTO-GENERATED boi scripts/gen-cncl-data.mjs · 2026-08-18 · KHONG sua tay.
// Nguon: CNCLData/domains/don_vi_cncl + Dataset_CongNgheChienLuoc
// Sua o day se bi ghi de lan chay ke. Muon doi noi dung thi sua registry goc roi sinh lai.

export type CnclTier = 'A' | 'B' | 'C';
export type CnclEvidence = {
  field: string; value: string; span: string; source: string;
  tier: CnclTier; extraction: string; href: string; note: string;
};
export type CnclSource = { source: string; href: string };
export type CnclUnit = {
  name: string; loaiHinh: string; nhoms: string[]; nhomLabels: string[]; sanPham: string[];
  capability: string; bestTier: CnclTier; favorsRtr: boolean;
  sources: CnclSource[]; tim: string; evidence: CnclEvidence[];
};
export type CnclNeed = {
  id: string; entityId: string; value: string; span: string;
  tier: CnclTier; source: string; href: string; chinhThuc: boolean; tim: string;
};

export const cnclMeta = {
  "units": 42,
  "claims": 200,
  "needs": 30,
  "sources": 11,
  "snapshots": 37,
  "tierA": 75,
  "tierB": 125,
  "nhomPhu": 10,
  "generatedAt": "2026-08-18",
  "frame": "QĐ 21/2026/QĐ-TTg",
  "gate": "chay_het_cong.sh · 14 o xanh"
} as const;

export const cnclUnits: CnclUnit[] = [
  {
    "name": "Công ty An ninh mạng Viettel",
    "loaiHinh": "",
    "nhoms": [
      "7"
    ],
    "nhomLabels": [
      "Nhóm 7 · An ninh mạng và lượng tử"
    ],
    "sanPham": [
      "09"
    ],
    "capability": "100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của công ty",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_viettelcybersecurity_20190412.txt"
      }
    ],
    "tim": "công ty an ninh mạng viettel 100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của công ty nhóm 7 an ninh mạng và lượng tử sp 09",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty An ninh mạng Viettel",
        "span": "Công ty An ninh mạng Viettel được thành lập trên cơ sở tổ chức lại Trung tâm An ninh mạng Viettel, là một chi nhánh của Tập đoàn Công nghiệp Viễn thông Quân đội Viettel.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_viettelcybersecurity_20190412.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "7",
        "span": "Công ty An ninh mạng Viettel được thành lập trên cơ sở tổ chức lại Trung tâm An ninh mạng Viettel, là một chi nhánh của Tập đoàn Công nghiệp Viễn thông Quân đội Viettel.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_viettelcybersecurity_20190412.txt",
        "note": "An ninh mang va luong tu -> nhom 7 theo QD 21/2026 [CNCL-G07]. Anh xa nhom. Nguon goi dich danh PHAP NHAN CON, khong phai Tap doan Viettel."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của công ty",
        "span": "100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của công ty.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_viettelcybersecurity_20190412.txt",
        "note": "Bai dang 12/04/2019, qua refresh_days 180 rat xa. Can moc gan hon truoc khi dung cho ho so khach."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "09",
        "span": "100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của công ty.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_viettelcybersecurity_20190412.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi san pham an ninh mang do doi ngu tu nghien cuu phat trien -> SP09 Giai phap an ninh mang cho ha tang quan trong. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty cổ phần AVAC Việt Nam",
    "loaiHinh": "",
    "nhoms": [
      "4"
    ],
    "nhomLabels": [
      "Nhóm 4 · Sinh học và y sinh"
    ],
    "sanPham": [
      "14"
    ],
    "capability": "AVAC ASF LIVE",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt"
      }
    ],
    "tim": "công ty cổ phần avac việt nam avac asf live nhóm 4 sinh học và y sinh sp 14",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty cổ phần AVAC Việt Nam",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "4",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": "Sinh hoc va y sinh tien tien -> nhom 4 theo QD 21/2026 [CNCL-G04]. Anh xa nhom, khong phai quote literal so 4."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "AVAC ASF LIVE",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã được sử dụng để tiêm cho các đàn lợn và đánh giá thận trọng tại Philippines",
        "span": "Vaccine AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam đã được sử dụng để tiêm cho các đàn lợn và đánh giá thận trọng tại Philippines.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": ""
      },
      {
        "field": "san_pham_lien_quan",
        "value": "14",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi vac xin AVAC ASF LIVE cho dan lon -> SP14. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty cổ phần Công nghệ an ninh mạng quốc gia Việt Nam (NCS)",
    "loaiHinh": "",
    "nhoms": [
      "7"
    ],
    "nhomLabels": [
      "Nhóm 7 · An ninh mạng và lượng tử"
    ],
    "sanPham": [
      "09"
    ],
    "capability": "Tường lửa thế hệ mới NCS Next Generation Firewall, nền tảng tình báo an ninh mạng NCS TI, an ninh mạng điểm cuối NCS EDR, trung tâm giám sát an ninh mạng NCS SOC",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "tuoitre.vn",
        "href": "/evidence/tuoitre_ncs_hesinhthai_20250702.txt"
      }
    ],
    "tim": "công ty cổ phần công nghệ an ninh mạng quốc gia việt nam (ncs) tường lửa thế hệ mới ncs next generation firewall, nền tảng tình báo an ninh mạng ncs ti, an ninh mạng điểm cuối ncs edr, trung tâm giám sát an ninh mạng ncs soc nhóm 7 an ninh mạng và lượng tử sp 09",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty cổ phần Công nghệ an ninh mạng quốc gia Việt Nam (NCS)",
        "span": "Ngày 2-7 tại Hà Nội, Công ty cổ phần Công nghệ [an ninh mạng](https://tuoitre.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_ncs_hesinhthai_20250702.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi. Doi verbatim sang normalized: chu trong nguon co markup hoac ngat dong chen giua nen gia tri khong nam tron trong span."
      },
      {
        "field": "nhom_cncl",
        "value": "7",
        "span": "Các sản phẩm trong hệ sinh thái bao gồm: Tường lửa thế hệ mới NCS Next Generation Firewall, nền tảng tình báo an ninh mạng NCS TI, an ninh mạng điểm cuối NCS EDR, trung tâm giám sát an ninh mạng NCS SOC bao gồm giải pháp quản lý, phân tích sự kiện an ninh mạng tập trung NCS SIEM và nền tảng điều phối, ứng phó sự cố NCS SOAR.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_ncs_hesinhthai_20250702.txt",
        "note": "An ninh mang va luong tu -> nhom 7 theo QD 21/2026 [CNCL-G07]. Anh xa nhom."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Tường lửa thế hệ mới NCS Next Generation Firewall, nền tảng tình báo an ninh mạng NCS TI, an ninh mạng điểm cuối NCS EDR, trung tâm giám sát an ninh mạng NCS SOC",
        "span": "Các sản phẩm trong hệ sinh thái bao gồm: Tường lửa thế hệ mới NCS Next Generation Firewall, nền tảng tình báo an ninh mạng NCS TI, an ninh mạng điểm cuối NCS EDR, trung tâm giám sát an ninh mạng NCS SOC bao gồm giải pháp quản lý, phân tích sự kiện an ninh mạng tập trung NCS SIEM và nền tảng điều phối, ứng phó sự cố NCS SOAR.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_ncs_hesinhthai_20250702.txt",
        "note": "Ban goc KHONG viet tat 'NGFW' o bat cu dau. Chua thay nguon tier A/B neu so khach hang dang chay that."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "09",
        "span": "Các sản phẩm trong hệ sinh thái bao gồm: Tường lửa thế hệ mới NCS Next Generation Firewall, nền tảng tình báo an ninh mạng NCS TI, an ninh mạng điểm cuối NCS EDR, trung tâm giám sát an ninh mạng NCS SOC bao gồm giải pháp quản lý, phân tích sự kiện an ninh mạng tập trung NCS SIEM và nền tảng điều phối, ứng phó sự cố NCS SOAR.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_ncs_hesinhthai_20250702.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span liet ke tuong lua, SOC, SIEM, SOAR -> SP09. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty Cổ phần Giải pháp Năng lượng VinES",
    "loaiHinh": "",
    "nhoms": [
      "5"
    ],
    "nhomLabels": [
      "Nhóm 5 · Năng lượng và vật liệu"
    ],
    "sanPham": [
      "18"
    ],
    "capability": "chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_vines_pin_20240306.txt"
      }
    ],
    "tim": "công ty cổ phần giải pháp năng lượng vines chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện nhóm 5 năng lượng và vật liệu sp 18",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty Cổ phần Giải pháp Năng lượng VinES",
        "span": "Cũng trong thời gian này, VinES, một công ty con trực thuộc Vingroup chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện được thành lập với vốn pháp định 6.500 tỷ đồng.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vines_pin_20240306.txt",
        "note": "Nguon goi tat 'VinES'; ten day du chuan hoa. Tach phap nhan khoi VinAI/VinBigData/VinMotion da co trong registry."
      },
      {
        "field": "nhom_cncl",
        "value": "5",
        "span": "Cũng trong thời gian này, VinES, một công ty con trực thuộc Vingroup chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện được thành lập với vốn pháp định 6.500 tỷ đồng.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vines_pin_20240306.txt",
        "note": "Nang luong va vat lieu tien tien -> nhom 5 theo QD 21/2026 [CNCL-G05]. Anh xa nhom, khong phai quote literal so 5."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện",
        "span": "Cũng trong thời gian này, VinES, một công ty con trực thuộc Vingroup chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện được thành lập với vốn pháp định 6.500 tỷ đồng.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_vines_pin_20240306.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã trở thành doanh nghiệp đầu tiên tại Đông Nam Á làm chủ được công nghệ về cell pin",
        "span": "Trên thực tế, chỉ sau 2 năm, VinES đã trở thành doanh nghiệp đầu tiên tại Đông Nam Á làm chủ được công nghệ về cell pin.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_vines_pin_20240306.txt",
        "note": "CANH BAO: day la KHANG DINH CUA TOA SOAN, khong dan nguon kiem chung. Doc nhu CLAIM chu khong phai su that cung. Them nua, cung bai ghi 11/10/2023 VinES da duoc tang 99,8% cho VinFast, tu cach phap nhan doc lap hien nay CHUA kiem chung."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "18",
        "span": "Cũng trong thời gian này, VinES, một công ty con trực thuộc Vingroup chuyên nghiên cứu, sản xuất pin xe điện và các giải pháp năng lượng toàn diện được thành lập với vốn pháp định 6.500 tỷ đồng.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vines_pin_20240306.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'nghien cuu, san xuat pin xe dien va cac giai phap nang luong' -> SP18. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty cổ phần Health Care Center",
    "loaiHinh": "",
    "nhoms": [
      "3"
    ],
    "nhomLabels": [
      "Nhóm 3 · Robot và tự động hoá"
    ],
    "sanPham": [
      "07"
    ],
    "capability": "giải pháp hỗ trợ sàng lọc sức khỏe ban đầu, hướng tới cảnh báo sớm nguy cơ đột quỵ, bệnh tim mạch, tiểu đường và tăng huyết áp",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt"
      }
    ],
    "tim": "công ty cổ phần health care center giải pháp hỗ trợ sàng lọc sức khỏe ban đầu, hướng tới cảnh báo sớm nguy cơ đột quỵ, bệnh tim mạch, tiểu đường và tăng huyết áp nhóm 3 robot và tự động hoá sp 07",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty cổ phần Health Care Center",
        "span": "Đây là sản phẩm do Công ty cổ phần Health Care Center phát triển được giới thiệu như một giải pháp hỗ trợ sàng lọc sức khỏe ban đầu, hướng tới cảnh báo sớm nguy cơ đột quỵ, bệnh tim mạch, tiểu đường và tăng huyết áp.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "3",
        "span": "Bên cạnh đó, tiểu phẩm tái hiện cảnh robot khám chữa bệnh và robot phát thuốc hỗ trợ kịp thời cũng nhận được nhiều lời khen.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": "Robot va tu dong hoa -> nhom 3 (Cong nghe robot va tu dong hoa) theo QD 21/2026 [CNCL-G03]. Anh xa nhom, khong phai quote literal so 3. Span nay la cau lien truoc, neu ro 'robot kham chua benh va robot phat thuoc'; cau S_HCC dung chu 'Day la san pham' tro nguoc ve day."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "giải pháp hỗ trợ sàng lọc sức khỏe ban đầu, hướng tới cảnh báo sớm nguy cơ đột quỵ, bệnh tim mạch, tiểu đường và tăng huyết áp",
        "span": "Đây là sản phẩm do Công ty cổ phần Health Care Center phát triển được giới thiệu như một giải pháp hỗ trợ sàng lọc sức khỏe ban đầu, hướng tới cảnh báo sớm nguy cơ đột quỵ, bệnh tim mạch, tiểu đường và tăng huyết áp.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": ""
      },
      {
        "field": "san_pham_lien_quan",
        "value": "07",
        "span": "Đây là sản phẩm do Công ty cổ phần Health Care Center phát triển được giới thiệu như một giải pháp hỗ trợ sàng lọc sức khỏe ban đầu, hướng tới cảnh báo sớm nguy cơ đột quỵ, bệnh tim mạch, tiểu đường và tăng huyết áp.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'robot kham chua benh va robot phat thuoc' -> SP07 Robot (robot dich vu). Ranh gioi voi nhom 4 y sinh: san pham la ROBOT, benh hoc chi la ung dung. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty cổ phần thuốc thú y Trung ương NAVETCO",
    "loaiHinh": "",
    "nhoms": [
      "4"
    ],
    "nhomLabels": [
      "Nhóm 4 · Sinh học và y sinh"
    ],
    "sanPham": [
      "14"
    ],
    "capability": "NAVET-ASFVAC",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt"
      }
    ],
    "tim": "công ty cổ phần thuốc thú y trung ương navetco navet-asfvac nhóm 4 sinh học và y sinh sp 14",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty cổ phần thuốc thú y Trung ương NAVETCO",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "4",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": "Sinh hoc va y sinh tien tien -> nhom 4 theo QD 21/2026 [CNCL-G04]. Anh xa nhom, khong phai quote literal so 4."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "NAVET-ASFVAC",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": "Ten vac xin dich ta lon chau Phi do don vi nghien cuu san xuat, da duoc cap Giay chung nhan luu hanh theo nguon."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "14",
        "span": "Hiện có 2 loại vaccine DTLCP là NAVET-ASFVAC của Công ty cổ phần thuốc thú y Trung ương NAVETCO và AVAC ASF LIVE của Công ty cổ phần AVAC Việt Nam nghiên cứu, sản xuất và được cấp Giấy chứng nhận lưu hành.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_vaccine_dtlcp_20230724.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi vac xin dich ta lon chau Phi NAVET-ASFVAC -> SP14 Vac xin va che pham sinh hoc trong nong nghiep. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty cổ phần VinMotion",
    "loaiHinh": "",
    "nhoms": [
      "3"
    ],
    "nhomLabels": [
      "Nhóm 3 · Robot và tự động hoá"
    ],
    "sanPham": [
      "07"
    ],
    "capability": "nghiên cứu, phát triển và thương mại hóa robot hình người",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "tuoitre.vn",
        "href": "/evidence/tuoitre_vinmotion_20250606.txt"
      }
    ],
    "tim": "công ty cổ phần vinmotion nghiên cứu, phát triển và thương mại hóa robot hình người nhóm 3 robot và tự động hoá sp 07",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty cổ phần VinMotion",
        "span": "Được thành lập vào tháng 1-2025 với vốn điều lệ 1.000 tỉ đồng, Công ty cổ phần VinMotion là đơn vị trực thuộc hệ sinh thái Vingroup, có nhiệm vụ nghiên cứu, phát triển và thương mại hóa robot hình người - lĩnh vực được xem là một trong những cuộc đua công nghệ khốc liệt nhất thế kỷ 21.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_vinmotion_20250606.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "3",
        "span": "Được thành lập vào tháng 1-2025 với vốn điều lệ 1.000 tỉ đồng, Công ty cổ phần VinMotion là đơn vị trực thuộc hệ sinh thái Vingroup, có nhiệm vụ nghiên cứu, phát triển và thương mại hóa robot hình người - lĩnh vực được xem là một trong những cuộc đua công nghệ khốc liệt nhất thế kỷ 21.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_vinmotion_20250606.txt",
        "note": "Robot va tu dong hoa -> nhom 3 (Cong nghe robot va tu dong hoa) theo QD 21/2026 [CNCL-G03]. Anh xa nhom, khong phai quote literal so 3."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "nghiên cứu, phát triển và thương mại hóa robot hình người",
        "span": "Được thành lập vào tháng 1-2025 với vốn điều lệ 1.000 tỉ đồng, Công ty cổ phần VinMotion là đơn vị trực thuộc hệ sinh thái Vingroup, có nhiệm vụ nghiên cứu, phát triển và thương mại hóa robot hình người - lĩnh vực được xem là một trong những cuộc đua công nghệ khốc liệt nhất thế kỷ 21.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_vinmotion_20250606.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đội ngũ kỹ sư Việt Nam của VinMotion đã cho ra đời nguyên mẫu robot đầu tiên",
        "span": "Chỉ sau hơn 3 tháng thành lập, đội ngũ kỹ sư Việt Nam của VinMotion đã cho ra đời nguyên mẫu robot đầu tiên.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_vinmotion_20250606.txt",
        "note": "Muc NGUYEN MAU, khong phai san pham thuong mai. Viec trien khai vao nha may VinFast trong bai la KE HOACH."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "07",
        "span": "Được thành lập vào tháng 1-2025 với vốn điều lệ 1.000 tỉ đồng, Công ty cổ phần VinMotion là đơn vị trực thuộc hệ sinh thái Vingroup, có nhiệm vụ nghiên cứu, phát triển và thương mại hóa robot hình người - lĩnh vực được xem là một trong những cuộc đua công nghệ khốc liệt nhất thế kỷ 21.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_vinmotion_20250606.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'nghien cuu phat trien va thuong mai hoa robot hinh nguoi' -> SP07 Robot. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty Cổ phần Y Sinh Ngọc Bảo",
    "loaiHinh": "",
    "nhoms": [
      "4"
    ],
    "nhomLabels": [
      "Nhóm 4 · Sinh học và y sinh"
    ],
    "sanPham": [
      "12"
    ],
    "capability": "“Mảnh ghép hộp sọ chế tạo từ vật liệu PEEK”, mã số 2502433ĐKLH/BYT-HTTB",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nhandan.vn",
        "href": "/evidence/nhandan_ngocbao_peek3d_20250802.txt"
      }
    ],
    "tim": "công ty cổ phần y sinh ngọc bảo “mảnh ghép hộp sọ chế tạo từ vật liệu peek”, mã số 2502433đklh/byt-httb nhóm 4 sinh học và y sinh sp 12",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty Cổ phần Y Sinh Ngọc Bảo",
        "span": "Sản phẩm được Công ty Cổ phần Y Sinh Ngọc Bảo sản xuất và chính thức ra mắt sáng nay tại Hà Nội.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_ngocbao_peek3d_20250802.txt",
        "note": "Ban goc viet hoa khong nhat quan: sapo 'Co phan', than bai 'co phan'. Trich tu sapo."
      },
      {
        "field": "nhom_cncl",
        "value": "4",
        "span": "Ngày 4/7/2025, Bộ Y tế đã chính thức cấp phép lưu hành cho thiết bị này với tên thương mại là “Mảnh ghép hộp sọ chế tạo từ vật liệu PEEK”, mã số 2502433ĐKLH/BYT-HTTB.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_ngocbao_peek3d_20250802.txt",
        "note": "Sinh hoc va y sinh tien tien -> nhom 4 theo QD 21/2026 [CNCL-G04]. Anh xa nhom, khong phai quote literal so 4."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "“Mảnh ghép hộp sọ chế tạo từ vật liệu PEEK”, mã số 2502433ĐKLH/BYT-HTTB",
        "span": "Ngày 4/7/2025, Bộ Y tế đã chính thức cấp phép lưu hành cho thiết bị này với tên thương mại là “Mảnh ghép hộp sọ chế tạo từ vật liệu PEEK”, mã số 2502433ĐKLH/BYT-HTTB.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_ngocbao_peek3d_20250802.txt",
        "note": "Da duoc Bo Y te cap phep luu hanh 04/07/2025."
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã có 200 bệnh nhân được cấy ghép thành công thiết bị này",
        "span": "Đến nay đã có 200 bệnh nhân được cấy ghép thành công thiết bị này tại các bệnh viện tuyến tỉnh và trung ương như: Bệnh viện đa khoa Hải Dương, Bệnh viện Xanh Pôn, Thanh Nhàn, Việt Đức, 108...",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_ngocbao_peek3d_20250802.txt",
        "note": "Con so do nguon neu, khong phai suy dien. Khong ghi nhan bat ky khang dinh nao ve hieu qua dieu tri ngoai nguyen van nguon."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "12",
        "span": "Ngày 4/7/2025, Bộ Y tế đã chính thức cấp phép lưu hành cho thiết bị này với tên thương mại là “Mảnh ghép hộp sọ chế tạo từ vật liệu PEEK”, mã số 2502433ĐKLH/BYT-HTTB.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_ngocbao_peek3d_20250802.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'Manh ghep hop so che tao tu vat lieu PEEK' in 3D ca the hoa -> SP12 He thong san xuat y te ca the hoa bang in 3D. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Công ty TNHH Luyện kim Trần Hồng Quân",
    "loaiHinh": "",
    "nhoms": [
      "8"
    ],
    "nhomLabels": [
      "Nhóm 8 · Biển, đại dương, lòng đất"
    ],
    "sanPham": [
      "25"
    ],
    "capability": "sản xuất thành công nhôm thỏi bằng công nghệ cao, sử dụng công nghệ điện phân nhôm với cường độ dòng điện 500 kA",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_nhomthoi_daknong_20260726.txt"
      }
    ],
    "tim": "công ty tnhh luyện kim trần hồng quân sản xuất thành công nhôm thỏi bằng công nghệ cao, sử dụng công nghệ điện phân nhôm với cường độ dòng điện 500 ka nhóm 8 biển, đại dương, lòng đất sp 25",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Công ty TNHH Luyện kim Trần Hồng Quân",
        "span": "Sản phẩm nhôm thỏi đầu tiên được công bố là kết quả của quá trình đầu tư bài bản, nghiên cứu, làm chủ công nghệ và nỗ lực không ngừng trong suốt 11 năm của đội ngũ chuyên gia, kỹ sư cùng tập thể cán bộ, người lao động Công ty TNHH Luyện kim Trần Hồng Quân.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_nhomthoi_daknong_20260726.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "8",
        "span": "Đây là sự kiện có ý nghĩa đặc biệt đối với ngành công nghiệp luyện kim Việt Nam, đánh dấu lần đầu tiên Việt Nam sản xuất thành công nhôm thỏi bằng công nghệ cao, sử dụng công nghệ điện phân nhôm với cường độ dòng điện 500 kA.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_nhomthoi_daknong_20260726.txt",
        "note": "Bien, dai duong va long dat -> nhom 8 theo QD 21/2026 [CNCL-G08]. Anh xa nhom. Che bien sau khoang san bauxite."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "sản xuất thành công nhôm thỏi bằng công nghệ cao, sử dụng công nghệ điện phân nhôm với cường độ dòng điện 500 kA",
        "span": "Đây là sự kiện có ý nghĩa đặc biệt đối với ngành công nghiệp luyện kim Việt Nam, đánh dấu lần đầu tiên Việt Nam sản xuất thành công nhôm thỏi bằng công nghệ cao, sử dụng công nghệ điện phân nhôm với cường độ dòng điện 500 kA.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_nhomthoi_daknong_20260726.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Sản phẩm nhôm thỏi đạt độ tinh khiết 99,71%",
        "span": "Sản phẩm nhôm thỏi đạt độ tinh khiết 99,71%, khẳng định chất lượng và ghi dấu bước tiến quan trọng của ngành công nghiệp nhôm Việt Nam.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_nhomthoi_daknong_20260726.txt",
        "note": "Phan ky 1 cong suat 150.000 tan/nam DA VAN HANH. Phan ky 2 (300.000 tan) va cong suat thiet ke 450.000 tan la KE HOACH quy IV/2026 va quy I/2027."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "25",
        "span": "Đây là sự kiện có ý nghĩa đặc biệt đối với ngành công nghiệp luyện kim Việt Nam, đánh dấu lần đầu tiên Việt Nam sản xuất thành công nhôm thỏi bằng công nghệ cao, sử dụng công nghệ điện phân nhôm với cường độ dòng điện 500 kA.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_nhomthoi_daknong_20260726.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi che bien sau bauxite thanh nhom thoi bang dien phan -> SP25 (che bien khoang san). Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "CT Group",
    "loaiHinh": "DN",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "ký được hợp đồng xuất khẩu tới 5.000 UAV ra thị trường quốc tế (Hàn Quốc)",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "tapchikinhtetaichinh.vn",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      }
    ],
    "tim": "ct group dn ký được hợp đồng xuất khẩu tới 5.000 uav ra thị trường quốc tế (hàn quốc) nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "CT Group",
        "span": "CT Group",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt",
        "note": ""
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "CT Group - một doanh nghiệp đa ngành",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt",
        "note": "Phan loai tu chinh span: span ghi 'mot doanh nghiep da nganh'."
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "chiến lược phát triển UAV “Make in Vietnam” từ năm 2016",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt",
        "note": "UAV -> SP22 / nhom 9 theo QD 21/2026 [CNCL-P22-A] Span con cap nhat 16/08/2026: dong snapshot da tra ve nguyen van nguon nen doan trich con phai theo. Khac biet duy nhat la kieu dau nhay, ban cu dung nhay don thay vi nhay kep cong cua nguon. Noi dung khong doi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "chiến lược phát triển UAV “Make in Vietnam” từ năm 2016",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt",
        "note": "UAV -> SP22 / nhom 9 theo QD 21/2026 [CNCL-P22-A] Span con cap nhat 16/08/2026: dong snapshot da tra ve nguyen van nguon nen doan trich con phai theo. Khac biet duy nhat la kieu dau nhay, ban cu dung nhay don thay vi nhay kep cong cua nguon. Noi dung khong doi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "ký được hợp đồng xuất khẩu tới 5.000 UAV ra thị trường quốc tế (Hàn Quốc)",
        "span": "một công ty Việt Nam ký được hợp đồng xuất khẩu tới 5.000 UAV ra thị trường quốc tế (Hàn Quốc)",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt",
        "note": ""
      }
    ]
  },
  {
    "name": "CT Semiconductor",
    "loaiHinh": "",
    "nhoms": [
      "6"
    ],
    "nhomLabels": [
      "Nhóm 6 · Chip bán dẫn"
    ],
    "sanPham": [
      "23"
    ],
    "capability": "triển khai giai đoạn 2 nhà máy chip ATP",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nguoiquansat.vn",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt"
      }
    ],
    "tim": "ct semiconductor triển khai giai đoạn 2 nhà máy chip atp nhóm 6 chip bán dẫn sp 23",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "CT Semiconductor",
        "span": "CT Semiconductor (thành viên CT Group) đang triển khai giai đoạn 2 nhà máy chip ATP tại tỉnh Bình Dương cũ (nay thuộc TP. HCM), với tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "6",
        "span": "CT Semiconductor (thành viên CT Group) đang triển khai giai đoạn 2 nhà máy chip ATP tại tỉnh Bình Dương cũ (nay thuộc TP. HCM), với tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "Chip ban dan -> nhom 6 (Cong nghe chip ban dan) theo QD 21/2026 [CNCL-G06]. Anh xa nhom, khong phai quote literal so 6."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "triển khai giai đoạn 2 nhà máy chip ATP",
        "span": "CT Semiconductor (thành viên CT Group) đang triển khai giai đoạn 2 nhà máy chip ATP tại tỉnh Bình Dương cũ (nay thuộc TP. HCM), với tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025",
        "span": "CT Semiconductor (thành viên CT Group) đang triển khai giai đoạn 2 nhà máy chip ATP tại tỉnh Bình Dương cũ (nay thuộc TP. HCM), với tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "Du kien 2025 la moc trong bai dang 27/10/2025; CHUA co nguon xac nhan da ra chip. Khong duoc doc thanh da hoan thanh."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "23",
        "span": "CT Semiconductor (thành viên CT Group) đang triển khai giai đoạn 2 nhà máy chip ATP tại tỉnh Bình Dương cũ (nay thuộc TP. HCM), với tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'nha may chip ATP' -> SP23 Chip chuyen dung. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "FECON",
    "loaiHinh": "",
    "nhoms": [
      "10"
    ],
    "nhomLabels": [
      "Nhóm 10 · Đường sắt tốc độ cao"
    ],
    "sanPham": [
      "29"
    ],
    "capability": "đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn - ga Hà Nội",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vnexpress.net",
        "href": "/evidence/vnexpress_fecon_tbm_20240829.txt"
      }
    ],
    "tim": "fecon đơn vị trực tiếp vận hành robot đào ngầm (tbm) số 1 metro nhổn - ga hà nội nhóm 10 đường sắt tốc độ cao sp 29",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "FECON",
        "span": "Ngày 28/8, đại diện FECON, đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn - ga Hà Nội cho biết sau gần một tháng đào hơn 120 m, máy lắp được 7 đốt vỏ hầm tạm và 58 đốt vỏ hầm vĩnh cửu.",
        "source": "vnexpress.net",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vnexpress_fecon_tbm_20240829.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "10",
        "span": "Ngày 28/8, đại diện FECON, đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn - ga Hà Nội cho biết sau gần một tháng đào hơn 120 m, máy lắp được 7 đốt vỏ hầm tạm và 58 đốt vỏ hầm vĩnh cửu.",
        "source": "vnexpress.net",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vnexpress_fecon_tbm_20240829.txt",
        "note": "Duong sat toc do cao va do thi -> nhom 10 theo QD 21/2026 [CNCL-G10]. Anh xa nhom. Thi cong cong trinh ngam duong sat do thi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn - ga Hà Nội",
        "span": "Ngày 28/8, đại diện FECON, đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn - ga Hà Nội cho biết sau gần một tháng đào hơn 120 m, máy lắp được 7 đốt vỏ hầm tạm và 58 đốt vỏ hầm vĩnh cửu.",
        "source": "vnexpress.net",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vnexpress_fecon_tbm_20240829.txt",
        "note": "QUAN TRONG: FECON VAN HANH may TBM, KHONG che tao. May do hang nuoc ngoai san xuat. Nang luc thuoc mang THI CONG, khong phai thiet bi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "29",
        "span": "Ngày 28/8, đại diện FECON, đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn - ga Hà Nội cho biết sau gần một tháng đào hơn 120 m, máy lắp được 7 đốt vỏ hầm tạm và 58 đốt vỏ hầm vĩnh cửu.",
        "source": "vnexpress.net",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vnexpress_fecon_tbm_20240829.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi thi cong ham ngam metro -> SP29 Cong trinh duong sat toc do cao (mang cong trinh). Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "FPT",
    "loaiHinh": "",
    "nhoms": [
      "1"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số"
    ],
    "sanPham": [
      "1"
    ],
    "capability": "Hệ sinh thái AI Agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng.",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt"
      },
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "source": "vnanet.vn",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      }
    ],
    "tim": "fpt hệ sinh thái ai agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng. dòng chip soc ai on edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (uav) nhóm 1 công nghệ số sp 1",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "FPT",
        "span": "FPT",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "FPT tiếp tục triển khai hai trụ cột chiến lược là siêu trung tâm tính toán FPT AI Factory và nền tảng trợ lý ảo FPT AI Agents.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "Cong nghe so -> nhom 1 theo QD 21/2026 [CNCL-G01-A]"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "FPT tiếp tục triển khai hai trụ cột chiến lược là siêu trung tâm tính toán FPT AI Factory và nền tảng trợ lý ảo FPT AI Agents.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "LLM tieng Viet / tro ly ao -> SP1 [CNCL-P01-A]"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Hệ sinh thái AI Agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng.",
        "span": "Hệ sinh thái AI Agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng, giúp nhiều doanh nghiệp tăng đến 20% doanh thu từ kênh telesales.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi. Doi verbatim sang normalized vi gia tri khong con nam tron trong span moi."
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "ra mắt nền tảng AI toàn diện đầu tiên ở Việt Nam- FPT.AI năm 2017.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": "Cong nghe so -> nhom 1 [CNCL-G01-A] Span truoc day bi chinh khoang trang quanh dau gach noi. Tra ve nguyen van 16/08/2026."
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Tập đoàn FPT hợp tác với Tập đoàn NVIDIA đầu tư khoảng 200 triệu USD xây dựng Nhà máy trí tuệ nhân tạo, cung cấp hạ tầng tính toán và trên 20 sản phẩm AI tạo sinh",
        "span": "Tập đoàn FPT hợp tác với Tập đoàn NVIDIA đầu tư khoảng 200 triệu USD xây dựng Nhà máy trí tuệ nhân tạo, cung cấp hạ tầng tính toán và trên 20 sản phẩm AI tạo sinh",
        "source": "vnanet.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt",
        "note": ""
      },
      {
        "field": "nang_luc_mo_ta_2",
        "value": "dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV)",
        "span": "Tại sự kiện, FPT ký kết hàng loạt thỏa thuận với các đối tác công nghệ trong lĩnh vực bán dẫn tại Việt Nam và quốc tế, như hợp tác toàn diện với Viettel trong hoạt động xây dựng năng lực tự chủ về công nghệ bán dẫn thông qua việc liên thông chuỗi giá trị ngành công nghệ bán dẫn: Đào tạo - Thiết kế - Chế tạo - Kiểm thử - Đóng gói - Thương mại, trọng tâm là cùng phát triển dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV); các thiết bị thông minh.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "TIP-CNCL-3B Task A. Truong nang_luc_mo_ta_2 vi nang_luc_mo_ta da co gia tri khac (don tri). Day la nang luc HOP TAC FPT va Viettel, cong bo 28/01/2026, muc do LA THOA THUAN va DINH HUONG PHAT TRIEN, chua phai chip da ra."
      }
    ]
  },
  {
    "name": "FPT Semiconductor",
    "loaiHinh": "",
    "nhoms": [
      "6"
    ],
    "nhomLabels": [
      "Nhóm 6 · Chip bán dẫn"
    ],
    "sanPham": [
      "23"
    ],
    "capability": "doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nguoiquansat.vn",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt"
      }
    ],
    "tim": "fpt semiconductor doanh nghiệp việt đầu tiên thiết kế và phát triển chip thương mại nhóm 6 chip bán dẫn sp 23",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "FPT Semiconductor",
        "span": "Trước đó, [FPT](https://dulieu.nguoiquansat.vn/doanh-nghiep/FPT) Semiconductor đã trở thành doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "Nguon viet ten cong ty TACH QUA MOT LIEN KET: '[FPT](url) Semiconductor'. Ten day du 'FPT Semiconductor' la chuan hoa tu do. Doi tu verbatim sang normalized ngay 16/08/2026 khi cong check_snapshot_fidelity.py phat hien snapshot da bi go markup."
      },
      {
        "field": "nhom_cncl",
        "value": "6",
        "span": "Trước đó, [FPT](https://dulieu.nguoiquansat.vn/doanh-nghiep/FPT) Semiconductor đã trở thành doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "Chip ban dan -> nhom 6 (Cong nghe chip ban dan) theo QD 21/2026 [CNCL-G06]. Anh xa nhom, khong phai quote literal so 6."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "span": "Trước đó, [FPT](https://dulieu.nguoiquansat.vn/doanh-nghiep/FPT) Semiconductor đã trở thành doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": ""
      },
      {
        "field": "san_pham_lien_quan",
        "value": "23",
        "span": "Trước đó, [FPT](https://dulieu.nguoiquansat.vn/doanh-nghiep/FPT) Semiconductor đã trở thành doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'thiet ke va phat trien chip thuong mai' -> SP23 Chip chuyen dung. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "GG Power",
    "loaiHinh": "",
    "nhoms": [
      "5"
    ],
    "nhomLabels": [
      "Nhóm 5 · Năng lượng và vật liệu"
    ],
    "sanPham": [
      "18"
    ],
    "capability": "tổ hợp xưởng sản xuất 2 tầng hiện đại và trung tâm R&D, được đầu tư với công suất thiết kế 5GWh mỗi năm",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "tuoitre.vn",
        "href": "/evidence/tuoitre_ggpower_pin_20260412.txt"
      }
    ],
    "tim": "gg power tổ hợp xưởng sản xuất 2 tầng hiện đại và trung tâm r&d, được đầu tư với công suất thiết kế 5gwh mỗi năm nhóm 5 năng lượng và vật liệu sp 18",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "GG Power",
        "span": "GG Power nhận chuyển giao công nghệ theo mô hình licensing để làm chủ hoàn toàn quy trình nghiên cứu và phát triển (R&D).",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_ggpower_pin_20260412.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "5",
        "span": "Nhà máy có tổng diện tích 1,2 hec-ta, bao gồm tổ hợp xưởng sản xuất 2 tầng hiện đại và trung tâm R&D, được đầu tư với công suất thiết kế 5GWh mỗi năm.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_ggpower_pin_20260412.txt",
        "note": "Nang luong va vat lieu tien tien -> nhom 5 theo QD 21/2026 [CNCL-G05]. Anh xa nhom, khong phai quote literal so 5."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "tổ hợp xưởng sản xuất 2 tầng hiện đại và trung tâm R&D, được đầu tư với công suất thiết kế 5GWh mỗi năm",
        "span": "Nhà máy có tổng diện tích 1,2 hec-ta, bao gồm tổ hợp xưởng sản xuất 2 tầng hiện đại và trung tâm R&D, được đầu tư với công suất thiết kế 5GWh mỗi năm.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_ggpower_pin_20260412.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "nhận chuyển giao công nghệ theo mô hình licensing để làm chủ hoàn toàn quy trình nghiên cứu và phát triển (R&D)",
        "span": "GG Power nhận chuyển giao công nghệ theo mô hình licensing để làm chủ hoàn toàn quy trình nghiên cứu và phát triển (R&D).",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/tuoitre_ggpower_pin_20260412.txt",
        "note": "QUAN TRONG: nen cong nghe la LICENSING tu doi tac nuoc ngoai, KHONG phai cong nghe tu phat trien. Day may da dung va gioi thieu 04/2026. Phan biet ro khi doc."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "18",
        "span": "Nhà máy có tổng diện tích 1,2 hec-ta, bao gồm tổ hợp xưởng sản xuất 2 tầng hiện đại và trung tâm R&D, được đầu tư với công suất thiết kế 5GWh mỗi năm.",
        "source": "tuoitre.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/tuoitre_ggpower_pin_20260412.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi nha may pin luu tru cong suat 5GWh -> SP18 Pin, ac quy va he thong luu tru nang luong BESS. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "HTI Technology",
    "loaiHinh": "",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "tim": "hti technology horus p02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "HTI Technology",
        "span": "HTI Technology",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "phức tạp như rừng núi, trong khi HTI Technology cung cấp  **Horus P02** với khả năng hoạt động yên lặng và trang bị cảm biến nhiệt, tối ưu cho các hoạt động trinh sát, cứu hộ.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A] Span truoc day sai chinh ta 'yen lat'; nguon viet 'yen lang'. Tra ve nguyen van 16/08/2026."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "phức tạp như rừng núi, trong khi HTI Technology cung cấp  **Horus P02** với khả năng hoạt động yên lặng và trang bị cảm biến nhiệt, tối ưu cho các hoạt động trinh sát, cứu hộ.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A] Span truoc day sai chinh ta 'yen lat'; nguon viet 'yen lang'. Tra ve nguyen van 16/08/2026."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
        "span": "phức tạp như rừng núi, trong khi HTI Technology cung cấp  **Horus P02** với khả năng hoạt động yên lặng và trang bị cảm biến nhiệt, tối ưu cho các hoạt động trinh sát, cứu hộ.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "Span truoc day sai chinh ta 'yen lat'; nguon viet 'yen lang'. Tra ve nguyen van 16/08/2026. Doi verbatim sang normalized vi gia tri khong con nam tron trong span moi."
      }
    ]
  },
  {
    "name": "Liên danh tư vấn TEDI - TRICC - TEDI SOUTH",
    "loaiHinh": "",
    "nhoms": [
      "10"
    ],
    "nhomLabels": [
      "Nhóm 10 · Đường sắt tốc độ cao"
    ],
    "sanPham": [
      "29"
    ],
    "capability": "rút ngắn chiều dài tuyến khoảng 4km so với phương án trình năm 2019 với chiều dài tuyến chính sau rà soát khoảng 1.541 km",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_tedi_dstdc_20241001.txt"
      }
    ],
    "tim": "liên danh tư vấn tedi - tricc - tedi south rút ngắn chiều dài tuyến khoảng 4km so với phương án trình năm 2019 với chiều dài tuyến chính sau rà soát khoảng 1.541 km nhóm 10 đường sắt tốc độ cao sp 29",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Liên danh tư vấn TEDI - TRICC - TEDI SOUTH",
        "span": "Liên danh tư vấn TEDI - TRICC - TEDI SOUTH đề xuất trên tuyến sẽ xây dựng 40 cơ sở bảo trì hạ tầng trong đó có 5 vị trí nằm cùng vị trí với depot.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_tedi_dstdc_20241001.txt",
        "note": "Span viet 'Lien danh tu van TEDI - TRICC - TEDI SOUTH'; giu nguyen dang co dau gach noi cua ban goc."
      },
      {
        "field": "nhom_cncl",
        "value": "10",
        "span": "Theo Báo cáo nghiên cứu tiền khả thi Dự án đường sắt tốc độ cao trên trục Bắc - Nam, kết quả nghiên cứu mới nhất của liên danh tư vấn TEDI - TRICC - TEDI SOUTH đã rút ngắn chiều dài tuyến khoảng 4km so với phương án trình năm 2019 với chiều dài tuyến chính sau rà soát khoảng 1.541 km.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_tedi_dstdc_20241001.txt",
        "note": "Duong sat toc do cao va do thi -> nhom 10 theo QD 21/2026 [CNCL-G10]. Anh xa nhom. Tu van thiet ke cong trinh duong sat toc do cao."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "rút ngắn chiều dài tuyến khoảng 4km so với phương án trình năm 2019 với chiều dài tuyến chính sau rà soát khoảng 1.541 km",
        "span": "Theo Báo cáo nghiên cứu tiền khả thi Dự án đường sắt tốc độ cao trên trục Bắc - Nam, kết quả nghiên cứu mới nhất của liên danh tư vấn TEDI - TRICC - TEDI SOUTH đã rút ngắn chiều dài tuyến khoảng 4km so với phương án trình năm 2019 với chiều dài tuyến chính sau rà soát khoảng 1.541 km.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_tedi_dstdc_20241001.txt",
        "note": "San pham la HO SO NGHIEN CUU TIEN KHA THI, khong phai he thong hay thiet bi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "29",
        "span": "Theo Báo cáo nghiên cứu tiền khả thi Dự án đường sắt tốc độ cao trên trục Bắc - Nam, kết quả nghiên cứu mới nhất của liên danh tư vấn TEDI - TRICC - TEDI SOUTH đã rút ngắn chiều dài tuyến khoảng 4km so với phương án trình năm 2019 với chiều dài tuyến chính sau rà soát khoảng 1.541 km.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_tedi_dstdc_20241001.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi ho so nghien cuu tien kha thi duong sat toc do cao -> SP29 Cong trinh duong sat toc do cao. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Masan High-Tech Materials",
    "loaiHinh": "",
    "nhoms": [],
    "nhomLabels": [],
    "sanPham": [],
    "capability": "cung cấp các vật liệu công nghệ cao như vonfram, fluorspar cho chuỗi giá trị sản xuất chip toàn cầu",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nguoiquansat.vn",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt"
      }
    ],
    "tim": "masan high-tech materials cung cấp các vật liệu công nghệ cao như vonfram, fluorspar cho chuỗi giá trị sản xuất chip toàn cầu",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Masan High-Tech Materials",
        "span": "còn Masan High-Tech Materials lại đóng vai trò “mắt xích ngược dòng”, cung cấp các vật liệu công nghệ cao như vonfram, fluorspar cho chuỗi giá trị sản xuất chip toàn cầu.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": ""
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "cung cấp các vật liệu công nghệ cao như vonfram, fluorspar cho chuỗi giá trị sản xuất chip toàn cầu",
        "span": "còn Masan High-Tech Materials lại đóng vai trò “mắt xích ngược dòng”, cung cấp các vật liệu công nghệ cao như vonfram, fluorspar cho chuỗi giá trị sản xuất chip toàn cầu.",
        "source": "nguoiquansat.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt",
        "note": "nhom_cncl de HONEST-NULL co chu dich: nguon dat don vi o khau vat lieu thuong nguon, co the thuoc nhom 6 (chip) hoac nhom 5 (nang luong, vat lieu tien tien). Cho nguoi quyet, khong tu gan."
      }
    ]
  },
  {
    "name": "MiSmart",
    "loaiHinh": "",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "tim": "mismart giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "MiSmart",
        "span": "MiSmart",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": ", với triết lý \"Drone Việt vì người Việt\", đã thành công đưa các giải pháp drone chuyên dụng vào nông nghiệp, giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> SP22 / nhom 9 [CNCL-P22-A] Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": ", với triết lý \"Drone Việt vì người Việt\", đã thành công đưa các giải pháp drone chuyên dụng vào nông nghiệp, giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> SP22 / nhom 9 [CNCL-P22-A] Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
        "span": ", với triết lý \"Drone Việt vì người Việt\", đã thành công đưa các giải pháp drone chuyên dụng vào nông nghiệp, giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi."
      }
    ]
  },
  {
    "name": "MK Smart",
    "loaiHinh": "",
    "nhoms": [
      "7"
    ],
    "nhomLabels": [
      "Nhóm 7 · An ninh mạng và lượng tử"
    ],
    "sanPham": [
      "09"
    ],
    "capability": "Lotus GovID",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nhandan.vn",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt"
      }
    ],
    "tim": "mk smart lotus govid nhóm 7 an ninh mạng và lượng tử sp 09",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "MK Smart",
        "span": "Sản phẩm Lotus GovID của MK Smart đã đạt chứng chỉ Common Criteria (CC) mức EAL 5+ theo quyết định BOE-A-2026-1037, góp phần tạo nên “Giấy thông hành” quyền lực của công nghệ Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "7",
        "span": "Sản phẩm Lotus GovID của MK Smart đã đạt chứng chỉ Common Criteria (CC) mức EAL 5+ theo quyết định BOE-A-2026-1037, góp phần tạo nên “Giấy thông hành” quyền lực của công nghệ Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "An ninh mang va luong tu -> nhom 7 theo QD 21/2026 [CNCL-G07]. Anh xa nhom."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Lotus GovID",
        "span": "Sản phẩm Lotus GovID của MK Smart đã đạt chứng chỉ Common Criteria (CC) mức EAL 5+ theo quyết định BOE-A-2026-1037, góp phần tạo nên “Giấy thông hành” quyền lực của công nghệ Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã đạt chứng chỉ Common Criteria (CC) mức EAL 5+ theo quyết định BOE-A-2026-1037",
        "span": "Sản phẩm Lotus GovID của MK Smart đã đạt chứng chỉ Common Criteria (CC) mức EAL 5+ theo quyết định BOE-A-2026-1037, góp phần tạo nên “Giấy thông hành” quyền lực của công nghệ Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "Chung nhan quoc te dinh danh duoc bang so quyet dinh, la bang chung manh nhat cua nhom 7."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "09",
        "span": "Sản phẩm Lotus GovID của MK Smart đã đạt chứng chỉ Common Criteria (CC) mức EAL 5+ theo quyết định BOE-A-2026-1037, góp phần tạo nên “Giấy thông hành” quyền lực của công nghệ Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi Lotus GovID dat chung chi Common Criteria EAL 5+ -> SP09 (bao mat ha tang dinh danh quoc gia). Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Nhà máy Kiểm thử và Đóng gói tiên tiến chip bán dẫn FPT",
    "loaiHinh": "",
    "nhoms": [
      "6"
    ],
    "nhomLabels": [
      "Nhóm 6 · Chip bán dẫn"
    ],
    "sanPham": [
      "23"
    ],
    "capability": "nhà máy kiểm thử, đóng gói tiên tiến do người Việt làm chủ",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt"
      }
    ],
    "tim": "nhà máy kiểm thử và đóng gói tiên tiến chip bán dẫn fpt nhà máy kiểm thử, đóng gói tiên tiến do người việt làm chủ nhóm 6 chip bán dẫn sp 23",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Nhà máy Kiểm thử và Đóng gói tiên tiến chip bán dẫn FPT",
        "span": "Lễ công bố thành lập nhà máy kiểm thử và đóng gói tiên tiến chip bán dẫn FPT diễn ra sáng ngày 28/01/2026 tại Hà Nội.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "Nguon viet thuong 'nha may kiem thu va dong goi tien tien chip ban dan FPT'; ten don vi chuan hoa hoa dau tu. Tach phap nhan khoi entity FPT theo quyet dinh Lam 16/08 (giu truong don tri)."
      },
      {
        "field": "nhom_cncl",
        "value": "6",
        "span": "Lễ công bố thành lập nhà máy kiểm thử và đóng gói tiên tiến chip bán dẫn FPT diễn ra sáng ngày 28/01/2026 tại Hà Nội.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "Chip ban dan -> nhom 6 (Cong nghe chip ban dan) theo QD 21/2026 [CNCL-G06]. Anh xa nhom, khong phai quote literal so 6."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "nhà máy kiểm thử, đóng gói tiên tiến do người Việt làm chủ",
        "span": "Cũng theo đại diện FPT, đây là nhà máy kiểm thử, đóng gói tiên tiến do người Việt làm chủ. Trong giai đoạn 1 (2026–2027), nhà máy đặt tại Khu công nghiệp Yên Phong II-C, xã Yên Phong và xã Tam Giang, tỉnh Bắc Ninh với quy mô 1.600 m2, với 6 dây chuyền kiểm tra chức năng (ATE tester & handler) và một khu vực gồm nhiều hệ thống kiểm tra độ tin cậy và thử nghiệm độ bền chuyên biệt (hệ thống Burn-in, hệ thống Reliability Test, hệ thống Failure Analysis Test).",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "quy mô 1.600 m2, với 6 dây chuyền kiểm tra chức năng (ATE tester & handler)",
        "span": "Cũng theo đại diện FPT, đây là nhà máy kiểm thử, đóng gói tiên tiến do người Việt làm chủ. Trong giai đoạn 1 (2026–2027), nhà máy đặt tại Khu công nghiệp Yên Phong II-C, xã Yên Phong và xã Tam Giang, tỉnh Bắc Ninh với quy mô 1.600 m2, với 6 dây chuyền kiểm tra chức năng (ATE tester & handler) và một khu vực gồm nhiều hệ thống kiểm tra độ tin cậy và thử nghiệm độ bền chuyên biệt (hệ thống Burn-in, hệ thống Reliability Test, hệ thống Failure Analysis Test).",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "Giai doan 1 (2026-2027). Day la CONG BO ke hoach tai le thanh lap 28/01/2026, KHONG phai nang luc da van hanh."
      },
      {
        "field": "location",
        "value": "tỉnh Bắc Ninh",
        "span": "Cũng theo đại diện FPT, đây là nhà máy kiểm thử, đóng gói tiên tiến do người Việt làm chủ. Trong giai đoạn 1 (2026–2027), nhà máy đặt tại Khu công nghiệp Yên Phong II-C, xã Yên Phong và xã Tam Giang, tỉnh Bắc Ninh với quy mô 1.600 m2, với 6 dây chuyền kiểm tra chức năng (ATE tester & handler) và một khu vực gồm nhiều hệ thống kiểm tra độ tin cậy và thử nghiệm độ bền chuyên biệt (hệ thống Burn-in, hệ thống Reliability Test, hệ thống Failure Analysis Test).",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": ""
      },
      {
        "field": "san_pham_lien_quan",
        "value": "23",
        "span": "Cũng theo đại diện FPT, đây là nhà máy kiểm thử, đóng gói tiên tiến do người Việt làm chủ. Trong giai đoạn 1 (2026–2027), nhà máy đặt tại Khu công nghiệp Yên Phong II-C, xã Yên Phong và xã Tam Giang, tỉnh Bắc Ninh với quy mô 1.600 m2, với 6 dây chuyền kiểm tra chức năng (ATE tester & handler) và một khu vực gồm nhiều hệ thống kiểm tra độ tin cậy và thử nghiệm độ bền chuyên biệt (hệ thống Burn-in, hệ thống Reliability Test, hệ thống Failure Analysis Test).",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi nha may kiem thu dong goi chip ban dan -> SP23 Chip chuyen dung. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Phenikaa-X",
    "loaiHinh": "",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "tim": "phenikaa-x vtol-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Phenikaa-X",
        "span": "Phenikaa-X",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "Phenikaa-X với mẫu  **VTOL-01** chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi, trong khi HTI Technology cung cấp  **Horus P02** với khả năng hoạt động yên lặng và trang bị cảm biến nhiệt, tối ưu cho các hoạt động trinh sát, cứu hộ.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A] Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "Phenikaa-X với mẫu  **VTOL-01** chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi, trong khi HTI Technology cung cấp  **Horus P02** với khả năng hoạt động yên lặng và trang bị cảm biến nhiệt, tối ưu cho các hoạt động trinh sát, cứu hộ.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A] Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
        "span": "Phenikaa-X với mẫu  **VTOL-01** chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi, trong khi HTI Technology cung cấp  **Horus P02** với khả năng hoạt động yên lặng và trang bị cảm biến nhiệt, tối ưu cho các hoạt động trinh sát, cứu hộ.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi. Doi verbatim sang normalized: chu trong nguon co markup hoac ngat dong chen giua nen gia tri khong nam tron trong span."
      }
    ]
  },
  {
    "name": "Realtime Robotics (RtR)",
    "loaiHinh": "DN",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
    "bestTier": "B",
    "favorsRtr": true,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "tim": "realtime robotics (rtr) dn drone hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Realtime Robotics (RtR)",
        "span": "Realtime Robotics (RtR)",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "Khi  **Tiến sĩ Lương Việt Quốc** sáng lập RtR, ông mang theo kinh nghiệm và tầm nhìn của một nhà khoa học để đối mặt với thách thức lớn từ sự hoài nghi.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "CAN CU NAM NGOAI SPAN: span chi noi ve nguoi sang lap, KHONG neu loai hinh to chuc. Phan loai DN dua tren ten don vi va boi canh bai, khong phai tu cau trich. Diem yeu nay duoc neu ro vi RtR gan favors=rtr (nguoi van hanh la COO/AI Officer RtR). Span truoc day BI VIET LAI so voi nguon. Tra ve nguyen van 16/08/2026 khi cong doi chung chay du 31 trang. Gia tri claim khong doi. LUU Y: don vi nay mang co favors=rtr nen sai lech duoc ghi noi bat."
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A]"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A]"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Sản phẩm đã được cấp bằng sáng chế tại Mỹ, Úc và được sử dụng bởi Phòng thí nghiệm Quốc gia Los Alamos (Mỹ) và lực lượng cảnh sát Mỹ, Hà Lan",
        "span": "Sản phẩm đã được cấp bằng sáng chế tại Mỹ, Úc và vượt qua các bài kiểm tra khắt khe để được chấp nhận đưa vào sử dụng bởi Phòng thí nghiệm Quốc gia Los Alamos (Mỹ) và lực lượng cảnh sát Mỹ, Hà Lan.",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi. Doi verbatim sang normalized vi gia tri khong con nam tron trong span moi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "span": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      }
    ]
  },
  {
    "name": "ROSTEK",
    "loaiHinh": "",
    "nhoms": [
      "3"
    ],
    "nhomLabels": [
      "Nhóm 3 · Robot và tự động hoá"
    ],
    "sanPham": [
      "07"
    ],
    "capability": "xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vjst.vn",
        "href": "/evidence/vjst_rostek_agv_20220103.txt"
      }
    ],
    "tim": "rostek xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa nhóm 3 robot và tự động hoá sp 07",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "ROSTEK",
        "span": "Để giải quyết vấn đề này, startup công nghệ ROSTEK đã cho ra đời xe tự hành ROSTEK AGV, giúp tự động hóa quá trình vận chuyển, nhận và trả hàng hóa.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vjst_rostek_agv_20220103.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "3",
        "span": "ROSTEK AGV là sản phẩm xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa, đáp ứng nhu cầu nhiều ngành nghề khác nhau.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_rostek_agv_20220103.txt",
        "note": "Robot va tu dong hoa -> nhom 3 (Cong nghe robot va tu dong hoa) theo QD 21/2026 [CNCL-G03]. Anh xa nhom, khong phai quote literal so 3."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa",
        "span": "ROSTEK AGV là sản phẩm xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa, đáp ứng nhu cầu nhiều ngành nghề khác nhau.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vjst_rostek_agv_20220103.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã được sử dụng trong dây truyền sản xuất của công ty Nidec Sankyo Việt Nam",
        "span": "Hiện nay, loại robot này đã được sử dụng trong dây truyền sản xuất của công ty Nidec Sankyo Việt Nam, thuộc tập đoàn Nidec tại Nhật Bản, một nhà sản xuất micro moto lớn nhất thế giới cho đĩa cứng và ổ đĩa quang.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vjst_rostek_agv_20220103.txt",
        "note": "Bai dang 03/01/2022, da qua refresh_days 180. Chinh ta 'day truyen' la loi cua ban goc, giu nguyen. Cau dung 'loai robot nay' chu khong goi dich danh ROSTEK AGV, quy chieu theo mach doan."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "07",
        "span": "ROSTEK AGV là sản phẩm xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa, đáp ứng nhu cầu nhiều ngành nghề khác nhau.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_rostek_agv_20220103.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'xe tu hanh dan duong chu dong' -> SP07 Robot tu hanh va robot cong nghiep. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Tập đoàn MISA",
    "loaiHinh": "",
    "nhoms": [
      "3"
    ],
    "nhomLabels": [
      "Nhóm 3 · Robot và tự động hoá"
    ],
    "sanPham": [
      "07"
    ],
    "capability": "robot do Tập đoàn MISA phát triển đã thực hiện các thao tác trình diễn theo kịch bản",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt"
      }
    ],
    "tim": "tập đoàn misa robot do tập đoàn misa phát triển đã thực hiện các thao tác trình diễn theo kịch bản nhóm 3 robot và tự động hoá sp 07",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Tập đoàn MISA",
        "span": "Ở phần khai mạc, robot do Tập đoàn MISA phát triển đã thực hiện các thao tác trình diễn theo kịch bản, đóng vai trò cầu nối giữa công nghệ và con người trong không gian sự kiện.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "3",
        "span": "Ở phần khai mạc, robot do Tập đoàn MISA phát triển đã thực hiện các thao tác trình diễn theo kịch bản, đóng vai trò cầu nối giữa công nghệ và con người trong không gian sự kiện.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": "Robot va tu dong hoa -> nhom 3 (Cong nghe robot va tu dong hoa) theo QD 21/2026 [CNCL-G03]. Anh xa nhom, khong phai quote literal so 3."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "robot do Tập đoàn MISA phát triển đã thực hiện các thao tác trình diễn theo kịch bản",
        "span": "Ở phần khai mạc, robot do Tập đoàn MISA phát triển đã thực hiện các thao tác trình diễn theo kịch bản, đóng vai trò cầu nối giữa công nghệ và con người trong không gian sự kiện.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": "Bang chung la MAN TRINH DIEN tai su kien Make in Viet Nam 2025, khong phai san pham thuong mai. Nguon khong mo ta chung loai robot."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "07",
        "span": "Ở phần khai mạc, robot do Tập đoàn MISA phát triển đã thực hiện các thao tác trình diễn theo kịch bản, đóng vai trò cầu nối giữa công nghệ và con người trong không gian sự kiện.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'robot do Tap doan MISA phat trien' trinh dien -> SP07 Robot. LUU Y: bang chung la man trinh dien, khong phai san pham thuong mai. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Tập đoàn Viettel",
    "loaiHinh": "",
    "nhoms": [
      "1",
      "6"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số",
      "Nhóm 6 · Chip bán dẫn"
    ],
    "sanPham": [
      "1"
    ],
    "capability": "Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vjst.vn",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      },
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt"
      }
    ],
    "tim": "tập đoàn viettel mô hình llm hỗ trợ tiếng việt với độ dài ngữ cảnh (context length) 4096 token dòng chip soc ai on edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (uav) nhóm 1 công nghệ số nhóm 6 chip bán dẫn sp 1",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Tập đoàn Viettel",
        "span": "Tập đoàn Viettel",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vjst_viettel_llm_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Có mô hình xác suất có khả năng hiểu và sinh ngôn ngữ tự nhiên (LLM) để hỗ trợ tiếng Việt được huấn luyện hỗ trợ độ dài ngữ cảnh (context length) 4096 token",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_viettel_llm_20260718.txt",
        "note": "Cong nghe so -> nhom 1 theo QD 21/2026 [CNCL-G01-A] Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "dịch vụ LLM hỗ trợ tiếng Việt truy cập thông qua API, bao gồm mô hình và hạ tầng tính toán, có thể truy cập từ các tổ chức và doanh nghiệp (DN) trong nước.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_viettel_llm_20260718.txt",
        "note": "LLM tieng Viet / tro ly ao -> SP1 [CNCL-P01-A] Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi."
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Bộ TT&TT giao Tập đoàn Viettel phát triển Mô hình ngôn ngữ lớn Tiếng Việt và công cụ trợ lý ảo cho cán bộ, công chức",
        "span": "meta-description: Tập đoàn Viettel đã được Bộ TT&TT phê duyệt là đơn vị nghiên cứu, thử nghiệm phát triển Mô hình ngôn ngữ lớn Tiếng Việt và trợ lý ảo cho cán bộ, công chức tại Bộ TT&TT.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_viettel_llm_20260718.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi. Doi verbatim sang normalized vi gia tri khong con nam tron trong span moi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token",
        "span": "Có mô hình xác suất có khả năng hiểu và sinh ngôn ngữ tự nhiên (LLM) để hỗ trợ tiếng Việt được huấn luyện hỗ trợ độ dài ngữ cảnh (context length) 4096 token",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_viettel_llm_20260718.txt",
        "note": "Span tra ve DUNG CHU CUA NGUON 16/08/2026 sau vong doi chung du 31 trang. Ban snapshot cu la CAU VIET LAI hoac bi go markup, khong phai chu cua nha bao. Gia tri claim khong doi. Doi verbatim sang normalized: chu trong nguon co markup hoac ngat dong chen giua nen gia tri khong nam tron trong span."
      },
      {
        "field": "nhom_cncl_phu_6",
        "value": "6",
        "span": "Trong 3 khâu chính của việc làm chip gồm thiết kế, sản xuất và đóng gói kiểm thử, Việt Nam đã có nền tảng nhiều năm trong việc thiết kế, đồng thời vừa có sự tham gia sản xuất sau sự kiện khởi công nhà máy chế tạo của Viettel giữa tháng 1.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "TRUONG PHU (TIP-CNCL-2D). Viettel dung o nhom 1 lam nhom chinh; day la bang chung nhom 6 chip ban dan. Nguon goi ten tap doan me, KHONG goi phap nhan con nao, nen dung truong phu thay vi tach phap nhan. Muc do: KHOI CONG nha may che tao, chua phai da san xuat."
      },
      {
        "field": "nang_luc_mo_ta_2",
        "value": "dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV)",
        "span": "Tại sự kiện, FPT ký kết hàng loạt thỏa thuận với các đối tác công nghệ trong lĩnh vực bán dẫn tại Việt Nam và quốc tế, như hợp tác toàn diện với Viettel trong hoạt động xây dựng năng lực tự chủ về công nghệ bán dẫn thông qua việc liên thông chuỗi giá trị ngành công nghệ bán dẫn: Đào tạo - Thiết kế - Chế tạo - Kiểm thử - Đóng gói - Thương mại, trọng tâm là cùng phát triển dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV); các thiết bị thông minh.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt",
        "note": "TIP-CNCL-3B Task A. Truong nang_luc_mo_ta_2 vi nang_luc_mo_ta da co gia tri khac (don tri). Day la nang luc HOP TAC FPT va Viettel, cong bo 28/01/2026, muc do LA THOA THUAN va DINH HUONG PHAT TRIEN, chua phai chip da ra."
      }
    ]
  },
  {
    "name": "Tổng công ty Cổ phần Dịch vụ Kỹ thuật Dầu khí Việt Nam (PTSC)",
    "loaiHinh": "",
    "nhoms": [
      "8"
    ],
    "nhomLabels": [
      "Nhóm 8 · Biển, đại dương, lòng đất"
    ],
    "sanPham": [
      "26"
    ],
    "capability": "đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế Ørsted",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ptsc_chande_20250618.txt"
      }
    ],
    "tim": "tổng công ty cổ phần dịch vụ kỹ thuật dầu khí việt nam (ptsc) đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế ørsted nhóm 8 biển, đại dương, lòng đất sp 26",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Tổng công ty Cổ phần Dịch vụ Kỹ thuật Dầu khí Việt Nam (PTSC)",
        "span": "Dưới sự dẫn dắt và chỉ đạo chiến lược của Petrovietnam với vai trò \"kiến tạo - chỉ đạo - thúc đẩy\", Tổng công ty Cổ phần Dịch vụ Kỹ thuật Dầu khí Việt Nam (PTSC) - đơn vị thành viên của Petrovietnam và là đơn vị chủ lực trong lĩnh vực công nghiệp dầu khí và năng lượng tái tạo - đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế Ørsted.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ptsc_chande_20250618.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "8",
        "span": "Dưới sự dẫn dắt và chỉ đạo chiến lược của Petrovietnam với vai trò \"kiến tạo - chỉ đạo - thúc đẩy\", Tổng công ty Cổ phần Dịch vụ Kỹ thuật Dầu khí Việt Nam (PTSC) - đơn vị thành viên của Petrovietnam và là đơn vị chủ lực trong lĩnh vực công nghiệp dầu khí và năng lượng tái tạo - đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế Ørsted.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ptsc_chande_20250618.txt",
        "note": "Bien, dai duong va long dat -> nhom 8 theo QD 21/2026 [CNCL-G08]. Anh xa nhom. Nang luong ngoai khoi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế Ørsted",
        "span": "Dưới sự dẫn dắt và chỉ đạo chiến lược của Petrovietnam với vai trò \"kiến tạo - chỉ đạo - thúc đẩy\", Tổng công ty Cổ phần Dịch vụ Kỹ thuật Dầu khí Việt Nam (PTSC) - đơn vị thành viên của Petrovietnam và là đơn vị chủ lực trong lĩnh vực công nghiệp dầu khí và năng lượng tái tạo - đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế Ørsted.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ptsc_chande_20250618.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "lần đầu tiên một doanh nghiệp Việt Nam thắng thầu và chế tạo chân đế điện gió quy mô lớn để xuất khẩu ra thế giới",
        "span": "Phát biểu tại buổi lễ, đồng chí Trần Hồ Bắc, Tổng giám đốc PTSC, nhấn mạnh đây là dự án có ý nghĩa đặc biệt quan trọng, lần đầu tiên một doanh nghiệp Việt Nam thắng thầu và chế tạo chân đế điện gió quy mô lớn để xuất khẩu ra thế giới.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ptsc_chande_20250618.txt",
        "note": "Day la LOI PHAT BIEU cua Tong giam doc PTSC duoc tuong thuat gian tiep, khong phai khang dinh doc lap cua toa soan."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "26",
        "span": "Dưới sự dẫn dắt và chỉ đạo chiến lược của Petrovietnam với vai trò \"kiến tạo - chỉ đạo - thúc đẩy\", Tổng công ty Cổ phần Dịch vụ Kỹ thuật Dầu khí Việt Nam (PTSC) - đơn vị thành viên của Petrovietnam và là đơn vị chủ lực trong lĩnh vực công nghiệp dầu khí và năng lượng tái tạo - đã xuất sắc hoàn thành việc bàn giao 33 chân đế điện gió ngoài khơi cho đối tác quốc tế Ørsted.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ptsc_chande_20250618.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi che tao chan de DIEN GIO NGOAI KHOI -> SP26 Cong nghe tham do bien sau, long dat, nang luong ngoai khoi. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Tổng công ty Thiết bị điện Đông Anh",
    "loaiHinh": "",
    "nhoms": [
      "5"
    ],
    "nhomLabels": [
      "Nhóm 5 · Năng lượng và vật liệu"
    ],
    "sanPham": [
      "20"
    ],
    "capability": "làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt"
      }
    ],
    "tim": "tổng công ty thiết bị điện đông anh làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kv có công suất lớn nhất trên lưới điện truyền tải việt nam nhóm 5 năng lượng và vật liệu sp 20",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Tổng công ty Thiết bị điện Đông Anh",
        "span": "Đây là thành quả của tinh thần lao động sáng tạo, sự nỗ lực vượt bậc của tập thể kỹ sư, công nhân lao động Tổng công ty Thiết bị điện Đông Anh khi lần đầu tiên một doanh nghiệp trong nước làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "5",
        "span": "Đây là thành quả của tinh thần lao động sáng tạo, sự nỗ lực vượt bậc của tập thể kỹ sư, công nhân lao động Tổng công ty Thiết bị điện Đông Anh khi lần đầu tiên một doanh nghiệp trong nước làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt",
        "note": "Nang luong va vat lieu tien tien -> nhom 5 theo QD 21/2026 [CNCL-G05]. Anh xa nhom, khong phai quote literal so 5."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam",
        "span": "Đây là thành quả của tinh thần lao động sáng tạo, sự nỗ lực vượt bậc của tập thể kỹ sư, công nhân lao động Tổng công ty Thiết bị điện Đông Anh khi lần đầu tiên một doanh nghiệp trong nước làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã được thử nghiệm và đạt tất cả các hạng mục thử nghiệm xuất xưởng theo tiêu chuẩn IEC",
        "span": "Đến nay, sau khi hoàn thành chế tạo, máy biến áp 500kV- 3x300MVA đã được thử nghiệm và đạt tất cả các hạng mục thử nghiệm xuất xưởng theo tiêu chuẩn IEC.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt",
        "note": "San pham vat ly da xuat xuong, khong phai ke hoach. Ban goc viet '500kV- 3x300MVA' thieu dau cach, giu nguyen."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "20",
        "span": "Đây là thành quả của tinh thần lao động sáng tạo, sự nỗ lực vượt bậc của tập thể kỹ sư, công nhân lao động Tổng công ty Thiết bị điện Đông Anh khi lần đầu tiên một doanh nghiệp trong nước làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'may bien ap 500kV tren luoi dien truyen tai' -> SP20 Thiet bi dien cao ap va he thong truyen tai dien. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Viettel AI",
    "loaiHinh": "",
    "nhoms": [
      "1"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số"
    ],
    "sanPham": [
      "01"
    ],
    "capability": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      }
    ],
    "tim": "viettel ai giải pháp claimpkg, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng. nhóm 1 công nghệ số sp 01",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viettel AI",
        "span": "Viettel AI",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Viettel AI cũng cho thấy vai trò tiên phong khi tập trung vào nghiên cứu công nghệ lõi, phát triển ứng dụng trong các lĩnh vực trọng điểm và đào tạo nguồn nhân lực chất lượng cao.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "Cong nghe so -> nhom 1 theo QD 21/2026 [CNCL-G01-A]"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
        "span": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": ""
      },
      {
        "field": "san_pham_lien_quan",
        "value": "01",
        "span": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi ve tro ly ao va mo hinh AI -> SP01. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Viettel High Tech",
    "loaiHinh": "DN",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "Với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, VU-R70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "source": "nhandan.vn",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt"
      }
    ],
    "tim": "viettel high tech dn với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, vu-r70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viettel High Tech",
        "span": "Viettel High Tech",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "Tổng công ty Công nghiệp Công nghệ cao Viettel",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt",
        "note": "Phan loai tu chinh span: span goi ten 'Tong cong ty Cong nghiep Cong nghe cao Viettel', tu 'Tong cong ty' cho biet la doanh nghiep."
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "UAV trinh sát, UAV cảm tử và UAV đa năng",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A]"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "UAV trinh sát, UAV cảm tử và UAV đa năng",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt",
        "note": "UAV -> san pham 22 / nhom 9 (hang khong vu tru) theo QD 21/2026 [CNCL-P22-A]"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Tất cả các sản phẩm UAV này Viettel đều làm chủ công nghệ, tự nghiên cứu, phát triển và chế tạo trong nước 100%",
        "span": "Tất cả các sản phẩm UAV này Viettel đều làm chủ công nghệ, tự nghiên cứu, phát triển và chế tạo trong nước 100%",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt",
        "note": ""
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, VU-R70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ",
        "span": "Với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, VU-R70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt",
        "note": ""
      }
    ]
  },
  {
    "name": "Viện Công nghệ xạ hiếm",
    "loaiHinh": "vien",
    "nhoms": [
      "8"
    ],
    "nhomLabels": [
      "Nhóm 8 · Biển, đại dương, lòng đất"
    ],
    "sanPham": [
      "25"
    ],
    "capability": "làm chủ các công đoạn công nghệ cốt lõi từ tuyển khoáng, thủy luyện, đến phân chia và tinh chế các oxit đất hiếm riêng rẽ với độ tinh khiết cao",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt"
      }
    ],
    "tim": "viện công nghệ xạ hiếm vien làm chủ các công đoạn công nghệ cốt lõi từ tuyển khoáng, thủy luyện, đến phân chia và tinh chế các oxit đất hiếm riêng rẽ với độ tinh khiết cao nhóm 8 biển, đại dương, lòng đất sp 25",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viện Công nghệ xạ hiếm",
        "span": "Trong nhiều năm qua, Viện Công nghệ xạ hiếm (Viện Năng lượng nguyên tử Việt Nam) đã kiên trì nghiên cứu, làm chủ được các quy trình công nghệ ở quy mô phòng thí nghiệm và pilot, sẵn sàng chuyển giao và mở rộng quy mô sản xuất khi có sự đầu tư đúng mức từ nhà nước và doanh nghiệp.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt",
        "note": ""
      },
      {
        "field": "loai_hinh",
        "value": "vien",
        "span": "Trong nhiều năm qua, Viện Công nghệ xạ hiếm (Viện Năng lượng nguyên tử Việt Nam) đã kiên trì nghiên cứu, làm chủ được các quy trình công nghệ ở quy mô phòng thí nghiệm và pilot, sẵn sàng chuyển giao và mở rộng quy mô sản xuất khi có sự đầu tư đúng mức từ nhà nước và doanh nghiệp.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt",
        "note": "Phan loai tu chinh span: 'Vien Cong nghe xa hiem (Vien Nang luong nguyen tu Viet Nam)'."
      },
      {
        "field": "nhom_cncl",
        "value": "8",
        "span": "Báo cáo đã hệ thống hóa toàn diện quá trình nghiên cứu của Viện từ những ngày đầu, đi từ các đề tài cấp Nhà nước, các dự án hợp tác quốc tế với Nhật Bản, Hàn Quốc, đến việc làm chủ các công đoạn công nghệ cốt lõi từ tuyển khoáng, thủy luyện, đến phân chia và tinh chế các oxit đất hiếm riêng rẽ với độ tinh khiết cao.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt",
        "note": "Bien, dai duong va long dat -> nhom 8 theo QD 21/2026 [CNCL-G08]. Anh xa nhom."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "làm chủ các công đoạn công nghệ cốt lõi từ tuyển khoáng, thủy luyện, đến phân chia và tinh chế các oxit đất hiếm riêng rẽ với độ tinh khiết cao",
        "span": "Báo cáo đã hệ thống hóa toàn diện quá trình nghiên cứu của Viện từ những ngày đầu, đi từ các đề tài cấp Nhà nước, các dự án hợp tác quốc tế với Nhật Bản, Hàn Quốc, đến việc làm chủ các công đoạn công nghệ cốt lõi từ tuyển khoáng, thủy luyện, đến phân chia và tinh chế các oxit đất hiếm riêng rẽ với độ tinh khiết cao.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt",
        "note": ""
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "làm chủ được các quy trình công nghệ ở quy mô phòng thí nghiệm và pilot",
        "span": "Trong nhiều năm qua, Viện Công nghệ xạ hiếm (Viện Năng lượng nguyên tử Việt Nam) đã kiên trì nghiên cứu, làm chủ được các quy trình công nghệ ở quy mô phòng thí nghiệm và pilot, sẵn sàng chuyển giao và mở rộng quy mô sản xuất khi có sự đầu tư đúng mức từ nhà nước và doanh nghiệp.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt",
        "note": "QUAN TRONG: chinh nguon noi ro CHI O QUY MO PHONG THI NGHIEM VA PILOT, 'san sang chuyen giao va mo rong quy mo san xuat khi co su dau tu dung muc'. KHONG duoc doc thanh day chuyen cong nghiep."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "25",
        "span": "Báo cáo đã hệ thống hóa toàn diện quá trình nghiên cứu của Viện từ những ngày đầu, đi từ các đề tài cấp Nhà nước, các dự án hợp tác quốc tế với Nhật Bản, Hàn Quốc, đến việc làm chủ các công đoạn công nghệ cốt lõi từ tuyển khoáng, thủy luyện, đến phân chia và tinh chế các oxit đất hiếm riêng rẽ với độ tinh khiết cao.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_viencongnghexahiem_dathiem_20250626.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi tuyen khoang, thuy luyen, tinh che oxit DAT HIEM -> SP25 Cong nghe khai thac, che bien khoang san va dat hiem. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Viện Di truyền Nông nghiệp Việt Nam",
    "loaiHinh": "vien",
    "nhoms": [
      "4"
    ],
    "nhomLabels": [
      "Nhóm 4 · Sinh học và y sinh"
    ],
    "sanPham": [
      "16"
    ],
    "capability": "những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_vdtnn_chinhsuagen_20251001.txt"
      }
    ],
    "tim": "viện di truyền nông nghiệp việt nam vien những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen nhóm 4 sinh học và y sinh sp 16",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viện Di truyền Nông nghiệp Việt Nam",
        "span": "Đến Viện Di truyền nông nghiệp Việt Nam, chúng tôi được tận mắt chiêm ngưỡng những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vdtnn_chinhsuagen_20251001.txt",
        "note": "Nguon viet 'Vien Di truyen nong nghiep Viet Nam' (chu 'nong nghiep' thuong); chuan hoa hoa dau."
      },
      {
        "field": "loai_hinh",
        "value": "vien",
        "span": "Đến Viện Di truyền nông nghiệp Việt Nam, chúng tôi được tận mắt chiêm ngưỡng những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vdtnn_chinhsuagen_20251001.txt",
        "note": "Phan loai tu chinh span: span ghi 'Den Vien Di truyen nong nghiep Viet Nam'."
      },
      {
        "field": "nhom_cncl",
        "value": "4",
        "span": "Đến Viện Di truyền nông nghiệp Việt Nam, chúng tôi được tận mắt chiêm ngưỡng những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vdtnn_chinhsuagen_20251001.txt",
        "note": "Sinh hoc va y sinh tien tien -> nhom 4 theo QD 21/2026 [CNCL-G04]. Anh xa nhom, khong phai quote literal so 4."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen",
        "span": "Đến Viện Di truyền nông nghiệp Việt Nam, chúng tôi được tận mắt chiêm ngưỡng những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_vdtnn_chinhsuagen_20251001.txt",
        "note": "NANG LUC CAP NGHIEN CUU VA TAO DONG. Nguon KHONG neu giong nao da duoc cong nhan luu hanh thuong mai. bang_chung_nang_luc de HONEST-NULL co chu dich."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "16",
        "span": "Đến Viện Di truyền nông nghiệp Việt Nam, chúng tôi được tận mắt chiêm ngưỡng những giống lúa, giống ngô, giống đậu tương... mới được tạo ra từ công nghệ chỉnh sửa gen.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_vdtnn_chinhsuagen_20251001.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'giong lua, giong ngo, giong dau tuong moi duoc tao ra tu cong nghe chinh sua gen' -> SP16 Giong cay trong vat nuoi cong nghe sinh hoc. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
    "loaiHinh": "vien",
    "nhoms": [
      "5"
    ],
    "nhomLabels": [
      "Nhóm 5 · Năng lượng và vật liệu"
    ],
    "sanPham": [],
    "capability": "phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vjst.vn",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt"
      }
    ],
    "tim": "viện hàn lâm khoa học và công nghệ việt nam vien phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh mri và dẫn truyền thuốc; phát triển vật liệu điện cực pin li-ion thế hệ mới (mos-se@gr) có hiệu suất lưu trữ cao nhóm 5 năng lượng và vật liệu",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt",
        "note": "Span dung dang rut gon 'Vien'; ten day du lay tu tieu de bai cua vjst.vn (bai viet ve Vien Han lam Khoa hoc va Cong nghe Viet Nam). Da doi tu verbatim sang normalized sau khi cong luat 3 cua Chu thau bat loi ghi nhan sai cua Tho."
      },
      {
        "field": "loai_hinh",
        "value": "vien",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt",
        "note": "Phan loai tu chinh span: span bat dau bang 'Vien phat trien...'."
      },
      {
        "field": "nhom_cncl",
        "value": "5",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt",
        "note": "Nang luong va vat lieu tien tien -> nhom 5 theo QD 21/2026 [CNCL-G05]. Anh xa nhom, khong phai quote literal so 5."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "source": "vjst.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt",
        "note": "NANG LUC CAP NGHIEN CUU (lab/pilot), chua phai day chuyen cong nghiep. Nguon goi ten PHAP NHAN ME, khong chi dich danh vien thanh vien nao."
      }
    ]
  },
  {
    "name": "Viện Khoa học-Công nghệ mật mã",
    "loaiHinh": "vien",
    "nhoms": [
      "7"
    ],
    "nhomLabels": [
      "Nhóm 7 · An ninh mạng và lượng tử"
    ],
    "sanPham": [
      "24"
    ],
    "capability": "thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nhandan.vn",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt"
      }
    ],
    "tim": "viện khoa học-công nghệ mật mã vien thuật toán chữ ký số hậu lượng tử với tên gọi vn-pqsign nhóm 7 an ninh mạng và lượng tử sp 24",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viện Khoa học-Công nghệ mật mã",
        "span": "Một trong những nội dung thu hút sự chú ý của giới khoa học là phần trình bày của nhóm nghiên cứu thuộc Viện Khoa học-Công nghệ mật mã (Ban Cơ yếu Chính phủ). Đơn vị đã giới thiệu thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": ""
      },
      {
        "field": "loai_hinh",
        "value": "vien",
        "span": "Một trong những nội dung thu hút sự chú ý của giới khoa học là phần trình bày của nhóm nghiên cứu thuộc Viện Khoa học-Công nghệ mật mã (Ban Cơ yếu Chính phủ). Đơn vị đã giới thiệu thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "Phan loai tu chinh span: span goi la 'Vien Khoa hoc-Cong nghe mat ma (Ban Co yeu Chinh phu)'."
      },
      {
        "field": "nhom_cncl",
        "value": "7",
        "span": "Một trong những nội dung thu hút sự chú ý của giới khoa học là phần trình bày của nhóm nghiên cứu thuộc Viện Khoa học-Công nghệ mật mã (Ban Cơ yếu Chính phủ). Đơn vị đã giới thiệu thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "An ninh mang va luong tu -> nhom 7 theo QD 21/2026 [CNCL-G07]. Anh xa nhom."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign",
        "span": "Một trong những nội dung thu hút sự chú ý của giới khoa học là phần trình bày của nhóm nghiên cứu thuộc Viện Khoa học-Công nghệ mật mã (Ban Cơ yếu Chính phủ). Đơn vị đã giới thiệu thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "Bai viet ten thuat toan hai cach: than bai 'VN-PQSign', phan tag 'VN-PQsign'. Lay theo than bai. Viec chuan hoa thanh TCVN va chuyen dich he thong VAN LA LO TRINH."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "24",
        "span": "Một trong những nội dung thu hút sự chú ý của giới khoa học là phần trình bày của nhóm nghiên cứu thuộc Viện Khoa học-Công nghệ mật mã (Ban Cơ yếu Chính phủ). Đơn vị đã giới thiệu thuật toán chữ ký số hậu lượng tử với tên gọi VN-PQSign.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_matma_hauluongtu_20260210.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi thuat toan chu ky so HAU LUONG TU VN-PQSign -> SP24 Cong nghe luong tu. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "Viện Vaccine và sinh phẩm y tế (IVAC)",
    "loaiHinh": "vien",
    "nhoms": [
      "4"
    ],
    "nhomLabels": [
      "Nhóm 4 · Sinh học và y sinh"
    ],
    "sanPham": [
      "10"
    ],
    "capability": "đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S)",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt"
      }
    ],
    "tim": "viện vaccine và sinh phẩm y tế (ivac) vien đã sản xuất thành công vaccine cúm a/h5n1 (ivacflu-ah5n1) và vaccine cúm mùa “3 trong 1” (ivacflu-s) nhóm 4 sinh học và y sinh sp 10",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viện Vaccine và sinh phẩm y tế (IVAC)",
        "span": "Qua 13 năm nghiên cứu, IVAC đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S) gồm cúm A/H1N1/09, A/H3N2, cúm B.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt",
        "note": "Nguon trong cau nay goi tat 'IVAC'; ten day du lay tu tieu de va than bai."
      },
      {
        "field": "loai_hinh",
        "value": "vien",
        "span": "Qua 13 năm nghiên cứu, IVAC đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S) gồm cúm A/H1N1/09, A/H3N2, cúm B.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt",
        "note": "CAN CU NAM NGOAI SPAN: span dung ten viet tat 'IVAC', khong co chu 'Vien'. Phan loai dua tren ten day du trong tieu de bai baochinhphu.vn."
      },
      {
        "field": "nhom_cncl",
        "value": "4",
        "span": "Qua 13 năm nghiên cứu, IVAC đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S) gồm cúm A/H1N1/09, A/H3N2, cúm B.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt",
        "note": "Sinh hoc va y sinh tien tien -> nhom 4 theo QD 21/2026 [CNCL-G04]. Anh xa nhom, khong phai quote literal so 4."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S)",
        "span": "Qua 13 năm nghiên cứu, IVAC đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S) gồm cúm A/H1N1/09, A/H3N2, cúm B.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt",
        "note": "Ban goc dung chu 'vaccine', khong phai 'vac xin'. Giu nguyen."
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã hoàn thành ba giai đoạn thử nghiệm lâm sàng đúng theo quy định của Bộ Y tế",
        "span": "Vaccine cúm A/H5N1 và vaccine cúm mùa do IVAC sản xuất đã hoàn thành ba giai đoạn thử nghiệm lâm sàng đúng theo quy định của Bộ Y tế; dưới sự giám sát chặt chẽ của các tổ chức độc lập quốc tế và được cấp giấy chứng nhận kết quả thí nghiệm lâm sàng.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt",
        "note": "Bai dang 16/01/2019, qua refresh_days 180 rat xa."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "10",
        "span": "Qua 13 năm nghiên cứu, IVAC đã sản xuất thành công vaccine cúm A/H5N1 (IVACFLU-AH5N1) và vaccine cúm mùa “3 trong 1” (IVACFLU-S) gồm cúm A/H1N1/09, A/H3N2, cúm B.",
        "source": "baochinhphu.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/baochinhphu_ivac_vaccine_20190116.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi vac xin cum A/H5N1 va cum mua dung cho nguoi -> SP10 Vac xin the he moi dung cho nguoi. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "VinAI",
    "loaiHinh": "",
    "nhoms": [
      "1"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số"
    ],
    "sanPham": [
      "01"
    ],
    "capability": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "tim": "vinai vinai đã lọt vào top 20 công ty toàn cầu dẫn đầu về nghiên cứu ai nhóm 1 công nghệ số sp 01",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VinAI",
        "span": "VinAI",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": "Cong nghe so -> nhom 1 [CNCL-G01-A]"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "span": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": ""
      },
      {
        "field": "san_pham_lien_quan",
        "value": "01",
        "span": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi ve mo hinh AI va xu ly ngon ngu -> SP01 LLM tieng Viet, tro ly ao, AI chuyen nganh. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "VinBigData",
    "loaiHinh": "",
    "nhoms": [
      "1"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số"
    ],
    "sanPham": [
      "1"
    ],
    "capability": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "tim": "vinbigdata tháng 8/2023, vinbigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng việt nhóm 1 công nghệ số sp 1",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VinBigData",
        "span": "VinBigData",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Bên cạnh đó, trợ lý ảo ViVi- trợ lý giọng nói thuần Việt được phát triển bởi VinBigData.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": "Cong nghe so -> nhom 1 [CNCL-G01-A] Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "Bên cạnh đó, trợ lý ảo ViVi- trợ lý giọng nói thuần Việt được phát triển bởi VinBigData.",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": "LLM/tro ly ao -> SP1 [CNCL-P01-A] Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
        "span": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": ""
      }
    ]
  },
  {
    "name": "VNPT",
    "loaiHinh": "DN",
    "nhoms": [
      "1",
      "3"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số",
      "Nhóm 3 · Robot và tự động hoá"
    ],
    "sanPham": [
      "2"
    ],
    "capability": "làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt"
      },
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "tim": "vnpt dn làm chủ hơn 40 mô hình ai xử lý ảnh phục vụ các bài toán đặc thù của việt nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ nhóm 1 công nghệ số nhóm 3 robot và tự động hoá sp 2",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VNPT",
        "span": "VNPT",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": ""
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "tập đoàn đã làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "Phan loai tu chinh span: span goi la 'tap doan'."
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "VNPT đã xây dựng loạt mô hình ngôn ngữ tiếng Việt, mô hình phân tích cảm xúc và hệ thống thị giác máy tính phục vụ giao thông, y tế và an ninh.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "Cong nghe so -> nhom 1 theo QD 21/2026 [CNCL-G01-A]"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "2",
        "span": "Đáng chú ý, VNPT từng đứng đầu một hạng mục tại hội nghị thị giác máy tính lớn ở Mỹ với giải pháp xử lý hình ảnh từ camera góc siêu rộng trên thiết bị biên, khẳng định năng lực cạnh tranh của AI “Make in Vietnam”.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": "AI camera xu ly tai bien -> SP2 [CNCL-P02-A] Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. Gia tri claim khong doi."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
        "span": "tập đoàn đã làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Các trợ lý AI của VNPT AI đã và đang hoạt động hiệu quả trong thực tiễn, phục vụ hơn 1,2 tỷ lượt yêu cầu trong toàn mạng",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": "Cong nghe so -> nhom 1 [CNCL-G01-A]"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "phục vụ hơn 1,2 tỷ lượt yêu cầu trong toàn mạng",
        "span": "Các trợ lý AI của VNPT AI đã và đang hoạt động hiệu quả trong thực tiễn, phục vụ hơn 1,2 tỷ lượt yêu cầu trong toàn mạng",
        "source": "vneconomy.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl_phu_3",
        "value": "3",
        "span": "Robot chatbot của VNPT đóng vai trò hỗ trợ người dân thực hiện thủ tục hành chính, từ đăng ký kết hôn, khai sinh, nộp thuế đến tra cứu thông tin nhà đất…",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_robot_makeinvn_20251230.txt",
        "note": "TRUONG PHU (TIP-CNCL-2D). VNPT dung o nhom 1 lam nhom chinh; day la bang chung nhom 3 robot va tu dong hoa. Muc do: robot chatbot dich vu cong da trinh dien tai Make in Viet Nam 2025."
      }
    ]
  },
  {
    "name": "VNPT Technology",
    "loaiHinh": "",
    "nhoms": [
      "2"
    ],
    "nhomLabels": [
      "Nhóm 2 · Mạng di động thế hệ sau"
    ],
    "sanPham": [
      "06"
    ],
    "capability": "đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây",
    "bestTier": "A",
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt"
      }
    ],
    "tim": "vnpt technology đang phát triển các sản phẩm cho mạng 5g phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây nhóm 2 mạng di động thế hệ sau sp 06",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VNPT Technology",
        "span": "Hiện nay VNPT Technology đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "2",
        "span": "Hiện nay VNPT Technology đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt",
        "note": "Mang di dong the he sau -> nhom 2 (Cong nghe mang di dong the he sau) theo QD 21/2026 [CNCL-G02]. Anh xa nhom, khong phai quote literal so 2."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây",
        "span": "Hiện nay VNPT Technology đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt",
        "note": "Bai dang 31/08/2022, da qua refresh_days 180 rat xa. Nguon KHONG neu ten model 5G cu the nao; muc do la DANG PHAT TRIEN, khong phai da thuong mai."
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "đã và đang phát triển và sản xuất các thiết bị truy nhập băng rộng cố định không dây dành cho các hộ gia đình, cho doanh nghiệp và cho các đô thị thông minh",
        "span": "Trên nền tảng công nghệ của Qualcomm, VNPT Technology đã và đang phát triển và sản xuất các thiết bị truy nhập băng rộng cố định không dây dành cho các hộ gia đình, cho doanh nghiệp và cho các đô thị thông minh.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "verbatim",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt",
        "note": "Thiet bi neu ten cu the trong bai thuoc 3G/4G va Wifi 4/5/6, khong phai 5G. Giu tach bach."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "06",
        "span": "Hiện nay VNPT Technology đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây.",
        "source": "mst.gov.vn",
        "tier": "A",
        "extraction": "normalized",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi 'phat trien cac san pham cho mang 5G' -> SP06 Thiet bi he thong mang 5G. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "VSAP LAB",
    "loaiHinh": "",
    "nhoms": [
      "6"
    ],
    "nhomLabels": [
      "Nhóm 6 · Chip bán dẫn"
    ],
    "sanPham": [
      "23"
    ],
    "capability": "phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại Việt Nam trong lĩnh vực đóng gói bán dẫn tiên tiến",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "nhandan.vn",
        "href": "/evidence/nhandan_vsaplab_20260816.txt"
      }
    ],
    "tim": "vsap lab phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại việt nam trong lĩnh vực đóng gói bán dẫn tiên tiến nhóm 6 chip bán dẫn sp 23",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VSAP LAB",
        "span": "Và cũng từ nguồn cảm hứng đó VSAP LAB – phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại Việt Nam trong lĩnh vực đóng gói bán dẫn tiên tiến đã được thành hình, đóng góp một mảnh ghép đầy tiềm năng vào hệ sinh thái bán dẫn Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_vsaplab_20260816.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "6",
        "span": "Và cũng từ nguồn cảm hứng đó VSAP LAB – phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại Việt Nam trong lĩnh vực đóng gói bán dẫn tiên tiến đã được thành hình, đóng góp một mảnh ghép đầy tiềm năng vào hệ sinh thái bán dẫn Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_vsaplab_20260816.txt",
        "note": "Chip ban dan -> nhom 6 (Cong nghe chip ban dan) theo QD 21/2026 [CNCL-G06]. Anh xa nhom, khong phai quote literal so 6."
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại Việt Nam trong lĩnh vực đóng gói bán dẫn tiên tiến",
        "span": "Và cũng từ nguồn cảm hứng đó VSAP LAB – phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại Việt Nam trong lĩnh vực đóng gói bán dẫn tiên tiến đã được thành hình, đóng góp một mảnh ghép đầy tiềm năng vào hệ sinh thái bán dẫn Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/nhandan_vsaplab_20260816.txt",
        "note": "MAU THUAN NGUON can theo doi: mst.gov.vn 28/01/2026 xep VSAP LAB vao nhom 'doi tac quoc te' cua FPT, trong khi nhandan mo ta la lab-fab dau tien TAI VIET NAM. Khong tu phan xu, ghi de nguoi doc thay."
      },
      {
        "field": "san_pham_lien_quan",
        "value": "23",
        "span": "Và cũng từ nguồn cảm hứng đó VSAP LAB – phòng thí nghiệm – sản xuất thử nghiệm (lab-fab) đầu tiên tại Việt Nam trong lĩnh vực đóng gói bán dẫn tiên tiến đã được thành hình, đóng góp một mảnh ghép đầy tiềm năng vào hệ sinh thái bán dẫn Việt Nam.",
        "source": "nhandan.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/nhandan_vsaplab_20260816.txt",
        "note": "TIP-2F Phan B, lam giau nen san pham. Span noi lab-fab dong goi ban dan tien tien -> SP23 Chip chuyen dung. Anh xa ma san pham theo QD 21/2026, SUY TU SPAN DA QUA CONG, khong cao them nguon."
      }
    ]
  },
  {
    "name": "XBStation",
    "loaiHinh": "",
    "nhoms": [
      "9"
    ],
    "nhomLabels": [
      "Nhóm 9 · Hàng không và vũ trụ"
    ],
    "sanPham": [
      "22"
    ],
    "capability": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "tim": "xbstation uav giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg nhóm 9 hàng không và vũ trụ sp 22",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "XBStation",
        "span": "XBStation",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> SP22 / nhom 9 [CNCL-P22-A]"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": "UAV -> SP22 / nhom 9 [CNCL-P22-A]"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "span": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "source": "cafef.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/cafef_dn_uav_20250903.txt",
        "note": ""
      }
    ]
  },
  {
    "name": "Zalo",
    "loaiHinh": "",
    "nhoms": [
      "1"
    ],
    "nhomLabels": [
      "Nhóm 1 · Công nghệ số"
    ],
    "sanPham": [
      "1"
    ],
    "capability": "",
    "bestTier": "B",
    "favorsRtr": false,
    "sources": [
      {
        "source": "vnanet.vn",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      }
    ],
    "tim": "zalo nhóm 1 công nghệ số sp 1",
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Zalo",
        "span": "các doanh nghiệp Viettel, VNPT, VinAI, Zalo đang phát triển mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vnanet.vn",
        "tier": "B",
        "extraction": "verbatim",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt",
        "note": ""
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "các doanh nghiệp Viettel, VNPT, VinAI, Zalo đang phát triển mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vnanet.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt",
        "note": "Cong nghe so -> nhom 1 [CNCL-G01-A]"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "các doanh nghiệp Viettel, VNPT, VinAI, Zalo đang phát triển mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vnanet.vn",
        "tier": "B",
        "extraction": "normalized",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt",
        "note": "LLM/tro ly ao -> SP1 [CNCL-P01-A]"
      }
    ]
  }
];

export const cnclNeeds: CnclNeed[] = [
  {
    "id": "CNCL-P01",
    "entityId": "CNCL-P01 · nhu cầu quốc gia",
    "value": "Mô hình ngôn ngữ lớn tiếng Việt, trợ lý ảo và trí tuệ nhân tạo (AI) chuyên ngành",
    "span": "Mô hình ngôn ngữ lớn tiếng Việt, trợ lý ảo và trí tuệ nhân tạo (AI) chuyên ngành",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p01 mô hình ngôn ngữ lớn tiếng việt, trợ lý ảo và trí tuệ nhân tạo (ai) chuyên ngành"
  },
  {
    "id": "CNCL-P02",
    "entityId": "CNCL-P02 · nhu cầu quốc gia",
    "value": "AI camera xử lý tại biên",
    "span": "AI camera xử lý tại biên",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p02 ai camera xử lý tại biên"
  },
  {
    "id": "CNCL-P03",
    "entityId": "CNCL-P03 · nhu cầu quốc gia",
    "value": "Nền tảng bản sao số",
    "span": "Nền tảng bản sao số",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p03 nền tảng bản sao số"
  },
  {
    "id": "CNCL-P04",
    "entityId": "CNCL-P04 · nhu cầu quốc gia",
    "value": "Nền tảng điện toán đám mây",
    "span": "Nền tảng điện toán đám mây",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p04 nền tảng điện toán đám mây"
  },
  {
    "id": "CNCL-P05",
    "entityId": "CNCL-P05 · nhu cầu quốc gia",
    "value": "Hạ tầng mạng chuỗi khối và hệ thống truy xuất nguồn gốc",
    "span": "Hạ tầng mạng chuỗi khối và hệ thống truy xuất nguồn gốc",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p05 hạ tầng mạng chuỗi khối và hệ thống truy xuất nguồn gốc"
  },
  {
    "id": "CNCL-P06",
    "entityId": "CNCL-P06 · nhu cầu quốc gia",
    "value": "Thiết bị và hệ thống mạng di động 5G/5G-Advanced",
    "span": "Thiết bị và hệ thống mạng di động 5G/5G-Advanced",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p06 thiết bị và hệ thống mạng di động 5g/5g-advanced"
  },
  {
    "id": "CNCL-P07",
    "entityId": "CNCL-P07 · nhu cầu quốc gia",
    "value": "Robot di động tự hành và robot công nghiệp",
    "span": "Robot di động tự hành và robot công nghiệp",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p07 robot di động tự hành và robot công nghiệp"
  },
  {
    "id": "CNCL-P08",
    "entityId": "CNCL-P08 · nhu cầu quốc gia",
    "value": "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh",
    "span": "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p08 nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh"
  },
  {
    "id": "CNCL-P09",
    "entityId": "CNCL-P09 · nhu cầu quốc gia",
    "value": "Giải pháp bảo mật và an ninh mạng cho hạ tầng quan trọng và cơ sở dữ liệu quốc gia",
    "span": "Giải pháp bảo mật và an ninh mạng cho hạ tầng quan trọng và cơ sở dữ liệu quốc gia",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p09 giải pháp bảo mật và an ninh mạng cho hạ tầng quan trọng và cơ sở dữ liệu quốc gia"
  },
  {
    "id": "CNCL-P10",
    "entityId": "CNCL-P10 · nhu cầu quốc gia",
    "value": "Vắc xin thế hệ mới dùng cho người",
    "span": "Vắc xin thế hệ mới dùng cho người",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p10 vắc xin thế hệ mới dùng cho người"
  },
  {
    "id": "CNCL-P11",
    "entityId": "CNCL-P11 · nhu cầu quốc gia",
    "value": "Liệu pháp tế bào (tế bào gốc, tế bào miễn dịch) dùng cho người",
    "span": "Liệu pháp tế bào (tế bào gốc, tế bào miễn dịch) dùng cho người",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p11 liệu pháp tế bào (tế bào gốc, tế bào miễn dịch) dùng cho người"
  },
  {
    "id": "CNCL-P12",
    "entityId": "CNCL-P12 · nhu cầu quốc gia",
    "value": "Hệ thống sản xuất sản phẩm y tế cá thể hóa ứng dụng công nghệ in 3D",
    "span": "Hệ thống sản xuất sản phẩm y tế cá thể hóa ứng dụng công nghệ in 3D",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p12 hệ thống sản xuất sản phẩm y tế cá thể hóa ứng dụng công nghệ in 3d"
  },
  {
    "id": "CNCL-P13",
    "entityId": "CNCL-P13 · nhu cầu quốc gia",
    "value": "Hệ thống cảm biến sinh học thông minh",
    "span": "Hệ thống cảm biến sinh học thông minh",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p13 hệ thống cảm biến sinh học thông minh"
  },
  {
    "id": "CNCL-P14",
    "entityId": "CNCL-P14 · nhu cầu quốc gia",
    "value": "Vắc xin và chế phẩm sinh học thế hệ mới dùng trong chăn nuôi, thú y, thủy sản, trồng trọt và bảo vệ thực vật",
    "span": "Vắc xin và chế phẩm sinh học thế hệ mới dùng trong chăn nuôi, thú y, thủy sản, trồng trọt và bảo vệ thực vật",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p14 vắc xin và chế phẩm sinh học thế hệ mới dùng trong chăn nuôi, thú y, thủy sản, trồng trọt và bảo vệ thực vật"
  },
  {
    "id": "CNCL-P15",
    "entityId": "CNCL-P15 · nhu cầu quốc gia",
    "value": "Hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối",
    "span": "Hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p15 hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối"
  },
  {
    "id": "CNCL-P16",
    "entityId": "CNCL-P16 · nhu cầu quốc gia",
    "value": "Giống cây trồng, vật nuôi, thủy sản thế hệ mới được tạo ra từ công nghệ tế bào, chỉnh sửa gen và công nghệ sinh học",
    "span": "Giống cây trồng, vật nuôi, thủy sản thế hệ mới được tạo ra từ công nghệ tế bào, chỉnh sửa gen và công nghệ sinh học",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p16 giống cây trồng, vật nuôi, thủy sản thế hệ mới được tạo ra từ công nghệ tế bào, chỉnh sửa gen và công nghệ sinh học"
  },
  {
    "id": "CNCL-P17",
    "entityId": "CNCL-P17 · nhu cầu quốc gia",
    "value": "Vật liệu tiên tiến và vật liệu chức năng hiệu năng cao cho công nghiệp chế biến, chế tạo",
    "span": "Vật liệu tiên tiến và vật liệu chức năng hiệu năng cao cho công nghiệp chế biến, chế tạo",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p17 vật liệu tiên tiến và vật liệu chức năng hiệu năng cao cho công nghiệp chế biến, chế tạo"
  },
  {
    "id": "CNCL-P18",
    "entityId": "CNCL-P18 · nhu cầu quốc gia",
    "value": "Pin, ắc quy tiên tiến và hệ thống tích trữ năng lượng tích hợp (BESS)",
    "span": "Pin, ắc quy tiên tiến và hệ thống tích trữ năng lượng tích hợp (BESS)",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p18 pin, ắc quy tiên tiến và hệ thống tích trữ năng lượng tích hợp (bess)"
  },
  {
    "id": "CNCL-P19",
    "entityId": "CNCL-P19 · nhu cầu quốc gia",
    "value": "Hệ thống sản xuất, lưu trữ, vận chuyển và phân phối hydrogen xanh, nhiên liệu sinh học",
    "span": "Hệ thống sản xuất, lưu trữ, vận chuyển và phân phối hydrogen xanh, nhiên liệu sinh học",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p19 hệ thống sản xuất, lưu trữ, vận chuyển và phân phối hydrogen xanh, nhiên liệu sinh học"
  },
  {
    "id": "CNCL-P20",
    "entityId": "CNCL-P20 · nhu cầu quốc gia",
    "value": "Thiết bị điện cao áp, siêu cao áp; máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
    "span": "Thiết bị điện cao áp, siêu cao áp; máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p20 thiết bị điện cao áp, siêu cao áp; máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao"
  },
  {
    "id": "CNCL-P21",
    "entityId": "CNCL-P21 · nhu cầu quốc gia",
    "value": "Hệ thống thu giữ, sử dụng và lưu trữ carbon",
    "span": "Hệ thống thu giữ, sử dụng và lưu trữ carbon",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p21 hệ thống thu giữ, sử dụng và lưu trữ carbon"
  },
  {
    "id": "CNCL-P22",
    "entityId": "CNCL-P22 · nhu cầu quốc gia",
    "value": "Thiết bị, phương tiện bay không người lái (UAV); hệ thống quản lý, phát hiện, giám sát và chế áp UAV",
    "span": "Thiết bị, phương tiện bay không người lái (UAV); hệ thống quản lý, phát hiện, giám sát và chế áp UAV",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p22 thiết bị, phương tiện bay không người lái (uav); hệ thống quản lý, phát hiện, giám sát và chế áp uav"
  },
  {
    "id": "CNCL-P23",
    "entityId": "CNCL-P23 · nhu cầu quốc gia",
    "value": "Chip chuyên dụng",
    "span": "Chip chuyên dụng",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p23 chip chuyên dụng"
  },
  {
    "id": "CNCL-P24",
    "entityId": "CNCL-P24 · nhu cầu quốc gia",
    "value": "Truyền thông lượng tử, tính toán lượng tử và cảm biến lượng tử",
    "span": "Truyền thông lượng tử, tính toán lượng tử và cảm biến lượng tử",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p24 truyền thông lượng tử, tính toán lượng tử và cảm biến lượng tử"
  },
  {
    "id": "CNCL-P25",
    "entityId": "CNCL-P25 · nhu cầu quốc gia",
    "value": "Hệ thống khai thác, chế biến sâu và sản phẩm chế biến sâu từ khoáng sản, dầu khí và đất hiếm",
    "span": "Hệ thống khai thác, chế biến sâu và sản phẩm chế biến sâu từ khoáng sản, dầu khí và đất hiếm",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p25 hệ thống khai thác, chế biến sâu và sản phẩm chế biến sâu từ khoáng sản, dầu khí và đất hiếm"
  },
  {
    "id": "CNCL-P26",
    "entityId": "CNCL-P26 · nhu cầu quốc gia",
    "value": "Hệ thống, thiết bị, dịch vụ và giải pháp công nghệ thăm dò lòng đất, biển sâu, công trình biển và năng lượng ngoài khơi",
    "span": "Hệ thống, thiết bị, dịch vụ và giải pháp công nghệ thăm dò lòng đất, biển sâu, công trình biển và năng lượng ngoài khơi",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p26 hệ thống, thiết bị, dịch vụ và giải pháp công nghệ thăm dò lòng đất, biển sâu, công trình biển và năng lượng ngoài khơi"
  },
  {
    "id": "CNCL-P27",
    "entityId": "CNCL-P27 · nhu cầu quốc gia",
    "value": "Lò phản ứng hạt nhân mô-đun nhỏ (SMR)",
    "span": "Lò phản ứng hạt nhân mô-đun nhỏ (SMR)",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p27 lò phản ứng hạt nhân mô-đun nhỏ (smr)"
  },
  {
    "id": "CNCL-P28",
    "entityId": "CNCL-P28 · nhu cầu quốc gia",
    "value": "Vệ tinh và chùm vệ tinh quỹ đạo thấp quan sát Trái đất",
    "span": "Vệ tinh và chùm vệ tinh quỹ đạo thấp quan sát Trái đất",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p28 vệ tinh và chùm vệ tinh quỹ đạo thấp quan sát trái đất"
  },
  {
    "id": "CNCL-P29",
    "entityId": "CNCL-P29 · nhu cầu quốc gia",
    "value": "Công trình xây dựng đường sắt tốc độ cao",
    "span": "Công trình xây dựng đường sắt tốc độ cao",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p29 công trình xây dựng đường sắt tốc độ cao"
  },
  {
    "id": "CNCL-P30",
    "entityId": "CNCL-P30 · nhu cầu quốc gia",
    "value": "Nền tảng công nghiệp, phương tiện, thiết bị và các hệ thống tích hợp đường sắt tốc độ cao, đường sắt đô thị",
    "span": "Nền tảng công nghiệp, phương tiện, thiết bị và các hệ thống tích hợp đường sắt tốc độ cao, đường sắt đô thị",
    "tier": "A",
    "source": "baochinhphu.vn",
    "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt",
    "chinhThuc": true,
    "tim": "cncl-p30 nền tảng công nghiệp, phương tiện, thiết bị và các hệ thống tích hợp đường sắt tốc độ cao, đường sắt đô thị"
  }
];
