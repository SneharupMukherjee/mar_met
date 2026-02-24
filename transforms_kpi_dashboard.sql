-- KPI_DASHBOARD backend transform
-- Primary output table for dashboarding with daily and weekly rollups.
-- Assumes warehouse supports ANSI SQL window functions and DATE_TRUNC.

CREATE OR REPLACE TABLE KPI_DASHBOARD AS
WITH
-- -----------------------------------------------------------------------------
-- 1) Source normalization
-- -----------------------------------------------------------------------------
base_daily AS (
  SELECT
    CAST(event_date AS DATE) AS metric_date,
    channel,
    COALESCE(spend, 0.0) AS spend,
    COALESCE(conversions, 0.0) AS conversions,
    COALESCE(conversion_value, 0.0) AS conversion_value,
    COALESCE(wallet_connects, 0.0) AS wallet_connects,
    COALESCE(task_completions, 0.0) AS task_completions,
    COALESCE(readied_users, 0.0) AS readied_users,
    COALESCE(participants, 0.0) AS participants
  FROM fact_marketing_daily
),

base_weekly AS (
  SELECT
    DATE_TRUNC(metric_date, WEEK) AS metric_date,
    channel,
    SUM(spend) AS spend,
    SUM(conversions) AS conversions,
    SUM(conversion_value) AS conversion_value,
    SUM(wallet_connects) AS wallet_connects,
    SUM(task_completions) AS task_completions,
    SUM(readied_users) AS readied_users,
    SUM(participants) AS participants
  FROM base_daily
  GROUP BY 1, 2
),

base_union AS (
  SELECT 'daily' AS rollup_grain, metric_date, channel, spend, conversions, conversion_value,
         wallet_connects, task_completions, readied_users, participants
  FROM base_daily

  UNION ALL

  SELECT 'weekly' AS rollup_grain, metric_date, channel, spend, conversions, conversion_value,
         wallet_connects, task_completions, readied_users, participants
  FROM base_weekly
),

-- -----------------------------------------------------------------------------
-- 2) Core KPI calculations
-- -----------------------------------------------------------------------------
kpis AS (
  SELECT
    rollup_grain,
    metric_date,
    channel,
    spend,
    conversions,
    conversion_value,
    CASE WHEN spend = 0 THEN NULL ELSE conversion_value / spend END AS roas,
    CASE WHEN conversions = 0 THEN NULL ELSE spend / conversions END AS cpa,

    wallet_connects,
    task_completions,
    readied_users,
    participants,

    CASE WHEN conversions = 0 THEN NULL ELSE wallet_connects / conversions END AS wallet_connect_rate,
    CASE WHEN wallet_connects = 0 THEN NULL ELSE task_completions / wallet_connects END AS task_completion_rate,
    CASE WHEN task_completions = 0 THEN NULL ELSE readied_users / task_completions END AS readiness_rate,
    CASE WHEN readied_users = 0 THEN NULL ELSE participants / readied_users END AS participation_rate
  FROM base_union
),

-- -----------------------------------------------------------------------------
-- 3) WoW comparisons (7d vs prior 7d)
-- -----------------------------------------------------------------------------
wow AS (
  SELECT
    k.*,
    LAG(spend, CASE WHEN rollup_grain = 'daily' THEN 7 ELSE 1 END)
      OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date) AS prior_spend,
    LAG(conversions, CASE WHEN rollup_grain = 'daily' THEN 7 ELSE 1 END)
      OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date) AS prior_conversions,
    LAG(conversion_value, CASE WHEN rollup_grain = 'daily' THEN 7 ELSE 1 END)
      OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date) AS prior_conversion_value,
    LAG(roas, CASE WHEN rollup_grain = 'daily' THEN 7 ELSE 1 END)
      OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date) AS prior_roas,
    LAG(cpa, CASE WHEN rollup_grain = 'daily' THEN 7 ELSE 1 END)
      OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date) AS prior_cpa
  FROM kpis k
),

wow_delta AS (
  SELECT
    w.*,
    (spend - prior_spend) AS wow_spend_abs,
    CASE WHEN prior_spend = 0 OR prior_spend IS NULL THEN NULL ELSE (spend - prior_spend) / prior_spend END AS wow_spend_pct,
    (conversions - prior_conversions) AS wow_conversions_abs,
    CASE WHEN prior_conversions = 0 OR prior_conversions IS NULL THEN NULL ELSE (conversions - prior_conversions) / prior_conversions END AS wow_conversions_pct,
    (conversion_value - prior_conversion_value) AS wow_value_abs,
    CASE WHEN prior_conversion_value = 0 OR prior_conversion_value IS NULL THEN NULL ELSE (conversion_value - prior_conversion_value) / prior_conversion_value END AS wow_value_pct,
    (roas - prior_roas) AS wow_roas_abs,
    (cpa - prior_cpa) AS wow_cpa_abs
  FROM wow w
),

-- -----------------------------------------------------------------------------
-- 4) Pacing vs CONFIG budget plan
-- config_budget_plan columns expected:
-- period_start (DATE), period_grain ('daily'|'weekly'), channel, budget_amount
-- -----------------------------------------------------------------------------
budget_joined AS (
  SELECT
    wd.*,
    bp.budget_amount,
    CASE
      WHEN wd.rollup_grain = 'daily' THEN bp.budget_amount
      WHEN wd.rollup_grain = 'weekly' THEN bp.budget_amount
      ELSE NULL
    END AS period_budget,
    CASE
      WHEN wd.rollup_grain = 'daily' THEN
        bp.budget_amount * LEAST(1.0, GREATEST(0.0, (DATEDIFF(day, wd.metric_date, CURRENT_DATE) * -1 + 1) / 1.0))
      WHEN wd.rollup_grain = 'weekly' THEN
        bp.budget_amount * LEAST(1.0, GREATEST(0.0, (DATEDIFF(day, DATE_TRUNC(wd.metric_date, WEEK), CURRENT_DATE) + 1) / 7.0))
      ELSE NULL
    END AS expected_budget_to_date
  FROM wow_delta wd
  LEFT JOIN config_budget_plan bp
    ON bp.channel = wd.channel
   AND bp.period_grain = wd.rollup_grain
   AND bp.period_start = wd.metric_date
),

paced AS (
  SELECT
    bj.*,
    CASE WHEN period_budget = 0 OR period_budget IS NULL THEN NULL ELSE spend / period_budget END AS pacing_vs_plan,
    CASE WHEN expected_budget_to_date = 0 OR expected_budget_to_date IS NULL THEN NULL ELSE spend / expected_budget_to_date END AS pacing_vs_expected_to_date
  FROM budget_joined bj
),

-- -----------------------------------------------------------------------------
-- 5) Readiness score composite
-- config_metric_weights expected one-row table:
-- wallet_connect_weight, task_completion_weight, readiness_weight, participation_weight
-- -----------------------------------------------------------------------------
scored AS (
  SELECT
    p.*,
    (
      COALESCE(p.wallet_connect_rate, 0) * COALESCE(mw.wallet_connect_weight, 0.25)
      + COALESCE(p.task_completion_rate, 0) * COALESCE(mw.task_completion_weight, 0.25)
      + COALESCE(p.readiness_rate, 0) * COALESCE(mw.readiness_weight, 0.25)
      + COALESCE(p.participation_rate, 0) * COALESCE(mw.participation_weight, 0.25)
    ) AS readiness_score
  FROM paced p
  LEFT JOIN config_metric_weights mw ON 1 = 1
),

-- -----------------------------------------------------------------------------
-- 6) Fatigue + anomaly flags
-- fatigue: rising CPA + falling ROAS + elevated spend compared to 4-period avg
-- anomaly: z-score style detection on spend, conversions, and value
-- -----------------------------------------------------------------------------
flagged AS (
  SELECT
    s.*,
    AVG(spend) OVER (
      PARTITION BY rollup_grain, channel
      ORDER BY metric_date
      ROWS BETWEEN 4 PRECEDING AND 1 PRECEDING
    ) AS prev4_avg_spend,

    AVG(spend) OVER (PARTITION BY rollup_grain, channel) AS mean_spend,
    STDDEV_POP(spend) OVER (PARTITION BY rollup_grain, channel) AS std_spend,
    AVG(conversions) OVER (PARTITION BY rollup_grain, channel) AS mean_conversions,
    STDDEV_POP(conversions) OVER (PARTITION BY rollup_grain, channel) AS std_conversions,
    AVG(conversion_value) OVER (PARTITION BY rollup_grain, channel) AS mean_value,
    STDDEV_POP(conversion_value) OVER (PARTITION BY rollup_grain, channel) AS std_value
  FROM scored s
),

attribution AS (
  SELECT
    f.*,

    -- platform attribution (observed)
    conversion_value AS attribution_platform_value,

    -- modeled attribution (time-decay on prior 7 rows, decay 0.7^n)
    (
      conversion_value * 0.4
      + COALESCE(LAG(conversion_value, 1) OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date), 0) * 0.24
      + COALESCE(LAG(conversion_value, 2) OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date), 0) * 0.144
      + COALESCE(LAG(conversion_value, 3) OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date), 0) * 0.0864
      + COALESCE(LAG(conversion_value, 4) OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date), 0) * 0.05184
      + COALESCE(LAG(conversion_value, 5) OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date), 0) * 0.031104
      + COALESCE(LAG(conversion_value, 6) OVER (PARTITION BY rollup_grain, channel ORDER BY metric_date), 0) * 0.0186624
    ) AS attribution_modeled_value
  FROM flagged f
),

finalized AS (
  SELECT
    a.*,
    COALESCE(caw.platform_weight, 0.5) AS platform_weight,
    COALESCE(caw.modeled_weight, 0.5) AS modeled_weight,

    (attribution_platform_value * COALESCE(caw.platform_weight, 0.5)
      + attribution_modeled_value * COALESCE(caw.modeled_weight, 0.5)) AS attribution_blended_value,

    CASE
      WHEN cpa > prior_cpa
       AND roas < prior_roas
       AND spend > COALESCE(prev4_avg_spend, 0) * 1.15
      THEN 1 ELSE 0
    END AS fatigue_flag,

    CASE
      WHEN (std_spend > 0 AND ABS((spend - mean_spend) / std_spend) >= 2.5)
        OR (std_conversions > 0 AND ABS((conversions - mean_conversions) / std_conversions) >= 2.5)
        OR (std_value > 0 AND ABS((conversion_value - mean_value) / std_value) >= 2.5)
      THEN 1 ELSE 0
    END AS anomaly_flag,

    CASE
      WHEN attribution_modeled_value = 0 THEN NULL
      ELSE ABS(attribution_platform_value - attribution_modeled_value) / ABS(attribution_modeled_value)
    END AS attribution_disagreement_ratio,

    CASE
      WHEN attribution_modeled_value = 0 THEN 0
      WHEN ABS(attribution_platform_value - attribution_modeled_value) / ABS(attribution_modeled_value)
           >= COALESCE(caw.disagreement_threshold, 0.25)
      THEN 1 ELSE 0
    END AS disagreement_flag,

    CASE
      WHEN attribution_modeled_value = 0 THEN 'modeled attribution unavailable for comparison'
      WHEN ABS(attribution_platform_value - attribution_modeled_value) / ABS(attribution_modeled_value)
           >= COALESCE(caw.disagreement_threshold, 0.25)
      THEN 'platform and modeled attribution differ beyond configured threshold'
      ELSE 'platform and modeled attribution aligned'
    END AS disagreement_note
  FROM attribution a
  LEFT JOIN config_attribution_weights caw
    ON caw.channel = a.channel OR caw.channel = 'ALL'
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY a.rollup_grain, a.metric_date, a.channel
    ORDER BY CASE WHEN caw.channel = a.channel THEN 0 ELSE 1 END
  ) = 1
)

SELECT
  rollup_grain,
  metric_date,
  channel,

  spend,
  conversions,
  conversion_value,
  roas,
  cpa,

  wallet_connect_rate,
  task_completion_rate,
  readiness_rate,
  participation_rate,

  wow_spend_abs,
  wow_spend_pct,
  wow_conversions_abs,
  wow_conversions_pct,
  wow_value_abs,
  wow_value_pct,
  wow_roas_abs,
  wow_cpa_abs,

  period_budget,
  expected_budget_to_date,
  pacing_vs_plan,
  pacing_vs_expected_to_date,

  readiness_score,
  fatigue_flag,
  anomaly_flag,

  attribution_platform_value,
  attribution_modeled_value,
  attribution_blended_value,
  disagreement_flag,
  disagreement_note
FROM finalized;
