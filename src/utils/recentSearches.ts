/**
 * Utility for managing recent search queries in localStorage.
 * Stores up to the last 5 unique search queries for faster navigation.
 */

export const RECENT_SEARCHES_STORAGE_KEY = 'on_alaa_recent_searches';
export const MAX_RECENT_SEARCHES = 5;

// Custom event name for syncing across components/tabs
export const RECENT_SEARCHES_UPDATED_EVENT = 'on_alaa_recent_searches_updated';

/**
 * 5 curated recent search terms for initial session bootstrap
 */
export const DEFAULT_RECENT_SEARCHES = [
  'iPhone 16 Pro Max',
  'PlayStation 5 Pro',
  'Samsung Galaxy S25 Ultra',
  'MacBook Air M3',
  'AirPods Pro 2',
];

/**
 * Retrieves the last 5 saved search queries from localStorage.
 */
export function getSavedRecentSearches(): string[] {
  if (typeof window === 'undefined') return DEFAULT_RECENT_SEARCHES;
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (raw === null) {
      // First visit: seed 5 default popular tech searches so clickable buttons are ready
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(DEFAULT_RECENT_SEARCHES));
      } catch {
        // ignore localStorage quota errors
      }
      return DEFAULT_RECENT_SEARCHES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim())
        .slice(0, MAX_RECENT_SEARCHES);
    }
    return [];
  } catch (err) {
    console.warn('[RecentSearches] Failed to parse recent searches from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new query to the top of the recent searches list in localStorage.
 * Deduplicates case-insensitively and preserves only the last 5 queries.
 */
export function saveRecentSearchQuery(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const clean = query.trim();
  if (!clean || clean.length < 2) return getSavedRecentSearches();

  try {
    const current = getSavedRecentSearches();
    // Remove if already exists (case-insensitive deduplication)
    const filtered = current.filter((item) => item.toLowerCase() !== clean.toLowerCase());
    // Insert new query at index 0 and cap strictly at MAX_RECENT_SEARCHES (5)
    const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));

    // Notify other components (e.g. mobile/desktop search bars) in this window
    window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_UPDATED_EVENT, { detail: updated }));

    return updated;
  } catch (err) {
    console.error('[RecentSearches] Failed to save search query to localStorage:', err);
    return getSavedRecentSearches();
  }
}

/**
 * Removes a specific search query from localStorage.
 */
export function removeRecentSearchQuery(queryToRemove: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedRecentSearches();
    const updated = current.filter((item) => item.toLowerCase() !== queryToRemove.trim().toLowerCase());

    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_UPDATED_EVENT, { detail: updated }));

    return updated;
  } catch (err) {
    console.error('[RecentSearches] Failed to remove search query from localStorage:', err);
    return getSavedRecentSearches();
  }
}

/**
 * Clears all recent searches from localStorage.
 */
export function clearAllRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_UPDATED_EVENT, { detail: [] }));
  } catch (err) {
    console.error('[RecentSearches] Failed to clear recent searches from localStorage:', err);
  }
}
