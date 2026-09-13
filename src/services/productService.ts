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
 * Fetch all products from Firestore once
 */
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push(mapDocToProduct(docSnap.id, docSnap.data()));
    });
    return products;
  } catch (err) {
    console.error('[Firestore] Error fetching products:', err);
    throw err;
  }
}

/**
 * Save or overwrite a product in Firestore permanently
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
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
  } catch (err) {
    console.error(`[Firestore] Error saving product "${product.name}":`, err);
    throw err;
  }
}

/**
 * Partially update an existing product in Firestore
 */
export async function updateProductInFirestore(
  productId: string,
  partialProduct: Partial<Product>
): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const sanitized = sanitizeForFirestore({
      ...partialProduct,
      updatedAt: new Date().toISOString()
    });
    await updateDoc(productRef, sanitized);
    console.log(`[Firestore] Successfully updated product ${productId}`);
  } catch (err) {
    console.error(`[Firestore] Error updating product ${productId}:`, err);
    throw err;
  }
}

/**
 * Delete a product permanently from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    console.log(`[Firestore] Successfully deleted product ${productId}`);
  } catch (err) {
    console.error(`[Firestore] Error deleting product ${productId}:`, err);
    throw err;
  }
}

/**
 * Real-time listener for products collection
 * Returns an unsubscribe cleanup function
 */
export function subscribeToProducts(
  onProducts: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        items.push(mapDocToProduct(docSnap.id, docSnap.data()));
      });
      onProducts(items);
    },
    (error) => {
      console.error('[Firestore] Real-time listener error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Seed Firestore with products if the collection is empty
 */
export async function seedProductsIfEmpty(initialProducts: Product[]): Promise<boolean> {
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
  } catch (err) {
    console.warn('[Firestore] Note on seeding:', err);
    return false;
  }
}
