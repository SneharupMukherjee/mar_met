import { LineTrendChart } from '@/components/LineTrendChart';
import { SITE_FUNNEL_DAILY } from '@/lib/data/dashboardTabs';

export default async function ExecutiveOverviewPage() {
  const byDate = Object.values(
    SITE_FUNNEL_DAILY.reduce<Record<string, { date: string; spend: number; purchases: number; revenue: number }>>((acc, row) => {
      if (!acc[row.date]) acc[row.date] = { date: row.date, spend: 0, purchases: 0, revenue: 0 };
      acc[row.date].spend += row.spend;
      acc[row.date].purchases += row.purchases;
      acc[row.date].revenue += row.revenue;
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  const totals = byDate.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.purchases += row.purchases;
      acc.revenue += row.revenue;
      return acc;
    },
    { spend: 0, purchases: 0, revenue: 0 }
  );

  const blendedRoas = totals.revenue / Math.max(totals.spend, 1);
  const cpa = totals.spend / Math.max(totals.purchases, 1);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Executive Overview</h2>
        <p className="text-sm text-slate-300">Topline performance across spend, purchases, and blended efficiency.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-5">
        <div className="card">
          <p className="text-xs text-slate-400">Spend</p>
          <p className="text-xl font-semibold">${totals.spend.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400">Conversions</p>
          <p className="text-xl font-semibold">{totals.purchases.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400">Revenue</p>
          <p className="text-xl font-semibold">${totals.revenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400">Blended ROAS</p>
          <p className="text-xl font-semibold">{blendedRoas.toFixed(2)}x</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400">CPA</p>
          <p className="text-xl font-semibold">${cpa.toFixed(2)}</p>
        </div>
      </div>

      <div className="card">
        <LineTrendChart
          xKey="date"
          data={byDate}
          lines={[
            { key: 'spend', label: 'Spend', color: '#38bdf8' },
            { key: 'revenue', label: 'Revenue', color: '#22c55e' },
            { key: 'purchases', label: 'Purchases', color: '#f59e0b' }
          ]}
        />
      </div>
    </section>
  );
}
