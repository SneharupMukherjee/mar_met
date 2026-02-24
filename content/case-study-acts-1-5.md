# Case Study: Acts 1–5 Mapped to Dashboard Evidence

> [!WARNING]
> **Synthetic-data disclaimer (persistent):** All figures, trends, and narratives on this dashboard are generated from synthetic data for demonstration and planning. Do **not** treat values as live performance or financial reporting.

## Act 1 — Leakage Diagnosis

**Narrative:** The team observed top-of-funnel spend growth without proportional wallet connects or downstream retention.

**Dashboard evidence mapping:**
- `Leakage Diagnosis` page shows stage-to-stage conversion cliffs at `ad click → landing` and `wallet connect → first on-chain action`.
- Cohort overlays indicate drop-off is concentrated in mobile web and one creative angle.
- Alert card confirms **spend up with flat participation** in the same window.

## Act 2 — Readiness Score Gating

**Narrative:** The campaign shifted from broad prospecting to readiness-gated routing, prioritizing users with stronger intent signals.

**Dashboard evidence mapping:**
- `Readiness Score Gating` page demonstrates threshold policy updates and acceptance-rate shifts.
- Routing panel shows lower-volume but higher quality traffic entering retargeting.
- Tradeoff table highlights reduced immediate reach for better cost-adjusted progression.

## Act 3 — Retargeting-Stage Progression

**Narrative:** Retargeting split into sequential stages (awareness reminder → proof → conversion CTA) to reduce fatigue and improve sequencing.

**Dashboard evidence mapping:**
- `Retargeting Progression` page tracks audience flow across stage 1/2/3.
- Stage transition chart shows lift in stage completion after gating changes.
- Creative-level panel flags when progression stalls by angle.

## Act 4 — War-Room Tracking-Break Detection

**Narrative:** War-room review identified a tracking break that disguised true conversion behavior.

**Dashboard evidence mapping:**
- `War-Room Tracking` page shows event-volume discontinuity and timestamp anomaly.
- Alert card **tracking break suspected on date** triggers for the incident window.
- Data-quality checks compare media-platform clicks vs analytics sessions to estimate measurement loss.

## Act 5 — Post-TGE Quality/Retention Proxy Outcomes

**Narrative:** After TGE, teams used short-horizon quality proxies to evaluate whether campaign changes improved durable behavior.

**Dashboard evidence mapping:**
- `Post-TGE Quality & Retention Proxies` page tracks D1/D7 return proxies, repeated on-chain action rate, and low-noise engagement markers.
- Cohort-level lift appears in readiness-gated + staged-retargeting cells vs control.
- Confidence panel notes causality limits and proposes next experiments.
