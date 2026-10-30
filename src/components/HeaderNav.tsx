import React from 'react';
import { Volume2, VolumeX, Moon, BookOpen } from 'lucide-react';

interface HeaderNavProps {
  candyCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  remainingDivinations: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  candyCount,
  isMuted,
  onToggleMute,
  onOpenHistory,
  historyCount,
  remainingDivinations
}) => {
  return (
    <header className="w-full border-b border-cyan-950/60 bg-[#04060f]/85 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
            <Moon className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-sm lg:text-base font-gothic tracking-widest text-slate-100 font-bold block leading-none">
              NOCTURNE
            </span>
            <span className="text-[10px] text-cyan-400/80 tracking-wider font-gothic">
              САФФИР УЛСЫН ЗӨГНӨГЧ
            </span>
          </div>
        </div>

        {/* Right: Remaining divination pill, Candy counter, History button & Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily 3-limit badge */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#091535] border border-cyan-500/30 text-xs font-gothic"
            title="Өдөрт ихдээ 3 удаа зөгнүүлнэ"
          >
            <span className="text-slate-400 hidden sm:inline">Эрх:</span>
            <span className={`font-bold font-mono ${remainingDivinations > 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
              {remainingDivinations}/3
            </span>
          </div>

          {/* Website Candy Counter integration */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181124] border border-amber-500/30 text-amber-300 font-gothic text-xs shadow-inner"
            title="Одоогийн чихрийн тоолуур"
          >
            <span className="text-sm">🍬</span>
            <span className="font-bold">{candyCount}</span>
            <span className="text-[10px] text-amber-400/70 hidden sm:inline">чихэр</span>
          </div>

          {/* Grimoire / History Button */}
          <button
            onClick={onOpenHistory}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded border border-transparent hover:border-slate-700 transition-colors relative"
            title="Зөгнөлийн тэмдэглэл харах"
            aria-label="Зөгнөлийн тэмдэглэл"
          >
            <BookOpen className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-600 text-white text-[9px] flex items-center justify-center font-mono">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 rounded border border-transparent hover:border-slate-700 transition-colors"
            title={isMuted ? 'Дуу асаах' : 'Дуу хаах'}
            aria-label={isMuted ? 'Дуу асаах' : 'Дуу хаах'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
