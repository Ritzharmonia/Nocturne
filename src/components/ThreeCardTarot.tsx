import React, { useState } from 'react';
import { TAROT_CARDS } from '../data/tarotCards';
import { TarotCard } from '../types';
import { gothicAudio } from '../utils/audio';
import { Sparkles, RotateCcw, Eye, BookOpen } from 'lucide-react';

export const ThreeCardTarot: React.FC = () => {
  // Select 3 random cards for the 3 slots
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>(() => {
    const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  const [flipped, setFlipped] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleCardClick = (index: 0 | 1 | 2) => {
    if (flipped[index] || isShuffling) return;

    gothicAudio.playCardFlip();
    const nextFlipped: [boolean, boolean, boolean] = [...flipped];
    nextFlipped[index] = true;
    setFlipped(nextFlipped);

    // If all cards are now flipped, play mystic chime
    if (nextFlipped.every(Boolean)) {
      setTimeout(() => {
        gothicAudio.playFortuneReveal();
      }, 500);
    }
  };

  const handleReshuffle = () => {
    setIsShuffling(true);
    gothicAudio.playCardFlip();
    setFlipped([false, false, false]);

    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      setSelectedCards(shuffled.slice(0, 3));
      setIsShuffling(false);
    }, 600);
  };

  const allFlipped = flipped.every(Boolean);

  const slots = [
    { label: 'Өнгөрсөн', role: 'past' as const, desc: 'Өнгөрсөн хугацааны үндэс суурь ба сургамж' },
    { label: 'Одоо', role: 'present' as const, desc: 'Одоогийн нөхцөл байдал ба далд хүч' },
    { label: 'Ирээдүй', role: 'future' as const, desc: 'Ирээдүйн чиг хандлага ба хувь тавилан' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 text-center select-none">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-4xl font-decorative font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-100 to-indigo-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.4)]">
          ГУРВАН ХӨЗРИЙН ЗӨГНӨЛ
        </h2>
        <p className="text-slate-400 text-sm lg:text-base font-serif mt-1">
          Өнгөрсөн, одоо, ирээдүйн гурван хөзөр дээр дарж, цаг хугацааны хэлхээсийг нээгээрэй.
        </p>
      </div>

      {/* 3 Tarot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {slots.map((slot, index) => {
          const card = selectedCards[index];
          const isCardFlipped = flipped[index as 0 | 1 | 2];

          return (
            <div key={slot.label} className="flex flex-col items-center">
              {/* Slot Header Label (Clean, unboxed text as per constitution) */}
              <div className="mb-2 text-center">
                <span className="text-xs font-gothic tracking-widest text-cyan-400 uppercase">
                  {slot.label}
                </span>
                <p className="text-[11px] text-slate-500 font-serif">
                  {slot.desc}
                </p>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => handleCardClick(index as 0 | 1 | 2)}
                className={`relative w-56 h-88 cursor-pointer perspective-1000 group transition-transform duration-300 ${
                  !isCardFlipped ? 'hover:-translate-y-2' : ''
                }`}
                role="button"
                tabIndex={0}
                aria-label={`${slot.label} хөзрийг эргүүлэх`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(index as 0 | 1 | 2);
                  }
                }}
              >
                <div
                  className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
                    isCardFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* CARD BACK (Face Down) */}
                  <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-b from-[#0b1024] via-[#070b1a] to-[#040610] border-2 border-cyan-500/40 shadow-2xl p-3 flex flex-col justify-between overflow-hidden group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]">
                    {/* Victorian Ornate Pattern on Card Back */}
                    <div className="absolute inset-2 border border-cyan-500/20 rounded-lg pointer-events-none flex flex-col items-center justify-between p-2">
                      <div className="text-[10px] text-cyan-400/60 font-gothic tracking-widest">NOCTURNE</div>
                      
                      {/* Center Occult Emblem */}
                      <div className="w-20 h-20 rounded-full border border-cyan-400/30 flex items-center justify-center relative">
                        <div className="absolute inset-1 rounded-full border border-dashed border-indigo-400/40 animate-rune-spin" />
                        <Eye className="w-8 h-8 text-cyan-400/70" />
                      </div>

                      <div className="text-[10px] text-cyan-400/60 font-gothic tracking-widest">TAROT</div>
                    </div>

                    {/* Corner filigree */}
                    <div className="text-slate-600 text-xs">❖</div>
                    <div className="text-right text-slate-600 text-xs">❖</div>

                    {/* Hint overlay on hover */}
                    <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-gothic text-cyan-300 bg-slate-900/80 px-3 py-1 rounded border border-cyan-500/40">
                        Эргүүлэх
                      </span>
                    </div>
                  </div>

                  {/* CARD FRONT (Face Up) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-gradient-to-b from-[#0f1730] via-[#0a0f24] to-[#050814] border-2 border-sky-400/60 shadow-2xl p-4 flex flex-col justify-between text-left overflow-hidden">
                    {/* Top Roman Numeral & Title */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-gothic text-cyan-400 border-b border-slate-700/60 pb-1">
                        <span>{card.arcanaNumber}</span>
                        <span className="text-amber-300">{card.symbol}</span>
                      </div>
                      <h4 className="text-base font-gothic font-bold text-slate-100 mt-2">
                        {card.name}
                      </h4>
                      <p className="text-[11px] text-sky-300 font-serif italic">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Center Card Visual Symbol Badge */}
                    <div className="my-2 py-4 bg-slate-950/60 rounded border border-slate-800/80 flex items-center justify-center">
                      <div className="text-3xl filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                        {card.symbol}
                      </div>
                    </div>

                    {/* Temporal Interpretation */}
                    <div className="mt-auto">
                      <span className="text-[10px] font-gothic tracking-widest text-cyan-300 uppercase block mb-1">
                        {slot.label}
                      </span>
                      <p className="text-xs text-slate-200 font-serif leading-relaxed line-clamp-4">
                        {card.meanings[slot.role]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synthesis section when all 3 cards are flipped */}
      {allFlipped && (
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-b from-[#0c132b] via-[#070b1a] to-[#04060e] border border-cyan-500/40 shadow-2xl text-left animate-fadeIn">
          <div className="flex items-center gap-2 text-cyan-300 font-gothic tracking-widest text-xs uppercase mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>ЧИНИЙ ХУВЬ ТАВИЛАН: ГУРВАН ЦАГИЙН НЭГДСЭН ТАЙЛАЛ</span>
          </div>

          <h3 className="text-xl lg:text-2xl font-gothic text-slate-100 font-bold mb-3">
            «{selectedCards[0].name}» ➔ «{selectedCards[1].name}» ➔ «{selectedCards[2].name}»
          </h3>

          <p className="text-slate-300 font-serif text-sm lg:text-base leading-relaxed mb-4">
            Өнгөрсөнд тохиолдсон <strong className="text-cyan-200">«{selectedCards[0].name}»</strong>-ийн сургамж чамд хэрсүү ухаан хайрласан бөгөөд одоо цагт <strong className="text-cyan-200">«{selectedCards[1].name}»</strong>-ийн нөлөөгөөр чиний дотоод хүч төвлөрч байна. Удалгүй ирээдүйд <strong className="text-cyan-200">«{selectedCards[2].name}»</strong> биеллээ олж, чиний засах зам азын гэрлээр гийх хувь тавилантай.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-serif italic flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Зөгнөл амжилттай тайлагдлаа.</span>
            </div>

            <button
              onClick={handleReshuffle}
              className="py-2 px-5 rounded font-gothic tracking-wider text-xs lg:text-sm font-semibold bg-[#132247] hover:bg-[#1b2f66] border border-cyan-400/50 text-cyan-200 hover:text-white transition-all shadow flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Хөзрүүдийг дахин холих</span>
            </button>
          </div>
        </div>
      )}

      {/* If cards are not all flipped yet, show prompt */}
      {!allFlipped && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400 font-serif italic">
            Дээрх хөзрүүд дээр дарж эргүүлнэ үү ({flipped.filter(Boolean).length}/3 нээгдсэн)
          </p>
        </div>
      )}
    </div>
  );
};
