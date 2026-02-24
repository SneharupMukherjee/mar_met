export type MetricRow = {
  date: string;
  channel: string;
  campaign: string;
  spend: number;
  clicks: number;
  conversions: number;
  revenue: number;
};

export type WeeklyReportRow = {
  week_num: number;
  week_start: string;
  week_end: string;
  narrative_summary: string;
  key_activities: string;
  spend: number;
  sessions: number;
  conversions: number;
};

export type DataSourceMode = 'csv' | 'appsScriptJson' | 'sheetsApiProxy';
