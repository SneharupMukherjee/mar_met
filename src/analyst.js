import { sheetTables, allowedFields, canonicalPrompts } from './data.js';

function fmtCitation(table, field, window) {
  return `${table}.${field}[${window}]`;
}

function withinJanuary2026(row) {
  return row.week_start >= '2026-01-01' && row.week_start <= '2026-01-31';
}

function latestWeekRows() {
  const latest = [...new Set(sheetTables.KPI_DASHBOARD.map((r) => r.week_start))].sort().at(-1);
  return sheetTables.KPI_DASHBOARD.filter((r) => r.week_start === latest);
}

function bestCpaTrendJanuary() {
  const janRows = sheetTables.KPI_DASHBOARD.filter(withinJanuary2026);
  const channels = [...new Set(janRows.map((r) => r.channel))];
  const trends = channels.map((channel) => {
    const rows = janRows.filter((r) => r.channel === channel).sort((a, b) => a.week_start.localeCompare(b.week_start));
    return { channel, delta: rows.at(-1).cpa - rows[0].cpa, start: rows[0].cpa, end: rows.at(-1).cpa };
  });
  trends.sort((a, b) => a.delta - b.delta);
  return trends[0];
}

export function getInsightCards(limit = 10) {
  return sheetTables.INSIGHTS.slice(0, limit).map((insight) => ({
    ...insight,
    cited_metrics: insight.cited_metrics
  }));
}

export function getWeeklyReports(minimum = 8) {
  return sheetTables.WEEKLY_REPORTS.slice(0, Math.max(minimum, sheetTables.WEEKLY_REPORTS.length)).map((r) => ({
    ...r,
    citations: [
      fmtCitation('WEEKLY_REPORTS', 'exec_summary', r.week_start),
      fmtCitation('WEEKLY_REPORTS', 'wins/issues/actions/risks', r.week_start)
    ]
  }));
}

export function answerQuestion(prompt) {
  const normalized = prompt.trim().toLowerCase();

  if (normalized === canonicalPrompts[0].toLowerCase()) {
    const rows = latestWeekRows();
    return {
      answer: rows.map((r) => `${r.channel}: ROAS ${r.roas.toFixed(1)}`).join('; '),
      citations: [fmtCitation('KPI_DASHBOARD', 'ROAS_by_channel', `${rows[0].week_start}..${rows[0].week_start}`)]
    };
  }

  if (normalized === canonicalPrompts[1].toLowerCase()) {
    const trend = bestCpaTrendJanuary();
    return {
      answer: `${trend.channel} shows the best CPA trend (${trend.start} → ${trend.end}, delta ${trend.delta}).`,
      citations: [fmtCitation('KPI_DASHBOARD', 'CPA_by_channel', `${trend.channel},2026-01-05..2026-01-26`)]
    };
  }

  if (normalized === canonicalPrompts[2].toLowerCase()) {
    const top = getInsightCards(3);
    return {
      answer: top.map((x) => `${x.title}: ${x.narrative}`).join(' | '),
      citations: top.flatMap((x) => x.cited_metrics)
    };
  }

  if (normalized === canonicalPrompts[3].toLowerCase()) {
    const week = '2026-01-26';
    const report = sheetTables.WEEKLY_REPORTS.find((r) => r.week_start === week);
    return {
      answer: `Exec summary: ${report.exec_summary}\nWins: ${report.wins}\nIssues: ${report.issues}\nActions: ${report.actions}\nRisks: ${report.risks}`,
      citations: [
        fmtCitation('WEEKLY_REPORTS', 'exec_summary', week),
        fmtCitation('WEEKLY_REPORTS', 'wins', week),
        fmtCitation('WEEKLY_REPORTS', 'issues', week),
        fmtCitation('WEEKLY_REPORTS', 'actions', week),
        fmtCitation('WEEKLY_REPORTS', 'risks', week)
      ]
    };
  }

  if (normalized === canonicalPrompts[4].toLowerCase()) {
    const last4 = sheetTables.WEEKLY_REPORTS.slice(-4);
    return {
      answer: last4.map((r) => `${r.week_start}: ${r.risks}`).join(' | '),
      citations: [fmtCitation('WEEKLY_REPORTS', 'risks', `${last4[0].week_start}..${last4.at(-1).week_start}`)]
    };
  }

  return {
    answer: 'I can only answer using available sheet tables/fields: KPI_DASHBOARD, INSIGHTS, WEEKLY_REPORTS.',
    citations: [fmtCitation('SCHEMA', 'allowed_fields', Object.entries(allowedFields).map(([t, f]) => `${t}:${f.join(',')}`).join(';'))]
  };
}

export function validateCanonicalPrompts() {
  return canonicalPrompts.map((prompt) => {
    const response = answerQuestion(prompt);
    return {
      prompt,
      valid: Boolean(response.answer) && response.citations.length > 0,
      citations: response.citations
    };
  });
}
