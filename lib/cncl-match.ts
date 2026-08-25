// AUTO-GENERATED boi scripts/gen-cncl-data.mjs · 2026-08-25 · KHONG sua tay.
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
  "daKy": 11,
  "tuChoi": 1,
  "tongChay": 11,
  "rule": "anchor_group_overlap_v2",
  "nguoiKy": "Lam Nguyen",
  "generatedAt": "2026-08-25"
} as const;

export const signedMatches: SignedMatch[] = [
  {
    "id": "MATCH-0001",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "862548dda49165e3",
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
    "id": "MATCH-0003",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "69645ee490ea1124",
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
    "id": "MATCH-0004",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "d7dfdf2004751dd9",
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
    "id": "MATCH-0005",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-24"
    },
    "chuaDuyet": [],
    "soChuoi": 2,
    "khoaBangChung": "8e65ab7b193b67e7",
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
    "id": "MATCH-0006",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "95a4acb064fe6817",
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
    "id": "MATCH-0007",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "72003af33e5da3a0",
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
        "href": "/evidence/vneconomy_ai_khatvong_20260718.txt"
      }
    ],
    "unverified": []
  },
  {
    "id": "MATCH-0008",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "1216d421d3a07c35",
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
    "id": "MATCH-0009",
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
    "id": "MATCH-0010",
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
    "id": "MATCH-0011",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 2,
    "khoaBangChung": "a5a01bc2d7b0748e",
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
    "id": "MATCH-0012",
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
    "signoff": {
      "by": "Lam Nguyen",
      "role": "chuyen gia gac cong",
      "date": "2026-08-16"
    },
    "chuaDuyet": [],
    "soChuoi": 1,
    "khoaBangChung": "7fb63383a698e35f",
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
