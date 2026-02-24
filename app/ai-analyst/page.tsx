import { AIAnalyst } from '@/components/AIAnalyst';

export default async function AIAnalystPage() {
  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">AI Analyst</h2>
        <p className="text-sm text-slate-300">Interact with the data, review anomalies, and read auto-generated insights.</p>
      </header>
      <AIAnalyst />
    </section>
  );
}
