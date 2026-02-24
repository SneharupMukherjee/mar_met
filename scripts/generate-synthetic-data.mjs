import { mkdir, writeFile } from 'node:fs/promises';

const channels = ['Search', 'Social', 'Display', 'Email'];
const campaigns = ['Prospecting', 'Retargeting', 'Brand', 'Lifecycle'];
const rows = [];

for (let day = 1; day <= 30; day += 1) {
  channels.forEach((channel, cIdx) => {
    campaigns.forEach((campaign, kIdx) => {
      const spend = 300 + day * 12 + cIdx * 70 + kIdx * 20;
      const clicks = Math.round(spend * (1.4 + cIdx * 0.1));
      const conversions = Math.round(clicks * (0.03 + kIdx * 0.005));
      const revenue = conversions * (90 + cIdx * 15);
      rows.push({
        date: `2026-01-${String(day).padStart(2, '0')}`,
        channel,
        campaign,
        spend,
        clicks,
        conversions,
        revenue
      });
    });
  });
}

await mkdir('public/data', { recursive: true });

const headers = ['date', 'channel', 'campaign', 'spend', 'clicks', 'conversions', 'revenue'];
const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => r[h]).join(','))].join('\n');

await writeFile('public/data/marketing.csv', `${csv}\n`, 'utf8');
await writeFile('public/data/marketing.json', `${JSON.stringify(rows, null, 2)}\n`, 'utf8');

console.log(`Generated ${rows.length} synthetic rows into public/data.`);
