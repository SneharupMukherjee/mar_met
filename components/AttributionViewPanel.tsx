'use client';

import { useMemo, useState } from 'react';
import { AttributionModelRow } from '@/lib/data/dashboardTabs';

type Mode = 'platform' | 'modeled' | 'blended';

export function AttributionViewPanel({ rows }: { rows: AttributionModelRow[] }) {
  const [mode, setMode] = useState<Mode>('blended');

  const latestWeek = rows.map((r) => r.weekStart).sort().at(-1);
  const latestRows = rows.filter((r) => r.weekStart === latestWeek);

  const tableRows = useMemo(
    () =>
      latestRows.map((row) => {
        const blended = row.platformRevenue * 0.5 + row.modeledRevenue * 0.5;
        const selected =
          mode === 'platform' ? row.platformRevenue : mode === 'modeled' ? row.modeledRevenue : Math.round(blended);
        const disagreement = ((row.platformRevenue - row.modeledRevenue) / Math.max(row.modeledRevenue, 1)) * 100;
        return {
          ...row,
          selected,
          blended: Math.round(blended),
          disagreement
        };
      }),
    [latestRows, mode]
  );

  const total = tableRows.reduce((acc, row) => acc + row.selected, 0);

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <button className={`rounded-md px-3 py-1.5 text-sm ${mode === 'platform' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`} onClick={() => setMode('platform')}>
          Platform
        </button>
        <button className={`rounded-md px-3 py-1.5 text-sm ${mode === 'modeled' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`} onClick={() => setMode('modeled')}>
          Modeled
        </button>
        <button className={`rounded-md px-3 py-1.5 text-sm ${mode === 'blended' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`} onClick={() => setMode('blended')}>
          Blended
        </button>
      </div>

      <div className="card">
        <p className="text-xs text-slate-400">Selected Revenue ({mode})</p>
        <p className="text-xl font-semibold">${total.toLocaleString()}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Channel</th>
              <th className="px-3 py-2 text-right">Platform</th>
              <th className="px-3 py-2 text-right">Modeled</th>
              <th className="px-3 py-2 text-right">Blended</th>
              <th className="px-3 py-2 text-right">Active View</th>
              <th className="px-3 py-2 text-right">Disagreement %</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.channel} className="border-t border-slate-800">
                <td className="px-3 py-2">{row.channel}</td>
                <td className="px-3 py-2 text-right">${row.platformRevenue.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${row.modeledRevenue.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${row.blended.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-semibold">${row.selected.toLocaleString()}</td>
                <td className={`px-3 py-2 text-right ${Math.abs(row.disagreement) >= 20 ? 'text-amber-300' : 'text-slate-300'}`}>
                  {row.disagreement.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
