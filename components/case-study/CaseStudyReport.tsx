'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CaseStudyReportData, EventCategory, EvidenceKey } from '@/lib/data/caseStudySelectors';
import { CaseStudyKpiStrip } from '@/components/case-study/CaseStudyKpiStrip';
import { CaseStudyTimeline } from '@/components/case-study/CaseStudyTimeline';
import { CaseStudyActPanel } from '@/components/case-study/CaseStudyActPanel';
import { CaseStudyFlowDiagram } from '@/components/case-study/CaseStudyFlowDiagram';
import { CaseStudyEvidenceAnnex } from '@/components/case-study/CaseStudyEvidenceAnnex';
import { LineTrendChart } from '@/components/LineTrendChart';

function evidenceCardClass(activeKey: EvidenceKey | null, keys: EvidenceKey[]) {
  return `rounded-xl border border-slate-800 bg-slate-900 p-4 ${activeKey && keys.includes(activeKey) ? 'ring-2 ring-cyan-500/50' : ''}`;
}

export function CaseStudyReport({ data }: { data: CaseStudyReportData }) {
  const [chartMode, setChartMode] = useState<'absolute' | 'indexed'>('absolute');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(['Awareness', 'Paid', 'Measurement', 'Experiment']);
  const [activeEvidenceKey, setActiveEvidenceKey] = useState<EvidenceKey | null>(null);

  const weeklyChartData = chartMode === 'absolute' ? data.weeklyAbsolute : data.weeklyIndexed;
  const weeklyChartLines =
    chartMode === 'absolute'
      ? [
          { key: 'spend', label: 'Spend', color: '#38bdf8' },
          { key: 'sessions', label: 'Sessions', color: '#22c55e' },
          { key: 'conversions', label: 'Conversions', color: '#f59e0b' }
        ]
      : [
          { key: 'spendIndex', label: 'Spend Index', color: '#38bdf8' },
          { key: 'sessionsIndex', label: 'Sessions Index', color: '#22c55e' },
          { key: 'conversionsIndex', label: 'Conversions Index', color: '#f59e0b' }
        ];

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const influencerPeak = useMemo(() => {
    const max = [...data.influencerAnomaly].sort((a, b) => b.sessions - a.sessions)[0];
    return max ?? { date: 'N/A', sessions: 0, purchases: 0, walletConnectRate: 0 };
  }, [data.influencerAnomaly]);

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Growth Command Center Report</p>
        <h2 className="text-3xl font-semibold text-slate-100">Case Study: TGE Launch Performance and Decision Trace</h2>
        <p className="max-w-4xl text-sm text-slate-300">{data.abstract.thesis}</p>
        <p className="text-xs text-slate-400">Period: {data.period.start} to {data.period.end} • {data.abstract.caveat}</p>
      </header>

      <CaseStudyKpiStrip {...data.headlineKpis} />

      <div className="sticky top-0 z-20 rounded-xl border border-slate-800 bg-slate-950/95 p-3 backdrop-blur">
        <nav className="flex flex-wrap gap-2 text-xs">
          <a href="#macro" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Macro Arc</a>
          <a href="#timeline" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Events</a>
          <a href="#act0" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Act 0</a>
          <a href="#act1" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Act 1</a>
          <a href="#act2" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Act 2</a>
          <a href="#act3" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Act 3</a>
          <a href="#act4" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Act 4</a>
          <a href="#evidence-annex" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Annex</a>
        </nav>
      </div>

      <section id="macro" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-100">Exhibit 1: 90-Day Performance Arc</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setChartMode('absolute')}
              className={`rounded-md px-3 py-1.5 text-xs ${chartMode === 'absolute' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Absolute
            </button>
            <button
              onClick={() => setChartMode('indexed')}
              className={`rounded-md px-3 py-1.5 text-xs ${chartMode === 'indexed' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Indexed (W1=100)
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <LineTrendChart data={weeklyChartData as Array<Record<string, number | string>>} xKey="week" lines={weeklyChartLines} height={320} />
          <p className="mt-2 text-xs text-slate-400">Source: WEEKLY_REPORTS</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {data.phaseComparisons.map((phase) => (
            <div key={phase.phase} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">{phase.phase}</p>
              <p className="text-sm text-slate-200">Spend ${Math.round(phase.spend).toLocaleString()}</p>
              <p className="text-sm text-slate-200">Sessions {Math.round(phase.sessions).toLocaleString()}</p>
              <p className="text-sm text-slate-200">Conversions {Math.round(phase.conversions).toLocaleString()}</p>
              <p className="text-sm text-cyan-300">Conv Rate Proxy {phase.convRateProxy.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </section>

      <section id="timeline" className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-100">Event Intelligence Timeline</h3>
        <CaseStudyTimeline
          events={data.events}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onSelectEvent={(keys) => setActiveEvidenceKey(keys[0] ?? null)}
        />
      </section>

      {data.acts.map((act) => (
        <CaseStudyActPanel
          key={act.id}
          id={act.id}
          title={act.title}
          range={act.range}
          thesis={act.thesis}
          action={act.action}
          result={act.result}
        >
          {act.id === 'act0' && (
            <div className={evidenceCardClass(activeEvidenceKey, ['weekly-arc'])}>
              <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Weekly Momentum (Awareness Build)</p>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={data.weeklyAbsolute.slice(0, 4)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="week" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-slate-400">Source: WEEKLY_REPORTS</p>
            </div>
          )}

          {act.id === 'act1' && (
            <div className={evidenceCardClass(activeEvidenceKey, ['channel-quality', 'campaign-outliers'])}>
              <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Channel Quality Dispersion</p>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={data.channelQuality}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="channel" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip />
                    <Bar dataKey="walletConnectRate" fill="#38bdf8" name="Wallet Connect Rate %" />
                    <Bar dataKey="purchaseRate" fill="#f59e0b" name="Purchase Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-slate-400">Source: SITE_FUNNEL_DAILY</p>
            </div>
          )}

          {act.id === 'act2' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className={evidenceCardClass(activeEvidenceKey, ['search-pressure'])}>
                <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Search Auction Pressure</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <LineChart data={data.searchPressure}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip />
                      <Line type="monotone" dataKey="brandCpc" stroke="#22c55e" dot={false} />
                      <Line type="monotone" dataKey="nonBrandCpc" stroke="#f97316" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-slate-400">Source: GOOGLE_ADS_DAILY</p>
              </div>
              <div className={evidenceCardClass(activeEvidenceKey, ['influencer-anomaly'])}>
                <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Influencer Spike Quality Mismatch</p>
                <p className="text-sm text-slate-200">Peak day: {influencerPeak.date}</p>
                <p className="text-sm text-slate-200">Sessions: {Math.round(influencerPeak.sessions).toLocaleString()}</p>
                <p className="text-sm text-slate-200">Purchases: {Math.round(influencerPeak.purchases).toLocaleString()}</p>
                <p className="text-sm text-amber-300">Wallet Connect Rate: {influencerPeak.walletConnectRate.toFixed(2)}%</p>
                <p className="mt-2 text-xs text-slate-400">Source: SITE_FUNNEL_DAILY (channel=Influencer)</p>
              </div>
            </div>
          )}

          {act.id === 'act3' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className={evidenceCardClass(activeEvidenceKey, ['tracking-break'])}>
                <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Spend vs Conversion Efficiency Collapse</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <LineChart data={data.trackingBreak}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip />
                      <Line type="monotone" dataKey="spend" stroke="#38bdf8" dot={false} />
                      <Line type="monotone" dataKey="conversions" stroke="#ef4444" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-slate-400">Source: WEEKLY_REPORTS</p>
              </div>
              <CaseStudyFlowDiagram />
            </div>
          )}

          {act.id === 'act4' && (
            <div className="grid gap-3 md:grid-cols-2">
              <div className={evidenceCardClass(activeEvidenceKey, ['experiment-lift'])}>
                <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Experiment Uplift Ledger</p>
                <ul className="space-y-2 text-sm text-slate-200">
                  {data.experiments.map((exp) => (
                    <li key={exp.id} className="rounded border border-slate-800 bg-slate-950 p-2">
                      <span className="font-semibold">{exp.id}</span> • {exp.metric} •{' '}
                      <span className={exp.upliftPct >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{exp.upliftPct.toFixed(1)}%</span>
                      <p className="text-xs text-slate-400">{exp.decision}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-slate-400">Source: EXPERIMENTS</p>
              </div>
              <div className={evidenceCardClass(activeEvidenceKey, ['retargeting-bottleneck'])}>
                <p className="mb-2 text-sm font-semibold text-slate-100">Evidence: Retargeting Progression Bottleneck</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={data.retargetingBottleneck}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="bucket" stroke="#cbd5e1" interval={0} angle={-18} height={80} textAnchor="end" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip />
                      <Bar dataKey="progressionRate" fill="#22c55e" name="Progression Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-slate-400">Source: RETARGETING_AUDIENCES_DAILY</p>
              </div>
            </div>
          )}
        </CaseStudyActPanel>
      ))}

      <CaseStudyEvidenceAnnex data={data} activeEvidenceKey={activeEvidenceKey} />

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-slate-100">Decision Log and Next 30 Days</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
          <li>Constrain low-intent traffic sources when session growth decouples from wallet progression.</li>
          <li>Keep non-brand search under a CPC guardrail with weekly impression-share diagnostics.</li>
          <li>Make anomaly detection a release-gate requirement for tracking changes near launch windows.</li>
          <li>Scale experiment winners only after retargeting-stage progression checks stay within control bands.</li>
        </ul>
      </section>
    </section>
  );
}
