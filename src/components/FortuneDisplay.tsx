import React, { useState } from 'react';
import { Fortune } from '../types';
import { X, Sparkles, Gift, Check, RotateCcw } from 'lucide-react';
import { isRollClaimed } from '../utils/candyStorage';

interface FortuneDisplayProps {
  fortune: Fortune | null;
  rollToken: string;
  onClose: () => void;
  onAskAgain: () => void;
  onClaimCandy: (rollToken: string, amount: number) => void;
  remainingDivinations: number;
}

export const FortuneDisplay: React.FC<FortuneDisplayProps> = ({
  fortune,
  rollToken,
  onClose,
  onAskAgain,
  onClaimCandy,
  remainingDivinations
}) => {
  const [justClaimed, setJustClaimed] = useState(false);

  if (!fortune) return null;

  const alreadyClaimed = isRollClaimed(rollToken) || justClaimed;
  const isSecret = fortune.isSecretRare;

  const handleClaim = () => {
    if (fortune.candyReward && !alreadyClaimed) {
      setJustClaimed(true);
      onClaimCandy(rollToken, fortune.candyReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      {/* Gothic Card Container */}
      <div 
        className={`relative w-full max-w-lg rounded-lg p-6 lg:p-8 shadow-2xl transition-all duration-500 overflow-hidden ${
          isSecret
            ? 'bg-gradient-to-b from-[#111936] via-[#0b1024] to-[#04060f] border-2 border-amber-400/80 shadow-[0_0_50px_rgba(251,191,36,0.35)]'
            : 'bg-gradient-to-b from-[#0e172e] via-[#090e1f] to-[#050711] border border-cyan-500/40 shadow-[0_0_40px_rgba(56,189,248,0.25)]'
        }`}
      >
        {/* Ornate Victorian Corner Accents */}
        <div className="absolute top-2 left-2 text-slate-500/60 pointer-events-none text-xs">╔════</div>
        <div className="absolute top-2 right-2 text-slate-500/60 pointer-events-none text-xs">════╗</div>
        <div className="absolute bottom-2 left-2 text-slate-500/60 pointer-events-none text-xs">╚════</div>
        <div className="absolute bottom-2 right-2 text-slate-500/60 pointer-events-none text-xs">════╝</div>

        {/* Top ambient glow bar */}
        <div 
          className={`absolute top-0 inset-x-0 h-1 ${
            isSecret
              ? 'bg-gradient-to-r from-amber-400 via-sky-300 to-amber-400'
              : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Хаах"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header metadata (Clean, unboxed as per constitution) */}
        <div className="text-center mb-3">
          <div className="text-xs uppercase font-gothic tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
            <span>{fortune.categoryIcon}</span>
            <span>{fortune.categoryName}</span>
            <span>{fortune.categoryIcon}</span>
          </div>

          <h2 className="text-xs lg:text-sm font-gothic tracking-widest text-slate-400 mt-0.5">
            ЧИНИЙ ЗӨГНӨЛ
          </h2>
        </div>

        {/* Fortune Title */}
        <h3 
          className={`text-xl lg:text-2xl font-gothic text-center font-bold tracking-wide my-2 ${
            isSecret 
              ? 'text-amber-200 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]' 
              : 'text-cyan-100 drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]'
          }`}
        >
          {fortune.title}
        </h3>

        {/* Victorian Divider */}
        <div className="flex items-center justify-center gap-3 my-3 text-slate-500 text-xs">
          <span>─────</span>
          <span className="text-cyan-400">❖</span>
          <span>─────</span>
        </div>

        {/* Fortune Text */}
        <div className="my-4 px-2">
          <p className="text-slate-200 text-base lg:text-lg leading-relaxed text-center font-serif">
            «{fortune.text}»
          </p>
        </div>

        {/* Gothic Advice / Guidance */}
        {fortune.advice && (
          <div className="mt-4 p-3 rounded bg-slate-900/60 border border-slate-800/80 text-center">
            <span className="text-xs font-gothic tracking-wider text-slate-400 uppercase block mb-1">
              Зөвлөгөө
            </span>
            <p className="text-sm text-cyan-200/90 italic font-serif">
              {fortune.advice}
            </p>
          </div>
        )}

        {/* Candy Reward Section if available */}
        {fortune.candyReward && (
          <div className="mt-5 p-3.5 rounded-md bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900/40 border border-amber-500/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-lg">
                🍬
              </div>
              <div>
                <div className="text-xs text-amber-300 font-gothic tracking-wider">
                  ЧИХРИЙН ШАГНАЛ
                </div>
                <div className="text-sm font-semibold text-white">
                  +{fortune.candyReward} амтат чихэр
                </div>
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={alreadyClaimed}
              className={`py-2 px-4 rounded text-xs lg:text-sm font-gothic tracking-wider font-semibold transition-all flex items-center gap-1.5 ${
                alreadyClaimed
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/50 cursor-default'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:brightness-110 shadow-lg hover:shadow-amber-500/30 active:scale-95'
              }`}
            >
              {alreadyClaimed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Цуглуулсан</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Цуглуулах</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Secret Rare Badge Notice */}
        {isSecret && (
          <div className="mt-3 text-center text-xs text-amber-300 font-serif flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Маш ховор шөнийн нууц зөгнөл нээгдлээ!</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          </div>
        )}

        {/* Action Buttons: "Дахин зөгнүүлэх" (Ask Again in Mongolian) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={remainingDivinations > 0 ? onAskAgain : undefined}
            disabled={remainingDivinations <= 0}
            className={`w-full py-2.5 px-4 rounded font-gothic tracking-wider text-sm font-medium transition-all shadow flex items-center justify-center gap-2 ${
              remainingDivinations > 0
                ? 'bg-[#132247] hover:bg-[#1a2f63] border border-cyan-400/50 text-cyan-200 hover:text-white active:scale-98 cursor-pointer'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-80'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${remainingDivinations > 0 ? 'text-cyan-400' : 'text-slate-600'}`} />
            <span>
              {remainingDivinations > 0
                ? `Дахин зөгнүүлэх (${remainingDivinations}/3)`
                : 'Өнөөдрийн 3 эрх дууссан'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded font-gothic tracking-wider text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};
