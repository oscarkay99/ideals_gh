import { useRef } from 'react';
import type { CartItem, TradeIn } from '../page';
import type { PosCustomer } from '@/mocks/pos';

interface Props {
  cart: CartItem[];
  customer: PosCustomer | null;
  total: number;
  tradeIn: TradeIn | null;
  paymentMethod: string;
  plan: string;
  onNewSale: () => void;
}

function formatGHS(n: number) {
  return `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function receiptNumber() {
  return `ITH-${Date.now().toString(36).toUpperCase()}`;
}

function warrantyMonths(type: string): number {
  if (type === 'phone' || type === 'tablet' || type === 'laptop') return 12;
  if (type === 'wearable' || type === 'audio') return 6;
  return 3;
}

function warrantyExpiry(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AiReceiptModal({ cart, customer, total, tradeIn, paymentMethod, plan, onNewSale }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const txn = receiptNumber();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });

  const imeiItems = cart.filter(i => i.product.imei && i.imeiEntered);
  const warrantyItems = cart.filter(i => warrantyMonths(i.product.type) >= 6);

  function handlePrint() {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open('', '_blank', 'width=480,height=700');
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt ${txn}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'SF Mono', 'Courier New', monospace; font-size: 12px; color: #0f172a; padding: 24px; max-width: 380px; margin: 0 auto; }
        h1 { font-size: 16px; text-align: center; margin-bottom: 2px; }
        .center { text-align: center; }
        .row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px dashed #e2e8f0; }
        .row:last-child { border-bottom: none; }
        .bold { font-weight: 700; }
        .divider { border-top: 2px dashed #334155; margin: 8px 0; }
        .section { margin: 10px 0; }
        .label { color: #64748b; }
        .warranty-box { border: 1px solid #0D1F4A; border-radius: 6px; padding: 8px; margin-top: 10px; }
        .warranty-title { color: #0D1F4A; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer { margin-top: 16px; text-align: center; color: #64748b; font-size: 10px; }
        @media print { body { padding: 8px; } }
      </style>
      </head><body>
      ${content.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Sale Complete</p>
              <p className="text-[10px] text-slate-400">{txn}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
            >
              <i className="ri-printer-line" />Print
            </button>
          </div>
        </div>

        {/* Scrollable receipt body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div ref={receiptRef} className="space-y-4 font-mono text-xs text-slate-700">

            {/* Shop header */}
            <div className="text-center space-y-0.5">
              <p className="text-base font-bold text-[#0D1F4A]">iDeals Tech Hub</p>
              <p className="text-[10px] text-slate-500">Accra, Ghana · Tel: +233 XX XXX XXXX</p>
              <p className="text-[10px] text-slate-500">{dateStr} · {timeStr}</p>
              <p className="text-[10px] font-semibold text-slate-700">Receipt: {txn}</p>
            </div>

            <div className="border-t-2 border-dashed border-slate-300" />

            {/* Customer */}
            {customer && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                <div className="flex justify-between"><span className="label">Name</span><span className="font-semibold">{customer.name}</span></div>
                <div className="flex justify-between"><span className="label">Phone</span><span>{customer.phone}</span></div>
                <div className="flex justify-between"><span className="label">Loyalty pts earned</span><span className="text-amber-600 font-semibold">+{Math.round(total * 0.01)} pts</span></div>
              </div>
            )}

            {customer && <div className="border-t border-dashed border-slate-200" />}

            {/* Items */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items</p>
              {cart.map(item => {
                const lineTotal = item.product.price * item.qty * (1 - item.discount / 100);
                return (
                  <div key={item.product.id} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-semibold flex-1 pr-2 leading-tight">{item.product.name}</span>
                      <span className="font-bold">{formatGHS(lineTotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{formatGHS(item.product.price)} × {item.qty}{item.discount > 0 ? ` (−${item.discount}%)` : ''}</span>
                    </div>
                    {item.imeiEntered && (
                      <p className="text-[10px] text-slate-400">IMEI: {item.imeiEntered}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-dashed border-slate-200" />

            {/* Totals */}
            <div className="space-y-1">
              {tradeIn && (
                <div className="flex justify-between text-emerald-600">
                  <span>Trade-in: {tradeIn.device}</span>
                  <span>–{formatGHS(tradeIn.value)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-0.5">
                <span>TOTAL</span>
                <span>{formatGHS(total)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment</span><span>{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Plan</span><span>{plan}</span>
              </div>
            </div>

            {/* Warranty certificates */}
            {warrantyItems.length > 0 && (
              <>
                <div className="border-t-2 border-dashed border-slate-300" />
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-[#0D1F4A] uppercase tracking-wider">
                    <i className="ri-shield-check-line mr-1" />Warranty Certificates
                  </p>
                  {warrantyItems.map(item => {
                    const wMonths = warrantyMonths(item.product.type);
                    const expiry = warrantyExpiry(wMonths);
                    return (
                      <div key={item.product.id} className="border border-[#0D1F4A] rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <i className="ri-shield-star-line text-[#0D1F4A]" />
                          <p className="text-xs font-bold text-slate-800">{item.product.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                          <div><span className="text-slate-400">SKU</span><p className="font-semibold">{item.product.sku}</p></div>
                          {item.imeiEntered && <div><span className="text-slate-400">IMEI</span><p className="font-semibold font-mono">{item.imeiEntered}</p></div>}
                          <div><span className="text-slate-400">Duration</span><p className="font-semibold text-emerald-600">{wMonths} months</p></div>
                          <div><span className="text-slate-400">Expires</span><p className="font-semibold">{expiry}</p></div>
                          <div><span className="text-slate-400">Receipt</span><p className="font-semibold">{txn}</p></div>
                          {customer && <div><span className="text-slate-400">Customer</span><p className="font-semibold">{customer.name}</p></div>}
                        </div>
                        <p className="text-[9px] text-slate-400 leading-relaxed">
                          Covers manufacturing defects. Physical damage, liquid damage, and software issues are excluded. Present this receipt for all warranty claims.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* IMEI log for non-warranty items */}
            {imeiItems.filter(i => warrantyMonths(i.product.type) < 6).length > 0 && (
              <>
                <div className="border-t border-dashed border-slate-200" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IMEI Log</p>
                  {imeiItems.filter(i => warrantyMonths(i.product.type) < 6).map(item => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-slate-500 truncate pr-2">{item.product.name}</span>
                      <span className="font-mono font-semibold">{item.imeiEntered}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="border-t-2 border-dashed border-slate-300" />

            {/* Footer */}
            <div className="text-center space-y-1 text-[10px] text-slate-400">
              <p>Thank you for shopping at iDeals Tech Hub!</p>
              <p>Returns accepted within 7 days with receipt.</p>
              <p>www.idealstechhub.com</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer"
          >
            <i className="ri-printer-line" />Print Receipt
          </button>
          <button
            onClick={onNewSale}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0D1F4A 0%, #1a53a8 100%)' }}
          >
            <i className="ri-add-line" />New Sale
          </button>
        </div>
      </div>
    </div>
  );
}
