# Synthetic Workbook Generator

This repo provides a deterministic Google Apps Script generator that creates a single Google Spreadsheet with these exact tabs:

- `README`
- `CONFIG`
- `META_ADS_DAILY`
- `GOOGLE_ADS_DAILY`
- `SITE_FUNNEL_DAILY`
- `IDENTITY_MAP`
- `RETARGETING_AUDIENCES_DAILY`
- `UTM_MAPPING`
- `EXPERIMENTS`
- `ATTRIBUTION_MODELS`
- `KPI_DASHBOARD`
- `INSIGHTS`
- `WEEKLY_REPORTS`

## What it simulates

The generated workbook contains **90 days** of synthetic data from **T-75 through T+14**, including:

- website revamp baseline initialization (`T-75`),
- organic/content/community seeding across early pre-launch weeks,
- partner announcement lift (`T-60`) and periodic KOL campaigns (including `T-30`),
- weekend seasonality,
- Meta creative fatigue (frequency rises, CTR decays, CPA worsens),
- Google non-brand auction pressure (`T-18..T-8`) with higher CPC and weaker efficiency,
- one tracking-break day (`T-6`) with collapse + recovery,
- one influencer traffic spike (`T-12`) with low quality,
- one winning experiment (`T+2..T+14`) with measurable uplift,
- attribution mismatch between platform-attributed and modeled views.

## Regenerate the full workbook

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project.
3. Paste `workbook_generator.gs` into the script editor.
4. Run one of the following from the editor:

```javascript
// default deterministic run
generateWorkbook();

// explicit deterministic run
generateWorkbook({
  seed: 20250224,
  baseDate: '2025-02-24',
  name: 'MarMet Synthetic Workbook'
});
```

5. Authorize once when prompted.
6. The function returns a Spreadsheet URL for the newly created workbook.

## Determinism notes

- The generator uses a seeded linear congruential RNG.
- Given the same `seed` and `baseDate`, outputs are reproducible.
