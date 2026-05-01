import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import {
  productMetrics as mockMetrics,
  bundleInsights as mockBundles,
  customerIntelligence as mockCustomers,
  peakHours as mockPeakHours,
  type ProductMetrics,
  type BundleInsight,
  type CustomerIntelligence,
  type HourMetric,
} from '@/mocks/posIntelligence';

export interface AiInsight {
  id: string;
  insight_type: 'opportunity' | 'warning' | 'trend';
  content: string;
  title?: string;
  week_start: string;
  generated_at: string;
}

export interface LearnedPatterns {
  productMetrics: ProductMetrics[];
  bundleInsights: BundleInsight[];
  customerIntelligence: CustomerIntelligence[];
  peakHours: HourMetric[];
  aiInsights: AiInsight[];
  hasRealData: boolean;
  transactionCount: number;
  lastUpdated: string | null;
  isLoading: boolean;
}

const EMPTY: LearnedPatterns = {
  productMetrics: mockMetrics,
  bundleInsights: mockBundles,
  customerIntelligence: mockCustomers,
  peakHours: mockPeakHours,
  aiInsights: [],
  hasRealData: false,
  transactionCount: 0,
  lastUpdated: null,
  isLoading: false,
};

export function useLearnedPatterns(): LearnedPatterns {
  const [state, setState] = useState<LearnedPatterns>({ ...EMPTY, isLoading: isSupabaseConfigured });

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    async function load() {
      // Check if we have any real transactions
      const { count } = await supabase
        .from('pos_transactions')
        .select('id', { count: 'exact', head: true });

      if (cancelled) return;

      const txnCount = count ?? 0;
      if (txnCount === 0) {
        setState({ ...EMPTY, isLoading: false });
        return;
      }

      // Fetch all pattern tables in parallel
      const [ppRes, bpRes, cpRes, phpRes, aiRes] = await Promise.all([
        supabase.from('product_patterns').select('*'),
        supabase.from('bundle_patterns').select('*').order('lift_score', { ascending: false }).limit(20),
        supabase.from('customer_patterns').select('*').order('vip_score', { ascending: false }),
        supabase.from('peak_hour_patterns').select('*').order('hour_of_day'),
        supabase.from('ai_insights').select('*').order('generated_at', { ascending: false }).limit(10),
      ]);

      if (cancelled) return;

      // Map DB rows → interface shapes (fall back to mock if table empty)
      const productMetrics: ProductMetrics[] = ppRes.data?.length
        ? ppRes.data.map(r => ({
            productId: r.product_id,
            unitsSold30d: r.units_sold_30d,
            revenue30d: r.revenue_30d,
            profit30d: r.profit_30d,
            avgDailySales: r.avg_daily_sales,
            velocity: r.velocity as ProductMetrics['velocity'],
            daysOfStock: r.days_of_stock,
            sellThrough: r.sell_through_pct,
            trend: r.trend as ProductMetrics['trend'],
            reorderAlert: r.reorder_alert,
          }))
        : mockMetrics;

      const bundleInsights: BundleInsight[] = bpRes.data?.length
        ? bpRes.data.map(r => ({
            productA: r.product_a,
            productB: r.product_b,
            coOccurrences: r.co_occurrences,
            liftScore: r.lift_score,
          }))
        : mockBundles;

      const customerIntelligence: CustomerIntelligence[] = cpRes.data?.length
        ? cpRes.data.map(r => ({
            customerId: r.customer_id,
            totalSpent: r.total_spent,
            orderCount: r.order_count,
            avgOrderValue: r.avg_order_value,
            daysSinceLastPurchase: r.days_since_last_purchase,
            vipScore: r.vip_score,
            churnRisk: r.churn_risk as CustomerIntelligence['churnRisk'],
            predictedNextPurchase: r.predicted_next_purchase ?? '',
            recommendedOffer: r.recommended_offer ?? '',
          }))
        : mockCustomers;

      const peakHours: HourMetric[] = phpRes.data?.length
        ? phpRes.data.map(r => ({
            hour: r.hour_of_day,
            transactions: r.total_transactions,
            revenue: r.total_revenue,
          }))
        : mockPeakHours;

      const aiInsights: AiInsight[] = (aiRes.data ?? []).map(r => ({
        id: r.id,
        insight_type: r.insight_type,
        content: r.content,
        title: r.metadata?.title,
        week_start: r.week_start,
        generated_at: r.generated_at,
      }));

      const lastUpdated = ppRes.data?.[0]?.updated_at ?? null;

      setState({
        productMetrics,
        bundleInsights,
        customerIntelligence,
        peakHours,
        aiInsights,
        hasRealData: true,
        transactionCount: txnCount,
        lastUpdated,
        isLoading: false,
      });
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  return state;
}

// Fire-and-forget: write a completed sale's line items to Supabase
export async function recordSaleTransaction(params: {
  sessionId: string;
  items: Array<{
    productId: string;
    productName: string;
    category?: string;
    quantity: number;
    unitPrice: number;
    unitCost: number;
    discountPct: number;
  }>;
  paymentMethod: string;
  customerId?: string | null;
  cashierId?: string;
}) {
  if (!isSupabaseConfigured) return;

  const now = new Date();
  const rows = params.items.map(item => {
    const effectivePrice = item.unitPrice * (1 - item.discountPct / 100);
    return {
      session_id: params.sessionId,
      sale_date: now.toISOString().split('T')[0],
      hour_of_day: now.getHours(),
      day_of_week: now.getDay(),
      product_id: item.productId,
      product_name: item.productName,
      category: item.category ?? null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      unit_cost: item.unitCost,
      discount_pct: item.discountPct / 100,
      effective_price: +effectivePrice.toFixed(2),
      revenue: +(effectivePrice * item.quantity).toFixed(2),
      profit: +((effectivePrice - item.unitCost) * item.quantity).toFixed(2),
      payment_method: params.paymentMethod,
      customer_id: params.customerId ?? null,
      cashier_id: params.cashierId ?? null,
    };
  });

  const { error } = await supabase.from('pos_transactions').insert(rows);
  if (error) console.error('recordSaleTransaction:', error.message);
}
