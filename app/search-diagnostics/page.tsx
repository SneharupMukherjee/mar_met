import { LineTrendChart } from '@/components/LineTrendChart';
import { GOOGLE_ADS_DAILY } from '@/lib/data/dashboardTabs';

export default async function SearchDiagnosticsPage() {
  const byDate = Object.values(
    GOOGLE_ADS_DAILY.reduce<
      Record<string, { date: string; brandCpc: number; nonBrandCpc: number; brandImpressionShare: number; nonBrandImpressionShare: number }>
    >((acc, row) => {
      if (!acc[row.date]) {
        acc[row.date] = {
          date: row.date,
          brandCpc: 0,
          nonBrandCpc: 0,
          brandImpressionShare: 0,
          nonBrandImpressionShare: 0
        };
      }
      if (row.intent === 'Brand') {
        acc[row.date].brandCpc = row.averageCpc;
        acc[row.date].brandImpressionShare = row.searchImpressionShare * 100;
      } else {
        acc[row.date].nonBrandCpc = row.averageCpc;
        acc[row.date].nonBrandImpressionShare = row.searchImpressionShare * 100;
      }
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Search Diagnostics</h2>
        <p className="text-sm text-slate-300">Brand vs Non-brand auction pressure across CPC and impression share trends.</p>
      </header>

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold">Average CPC Trend</h3>
        <LineTrendChart
          xKey="date"
          data={byDate}
          lines={[
            { key: 'brandCpc', label: 'Brand CPC', color: '#22c55e' },
            { key: 'nonBrandCpc', label: 'Non-Brand CPC', color: '#f97316' }
          ]}
          height={260}
        />
      </div>

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold">Search Impression Share Trend (%)</h3>
        <LineTrendChart
          xKey="date"
          data={byDate}
          lines={[
            { key: 'brandImpressionShare', label: 'Brand IS', color: '#14b8a6' },
            { key: 'nonBrandImpressionShare', label: 'Non-Brand IS', color: '#eab308' }
          ]}
          height={260}
        />
      </div>
    </section>
  );
}
