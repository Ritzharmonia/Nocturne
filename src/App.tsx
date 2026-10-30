/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GothicRoomBackground } from './components/GothicRoomBackground';
import { HeaderNav } from './components/HeaderNav';
import { BottomTabBar } from './components/BottomTabBar';
import { CrystalBall } from './components/CrystalBall';
import { FortuneDisplay } from './components/FortuneDisplay';
import { ThreeCardTarot } from './components/ThreeCardTarot';
import { FortuneHistoryModal } from './components/FortuneHistoryModal';
import { CandyCelebration } from './components/CandyCelebration';
import { Fortune, HistoryRecord, ActiveTab } from './types';
import { gothicAudio } from './utils/audio';
import {
  getStoredCandy,
  addCandy
} from './utils/candyStorage';
import {
  getFortuneHistory,
  saveFortuneToHistory,
  clearFortuneHistory
} from './utils/historyStorage';
import {
  getRemainingDivinations,
  canDivinate,
  recordDivinationUsed,
  pickSuperRandomFortune
} from './utils/divinationLimit';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('crystal');
  const [isDivining, setIsDivining] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [currentRollToken, setCurrentRollToken] = useState<string>('');
  const [candyCount, setCandyCount] = useState<number>(() => getStoredCandy());
  const [isMuted, setIsMuted] = useState<boolean>(() => gothicAudio.getMuted());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => getFortuneHistory());
  const [celebrationAmount, setCelebrationAmount] = useState<number | null>(null);
  const [remainingDivinations, setRemainingDivinations] = useState<number>(() => getRemainingDivinations());

  const lastFortuneIdRef = useRef<string | null>(null);

  // Sync candy count across windows and custom events
  useEffect(() => {
    const handleCandyUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      if (customEvent.detail && typeof customEvent.detail.count === 'number') {
        setCandyCount(customEvent.detail.count);
      } else {
        setCandyCount(getStoredCandy());
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'halloween_candy_count' || e.key === 'candy_count') {
        setCandyCount(getStoredCandy());
      }
      // Also update remaining limit if updated in another tab
      if (e.key === 'nocturne_divination_daily_tracker') {
        setRemainingDivinations(getRemainingDivinations());
      }
    };

    window.addEventListener('candy_count_updated', handleCandyUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('candy_count_updated', handleCandyUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Divination logic: Cryptographically random, max 3 times per day limit
  const handleDivinate = useCallback(() => {
    if (isDivining) return;
    if (!canDivinate()) return;

    // Start divination state
    setIsDivining(true);
    setCurrentFortune(null);

    // Audio effects sequence
    gothicAudio.playCrystalHum();

    setTimeout(() => {
      gothicAudio.playCardFlip();
    }, 1400);

    setTimeout(() => {
      // Pick super random fortune using cryptographically secure random values
      const selected = pickSuperRandomFortune();
      lastFortuneIdRef.current = selected.id;

      // Deduct 1 from daily limit (max 3 times)
      const nextRemaining = recordDivinationUsed();
      setRemainingDivinations(nextRemaining);

      // Generate unique roll token for candy claim protection
      const token = `roll-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setCurrentRollToken(token);
      setCurrentFortune(selected);

      // Save to history grimoire
      const updatedHistory = saveFortuneToHistory(selected);
      setHistoryRecords(updatedHistory);

      // Finish divination & play reveal sound
      setIsDivining(false);
      gothicAudio.playFortuneReveal();
    }, 2400);
  }, [isDivining]);

  // Handle candy claiming
  const handleClaimCandy = useCallback((rollToken: string, amount: number) => {
    const res = addCandy(amount, rollToken);
    if (res.success) {
      setCandyCount(res.newTotal);
      gothicAudio.playCandyCollect();
      setCelebrationAmount(amount);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    gothicAudio.setMuted(next);
  }, [isMuted]);

  const handleClearHistory = useCallback(() => {
    clearFortuneHistory();
    setHistoryRecords([]);
  }, []);

  return (
    <GothicRoomBackground isDivining={isDivining}>
      {/* Top Header bar with brand, candy count, remaining limit badge, audio toggle */}
      <HeaderNav
        candyCount={candyCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={historyRecords.length}
        remainingDivinations={remainingDivinations}
      />

      {/* Main Content Area with padding for bottom navigation */}
      <main className="flex-1 flex flex-col justify-center items-center py-6 px-4 pb-28">
        {activeTab === 'crystal' && (
          <CrystalBall
            isDivining={isDivining}
            onDivinate={handleDivinate}
            remainingDivinations={remainingDivinations}
          />
        )}

        {activeTab === 'tarot' && (
          <ThreeCardTarot />
        )}
      </main>

      {/* Bottom Mode Switcher Tabs (Crystal Ball vs Three Cards) */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        remainingDivinations={remainingDivinations}
      />

      {/* Footer subtle attribution */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 font-serif border-t border-slate-900/60 select-none pb-20">
        <p>NOCTURNE · Саффир улсын шөнийн зөгнөгч · Өдөрт ихдээ 3 зөгнөл</p>
      </footer>

      {/* Fortune Reveal Modal */}
      {currentFortune && (
        <FortuneDisplay
          fortune={currentFortune}
          rollToken={currentRollToken}
          onClose={() => setCurrentFortune(null)}
          onAskAgain={() => {
            setCurrentFortune(null);
            handleDivinate();
          }}
          onClaimCandy={handleClaimCandy}
          remainingDivinations={remainingDivinations}
        />
      )}

      {/* Grimoire / History Modal */}
      <FortuneHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        records={historyRecords}
        onClear={handleClearHistory}
      />

      {/* Candy celebration animation */}
      {celebrationAmount !== null && (
        <CandyCelebration
          amount={celebrationAmount}
          onComplete={() => setCelebrationAmount(null)}
        />
      )}
    </GothicRoomBackground>
  );
}
