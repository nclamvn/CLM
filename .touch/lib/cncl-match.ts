// AUTO-GENERATED boi scripts/gen-cncl-data.mjs · 2026-10-02 · KHONG sua tay.
// Nguon: CaoLocMatch/out/matches.jsonl + signoff_ledger.jsonl
// Sua o day se bi ghi de lan chay ke. Muon doi noi dung thi sua registry goc roi sinh lai.

import type { CnclTier } from './cncl-registry';

export type MatchEvidence = {
  field: string; value: string; span: string; tier: CnclTier;
  extraction: string; source: string; href: string;
};
export type SignedMatch = {
  id: string; score: number; rule: string; engine: string;
  demandId: string; supplyId: string;
  nhomCau: number | null; nhomCung: number[]; quaChuoiGiaTri: boolean; tokenGiao: string[];
  tokenCau: string[];
  canhChuoi: { tu: number; den: number; lyDo: string; trangThai: string } | null;
  signoff: { by: string; role: string; date: string };
  khoaBangChung: string | null;
  chuaDuyet: string[];
  soChuoi: number;
  demandEvidence: MatchEvidence[]; supplyEvidence: MatchEvidence[];
  unverified: string[];
};
export type RejectedPair = {
  demandId: string; supplyId: string; by: string; date: string; lyDo: string;
};

export const matchMeta = {
  "daKy": 24,
  "tuChoi": 1,
  "tongChay": 24,
  "rule": "anchor_group_overlap_v2",
  "nguoiKy": "Lam Nguyen",
  "generatedAt": "2026-10-02",
  "congThuc": {
    "wGiao": 0.7,
    "wTier": 0.2,
    "wDiaDiem": 0.1,
    "tierW": {
      "A": 1,
      "B": 0.75,
      "C": 0.3
    },
    "nguongGiao": 0.5
  }
} as const;

export const signedMatches: SignedMatch[] = [
  {
    "id": "MATCH-0001",
    "score": 0.83,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P03 · nhu cầu quốc gia",
    "supplyId": "Viettel AI",
    "nhomCau": 1,
    "nhomCung": [
      1
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "bản",
      "sao"
    ],
    "tokenCau": [
      "bản",
      "sao"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "a71bec0b49bb8c8c",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Nền tảng bản sao số",
        "span": "Nền tảng bản sao số",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability_2",
        "value": "Viettel BTS Digital Twin - nền tảng bản sao số do Viettel AI phát triển",
        "span": "Viettel vừa được xướng tên tại Giải thưởng Viễn thông Toàn cầu 2025 (Glotel Awards) ở hạng mục \"Dự án chuyển đổi số xuất sắc nhất\" với giải pháp Viettel BTS Digital Twin - nền tảng bản sao số do Viettel AI phát triển.",
        "tier": "C",
        "extraction": "verbatim",
        "source": "thanhnien.vn",
        "href": "/evidence/thanhnien_viettel_ai_bts_digital_twin_20251219.txt"
      }
    ],
    "unverified": [
      "CAN CU CHINH o muc claim: de o muc claim, khong phoi nhu su that cung (FACT-7475bda683)"
    ]
  },
  {
    "id": "MATCH-0002",
    "score": 0.53,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P07 · nhu cầu quốc gia",
    "supplyId": "ROSTEK",
    "nhomCau": 3,
    "nhomCung": [
      3
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "hành",
      "động"
    ],
    "tokenCau": [
      "hành",
      "nghiệp",
      "robot",
      "động"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Robot di động tự hành và robot công nghiệp",
        "span": "Robot di động tự hành và robot công nghiệp",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa",
        "span": "ROSTEK AGV là sản phẩm xe tự hành dẫn đường chủ động, cho phép vận chuyển, nâng, kéo và chở hàng hóa, đáp ứng nhu cầu nhiều ngành nghề khác nhau.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vjst.vn",
        "href": "/evidence/vjst_rostek_agv_20220103.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0004",
    "score": 0.6,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P08 · nhu cầu quốc gia",
    "supplyId": "VTI Solutions",
    "nhomCau": 3,
    "nhomCung": [
      3
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "hình",
      "xuất"
    ],
    "tokenCau": [
      "hình",
      "phục",
      "xuất"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "620639fff901b4a6",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh",
        "span": "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Tại Lễ công bố và trao giải Sao Khuê 2024 cho sản phẩm xuất sắc của ngành phần mềm, CNTT Việt Nam, sản phẩm Hệ thống điều hành sản xuất MES-X của VTI Solutions trực thuộc VTI Group đã vinh dự nằm trong top 10 đầy ấn tượng, từ đó càng khẳng định năng lực cốt lõi của VTI Solutions trong việc triển khai các giải pháp công nghệ và dịch vụ xuất sắc đồng hành cùng với tiến trình chuyển đổi số quốc gia, đặc biệt là thúc đẩy mô hình nhà máy không giấy tờ.",
        "span": "Tại Lễ công bố và trao giải Sao Khuê 2024 cho sản phẩm xuất sắc của ngành phần mềm, CNTT Việt Nam, sản phẩm Hệ thống điều hành sản xuất MES-X của VTI Solutions trực thuộc VTI Group đã vinh dự nằm trong top 10 đầy ấn tượng, từ đó càng khẳng định năng lực cốt lõi của VTI Solutions trong việc triển khai các giải pháp công nghệ và dịch vụ xuất sắc đồng hành cùng với tiến trình chuyển đổi số quốc gia, đặc biệt là thúc đẩy mô hình nhà máy không giấy tờ.",
        "tier": "C",
        "extraction": "verbatim",
        "source": "vti-solutions.vn",
        "href": "/evidence/vtisolutions_mesx_saokhue_20240413.txt"
      }
    ],
    "unverified": [
      "de o muc claim, khong phoi nhu su that cung (FACT-53918c00a1)",
      "CAN CU CHINH o muc claim: de o muc claim, khong phoi nhu su that cung (FACT-62bb0ea2a8)",
      "de o muc claim, khong phoi nhu su that cung (FACT-8cf7026efa)",
      "de o muc claim, khong phoi nhu su that cung (FACT-bc10662544)",
      "de o muc claim, khong phoi nhu su that cung (FACT-eadc22ca5b)"
    ]
  },
  {
    "id": "MATCH-0005",
    "score": 0.78,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P11 · nhu cầu quốc gia",
    "supplyId": "Viện nghiên cứu Tế bào gốc và Công nghệ Gen Vinmec",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "bào",
      "dịch",
      "gốc",
      "liệu",
      "miễn",
      "người"
    ],
    "tokenCau": [
      "bào",
      "dùng",
      "dịch",
      "gốc",
      "liệu",
      "miễn",
      "người"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "a20da1b6c065b17f",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Liệu pháp tế bào (tế bào gốc, tế bào miễn dịch) dùng cho người",
        "span": "Liệu pháp tế bào (tế bào gốc, tế bào miễn dịch) dùng cho người",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Sau quá trình đánh giá chuyên môn, người bệnh được lựa chọn tham gia chương trình nghiên cứu thử nghiệm lâm sàng điều trị Lupus ban đỏ hệ thống bằng liệu pháp tế bào miễn dịch CAR-T do Viện Nghiên cứu Tế bào gốc và Công nghệ gen Vinmec triển khai, phối hợp cùng Khoa Huyết học Bệnh viện Đa khoa Vinmec Smart City và Khoa Miễn dịch - Dị ứng Bệnh viện Đa khoa Quốc tế Vinmec Times City.",
        "span": "Sau quá trình đánh giá chuyên môn, người bệnh được lựa chọn tham gia chương trình nghiên cứu thử nghiệm lâm sàng điều trị Lupus ban đỏ hệ thống bằng liệu pháp tế bào miễn dịch CAR-T do Viện Nghiên cứu Tế bào gốc và Công nghệ gen Vinmec triển khai, phối hợp cùng Khoa Huyết học Bệnh viện Đa khoa Vinmec Smart City và Khoa Miễn dịch - Dị ứng Bệnh viện Đa khoa Quốc tế Vinmec Times City.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "baodautu.vn",
        "href": "/evidence/baodautu_car_t_lupus_vinmec_20260721.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0006",
    "score": 0.9,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P13 · nhu cầu quốc gia",
    "supplyId": "Viện Khoa học và Công nghệ Việt Nam - Hàn Quốc (VKIST)",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "biến",
      "cảm",
      "học",
      "sinh"
    ],
    "tokenCau": [
      "biến",
      "cảm",
      "học",
      "sinh"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "ab1bafdccbd04d7b",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hệ thống cảm biến sinh học thông minh",
        "span": "Hệ thống cảm biến sinh học thông minh",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Viện Khoa học và Công nghệ Việt Nam - Hàn Quốc (VKIST) vừa tổ chức nghiệm thu chính thức cấp Bộ đối với nhiệm vụ khoa học “Phát triển công nghệ plasma lạnh phủ vật liệu chức năng lên chíp sinh học gắn trên da ứng dụng theo dõi sức khỏe”. Đây là đề tài do VKIST chủ trì, nhằm tạo nền tảng công nghệ cho các thiết bị cảm biến y sinh thông minh, hỗ trợ theo dõi sức khỏe liên tục và không xâm lấn.",
        "span": "Viện Khoa học và Công nghệ Việt Nam - Hàn Quốc (VKIST) vừa tổ chức nghiệm thu chính thức cấp Bộ đối với nhiệm vụ khoa học “Phát triển công nghệ plasma lạnh phủ vật liệu chức năng lên chíp sinh học gắn trên da ứng dụng theo dõi sức khỏe”. Đây là đề tài do VKIST chủ trì, nhằm tạo nền tảng công nghệ cho các thiết bị cảm biến y sinh thông minh, hỗ trợ theo dõi sức khỏe liên tục và không xâm lấn.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_vkist_chip_sinh_hoc_gan_da_20250718.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0007",
    "score": 0.55,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P13 · nhu cầu quốc gia",
    "supplyId": "Viện Khoa học vật liệu",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "biến",
      "cảm"
    ],
    "tokenCau": [
      "biến",
      "cảm",
      "học",
      "sinh"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "85c637eeed52a860",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hệ thống cảm biến sinh học thông minh",
        "span": "Hệ thống cảm biến sinh học thông minh",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Trên cơ sở tích hợp hệ vi lưu tích hợp cảm biến điện hóa và từ trường, đã phát hiện thành công chỉ dấu ung thư (CarcinoEmbryonic Antigen, CEA), ngưỡng giới hạn phát hiện là 150 pg/ml.",
        "span": "Trên cơ sở tích hợp hệ vi lưu tích hợp cảm biến điện hóa và từ trường, đã phát hiện thành công chỉ dấu ung thư (CarcinoEmbryonic Antigen, CEA), ngưỡng giới hạn phát hiện là 150 pg/ml.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "vast.gov.vn",
        "href": "/evidence/vast_he_vi_luu_cam_bien_dien_hoa_20170724.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0008",
    "score": 0.72,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P13 · nhu cầu quốc gia",
    "supplyId": "Công ty TNHH Công nghệ Sinh học xanh Nhật Lan",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "biến",
      "học",
      "sinh"
    ],
    "tokenCau": [
      "biến",
      "cảm",
      "học",
      "sinh"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "d727b9b125ee2d65",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hệ thống cảm biến sinh học thông minh",
        "span": "Hệ thống cảm biến sinh học thông minh",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "span": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_nam_agaricus_che_bien_sau_20251211.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0009",
    "score": 0.72,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P13 · nhu cầu quốc gia",
    "supplyId": "Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "biến",
      "học",
      "sinh"
    ],
    "tokenCau": [
      "biến",
      "cảm",
      "học",
      "sinh"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "b701fd4a3ca3abb0",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hệ thống cảm biến sinh học thông minh",
        "span": "Hệ thống cảm biến sinh học thông minh",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "span": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_nam_agaricus_che_bien_sau_20251211.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0010",
    "score": 0.53,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P18 · nhu cầu quốc gia",
    "supplyId": "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
    "nhomCau": 5,
    "nhomCung": [
      5
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "lượng",
      "năng",
      "pin",
      "trữ"
    ],
    "tokenCau": [
      "bess",
      "hợp",
      "lượng",
      "năng",
      "pin",
      "quy",
      "trữ",
      "tích"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "efccb540b69159ff",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Pin, ắc quy tiên tiến và hệ thống tích trữ năng lượng tích hợp (BESS)",
        "span": "Pin, ắc quy tiên tiến và hệ thống tích trữ năng lượng tích hợp (BESS)",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vjst.vn",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0011",
    "score": 0.53,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P05 · nhu cầu quốc gia",
    "supplyId": "Công ty 1Matrix",
    "nhomCau": 1,
    "nhomCung": [
      1
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "gốc",
      "nguồn",
      "truy",
      "xuất"
    ],
    "tokenCau": [
      "chuỗi",
      "gốc",
      "khối",
      "mạng",
      "nguồn",
      "truy",
      "tầng",
      "xuất"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "cc66a84f5d7b1826",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hạ tầng mạng chuỗi khối và hệ thống truy xuất nguồn gốc",
        "span": "Hạ tầng mạng chuỗi khối và hệ thống truy xuất nguồn gốc",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Hiện VBSN đã được tích hợp vào hệ thống truy xuất nguồn gốc của Bộ Công an và triển khai trên Nền tảng định danh Quốc gia VNeID",
        "span": "Hiện VBSN đã được tích hợp vào hệ thống truy xuất nguồn gốc của Bộ Công an và triển khai trên Nền tảng định danh Quốc gia VNeID.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "cafef.vn",
        "href": "/evidence/cafef_1matrix_vbsn_20260101.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0012",
    "score": 0.59,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P28 · nhu cầu quốc gia",
    "supplyId": "Trung tâm Vũ trụ Việt Nam",
    "nhomCau": 9,
    "nhomCung": [
      9
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "quan",
      "sát",
      "tinh",
      "trái",
      "đất"
    ],
    "tokenCau": [
      "chùm",
      "quan",
      "quỹ",
      "sát",
      "thấp",
      "tinh",
      "trái",
      "đạo",
      "đất"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "0e8723c891f9dc81",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Vệ tinh và chùm vệ tinh quỹ đạo thấp quan sát Trái đất",
        "span": "Vệ tinh và chùm vệ tinh quỹ đạo thấp quan sát Trái đất",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Việc phát triển vệ tinh NanoDragon tại Việt Nam là cột mốc lớn tiếp theo trong quá trình hướng tới mục tiêu làm chủ công nghệ vệ tinh nhỏ, tự thiết kế và chế tạo vệ tinh nhỏ quan sát trái đất trong lộ trình phát triển vệ tinh “Made in Vietnam”.",
        "span": "Việc phát triển vệ tinh NanoDragon tại Việt Nam là cột mốc lớn tiếp theo trong quá trình hướng tới mục tiêu làm chủ công nghệ vệ tinh nhỏ, tự thiết kế và chế tạo vệ tinh nhỏ quan sát trái đất trong lộ trình phát triển vệ tinh “Made in Vietnam”.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "vast.gov.vn",
        "href": "/evidence/vast_nanodragon_ttvtvn_20210311.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0013",
    "score": 0.9,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P23 · nhu cầu quốc gia",
    "supplyId": "Tập đoàn Viettel",
    "nhomCau": 6,
    "nhomCung": [
      1,
      6
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "chip"
    ],
    "tokenCau": [
      "chip"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "ec6bfb1e830d6a46",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Chip chuyên dụng",
        "span": "Chip chuyên dụng",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability_2",
        "value": "dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV)",
        "span": "Tại sự kiện, FPT ký kết hàng loạt thỏa thuận với các đối tác công nghệ trong lĩnh vực bán dẫn tại Việt Nam và quốc tế, như hợp tác toàn diện với Viettel trong hoạt động xây dựng năng lực tự chủ về công nghệ bán dẫn thông qua việc liên thông chuỗi giá trị ngành công nghệ bán dẫn: Đào tạo - Thiết kế - Chế tạo - Kiểm thử - Đóng gói - Thương mại, trọng tâm là cùng phát triển dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV); các thiết bị thông minh.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0014",
    "score": 0.88,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P23 · nhu cầu quốc gia",
    "supplyId": "FPT Semiconductor",
    "nhomCau": 6,
    "nhomCung": [
      6
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "chip"
    ],
    "tokenCau": [
      "chip"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-24"
    },
    "chuaDuyet": [],
    "soChuoi": 2,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Chip chuyên dụng",
        "span": "Chip chuyên dụng",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "span": "Trước đó, [FPT](https://dulieu.nguoiquansat.vn/doanh-nghiep/FPT) Semiconductor đã trở thành doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại",
        "tier": "B",
        "extraction": "verbatim",
        "source": "nguoiquansat.vn",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt"
      },
      {
        "field": "capability_2",
        "value": "thiết kế chip",
        "span": "Hiện FPT phát triển các mảng cốt lõi gồm thiết kế chip (FPT Semiconductor), kiểm thử - đóng gói và đào tạo nhân lực quy mô lớn.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vjst.vn",
        "href": "/evidence/vjst_fpt_tokyo_20260615.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0015",
    "score": 0.88,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P23 · nhu cầu quốc gia",
    "supplyId": "CT Semiconductor",
    "nhomCau": 6,
    "nhomCung": [
      6
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "chip"
    ],
    "tokenCau": [
      "chip"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Chip chuyên dụng",
        "span": "Chip chuyên dụng",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "triển khai giai đoạn 2 nhà máy chip ATP",
        "span": "CT Semiconductor (thành viên CT Group) đang triển khai giai đoạn 2 nhà máy chip ATP tại tỉnh Bình Dương cũ (nay thuộc TP. HCM), với tổng vốn đầu tư gần 100 triệu USD và dự kiến cho ra đời con chip “Made by Vietnam” đầu tiên trong năm 2025.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "nguoiquansat.vn",
        "href": "/evidence/nguoiquansat_bando_bandan_20251027.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0016",
    "score": 0.53,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P01 · nhu cầu quốc gia",
    "supplyId": "VinBigData",
    "nhomCau": 1,
    "nhomCung": [
      1
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "hình",
      "lớn",
      "ngôn",
      "ngữ",
      "tiếng",
      "việt"
    ],
    "tokenCau": [
      "hình",
      "lớn",
      "ngành",
      "ngôn",
      "ngữ",
      "nhân",
      "tiếng",
      "trí",
      "trợ",
      "tuệ",
      "tạo",
      "việt"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-29"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Mô hình ngôn ngữ lớn tiếng Việt, trợ lý ảo và trí tuệ nhân tạo (AI) chuyên ngành",
        "span": "Mô hình ngôn ngữ lớn tiếng Việt, trợ lý ảo và trí tuệ nhân tạo (AI) chuyên ngành",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
        "span": "Tháng 8/2023, VinBigdata đã công bố xây dựng thành công mô hình ngôn ngữ lớn tiếng Việt",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vneconomy.vn",
        "href": "/evidence/vneconomy_ai_khatvong_chuplai_20230904.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0017",
    "score": 0.7,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P22 · nhu cầu quốc gia",
    "supplyId": "Tập đoàn Viettel",
    "nhomCau": 9,
    "nhomCung": [
      1,
      6
    ],
    "quaChuoiGiaTri": true,
    "tokenGiao": [
      "bay",
      "không",
      "lái",
      "người",
      "uav"
    ],
    "tokenCau": [
      "bay",
      "không",
      "lái",
      "người",
      "phương",
      "tiện",
      "uav"
    ],
    "canhChuoi": {
      "tu": 6,
      "den": 9,
      "lyDo": "Chip ban dan la dau vao cua thiet bi bay: nguon mst.gov.vn 28/01/2026 noi ro chip SoC AI on Edge lam cho drone va UAV",
      "trangThai": "da_duyet"
    },
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Thiết bị, phương tiện bay không người lái (UAV)",
        "span": "Thiết bị, phương tiện bay không người lái (UAV); hệ thống quản lý, phát hiện, giám sát và chế áp UAV",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability_2",
        "value": "dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV)",
        "span": "Tại sự kiện, FPT ký kết hàng loạt thỏa thuận với các đối tác công nghệ trong lĩnh vực bán dẫn tại Việt Nam và quốc tế, như hợp tác toàn diện với Viettel trong hoạt động xây dựng năng lực tự chủ về công nghệ bán dẫn thông qua việc liên thông chuỗi giá trị ngành công nghệ bán dẫn: Đào tạo - Thiết kế - Chế tạo - Kiểm thử - Đóng gói - Thương mại, trọng tâm là cùng phát triển dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV); các thiết bị thông minh.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_fpt_nhamay_20260128.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0018",
    "score": 0.9,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P04 · nhu cầu quốc gia",
    "supplyId": "CMC Telecom",
    "nhomCau": 1,
    "nhomCung": [
      1
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "mây",
      "toán",
      "điện",
      "đám"
    ],
    "tokenCau": [
      "mây",
      "toán",
      "điện",
      "đám"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "50998d97f6d8e341",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Nền tảng điện toán đám mây",
        "span": "Nền tảng điện toán đám mây",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "CMC Cloud là nền tảng điện toán đám mây \"Make in Vietnam\" do CMC Telecom đầu tư và phát triển. Hệ thống được thiết kế và vận hành hoàn toàn bởi đội ngũ kỹ sư Việt Nam",
        "span": "CMC Cloud là nền tảng điện toán đám mây \"Make in Vietnam\" do CMC Telecom đầu tư và phát triển. Hệ thống được thiết kế và vận hành hoàn toàn bởi đội ngũ kỹ sư Việt Nam, dựa trên 3 trụ cột chính: Tư duy mở (tối ưu nguồn tri thức cộng đồng, làm chủ công nghệ cốt lõi); Kiến trúc mở (Không phụ thuộc vào công nghệ, không phụ thuộc vào nền tảng); Mã nguồn mở và sản phẩm thương mại hoá (Phát triển chuyên sâu và đáp ứng linh hoạt nhu cầu đặc thù của doanh nghiệp Việt Nam)",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_cmc_cloud_20250321.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0019",
    "score": 0.88,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P04 · nhu cầu quốc gia",
    "supplyId": "VNPT",
    "nhomCau": 1,
    "nhomCung": [
      1,
      3
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "mây",
      "toán",
      "điện",
      "đám"
    ],
    "tokenCau": [
      "mây",
      "toán",
      "điện",
      "đám"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "61940f7b5685f32b",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Nền tảng điện toán đám mây",
        "span": "Nền tảng điện toán đám mây",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability_2",
        "value": "VNPT Cloud hiện được phát triển như một hệ sinh thái điện toán đám mây toàn diện, gồm các dịch vụ hạ tầng, nền tảng và công cụ hỗ trợ vận hành ứng dụng số.",
        "span": "VNPT Cloud hiện được phát triển như một hệ sinh thái điện toán đám mây toàn diện, gồm các dịch vụ hạ tầng, nền tảng và công cụ hỗ trợ vận hành ứng dụng số.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vtv.vn",
        "href": "/evidence/vtv_vnpt_cloud_sao_khue_20260602.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0020",
    "score": 0.67,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P06 · nhu cầu quốc gia",
    "supplyId": "VNPT Technology",
    "nhomCau": 2,
    "nhomCung": [
      2
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "mạng",
      "động"
    ],
    "tokenCau": [
      "advanced",
      "mạng",
      "động"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Thiết bị và hệ thống mạng di động 5G/5G-Advanced",
        "span": "Thiết bị và hệ thống mạng di động 5G/5G-Advanced",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây",
        "span": "Hiện nay VNPT Technology đang phát triển các sản phẩm cho mạng 5G phục vụ lấp đầy các vùng lõm của mạng băng rộng di động và không dây.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_vnpttech_5g_20220831.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0021",
    "score": 0.64,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P20 · nhu cầu quốc gia",
    "supplyId": "Tổng công ty Thiết bị điện Đông Anh",
    "nhomCau": 5,
    "nhomCung": [
      5
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "máy",
      "suất",
      "truyền",
      "tải",
      "điện"
    ],
    "tokenCau": [
      "cao",
      "hiệu",
      "máy",
      "suất",
      "truyền",
      "tải",
      "điện",
      "động"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need_2",
        "value": "máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
        "span": "Thiết bị điện cao áp, siêu cao áp; máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam",
        "span": "Đây là thành quả của tinh thần lao động sáng tạo, sự nỗ lực vượt bậc của tập thể kỹ sư, công nhân lao động Tổng công ty Thiết bị điện Đông Anh khi lần đầu tiên một doanh nghiệp trong nước làm chủ công tác thiết kế, chế tạo thành công máy biến áp 500kV có công suất lớn nhất trên lưới điện truyền tải Việt Nam.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_eemc_mba500kv_20241216.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0022",
    "score": 0.64,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P20 · nhu cầu quốc gia",
    "supplyId": "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
    "nhomCau": 5,
    "nhomCung": [
      5
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "cao",
      "điện"
    ],
    "tokenCau": [
      "cao",
      "siêu",
      "điện"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 2,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Thiết bị điện cao áp, siêu cao áp",
        "span": "Thiết bị điện cao áp, siêu cao áp; máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      },
      {
        "field": "need_2",
        "value": "máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
        "span": "Thiết bị điện cao áp, siêu cao áp; máy điện, động cơ điện và hệ thống truyền tải - truyền động điện hiện đại, hiệu suất cao",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vjst.vn",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0023",
    "score": 0.66,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P17 · nhu cầu quốc gia",
    "supplyId": "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
    "nhomCau": 5,
    "nhomCung": [
      5
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "cao",
      "chế",
      "hiệu",
      "liệu",
      "năng",
      "tạo",
      "vật"
    ],
    "tokenCau": [
      "biến",
      "cao",
      "chế",
      "chức",
      "hiệu",
      "liệu",
      "nghiệp",
      "năng",
      "tạo",
      "vật"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": null,
    "demandEvidence": [
      {
        "field": "need",
        "value": "Vật liệu tiên tiến và vật liệu chức năng hiệu năng cao cho công nghiệp chế biến, chế tạo",
        "span": "Vật liệu tiên tiến và vật liệu chức năng hiệu năng cao cho công nghiệp chế biến, chế tạo",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao",
        "span": "Trong lĩnh vực năng lượng tái tạo và vật liệu tiên tiến, Viện phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió; chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc; phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao.",
        "tier": "B",
        "extraction": "verbatim",
        "source": "vjst.vn",
        "href": "/evidence/vjst_vienhanlam_vatlieu_20260223.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0024",
    "score": 0.77,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P15 · nhu cầu quốc gia",
    "supplyId": "Công ty TNHH Công nghệ Sinh học xanh Nhật Lan",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "biến",
      "chế",
      "hoạch",
      "nghiệp",
      "nông",
      "sinh",
      "sâu",
      "thu",
      "xuất"
    ],
    "tokenCau": [
      "biến",
      "chế",
      "hoạch",
      "khối",
      "nghiệp",
      "nông",
      "phụ",
      "sinh",
      "sâu",
      "thu",
      "xuất"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "4ecc52d98c42856b",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối",
        "span": "Hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "span": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_nam_agaricus_che_bien_sau_20251211.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0025",
    "score": 0.77,
    "rule": "anchor_group_overlap_v2",
    "engine": "cao-loc-match/0.2.0 rule=anchor_group_overlap_v2",
    "demandId": "CNCL-P15 · nhu cầu quốc gia",
    "supplyId": "Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch",
    "nhomCau": 4,
    "nhomCung": [
      4
    ],
    "quaChuoiGiaTri": false,
    "tokenGiao": [
      "biến",
      "chế",
      "hoạch",
      "nghiệp",
      "nông",
      "sinh",
      "sâu",
      "thu",
      "xuất"
    ],
    "tokenCau": [
      "biến",
      "chế",
      "hoạch",
      "khối",
      "nghiệp",
      "nông",
      "phụ",
      "sinh",
      "sâu",
      "thu",
      "xuất"
    ],
    "canhChuoi": null,
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-09-30"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "2d68dd0f05589590",
    "demandEvidence": [
      {
        "field": "need",
        "value": "Hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối",
        "span": "Hệ thống sản xuất, thu hoạch và chế biến sâu sản phẩm, phụ phẩm nông nghiệp và sinh khối",
        "tier": "A",
        "extraction": "verbatim",
        "source": "baochinhphu.vn",
        "href": "/evidence/baochinhphu_qd21_toanvan_20260718.txt"
      }
    ],
    "supplyEvidence": [
      {
        "field": "capability",
        "value": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "span": "Đề tài \"Nghiên cứu công nghệ sản xuất và chế biến nấm Agaricus subrufescens, ứng dụng để nâng cao giá trị gia tăng một số nông sản Việt Nam\" do nhóm nghiên cứu của Công ty TNHH Công nghệ Sinh học xanh Nhật Lan, Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch và một số doanh nghiệp thực hiện đã hoàn thiện toàn bộ quy trình công nghệ, làm chủ hệ thống lên men 1.000 lít và tạo ra 8 sản phẩm giá trị gia tăng từ nông sản Việt Nam, mở ra hướng đi mới cho chế biến sâu, nâng cao giá trị thương mại và tiềm năng xuất khẩu của ngành nông sản nước ta.",
        "tier": "A",
        "extraction": "verbatim",
        "source": "mst.gov.vn",
        "href": "/evidence/mst_nam_agaricus_che_bien_sau_20251211.txt"
      }
    ],
    "unverified": []
  }
];

export const rejectedPairs: RejectedPair[] = [
  {
    "demandId": "CNCL-P08 · nhu cầu quốc gia",
    "supplyId": "VNPT",
    "by": "Lam Nguyen",
    "date": "2026-08-16",
    "lyDo": "Ca rac da biet: hai token khop la manh vun cua tu ghep, VNPT khong lam nen tang san xuat thong minh"
  }
];
