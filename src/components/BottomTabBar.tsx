import React from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  remainingDivinations: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  remainingDivinations
}) => {
  return (
    <aside aria-label="Горим сонгох" className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none select-none">
      <nav aria-label="Үндсэн цэс" className="pointer-events-auto p-1.5 rounded-2xl bg-[#060a18]/92 backdrop-blur-lg border border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.85),0_0_20px_rgba(56,189,248,0.25)] flex items-center gap-2">
        {/* Crystal Ball Tab Button */}
        <button
          onClick={() => onTabChange('crystal')}
          className={`px-4 py-2 rounded-xl font-gothic tracking-wider text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'crystal'
              ? 'bg-gradient-to-r from-cyan-950 via-sky-900 to-indigo-950 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === 'crystal' ? 'text-cyan-300' : 'text-slate-400'}`} />
          <span>Болор бөмбөлөг</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
            remainingDivinations > 0 ? 'bg-cyan-900/60 text-cyan-300' : 'bg-red-950 text-red-300'
          }`}>
            {remainingDivinations}/3
          </span>
        </button>

        {/* Three Card Tarot Tab Button */}
        <button
          onClick={() => onTabChange('tarot')}
          className={`px-4 py-2 rounded-xl font-gothic tracking-wider text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'tarot'
              ? 'bg-gradient-to-r from-cyan-950 via-sky-900 to-indigo-950 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'tarot' ? 'text-cyan-300' : 'text-slate-400'}`} />
          <span>Гурван хөзөр</span>
        </button>
      </nav>
    </aside>
  );
};
