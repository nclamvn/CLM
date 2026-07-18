// AUTO-GENERATED tu CNCLData/domains/don_vi_cncl · chup 2026-07-18 · KHONG sua tay.
// Chieu CUNG that, moi o truy ve snapshot trong public/evidence. Match o Hub van DEMO.

export type CnclTier = 'A' | 'B' | 'C';
export type CnclEvidence = { field: string; value: string; span: string; source: string; tier: CnclTier; href: string };
export type CnclSource = { source: string; href: string };
export type CnclUnit = {
  name: string; loaiHinh: string; nhom: string; nhomLabel: string; sanPham: string;
  capability: string; bestTier: CnclTier; corroborated: boolean; favorsRtr: boolean;
  sources: CnclSource[]; evidence: CnclEvidence[];
};

export const cnclMeta = {
  "units": 14,
  "claims": 64,
  "sources": 7,
  "corroboratedCells": 2,
  "gate": "refinery exit 0 · bites moi rang CAN",
  "generatedAt": "2026-07-18",
  "frame": "QD 21/2026/QD-TTg",
  "note": "Snapshot thuc te tu CNCLData/domains/don_vi_cncl. Chieu CUNG. Chua co chieu CAU nen match van la DEMO."
} as const;

export const cnclUnits: CnclUnit[] = [
  {
    "name": "FPT",
    "loaiHinh": "",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "1",
    "capability": "Hệ sinh thái AI Agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng.",
    "bestTier": "A",
    "corroborated": true,
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "source": "vnanet.vn",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      },
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "FPT",
        "span": "FPT",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "FPT tiếp tục triển khai hai trụ cột chiến lược là siêu trung tâm tính toán FPT AI Factory và nền tảng trợ lý ảo FPT AI Agents.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Nền tảng AI toàn diện đầu tiên ở Việt Nam - FPT.AI năm 2017",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "FPT tiếp tục triển khai hai trụ cột chiến lược là siêu trung tâm tính toán FPT AI Factory và nền tảng trợ lý ảo FPT AI Agents.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Hệ sinh thái AI Agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng.",
        "span": "Hệ sinh thái AI Agents hiện xử lý hơn 17 triệu cuộc gọi mỗi tháng và tự động hóa tới 98% yêu cầu khách hàng.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Tập đoàn FPT hợp tác với Tập đoàn NVIDIA đầu tư khoảng 200 triệu USD xây dựng Nhà máy trí tuệ nhân tạo, cung cấp hạ tầng tính toán và trên 20 sản phẩm AI tạo sinh",
        "span": "Tập đoàn FPT hợp tác với Tập đoàn NVIDIA đầu tư khoảng 200 triệu USD xây dựng Nhà máy trí tuệ nhân tạo, cung cấp hạ tầng tính toán và trên 20 sản phẩm AI tạo sinh",
        "source": "vnanet.vn",
        "tier": "B",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      }
    ]
  },
  {
    "name": "Tập đoàn Viettel",
    "loaiHinh": "",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "1",
    "capability": "Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "vjst.vn",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Tập đoàn Viettel",
        "span": "Tập đoàn Viettel",
        "source": "vjst.vn",
        "tier": "B",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token",
        "source": "vjst.vn",
        "tier": "B",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "Dịch vụ LLM hỗ trợ tiếng Việt truy cập thông qua API",
        "source": "vjst.vn",
        "tier": "B",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Bộ TT&TT giao Tập đoàn Viettel phát triển Mô hình ngôn ngữ lớn Tiếng Việt và công cụ trợ lý ảo cho cán bộ, công chức",
        "span": "Bộ TT&TT giao Tập đoàn Viettel phát triển Mô hình ngôn ngữ lớn Tiếng Việt và công cụ trợ lý ảo cho cán bộ, công chức",
        "source": "vjst.vn",
        "tier": "B",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token",
        "span": "Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token",
        "source": "vjst.vn",
        "tier": "B",
        "href": "/evidence/vjst_viettel_llm_20260718.txt"
      }
    ]
  },
  {
    "name": "VNPT",
    "loaiHinh": "DN",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "2",
    "capability": "làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
    "bestTier": "A",
    "corroborated": true,
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VNPT",
        "span": "VNPT",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "tập đoàn đã làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "VNPT đã xây dựng loạt mô hình ngôn ngữ tiếng Việt, mô hình phân tích cảm xúc và hệ thống thị giác máy tính phục vụ giao thông, y tế và an ninh.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Các trợ lý AI của VNPT AI đã và đang hoạt động hiệu quả trong thực tiễn, phục vụ hơn 1,2 tỷ lượt yêu cầu trong toàn mạng",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "2",
        "span": "VNPT từng đứng đầu một hạng mục tại hội nghị thị giác máy tính lớn ở Mỹ với giải pháp xử lý hình ảnh từ camera góc siêu rộng trên thiết bị biên.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
        "span": "tập đoàn đã làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù của Việt Nam như nhận diện biển số, phát hiện vi phạm giao thông hay giám sát cháy nổ",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "phục vụ hơn 1,2 tỷ lượt yêu cầu trong toàn mạng",
        "span": "Các trợ lý AI của VNPT AI đã và đang hoạt động hiệu quả trong thực tiễn, phục vụ hơn 1,2 tỷ lượt yêu cầu trong toàn mạng",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ]
  },
  {
    "name": "Viettel AI",
    "loaiHinh": "",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "",
    "capability": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
    "bestTier": "A",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "mst.gov.vn",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viettel AI",
        "span": "Viettel AI",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Viettel AI cũng cho thấy vai trò tiên phong khi tập trung vào nghiên cứu công nghệ lõi, phát triển ứng dụng trong các lĩnh vực trọng điểm và đào tạo nguồn nhân lực chất lượng cao.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
        "span": "giải pháp ClaimPKG, công nghệ kiểm chứng thông tin tự động được đánh giá có tính ứng dụng rộng.",
        "source": "mst.gov.vn",
        "tier": "A",
        "href": "/evidence/mst_gov_ai_diemsang_20260718.txt"
      }
    ]
  },
  {
    "name": "VinAI",
    "loaiHinh": "",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "",
    "capability": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VinAI",
        "span": "VinAI",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "span": "VinAI đã lọt vào Top 20 công ty toàn cầu dẫn đầu về nghiên cứu AI",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ]
  },
  {
    "name": "VinBigData",
    "loaiHinh": "",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "1",
    "capability": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "VinBigData",
        "span": "VinBigData",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "Trợ lý ảo ViVi - trợ lý giọng nói thuần Việt được phát triển bởi VinBigData",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "Trợ lý ảo ViVi - trợ lý giọng nói thuần Việt được phát triển bởi VinBigData",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
        "span": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vneconomy.vn",
        "tier": "B",
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ]
  },
  {
    "name": "Zalo",
    "loaiHinh": "",
    "nhom": "1",
    "nhomLabel": "Nhom 1 · Cong nghe so",
    "sanPham": "1",
    "capability": "",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "vnanet.vn",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Zalo",
        "span": "các doanh nghiệp Viettel, VNPT, VinAI, Zalo đang phát triển mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vnanet.vn",
        "tier": "B",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "1",
        "span": "các doanh nghiệp Viettel, VNPT, VinAI, Zalo đang phát triển mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vnanet.vn",
        "tier": "B",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "1",
        "span": "các doanh nghiệp Viettel, VNPT, VinAI, Zalo đang phát triển mô hình ngôn ngữ lớn tiếng Việt",
        "source": "vnanet.vn",
        "tier": "B",
        "href": "/evidence/vnanet_hesinhthai_ai_20260718.txt"
      }
    ]
  },
  {
    "name": "CT Group",
    "loaiHinh": "DN",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "ký được hợp đồng xuất khẩu tới 5.000 UAV ra thị trường quốc tế (Hàn Quốc)",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "tapchikinhtetaichinh.vn",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "CT Group",
        "span": "CT Group",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "CT Group - một doanh nghiệp đa ngành",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "chiến lược phát triển UAV 'Make in Vietnam' từ năm 2016",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "chiến lược phát triển UAV 'Make in Vietnam' từ năm 2016",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "ký được hợp đồng xuất khẩu tới 5.000 UAV ra thị trường quốc tế (Hàn Quốc)",
        "span": "một công ty Việt Nam ký được hợp đồng xuất khẩu tới 5.000 UAV ra thị trường quốc tế (Hàn Quốc)",
        "source": "tapchikinhtetaichinh.vn",
        "tier": "B",
        "href": "/evidence/tapchikttc_uav_tongquan_20260718.txt"
      }
    ]
  },
  {
    "name": "HTI Technology",
    "loaiHinh": "",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "HTI Technology",
        "span": "HTI Technology",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
        "span": "Horus P02 với khả năng hoạt động yên lặt và trang bị cảm biến nhiệt",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ]
  },
  {
    "name": "MiSmart",
    "loaiHinh": "",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "MiSmart",
        "span": "MiSmart",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "Drone Việt vì người Việt; giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "Drone Việt vì người Việt; giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
        "span": "Drone Việt vì người Việt; giải quyết các bài toán thực tế về phun thuốc, gieo sạ cho nhà nông",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ]
  },
  {
    "name": "Phenikaa-X",
    "loaiHinh": "",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Phenikaa-X",
        "span": "Phenikaa-X",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
        "span": "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ]
  },
  {
    "name": "Realtime Robotics (RtR)",
    "loaiHinh": "DN",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": true,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Realtime Robotics (RtR)",
        "span": "Realtime Robotics (RtR)",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "Sáng lập bởi Tiến sĩ Lương Việt Quốc",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Sản phẩm đã được cấp bằng sáng chế tại Mỹ, Úc và được sử dụng bởi Phòng thí nghiệm Quốc gia Los Alamos (Mỹ) và lực lượng cảnh sát Mỹ, Hà Lan",
        "span": "Sản phẩm đã được cấp bằng sáng chế tại Mỹ, Úc và được sử dụng bởi Phòng thí nghiệm Quốc gia Los Alamos (Mỹ) và lực lượng cảnh sát Mỹ, Hà Lan",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "span": "Drone Hera ra đời với khả năng gập gọn, mang tải trọng 15 kg, có thể bay 56 phút khi không tải",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ]
  },
  {
    "name": "Viettel High Tech",
    "loaiHinh": "DN",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "Với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, VU-R70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ",
    "bestTier": "B",
    "corroborated": false,
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
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "Viettel High Tech",
        "span": "Viettel High Tech",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "loai_hinh",
        "value": "DN",
        "span": "Tổng công ty Công nghiệp Công nghệ cao Viettel",
        "source": "nhandan.vn",
        "tier": "B",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "UAV trinh sát, UAV cảm tử và UAV đa năng",
        "source": "nhandan.vn",
        "tier": "B",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "UAV trinh sát, UAV cảm tử và UAV đa năng",
        "source": "nhandan.vn",
        "tier": "B",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt"
      },
      {
        "field": "bang_chung_nang_luc",
        "value": "Tất cả các sản phẩm UAV này Viettel đều làm chủ công nghệ, tự nghiên cứu, phát triển và chế tạo trong nước 100%",
        "span": "Tất cả các sản phẩm UAV này Viettel đều làm chủ công nghệ, tự nghiên cứu, phát triển và chế tạo trong nước 100%",
        "source": "nhandan.vn",
        "tier": "B",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "Với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, VU-R70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ",
        "span": "Với sải cánh 3,1m, chiều dài 1,7m và trọng lượng cất cánh tối đa 26kg, VU-R70 có thể hoạt động liên tục trong 4,5 giờ và đạt tốc độ tối đa 120km/giờ",
        "source": "nhandan.vn",
        "tier": "B",
        "href": "/evidence/nhandan_uav_madeinvn_20260718.txt"
      }
    ]
  },
  {
    "name": "XBStation",
    "loaiHinh": "",
    "nhom": "9",
    "nhomLabel": "Nhom 9 · Hang khong vu tru",
    "sanPham": "22",
    "capability": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
    "bestTier": "B",
    "corroborated": false,
    "favorsRtr": false,
    "sources": [
      {
        "source": "cafef.vn",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ],
    "evidence": [
      {
        "field": "ten_don_vi",
        "value": "XBStation",
        "span": "XBStation",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nhom_cncl",
        "value": "9",
        "span": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "san_pham_lien_quan",
        "value": "22",
        "span": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      },
      {
        "field": "nang_luc_mo_ta",
        "value": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "span": "UAV giao hàng có khả năng vận chuyển kiện hàng nặng tới 6,5 kg",
        "source": "cafef.vn",
        "tier": "B",
        "href": "/evidence/cafef_dn_uav_20250903.txt"
      }
    ]
  }
];
