export function CaseStudyFlowDiagram() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="mb-3 text-xs text-slate-400">Measurement Integrity Diagram</p>
      <svg viewBox="0 0 900 220" className="h-44 w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
        <rect x="20" y="50" width="170" height="60" rx="10" fill="#0f172a" stroke="#334155" />
        <text x="105" y="77" textAnchor="middle" fill="#cbd5e1" fontSize="12">
          Ad Platforms
        </text>
        <text x="105" y="95" textAnchor="middle" fill="#94a3b8" fontSize="11">
          Click + Spend Stream
        </text>

        <rect x="250" y="50" width="170" height="60" rx="10" fill="#0f172a" stroke="#334155" />
        <text x="335" y="77" textAnchor="middle" fill="#cbd5e1" fontSize="12">
          Tracking Layer
        </text>
        <text x="335" y="95" textAnchor="middle" fill="#94a3b8" fontSize="11">
          Pixel + UTM Mapping
        </text>

        <rect x="480" y="50" width="170" height="60" rx="10" fill="#1f2937" stroke="#ef4444" />
        <text x="565" y="77" textAnchor="middle" fill="#fecaca" fontSize="12">
          T-6 Break
        </text>
        <text x="565" y="95" textAnchor="middle" fill="#fca5a5" fontSize="11">
          Conversion Loss
        </text>

        <rect x="710" y="50" width="170" height="60" rx="10" fill="#0f172a" stroke="#334155" />
        <text x="795" y="77" textAnchor="middle" fill="#cbd5e1" fontSize="12">
          War-Room Recovery
        </text>
        <text x="795" y="95" textAnchor="middle" fill="#94a3b8" fontSize="11">
          Detection + Backfill
        </text>

        <line x1="190" y1="80" x2="250" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="420" y1="80" x2="480" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="650" y1="80" x2="710" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

        <text x="565" y="150" textAnchor="middle" fill="#cbd5e1" fontSize="12">
          Anomaly Rule: spend stable AND conversions collapse → incident flag
        </text>
      </svg>
    </div>
  );
}
