import { MetricRow } from '@/lib/data/types';

function toNumber(value: string): number {
  return Number.parseFloat(value.trim()) || 0;
}

function parseCsv(text: string): MetricRow[] {
  const [headerLine, ...lines] = text.trim().split('\n');
  if (!headerLine) return [];
  const headers = headerLine.split(',').map((h) => h.trim());

  return lines
    .filter(Boolean)
    .map((line) => {
      const fields = line.split(',').map((f) => f.trim());
      const row = Object.fromEntries(headers.map((h, i) => [h, fields[i] ?? '']));
      return {
        date: row.date,
        channel: row.channel,
        campaign: row.campaign,
        spend: toNumber(row.spend),
        clicks: toNumber(row.clicks),
        conversions: toNumber(row.conversions),
        revenue: toNumber(row.revenue)
      };
    });
}

export async function fromCsvEndpoint(url: string): Promise<MetricRow[]> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`CSV fetch failed: ${response.status}`);
  return parseCsv(await response.text());
}

export async function fromJsonEndpoint<T = MetricRow>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`JSON fetch failed: ${response.status}`);
  return (await response.json()) as T[];
}
