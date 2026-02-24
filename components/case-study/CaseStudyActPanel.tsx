import { ReactNode } from 'react';

export function CaseStudyActPanel({
  id,
  title,
  range,
  thesis,
  action,
  result,
  children
}: {
  id: string;
  title: string;
  range: string;
  thesis: string;
  action: string;
  result: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{range}</p>
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs text-slate-400">What Happened</p>
          <p className="mt-1 text-sm text-slate-200">{thesis}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs text-slate-400">Action Taken</p>
          <p className="mt-1 text-sm text-slate-200">{action}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <p className="text-xs text-slate-400">Observed Result</p>
          <p className="mt-1 text-sm text-slate-200">{result}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
