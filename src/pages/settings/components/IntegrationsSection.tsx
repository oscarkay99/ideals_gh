interface Integration {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: string;
  description: string;
  lastSync: string;
}

interface IntegrationsSectionProps {
  integrations: Integration[];
}

export default function IntegrationsSection({ integrations }: IntegrationsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integrations.map((integration) => (
        <div key={integration.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${integration.color}15` }}>
            <i className={`${integration.icon} text-lg`} style={{ color: integration.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-slate-800">{integration.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${integration.status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{integration.description}</p>
            {integration.status === 'connected' && (
              <p className="text-[10px] text-slate-400">Last sync: {integration.lastSync}</p>
            )}
          </div>
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 ${integration.status === 'connected' ? 'border border-slate-200 text-slate-500 hover:bg-slate-50' : 'text-white'}`}
            style={integration.status !== 'connected' ? { background: '#1E5FBE' } : {}}
          >
            {integration.status === 'connected' ? 'Manage' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );
}
