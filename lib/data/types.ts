export type MetricRow = {
  date: string;
  channel: string;
  campaign: string;
  spend: number;
  clicks: number;
  conversions: number;
  revenue: number;
};

export type DataSourceMode = 'csv' | 'appsScriptJson' | 'sheetsApiProxy';
