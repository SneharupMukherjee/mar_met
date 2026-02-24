'use client';

import { CaseStudyEvent, EventCategory, EvidenceKey } from '@/lib/data/caseStudySelectors';

export function CaseStudyTimeline({
  events,
  selectedCategories,
  onToggleCategory,
  onSelectEvent
}: {
  events: CaseStudyEvent[];
  selectedCategories: EventCategory[];
  onToggleCategory: (category: EventCategory) => void;
  onSelectEvent: (keys: EvidenceKey[]) => void;
}) {
  const categories: EventCategory[] = ['Awareness', 'Paid', 'Measurement', 'Experiment'];
  const filtered = events.filter((event) => selectedCategories.includes(event.category));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={`rounded-full border px-3 py-1 text-xs ${
                active ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-300'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((event, idx) => (
          <button
            key={event.id}
            onClick={() => onSelectEvent(event.evidenceKeys)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left transition hover:border-cyan-500/50"
          >
            <p className="text-xs text-slate-400">
              Event {idx + 1} • {event.date} • {event.category}
            </p>
            <h4 className="mt-1 font-semibold text-slate-100">{event.title}</h4>
            <p className="mt-1 text-sm text-slate-300">{event.summary}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
