import { META_ADS_DAILY } from '@/lib/data/dashboardTabs';

export default async function CreativeDiagnosticsPage() {
  const byAngle = Object.values(
    META_ADS_DAILY.reduce<
      Record<string, { creativeAngle: string; firstCtr: number; lastCtr: number; avgFrequency: number; avgCpa: number; count: number }>
    >((acc, row) => {
      if (!acc[row.creativeAngle]) {
        acc[row.creativeAngle] = {
          creativeAngle: row.creativeAngle,
          firstCtr: row.ctr,
          lastCtr: row.ctr,
          avgFrequency: 0,
          avgCpa: 0,
          count: 0
        };
      }
      const item = acc[row.creativeAngle];
      item.lastCtr = row.ctr;
      item.avgFrequency += row.frequency;
      item.avgCpa += row.cpaPurchase;
      item.count += 1;
      return acc;
    }, {})
  ).map((row) => {
    const avgFrequency = row.avgFrequency / Math.max(row.count, 1);
    const avgCpa = row.avgCpa / Math.max(row.count, 1);
    const ctrDropPct = ((row.firstCtr - row.lastCtr) / Math.max(row.firstCtr, 0.0001)) * 100;
    const fatigueFlag = avgFrequency > 3 && ctrDropPct > 20;
    return { ...row, avgFrequency, avgCpa, ctrDropPct, fatigueFlag };
  });

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Creative Diagnostics</h2>
        <p className="text-sm text-slate-300">Creative-angle fatigue checks using frequency and CTR decay.</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Creative Angle</th>
              <th className="px-3 py-2 text-right">Avg Frequency</th>
              <th className="px-3 py-2 text-right">CTR Drop</th>
              <th className="px-3 py-2 text-right">Avg CPA</th>
              <th className="px-3 py-2 text-left">Flag</th>
            </tr>
          </thead>
          <tbody>
            {byAngle.map((row) => (
              <tr key={row.creativeAngle} className="border-t border-slate-800">
                <td className="px-3 py-2">{row.creativeAngle}</td>
                <td className="px-3 py-2 text-right">{row.avgFrequency.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{row.ctrDropPct.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right">${row.avgCpa.toFixed(2)}</td>
                <td className={`px-3 py-2 ${row.fatigueFlag ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {row.fatigueFlag ? 'Fatigue risk' : 'Healthy'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
