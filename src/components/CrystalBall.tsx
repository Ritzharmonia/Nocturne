import React, { useState } from 'react';
import { Sparkles, Moon, Eye } from 'lucide-react';

interface CrystalBallProps {
  isDivining: boolean;
  onDivinate: () => void;
  remainingDivinations: number;
}

export const CrystalBall: React.FC<CrystalBallProps> = ({
  isDivining,
  onDivinate,
  remainingDivinations
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hasRemaining = remainingDivinations > 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleClickBall = () => {
    if (!isDivining && hasRemaining) {
      onDivinate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-3 text-center pb-20">
      {/* Title & Introduction in Mongolian as requested */}
      <div className="mb-4 lg:mb-5">
        <div className="inline-flex items-center gap-2 text-cyan-400 text-xs tracking-widest font-gothic mb-1">
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
          <span>САФФИР УЛС</span>
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <h1 className="text-3xl lg:text-5xl font-decorative font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-100 to-indigo-300 drop-shadow-[0_2px_12px_rgba(56,189,248,0.5)]">
          NOCTURNE
        </h1>
        <p className="text-sky-300/90 text-sm lg:text-base font-gothic tracking-wide mt-1">
          Шөнийн нууцыг тайлах зөгнөгч
        </p>
        <p className="text-slate-300 italic text-base lg:text-lg max-w-md mx-auto mt-1 font-serif text-shadow">
          «Нааш ир, аялагч минь. Чиний ирээдүйг шөнө өөрөө өгүүлнэ.»
        </p>
      </div>

      {/* Interactive Crystal Ball Container */}
      <div
        className={`relative group my-2 select-none ${hasRemaining ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'}`}
        onClick={handleClickBall}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label="Болор бөмбөлгөөр зөгнүүлэх"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClickBall();
          }
        }}
      >
        {/* Ambient Back Glow radiating from orb */}
        <div 
          className={`absolute -inset-10 rounded-full transition-all duration-700 pointer-events-none blur-3xl ${
            isDivining
              ? 'bg-gradient-to-r from-cyan-500/60 via-sky-400/50 to-indigo-600/60 scale-125'
              : hasRemaining
                ? 'bg-gradient-to-r from-cyan-500/25 via-blue-600/20 to-purple-700/20 group-hover:scale-110 group-hover:opacity-80'
                : 'bg-slate-700/15'
          }`}
        />

        {/* Orbiting Mystic Runes Ring */}
        <div 
          className={`absolute -inset-6 rounded-full pointer-events-none border border-cyan-400/25 transition-transform ${
            isDivining ? 'animate-rune-spin-fast border-cyan-300/60' : 'animate-rune-spin'
          }`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400/80 text-[10px]">ᚠ</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-cyan-400/80 text-[10px]">ᚢ</div>
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400/80 text-[10px]">ᚦ</div>
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-cyan-400/80 text-[10px]">ᚨ</div>
          <div className="absolute top-1/4 left-1/12 text-indigo-400/70 text-[9px]">ᚱ</div>
          <div className="absolute bottom-1/4 right-1/12 text-indigo-400/70 text-[9px]">ᚲ</div>
        </div>

        {/* The Crystal Ball Sphere */}
        <div 
          className={`relative w-56 h-56 lg:w-68 lg:h-68 rounded-full overflow-hidden transition-all duration-500 shadow-2xl ${
            isDivining ? 'scale-105' : hasRemaining ? 'group-hover:scale-[1.03]' : ''
          }`}
          style={{
            background: 'radial-gradient(circle at 45% 35%, #0e2246 0%, #061129 45%, #020511 85%, #000207 100%)',
            boxShadow: isDivining
              ? 'inset 0 0 70px rgba(56, 189, 248, 0.7), inset 0 0 120px rgba(99, 102, 241, 0.5), 0 0 60px rgba(56, 189, 248, 0.6), 0 0 100px rgba(14, 165, 233, 0.4)'
              : 'inset 0 0 50px rgba(56, 189, 248, 0.35), inset 0 0 90px rgba(99, 102, 241, 0.25), 0 0 35px rgba(56, 189, 248, 0.35)'
          }}
        >
          {/* Inner Swirling Smoke / Mist Layers */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              isDivining ? 'opacity-95' : 'opacity-70 group-hover:opacity-90'
            }`}
          >
            {/* Primary Blue Smoke Vortex */}
            <div 
              className={`absolute inset-0 ${isDivining ? 'animate-rune-spin-fast' : 'animate-rune-spin'}`}
              style={{
                background: 'radial-gradient(ellipse at 40% 50%, rgba(56, 189, 248, 0.5) 0%, rgba(79, 70, 229, 0.3) 40%, transparent 70%)',
                filter: 'blur(12px)'
              }}
            />
            {/* Secondary Violet Spectral Cloud */}
            <div 
              className={`absolute inset-0 ${isDivining ? 'animate-rune-spin-fast' : 'animate-rune-spin-rev'}`}
              style={{
                animationDuration: isDivining ? '3s' : '20s',
                background: 'radial-gradient(circle at 60% 45%, rgba(168, 85, 247, 0.45) 0%, rgba(59, 130, 246, 0.25) 45%, transparent 65%)',
                filter: 'blur(10px)'
              }}
            />
            {/* Ethereal Glowing Core Plasma */}
            <div 
              className={`absolute inset-8 rounded-full transition-all duration-300 ${
                isDivining ? 'animate-ping opacity-90 scale-110' : 'animate-pulse opacity-60'
              }`}
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(224, 242, 254, 0.9) 0%, rgba(56, 189, 248, 0.6) 30%, rgba(99, 102, 241, 0.3) 60%, transparent 75%)',
                filter: 'blur(8px)',
                transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`
              }}
            />
          </div>

          {/* Shuffling Cards Visual Silhouette during Divination */}
          {isDivining && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="relative w-16 h-24">
                <div className="absolute inset-0 bg-slate-900/90 border border-cyan-400 rounded-sm shadow-xl -rotate-12 animate-pulse" />
                <div className="absolute inset-0 bg-indigo-950/90 border border-sky-300 rounded-sm shadow-xl rotate-6 animate-ping" />
                <div className="absolute inset-0 bg-sky-950 border border-white/80 rounded-sm flex items-center justify-center text-cyan-300">
                  <Eye className="w-5 h-5 animate-spin" />
                </div>
              </div>
            </div>
          )}

          {/* Starry glints / spark motes inside ball */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff] animate-ping" />
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-cyan-200 shadow-[0_0_4px_#38bdf8] animate-pulse" />
          </div>

          {/* Spherical Specular Glass Glints & Surface Reflection */}
          <div 
            className="absolute top-3 left-6 w-16 lg:w-20 h-10 lg:h-12 rounded-full pointer-events-none opacity-80"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 55%, transparent 80%)',
              transform: `rotate(-35deg) translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`
            }}
          />
          <div 
            className="absolute bottom-4 right-8 w-10 h-6 rounded-full pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.6) 0%, transparent 70%)',
              transform: 'rotate(-15deg)'
            }}
          />

          {/* Outer Glass Rim Bevel */}
          <div className="absolute inset-0 rounded-full border border-sky-300/30 pointer-events-none" />
        </div>

        {/* Ornate Victorian Pedestal Stand below ball */}
        <div className="relative -mt-6 mx-auto w-36 lg:w-44 flex flex-col items-center pointer-events-none z-10">
          <div className="w-28 lg:w-34 h-6 bg-gradient-to-r from-zinc-800 via-slate-600 to-zinc-900 rounded-b-2xl border-t border-slate-400/50 shadow-lg relative">
            <div className="absolute -top-1 inset-x-3 h-1.5 bg-gradient-to-r from-zinc-700 via-sky-300/40 to-zinc-800 rounded-full" />
            <div className="flex justify-around items-center h-full px-3 text-[10px] text-slate-400">
              <span>❧</span>
              <span>❖</span>
              <span>❧</span>
            </div>
          </div>
          <div className="w-10 lg:w-12 h-6 bg-gradient-to-r from-zinc-900 via-slate-700 to-zinc-900 border-x border-slate-500/30 shadow-inner" />
          <div className="w-36 lg:w-44 h-5 bg-gradient-to-r from-zinc-950 via-slate-800 to-zinc-950 rounded-b-lg border-t-2 border-slate-400/40 shadow-2xl flex items-center justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Main Action Button in Mongolian: [БОЛОР БӨМБӨЛГӨӨР ЗӨГНҮҮЛЭХ] */}
      <div className="mt-4 lg:mt-5 w-full max-w-sm flex flex-col items-center gap-2">
        <button
          onClick={onDivinate}
          disabled={isDivining || !hasRemaining}
          className={`w-full relative group py-3 px-6 rounded-md font-gothic tracking-widest text-sm lg:text-base font-semibold transition-all duration-300 shadow-xl overflow-hidden border ${
            isDivining
              ? 'bg-slate-800/80 border-slate-600 text-slate-400 cursor-wait'
              : !hasRemaining
                ? 'bg-slate-900/80 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#09153a] via-[#102359] to-[#09153a] border-cyan-400/60 text-cyan-100 hover:border-cyan-300 hover:text-white hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] active:scale-[0.98]'
          }`}
        >
          {hasRemaining && (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none" />
          )}

          <div className="relative flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${isDivining ? 'animate-spin text-cyan-400' : hasRemaining ? 'text-cyan-300' : 'text-slate-500'}`} />
            <span>
              {isDivining 
                ? 'ШӨНИЙН НУУЦ ТАЙЛАГДАЖ БАЙНА...' 
                : hasRemaining 
                  ? `БОЛОР БӨМБӨЛГӨӨР ЗӨГНҮҮЛЭХ (${remainingDivinations}/3)` 
                  : 'ӨНӨӨДРИЙН ЗӨГНӨЛИЙН ЭРХ ДУУССАН (0/3)'}
            </span>
          </div>
        </button>

        {/* 3-limit status notice in clean unboxed typography */}
        <div className="text-xs text-slate-400 font-serif flex items-center justify-center gap-1.5 mt-1">
          {hasRemaining ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span className="text-cyan-300 font-medium">
                Ихдээ 3 удаа зөгнүүлнэ (Үлдсэн эрх: {remainingDivinations}/3)
              </span>
            </>
          ) : (
            <span className="text-rose-400/90 font-medium">
              Өдөрт ихдээ 3 удаа зөгнүүлнэ. Таны 3 эрх дууссан байна.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
