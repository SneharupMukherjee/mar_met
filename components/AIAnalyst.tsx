'use client';

import { useState } from 'react';

const QA_DATA = [
  { q: 'Why did ROAS drop last week?', a: 'ROAS dropped primarily due to **Google non-brand CPC inflation** between T-18 and T-8. Our tracking shows `average_cpc` rose from $1.80 to $2.52, while `search_impression_share` fell slightly. The recommendation is to shift budget to exact match and tighten geo modifiers during this auction pressure window.', source: 'GOOGLE_ADS_DAILY (rows 14-24)' },
  { q: 'Which campaigns are wasting spend?', a: 'The **Influencer Spike (creator_drop)** on T-12 drove 15,000 sessions but yielded a very low `wallet_connect_rate` (1.5% vs 10% baseline). Although it looks like a traffic win, the `cpa_purchase` was 3x higher than Meta Prospecting Video.', source: 'SITE_FUNNEL_DAILY (T-12 channel="Influencer")' },
  { q: 'Which retargeting bucket is the bottleneck?', a: 'The bottleneck is the **wallet_no_task** audience. While the `visited_bounced` bucket progresses at 15%, users who connected wallets but didn\'t start tasks have a steep dropoff, suggesting friction in the LP UI after wallet connection.', source: 'RETARGETING_AUDIENCES_DAILY (Bucket: wallet_no_task)' },
  { q: 'Where should we shift budget next week?', a: 'We should scale the **Meta Prospecting Video** campaign (`C_M1`) and roll out the new **EXP-CTA-001** checkout copy. The experiment showed a 16% uplift in `site_conversion_rate` (0.034 to 0.0394).', source: 'EXPERIMENTS (EXP-CTA-001) & META_ADS_DAILY' },
  { q: 'Is tracking broken anywhere?', a: 'Yes, a severe **tracking break** occurred on T-6. `conversions` dropped to near zero across all channels despite sustained `spend`. The data recovered over T-5 to T-3 with a 1.18x multiplier, indicating backfilled events.', source: 'SITE_FUNNEL_DAILY & KPI_DASHBOARD (tracking_quality_flag="degraded")' },
];

export function AIAnalyst() {
  const [activeTab, setActiveTab] = useState('qa');
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<{q: string, a: string, source: string}[]>([]);

  const handleAsk = () => {
    if (!query.trim()) return;
    const lowerQ = query.toLowerCase();
    const match = QA_DATA.find(d => 
      lowerQ.includes('roas') && d.q.includes('ROAS') ||
      lowerQ.includes('waste') && d.q.includes('wasting') ||
      lowerQ.includes('bottleneck') && d.q.includes('bottleneck') ||
      lowerQ.includes('shift') && d.q.includes('shift budget') ||
      lowerQ.includes('broken') && d.q.includes('broken')
    ) || { q: query, a: 'I can only answer specific questions about the synthetic dataset (e.g., ROAS dropped, wasted spend, retargeting bottlenecks, tracking breaks).', source: 'System' };
    
    setChatLog([...chatLog, match]);
    setQuery('');
  };

  return (
    <div className="bg-white border text-gray-800 rounded-lg shadow-sm flex flex-col h-[600px]">
      <div className="border-b px-6 py-4 flex gap-4 text-sm font-medium">
        <button onClick={() => setActiveTab('qa')} className={`pb-2 ${activeTab === 'qa' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Ask Your Data</button>
        <button onClick={() => setActiveTab('insights')} className={`pb-2 ${activeTab === 'insights' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Anomaly Insights</button>
        <button onClick={() => setActiveTab('report')} className={`pb-2 ${activeTab === 'report' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>Weekly Narrative</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'qa' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 mb-4">
              {chatLog.length === 0 ? (
                <div className="text-gray-400 text-sm text-center mt-10">Try asking: &quot;Why did ROAS drop last week?&quot; or &quot;Is tracking broken anywhere?&quot;</div>
              ) : (
                chatLog.map((log, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-gray-100 p-3 rounded-lg w-fit ml-auto"><strong>You:</strong> {log.q}</div>
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg w-full">
                      <p className="whitespace-pre-wrap">{log.a}</p>
                      <div className="mt-2 text-xs text-indigo-400 font-mono">Source: {log.source}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-indigo-300" placeholder="Ask a question about the data..." />
              <button onClick={handleAsk} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700">Ask</button>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
              <h3 className="text-red-800 font-bold mb-1">🚨 Tracking Break Detected</h3>
              <p className="text-sm text-red-700">On Day T-6, `conversions` dropped sharply while `spend` remained active. The `tracking_quality_flag` is degraded.</p>
              <div className="mt-3 text-xs font-mono bg-white p-2 rounded text-gray-600">Metric cited: KPI_DASHBOARD (tracking_quality_flag=&quot;degraded&quot;)</div>
            </div>
            <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
              <h3 className="text-orange-800 font-bold mb-1">⚠️ Influencer Traffic Spiked (Low Quality)</h3>
              <p className="text-sm text-orange-700">On Day T-12, sessions hit 15,000 but the `wallet_connect_rate` plummeted due to low intent.</p>
              <div className="mt-3 text-xs font-mono bg-white p-2 rounded text-gray-600">Metric cited: SITE_FUNNEL_DAILY (Influencer sessions up 150x)</div>
            </div>
            <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-blue-800 font-bold mb-1">📈 Experiment &quot;EXP-CTA-001&quot; Won</h3>
              <p className="text-sm text-blue-700">Refreshing the CTA copy yielded a 16% relative uplift in conversion rate from T+2 onwards.</p>
               <div className="mt-3 text-xs font-mono bg-white p-2 rounded text-gray-600">Metric cited: EXPERIMENTS (primary_metric=&quot;wallet_connect_rate&quot;)</div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="prose prose-sm max-w-none">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Weekly Exec Narrative (TGE Launch Week)</h2>
            <p className="mb-2"><strong>Executive Summary:</strong> The TGE launch generated sustained momentum, surviving an early tracking incident to close the week 15% above budget pacing targets.</p>
            <ul>
              <li><strong>Wins:</strong> Meta Retargeting (MOF) exceeded efficiency targets by 18%; the EXP-CTA-001 variant was successfully deployed.</li>
              <li><strong>Issues:</strong> Google non-brand auction pressure increased our CPA by $8. Tracking incident on T-6 caused temporary reporting anomalies (since recovered).</li>
              <li><strong>Next Actions:</strong> Shift 20% of Google budget to brand + exact match intent. Scale Meta Video Prospecting by 15% daily.</li>
            </ul>
             <div className="mt-4 border-t pt-4 text-xs font-mono text-gray-500">
               Metrics cited: KPI_DASHBOARD (pacing_vs_plan=&quot;on_track&quot;), EXPERIMENTS, GOOGLE_ADS_DAILY (average_cpc rising)
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
