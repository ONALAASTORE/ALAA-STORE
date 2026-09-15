import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query
} from 'firebase/firestore';
import { db, PRODUCTS_COLLECTION } from './firebase';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { generateProductSku } from '../utils/sku';
import {
  safeSaveProducts,
  safeGetProductsFromLocalStorage,
  getProductsFromIndexedDB
} from '../utils/productStorage';

const QUOTA_STORAGE_KEY = 'on_alaa_firestore_quota_status';

/**
 * Checks if an error corresponds to Firestore free quota limit or resource exhaustion
 */
export function isFirestoreQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  const code = (err.code || '').toLowerCase();
  return (
    code.includes('resource-exhausted') ||
    code.includes('quota-exceeded') ||
    code.includes('unavailable') ||
    msg.includes('quota limit exceeded') ||
    msg.includes('quota exceeded') ||
    msg.includes('free daily read units') ||
    msg.includes('billing')
  );
}

/**
 * Check if the Firestore daily quota has already been reached today
 */
export function isFirestoreQuotaExceeded(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(QUOTA_STORAGE_KEY) || localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed?.exceeded || !parsed?.timestamp) return false;
    // Free daily read quota resets daily; consider recorded flag valid for 12 hours
    const elapsed = Date.now() - parsed.timestamp;
    return elapsed < 12 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Persist the quota reached status to prevent repeated failing queries
 */
export function markFirestoreQuotaExceeded(): void {
  if (typeof window === 'undefined') return;
  try {
    const data = JSON.stringify({ exceeded: true, timestamp: Date.now() });
    sessionStorage.setItem(QUOTA_STORAGE_KEY, data);
    localStorage.setItem(QUOTA_STORAGE_KEY, data);
  } catch {}
}

/**
 * Retrieve cached or static catalog when Cloud Firestore is quota-limited or offline
 */
export async function getOfflineFallbackProducts(): Promise<Product[]> {
  try {
    const local = safeGetProductsFromLocalStorage();
    if (local && local.length > 0) {
      return local;
    }
    const idb = await getProductsFromIndexedDB();
    if (idb && idb.length > 0) {
      return idb;
    }
  } catch {}
  return PRODUCTS;
}

/**
 * Removes undefined fields from objects to comply with Firestore constraints
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Partial<T> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeForFirestore(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as Partial<T>;
}

/**
 * Normalizes a raw Firestore document back into a fully typed Product
 */
export function mapDocToProduct(id: string, data: any): Product {
  const images = Array.isArray(data.galleryImages) && data.galleryImages.length > 0
    ? data.galleryImages
    : (data.image ? [data.image] : []);

  return {
    id: id || data.id,
    sku: data.sku || generateProductSku({ id: id || data.id, name: data.name, brand: data.brand, category: data.category }),
    name: data.name || 'Untitled Product',
    brand: data.brand || 'Other',
    category: data.category || 'smartphones',
    subcategory: data.subcategory || '',
    description: data.description || '',
    features: Array.isArray(data.features) ? data.features : [],
    specs: data.specs && typeof data.specs === 'object' ? data.specs : {},
    image: data.image || images[0] || '',
    galleryImages: images,
    imageUrls: images,
    image_urls: images,
    additional_images: Array.isArray(data.additional_images) ? data.additional_images : images.slice(1),
    basePriceUSD: typeof data.basePriceUSD === 'number' ? data.basePriceUSD : 0,
    originalPriceUSD: typeof data.originalPriceUSD === 'number' ? data.originalPriceUSD : undefined,
    promotionalPriceUSD: typeof data.promotionalPriceUSD === 'number' ? data.promotionalPriceUSD : undefined,
    salePriceUSD: typeof data.salePriceUSD === 'number' ? data.salePriceUSD : undefined,
    discountPercentage: typeof data.discountPercentage === 'number' ? data.discountPercentage : undefined,
    storageOptions: Array.isArray(data.storageOptions) ? data.storageOptions : undefined,
    colorOptions: Array.isArray(data.colorOptions) ? data.colorOptions : undefined,
    variants: Array.isArray(data.variants) && data.variants.length > 0
      ? data.variants
      : [{ id: `${id}-std`, name: 'Standard Edition', priceUSD: data.basePriceUSD || 0, inStock: data.inStock !== false }],
    rating: typeof data.rating === 'number' ? data.rating : 5.0,
    reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 1,
    condition: data.condition || 'Brand New (Sealed)',
    warranty: data.warranty || '1 Year Official Lebanese Warranty',
    inStock: data.inStock !== false,
    stockCount: typeof data.stockCount === 'number' ? data.stockCount : 10,
    isFeatured: data.isFeatured ?? true,
    isHotDeal: Boolean(data.isHotDeal),
    isNewArrival: Boolean(data.isNewArrival),
    tags: Array.isArray(data.tags) ? data.tags : [data.brand || 'Tech'],
    freeDelivery: data.freeDelivery !== false,
    has3DModel: Boolean(data.has3DModel)
  };
}

/**
 * Fetch all products from Firestore once (with resilient local fallback)
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  if (isFirestoreQuotaExceeded()) {
    return getOfflineFallbackProducts();
  }

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push(mapDocToProduct(docSnap.id, docSnap.data()));
    });
    if (products.length > 0) {
      safeSaveProducts(products);
    }
    return products;
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
      console.warn('[Firestore] Daily read quota limit reached during fetch. Operating from local cache.');
      return getOfflineFallbackProducts();
    }
    console.warn('[Firestore] Note fetching products from Firestore:', err?.message || err);
    return getOfflineFallbackProducts();
  }
}

/**
 * Save or overwrite a product in Firestore permanently (with local backup)
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  // Always update local cache so user updates persist immediately
  try {
    const current = safeGetProductsFromLocalStorage() || [];
    const index = current.findIndex((p) => p.id === product.id);
    const updated = index >= 0
      ? current.map((p) => (p.id === product.id ? product : p))
      : [product, ...current];
    safeSaveProducts(updated);
  } catch (e) {
    console.warn('[Storage] Local update note:', e);
  }

  if (isFirestoreQuotaExceeded()) {
    console.info(`[Firestore] Daily quota reached. Product "${product.name}" (${product.id}) saved to local cache.`);
    return;
  }

  try {
    const productId = product.id;
    if (!productId) {
      throw new Error('Product must have a valid ID before saving to Firestore');
    }
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const sanitized = sanitizeForFirestore({
      ...product,
      updatedAt: new Date().toISOString()
    });
    await setDoc(productRef, sanitized, { merge: true });
    console.log(`[Firestore] Successfully saved product "${product.name}" (${productId})`);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
      console.warn(`[Firestore] Daily quota reached while saving "${product.name}". Saved to offline storage.`);
      return;
    }
    console.warn(`[Firestore] Note saving product "${product.name}":`, err?.message || err);
  }
}

/**
 * Partially update an existing product in Firestore (with local backup)
 */
export async function updateProductInFirestore(
  productId: string,
  partialProduct: Partial<Product>
): Promise<void> {
  // Always update local cache
  try {
    const current = safeGetProductsFromLocalStorage() || [];
    const updated = current.map((p) => (p.id === productId ? { ...p, ...partialProduct } : p));
    safeSaveProducts(updated);
  } catch {}

  if (isFirestoreQuotaExceeded()) {
    console.info(`[Firestore] Daily quota reached. Product ${productId} updated in local cache.`);
    return;
  }

  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const sanitized = sanitizeForFirestore({
      ...partialProduct,
      updatedAt: new Date().toISOString()
    });
    await updateDoc(productRef, sanitized);
    console.log(`[Firestore] Successfully updated product ${productId}`);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
      console.warn(`[Firestore] Daily quota reached while updating product ${productId}. Saved to offline storage.`);
      return;
    }
    console.warn(`[Firestore] Note updating product ${productId}:`, err?.message || err);
  }
}

/**
 * Delete a product permanently from Firestore (with local backup)
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  // Always update local cache
  try {
    const current = safeGetProductsFromLocalStorage() || [];
    const updated = current.filter((p) => p.id !== productId);
    safeSaveProducts(updated);
  } catch {}

  if (isFirestoreQuotaExceeded()) {
    console.info(`[Firestore] Daily quota reached. Product ${productId} removed from local cache.`);
    return;
  }

  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    console.log(`[Firestore] Successfully deleted product ${productId}`);
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
      console.warn(`[Firestore] Daily quota reached while deleting product ${productId}. Removed from offline storage.`);
      return;
    }
    console.warn(`[Firestore] Note deleting product ${productId}:`, err?.message || err);
  }
}

/**
 * Real-time listener for products collection
 * Returns an unsubscribe cleanup function
 * Gracefully switches to offline catalog when Firestore free quota is exceeded
 */
export function subscribeToProducts(
  onProducts: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  // If Firestore daily quota was already recorded as reached, supply offline products immediately
  if (isFirestoreQuotaExceeded()) {
    console.info('[Firestore] Operating in offline-resilient mode (free tier daily read quota reached). Serving cached catalog.');
    getOfflineFallbackProducts().then((products) => {
      onProducts(products);
    });
    return () => {};
  }

  let isUnsubscribed = false;
  let unsubscribeFn: (() => void) | null = null;

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef);

    unsubscribeFn = onSnapshot(
      q,
      (snapshot) => {
        if (isUnsubscribed) return;
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          items.push(mapDocToProduct(docSnap.id, docSnap.data()));
        });
        if (items.length > 0) {
          safeSaveProducts(items);
        }
        onProducts(items);
      },
      (error: any) => {
        if (isUnsubscribed) return;

        if (isFirestoreQuotaError(error)) {
          markFirestoreQuotaExceeded();
          console.warn('[Firestore] Real-time listener note: Free daily read quota reached for database. Gracefully switching to offline local catalog.');
          // Immediately deliver offline products to keep UI fully populated
          getOfflineFallbackProducts().then((fallback) => {
            if (!isUnsubscribed) {
              onProducts(fallback);
            }
          });
          return;
        }

        console.warn('[Firestore] Real-time listener note:', error?.message || error);
        if (onError && !isUnsubscribed) {
          onError(error);
        }
      }
    );
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
      console.warn('[Firestore] Real-time listener setup note: Free daily quota reached. Utilizing offline catalog.');
      getOfflineFallbackProducts().then((fallback) => {
        if (!isUnsubscribed) {
          onProducts(fallback);
        }
      });
      return () => {};
    }
    console.warn('[Firestore] Real-time listener setup note:', err?.message || err);
  }

  return () => {
    isUnsubscribed = true;
    if (unsubscribeFn) {
      try {
        unsubscribeFn();
      } catch {}
    }
  };
}

/**
 * Seed Firestore with products if the collection is empty
 */
export async function seedProductsIfEmpty(initialProducts: Product[]): Promise<boolean> {
  if (isFirestoreQuotaExceeded()) {
    return false;
  }
  try {
    const existing = await fetchProductsFromFirestore();
    if (existing.length === 0 && initialProducts.length > 0) {
      console.log(`[Firestore] Seeding ${initialProducts.length} products to Firestore...`);
      // Use batches of up to 400 (Firestore limit is 500 operations per batch)
      const chunkSize = 400;
      for (let i = 0; i < initialProducts.length; i += chunkSize) {
        const chunk = initialProducts.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        chunk.forEach((prod) => {
          const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
          batch.set(docRef, sanitizeForFirestore({
            ...prod,
            seededAt: new Date().toISOString()
          }));
        });
        await batch.commit();
      }
      console.log('[Firestore] Seeding completed successfully.');
      return true;
    }
    return false;
  } catch (err: any) {
    if (isFirestoreQuotaError(err)) {
      markFirestoreQuotaExceeded();
      console.warn('[Firestore] Note on seeding: Daily quota reached.');
      return false;
    }
    console.warn('[Firestore] Note on seeding:', err?.message || err);
    return false;
  }
}
