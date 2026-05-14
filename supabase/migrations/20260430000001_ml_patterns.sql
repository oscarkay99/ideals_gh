-- ML pattern-learning tables
-- pos_transactions: one row per line item sold at POS (separate from the payment-record transactions table)
-- pattern tables: updated nightly by learn-patterns edge function

-- ── POS line-item transactions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pos_transactions (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  sale_date       date        NOT NULL DEFAULT current_date,
  hour_of_day     smallint    NOT NULL CHECK (hour_of_day BETWEEN 0 AND 23),
  day_of_week     smallint    NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  session_id      uuid        NOT NULL,
  product_id      text        NOT NULL,
  product_name    text        NOT NULL,
  category        text,
  quantity        integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price      numeric(12,2) NOT NULL,
  unit_cost       numeric(12,2) NOT NULL,
  discount_pct    numeric(5,4) NOT NULL DEFAULT 0,
  effective_price numeric(12,2) NOT NULL,
  revenue         numeric(12,2) NOT NULL,
  profit          numeric(12,2) NOT NULL,
  payment_method  text,
  customer_id     text,
  cashier_id      text
);

CREATE INDEX IF NOT EXISTS idx_pos_txns_sale_date   ON public.pos_transactions(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_pos_txns_product_id  ON public.pos_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_pos_txns_customer_id ON public.pos_transactions(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pos_txns_session_id  ON public.pos_transactions(session_id);

ALTER TABLE public.pos_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pos_txns_insert" ON public.pos_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "pos_txns_select" ON public.pos_transactions FOR SELECT TO authenticated USING (true);

-- ── Product patterns (recomputed nightly) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_patterns (
  product_id          text        PRIMARY KEY,
  updated_at          timestamptz NOT NULL DEFAULT now(),
  units_sold_7d       integer     NOT NULL DEFAULT 0,
  units_sold_30d      integer     NOT NULL DEFAULT 0,
  revenue_30d         numeric(14,2) NOT NULL DEFAULT 0,
  profit_30d          numeric(14,2) NOT NULL DEFAULT 0,
  avg_daily_sales     numeric(8,3)  NOT NULL DEFAULT 0,
  velocity            text        NOT NULL DEFAULT 'new',
  days_of_stock       integer     NOT NULL DEFAULT 0,
  sell_through_pct    numeric(5,2) NOT NULL DEFAULT 0,
  trend               text        NOT NULL DEFAULT 'flat',
  reorder_alert       boolean     NOT NULL DEFAULT false,
  forecast_7d         integer     NOT NULL DEFAULT 0,
  forecast_revenue_7d numeric(14,2) NOT NULL DEFAULT 0
);

ALTER TABLE public.product_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pp_select"      ON public.product_patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "pp_all_service" ON public.product_patterns FOR ALL    TO service_role  USING (true);

-- ── Bundle / basket patterns ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bundle_patterns (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  product_a      text        NOT NULL,
  product_b      text        NOT NULL,
  co_occurrences integer     NOT NULL DEFAULT 0,
  lift_score     numeric(8,3) NOT NULL DEFAULT 0,
  UNIQUE(product_a, product_b)
);

ALTER TABLE public.bundle_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bp_select"      ON public.bundle_patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "bp_all_service" ON public.bundle_patterns FOR ALL    TO service_role  USING (true);

-- ── Customer intelligence ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.customer_patterns (
  customer_id              text        PRIMARY KEY,
  updated_at               timestamptz NOT NULL DEFAULT now(),
  total_spent              numeric(14,2) NOT NULL DEFAULT 0,
  order_count              integer     NOT NULL DEFAULT 0,
  avg_order_value          numeric(12,2) NOT NULL DEFAULT 0,
  days_since_last_purchase integer     NOT NULL DEFAULT 0,
  vip_score                integer     NOT NULL DEFAULT 0,
  churn_risk               text        NOT NULL DEFAULT 'low',
  predicted_next_purchase  text,
  recommended_offer        text,
  favorite_category        text
);

ALTER TABLE public.customer_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cp_select"      ON public.customer_patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "cp_all_service" ON public.customer_patterns FOR ALL    TO service_role  USING (true);

-- ── Peak hour patterns ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.peak_hour_patterns (
  hour_of_day        smallint    PRIMARY KEY,
  updated_at         timestamptz NOT NULL DEFAULT now(),
  avg_transactions   numeric(8,2) NOT NULL DEFAULT 0,
  avg_revenue        numeric(12,2) NOT NULL DEFAULT 0,
  total_transactions integer     NOT NULL DEFAULT 0,
  total_revenue      numeric(14,2) NOT NULL DEFAULT 0,
  sample_days        integer     NOT NULL DEFAULT 0
);

ALTER TABLE public.peak_hour_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "php_select"      ON public.peak_hour_patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "php_all_service" ON public.peak_hour_patterns FOR ALL    TO service_role  USING (true);

-- ── AI weekly narrative insights ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at timestamptz NOT NULL DEFAULT now(),
  week_start   date        NOT NULL,
  insight_type text        NOT NULL,
  content      text        NOT NULL,
  metadata     jsonb
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_week ON public.ai_insights(week_start DESC);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_select"      ON public.ai_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "ai_all_service" ON public.ai_insights FOR ALL    TO service_role  USING (true);
