import assert from 'node:assert/strict';
import { canonicalPrompts } from '../src/data.js';
import { getInsightCards, getWeeklyReports, validateCanonicalPrompts } from '../src/analyst.js';

const insights = getInsightCards(10);
assert.equal(insights.length, 10, 'Must return at least 10 insight cards');
assert.ok(insights.every((x) => Array.isArray(x.cited_metrics) && x.cited_metrics.length > 0), 'Each insight needs cited_metrics');

const reports = getWeeklyReports(8);
assert.ok(reports.length >= 8, 'Must return at least 8 weekly reports');
assert.ok(reports.every((r) => r.citations.length >= 2), 'Each weekly report must include citations');

const validations = validateCanonicalPrompts();
assert.equal(validations.length, canonicalPrompts.length, 'All canonical prompts should be validated');
assert.ok(validations.every((v) => v.valid), 'All canonical prompts should return cited answers');

console.log('All analyst validations passed.');
