export default async function MeasurementPipelinePage() {
  const utmConventions = [
    { key: 'utm_source', convention: 'meta | google | influencer | newsletter', example: 'meta' },
    { key: 'utm_medium', convention: 'paid_social | paid_search | creator | email', example: 'paid_search' },
    { key: 'utm_campaign', convention: 'channel-objective-theme-v#', example: 'meta-prospecting-utility-v3' },
    { key: 'utm_content', convention: 'creative-id-angle', example: 'vid23-social-proof' },
    { key: 'utm_term', convention: 'keyword for search only', example: 'wallet launch' }
  ];

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Measurement &amp; Pipeline</h2>
        <p className="text-sm text-slate-300">Tracking architecture, data movement, and UTM discipline checks.</p>
      </header>

      <div className="card">
        <p className="mb-3 text-sm font-semibold">Pipeline Architecture</p>
        <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-slate-200">
{`Ad Platforms (Meta/Google) + Site Events
            |
            v
      Tracking Layer (UTM + pixel + server events)
            |
            v
      Ingestion (daily sync + QA checks)
            |
            v
      Modeled Layer (attribution + readiness features)
            |
            v
      Dashboard + AI Analyst`}
        </pre>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Parameter</th>
              <th className="px-3 py-2 text-left">Convention</th>
              <th className="px-3 py-2 text-left">Example</th>
            </tr>
          </thead>
          <tbody>
            {utmConventions.map((row) => (
              <tr key={row.key} className="border-t border-slate-800">
                <td className="px-3 py-2 font-mono">{row.key}</td>
                <td className="px-3 py-2">{row.convention}</td>
                <td className="px-3 py-2 font-mono">{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
