'use client';

import { useState } from 'react';
import { MatchList } from './MatchList';
import { RegistryTable } from './RegistryTable';
import { MatchDetail } from './MatchDetail';
import { hubMatches } from '@/lib/demo-data';
import { hub } from '@/lib/content';

/**
 * Phan tuong tac cua Hub: giu match dang chon, panel trai (danh sach + registry),
 * panel phai (chi tiet). Bam mot match doi chi tiet ben phai.
 */
export function HubApp() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="hub-cols">
      <div className="panel">
        <div className="panel-h">
          <h2>{hub.panelTitle}</h2>
          <span className="mono">{hub.panelSort}</span>
        </div>
        <MatchList matches={hubMatches} selected={selected} onSelect={setSelected} />
        <RegistryTable />
      </div>
      <MatchDetail match={hubMatches[selected]} />
    </div>
  );
}
