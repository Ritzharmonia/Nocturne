/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GothicRoomBackground } from './components/GothicRoomBackground';
import { HeaderNav } from './components/HeaderNav';
import { CrystalBall } from './components/CrystalBall';
import { FortuneDisplay } from './components/FortuneDisplay';
import { ThreeCardTarot } from './components/ThreeCardTarot';
import { FortuneHistoryModal } from './components/FortuneHistoryModal';
import { CandyCelebration } from './components/CandyCelebration';
import { FORTUNES } from './data/fortunes';
import { Fortune, HistoryRecord, ActiveTab } from './types';
import { gothicAudio } from './utils/audio';
import {
  getStoredCandy,
  addCandy,
  checkDailyFreeAvailable,
  recordDailyUsed
} from './utils/candyStorage';
import {
  getFortuneHistory,
  saveFortuneToHistory,
  clearFortuneHistory
} from './utils/historyStorage';

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
  const [dailyStatus, setDailyStatus] = useState(() => checkDailyFreeAvailable());

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
    };

    window.addEventListener('candy_count_updated', handleCandyUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('candy_count_updated', handleCandyUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Divination logic
  const handleDivinate = useCallback(() => {
    if (isDivining) return;

    // Start divination state
    setIsDivining(true);
    setCurrentFortune(null);

    // Audio effects sequence
    gothicAudio.playCrystalHum();

    setTimeout(() => {
      gothicAudio.playCardFlip();
    }, 1400);

    setTimeout(() => {
      // Pick strictly among fortunes 1-50, avoiding immediate repeat
      // Fortune #51 ("Баяр хүргэе 500 зоос хожлоо") is kept extremely rare as requested ("51 дэхийг аль болох хэлээд хэрэггүй")
      const regularFortunes = FORTUNES.filter(f => f.id !== 'f-51');
      const available = regularFortunes.filter(f => f.id !== lastFortuneIdRef.current);

      let selected: Fortune;
      const rollJackpot = Math.random() < 0.003; // Ultra rare 0.3% chance for #51

      if (rollJackpot) {
        selected = FORTUNES.find(f => f.id === 'f-51') || available[0];
      } else {
        selected = available[Math.floor(Math.random() * available.length)];
      }

      lastFortuneIdRef.current = selected.id;

      // Generate unique roll token for candy claim protection
      const token = `roll-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setCurrentRollToken(token);
      setCurrentFortune(selected);

      // Record daily if daily was available
      if (dailyStatus.available) {
        recordDailyUsed();
        setDailyStatus(checkDailyFreeAvailable());
      }

      // Save to history grimoire
      const updatedHistory = saveFortuneToHistory(selected);
      setHistoryRecords(updatedHistory);

      // Finish divination & play reveal sound
      setIsDivining(false);
      gothicAudio.playFortuneReveal();
    }, 2400);
  }, [isDivining, dailyStatus.available]);

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
      {/* Header bar */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        candyCount={candyCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={historyRecords.length}
        dailyAvailable={dailyStatus.available}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center py-6 px-4">
        {activeTab === 'crystal' && (
          <CrystalBall
            isDivining={isDivining}
            onDivinate={handleDivinate}
            dailyAvailable={dailyStatus.available}
            dailyNextTime={dailyStatus.nextTime}
          />
        )}

        {activeTab === 'tarot' && (
          <ThreeCardTarot />
        )}
      </main>

      {/* Footer subtle attribution */}
      <footer className="w-full py-3 text-center text-xs text-slate-500 font-serif border-t border-slate-900/60 select-none">
        <p>NOCTURNE · Саффир улсын шөнийн зөгнөгч</p>
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
