/**
 * Candy management utility syncing with existing website candy storage.
 * Connects to 'halloween_candy_count' (or 'candy_count' if already present).
 * Prevents double claiming using unique roll IDs.
 */

const STORAGE_KEYS = ['halloween_candy_count', 'candy_count'];
const CLAIMED_KEYS = 'madame_nocturne_claimed_rolls';

export function getStoredCandy(): number {
  for (const key of STORAGE_KEYS) {
    const val = localStorage.getItem(key);
    if (val !== null) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  // Default starting candy if none exists on the website yet
  return 12;
}

export function addCandy(amount: number, rollToken: string): { success: boolean; newTotal: number } {
  if (isRollClaimed(rollToken)) {
    return { success: false, newTotal: getStoredCandy() };
  }

  const current = getStoredCandy();
  const newTotal = current + amount;

  // Save to both known candy keys to stay fully compatible with parent site
  localStorage.setItem('halloween_candy_count', String(newTotal));
  localStorage.setItem('candy_count', String(newTotal));

  // Mark token as claimed
  markRollClaimed(rollToken);

  // Dispatch custom event for real-time reactivity
  window.dispatchEvent(new CustomEvent('candy_count_updated', { detail: { count: newTotal, added: amount } }));

  return { success: true, newTotal };
}

export function isRollClaimed(rollToken: string): boolean {
  try {
    const raw = localStorage.getItem(CLAIMED_KEYS);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(rollToken);
  } catch {
    return false;
  }
}

function markRollClaimed(rollToken: string): void {
  try {
    const raw = localStorage.getItem(CLAIMED_KEYS);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(rollToken)) {
      list.push(rollToken);
      // Keep only last 100 claimed tokens
      if (list.length > 100) list.shift();
      localStorage.setItem(CLAIMED_KEYS, JSON.stringify(list));
    }
  } catch {}
}

export function checkDailyFreeAvailable(): { available: boolean; nextTime?: string } {
  const lastDaily = localStorage.getItem('madame_nocturne_last_daily');
  if (!lastDaily) return { available: true };

  const lastDate = new Date(parseInt(lastDaily, 10));
  const now = new Date();

  // Free once per calendar day (or 24h)
  const isSameDay = 
    lastDate.getFullYear() === now.getFullYear() &&
    lastDate.getMonth() === now.getMonth() &&
    lastDate.getDate() === now.getDate();

  if (isSameDay) {
    // Next midnight
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diffHours = Math.max(1, Math.round((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60)));
    return { available: false, nextTime: `${diffHours} цагийн дараа` };
  }

  return { available: true };
}

export function recordDailyUsed(): void {
  localStorage.setItem('madame_nocturne_last_daily', String(Date.now()));
}
