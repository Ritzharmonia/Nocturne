import React, { useEffect, useState } from 'react';

interface CelebrationProps {
  amount: number;
  onComplete: () => void;
}

export const CandyCelebration: React.FC<CelebrationProps> = ({ amount, onComplete }) => {
  const [items] = useState(() => {
    const icons = ['🍬', '🍭', '✨', '🦋', '🎃', '🍬', '🍫', '✨'];
    return [...Array(24)].map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 85 + 5,
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.0,
      size: 20 + Math.random() * 24,
      rotation: Math.random() * 360
    }));
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden select-none">
      {/* Central Announcement Banner for Big Reward */}
      {amount >= 15 && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
          <div className="bg-slate-950/90 border-2 border-amber-400 text-amber-200 px-6 py-3 rounded-lg shadow-[0_0_35px_rgba(251,191,36,0.6)]">
            <div className="text-xs font-gothic tracking-widest text-amber-400">
              ТОМ ШАГНАЛ!
            </div>
            <div className="text-2xl font-gothic font-bold mt-1">
              +{amount} ШИДЭТ ЧИХЭР!
            </div>
          </div>
        </div>
      )}

      {/* Floating treat items */}
      {items.map(item => (
        <div
          key={item.id}
          className="absolute bottom-10 transition-transform"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            animation: `float-mote ${item.duration}s ease-out ${item.delay}s forwards`,
            transform: `rotate(${item.rotation}deg)`
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};
