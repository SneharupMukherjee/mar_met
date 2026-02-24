# KPI_DASHBOARD Sheets formulas (optional companion)

If you mirror `KPI_DASHBOARD` into Google Sheets, these formulas can be used per-row.
Assume named columns:
- `spend`, `conversions`, `conversion_value`
- `wallet_connects`, `task_completions`, `readied_users`, `participants`
- `prior_spend`, `prior_conversions`, `prior_conversion_value`, `prior_roas`, `prior_cpa`
- `period_budget`, `expected_budget_to_date`
- `platform_value`, `modeled_value`, `platform_weight`, `modeled_weight`, `disagreement_threshold`

## Core channel KPIs
- ROAS: `=IFERROR([@conversion_value]/[@spend],)`
- CPA: `=IFERROR([@spend]/[@conversions],)`

## Stage rates
- wallet_connect_rate: `=IFERROR([@wallet_connects]/[@conversions],)`
- task_completion_rate: `=IFERROR([@task_completions]/[@wallet_connects],)`
- readiness_rate: `=IFERROR([@readied_users]/[@task_completions],)`
- participation_rate: `=IFERROR([@participants]/[@readied_users],)`

## WoW comparisons
- wow_spend_pct: `=IFERROR(([@spend]-[@prior_spend]) / [@prior_spend],)`
- wow_conversions_pct: `=IFERROR(([@conversions]-[@prior_conversions]) / [@prior_conversions],)`
- wow_value_pct: `=IFERROR(([@conversion_value]-[@prior_conversion_value]) / [@prior_conversion_value],)`

## Pacing vs plan
- pacing_vs_plan: `=IFERROR([@spend]/[@period_budget],)`
- pacing_vs_expected_to_date: `=IFERROR([@spend]/[@expected_budget_to_date],)`

## Readiness score composite
- `=SUMPRODUCT({0.25,0.25,0.25,0.25}, {[@wallet_connect_rate],[@task_completion_rate],[@readiness_rate],[@participation_rate]})`

## Attribution + disagreement
- blended_value: `=[@platform_value]*[@platform_weight] + [@modeled_value]*[@modeled_weight]`
- disagreement_flag: `=IFERROR(IF(ABS([@platform_value]-[@modeled_value])/ABS([@modeled_value])>=[@disagreement_threshold],1,0),0)`
- disagreement_note:
  `=IF([@modeled_value]=0,"modeled attribution unavailable for comparison",IF([@disagreement_flag]=1,"platform and modeled attribution differ beyond configured threshold","platform and modeled attribution aligned"))`
