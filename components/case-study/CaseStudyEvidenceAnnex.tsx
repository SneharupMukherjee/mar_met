'use client';

import { useState } from 'react';
import { CaseStudyReportData, EvidenceKey } from '@/lib/data/caseStudySelectors';

function highlight(active: EvidenceKey | null, key: EvidenceKey) {
  return active === key ? 'ring-2 ring-cyan-500/50' : '';
}

export function CaseStudyEvidenceAnnex({
  data,
  activeEvidenceKey
}: {
  data: CaseStudyReportData;
  activeEvidenceKey: EvidenceKey | null;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    channel: true,
    campaigns: false,
    attribution: false,
    experiments: false
  });

  const toggle = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section id="evidence-annex" className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-100">Evidence Annex</h3>

      <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ${highlight(activeEvidenceKey, 'channel-quality')}`}>
        <button onClick={() => toggle('channel')} className="flex w-full items-center justify-between">
          <span className="font-semibold text-slate-100">Exhibit A: Channel Quality Table</span>
          <span className="text-xs text-slate-400">{openSections.channel ? 'Collapse' : 'Expand'}</span>
        </button>
        {openSections.channel && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-3 py-2 text-left">Channel</th>
                  <th className="px-3 py-2 text-right">Sessions</th>
                  <th className="px-3 py-2 text-right">Purchases</th>
                  <th className="px-3 py-2 text-right">Wallet Connect Rate</th>
                  <th className="px-3 py-2 text-right">Purchase Rate</th>
                  <th className="px-3 py-2 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {data.channelQuality.map((row) => (
                  <tr key={row.channel} className="border-t border-slate-800">
                    <td className="px-3 py-2">{row.channel}</td>
                    <td className="px-3 py-2 text-right">{Math.round(row.sessions).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{Math.round(row.purchases).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{row.walletConnectRate.toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{row.purchaseRate.toFixed(2)}%</td>
                    <td className="px-3 py-2 text-right">{row.spend > 0 ? row.roas.toFixed(2) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-400">Source: SITE_FUNNEL_DAILY</p>
          </div>
        )}
      </div>

      <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ${highlight(activeEvidenceKey, 'campaign-outliers')}`}>
        <button onClick={() => toggle('campaigns')} className="flex w-full items-center justify-between">
          <span className="font-semibold text-slate-100">Exhibit B: Campaign Outlier Flags</span>
          <span className="text-xs text-slate-400">{openSections.campaigns ? 'Collapse' : 'Expand'}</span>
        </button>
        {openSections.campaigns && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-3 py-2 text-left">Channel</th>
                  <th className="px-3 py-2 text-left">Campaign</th>
                  <th className="px-3 py-2 text-right">Spend</th>
                  <th className="px-3 py-2 text-right">CPA</th>
                  <th className="px-3 py-2 text-right">ROAS</th>
                  <th className="px-3 py-2 text-left">Flag</th>
                </tr>
              </thead>
              <tbody>
                {data.campaignOutliers.map((row) => (
                  <tr key={`${row.channel}-${row.campaign}`} className="border-t border-slate-800">
                    <td className="px-3 py-2">{row.channel}</td>
                    <td className="px-3 py-2">{row.campaign}</td>
                    <td className="px-3 py-2 text-right">${Math.round(row.spend).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">${row.cpa.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.roas.toFixed(2)}</td>
                    <td className={`px-3 py-2 ${row.flag === 'Scale' ? 'text-emerald-300' : row.flag === 'Investigate' ? 'text-rose-300' : 'text-slate-300'}`}>
                      {row.flag}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-400">Source: META_ADS_DAILY, GOOGLE_ADS_DAILY</p>
          </div>
        )}
      </div>

      <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ${highlight(activeEvidenceKey, 'attribution-gap')}`}>
        <button onClick={() => toggle('attribution')} className="flex w-full items-center justify-between">
          <span className="font-semibold text-slate-100">Exhibit C: Attribution Disagreement Snapshot</span>
          <span className="text-xs text-slate-400">{openSections.attribution ? 'Collapse' : 'Expand'}</span>
        </button>
        {openSections.attribution && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-3 py-2 text-left">Channel</th>
                  <th className="px-3 py-2 text-right">Platform</th>
                  <th className="px-3 py-2 text-right">Modeled</th>
                  <th className="px-3 py-2 text-right">Blended</th>
                  <th className="px-3 py-2 text-right">Gap %</th>
                </tr>
              </thead>
              <tbody>
                {data.attributionGap.map((row) => (
                  <tr key={row.channel} className="border-t border-slate-800">
                    <td className="px-3 py-2">{row.channel}</td>
                    <td className="px-3 py-2 text-right">${row.platformRevenue.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">${row.modeledRevenue.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">${row.blendedRevenue.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">{row.disagreementPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-400">Source: ATTRIBUTION_MODELS</p>
          </div>
        )}
      </div>

      <div className={`rounded-xl border border-slate-800 bg-slate-900 p-4 ${highlight(activeEvidenceKey, 'experiment-lift')}`}>
        <button onClick={() => toggle('experiments')} className="flex w-full items-center justify-between">
          <span className="font-semibold text-slate-100">Exhibit D: Experiment Ledger</span>
          <span className="text-xs text-slate-400">{openSections.experiments ? 'Collapse' : 'Expand'}</span>
        </button>
        {openSections.experiments && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Metric</th>
                  <th className="px-3 py-2 text-right">Uplift</th>
                  <th className="px-3 py-2 text-left">Decision</th>
                </tr>
              </thead>
              <tbody>
                {data.experiments.map((row) => (
                  <tr key={row.id} className="border-t border-slate-800">
                    <td className="px-3 py-2 font-medium">{row.id}</td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2">{row.metric}</td>
                    <td className={`px-3 py-2 text-right ${row.upliftPct >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{row.upliftPct.toFixed(1)}%</td>
                    <td className="px-3 py-2">{row.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-400">Source: EXPERIMENTS</p>
          </div>
        )}
      </div>
    </section>
  );
}
