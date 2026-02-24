import { fromCsvEndpoint, fromJsonEndpoint } from '@/lib/data/adapters';
import { DataSourceMode, MetricRow, WeeklyReportRow } from '@/lib/data/types';

const mode = (process.env.DATA_SOURCE_MODE ?? 'csv') as DataSourceMode;
const csvUrl = process.env.NEXT_PUBLIC_SHEETS_CSV_URL ?? 'http://localhost:3000/data/marketing.csv';
const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_JSON_URL ?? 'http://localhost:3000/data/marketing.json';
const sheetsApiProxyUrl = process.env.SHEETS_API_PROXY_URL ?? 'http://localhost:3000/data/marketing.json';
const weeklyReportsUrl = process.env.NEXT_PUBLIC_WEEKLY_REPORTS_JSON_URL ?? 'http://localhost:3000/data/weekly_reports.json';

export async function getMarketingData(): Promise<MetricRow[]> {
  switch (mode) {
    case 'csv':
      return fromCsvEndpoint(csvUrl);
    case 'appsScriptJson':
      return fromJsonEndpoint<MetricRow>(appsScriptUrl);
    case 'sheetsApiProxy':
      return fromJsonEndpoint<MetricRow>(sheetsApiProxyUrl);
    default:
      return fromCsvEndpoint(csvUrl);
  }
}

export function summarizeData(rows: MetricRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.revenue += row.revenue;
      acc.conversions += row.conversions;
      return acc;
    },
    { spend: 0, revenue: 0, conversions: 0 }
  );
}

export async function getWeeklyReportsData(): Promise<WeeklyReportRow[]> {
  return fromJsonEndpoint<WeeklyReportRow>(weeklyReportsUrl);
}
