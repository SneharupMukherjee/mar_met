import { RETARGETING_AUDIENCES_DAILY } from '@/lib/data/dashboardTabs';

export default async function RetargetingEnginePage() {
  const rows = RETARGETING_AUDIENCES_DAILY.map((row) => ({
    ...row,
    progressionRate: row.progressedUsers / Math.max(row.audienceSize, 1),
    costPerNextStage: row.spend / Math.max(row.progressedUsers, 1)
  })).sort((a, b) => b.audienceSize - a.audienceSize);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Retargeting Engine</h2>
        <p className="text-sm text-slate-300">Audience progression and cost-to-advance across retargeting buckets.</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Bucket</th>
              <th className="px-3 py-2 text-right">Audience Size</th>
              <th className="px-3 py-2 text-right">Progressed Users</th>
              <th className="px-3 py-2 text-right">Progression Rate</th>
              <th className="px-3 py-2 text-right">Spend</th>
              <th className="px-3 py-2 text-right">Cost / Next Stage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.bucket} className="border-t border-slate-800">
                <td className="px-3 py-2">{row.bucket}</td>
                <td className="px-3 py-2 text-right">{row.audienceSize.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{row.progressedUsers.toLocaleString()}</td>
                <td className={`px-3 py-2 text-right ${row.progressionRate < 0.15 ? 'text-rose-300' : 'text-slate-300'}`}>
                  {(row.progressionRate * 100).toFixed(1)}%
                </td>
                <td className="px-3 py-2 text-right">${row.spend.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${row.costPerNextStage.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
