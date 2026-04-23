import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import { authCertificates, imeiCheckHistory } from '@/mocks/authentication';

type Tab = 'certificates' | 'imei' | 'generate';

export default function AuthenticationPage() {
  const [tab, setTab] = useState<Tab>('certificates');
  const [selectedCert, setSelectedCert] = useState(authCertificates[0]);
  const [imeiInput, setImeiInput] = useState('');
  const [imeiResult, setImeiResult] = useState<null | { status: string; device: string; network: string }>(null);
  const [checking, setChecking] = useState(false);
  const [certDetailOpen, setCertDetailOpen] = useState(false);

  const checkImei = () => {
    if (!imeiInput.trim()) return;
    setChecking(true);
    setTimeout(() => {
      const found = imeiCheckHistory.find(h => h.imei === imeiInput);
      if (found) {
        setImeiResult({ status: found.status, device: found.device, network: found.network });
      } else {
        setImeiResult({ status: 'clean', device: 'Unknown Device', network: 'Unlocked' });
      }
      setChecking(false);
    }, 1800);
  };

  return (
    <AdminLayout title="Gadget Authentication" subtitle="Digital certificates, IMEI verification & trust system">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Certificates Issued', value: '891', icon: 'ri-shield-check-line', iconColor: '#1E5FBE', bg: '#EEF4FF' },
          { label: 'IMEI Checks Today', value: '47', icon: 'ri-scan-line', iconColor: '#1A52A8', bg: '#E8F0FB' },
          { label: 'Clean Devices', value: '98.7%', icon: 'ri-checkbox-circle-line', iconColor: '#F5A623', bg: '#FEF3C7' },
          { label: 'Flagged Devices', value: '11', icon: 'ri-alert-line', iconColor: '#E05A2B', bg: '#FEE2E2' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 border border-white" style={{ background: s.bg }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-xl">
                <i className={`${s.icon} text-base`} style={{ color: s.iconColor }} />
              </div>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-5">
        {(['certificates', 'imei', 'generate'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t === 'certificates' && <><i className="ri-shield-check-line mr-1.5" />Certificates</>}
            {t === 'imei' && <><i className="ri-scan-line mr-1.5" />IMEI Checker</>}
            {t === 'generate' && <><i className="ri-file-add-line mr-1.5" />Generate Certificate</>}
          </button>
        ))}
      </div>

      {tab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {authCertificates.map(cert => (
              <button
                key={cert.id}
                onClick={() => { setSelectedCert(cert); setCertDetailOpen(true); }}
                className={`w-full bg-white rounded-2xl border p-4 text-left transition-all cursor-pointer`}
                style={{ borderColor: selectedCert.id === cert.id ? '#1E5FBE' : '#f1f5f9' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF4FF' }}>
                      <i className="ri-shield-check-line text-lg" style={{ color: '#1E5FBE' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{cert.device}</p>
                      <p className="text-xs text-slate-400">{cert.id} · {cert.purchaseDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cert.condition === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-600'}`}>
                      {cert.condition}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#EEF4FF', color: '#1E5FBE' }}>
                      <i className="ri-checkbox-circle-line mr-0.5" />Verified
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400">Customer</p>
                    <p className="text-xs font-semibold text-slate-700">{cert.customer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">IMEI Status</p>
                    <p className="text-xs font-semibold" style={{ color: '#1E5FBE' }}><i className="ri-checkbox-circle-fill mr-0.5" />Clean</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Warranty</p>
                    <p className="text-xs font-semibold text-slate-700">{cert.warrantyExpiry}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Certificate Preview */}
          <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(180deg, #0A1F4A 0%, #1E5FBE 100%)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'rgba(245,166,35,0.2)' }}>
                <i className="ri-shield-check-line" style={{ color: '#F5A623' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">iDeals Tech Hub</p>
                <p className="text-[10px] text-white/40">Authenticity Certificate</p>
              </div>
              <div className="ml-auto">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <i className="ri-qr-code-line text-white/60 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 mb-3">
              <p className="text-[10px] text-white/40 mb-0.5">Device</p>
              <p className="text-sm font-bold text-white">{selectedCert.device}</p>
              <p className="text-xs text-white/50">{selectedCert.color} · {selectedCert.storage}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 mb-0.5">Serial No.</p>
                <p className="text-xs font-mono font-bold text-white">{selectedCert.serialNumber}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 mb-0.5">Condition</p>
                <p className="text-xs font-bold" style={{ color: '#F5A623' }}>{selectedCert.condition}</p>
              </div>
            </div>

            {selectedCert.imei !== 'N/A' && (
              <div className="bg-white/5 rounded-xl p-3 mb-3">
                <p className="text-[10px] text-white/40 mb-0.5">IMEI 1</p>
                <p className="text-xs font-mono text-white">{selectedCert.imei}</p>
              </div>
            )}

            {selectedCert.batteryHealth < 100 && (
              <div className="bg-white/5 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-white/40">Battery Health</p>
                  <p className="text-xs font-bold text-amber-400">{selectedCert.batteryHealth}%</p>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedCert.batteryHealth}%` }} />
                </div>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-3 mb-4">
              <p className="text-[10px] text-white/40 mb-0.5">Customer</p>
              <p className="text-xs font-bold text-white">{selectedCert.customer}</p>
              <p className="text-[10px] text-white/40 mt-1">Purchased {selectedCert.purchaseDate}</p>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ background: 'rgba(245,166,35,0.15)', borderColor: 'rgba(245,166,35,0.3)' }}>
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-shield-check-fill text-sm" style={{ color: '#F5A623' }} />
              </div>
              <div>
                <p className="text-[10px] font-bold" style={{ color: '#F5A623' }}>Verified Authentic</p>
                <p className="text-[10px] text-white/40">idealstech.gh/verify/{selectedCert.id}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer whitespace-nowrap">
                <i className="ri-download-line mr-1" />Download PDF
              </button>
              <button className="flex-1 py-2 rounded-xl text-xs text-white cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#F5A623' }}>
                <i className="ri-whatsapp-line mr-1" />Send via WA
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'imei' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
            <h3 className="text-sm font-bold text-slate-800 mb-1">IMEI Verification</h3>
            <p className="text-xs text-slate-400 mb-4">Check if a device is clean, blacklisted, or activation-locked before purchase or sale.</p>
            <div className="flex gap-3">
              <input
                value={imeiInput}
                onChange={e => setImeiInput(e.target.value)}
                placeholder="Enter 15-digit IMEI number..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 font-mono"
                maxLength={15}
              />
              <button
                onClick={checkImei}
                disabled={checking}
                className="px-6 py-3 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60 hover:opacity-90"
                style={{ background: '#1E5FBE' }}
              >
                {checking ? <><i className="ri-loader-4-line animate-spin mr-1" />Checking...</> : <><i className="ri-scan-line mr-1" />Check IMEI</>}
              </button>
            </div>

            {imeiResult && (
              <div className={`mt-4 p-4 rounded-xl border ${imeiResult.status === 'clean' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${imeiResult.status === 'clean' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    <i className={`text-xl ${imeiResult.status === 'clean' ? 'ri-shield-check-fill text-emerald-600' : 'ri-shield-cross-fill text-rose-600'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${imeiResult.status === 'clean' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {imeiResult.status === 'clean' ? 'Device is Clean' : 'Device Flagged'}
                    </p>
                    <p className="text-xs text-slate-500">{imeiResult.device} · {imeiResult.network}</p>
                  </div>
                  {imeiResult.status === 'clean' && (
                    <div className="ml-auto">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Safe to sell</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Recent IMEI Checks</h4>
            <div className="space-y-2">
              {imeiCheckHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${h.status === 'clean' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      <i className={`text-sm ${h.status === 'clean' ? 'ri-shield-check-line text-emerald-500' : 'ri-shield-cross-line text-rose-500'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{h.device}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{h.imei}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${h.status === 'clean' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {h.status === 'clean' ? 'Clean' : 'Flagged'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{h.checkedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'generate' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Generate Authenticity Certificate</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Device Name</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="e.g. iPhone 15 Pro Max" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Storage / Variant</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="e.g. 256GB Natural Titanium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">IMEI 1</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-emerald-400" placeholder="15-digit IMEI" maxLength={15} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Serial Number</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-emerald-400" placeholder="Serial number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Condition</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400">
                    <option>New</option>
                    <option>Refurbished</option>
                    <option>Used - Excellent</option>
                    <option>Used - Good</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Battery Health (%)</label>
                  <input type="number" min={0} max={100} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="100" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Customer Name</label>
                <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400" placeholder="Customer full name" />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer whitespace-nowrap">
                  <i className="ri-eye-line mr-1" />Preview
                </button>
                <button className="flex-1 py-3 rounded-xl text-white text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90" style={{ background: '#1E5FBE' }}>
                  <i className="ri-shield-check-line mr-1" />Generate Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
