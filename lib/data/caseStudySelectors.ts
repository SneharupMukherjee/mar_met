import {
  ATTRIBUTION_MODELS,
  EXPERIMENTS,
  GOOGLE_ADS_DAILY,
  META_ADS_DAILY,
  RETARGETING_AUDIENCES_DAILY,
  SITE_FUNNEL_DAILY
} from '@/lib/data/dashboardTabs';
import { WeeklyReportRow } from '@/lib/data/types';

export type EvidenceKey =
  | 'weekly-arc'
  | 'channel-quality'
  | 'search-pressure'
  | 'influencer-anomaly'
  | 'tracking-break'
  | 'experiment-lift'
  | 'retargeting-bottleneck'
  | 'campaign-outliers'
  | 'attribution-gap';

export type EventCategory = 'Awareness' | 'Paid' | 'Measurement' | 'Experiment';

export type CaseStudyEvent = {
  id: string;
  dayOffset: number;
  date: string;
  title: string;
  category: EventCategory;
  summary: string;
  evidenceKeys: EvidenceKey[];
};

export type CaseStudyAct = {
  id: 'act0' | 'act1' | 'act2' | 'act3' | 'act4';
  title: string;
  range: string;
  thesis: string;
  action: string;
  result: string;
  evidenceKeys: EvidenceKey[];
};

export type CaseStudyReportData = {
  period: { start: string; end: string };
  abstract: { thesis: string; caveat: string };
  headlineKpis: {
    spend: number;
    sessions: number;
    conversions: number;
    convPer1kSpend: number;
    convRateProxy: number;
  };
  phaseComparisons: Array<{ phase: string; spend: number; sessions: number; conversions: number; convRateProxy: number }>;
  weeklyAbsolute: Array<{ week: string; spend: number; sessions: number; conversions: number; convPer1kSpend: number; convRateProxy: number }>;
  weeklyIndexed: Array<{ week: string; spendIndex: number; sessionsIndex: number; conversionsIndex: number }>;
  events: CaseStudyEvent[];
  acts: CaseStudyAct[];
  channelQuality: Array<{
    channel: string;
    sessions: number;
    walletConnects: number;
    purchases: number;
    spend: number;
    revenue: number;
    walletConnectRate: number;
    purchaseRate: number;
    roas: number;
  }>;
  searchPressure: Array<{ date: string; brandCpc: number; nonBrandCpc: number; cpcGapPct: number; brandIS: number; nonBrandIS: number }>;
  influencerAnomaly: Array<{ date: string; sessions: number; purchases: number; walletConnectRate: number }>;
  trackingBreak: Array<{ date: string; spend: number; conversions: number; convPer1kSpend: number }>;
  retargetingBottleneck: Array<{ bucket: string; audienceSize: number; progressedUsers: number; progressionRate: number; costPerProgressed: number }>;
  campaignOutliers: Array<{
    channel: 'Meta' | 'Google';
    campaign: string;
    spend: number;
    conversions: number;
    cpa: number;
    roas: number;
    flag: 'Scale' | 'Investigate' | 'Monitor';
  }>;
  attributionGap: Array<{ channel: string; platformRevenue: number; modeledRevenue: number; blendedRevenue: number; disagreementPct: number }>;
  experiments: Array<{ id: string; status: string; metric: string; upliftPct: number; decision: string }>;
};

function toPct(numerator: number, denominator: number): number {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

function toDate(baseStart: string, dayOffset: number): string {
  const d = new Date(`${baseStart}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + (dayOffset + 75));
  return d.toISOString().slice(0, 10);
}

function sum<T>(rows: T[], fn: (r: T) => number): number {
  return rows.reduce((acc, row) => acc + fn(row), 0);
}

export function buildCaseStudyReportData(weeklyReports: WeeklyReportRow[]): CaseStudyReportData {
  const sortedWeeks = [...weeklyReports].sort((a, b) => a.week_num - b.week_num);
  const period = {
    start: sortedWeeks[0]?.week_start ?? 'N/A',
    end: sortedWeeks.at(-1)?.week_end ?? 'N/A'
  };

  const totalSpend = sum(sortedWeeks, (r) => r.spend);
  const totalSessions = sum(sortedWeeks, (r) => r.sessions);
  const totalConversions = sum(sortedWeeks, (r) => r.conversions);

  const weeklyAbsolute = sortedWeeks.map((w) => ({
    week: `W${w.week_num}`,
    spend: w.spend,
    sessions: w.sessions,
    conversions: w.conversions,
    convPer1kSpend: w.spend > 0 ? (w.conversions / w.spend) * 1000 : 0,
    convRateProxy: w.sessions > 0 ? (w.conversions / w.sessions) * 100 : 0
  }));

  const baseWeek = weeklyAbsolute[0] ?? { spend: 1, sessions: 1, conversions: 1 };
  const weeklyIndexed = weeklyAbsolute.map((w) => ({
    week: w.week,
    spendIndex: (w.spend / Math.max(baseWeek.spend, 1)) * 100,
    sessionsIndex: (w.sessions / Math.max(baseWeek.sessions, 1)) * 100,
    conversionsIndex: (w.conversions / Math.max(baseWeek.conversions, 1)) * 100
  }));

  const phaseComparisons = [
    { phase: 'Act 0 (W1-W4)', rows: sortedWeeks.filter((w) => w.week_num >= 1 && w.week_num <= 4) },
    { phase: 'Ramp & Pressure (W5-W10)', rows: sortedWeeks.filter((w) => w.week_num >= 5 && w.week_num <= 10) },
    { phase: 'Recovery & Uplift (W11-W13)', rows: sortedWeeks.filter((w) => w.week_num >= 11 && w.week_num <= 13) }
  ].map((phase) => {
    const spend = sum(phase.rows, (r) => r.spend);
    const sessions = sum(phase.rows, (r) => r.sessions);
    const conversions = sum(phase.rows, (r) => r.conversions);
    return {
      phase: phase.phase,
      spend,
      sessions,
      conversions,
      convRateProxy: toPct(conversions, sessions)
    };
  });

  const channelQuality = Object.values(
    SITE_FUNNEL_DAILY.reduce<
      Record<string, { channel: string; sessions: number; walletConnects: number; purchases: number; spend: number; revenue: number }>
    >((acc, row) => {
      if (!acc[row.channel]) {
        acc[row.channel] = { channel: row.channel, sessions: 0, walletConnects: 0, purchases: 0, spend: 0, revenue: 0 };
      }
      acc[row.channel].sessions += row.sessions;
      acc[row.channel].walletConnects += row.walletConnects;
      acc[row.channel].purchases += row.purchases;
      acc[row.channel].spend += row.spend;
      acc[row.channel].revenue += row.revenue;
      return acc;
    }, {})
  )
    .map((row) => ({
      ...row,
      walletConnectRate: toPct(row.walletConnects, row.sessions),
      purchaseRate: toPct(row.purchases, row.sessions),
      roas: row.spend > 0 ? row.revenue / row.spend : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const searchPressure = Object.values(
    GOOGLE_ADS_DAILY.reduce<
      Record<string, { date: string; brandCpc: number; nonBrandCpc: number; brandIS: number; nonBrandIS: number }>
    >((acc, row) => {
      if (!acc[row.date]) {
        acc[row.date] = { date: row.date, brandCpc: 0, nonBrandCpc: 0, brandIS: 0, nonBrandIS: 0 };
      }
      if (row.intent === 'Brand') {
        acc[row.date].brandCpc = row.averageCpc;
        acc[row.date].brandIS = row.searchImpressionShare * 100;
      } else {
        acc[row.date].nonBrandCpc = row.averageCpc;
        acc[row.date].nonBrandIS = row.searchImpressionShare * 100;
      }
      return acc;
    }, {})
  )
    .map((d) => ({
      ...d,
      cpcGapPct: toPct(d.nonBrandCpc - d.brandCpc, Math.max(d.brandCpc, 0.0001))
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const influencerAnomaly = SITE_FUNNEL_DAILY.filter((r) => r.channel === 'Influencer')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({
      date: r.date,
      sessions: r.sessions,
      purchases: r.purchases,
      walletConnectRate: toPct(r.walletConnects, r.sessions)
    }));

  const trackingBreak = sortedWeeks.map((w) => ({
    date: `W${w.week_num}`,
    spend: w.spend,
    conversions: w.conversions,
    convPer1kSpend: w.spend > 0 ? (w.conversions / w.spend) * 1000 : 0
  }));

  const retargetingBottleneck = RETARGETING_AUDIENCES_DAILY.map((row) => ({
    bucket: row.bucket,
    audienceSize: row.audienceSize,
    progressedUsers: row.progressedUsers,
    progressionRate: toPct(row.progressedUsers, row.audienceSize),
    costPerProgressed: row.spend / Math.max(row.progressedUsers, 1)
  })).sort((a, b) => a.progressionRate - b.progressionRate);

  const campaignOutliers = [
    ...META_ADS_DAILY.map((r) => ({
      channel: 'Meta' as const,
      campaign: r.campaignName,
      spend: r.spend,
      conversions: r.purchases,
      revenue: r.revenue
    })),
    ...GOOGLE_ADS_DAILY.map((r) => ({
      channel: 'Google' as const,
      campaign: r.campaignName,
      spend: r.spend,
      conversions: r.conversions,
      revenue: r.revenue
    }))
  ];

  const campaignOutlierAgg = Object.values(
    campaignOutliers.reduce<
      Record<string, { channel: 'Meta' | 'Google'; campaign: string; spend: number; conversions: number; revenue: number }>
    >((acc, row) => {
      const key = `${row.channel}-${row.campaign}`;
      if (!acc[key]) acc[key] = { ...row };
      else {
        acc[key].spend += row.spend;
        acc[key].conversions += row.conversions;
        acc[key].revenue += row.revenue;
      }
      return acc;
    }, {})
  )
    .map((row) => {
      const cpa = row.spend / Math.max(row.conversions, 1);
      const roas = row.revenue / Math.max(row.spend, 1);
      const flag: 'Scale' | 'Investigate' | 'Monitor' = roas > 3.6 && cpa < 40 ? 'Scale' : cpa > 55 || roas < 2 ? 'Investigate' : 'Monitor';
      return { ...row, cpa, roas, flag };
    })
    .sort((a, b) => b.spend - a.spend);

  const latestWeek = [...new Set(ATTRIBUTION_MODELS.map((r) => r.weekStart))].sort().at(-1);
  const attributionGap = ATTRIBUTION_MODELS.filter((r) => r.weekStart === latestWeek).map((row) => {
    const blendedRevenue = Math.round((row.platformRevenue + row.modeledRevenue) / 2);
    return {
      channel: row.channel,
      platformRevenue: row.platformRevenue,
      modeledRevenue: row.modeledRevenue,
      blendedRevenue,
      disagreementPct: toPct(row.platformRevenue - row.modeledRevenue, Math.max(row.modeledRevenue, 1))
    };
  });

  const events: CaseStudyEvent[] = [
    {
      id: 'evt-revamp',
      dayOffset: -75,
      date: toDate(period.start, -75),
      title: 'Website Revamp Baseline Reset',
      category: 'Awareness',
      summary: 'Landing UX and messaging were overhauled to establish cleaner conversion baselines before paid scale.',
      evidenceKeys: ['weekly-arc']
    },
    {
      id: 'evt-partner',
      dayOffset: -60,
      date: toDate(period.start, -60),
      title: 'Partner Announcement Lift',
      category: 'Awareness',
      summary: 'Co-marketing announcements drove top-of-funnel volume without immediate downstream parity.',
      evidenceKeys: ['weekly-arc', 'channel-quality']
    },
    {
      id: 'evt-paid-ramp',
      dayOffset: -45,
      date: toDate(period.start, -45),
      title: 'Paid Engine Ramp',
      category: 'Paid',
      summary: 'Meta and Google spend scaled materially; quality constraints emerged in lower-intent segments.',
      evidenceKeys: ['channel-quality', 'campaign-outliers']
    },
    {
      id: 'evt-auction',
      dayOffset: -18,
      date: toDate(period.start, -18),
      title: 'Non-Brand Auction Pressure',
      category: 'Paid',
      summary: 'Non-brand CPC inflated while impression share deteriorated relative to brand terms.',
      evidenceKeys: ['search-pressure']
    },
    {
      id: 'evt-influencer',
      dayOffset: -12,
      date: toDate(period.start, -12),
      title: 'Influencer Traffic Spike',
      category: 'Paid',
      summary: 'Sessions spiked disproportionately versus purchase outcomes, indicating low-intent traffic quality.',
      evidenceKeys: ['influencer-anomaly', 'channel-quality']
    },
    {
      id: 'evt-break',
      dayOffset: -6,
      date: toDate(period.start, -6),
      title: 'Tracking Break Incident',
      category: 'Measurement',
      summary: 'Conversion reporting collapsed while spend remained active, triggering anomaly workflows.',
      evidenceKeys: ['tracking-break']
    },
    {
      id: 'evt-exp',
      dayOffset: 2,
      date: toDate(period.start, 2),
      title: 'Experiment Uplift Window',
      category: 'Experiment',
      summary: 'CTA experiment entered rollout and improved conversion outcomes through launch period.',
      evidenceKeys: ['experiment-lift', 'retargeting-bottleneck']
    }
  ];

  const acts: CaseStudyAct[] = [
    {
      id: 'act0',
      title: 'Act 0: Priming the Market',
      range: 'T-75 to T-45',
      thesis: 'Before paid scale, the team built awareness and fixed conversion baselines to reduce noisy decision-making.',
      action: 'Website revamp + content/community/partnership cadence with periodic KOL pulses.',
      result: 'Sessions ramped steadily while conversion efficiency remained intentionally secondary.',
      evidenceKeys: ['weekly-arc']
    },
    {
      id: 'act1',
      title: 'Act 1: Reality Check',
      range: 'T-45 to T-21',
      thesis: 'Paid reach rose faster than quality progression through the wallet and purchase funnel.',
      action: 'Introduced quality-focused monitoring instead of linear spend scaling.',
      result: 'Channel mix revealed conversion leakage despite healthy topline volume.',
      evidenceKeys: ['channel-quality', 'campaign-outliers']
    },
    {
      id: 'act2',
      title: 'Act 2: Refusing to Scale Blindly',
      range: 'T-21 to T-10',
      thesis: 'Search non-brand economics weakened as competition increased.',
      action: 'Shifted emphasis to higher-intent terms and constrained inefficient growth pockets.',
      result: 'CPC pressure was contained while preserving core conversion throughput.',
      evidenceKeys: ['search-pressure', 'influencer-anomaly']
    },
    {
      id: 'act3',
      title: 'Act 3: Measurement Integrity Crisis',
      range: 'T-10 to T-1',
      thesis: 'A tracking break created false performance collapse signals.',
      action: 'War-room anomaly detection, pipeline validation, and recovery protocols.',
      result: 'Reporting reliability returned and downstream decision quality was restored.',
      evidenceKeys: ['tracking-break']
    },
    {
      id: 'act4',
      title: 'Act 4: Launch Capture and Conversion Lift',
      range: 'TGE Day to T+14',
      thesis: 'Experiment-led conversion improvements captured intent during peak demand.',
      action: 'Rolled out winning CTA variant and tightened retargeting progression.',
      result: 'Conversion efficiency and throughput improved through the post-launch window.',
      evidenceKeys: ['experiment-lift', 'retargeting-bottleneck', 'attribution-gap']
    }
  ];

  return {
    period,
    abstract: {
      thesis:
        'Growth was stabilized by sequencing awareness, enforcing quality gates under paid pressure, and using measurement discipline plus experimentation to capture launch demand.',
      caveat:
        'All values are synthetic and intended for planning; evidence traces show directional relationships, not audited financial reporting.'
    },
    headlineKpis: {
      spend: totalSpend,
      sessions: totalSessions,
      conversions: totalConversions,
      convPer1kSpend: totalSpend > 0 ? (totalConversions / totalSpend) * 1000 : 0,
      convRateProxy: toPct(totalConversions, totalSessions)
    },
    phaseComparisons,
    weeklyAbsolute,
    weeklyIndexed,
    events,
    acts,
    channelQuality,
    searchPressure,
    influencerAnomaly,
    trackingBreak,
    retargetingBottleneck,
    campaignOutliers: campaignOutlierAgg,
    attributionGap,
    experiments: EXPERIMENTS.map((row) => ({
      id: row.id,
      status: row.status,
      metric: row.primaryMetric,
      upliftPct: row.upliftPct,
      decision: row.decision
    }))
  };
}
