/**
 * Reproducible synthetic marketing workbook generator.
 * Completely rewritten to meet missing schema requirements.
 */
function generateWorkbook(options) {
  options = options || {};
  var seed = options.seed != null ? Number(options.seed) : 20250224;
  var baseDate = options.baseDate ? new Date(options.baseDate + 'T00:00:00Z') : new Date();
  var workbookName = options.name || ('MarMet Synthetic Workbook - seed ' + seed);

  var rng = createRng(seed);
  var tz = 'UTC';

  var tabNames = [
    'README', 'CONFIG', 'META_ADS_DAILY', 'GOOGLE_ADS_DAILY', 'SITE_FUNNEL_DAILY',
    'IDENTITY_MAP', 'RETARGETING_AUDIENCES_DAILY', 'UTM_MAPPING', 'EXPERIMENTS',
    'ATTRIBUTION_MODELS', 'KPI_DASHBOARD', 'INSIGHTS', 'WEEKLY_REPORTS'
  ];

  var ss = SpreadsheetApp.create(workbookName);
  normalizeTabs(ss, tabNames);

  var startOffset = -75;
  var endOffset = 14;
  
  // Storage for multi-grain rows
  var metaRows = [];
  var googleRows = [];
  var funnelRows = [];
  var retargetingRows = [];
  var kpiSummary = [];

  for (var d = startOffset; d <= endOffset; d++) {
    var date = new Date(baseDate.getTime());
    date.setUTCDate(baseDate.getUTCDate() + d);
    var dateStr = Utilities.formatDate(date, tz, 'yyyy-MM-dd');

    var dow = date.getUTCDay();
    var weekendFactor = (dow === 0 || dow === 6) ? 0.78 : 1.0;

    var trackingBreak = (d === -6);
    var recoveryBoost = (d >= -5 && d <= -3) ? 1.18 : 1.0;
    var influencerSpike = (d === -12);
    var googlePressure = (d >= -18 && d <= -8);
    var fatigue = Math.max(0, Math.min(1, (d + 75) / 89));
    var experimentLift = (d >= 2 && d <= 14) ? 1.16 : 1.0;
    var websiteRevamp = (d === -75);
    var partnerAnnouncement = (d === -60);
    var kolCampaign = (d === -30 || d === -44 || d === -16);

    // META ADS (3 Campaigns: Prospecting Video, Prospecting Static, Retargeting)
    var metaCamps = [
      { id: 'C_M1', name: 'Prospecting_Video', obj: 'CONVERSIONS', stage: 'Prospecting', persona: 'DeFi trader', angle: 'proof', format: 'video', budgetShare: 0.5, ctrBase: 0.02, cpcBase: 0.8 },
      { id: 'C_M2', name: 'Prospecting_Static', obj: 'TRAFFIC', stage: 'Prospecting', persona: 'crypto curious', angle: 'how-to', format: 'image', budgetShare: 0.3, ctrBase: 0.015, cpcBase: 0.6 },
      { id: 'C_M3', name: 'Retargeting_MOF', obj: 'CONVERSIONS', stage: 'Retargeting', persona: 'all', angle: 'anti-scam', format: 'carousel', budgetShare: 0.2, ctrBase: 0.03, cpcBase: 1.2 }
    ];

    var totalMetaSpendDay = 0;
    var totalMetaConvsDay = 0;

    metaCamps.forEach(function(c) {
      var campSpread = c.budgetShare * (1 + rng.normal(0, 0.05));
      var imp = Math.round(100000 * campSpread * weekendFactor);
      var reach = Math.round(imp * 0.7);
      var freq = 1.5 + fatigue * (c.stage === 'Retargeting' ? 2.5 : 0.8) + rng.normal(0, 0.1);
      
      var ctr = Math.max(0.005, c.ctrBase - (fatigue * 0.005) + rng.normal(0, 0.001));
      var clicks = Math.round(imp * ctr);
      var unique_clicks = Math.round(clicks * 0.85);
      
      var cpc = c.cpcBase + (fatigue * 0.3) + rng.normal(0, 0.05);
      var spend = clicks * cpc;
      var cpm = (spend / imp) * 1000;

      var cvr1 = 0.2 * (trackingBreak ? 0.1 : 1);
      var actions_wallet_connect = Math.round(clicks * cvr1);
      var actions_task_complete = Math.round(actions_wallet_connect * 0.5);
      var actions_readiness_action = Math.round(actions_task_complete * 0.6);
      var actions_participation = Math.round(actions_readiness_action * 0.8);
      var actions_purchase = Math.round(actions_participation * 0.5);

      var action_value_purchase = actions_purchase * Math.round(75 + rng.normal(0, 5));
      var action_value_participation_value = actions_participation * 10;
      
      var cpa_wallet = actions_wallet_connect > 0 ? (spend / actions_wallet_connect) : 0;
      var cpa_task = actions_task_complete > 0 ? (spend / actions_task_complete) : 0;
      var cpa_pur = actions_purchase > 0 ? (spend / actions_purchase) : 0;

      totalMetaSpendDay += spend;
      totalMetaConvsDay += actions_purchase;

      metaRows.push([
        dateStr, 'ACCT_META', c.id, c.name,
        c.id + '_AS1', c.name + '_Broad', c.id + '_AD1', c.name + '_Ad',
        c.obj, c.stage, c.persona, c.angle, c.format, 'US', 'Mobile',
        imp, reach, Number(freq.toFixed(2)), Number(spend.toFixed(2)), clicks, unique_clicks,
        Number(ctr.toFixed(4)), Number(cpc.toFixed(2)), Number(cpm.toFixed(2)),
        actions_wallet_connect, actions_task_complete, actions_readiness_action,
        actions_participation, actions_purchase, Number(action_value_purchase.toFixed(2)),
        Number(action_value_participation_value.toFixed(2)),
        Number(cpa_pur.toFixed(2)), Number(cpa_wallet.toFixed(2)), Number(cpa_task.toFixed(2))
      ]);
    });

    // GOOGLE ADS (Brand vs Non-brand)
    var googleCamps = [
      { id: 'C_G1', name: 'Search_Brand', net: 'Search', brand: 'Brand', stage: 'Prospecting', ctrB: 0.15, cpcB: 0.5 },
      { id: 'C_G2', name: 'Search_NonBrand', net: 'Search', brand: 'NonBrand', stage: 'Prospecting', ctrB: 0.04, cpcB: 1.8 }
    ];

    var totalGoogleSpendDay = 0;
    var totalGoogleConvsDay = 0;

    googleCamps.forEach(function(c) {
      var isNonBrand = c.brand === 'NonBrand';
      var pressure = isNonBrand && googlePressure;
      var imp = Math.round(isNonBrand ? 50000 * weekendFactor : 5000 * weekendFactor);
      
      var ctr = c.ctrB * (pressure ? 0.8 : 1) * (1 + rng.normal(0, 0.05));
      var clicks = Math.round(imp * ctr);
      
      var cpc = c.cpcB * (pressure ? 1.4 : 1) * (1 + rng.normal(0, 0.05));
      var spend = clicks * cpc;
      var cost_micros = Math.round(spend * 1000000);

      var cvRate = (isNonBrand ? 0.08 : 0.15) * (pressure ? 0.8 : 1) * (trackingBreak ? 0.15 : 1);
      var conversions = Math.max(0, Math.round(clicks * cvRate));
      var conversions_value = conversions * Math.round(75 + rng.normal(0, 5));
      
      var cpa = conversions > 0 ? (spend / conversions) : 0;
      var roas = spend > 0 ? (conversions_value / spend) : 0;

      // Ensure we don't divide by zero for impression share proxies
      var sis = isNonBrand ? 0.6 - (pressure ? 0.2 : 0) : 0.9;
      var srlis = (1 - sis) * 0.4;
      var sblis = (1 - sis) * 0.6;

      totalGoogleSpendDay += spend;
      totalGoogleConvsDay += conversions;

      googleRows.push([
        dateStr, 'CUST_GOOG', c.id, c.name,
        c.id + '_AG1', c.name + '_Group', c.id + '_AD1', c.name + '_Ad',
        c.net, c.brand, c.stage, 'crypto ' + c.brand.toLowerCase(), 'US', 'Mobile',
        imp, clicks, cost_micros, Number(ctr.toFixed(4)), Number(cpc.toFixed(2)),
        conversions, Number(conversions_value.toFixed(2)), Number(cpa.toFixed(2)), Number(roas.toFixed(2)),
        Number(sis.toFixed(2)), Number(srlis.toFixed(2)), Number(sblis.toFixed(2))
      ]);
    });

    // SITE FUNNEL (By Channel)
    var channels = ['Meta', 'Google', 'Organic', 'Influencer'];
    var funnelTotalRevenueDay = 0;
    var funnelTotalConvsDay = 0;
    var funnelTotalSessionsDay = 0;

    channels.forEach(function(ch) {
      var baseSess = 0;
      if(ch === 'Meta') baseSess = Math.round(totalMetaSpendDay * 1.5);
      else if(ch === 'Google') baseSess = Math.round(totalGoogleSpendDay * 0.8);
      else if(ch === 'Organic') baseSess = Math.round(2000 * weekendFactor);
      else if(ch === 'Influencer') baseSess = influencerSpike ? 15000 : Math.round(100 * weekendFactor);

      var sessions = Math.round(baseSess * (1 + rng.normal(0, 0.05)));
      var engaged_sessions = Math.round(sessions * (ch === 'Influencer' && influencerSpike ? 0.2 : 0.6));
      var landing_page_views = engaged_sessions;
      var cta_clicks = Math.round(engaged_sessions * 0.4);
      
      var tbrk = trackingBreak ? 0.1 : 1;
      var wcr = 0.5 * tbrk * (ch === 'Influencer' && influencerSpike ? 0.3 : 1) * experimentLift;
      
      var wallet_connects = Math.round(cta_clicks * wcr);
      var task_starts = Math.round(wallet_connects * 0.8);
      var task_completes = Math.round(task_starts * 0.6);
      var readiness_actions = Math.round(task_completes * 0.8);
      var participation_success = Math.round(readiness_actions * 0.9);
      var purchase_count = Math.round(participation_success * 0.5);
      
      var aov = 75 + rng.normal(0, 3);
      var revenue = purchase_count * aov;
      var refunds = Math.round(revenue * 0.02);

      funnelTotalRevenueDay += revenue;
      funnelTotalConvsDay += purchase_count;
      funnelTotalSessionsDay += sessions;

      funnelRows.push([
        dateStr, ch,
        sessions, engaged_sessions, landing_page_views, cta_clicks,
        wallet_connects, task_starts, task_completes, readiness_actions, participation_success,
        purchase_count, Number(revenue.toFixed(2)), Number(refunds.toFixed(2))
      ]);
    });

    // RETARGETING AUDIENCES
    var buckets = [
      { name: 'visited_bounced', sizeP: 5000, prog: 0.15 },
      { name: 'engaged_no_wallet', sizeP: 2000, prog: 0.25 },
      { name: 'wallet_no_task', sizeP: 800, prog: 0.4 },
      { name: 'task_no_readiness', sizeP: 400, prog: 0.6 },
      { name: 'readiness_no_participation', sizeP: 150, prog: 0.8 }
    ];

    buckets.forEach(function(b) {
      var size = Math.round(b.sizeP * weekendFactor * (1 + rng.normal(0, 0.02)));
      var plat = rng.next() > 0.5 ? 'Meta' : 'Google';
      var imps = Math.round(size * 1.2);
      var clks = Math.round(imps * 0.02);
      var spnd = clks * 1.1;
      var convs = Math.round(clks * b.prog * (trackingBreak ? 0.1 : 1));
      retargetingRows.push([
        dateStr, plat, b.name, size, imps, clks, Number(spnd.toFixed(2)), convs, "1.2"
      ]);
    });

    // Summary logic for KPI Dashboard
    var platRoas = totalMetaSpendDay + totalGoogleSpendDay > 0 ? ((totalMetaConvsDay + totalGoogleConvsDay) * 75) / (totalMetaSpendDay + totalGoogleSpendDay) : 0;
    var modRoas = totalMetaSpendDay + totalGoogleSpendDay > 0 ? funnelTotalRevenueDay / (totalMetaSpendDay + totalGoogleSpendDay) : 0;
    
    kpiSummary.push({
      dateStr: dateStr,
      spend: totalMetaSpendDay + totalGoogleSpendDay,
      sessions: funnelTotalSessionsDay,
      conversions: funnelTotalConvsDay,
      revenue: funnelTotalRevenueDay,
      platRoas: platRoas,
      modRoas: modRoas,
      wc_rate: 0.2 * experimentLift, // approx proxy calculation for dashboard mockup
      offset: d,
      website_revamp: websiteRevamp,
      partner_announcement: partnerAnnouncement,
      kol_campaign: kolCampaign,
      influencer_spike: influencerSpike,
      tracking_break: trackingBreak,
      experiment_active: d >= 2 && d <= 14
    });
  }

  // Write all tabs
  writeReadmeTab(ss.getSheetByName('README'), seed, baseDate, startOffset, endOffset);
  writeConfigTab(ss.getSheetByName('CONFIG'), seed, baseDate, startOffset, endOffset);
  
  writeArray(ss.getSheetByName('META_ADS_DAILY'), [
    ['date', 'account_id', 'campaign_id', 'campaign_name', 'adset_id', 'adset_name', 'ad_id', 'ad_name',
     'objective', 'funnel_stage', 'persona', 'creative_angle', 'format', 'geo', 'device',
     'impressions', 'reach', 'frequency', 'spend', 'clicks', 'unique_clicks', 'ctr', 'cpc', 'cpm',
     'actions_wallet_connect', 'actions_task_complete', 'actions_readiness_action', 'actions_participation', 'actions_purchase',
     'action_value_purchase', 'action_value_participation_value', 'cpa_purchase', 'cpa_wallet_connect', 'cpa_task_complete']
  ].concat(metaRows));

  writeArray(ss.getSheetByName('GOOGLE_ADS_DAILY'), [
    ['date', 'customer_id', 'campaign_id', 'campaign_name', 'ad_group_id', 'ad_group_name', 'ad_id', 'ad_name',
     'network', 'brand_vs_nonbrand', 'funnel_stage', 'keyword_theme', 'geo', 'device',
     'impressions', 'clicks', 'cost_micros', 'ctr', 'average_cpc', 'conversions', 'conversions_value', 'cost_per_conversion', 'conversions_value_per_cost',
     'search_impression_share', 'search_rank_lost_impression_share', 'search_budget_lost_impression_share']
  ].concat(googleRows));

  writeArray(ss.getSheetByName('SITE_FUNNEL_DAILY'), [
    ['date', 'channel', 'sessions', 'engaged_sessions', 'landing_page_views', 'cta_clicks',
     'wallet_connects', 'task_starts', 'task_completes', 'readiness_actions', 'participation_success',
     'purchase_count', 'revenue', 'refunds']
  ].concat(funnelRows));

  writeIdentityMapDynamic(ss.getSheetByName('IDENTITY_MAP'), rng);

  writeArray(ss.getSheetByName('RETARGETING_AUDIENCES_DAILY'), [
    ['date', 'platform', 'retarget_bucket', 'audience_size', 'impressions', 'clicks', 'spend', 'conversions_to_next_stage', 'frequency']
  ].concat(retargetingRows));

  writeUtmMap(ss.getSheetByName('UTM_MAPPING'));
  writeExperiments(ss.getSheetByName('EXPERIMENTS'), kpiSummary[57], kpiSummary[69]); // Approx T+2 to T+14
  writeAttributionTab(ss.getSheetByName('ATTRIBUTION_MODELS'), kpiSummary);
  writeKpiDashboard(ss.getSheetByName('KPI_DASHBOARD'), kpiSummary);
  writeInsights(ss.getSheetByName('INSIGHTS'));
  writeWeeklyReports(ss.getSheetByName('WEEKLY_REPORTS'), kpiSummary);

  return ss.getUrl();
}

function createRng(seed) {
  var state = (seed >>> 0) || 1;
  return {
    next: function() { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; },
    normal: function(mean, stdev) {
      var u1 = Math.max(this.next(), 1e-9);
      var u2 = this.next();
      var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + z0 * stdev;
    }
  };
}

function normalizeTabs(ss, tabNames) {
  var sheets = ss.getSheets();
  sheets[0].setName(tabNames[0]);
  for (var i = 1; i < tabNames.length; i++) ss.insertSheet(tabNames[i]);
}

function writeArray(sheet, values) {
  sheet.clear();
  sheet.getRange(1, 1, values.length, values[0].length).setValues(values);
  sheet.setFrozenRows(1);
}

function writeReadmeTab(sheet, seed, baseDate, startOffset, endOffset) {
  writeArray(sheet, [
    ['section', 'details'],
    ['purpose', 'Synthetic marketing performance workbook with granular campaign rows and precise requested tabs.'],
    ['seed', String(seed)]
  ]);
}

function writeConfigTab(sheet, seed, baseDate, startOffset, endOffset) {
  writeArray(sheet, [
    ['key', 'value'],
    ['tracking_break_day', 'T-6'],
    ['influencer_spike_day', 'T-12']
  ]);
}

function writeIdentityMapDynamic(sheet, rng) {
  var rows = [['visitor_id', 'first_seen_date', 'channel_first_touch', 'wallet_id_hash', 'cohort_tag', 'is_returning_user', 'quality_score']];
  var channels = ['Meta', 'Google', 'Organic', 'Influencer'];
  for (var i = 1; i <= 100; i++) {
    var vId = 'V_' + Math.floor(rng.next() * 1000000);
    var wId = rng.next() > 0.3 ? '0x' + Math.floor(rng.next() * 1e16).toString(16) : '';
    var ch = channels[Math.floor(rng.next() * channels.length)];
    var q = Math.floor(rng.next() * 100);
    var isRet = rng.next() > 0.6;
    rows.push([vId, '2025-01-01', ch, wId, isRet ? 'retargeting_bucket' : 'prospecting', isRet, q]);
  }
  writeArray(sheet, rows);
}

function writeUtmMap(sheet) {
  writeArray(sheet, [['utm_source', 'utm_medium', 'utm_campaign', 'mapped_channel', 'notes']]);
}

function writeExperiments(sheet, d1, d2) {
  writeArray(sheet, [
    ['experiment_id', 'name', 'hypothesis', 'change_description', 'start_date', 'end_date', 'primary_metric', 'result', 'impact_summary', 'next_action'],
    ['EXP-CTA-001','Checkout CTA copy refresh','Urgency drives intent','Tested "Secure Now" vs "Connect"','2025-02-26','2025-03-10','wallet_connect_rate','win','+16%','Deploy to all LPs']
  ]);
}

function writeAttributionTab(sheet, summary) {
  var rows = [['date', 'channel', 'attributed_conversions_platform', 'attributed_conversions_modeled', 'attributed_conversions_blended', 'attributed_value_platform', 'attributed_value_modeled', 'attributed_value_blended', 'notes']];
  summary.forEach(function(s) {
    rows.push([s.dateStr, 'Meta', s.conversions, s.conversions, s.conversions, s.platRoas*s.spend, s.revenue*0.6, s.revenue*0.7, '']);
    rows.push([s.dateStr, 'Google', s.conversions, s.conversions, s.conversions, s.platRoas*s.spend, s.revenue*0.4, s.revenue*0.3, '']);
  });
  writeArray(sheet, rows);
}

function writeKpiDashboard(sheet, summary) {
  var rows = [['date', 'spend_by_channel', 'conversions_by_channel', 'value_by_channel', 'ROAS_by_channel', 'CPA_by_channel', 'wow_deltas', 'pacing_vs_plan', 'readiness_score', 'wallet_connect_rate', 'task_completion_rate', 'readiness_rate', 'participation_rate', 'fatigue_flags', 'anomaly_flags']];
  summary.forEach(function(s) {
    rows.push([s.dateStr, s.spend, s.conversions, s.revenue, Number(s.modRoas.toFixed(2)), s.conversions > 0 ? Number((s.spend/s.conversions).toFixed(2)) : 0, '0%', 'on_track', '85', Number(s.wc_rate.toFixed(2)), '0.4', '0.6', '0.8', '', '']);
  });
  writeArray(sheet, rows);
}

function writeInsights(sheet) {
  writeArray(sheet, [['date_range', 'insight_title', 'observation', 'likely_causes', 'recommended_actions', 'confidence', 'cited_metrics']]);
}

function writeWeeklyReports(sheet, summary) {
  var rows = [['week_num', 'week_start', 'week_end', 'narrative_summary', 'key_activities', 'spend', 'sessions', 'conversions']];
  if (!summary || summary.length === 0) {
    writeArray(sheet, rows);
    return;
  }

  var sorted = summary.slice().sort(function(a, b) { return a.dateStr.localeCompare(b.dateStr); });
  var firstOffset = sorted[0].offset;
  var weekMap = {};

  sorted.forEach(function(day) {
    var weekNum = Math.floor((day.offset - firstOffset) / 7) + 1;
    if (!weekMap[weekNum]) {
      weekMap[weekNum] = {
        week_num: weekNum,
        week_start: day.dateStr,
        week_end: day.dateStr,
        spend: 0,
        sessions: 0,
        conversions: 0,
        events: {}
      };
    }
    var bucket = weekMap[weekNum];
    bucket.week_end = day.dateStr;
    bucket.spend += day.spend;
    bucket.sessions += day.sessions || 0;
    bucket.conversions += day.conversions;

    if (day.website_revamp) bucket.events.Website = true;
    if (day.partner_announcement) bucket.events.Partnerships = true;
    if (day.kol_campaign) bucket.events.KOL = true;
    if (day.offset >= -67 && day.offset <= -46) {
      bucket.events.Content = true;
      bucket.events.Community = true;
    }
    if (day.offset >= -45) bucket.events.Paid = true;
    if (day.influencer_spike) bucket.events.Influencer = true;
    if (day.tracking_break) bucket.events.Measurement = true;
    if (day.experiment_active) bucket.events.Experiment = true;
  });

  Object.keys(weekMap)
    .map(function(k) { return weekMap[k]; })
    .sort(function(a, b) { return a.week_num - b.week_num; })
    .forEach(function(w) {
      var activities = Object.keys(w.events);
      var lead = '';
      if (w.events.Website) lead = 'Website revamped. Baseline sessions initializing.';
      else if (w.events.Partnerships) lead = 'Partner announcement expanded top-of-funnel reach.';
      else if (w.events.Influencer) lead = 'Influencer traffic spike delivered high volume with mixed quality.';
      else if (w.events.Measurement) lead = 'Tracking break detected and stabilized via war-room response.';
      else if (w.events.Experiment) lead = 'Experimentation window active with conversion-rate uplift.';
      else if (w.week_num <= 4) lead = 'Organic seeding and community momentum building.';
      else lead = 'Paid engine optimization and readiness gating progressed.';

      var narrative = 'Week ' + w.week_num + ': ' + lead +
        ' Spend $' + Math.round(w.spend).toLocaleString() +
        ', sessions ' + Math.round(w.sessions).toLocaleString() +
        ', conversions ' + Math.round(w.conversions).toLocaleString() + '.';

      rows.push([
        w.week_num,
        w.week_start,
        w.week_end,
        narrative,
        activities.join(', '),
        Number(w.spend.toFixed(2)),
        Math.round(w.sessions),
        Math.round(w.conversions)
      ]);
    });

  writeArray(sheet, rows);
}
