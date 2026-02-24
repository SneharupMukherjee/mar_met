import { GOOGLE_ADS_DAILY, META_ADS_DAILY } from '@/lib/data/dashboardTabs';

export default async function CampaignDrilldownPage() {
  const unified = [
    ...META_ADS_DAILY.map((row) => ({
      channel: 'Meta',
      campaignId: row.campaignId,
      campaignName: row.campaignName,
      spend: row.spend,
      purchases: row.purchases,
      revenue: row.revenue
    })),
    ...GOOGLE_ADS_DAILY.map((row) => ({
      channel: 'Google',
      campaignId: row.campaignId,
      campaignName: row.campaignName,
      spend: row.spend,
      purchases: row.conversions,
      revenue: row.revenue
    }))
  ];

  const byCampaign = Object.values(
    unified.reduce<Record<string, { channel: string; campaignId: string; campaignName: string; spend: number; purchases: number; revenue: number }>>(
      (acc, row) => {
        const key = `${row.channel}-${row.campaignId}`;
        if (!acc[key]) {
          acc[key] = {
            channel: row.channel,
            campaignId: row.campaignId,
            campaignName: row.campaignName,
            spend: 0,
            purchases: 0,
            revenue: 0
          };
        }
        acc[key].spend += row.spend;
        acc[key].purchases += row.purchases;
        acc[key].revenue += row.revenue;
        return acc;
      },
      {}
    )
  )
    .map((row) => {
      const cpa = row.spend / Math.max(row.purchases, 1);
      const roas = row.revenue / Math.max(row.spend, 1);
      const action = cpa > 55 || roas < 2 ? 'Investigate waste' : roas > 3.5 && cpa < 40 ? 'Scale candidate' : 'Monitor';
      return { ...row, cpa, roas, action };
    })
    .sort((a, b) => b.spend - a.spend);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Campaign Drilldown</h2>
        <p className="text-sm text-slate-300">Campaign-level spend, purchase efficiency, and outlier triage.</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Channel</th>
              <th className="px-3 py-2 text-left">Campaign</th>
              <th className="px-3 py-2 text-right">Spend</th>
              <th className="px-3 py-2 text-right">Purchases</th>
              <th className="px-3 py-2 text-right">CPA</th>
              <th className="px-3 py-2 text-right">ROAS</th>
              <th className="px-3 py-2 text-left">Decision</th>
            </tr>
          </thead>
          <tbody>
            {byCampaign.map((row) => (
              <tr key={`${row.channel}-${row.campaignId}`} className="border-t border-slate-800">
                <td className="px-3 py-2">{row.channel}</td>
                <td className="px-3 py-2">{row.campaignName}</td>
                <td className="px-3 py-2 text-right">${row.spend.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{row.purchases.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${row.cpa.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{row.roas.toFixed(2)}</td>
                <td className={`px-3 py-2 ${row.action === 'Investigate waste' ? 'text-rose-300' : row.action === 'Scale candidate' ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {row.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
