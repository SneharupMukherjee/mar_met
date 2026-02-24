import { fromCsvEndpoint, fromJsonEndpoint } from '@/lib/data/adapters';
import { DataSourceMode, MetricRow } from '@/lib/data/types';

const mode = (process.env.DATA_SOURCE_MODE ?? 'csv') as DataSourceMode;
const csvUrl = process.env.NEXT_PUBLIC_SHEETS_CSV_URL ?? 'http://localhost:3000/data/marketing.csv';
const appsScriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_JSON_URL ?? 'http://localhost:3000/data/marketing.json';
const sheetsApiProxyUrl = process.env.SHEETS_API_PROXY_URL ?? 'http://localhost:3000/data/marketing.json';

export async function getMarketingData(): Promise<MetricRow[]> {
  switch (mode) {
    case 'csv':
      return fromCsvEndpoint(csvUrl);
    case 'appsScriptJson':
      return fromJsonEndpoint(appsScriptUrl);
    case 'sheetsApiProxy':
      return fromJsonEndpoint(sheetsApiProxyUrl);
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
