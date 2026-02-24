export const sheetTables = {
  KPI_DASHBOARD: [
    { week_start: '2026-01-05', channel: 'Paid Search', spend: 20000, revenue: 76000, roas: 3.8, cpa: 41, ctr: 0.041, cv_rate: 0.058 },
    { week_start: '2026-01-05', channel: 'Paid Social', spend: 16000, revenue: 43200, roas: 2.7, cpa: 55, ctr: 0.019, cv_rate: 0.033 },
    { week_start: '2026-01-05', channel: 'Affiliate', spend: 7000, revenue: 24500, roas: 3.5, cpa: 47, ctr: 0.027, cv_rate: 0.046 },
    { week_start: '2026-01-12', channel: 'Paid Search', spend: 22000, revenue: 88000, roas: 4.0, cpa: 39, ctr: 0.044, cv_rate: 0.061 },
    { week_start: '2026-01-12', channel: 'Paid Social', spend: 17000, revenue: 45900, roas: 2.7, cpa: 54, ctr: 0.018, cv_rate: 0.032 },
    { week_start: '2026-01-12', channel: 'Affiliate', spend: 6800, revenue: 25840, roas: 3.8, cpa: 43, ctr: 0.029, cv_rate: 0.049 },
    { week_start: '2026-01-19', channel: 'Paid Search', spend: 23500, revenue: 98700, roas: 4.2, cpa: 37, ctr: 0.045, cv_rate: 0.064 },
    { week_start: '2026-01-19', channel: 'Paid Social', spend: 17500, revenue: 49000, roas: 2.8, cpa: 52, ctr: 0.02, cv_rate: 0.034 },
    { week_start: '2026-01-19', channel: 'Affiliate', spend: 7200, revenue: 28080, roas: 3.9, cpa: 42, ctr: 0.03, cv_rate: 0.051 },
    { week_start: '2026-01-26', channel: 'Paid Search', spend: 24000, revenue: 100800, roas: 4.2, cpa: 36, ctr: 0.046, cv_rate: 0.066 },
    { week_start: '2026-01-26', channel: 'Paid Social', spend: 18200, revenue: 52780, roas: 2.9, cpa: 50, ctr: 0.021, cv_rate: 0.036 },
    { week_start: '2026-01-26', channel: 'Affiliate', spend: 7300, revenue: 28470, roas: 3.9, cpa: 41, ctr: 0.03, cv_rate: 0.052 }
  ],
  INSIGHTS: [
    { id: 1, title: 'Paid Search momentum', narrative: 'Paid Search ROAS rose from 3.8 to 4.2 in 4 weeks while CPA dropped.', impact: 'high', cited_metrics: ['KPI_DASHBOARD.ROAS_by_channel[Paid Search,2026-01-05..2026-01-26]', 'KPI_DASHBOARD.CPA_by_channel[Paid Search,2026-01-05..2026-01-26]'] },
    { id: 2, title: 'Paid Social efficiency stabilizing', narrative: 'Paid Social CPA improved from 55 to 50 despite modest CTR gains.', impact: 'medium', cited_metrics: ['KPI_DASHBOARD.CPA_by_channel[Paid Social,2026-01-05..2026-01-26]', 'KPI_DASHBOARD.CTR_by_channel[Paid Social,2026-01-05..2026-01-26]'] },
    { id: 3, title: 'Affiliate conversion strength', narrative: 'Affiliate conversion rate increased to 5.2% with consistent ROAS around 3.9.', impact: 'medium', cited_metrics: ['KPI_DASHBOARD.ConversionRate_by_channel[Affiliate,2026-01-05..2026-01-26]', 'KPI_DASHBOARD.ROAS_by_channel[Affiliate,2026-01-05..2026-01-26]'] },
    { id: 4, title: 'Revenue concentration risk', narrative: 'Paid Search now contributes over 55% of weekly revenue, increasing channel concentration.', impact: 'high', cited_metrics: ['KPI_DASHBOARD.Revenue_share_by_channel[all,2026-01-26]'] },
    { id: 5, title: 'Spend scaling still profitable', narrative: 'Total spend increased 13% across the month while blended ROAS improved.', impact: 'high', cited_metrics: ['KPI_DASHBOARD.Total_spend[2026-01-05..2026-01-26]', 'KPI_DASHBOARD.Blended_ROAS[2026-01-05..2026-01-26]'] },
    { id: 6, title: 'Search CTR quality', narrative: 'Search CTR climbed to 4.6%, supporting lower CPA and higher CVR.', impact: 'medium', cited_metrics: ['KPI_DASHBOARD.CTR_by_channel[Paid Search,2026-01-05..2026-01-26]', 'KPI_DASHBOARD.CPA_by_channel[Paid Search,2026-01-05..2026-01-26]'] },
    { id: 7, title: 'Social CVR headroom', narrative: 'Paid Social conversion rate remained below 3.6%, suggesting landing page opportunities.', impact: 'medium', cited_metrics: ['KPI_DASHBOARD.ConversionRate_by_channel[Paid Social,2026-01-05..2026-01-26]'] },
    { id: 8, title: 'Affiliate spend discipline', narrative: 'Affiliate spend stayed under 7.3k/week while driving 28k+ weekly revenue.', impact: 'low', cited_metrics: ['KPI_DASHBOARD.Spend_by_channel[Affiliate,2026-01-19..2026-01-26]', 'KPI_DASHBOARD.Revenue_by_channel[Affiliate,2026-01-19..2026-01-26]'] },
    { id: 9, title: 'Blended CPA improvement', narrative: 'Blended CPA fell from 47 to 40 over four weeks.', impact: 'high', cited_metrics: ['KPI_DASHBOARD.Blended_CPA[2026-01-05..2026-01-26]'] },
    { id: 10, title: 'Week-over-week resilience', narrative: 'All channels maintained or improved ROAS in each week-over-week transition.', impact: 'medium', cited_metrics: ['KPI_DASHBOARD.ROAS_by_channel[all,2026-01-05..2026-01-26]'] }
  ],
  WEEKLY_REPORTS: [
    { week_start: '2025-12-08', exec_summary: 'Performance baseline established with blended ROAS at 3.22.', wins: 'Search lead quality improved.', issues: 'Social CPA remained elevated.', actions: 'Refined audience exclusions.', risks: 'Holiday CPC volatility.' },
    { week_start: '2025-12-15', exec_summary: 'Top-line revenue increased 7% WoW with stable spend.', wins: 'Affiliate conversions accelerated.', issues: 'Social CTR dipped.', actions: 'Launched creative refresh batch A.', risks: 'Attribution lag from partner feeds.' },
    { week_start: '2025-12-22', exec_summary: 'Holiday week saw strong conversion intent across search.', wins: 'Search ROAS crossed 3.6.', issues: 'Tracking QA uncovered minor pixel drift.', actions: 'Patched event mapping.', risks: 'Reporting noise around holiday traffic spikes.' },
    { week_start: '2025-12-29', exec_summary: 'Year-end campaigns closed with improving blended efficiency.', wins: 'CPA down 5% WoW.', issues: 'Affiliate volume capped by inventory.', actions: 'Opened two new affiliate placements.', risks: 'Creative fatigue entering new quarter.' },
    { week_start: '2026-01-05', exec_summary: 'January opened with healthy demand and ROAS recovery.', wins: 'Search revenue +9% vs prior week.', issues: 'Social conversion lag persisted.', actions: 'Shifted 5% budget to high-intent ad sets.', risks: 'Search auction pressure from competitors.' },
    { week_start: '2026-01-12', exec_summary: 'Blended ROAS improved as optimization changes matured.', wins: 'Affiliate ROAS reached 3.8.', issues: 'Cross-device attribution gaps remain.', actions: 'Introduced modeled conversion checks.', risks: 'Dependence on a narrow keyword cluster.' },
    { week_start: '2026-01-19', exec_summary: 'Consistent execution delivered broad channel uplift.', wins: 'All channels improved conversion rate.', issues: 'Social still below target CTR.', actions: 'Expanded UGC creative testing.', risks: 'Potential spend inefficiency if scaling too rapidly.' },
    { week_start: '2026-01-26', exec_summary: 'Month closed with strongest ROAS and lowest CPA in period.', wins: 'Search and affiliate hit peak efficiency.', issues: 'Revenue concentration in search increased.', actions: 'Drafted diversification plan for social and partner channels.', risks: 'Single-channel dependency if search volatility rises.' }
  ]
};

export const allowedFields = {
  KPI_DASHBOARD: ['week_start', 'channel', 'spend', 'revenue', 'roas', 'cpa', 'ctr', 'cv_rate'],
  INSIGHTS: ['id', 'title', 'narrative', 'impact', 'cited_metrics'],
  WEEKLY_REPORTS: ['week_start', 'exec_summary', 'wins', 'issues', 'actions', 'risks']
};

export const canonicalPrompts = [
  'What is the latest ROAS by channel?',
  'Which channel has the best CPA trend in January 2026?',
  'Summarize top 3 insights from the INSIGHTS tab.',
  'Generate the weekly report for 2026-01-26.',
  'What risks were flagged over the last 4 weekly reports?'
];
