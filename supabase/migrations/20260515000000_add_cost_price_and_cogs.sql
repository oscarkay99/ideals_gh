-- Add cost_price to inventory so each product can track what was paid for it
ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS cost_price NUMERIC(12, 2);

-- Add cogs (Cost of Goods Sold) to sales so the POS can record the total
-- cost of items in each transaction at the time of sale
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS cogs NUMERIC(12, 2);
