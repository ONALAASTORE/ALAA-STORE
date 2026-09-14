import { Product } from '../types';

export const PRODUCTS_STORAGE_KEY = 'on_alaa_store_products';
const IDB_DATABASE_NAME = 'on_alaa_store_db';
const IDB_STORE_NAME = 'catalog_cache';
const IDB_KEY = 'latest_products';

/**
 * Checks if an error is a browser Storage QuotaExceededError
 */
export function isQuotaExceededError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    (err.code === 22 ||
      err.code === 1014 ||
      err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED')
  );
}

/**
 * Initializes and returns an IndexedDB instance for robust, quota-free storage
 */
function openCatalogDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(IDB_DATABASE_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Saves products to IndexedDB (supports 100+ MBs without quota issues)
 */
export async function saveProductsToIndexedDB(products: Product[]): Promise<void> {
  try {
    const db = await openCatalogDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put(products, IDB_KEY);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error || new Error('IndexedDB write transaction failed'));
      };
    });
  } catch (err) {
    // Non-blocking catch for private browsing or restricted iframes
    console.warn('[IndexedDB] Catalog cache skipped:', err);
  }
}

/**
 * Retrieves products from IndexedDB
 */
export async function getProductsFromIndexedDB(): Promise<Product[] | null> {
  try {
    const db = await openCatalogDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const request = store.get(IDB_KEY);

      request.onsuccess = () => {
        db.close();
        const result = request.result;
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/**
 * Strips gigantic base64 strings from products for safe localStorage caching
 */
function sanitizeProductsForLocalStorage(products: Product[]): Product[] {
  return products.map((p) => {
    // If image is a huge data URL, fallback or keep short url
    const isHeavyImage = (url?: string) => typeof url === 'string' && url.startsWith('data:') && url.length > 5000;

    const safeImage = isHeavyImage(p.image) ? '' : p.image;
    const safeGallery = Array.isArray(p.galleryImages)
      ? p.galleryImages.filter((img) => !isHeavyImage(img))
      : [];

    return {
      ...p,
      image: safeImage || (safeGallery[0] ?? ''),
      galleryImages: safeGallery,
      imageUrls: safeGallery,
      image_urls: safeGallery,
      additional_images: Array.isArray(p.additional_images)
        ? p.additional_images.filter((img) => !isHeavyImage(img))
        : []
    };
  });
}

/**
 * Safely persists products to localStorage with quota-management and graceful degradation.
 * Also persists full fidelity to IndexedDB asynchronously.
 */
export function safeSaveProducts(products: Product[]): void {
  // 1. Asynchronously persist full products to IndexedDB (never throws quota errors)
  saveProductsToIndexedDB(products).catch(() => {});

  // 2. Persist sanitized/lightweight version to localStorage for fast sync startup
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const sanitized = sanitizeProductsForLocalStorage(products);
    const serialized = JSON.stringify(sanitized);

    // If serialized string is greater than 1.5MB, avoid storing in localStorage
    if (serialized.length > 1500000) {
      console.info('[Storage] Catalog is large (>1.5MB); utilizing IndexedDB and Firestore instead of localStorage.');
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      return;
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, serialized);
  } catch (err) {
    if (isQuotaExceededError(err)) {
      // Clear out the products key to prevent choking other storage (cart, settings, currency)
      try {
        localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      } catch {}
      console.warn('[Storage] LocalStorage quota reached. Removed cached products; IndexedDB & Firestore active.');
    } else {
      console.warn('[Storage] LocalStorage save warning:', err);
    }
  }
}

/**
 * Safely retrieves products from localStorage
 */
export function safeGetProductsFromLocalStorage(): Product[] | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return null;
  } catch {
    try {
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch {}
    return null;
  }
}

/**
 * Safe wrapper for localStorage.setItem for arbitrary keys (e.g. cart, settings, wishlist)
 * If quota is exceeded, frees up the product catalog cache and retries.
 */
export function safeSetLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    if (isQuotaExceededError(err)) {
      console.warn(`[Storage] Quota exceeded on setItem('${key}'). Evicting large catalog cache and retrying...`);
      try {
        localStorage.removeItem(PRODUCTS_STORAGE_KEY);
        localStorage.setItem(key, value);
        return true;
      } catch (retryErr) {
        console.warn(`[Storage] Could not setItem('${key}') even after evicting catalog:`, retryErr);
        return false;
      }
    }
    console.warn(`[Storage] Error setting '${key}':`, err);
    return false;
  }
}

/**
 * Runs cleanup on application mount: clears overgrown localStorage products if taking too much space
 */
export function checkAndCleanOvergrownStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw && raw.length > 1500000) {
      // Free up the space immediately so the browser quota error vanishes
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      console.info('[Storage] Freed overgrown product catalog from localStorage to preserve storage quota.');
    }
  } catch {}
}
