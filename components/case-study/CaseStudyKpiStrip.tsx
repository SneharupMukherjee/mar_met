export function CaseStudyKpiStrip({
  spend,
  sessions,
  conversions,
  convPer1kSpend,
  convRateProxy
}: {
  spend: number;
  sessions: number;
  conversions: number;
  convPer1kSpend: number;
  convRateProxy: number;
}) {
  const items = [
    { label: 'Total Spend', value: `$${Math.round(spend).toLocaleString()}` },
    { label: 'Total Sessions', value: Math.round(sessions).toLocaleString() },
    { label: 'Total Conversions', value: Math.round(conversions).toLocaleString() },
    { label: 'Conversions / $1k Spend', value: convPer1kSpend.toFixed(2) },
    { label: 'Session→Conversion Proxy', value: `${convRateProxy.toFixed(2)}%` }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">{item.label}</p>
          <p className="text-xl font-semibold text-slate-100">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
