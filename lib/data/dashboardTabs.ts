export type MetaAdsDailyRow = {
  date: string;
  campaignId: string;
  campaignName: string;
  creativeAngle: 'utility' | 'social-proof' | 'urgency';
  spend: number;
  impressions: number;
  clicks: number;
  purchases: number;
  revenue: number;
  frequency: number;
  ctr: number;
  cpaPurchase: number;
};

export type GoogleAdsDailyRow = {
  date: string;
  campaignId: string;
  campaignName: string;
  intent: 'Brand' | 'Non-Brand';
  spend: number;
  clicks: number;
  conversions: number;
  revenue: number;
  averageCpc: number;
  searchImpressionShare: number;
};

export type SiteFunnelDailyRow = {
  date: string;
  channel: 'Meta' | 'Google' | 'Organic' | 'Influencer';
  sessions: number;
  walletConnects: number;
  purchases: number;
  spend: number;
  revenue: number;
};

export type RetargetingAudienceDailyRow = {
  date: string;
  bucket: 'visited_bounced' | 'engaged_no_wallet' | 'wallet_no_task' | 'task_no_ready' | 'ready_no_participation';
  audienceSize: number;
  progressedUsers: number;
  spend: number;
};

export type AttributionModelRow = {
  weekStart: string;
  channel: 'Meta' | 'Google' | 'Organic' | 'Influencer';
  platformRevenue: number;
  modeledRevenue: number;
};

export type ExperimentRow = {
  id: string;
  hypothesis: string;
  startDate: string;
  endDate: string;
  status: 'running' | 'won' | 'lost';
  primaryMetric: string;
  upliftPct: number;
  decision: string;
};

const dates = ['2026-01-13', '2026-01-14', '2026-01-15', '2026-01-16', '2026-01-17', '2026-01-18', '2026-01-19'];

export const META_ADS_DAILY: MetaAdsDailyRow[] = dates.flatMap((date, i) => {
  const f = i + 1;
  const fatigueFrequency = 1.9 + f * 0.35;
  const fatigueCtr = 0.021 - i * 0.0016;
  return [
    {
      date,
      campaignId: 'C_M1',
      campaignName: 'Meta Prospecting Video',
      creativeAngle: 'utility',
      spend: 4200 + i * 180,
      impressions: 115000 + i * 6000,
      clicks: 2550 + i * 70,
      purchases: 94 + i * 4,
      revenue: 18400 + i * 950,
      frequency: 1.5 + i * 0.12,
      ctr: 0.022 + i * 0.0004,
      cpaPurchase: (4200 + i * 180) / (94 + i * 4)
    },
    {
      date,
      campaignId: 'C_M2',
      campaignName: 'Meta Retargeting Carousel',
      creativeAngle: 'social-proof',
      spend: 2900 + i * 140,
      impressions: 62000 + i * 2000,
      clicks: 1430 + i * 25,
      purchases: 110 + i * 6,
      revenue: 17100 + i * 780,
      frequency: 2.2 + i * 0.15,
      ctr: 0.029 - i * 0.0002,
      cpaPurchase: (2900 + i * 140) / (110 + i * 6)
    },
    {
      date,
      campaignId: 'C_M3',
      campaignName: 'Meta Creator Drop',
      creativeAngle: 'urgency',
      spend: 1600 + i * 80,
      impressions: 78000 + i * 3500,
      clicks: 920 + i * 10,
      purchases: 26 + Math.max(0, 4 - i),
      revenue: 3600 + i * 120,
      frequency: fatigueFrequency,
      ctr: fatigueCtr,
      cpaPurchase: (1600 + i * 80) / (26 + Math.max(0, 4 - i))
    }
  ];
});

export const GOOGLE_ADS_DAILY: GoogleAdsDailyRow[] = dates.flatMap((date, i) => {
  const pressure = i >= 2 && i <= 5;
  const nonBrandCpc = pressure ? 2.35 + i * 0.09 : 1.82 + i * 0.05;
  return [
    {
      date,
      campaignId: 'C_G1',
      campaignName: 'Google Brand Core',
      intent: 'Brand',
      spend: 2100 + i * 110,
      clicks: 1780 + i * 95,
      conversions: 120 + i * 7,
      revenue: 19800 + i * 1020,
      averageCpc: 1.15 + i * 0.01,
      searchImpressionShare: 0.78 - i * 0.005
    },
    {
      date,
      campaignId: 'C_G2',
      campaignName: 'Google Non-Brand Intent',
      intent: 'Non-Brand',
      spend: 3400 + i * 210,
      clicks: Math.round((3400 + i * 210) / nonBrandCpc),
      conversions: 92 + (pressure ? -6 + i : i * 2),
      revenue: 15200 + i * 520,
      averageCpc: nonBrandCpc,
      searchImpressionShare: pressure ? 0.41 - i * 0.01 : 0.49 - i * 0.008
    }
  ];
});

export const SITE_FUNNEL_DAILY: SiteFunnelDailyRow[] = dates.flatMap((date, i) => [
  {
    date,
    channel: 'Meta',
    sessions: 13000 + i * 820,
    walletConnects: 1560 + i * 95,
    purchases: 220 + i * 9,
    spend: 8700 + i * 320,
    revenue: 38100 + i * 1440
  },
  {
    date,
    channel: 'Google',
    sessions: 9800 + i * 430,
    walletConnects: 1370 + i * 61,
    purchases: 191 + i * 7,
    spend: 5500 + i * 260,
    revenue: 35100 + i * 1280
  },
  {
    date,
    channel: 'Organic',
    sessions: 4700 + i * 120,
    walletConnects: 620 + i * 20,
    purchases: 118 + i * 4,
    spend: 0,
    revenue: 15200 + i * 510
  },
  {
    date,
    channel: 'Influencer',
    sessions: i === 3 ? 15000 : 900 + i * 40,
    walletConnects: i === 3 ? 290 : 95 + i * 4,
    purchases: i === 3 ? 22 : 14 + i,
    spend: i === 3 ? 2800 : 540 + i * 20,
    revenue: i === 3 ? 2100 : 1800 + i * 60
  }
]);

export const RETARGETING_AUDIENCES_DAILY: RetargetingAudienceDailyRow[] = [
  { date: '2026-01-19', bucket: 'visited_bounced', audienceSize: 14200, progressedUsers: 2130, spend: 1600 },
  { date: '2026-01-19', bucket: 'engaged_no_wallet', audienceSize: 8600, progressedUsers: 1710, spend: 1400 },
  { date: '2026-01-19', bucket: 'wallet_no_task', audienceSize: 5100, progressedUsers: 660, spend: 1350 },
  { date: '2026-01-19', bucket: 'task_no_ready', audienceSize: 3200, progressedUsers: 760, spend: 980 },
  { date: '2026-01-19', bucket: 'ready_no_participation', audienceSize: 1700, progressedUsers: 490, spend: 760 }
];

export const ATTRIBUTION_MODELS: AttributionModelRow[] = [
  { weekStart: '2025-12-29', channel: 'Meta', platformRevenue: 61000, modeledRevenue: 54600 },
  { weekStart: '2025-12-29', channel: 'Google', platformRevenue: 57200, modeledRevenue: 62400 },
  { weekStart: '2025-12-29', channel: 'Organic', platformRevenue: 21500, modeledRevenue: 24200 },
  { weekStart: '2025-12-29', channel: 'Influencer', platformRevenue: 9400, modeledRevenue: 5900 },
  { weekStart: '2026-01-05', channel: 'Meta', platformRevenue: 64600, modeledRevenue: 57400 },
  { weekStart: '2026-01-05', channel: 'Google', platformRevenue: 60300, modeledRevenue: 66200 },
  { weekStart: '2026-01-05', channel: 'Organic', platformRevenue: 22700, modeledRevenue: 25800 },
  { weekStart: '2026-01-05', channel: 'Influencer', platformRevenue: 13200, modeledRevenue: 7600 },
  { weekStart: '2026-01-12', channel: 'Meta', platformRevenue: 69100, modeledRevenue: 62000 },
  { weekStart: '2026-01-12', channel: 'Google', platformRevenue: 64400, modeledRevenue: 70200 },
  { weekStart: '2026-01-12', channel: 'Organic', platformRevenue: 23900, modeledRevenue: 27100 },
  { weekStart: '2026-01-12', channel: 'Influencer', platformRevenue: 11100, modeledRevenue: 6900 }
];

export const EXPERIMENTS: ExperimentRow[] = [
  {
    id: 'EXP-CTA-001',
    hypothesis: 'Simpler CTA copy increases wallet connect rate for warm traffic.',
    startDate: '2026-01-12',
    endDate: '2026-01-19',
    status: 'won',
    primaryMetric: 'wallet_connect_rate',
    upliftPct: 16,
    decision: 'Ship variant to all retargeting traffic.'
  },
  {
    id: 'EXP-LP-004',
    hypothesis: 'Collapsing FAQ above fold improves purchase conversion.',
    startDate: '2026-01-10',
    endDate: '2026-01-17',
    status: 'lost',
    primaryMetric: 'purchase_rate',
    upliftPct: -4.8,
    decision: 'Rollback and test proof modules separately.'
  },
  {
    id: 'EXP-VID-009',
    hypothesis: 'Short-form creator cut improves CTR at similar CPA.',
    startDate: '2026-01-16',
    endDate: '2026-01-23',
    status: 'running',
    primaryMetric: 'ctr',
    upliftPct: 5.2,
    decision: 'Continue until sample reaches 95% power.'
  }
];
