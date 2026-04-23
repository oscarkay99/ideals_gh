import { useState } from 'react';
import AdminLayout from '@/components/feature/AdminLayout';
import TemplateLibrary from './components/TemplateLibrary';
import GeneratorCanvas from './components/GeneratorCanvas';
import { recentGenerations, automationIdeas } from '@/mocks/aiStudio';

export default function AIStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <AdminLayout title="AI Studio" subtitle="Generate content, automate follow-ups, and power your sales">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-[calc(100vh-160px)]">
        {/* Template Library — dark sidebar */}
        <div className="bg-[#0A0E1A] rounded-2xl p-5 border border-white/5 overflow-hidden flex flex-col">
          <TemplateLibrary selected={selectedTemplate} onSelect={setSelectedTemplate} />
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-2 bg-[#0F172A] rounded-2xl p-6 border border-white/5 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-500/20">
              <i className="ri-sparkling-2-line text-blue-400 text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-white">AI Generator</h2>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] text-white/40">Ready</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <GeneratorCanvas selectedTemplate={selectedTemplate} />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Recent generations */}
          <div className="bg-[#0F172A] rounded-2xl p-5 border border-white/5 flex-1 overflow-hidden flex flex-col">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Recent</p>
            <div className="flex-1 overflow-y-auto space-y-2">
              {recentGenerations.map((g) => (
                <div key={g.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/8 cursor-pointer transition-all">
                  <p className="text-[10px] text-blue-400 font-medium mb-1">{g.template}</p>
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{g.preview}</p>
                  <p className="text-[10px] text-white/25 mt-1.5">{g.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Automation ideas */}
          <div className="bg-[#0F172A] rounded-2xl p-5 border border-white/5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Automation Ideas</p>
            <div className="space-y-2">
              {automationIdeas.slice(0, 3).map((idea) => (
                <div key={idea.title} className="flex items-start gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${idea.status === 'available' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                  <div>
                    <p className="text-xs text-white/70 font-medium">{idea.title}</p>
                    {idea.status === 'coming_soon' && (
                      <span className="text-[10px] text-white/30">Coming soon</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
