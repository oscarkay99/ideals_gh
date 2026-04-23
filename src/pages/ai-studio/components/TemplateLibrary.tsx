import { promptTemplates } from '@/mocks/aiStudio';

const categories = ['All', 'Follow-ups', 'Campaigns', 'Summaries', 'Product'];

interface TemplateLibraryProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function TemplateLibrary({ selected, onSelect }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? promptTemplates
    : promptTemplates.filter((t) => t.category === activeCategory);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Templates</p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
              selected === t.id
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 flex items-center justify-center text-blue-400">
                <i className={`${t.icon} text-xs`} />
              </div>
              <span className="text-xs font-medium text-white/80">{t.name}</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
