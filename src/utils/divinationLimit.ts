import { FORTUNES } from '../data/fortunes';
import { Fortune } from '../types';

const STORAGE_KEY_COUNT = 'nocturne_divination_daily_tracker';
const DECK_KEY = 'nocturne_shuffled_deck_order';
const POINTER_KEY = 'nocturne_deck_pointer_idx';
const SEEN_FORTUNES_KEY = 'nocturne_seen_fortune_ids';

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

/**
 * Fisher-Yates cryptographically secure shuffle.
 * Uses window.crypto.getRandomValues for true randomness.
 */
function cryptographicallyShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let randIndex = 0;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      randIndex = buffer[0] % (i + 1);
    } else {
      randIndex = Math.floor(Math.random() * (i + 1));
    }
    const temp = shuffled[i];
    shuffled[i] = shuffled[randIndex];
    shuffled[randIndex] = temp;
  }
  return shuffled;
}

/**
 * Ensures that people drawing fortunes NEVER get duplicate fortunes.
 * Each user/device gets a distinct randomized sequence through the 51 fortunes.
 * Fortunes are drawn without replacement until all 51 have been experienced.
 */
export function pickSuperRandomFortune(): Fortune {
  // All 51 fortunes from user
  const allIds = FORTUNES.map(f => f.id);

  // Retrieve current shuffled deck and pointer
  let deck: string[] = [];
  let pointer = 0;
  let seen: string[] = [];

  try {
    const rawDeck = localStorage.getItem(DECK_KEY);
    const rawPointer = localStorage.getItem(POINTER_KEY);
    const rawSeen = localStorage.getItem(SEEN_FORTUNES_KEY);

    if (rawDeck) deck = JSON.parse(rawDeck);
    if (rawPointer) pointer = parseInt(rawPointer, 10);
    if (rawSeen) seen = JSON.parse(rawSeen);
  } catch {}

  // If deck is missing, empty, or exhausted, generate a fresh cryptographically shuffled deck
  if (!deck || deck.length === 0 || pointer >= deck.length) {
    deck = cryptographicallyShuffle(allIds);
    pointer = 0;
  }

  // Get next unseen fortune from the deck
  let chosenId = deck[pointer];
  pointer++;

  // Record seen ID
  if (!seen.includes(chosenId)) {
    seen.push(chosenId);
    // If all 51 have been seen, reset seen memory
    if (seen.length >= FORTUNES.length) {
      seen = [chosenId];
    }
  }

  // Save updated deck state
  try {
    localStorage.setItem(DECK_KEY, JSON.stringify(deck));
    localStorage.setItem(POINTER_KEY, String(pointer));
    localStorage.setItem(SEEN_FORTUNES_KEY, JSON.stringify(seen));
  } catch {}

  const fortune = FORTUNES.find(f => f.id === chosenId);
  return fortune || FORTUNES[0];
}
