import { FORTUNES } from '../data/fortunes';
import { Fortune } from '../types';

const STORAGE_KEY_COUNT = 'nocturne_divination_daily_tracker';
const RECENT_ROLLS_KEY = 'nocturne_recent_fortune_ids';
export const MAX_DIVINATIONS = 3;

interface DailyTracker {
  date: string; // YYYY-MM-DD
  count: number;
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyDivinationData(): DailyTracker {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUNT);
    const today = getTodayString();
    if (!raw) {
      return { date: today, count: 0 };
    }
    const data: DailyTracker = JSON.parse(raw);
    if (data.date !== today) {
      // New day, reset counter to 0
      const reset = { date: today, count: 0 };
      localStorage.setItem(STORAGE_KEY_COUNT, JSON.stringify(reset));
      return reset;
    }
    return data;
  } catch {
    return { date: getTodayString(), count: 0 };
  }
}

export function getRemainingDivinations(): number {
  const data = getDailyDivinationData();
  return Math.max(0, MAX_DIVINATIONS - data.count);
}

export function canDivinate(): boolean {
  return getRemainingDivinations() > 0;
}

export function recordDivinationUsed(): number {
  const data = getDailyDivinationData();
  const newCount = Math.min(MAX_DIVINATIONS, data.count + 1);
  const updated = { date: data.date, count: newCount };
  localStorage.setItem(STORAGE_KEY_COUNT, JSON.stringify(updated));
  return Math.max(0, MAX_DIVINATIONS - newCount);
}

// Cryptographically secure random integer in range [0, max - 1]
function getSecureRandomInt(max: number): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return Math.floor(Math.random() * max);
}

// High-entropy fortune selector
export function pickSuperRandomFortune(): Fortune {
  // Fortunes 1 to 50 are the regular pool
  const regularFortunes = FORTUNES.filter(f => f.id !== 'f-51');

  // Fortune 51: "Баяр хүргэе 500 зоос хожлоо."
  // User explicitly instructed: "51 дэхийг аль болох хэлээд хэрэггүй"
  // We use an ultra-rare 1 in 1000 chance using a 32-bit cryptographically secure seed
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const rareCheck = new Uint32Array(1);
    window.crypto.getRandomValues(rareCheck);
    if (rareCheck[0] % 1000 === 777) {
      const jackpot = FORTUNES.find(f => f.id === 'f-51');
      if (jackpot) return jackpot;
    }
  }

  // Get recently drawn fortune IDs (last 8) to prevent near-term repetition
  let recentIds: string[] = [];
  try {
    const rawRecent = localStorage.getItem(RECENT_ROLLS_KEY);
    if (rawRecent) recentIds = JSON.parse(rawRecent);
  } catch {}

  // Filter out recent ones if we have enough options
  let candidates = regularFortunes.filter(f => !recentIds.includes(f.id));
  if (candidates.length < 5) {
    candidates = regularFortunes; // reset if candidates run low
    recentIds = [];
  }

  // Cryptographically random pick
  const selectedIdx = getSecureRandomInt(candidates.length);
  const selected = candidates[selectedIdx];

  // Update recent list
  const nextRecent = [...recentIds, selected.id].slice(-10);
  try {
    localStorage.setItem(RECENT_ROLLS_KEY, JSON.stringify(nextRecent));
  } catch {}

  return selected;
}
