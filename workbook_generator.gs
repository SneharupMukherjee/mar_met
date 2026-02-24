/**
 * Reproducible synthetic marketing workbook generator.
 *
 * Usage:
 *   generateWorkbook(); // default seed/base date
 *   generateWorkbook({ seed: 20250224, baseDate: '2025-02-24', name: 'MarMet Synthetic Workbook' });
 */
function generateWorkbook(options) {
  options = options || {};
  var seed = options.seed != null ? Number(options.seed) : 20250224;
  var baseDate = options.baseDate ? new Date(options.baseDate + 'T00:00:00Z') : new Date();
  var workbookName = options.name || ('MarMet Synthetic Workbook - seed ' + seed);

  var rng = createRng(seed);
  var tz = 'UTC';

  var tabNames = [
    'README',
    'CONFIG',
    'META_ADS_DAILY',
    'GOOGLE_ADS_DAILY',
    'SITE_FUNNEL_DAILY',
    'IDENTITY_MAP',
    'RETARGETING_AUDIENCES_DAILY',
    'UTM_MAPPING',
    'EXPERIMENTS',
    'ATTRIBUTION_MODELS',
    'KPI_DASHBOARD',
    'INSIGHTS',
    'WEEKLY_REPORTS'
  ];

  var ss = SpreadsheetApp.create(workbookName);
  normalizeTabs(ss, tabNames);

  var startOffset = -55;
  var endOffset = 14;
  var rows = [];
  for (var d = startOffset; d <= endOffset; d++) {
    var date = new Date(baseDate.getTime());
    date.setUTCDate(baseDate.getUTCDate() + d);
    rows.push(buildDailyRow(date, d, rng));
  }

  writeReadmeTab(ss.getSheetByName('README'), seed, baseDate, startOffset, endOffset);
  writeConfigTab(ss.getSheetByName('CONFIG'), seed, baseDate, startOffset, endOffset);
  writeMetaAdsTab(ss.getSheetByName('META_ADS_DAILY'), rows, tz);
  writeGoogleAdsTab(ss.getSheetByName('GOOGLE_ADS_DAILY'), rows, tz);
  writeSiteFunnelTab(ss.getSheetByName('SITE_FUNNEL_DAILY'), rows, tz);
  writeIdentityMap(ss.getSheetByName('IDENTITY_MAP'));
  writeRetargetingTab(ss.getSheetByName('RETARGETING_AUDIENCES_DAILY'), rows, tz);
  writeUtmMap(ss.getSheetByName('UTM_MAPPING'));
  writeExperiments(ss.getSheetByName('EXPERIMENTS'), rows, tz);
  writeAttributionTab(ss.getSheetByName('ATTRIBUTION_MODELS'), rows, tz);
  writeKpiDashboard(ss.getSheetByName('KPI_DASHBOARD'), rows, tz);
  writeInsights(ss.getSheetByName('INSIGHTS'));
  writeWeeklyReports(ss.getSheetByName('WEEKLY_REPORTS'), rows, tz);

  return ss.getUrl();
}

function createRng(seed) {
  var state = (seed >>> 0) || 1;
  return {
    next: function() {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    },
    normal: function(mean, stdev) {
      var u1 = Math.max(this.next(), 1e-9);
      var u2 = this.next();
      var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + z0 * stdev;
    }
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function normalizeTabs(ss, tabNames) {
  var sheets = ss.getSheets();
  sheets[0].setName(tabNames[0]);
  for (var i = 1; i < tabNames.length; i++) {
    ss.insertSheet(tabNames[i]);
  }
}

function buildDailyRow(date, tOffset, rng) {
  var dow = date.getUTCDay();
  var weekendFactor = (dow === 0 || dow === 6) ? 0.78 : 1.0;

  var trackingBreak = (tOffset === -6);
  var recoveryBoost = (tOffset >= -5 && tOffset <= -3) ? 1.18 : 1.0;
  var influencerSpike = (tOffset === -12);
  var googlePressure = (tOffset >= -18 && tOffset <= -8);

  var fatigue = clamp((tOffset + 45) / 59, 0, 1);
  var metaImpressions = Math.round(185000 * weekendFactor * (1 + rng.normal(0, 0.04)));
  var metaFreq = 1.55 + fatigue * 1.05 + rng.normal(0, 0.03);
  var metaCtr = clamp(0.019 - fatigue * 0.006 + rng.normal(0, 0.0008), 0.008, 0.028);
  var metaClicks = Math.max(100, Math.round(metaImpressions * metaCtr));
  var metaCpc = clamp(0.92 + fatigue * 0.28 + rng.normal(0, 0.04), 0.75, 1.55);
  var metaSpend = metaClicks * metaCpc;
  var metaCvRate = clamp(0.048 - fatigue * 0.015 + rng.normal(0, 0.002), 0.018, 0.07);
  if (trackingBreak) metaCvRate *= 0.14;
  if (recoveryBoost !== 1) metaCvRate *= recoveryBoost;
  var metaConversions = Math.max(1, Math.round(metaClicks * metaCvRate));

  var gImpressions = Math.round(142000 * weekendFactor * (1 + rng.normal(0, 0.05)));
  var gCtrBase = 0.042 + rng.normal(0, 0.0012);
  var gCtr = clamp(googlePressure ? gCtrBase * 0.87 : gCtrBase, 0.02, 0.06);
  var gClicks = Math.max(90, Math.round(gImpressions * gCtr));
  var gCpc = clamp((1.65 + rng.normal(0, 0.08)) * (googlePressure ? 1.34 : 1), 1.2, 3.3);
  var gSpend = gClicks * gCpc;
  var gCvRate = clamp((0.083 + rng.normal(0, 0.003)) * (googlePressure ? 0.8 : 1), 0.04, 0.12);
  if (trackingBreak) gCvRate *= 0.15;
  if (recoveryBoost !== 1) gCvRate *= recoveryBoost;
  var gConversions = Math.max(1, Math.round(gClicks * gCvRate));

  var sessions = Math.round((metaClicks + gClicks) * 2.35 * weekendFactor * (1 + rng.normal(0, 0.04)));
  if (influencerSpike) sessions = Math.round(sessions * 2.35);

  var siteConvRate = clamp(0.036 + rng.normal(0, 0.0015), 0.018, 0.055);
  if (trackingBreak) siteConvRate *= 0.13;
  if (influencerSpike) siteConvRate *= 0.52;
  if (recoveryBoost !== 1) siteConvRate *= recoveryBoost;

  var experimentLift = (tOffset >= 2 && tOffset <= 14) ? 1.16 : 1.0;
  siteConvRate *= experimentLift;

  var siteOrders = Math.max(2, Math.round(sessions * siteConvRate));
  var aov = clamp(72 + rng.normal(0, 2.4), 64, 82);
  var revenue = siteOrders * aov;

  var platformAttributed = (metaConversions + gConversions) * aov;
  var modeledAttributed = revenue * (influencerSpike ? 0.84 : 0.93);

  return {
    date: date,
    tOffset: tOffset,
    weekendFactor: weekendFactor,
    trackingBreak: trackingBreak,
    influencerSpike: influencerSpike,
    googlePressure: googlePressure,
    experimentLift: experimentLift,
    metaImpressions: metaImpressions,
    metaFreq: metaFreq,
    metaCtr: metaCtr,
    metaClicks: metaClicks,
    metaCpc: metaCpc,
    metaSpend: metaSpend,
    metaConversions: metaConversions,
    gImpressions: gImpressions,
    gCtr: gCtr,
    gClicks: gClicks,
    gCpc: gCpc,
    gSpend: gSpend,
    gConversions: gConversions,
    sessions: sessions,
    siteOrders: siteOrders,
    aov: aov,
    revenue: revenue,
    platformAttributed: platformAttributed,
    modeledAttributed: modeledAttributed
  };
}

function writeValues(sheet, values) {
  sheet.clear();
  sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
  sheet.setFrozenRows(1);
}

function writeReadmeTab(sheet, seed, baseDate, startOffset, endOffset) {
  var values = [
    ['section', 'details'],
    ['purpose', 'Synthetic marketing performance workbook with deterministic storyline events.'],
    ['how_to_run', 'Run generateWorkbook({seed: 20250224, baseDate: "2025-02-24"}) in Apps Script.'],
    ['seed', String(seed)],
    ['base_date_utc', Utilities.formatDate(baseDate, 'UTC', 'yyyy-MM-dd')],
    ['day_range', 'T' + startOffset + ' to T+' + endOffset + ' (70 days)'],
    ['storyline_events', 'Weekend seasonality; Meta fatigue; Google auction pressure; tracking break day; influencer spike; experiment uplift; attribution mismatch'],
    ['tabs', 'README, CONFIG, META_ADS_DAILY, GOOGLE_ADS_DAILY, SITE_FUNNEL_DAILY, IDENTITY_MAP, RETARGETING_AUDIENCES_DAILY, UTM_MAPPING, EXPERIMENTS, ATTRIBUTION_MODELS, KPI_DASHBOARD, INSIGHTS, WEEKLY_REPORTS']
  ];
  writeValues(sheet, values);
}

function writeConfigTab(sheet, seed, baseDate, startOffset, endOffset) {
  var values = [
    ['key', 'value'],
    ['seed', seed],
    ['base_date_utc', Utilities.formatDate(baseDate, 'UTC', 'yyyy-MM-dd')],
    ['t_start', startOffset],
    ['t_end', endOffset],
    ['tracking_break_t', -6],
    ['influencer_spike_t', -12],
    ['google_pressure_window', 'T-18..T-8'],
    ['experiment_window', 'T+2..T+14']
  ];
  writeValues(sheet, values);
}

function writeMetaAdsTab(sheet, rows, tz) {
  var values = [['date', 't_offset', 'impressions', 'frequency', 'ctr', 'clicks', 'cpc', 'spend', 'conversions', 'cpa', 'notes']];
  rows.forEach(function(r) {
    values.push([
      Utilities.formatDate(r.date, tz, 'yyyy-MM-dd'),
      r.tOffset,
      r.metaImpressions,
      Number(r.metaFreq.toFixed(2)),
      Number(r.metaCtr.toFixed(4)),
      r.metaClicks,
      Number(r.metaCpc.toFixed(2)),
      Number(r.metaSpend.toFixed(2)),
      r.metaConversions,
      Number((r.metaSpend / r.metaConversions).toFixed(2)),
      r.trackingBreak ? 'tracking_break' : (r.influencerSpike ? 'influencer_spike_low_intent' : '')
    ]);
  });
  writeValues(sheet, values);
}

function writeGoogleAdsTab(sheet, rows, tz) {
  var values = [['date', 't_offset', 'impressions', 'ctr', 'clicks', 'cpc', 'spend', 'conversions', 'cpa', 'auction_pressure_flag']];
  rows.forEach(function(r) {
    values.push([
      Utilities.formatDate(r.date, tz, 'yyyy-MM-dd'),
      r.tOffset,
      r.gImpressions,
      Number(r.gCtr.toFixed(4)),
      r.gClicks,
      Number(r.gCpc.toFixed(2)),
      Number(r.gSpend.toFixed(2)),
      r.gConversions,
      Number((r.gSpend / r.gConversions).toFixed(2)),
      r.googlePressure ? 1 : 0
    ]);
  });
  writeValues(sheet, values);
}

function writeSiteFunnelTab(sheet, rows, tz) {
  var values = [['date', 't_offset', 'sessions', 'orders', 'conversion_rate', 'aov', 'revenue', 'influencer_spike_flag', 'tracking_break_flag']];
  rows.forEach(function(r) {
    values.push([
      Utilities.formatDate(r.date, tz, 'yyyy-MM-dd'),
      r.tOffset,
      r.sessions,
      r.siteOrders,
      Number((r.siteOrders / r.sessions).toFixed(4)),
      Number(r.aov.toFixed(2)),
      Number(r.revenue.toFixed(2)),
      r.influencerSpike ? 1 : 0,
      r.trackingBreak ? 1 : 0
    ]);
  });
  writeValues(sheet, values);
}

function writeIdentityMap(sheet) {
  var values = [
    ['identity_key', 'type', 'source', 'description'],
    ['meta_click_id', 'click_id', 'meta_ads', 'Meta click identifier for paid social sessions'],
    ['gclid', 'click_id', 'google_ads', 'Google click identifier for paid search sessions'],
    ['user_id', 'first_party', 'site', 'Logged-in customer id'],
    ['anonymous_id', 'first_party', 'site', 'Pre-login browser-level id'],
    ['email_hash', 'pii_hash', 'crm', 'SHA-256 hashed email for deterministic joins']
  ];
  writeValues(sheet, values);
}

function writeRetargetingTab(sheet, rows, tz) {
  var values = [['date', 'audience_name', 'size', 'reach', 'ctr', 'cvr']];
  rows.forEach(function(r) {
    var baseSize = Math.round(r.sessions * 0.42);
    values.push([
      Utilities.formatDate(r.date, tz, 'yyyy-MM-dd'),
      'All Visitors 30D',
      baseSize,
      Math.round(baseSize * 0.63),
      Number((0.018 + (r.weekendFactor < 1 ? -0.002 : 0) + (r.trackingBreak ? -0.006 : 0)).toFixed(4)),
      Number((0.041 + (r.influencerSpike ? -0.013 : 0)).toFixed(4))
    ]);
  });
  writeValues(sheet, values);
}

function writeUtmMap(sheet) {
  var values = [
    ['utm_source', 'utm_medium', 'utm_campaign', 'mapped_channel', 'notes'],
    ['facebook', 'paid_social', 'prospecting_q1', 'Paid Social', 'Meta top-funnel'],
    ['instagram', 'paid_social', 'retargeting_q1', 'Paid Social', 'Meta mid-funnel'],
    ['google', 'cpc', 'nonbrand_search_q1', 'Paid Search Non-brand', 'Auction pressure window in T-18..T-8'],
    ['google', 'cpc', 'brand_search_q1', 'Paid Search Brand', 'Stable benchmark'],
    ['influencer', 'social', 'creator_drop', 'Influencer', 'Traffic spike day T-12 with low-quality visits']
  ];
  writeValues(sheet, values);
}

function writeExperiments(sheet, rows, tz) {
  var values = [['experiment_id', 'name', 'start_date', 'end_date', 'variant', 'metric', 'control_value', 'variant_value', 'uplift_pct', 'winner']];
  var start = rows.filter(function(r) { return r.tOffset === 2; })[0];
  var end = rows.filter(function(r) { return r.tOffset === 14; })[0];
  values.push([
    'EXP-CTA-001',
    'Checkout CTA copy refresh',
    Utilities.formatDate(start.date, tz, 'yyyy-MM-dd'),
    Utilities.formatDate(end.date, tz, 'yyyy-MM-dd'),
    'B',
    'site_conversion_rate',
    0.034,
    0.0394,
    15.88,
    'yes'
  ]);
  writeValues(sheet, values);
}

function writeAttributionTab(sheet, rows, tz) {
  var values = [['date', 'platform_attributed_revenue', 'modeled_revenue', 'delta_pct', 'comment']];
  rows.forEach(function(r) {
    var delta = (r.platformAttributed - r.modeledAttributed) / r.modeledAttributed;
    values.push([
      Utilities.formatDate(r.date, tz, 'yyyy-MM-dd'),
      Number(r.platformAttributed.toFixed(2)),
      Number(r.modeledAttributed.toFixed(2)),
      Number(delta.toFixed(4)),
      r.influencerSpike ? 'Attribution overstates low-intent spike' : ''
    ]);
  });
  writeValues(sheet, values);
}

function writeKpiDashboard(sheet, rows, tz) {
  var values = [['date', 'spend_total', 'revenue', 'blended_roas', 'platform_roas', 'modeled_roas', 'tracking_quality_flag']];
  rows.forEach(function(r) {
    var spend = r.metaSpend + r.gSpend;
    values.push([
      Utilities.formatDate(r.date, tz, 'yyyy-MM-dd'),
      Number(spend.toFixed(2)),
      Number(r.revenue.toFixed(2)),
      Number((r.revenue / spend).toFixed(3)),
      Number((r.platformAttributed / spend).toFixed(3)),
      Number((r.modeledAttributed / spend).toFixed(3)),
      r.trackingBreak ? 'degraded' : 'ok'
    ]);
  });
  writeValues(sheet, values);
}

function writeInsights(sheet) {
  var values = [
    ['insight_id', 'priority', 'observation', 'implication'],
    ['I-01', 'high', 'Meta frequency rises while CTR decays through the storyline.', 'Creative fatigue is increasing CPA; refresh assets weekly.'],
    ['I-02', 'high', 'Google non-brand CPC inflation appears in T-18..T-8.', 'Shift budget to exact match + tighten geo modifiers.'],
    ['I-03', 'critical', 'Tracking break day shows conversion collapse with rebound over next 3 days.', 'Add event-level monitoring and backfill policy.'],
    ['I-04', 'medium', 'Influencer spike drives sessions but weak conversion quality.', 'Use assisted-conversion weighting in reporting.'],
    ['I-05', 'high', 'Experiment EXP-CTA-001 delivered measurable uplift.', 'Scale winning variant globally.'],
    ['I-06', 'medium', 'Platform-attributed revenue exceeds modeled revenue.', 'Use modeled view for investment decisions.']
  ];
  writeValues(sheet, values);
}

function writeWeeklyReports(sheet, rows, tz) {
  var values = [['week_start', 'spend', 'revenue', 'orders', 'sessions', 'blended_cvr', 'notes']];
  var bucket = {};

  rows.forEach(function(r) {
    var weekStart = new Date(r.date.getTime());
    var day = weekStart.getUTCDay();
    var deltaToMonday = (day + 6) % 7;
    weekStart.setUTCDate(weekStart.getUTCDate() - deltaToMonday);
    var key = Utilities.formatDate(weekStart, tz, 'yyyy-MM-dd');
    if (!bucket[key]) {
      bucket[key] = { spend: 0, revenue: 0, orders: 0, sessions: 0, flags: [] };
    }
    bucket[key].spend += r.metaSpend + r.gSpend;
    bucket[key].revenue += r.revenue;
    bucket[key].orders += r.siteOrders;
    bucket[key].sessions += r.sessions;
    if (r.trackingBreak) bucket[key].flags.push('tracking_break');
    if (r.influencerSpike) bucket[key].flags.push('influencer_spike');
    if (r.googlePressure) bucket[key].flags.push('google_pressure');
    if (r.experimentLift > 1) bucket[key].flags.push('experiment_lift');
  });

  Object.keys(bucket).sort().forEach(function(key) {
    var b = bucket[key];
    values.push([
      key,
      Number(b.spend.toFixed(2)),
      Number(b.revenue.toFixed(2)),
      b.orders,
      b.sessions,
      Number((b.orders / b.sessions).toFixed(4)),
      b.flags.filter(function(v, i, arr) { return arr.indexOf(v) === i; }).join(',')
    ]);
  });

  writeValues(sheet, values);
}
