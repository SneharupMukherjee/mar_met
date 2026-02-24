import { answerQuestion, getInsightCards, getWeeklyReports } from '../src/analyst.js';

const insightsRoot = document.getElementById('insights');
const reportsRoot = document.getElementById('reports');
const responseRoot = document.getElementById('qaResponse');

document.getElementById('askBtn').addEventListener('click', () => {
  const prompt = document.getElementById('question').value;
  const res = answerQuestion(prompt);
  responseRoot.textContent = `${res.answer}\n\nCitations:\n- ${res.citations.join('\n- ')}`;
});

getInsightCards(10).forEach((insight) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `<h3>${insight.title}</h3><p>${insight.narrative}</p><small>Cited metrics: ${insight.cited_metrics.join('; ')}</small>`;
  insightsRoot.appendChild(card);
});

getWeeklyReports(8).forEach((report) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <h3>Week ${report.week_start}</h3>
    <p><strong>Exec:</strong> ${report.exec_summary}</p>
    <p><strong>Wins:</strong> ${report.wins}</p>
    <p><strong>Issues:</strong> ${report.issues}</p>
    <p><strong>Actions:</strong> ${report.actions}</p>
    <p><strong>Risks:</strong> ${report.risks}</p>
    <small>Citations: ${report.citations.join('; ')}</small>
  `;
  reportsRoot.appendChild(card);
});
