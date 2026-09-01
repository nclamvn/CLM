import { kpis } from '@/lib/demo-data';

/** 4 KPI. Chi so canh bao (match bi cong chan) dung mau do (kpi .t.warn). */
export function KpiGrid() {
  return (
    <div className="kpis">
      {kpis.map((k) => (
        <div className="kpi" key={k.k}>
          <div className="k mono">{k.k}</div>
          <div className="v">{k.v}</div>
          <div className={k.warn ? 't warn' : 't'}>{k.t}</div>
        </div>
      ))}
    </div>
  );
}
