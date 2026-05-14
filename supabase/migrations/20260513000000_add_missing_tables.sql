-- expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  description text NOT NULL,
  amount      numeric NOT NULL DEFAULT 0,
  category    text NOT NULL DEFAULT '',
  date        text NOT NULL DEFAULT '',
  notes       text,
  status      text NOT NULL DEFAULT 'paid',
  type        text NOT NULL DEFAULT 'operational',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can read expenses"
  ON public.expenses FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated can insert expenses"
  ON public.expenses FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update expenses"
  ON public.expenses FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- events (calendar) table
CREATE TABLE IF NOT EXISTS public.events (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title       text NOT NULL,
  customer    text NOT NULL DEFAULT '',
  phone       text NOT NULL DEFAULT '',
  type        text NOT NULL DEFAULT 'consultation',
  date        text NOT NULL DEFAULT '',
  time        text NOT NULL DEFAULT '',
  duration    integer NOT NULL DEFAULT 60,
  status      text NOT NULL DEFAULT 'confirmed',
  notes       text,
  color       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can read events"
  ON public.events FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated can insert events"
  ON public.events FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update events"
  ON public.events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- purchase_orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id              text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  supplier        text NOT NULL DEFAULT '',
  items           jsonb NOT NULL DEFAULT '[]',
  total_value     numeric NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'pending',
  ordered_date    text NOT NULL DEFAULT '',
  expected_date   text NOT NULL DEFAULT '',
  delivered_date  text,
  payment_terms   text NOT NULL DEFAULT '',
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can read purchase_orders"
  ON public.purchase_orders FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated can insert purchase_orders"
  ON public.purchase_orders FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update purchase_orders"
  ON public.purchase_orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- settings table (single-row, keyed by id = 'store')
CREATE TABLE IF NOT EXISTS public.settings (
  id              text PRIMARY KEY DEFAULT 'store',
  business_name   text NOT NULL DEFAULT '',
  tagline         text NOT NULL DEFAULT '',
  phone           text NOT NULL DEFAULT '',
  whatsapp        text NOT NULL DEFAULT '',
  address         text NOT NULL DEFAULT '',
  primary_color   text NOT NULL DEFAULT '#0D1F4A',
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can read settings"
  ON public.settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "authenticated can upsert settings"
  ON public.settings FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "authenticated can update settings"
  ON public.settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
