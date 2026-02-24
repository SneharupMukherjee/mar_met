import { SITE_FUNNEL_DAILY } from '@/lib/data/dashboardTabs';

export default async function ChannelBreakdownPage() {
  const rows = Object.values(
    SITE_FUNNEL_DAILY.reduce<
      Record<string, { channel: string; spend: number; revenue: number; purchases: number; sessions: number; walletConnects: number }>
    >((acc, row) => {
      if (!acc[row.channel]) {
        acc[row.channel] = { channel: row.channel, spend: 0, revenue: 0, purchases: 0, sessions: 0, walletConnects: 0 };
      }
      acc[row.channel].spend += row.spend;
      acc[row.channel].revenue += row.revenue;
      acc[row.channel].purchases += row.purchases;
      acc[row.channel].sessions += row.sessions;
      acc[row.channel].walletConnects += row.walletConnects;
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  const totalSpend = rows.reduce((acc, row) => acc + row.spend, 0);
  const totalRevenue = rows.reduce((acc, row) => acc + row.revenue, 0);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Channel Breakdown</h2>
        <p className="text-sm text-slate-300">Contribution mix by Meta, Google, Organic, and Influencer channels.</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Channel</th>
              <th className="px-3 py-2 text-right">Spend</th>
              <th className="px-3 py-2 text-right">Revenue</th>
              <th className="px-3 py-2 text-right">Spend %</th>
              <th className="px-3 py-2 text-right">Revenue %</th>
              <th className="px-3 py-2 text-right">Wallet Connect Rate</th>
              <th className="px-3 py-2 text-right">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.channel} className="border-t border-slate-800">
                <td className="px-3 py-2">{row.channel}</td>
                <td className="px-3 py-2 text-right">${row.spend.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${row.revenue.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{((row.spend / Math.max(totalSpend, 1)) * 100).toFixed(1)}%</td>
                <td className="px-3 py-2 text-right">{((row.revenue / Math.max(totalRevenue, 1)) * 100).toFixed(1)}%</td>
                <td className="px-3 py-2 text-right">{((row.walletConnects / Math.max(row.sessions, 1)) * 100).toFixed(1)}%</td>
                <td className="px-3 py-2 text-right">{row.spend > 0 ? (row.revenue / row.spend).toFixed(2) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
