import React, { useState } from 'react';
import { gothicAudio } from '../utils/audio';

interface GothicRoomProps {
  isDivining: boolean;
  children: React.ReactNode;
}

export const GothicRoomBackground: React.FC<GothicRoomProps> = ({ isDivining, children }) => {
  const [ravenHover, setRavenHover] = useState(false);
  const [ravenSpoken, setRavenSpoken] = useState(false);

  const handleRavenClick = () => {
    gothicAudio.playRavenCaw();
    setRavenSpoken(true);
    setTimeout(() => setRavenSpoken(false), 3000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050711] overflow-hidden text-slate-200 select-none">
      {/* Deep Gothic atmospheric background layers */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 25%, #0e1a38 0%, #080c1e 45%, #03040a 100%)',
          opacity: isDivining ? 0.35 : 0.95
        }}
      />

      {/* Occult vignette overlay during divination */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 z-10 ${
          isDivining 
            ? 'opacity-90 bg-[radial-gradient(circle_at_center,transparent_20%,#020308_80%)]' 
            : 'opacity-40 bg-[radial-gradient(circle_at_center,transparent_55%,#020308_95%)]'
        }`}
      />

      {/* Floating magical mist on the chamber floor */}
      <div className="absolute inset-x-0 bottom-0 h-96 pointer-events-none overflow-hidden opacity-30 z-0">
        <div 
          className="absolute inset-0 animate-mist"
          style={{
            background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(56, 189, 248, 0.18) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%)'
          }}
        />
        <div 
          className="absolute inset-0 animate-mist"
          style={{
            animationDelay: '-7s',
            background: 'radial-gradient(ellipse 80% 50% at 40% 100%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Atmospheric dust motes / glowing embers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-300"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${15 + (i * 17) % 75}%`,
              left: `${8 + (i * 23) % 84}%`,
              opacity: 0.3 + (i % 5) * 0.1,
              filter: 'blur(1px)',
              animation: `float-mote ${7 + (i % 5) * 2}s infinite ease-in-out ${i * 0.8}s`
            }}
          />
        ))}
      </div>

      {/* Top arched gothic moulding border (architectural ceiling) */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#020307] to-transparent pointer-events-none z-20" />

      {/* Victorian Chamber Decor Layer */}
      <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
        {/* Left Side: Candle stand, Grimorie, and Potion Phials */}
        <div className="absolute -left-4 lg:left-6 bottom-8 lg:bottom-16 w-56 lg:w-72 opacity-85 transition-opacity duration-700">
          {/* Subtle blue light glow on altar */}
          <div className="absolute -top-16 left-6 w-40 h-40 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Candle 1 (Tall silver candlestick with blue flame) */}
          <div className="relative inline-block ml-8">
            {/* Candle Blue Flame */}
            <div className="relative -top-2 left-3 w-5 h-8 flex flex-col items-center">
              <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-cyan-400 via-sky-300 to-white animate-flame" />
              <div className="w-1 h-2 bg-slate-900 mt-0.5" />
            </div>
            {/* Wax candle body */}
            <div className="w-5 h-24 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-t-sm shadow-inner relative">
              <div className="absolute top-2 -left-0.5 w-1.5 h-6 bg-slate-200 rounded-full opacity-80" />
            </div>
            {/* Victorian Candlestick holder */}
            <div className="w-10 -ml-2.5 h-16 bg-gradient-to-r from-zinc-700 via-slate-500 to-zinc-800 rounded-t-md border-t border-slate-400/40 relative">
              <div className="absolute bottom-0 -left-3 w-16 h-3 bg-gradient-to-r from-zinc-800 via-slate-600 to-zinc-900 rounded-full border-t border-slate-400/30" />
            </div>
          </div>

          {/* Candle 2 (Slightly shorter candlestick) */}
          <div className="relative inline-block ml-4">
            <div className="relative -top-1 left-2.5 w-5 h-7 flex flex-col items-center">
              <div className="w-3 h-5 rounded-full bg-gradient-to-t from-sky-400 via-cyan-300 to-white animate-flame-delayed" />
              <div className="w-1 h-1.5 bg-slate-900 mt-0.5" />
            </div>
            <div className="w-4 h-16 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-t-sm shadow-inner relative">
              <div className="absolute top-1 -right-0.5 w-1 h-4 bg-slate-200 rounded-full opacity-80" />
            </div>
            <div className="w-8 -ml-2 h-12 bg-gradient-to-r from-zinc-700 via-slate-500 to-zinc-800 rounded-t-md relative">
              <div className="absolute bottom-0 -left-2 w-12 h-2.5 bg-gradient-to-r from-zinc-800 via-slate-600 to-zinc-900 rounded-full" />
            </div>
          </div>

          {/* Ancient Leather Grimoire on Altar */}
          <div className="relative mt-2 ml-4">
            <div className="w-44 h-8 bg-[#181124] rounded border-b-2 border-r-2 border-amber-900/60 shadow-xl relative rotate-[-4deg]">
              <div className="absolute inset-y-0.5 left-2 right-1 flex justify-between items-center px-2">
                <span className="text-[9px] font-gothic tracking-widest text-amber-500/80">NOCTURNE</span>
                <span className="text-[10px] text-cyan-400/80">✦</span>
              </div>
              {/* Dusty bookmark ribbon hanging out */}
              <div className="absolute -bottom-4 right-8 w-2 h-6 bg-purple-900/80 rounded-b shadow" />
            </div>
          </div>

          {/* Alchemical Glass Potion Phials */}
          <div className="flex items-end gap-2 ml-10 mt-1">
            <div className="relative">
              <div className="w-2.5 h-3 bg-amber-800/80 rounded-t mx-auto border-t border-amber-600/40" />
              <div className="w-6 h-9 rounded-b-xl rounded-t-sm bg-gradient-to-b from-sky-950/80 to-sky-600/70 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.3)] relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-cyan-400/70 to-sky-500/40 animate-pulse" />
              </div>
            </div>
            <div className="relative">
              <div className="w-2 h-2.5 bg-amber-900 rounded-t mx-auto" />
              <div className="w-5 h-7 rounded-b-lg rounded-t-xs bg-gradient-to-b from-purple-950/80 to-purple-600/70 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)] relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-4 bg-purple-500/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Gothic Arched Window with Moon & Perched Raven */}
        <div className="absolute right-2 lg:right-12 top-14 lg:top-16 w-44 lg:w-64 h-64 lg:h-96 pointer-events-auto">
          {/* Gothic Pointed Arch Window Frame */}
          <div className="relative w-full h-full rounded-t-[100px] border-4 border-[#141b2d] bg-[#030611] shadow-[inset_0_0_25px_rgba(56,189,248,0.15)] overflow-hidden">
            {/* Night sky view inside window */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060e24] via-[#09153a] to-[#040817]">
              {/* Moon with pale glow */}
              <div className="absolute top-6 right-6 w-14 lg:w-20 h-14 lg:h-20 rounded-full bg-slate-100 shadow-[0_0_30px_rgba(186,230,253,0.7)]">
                {/* Subtle moon crater textures */}
                <div className="absolute top-3 left-4 w-3 h-3 rounded-full bg-slate-300/40" />
                <div className="absolute top-8 left-8 w-5 h-5 rounded-full bg-slate-300/30" />
              </div>

              {/* Barren Dead Tree Branches Silhouette */}
              <svg 
                className="absolute inset-0 w-full h-full opacity-60 text-black pointer-events-none" 
                viewBox="0 0 200 300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M 0 160 Q 50 140 90 150 T 160 130 T 200 110" />
                <path d="M 90 150 Q 110 110 140 100" />
                <path d="M 130 135 Q 160 160 190 155" />
                <path d="M 50 142 Q 60 100 80 80" />
              </svg>

              {/* Window stone tracery bars */}
              <div className="absolute inset-0 border-t-2 border-r border-[#1e293b]/70 pointer-events-none">
                <div className="absolute inset-y-0 left-1/2 w-1 bg-[#151c2e]" />
                <div className="absolute inset-x-0 top-1/2 h-1 bg-[#151c2e]" />
                <div className="absolute inset-x-0 top-3/4 h-1 bg-[#151c2e]" />
              </div>

              {/* Cobwebs in top corners */}
              <div className="absolute top-1 left-1 opacity-40">
                <svg width="40" height="40" viewBox="0 0 40 40" stroke="rgba(255,255,255,0.4)" fill="none" strokeWidth="0.7">
                  <path d="M0,0 L40,0 M0,0 L0,40 M0,0 L35,35 M0,0 L20,38 M0,0 L38,20" />
                  <path d="M0,15 Q10,12 15,0 M0,28 Q20,24 28,0" />
                </svg>
              </div>
            </div>

            {/* Perched Black Raven on Window Sill */}
            <div 
              onClick={handleRavenClick}
              onMouseEnter={() => setRavenHover(true)}
              onMouseLeave={() => setRavenHover(false)}
              className="absolute bottom-2 left-6 cursor-pointer group z-10 transition-transform duration-300 hover:scale-105"
              title="Хэрээн дээр дарж дууг нь сонс"
            >
              {/* Raven Body SVG */}
              <svg width="56" height="60" viewBox="0 0 60 65" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {/* Raven tail & body */}
                <path 
                  d="M 18 55 L 8 62 L 22 56 Z" 
                  fill="#030408" 
                />
                <ellipse cx="28" cy="42" rx="14" ry="17" fill="#090d16" />
                {/* Wings */}
                <path 
                  d="M 22 30 Q 12 40 18 54 Q 30 45 28 32 Z" 
                  fill="#05070d" 
                />
                {/* Head */}
                <circle cx="34" cy="24" r="10" fill="#090d16" />
                {/* Sharp beak */}
                <path d="M 42 22 L 56 27 L 42 29 Z" fill="#020306" />
                {/* Glowing cyan/blue piercing eye */}
                <circle 
                  cx="37" 
                  cy="22" 
                  r="2.2" 
                  fill="#38bdf8" 
                  className={ravenHover ? 'animate-ping' : ''} 
                />
                <circle cx="37" cy="22" r="1.2" fill="#ffffff" />
                {/* Talons perched on sill */}
                <path d="M 24 57 L 22 62 M 28 57 L 29 62 M 33 57 L 35 62" stroke="#000" strokeWidth="2" />
              </svg>

              {/* Speech balloon / reaction */}
              {ravenSpoken && (
                <div className="absolute -top-10 -left-12 bg-slate-900/95 text-cyan-300 text-[11px] px-2.5 py-1 rounded-md border border-cyan-500/40 shadow-xl whitespace-nowrap animate-bounce font-gothic">
                  «Хөө-хөө! Шөнө нууцаа дэлгэнэ!»
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main interactive application content layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
