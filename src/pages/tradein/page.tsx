import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { tradeInBrands, tradeInModels, conditionMultipliers, storageOptions, storageMultipliers, recentTradeIns } from '@/mocks/tradein';

type Condition = 'excellent' | 'good' | 'fair' | 'poor';

const conditionDetails = {
  excellent: { label: 'Excellent', desc: 'Like new, no scratches, 90%+ battery', borderColor: '#1E5FBE', bg: '#EEF4FF', badge: 'bg-blue-100 text-blue-700' },
  good: { label: 'Good', desc: 'Minor scratches, fully functional, 80%+ battery', borderColor: '#F5A623', bg: '#FFFBEB', badge: 'bg-amber-100 text-amber-700' },
  fair: { label: 'Fair', desc: 'Visible wear, works fine, 70%+ battery', borderColor: '#D97706', bg: '#FEF3C7', badge: 'bg-yellow-100 text-yellow-700' },
  poor: { label: 'Poor', desc: 'Cracked screen or major damage', borderColor: '#E05A2B', bg: '#FEE2E2', badge: 'bg-red-100 text-red-700' },
};

export default function TradeInPage() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [selectedCondition, setSelectedCondition] = useState<Condition>('good');
  const [showResult, setShowResult] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);

  const models = selectedBrand ? tradeInModels[selectedBrand] || [] : [];
  const modelData = models.find(m => m.name === selectedModel);

  const calculateValue = () => {
    if (!modelData) return 0;
    const base = modelData.baseValue;
    const condMult = conditionMultipliers[selectedCondition];
    const storageMult = storageMultipliers[selectedStorage] || 1;
    return Math.round(base * condMult * storageMult);
  };

  const tradeValue = calculateValue();

  const upgradeOptions = [
    { name: 'iPhone 15 Pro Max 256GB', price: 8200, img: 'https://readdy.ai/api/search-image?query=iPhone%2015%20Pro%20Max%20Natural%20Titanium%20product%20shot%20on%20clean%20white%20background%20professional%20studio%20photography%20minimalist&width=80&height=80&seq=ti1&orientation=squarish' },
    { name: 'Samsung Galaxy S24 Ultra', price: 9400, img: 'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20Titanium%20Black%20product%20shot%20clean%20white%20background%20professional%20studio%20photography&width=80&height=80&seq=ti2&orientation=squarish' },
    { name: 'Google Pixel 9 Pro', price: 7200, img: 'https://readdy.ai/api/search-image?query=Google%20Pixel%209%20Pro%20smartphone%20product%20shot%20clean%20white%20background%20professional%20studio%20photography&width=80&height=80&seq=ti3&orientation=squarish' },
  ];

  return (
    <AdminLayout title="Trade-In Calculator" subtitle="Estimate device value and manage trade-in pipeline">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calculator */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step 1: Brand */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: '#1E5FBE' }}>1</div>
              <h3 className="text-sm font-bold text-slate-800">Select Brand</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {tradeInBrands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => { setSelectedBrand(brand.id); setSelectedModel(''); setShowResult(false); }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer"
                  style={{ borderColor: selectedBrand === brand.id ? '#1E5FBE' : '#f1f5f9', background: selectedBrand === brand.id ? '#EEF4FF' : 'white' }}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className={`${brand.icon} text-lg`} style={{ color: selectedBrand === brand.id ? '#1E5FBE' : '#94a3b8' }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{brand.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Model */}
          {selectedBrand && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: '#1E5FBE' }}>2</div>
                <h3 className="text-sm font-bold text-slate-800">Select Model</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {models.map(model => (
                  <button
                    key={model.name}
                    onClick={() => { setSelectedModel(model.name); setShowResult(false); }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all cursor-pointer text-left"
                    style={{ borderColor: selectedModel === model.name ? '#1E5FBE' : '#f1f5f9', background: selectedModel === model.name ? '#EEF4FF' : 'white' }}
                  >
                    <span className="text-sm text-slate-700">{model.name}</span>
                    <span className="text-xs text-slate-400">up to GHS {model.baseValue.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Storage */}
          {selectedModel && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: '#1E5FBE' }}>3</div>
                <h3 className="text-sm font-bold text-slate-800">Storage Capacity</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {storageOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStorage(s)}
                    className="px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
                    style={{ borderColor: selectedStorage === s ? '#1E5FBE' : '#f1f5f9', background: selectedStorage === s ? '#EEF4FF' : 'white', color: selectedStorage === s ? '#1E5FBE' : '#475569' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Condition */}
          {selectedModel && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: '#1E5FBE' }}>4</div>
                <h3 className="text-sm font-bold text-slate-800">Device Condition</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(conditionDetails) as Condition[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCondition(c)}
                    className="p-4 rounded-xl border-2 text-left transition-all cursor-pointer"
                    style={{
                      borderColor: selectedCondition === c ? conditionDetails[c].borderColor : '#f1f5f9',
                      background: selectedCondition === c ? conditionDetails[c].bg : 'white',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-800">{conditionDetails[c].label}</span>
                      {selectedCondition === c && <i className="ri-checkbox-circle-fill" style={{ color: conditionDetails[c].borderColor }} />}
                    </div>
                    <p className="text-xs text-slate-500">{conditionDetails[c].desc}</p>
                    <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${conditionDetails[c].badge}`}>
                      {Math.round(conditionMultipliers[c] * 100)}% of base value
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowResult(true)}
                className="w-full mt-4 py-3 text-white rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap hover:opacity-90"
                style={{ background: '#1E5FBE' }}
              >
                <i className="ri-calculator-line mr-2" />Calculate Trade-In Value
              </button>
            </div>
          )}

          {/* Result */}
          {showResult && tradeValue > 0 && (
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #0A1F4A 0%, #1E5FBE 100%)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Estimated Trade-In Value</p>
                  <p className="text-4xl font-bold" style={{ color: '#F5A623' }}>GHS {tradeValue.toLocaleString()}</p>
                  <p className="text-white/50 text-xs mt-1">{selectedModel} · {selectedStorage} · {conditionDetails[selectedCondition].label}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,166,35,0.2)' }}>
                  <i className="ri-exchange-line text-3xl" style={{ color: '#F5A623' }} />
                </div>
              </div>

              <p className="text-white/60 text-xs mb-4">Use this value toward any upgrade in our store:</p>
              <div className="space-y-2 mb-4">
                {upgradeOptions.map(opt => (
                  <div key={opt.name} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <img src={opt.img} alt={opt.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-sm text-white">{opt.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">You pay</p>
                      <p className="text-sm font-bold" style={{ color: '#F5A623' }}>GHS {(opt.price - tradeValue).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setBookingModal(true)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap hover:opacity-90"
                  style={{ background: '#F5A623' }}
                >
                  <i className="ri-calendar-check-line mr-1" />Book Appointment
                </button>
                <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap">
                  <i className="ri-whatsapp-line mr-1" />Share via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Recent Trade-Ins</h4>
            <div className="space-y-3">
              {recentTradeIns.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{t.customer}</p>
                    <p className="text-[10px] text-slate-400">{t.device} · {t.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600">GHS {t.value.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ background: '#EEF4FF', borderColor: '#D6E6FF' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: '#D6E6FF' }}>
                <i className="ri-bar-chart-2-line" style={{ color: '#1E5FBE' }} />
              </div>
              <h4 className="text-sm font-bold text-slate-800">This Month</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Trade-ins processed</span>
                <span className="text-xs font-bold text-slate-800">34</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Total value paid out</span>
                <span className="text-xs font-bold text-slate-800">GHS 68,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Converted to upgrades</span>
                <span className="text-xs font-bold" style={{ color: '#1E5FBE' }}>28 (82%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Avg trade-in value</span>
                <span className="text-xs font-bold text-slate-800">GHS 2,012</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Top Trade-In Devices</h4>
            {[
              { device: 'iPhone 13 Pro', count: 8, value: 2600 },
              { device: 'Samsung S22', count: 6, value: 1600 },
              { device: 'iPhone 12', count: 5, value: 1200 },
              { device: 'Pixel 7 Pro', count: 4, value: 1400 },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <span className="text-xs font-medium text-slate-700">{d.device}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">{d.count}x · </span>
                  <span className="text-xs font-semibold text-slate-700">GHS {d.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {bookingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Book Trade-In Appointment</h3>
              <button onClick={() => setBookingModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">
                <i className="ri-close-line text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Customer Name</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="Full name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="+233 XX XXX XXXX" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Preferred Date & Time</label>
                <input type="datetime-local" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" />
              </div>
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-xs text-slate-600">Device: <strong>{selectedModel}</strong></p>
                <p className="text-xs text-slate-600">Estimated value: <strong className="text-emerald-600">GHS {tradeValue.toLocaleString()}</strong></p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setBookingModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => setBookingModal(false)} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#1E5FBE' }}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
