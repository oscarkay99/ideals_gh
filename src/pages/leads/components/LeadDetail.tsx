const statusConfig: Record<string, { label: string; color: string; border: string; bg: string }> = {
  hot: { label: 'Hot', color: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' },
  warm: { label: 'Warm', color: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50' },
  cold: { label: 'Cold', color: 'text-slate-500', border: 'border-slate-200', bg: 'bg-slate-50' },
};

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  source: string;
  product: string;
  budget: string;
  assigned: string;
  lastContact: string;
  notes: string;
  followUp: string;
}

interface Props {
  lead: Lead;
  onClose: () => void;
}

export default function LeadDetail({ lead, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-800">Lead Details</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
              <i className="ri-close-line text-base" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base font-bold">
              {lead.name[0]}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{lead.name}</h4>
              <p className="text-xs text-slate-400">{lead.phone}</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Status</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig[lead.status].bg} ${statusConfig[lead.status].color}`}>{statusConfig[lead.status].label}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Source</span>
              <span className="text-xs font-medium text-slate-800">{lead.source}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Product Interest</span>
              <span className="text-xs font-medium text-slate-800">{lead.product}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Budget</span>
              <span className="text-xs font-medium text-slate-800">{lead.budget}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Assigned To</span>
              <span className="text-xs font-medium text-slate-800">{lead.assigned}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Last Contact</span>
              <span className="text-xs font-medium text-slate-800">{lead.lastContact}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-slate-700 mb-1.5">Notes</p>
            <p className="text-xs text-slate-600 leading-relaxed">{lead.notes}</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 flex items-center justify-center text-amber-500">
                <i className="ri-lightbulb-line text-sm" />
              </div>
              <p className="text-xs font-semibold text-amber-700">AI Follow-up Suggestion</p>
            </div>
            <p className="text-xs text-amber-600 leading-relaxed">{lead.followUp}</p>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
              Create Quote
            </button>
            <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
              Mark as Contacted
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
