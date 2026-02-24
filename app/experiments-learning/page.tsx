import { EXPERIMENTS } from '@/lib/data/dashboardTabs';

export default async function ExperimentsLearningPage() {
  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Experiments &amp; Learning</h2>
        <p className="text-sm text-slate-300">Test tracker with hypotheses, observed lift, and rollout decisions.</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Experiment</th>
              <th className="px-3 py-2 text-left">Hypothesis</th>
              <th className="px-3 py-2 text-left">Dates</th>
              <th className="px-3 py-2 text-left">Primary Metric</th>
              <th className="px-3 py-2 text-right">Uplift</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Decision</th>
            </tr>
          </thead>
          <tbody>
            {EXPERIMENTS.map((row) => (
              <tr key={row.id} className="border-t border-slate-800">
                <td className="px-3 py-2 font-medium">{row.id}</td>
                <td className="px-3 py-2">{row.hypothesis}</td>
                <td className="px-3 py-2">
                  {row.startDate} to {row.endDate}
                </td>
                <td className="px-3 py-2">{row.primaryMetric}</td>
                <td className={`px-3 py-2 text-right ${row.upliftPct >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{row.upliftPct.toFixed(1)}%</td>
                <td className={`px-3 py-2 ${row.status === 'won' ? 'text-emerald-300' : row.status === 'lost' ? 'text-rose-300' : 'text-amber-300'}`}>{row.status}</td>
                <td className="px-3 py-2">{row.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
