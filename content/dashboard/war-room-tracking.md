# War-Room Tracking-Break Detection Dashboard

> [!WARNING]
> **Synthetic-data disclaimer (persistent):** All figures, trends, and narratives on this dashboard are generated from synthetic data for demonstration and planning. Do **not** treat values as live performance or financial reporting.

## Core signal
- Abrupt event drop begins on 2026-01-14 despite stable media delivery.
- Click/session parity diverges beyond alert threshold.

## Decision block
- **What changed:** Observed conversion events fell sharply with no mirrored CPM/CPC shift.
- **Likely why:** Tag deployment or event forwarding regression likely introduced measurement loss.
- **What to do next:** Trigger backfill + rollback checklist; run parallel validation against platform conversion APIs.
- **Tradeoffs/confidence:** High confidence in break detection, medium confidence in exact root cause until logs confirm.
