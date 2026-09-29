/**
 * mat-tien.ts · Du lieu cho trang dau (landing mot man hinh).
 *
 * Moi con so va moi nut tren animation deu RUT tu ba file da qua cong:
 *   lib/hub-graph.json    nut (44 don vi, 30 nhu cau, 10 nhom) va canh co bang chung
 *   lib/cncl-match.json   11 match da ky (diem engine, ngay ky, nguoi ky)
 *   lib/cncl-registry.json meta (so cau nguon, ket qua chuoi cong)
 * Khong co so nao go tay o day. Cong check-mat-tien.mjs tinh lai tu chinh ba file do va so.
 *
 * Ham thuan, tat dinh: thu tu nut theo nhom roi theo ten (so sanh codepoint), khong random.
 */
import graph from './hub-graph.json';
import matchData from './cncl-match.json';
import registry from './cncl-registry.json';

export type NutMT = { id: string; ten: string; loai: 'cung' | 'cau' | 'nhom'; nhom: number; ma?: string; trong?: boolean };
export type LuongMT = { cung: number; cau: number; nhom: number; daKy: boolean };
export type MatchMT = {
  id: string; cung: number; cau: number; nhom: number; diem: number; ngay: string;
  cauMa: string; cauTen: string; cungTen: string; nguoiKy: string; tierCau: string; tierCung: string;
};
export type SoMT = {
  donVi: number; nhuCau: number; nhom: number; capCoNguon: number; daKy: number; tuChoi: number;
  ncTrong: number; cauNguon: number; tierA: number; chuoiCong: { xanh: number; tong: number; luc: string } | null;
};
export type MatTien = { nut: NutMT[]; canhNhom: [number, number][]; luong: LuongMT[]; tuChoi: [number, number][]; match: MatchMT[]; so: SoMT };

type GNode = { id: string; kind: string; label: string; nhoms?: string[]; nhom?: string; maSp?: string };
type GEdge = { kind: string; source: string; target: string; matchId?: string };
const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export function dungMatTien(): MatTien {
  const G = graph as unknown as { nodes: GNode[]; edges: GEdge[] };
  const M = matchData as unknown as {
    signedMatches: { id: string; score: number; demandId: string; supplyId: string; signoff: { by: string; date: string };
      demandEvidence: { tier: string; value: string }[]; supplyEvidence: { tier: string }[] }[];
    rejectedPairs: unknown[];
  };
  const R = registry as unknown as { meta: { claims: number; tierA: number; chuoiCong: { xanh: number; tong: number; luc: string } | null } };

  const nhomCua = (n: GNode) => Number(n.kind === 'nhu_cau' ? n.nhom : (n.nhoms ?? [])[0] ?? 0);
  const theoNhom = (a: GNode, b: GNode) => nhomCua(a) - nhomCua(b) || cmp(a.label, b.label);
  const nhom = G.nodes.filter((n) => n.kind === 'nhom').sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3)));
  const cung = G.nodes.filter((n) => n.kind === 'don_vi').sort(theoNhom);
  const cau = G.nodes.filter((n) => n.kind === 'nhu_cau').sort((a, b) => nhomCua(a) - nhomCua(b) || cmp(a.maSp ?? '', b.maSp ?? ''));

  const nut: NutMT[] = [];
  const chiSo = new Map<string, number>();
  const them = (n: GNode, x: NutMT) => { chiSo.set(n.id, nut.length); nut.push(x); };
  nhom.forEach((n) => them(n, { id: n.id, ten: n.label.replace(/^Nhóm \d+ · /, ''), loai: 'nhom', nhom: Number(n.id.slice(3)) }));
  cung.forEach((n) => them(n, { id: n.id, ten: n.label, loai: 'cung', nhom: nhomCua(n) }));

  const capCo = new Set<string>();
  const khoa = (s: string, t: string) => `${s}>${t}`;
  for (const e of G.edges) if (e.kind === 'cung_san_pham' || e.kind === 'match_da_ky') capCo.add(khoa(e.source, e.target));
  const cauCoCung = new Set([...capCo].map((k) => k.split('>')[1]));
  cau.forEach((n) => them(n, { id: n.id, ten: n.label, loai: 'cau', nhom: nhomCua(n), ma: `P${n.maSp}`, trong: !cauCoCung.has(n.id) }));

  const idNhom = (so: number) => chiSo.get(`nh:${so}`) as number;
  const canhNhom: [number, number][] = [];
  for (const e of G.edges) if (e.kind === 'thuoc_nhom') canhNhom.push([chiSo.get(e.source) as number, chiSo.get(e.target) as number]);
  for (const n of cau) canhNhom.push([chiSo.get(n.id) as number, idNhom(nhomCua(n))]);

  const daKy = new Map<string, string>();
  for (const e of G.edges) if (e.kind === 'match_da_ky') daKy.set(khoa(e.source, e.target), e.matchId ?? '');
  const luong: LuongMT[] = [...capCo].sort(cmp).map((k) => {
    const [s, t] = k.split('>');
    const iCau = chiSo.get(t) as number;
    return { cung: chiSo.get(s) as number, cau: iCau, nhom: idNhom(nut[iCau].nhom), daKy: daKy.has(k) };
  });
  const tuChoi: [number, number][] = G.edges.filter((e) => e.kind === 'tu_choi').map((e) => [chiSo.get(e.source) as number, chiSo.get(e.target) as number]);

  const match: MatchMT[] = M.signedMatches.map((m) => {
    const iCung = chiSo.get(`dv:${m.supplyId}`) as number;
    const iCau = chiSo.get(`nc:${m.demandId}`) as number;
    return {
      id: m.id, cung: iCung, cau: iCau, nhom: idNhom(nut[iCau].nhom), diem: m.score, ngay: m.signoff.date,
      cauMa: nut[iCau].ma ?? '', cauTen: nut[iCau].ten, cungTen: m.supplyId, nguoiKy: m.signoff.by,
      tierCau: m.demandEvidence[0]?.tier ?? '', tierCung: m.supplyEvidence[0]?.tier ?? '',
    };
  }).sort((a, b) => cmp(a.id, b.id));

  const so: SoMT = {
    donVi: cung.length, nhuCau: cau.length, nhom: nhom.length, capCoNguon: capCo.size, daKy: match.length,
    tuChoi: M.rejectedPairs.length, ncTrong: cau.filter((n) => !cauCoCung.has(n.id)).length,
    cauNguon: R.meta.claims, tierA: R.meta.tierA, chuoiCong: R.meta.chuoiCong ? { xanh: R.meta.chuoiCong.xanh, tong: R.meta.chuoiCong.tong, luc: R.meta.chuoiCong.luc } : null,
  };
  return { nut, canhNhom, luong, tuChoi, match, so };
}
