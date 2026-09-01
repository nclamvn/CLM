import { MatchCard } from '../shared/MatchCard';
import { toMatchCardData, type HubMatch } from '@/lib/demo-data';

/** Panel chi tiet: MatchCard day du (flush) cua match dang chon. */
export function MatchDetail({ match }: { match: HubMatch }) {
  return (
    <div className="panel">
      <MatchCard data={toMatchCardData(match)} flush />
    </div>
  );
}
