import { AttributionViewPanel } from '@/components/AttributionViewPanel';
import { ATTRIBUTION_MODELS } from '@/lib/data/dashboardTabs';

export default async function AttributionViewPage() {
  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-2xl font-semibold">Attribution View</h2>
        <p className="text-sm text-slate-300">Compare Platform, Modeled, and Blended revenue attribution by channel.</p>
      </header>
      <AttributionViewPanel rows={ATTRIBUTION_MODELS} />
    </section>
  );
}
