import { getWeeklyReportsData } from '@/lib/data/client';

export default async function WeeklyReportsPage() {
  const data = (await getWeeklyReportsData()).sort((a, b) => a.week_num - b.week_num);

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Weekly Reports</h2>
        <p className="text-sm text-slate-300">Week-by-week storyline and KPI progression from T-75 through T+14.</p>
      </header>

      {data.length === 0 ? (
        <div className="card">
          <p className="text-sm text-slate-300">No weekly report data found. Run `npm run regen:data` to generate `/public/data/weekly_reports.json`.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((week) => (
            <details key={week.week_num} className="card">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">
                    Week {week.week_num}: {week.week_start} to {week.week_end}
                  </p>
                  <div className="flex gap-2 text-xs text-slate-300">
                    <span className="rounded bg-slate-800 px-2 py-1">Spend ${Math.round(week.spend).toLocaleString()}</span>
                    <span className="rounded bg-slate-800 px-2 py-1">Sessions {Math.round(week.sessions).toLocaleString()}</span>
                    <span className="rounded bg-slate-800 px-2 py-1">Conversions {Math.round(week.conversions).toLocaleString()}</span>
                  </div>
                </div>
              </summary>
              <div className="mt-4 space-y-3 border-t border-slate-800 pt-3">
                <p className="text-sm text-slate-200">{week.narrative_summary}</p>
                <div className="flex flex-wrap gap-2">
                  {week.key_activities
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((activity) => (
                      <span key={`${week.week_num}-${activity}`} className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                        {activity}
                      </span>
                    ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
