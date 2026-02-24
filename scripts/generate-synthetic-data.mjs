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

function fmtDateUTC(date) {
  return date.toISOString().slice(0, 10);
}

function buildWeeklyReports(baseDateStr = '2026-02-24') {
  const baseDate = new Date(`${baseDateStr}T00:00:00.000Z`);
  const startOffset = -75;
  const endOffset = 14;
  const daily = [];

  for (let offset = startOffset; offset <= endOffset; offset += 1) {
    const date = new Date(baseDate);
    date.setUTCDate(baseDate.getUTCDate() + offset);

    const websiteRevamp = offset === -75;
    const partnerAnnouncement = offset === -60;
    const kolCampaign = offset === -30 || offset === -44 || offset === -16;
    const influencerSpike = offset === -12;
    const trackingBreak = offset === -6;
    const experimentActive = offset >= 2 && offset <= 14;

    const weekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const weekdayFactor = weekend ? 0.82 : 1;
    const prePaid = offset < -45;
    const baseSessions = prePaid ? 2300 : 9000;
    const baseSpend = prePaid ? 700 : 8300;
    const baseConversions = prePaid ? 28 : 210;

    let sessions = Math.round((baseSessions + (offset + 75) * 42) * weekdayFactor);
    let spend = Math.round((baseSpend + (offset + 75) * 55) * weekdayFactor);
    let conversions = Math.round((baseConversions + (offset + 75) * 1.8) * weekdayFactor);

    if (websiteRevamp) sessions += 320;
    if (partnerAnnouncement) sessions += 900;
    if (kolCampaign) sessions += 1200;
    if (influencerSpike) sessions += 12500;
    if (trackingBreak) conversions = Math.round(conversions * 0.12);
    if (experimentActive) conversions = Math.round(conversions * 1.16);

    daily.push({
      offset,
      date: fmtDateUTC(date),
      spend: Math.max(spend, 0),
      sessions: Math.max(sessions, 0),
      conversions: Math.max(conversions, 0),
      flags: {
        websiteRevamp,
        partnerAnnouncement,
        kolCampaign,
        influencerSpike,
        trackingBreak,
        experimentActive
      }
    });
  }

  const firstOffset = daily[0].offset;
  const weeks = new Map();
  for (const row of daily) {
    const weekNum = Math.floor((row.offset - firstOffset) / 7) + 1;
    if (!weeks.has(weekNum)) {
      weeks.set(weekNum, {
        week_num: weekNum,
        week_start: row.date,
        week_end: row.date,
        spend: 0,
        sessions: 0,
        conversions: 0,
        activities: new Set()
      });
    }
    const bucket = weeks.get(weekNum);
    bucket.week_end = row.date;
    bucket.spend += row.spend;
    bucket.sessions += row.sessions;
    bucket.conversions += row.conversions;

    if (row.flags.websiteRevamp) bucket.activities.add('Website');
    if (row.flags.partnerAnnouncement) bucket.activities.add('Partnerships');
    if (row.flags.kolCampaign) bucket.activities.add('KOL');
    if (row.offset >= -67 && row.offset <= -46) {
      bucket.activities.add('Content');
      bucket.activities.add('Community');
    }
    if (row.offset >= -45) bucket.activities.add('Paid');
    if (row.flags.influencerSpike) bucket.activities.add('Influencer');
    if (row.flags.trackingBreak) bucket.activities.add('Measurement');
    if (row.flags.experimentActive) bucket.activities.add('Experiment');
  }

  return [...weeks.values()]
    .sort((a, b) => a.week_num - b.week_num)
    .map((week) => {
      const activities = [...week.activities];
      let lead = 'Paid engine optimization and readiness gating progressed.';
      if (activities.includes('Website')) lead = 'Website revamped. Baseline sessions initializing.';
      else if (activities.includes('Partnerships')) lead = 'Partner announcement expanded top-of-funnel reach.';
      else if (activities.includes('Influencer')) lead = 'Influencer traffic spike delivered high volume with mixed quality.';
      else if (activities.includes('Measurement')) lead = 'Tracking break detected and stabilized via war-room response.';
      else if (activities.includes('Experiment')) lead = 'Experimentation window active with measurable conversion-rate lift.';
      else if (week.week_num <= 4) lead = 'Organic seeding and community momentum building.';

      return {
        week_num: week.week_num,
        week_start: week.week_start,
        week_end: week.week_end,
        narrative_summary: `Week ${week.week_num}: ${lead} Spend $${Math.round(week.spend).toLocaleString()}, sessions ${Math.round(
          week.sessions
        ).toLocaleString()}, conversions ${Math.round(week.conversions).toLocaleString()}.`,
        key_activities: activities.join(', '),
        spend: week.spend,
        sessions: week.sessions,
        conversions: week.conversions
      };
    });
}

const weeklyReports = buildWeeklyReports();

await writeFile('public/data/marketing.csv', `${csv}\n`, 'utf8');
await writeFile('public/data/marketing.json', `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
await writeFile('public/data/weekly_reports.json', `${JSON.stringify(weeklyReports, null, 2)}\n`, 'utf8');

console.log(`Generated ${rows.length} synthetic rows and ${weeklyReports.length} weekly reports into public/data.`);
