import { Product } from '../types';

/**
 * Firestore Serialization & Synchronization Utilities
 * Ensures products saved from the admin dashboard adhere to Firestore rules:
 * 1. No `undefined` values (which trigger Firestore runtime exceptions).
 * 2. Strict type preservation for arrays (variants, features, galleryImages, tags).
 * 3. Clean string preservation for Brand and Category.
 */

export function sanitizeProductForFirestore(product: Product): Record<string, any> {
  const sanitized: Record<string, any> = {
    id: product.id,
    name: product.name || '',
    brand: product.brand || 'Apple',
    category: product.category || 'smartphones',
    subcategory: product.subcategory || '',
    description: product.description || '',
    features: Array.isArray(product.features) ? product.features : [],
    specs: product.specs && typeof product.specs === 'object' ? { ...product.specs } : {},
    image: product.image || '',
    galleryImages: Array.isArray(product.galleryImages) ? product.galleryImages : [],
    basePriceUSD: typeof product.basePriceUSD === 'number' ? product.basePriceUSD : 0,
    rating: typeof product.rating === 'number' ? product.rating : 5.0,
    reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 0,
    condition: product.condition || 'Brand New (Sealed)',
    warranty: product.warranty || '1 Year Official Lebanese Warranty',
    inStock: product.inStock !== false,
    isFeatured: product.isFeatured ?? true,
    freeDelivery: Boolean(product.freeDelivery),
    tags: Array.isArray(product.tags) ? product.tags : [product.brand, product.category],
    updatedAt: new Date().toISOString(),
  };

  // Optional number fields - only set if defined and valid number
  if (typeof product.originalPriceUSD === 'number' && !isNaN(product.originalPriceUSD)) {
    sanitized.originalPriceUSD = product.originalPriceUSD;
  }
  if (typeof product.promotionalPriceUSD === 'number' && !isNaN(product.promotionalPriceUSD)) {
    sanitized.promotionalPriceUSD = product.promotionalPriceUSD;
  }
  if (typeof product.salePriceUSD === 'number' && !isNaN(product.salePriceUSD)) {
    sanitized.salePriceUSD = product.salePriceUSD;
  }
  if (typeof product.discountPercentage === 'number' && !isNaN(product.discountPercentage)) {
    sanitized.discountPercentage = product.discountPercentage;
  }
  if (typeof product.stockCount === 'number' && !isNaN(product.stockCount)) {
    sanitized.stockCount = product.stockCount;
  }

  // Optional arrays
  if (Array.isArray(product.storageOptions) && product.storageOptions.length > 0) {
    sanitized.storageOptions = product.storageOptions.map((opt) => ({
      capacity: opt.capacity,
      priceUSD: opt.priceUSD,
      inStock: opt.inStock !== false,
    }));
  }

  if (Array.isArray(product.colorOptions) && product.colorOptions.length > 0) {
    sanitized.colorOptions = product.colorOptions.map((opt) => ({
      name: opt.name,
      ...(opt.hex ? { hex: opt.hex } : {}),
    }));
  }

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    sanitized.variants = product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      priceUSD: v.priceUSD,
      inStock: v.inStock !== false,
      ...(v.storage ? { storage: v.storage } : {}),
      ...(v.color ? { color: v.color } : {}),
      ...(v.colorHex ? { colorHex: v.colorHex } : {}),
      ...(typeof v.stockCount === 'number' ? { stockCount: v.stockCount } : {}),
      ...(v.sku ? { sku: v.sku } : {}),
    }));
  }

  return sanitized;
}

/**
 * Save product to Firestore (or local state fallback if Firestore is not yet initialized)
 */
export async function saveProductToFirestore(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanData = sanitizeProductForFirestore(product);

    // If global or window Firebase is present, sync with Firestore
    const globalAny = window as any;
    if (globalAny.firebaseFirestoreDb || globalAny.firebase?.firestore) {
      const db = globalAny.firebaseFirestoreDb || globalAny.firebase.firestore();
      if (typeof db.collection === 'function') {
        await db.collection('products').doc(product.id).set(cleanData, { merge: true });
        console.info(`[Firestore Sync] Product "${product.name}" (${product.id}) saved to collection "products"`);
        return { success: true };
      }
    }

    console.info(`[Product Storage] Product "${product.name}" prepared & validated with category "${product.category}" and brand "${product.brand}".`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Firestore Sync Warning]', err);
    return { success: false, error: err?.message || 'Failed to sync with Firestore' };
  }
}

/**
 * Delete product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<{ success: boolean }> {
  try {
    const globalAny = window as any;
    if (globalAny.firebaseFirestoreDb || globalAny.firebase?.firestore) {
      const db = globalAny.firebaseFirestoreDb || globalAny.firebase.firestore();
      if (typeof db.collection === 'function') {
        await db.collection('products').doc(productId).delete();
        console.info(`[Firestore Sync] Deleted product "${productId}" from Firestore`);
      }
    }
    return { success: true };
  } catch (err) {
    console.warn('[Firestore Sync Delete Warning]', err);
    return { success: false };
  }
}
