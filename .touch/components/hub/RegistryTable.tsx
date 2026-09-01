import { TierBadge } from '../shared/TierBadge';
import { registry } from '@/lib/demo-data';
import { hub } from '@/lib/content';

/** Bang registry cung, trich, co tier badge. */
export function RegistryTable() {
  return (
    <table className="reg-table">
      <thead>
        <tr>
          {hub.regCols.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {registry.map((r) => (
          <tr key={r.name}>
            <td className="ent">{r.name}</td>
            <td>{r.cap}</td>
            <td>
              <TierBadge level={r.tier}>{r.tierLabel}</TierBadge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
