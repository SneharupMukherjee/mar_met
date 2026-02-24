import { DashboardPage } from '@/components/DashboardPage';

export default async function CaseStudyPage() {
  return (
    <DashboardPage title="Case Study: The TGE That Didn't Flop" description="Narrative summary of the project storyline.">
      <div className="prose prose-slate max-w-4xl bg-white p-8 border rounded-lg shadow-sm mt-6">
        <h3>Act 1 (T–45 to T–21): The Reality Check</h3>
        <p>
          Initial excitement ran high as Meta Prospecting Video drove massive reach. However, an early peek at the funnel revealed impressions were merely hype. While CTR was stable, the `wallet_connect_rate` flatlined.
        </p>

        <h3>Act 2 (T–21 to T–10): Refusing to Scale</h3>
        <p>
          We introduced a composite &quot;TGE Readiness Score&quot;. Instead of pushing more budget into the void, we shifted focus to mid-funnel retargeting. On T-12, an influencer tweet sparked a 150x traffic surge, but our dashboard quickly identified it as &quot;tourist volume&quot;—sessions skyrocketed, but purchases/participation remained dismal.
        </p>
        <p>
          During this period (T-18 to T-8), we also faced intense Google non-brand auction pressure. CPC rose dramatically, prompting us to restrict broad match and double down on exact match keywords.
        </p>

        <h3>Act 3 (T–10 to T–1): The Pipeline Breaks</h3>
        <p>
          On T-6, disaster struck: an engineering deploy stripped UTM mappings and broke the pixel. `conversions` dropped to near zero. Our anomaly detection caught the mismatch between steady `spend` and zero downstream actions. By T-5, the pipeline was restored and event backfills normalized the data.
        </p>

        <h3>Act 4 (TGE Day): War-Room Discipline</h3>
        <p>
          Instead of guessing, the team routed decisions through the command center. Our experiment on the checkout CTA (`EXP-CTA-001`) yielded a 16% uplift in wallet connections right when traffic peaked, successfully capturing the pent-up intent. By launch, the retargeting engine converted &quot;tourists&quot; into actual participants.
        </p>
      </div>
    </DashboardPage>
  );
}
