import { Fortune, HistoryRecord } from '../types';

const HISTORY_KEY = 'madame_nocturne_fortune_history';

export function getFortuneHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFortuneToHistory(fortune: Fortune): HistoryRecord[] {
  try {
    const current = getFortuneHistory();
    const newRecord: HistoryRecord = {
      id: 'hist-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      fortuneId: fortune.id,
      fortuneTitle: fortune.title,
      fortuneText: fortune.text,
      categoryName: fortune.categoryName,
      category: fortune.category,
      timestamp: Date.now(),
      candyReward: fortune.candyReward,
      isSecretRare: fortune.isSecretRare
    };

    // Prepend new record, keep up to 50
    const updated = [newRecord, ...current].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearFortuneHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
