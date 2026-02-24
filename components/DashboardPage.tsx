import { getMarketingData, summarizeData } from '@/lib/data/client';
import { DataChart } from '@/components/DataChart';
import { ReactNode } from 'react';

export async function DashboardPage({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const data = await getMarketingData();
  const summary = summarizeData(data);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-slate-300">{description}</p>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="card">
          <p className="text-xs text-slate-400">Spend</p>
          <p className="text-xl font-semibold">${summary.spend.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400">Revenue</p>
          <p className="text-xl font-semibold">${summary.revenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400">Conversions</p>
          <p className="text-xl font-semibold">{summary.conversions.toLocaleString()}</p>
        </div>
      </div>
      <div className="card">
        <DataChart data={data} />
      </div>
      {children}
    </section>
  );
}
