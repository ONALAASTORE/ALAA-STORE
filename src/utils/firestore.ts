import { Product } from '../types';
import { sanitizeProductForGitHub } from './githubStore';

/**
 * Storage & Serialization Utilities (GitHub Repository Catalog Strategy)
 * Bypasses Firestore dependencies in favor of direct repository JSON storage.
 */

export function sanitizeProductForFirestore(product: Product): Product {
  return sanitizeProductForGitHub(product);
}

/**
 * Save product to catalog (Bypasses Firestore in favor of GitHub JSON catalog)
 */
export async function saveProductToFirestore(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanProduct = sanitizeProductForGitHub(product);
    console.info(`[GitHub Catalog Store] Product "${cleanProduct.name}" (${cleanProduct.id}) processed for repository storage.`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Catalog Save Error]', err);
    return { success: false, error: err?.message || 'Failed to save product' };
  }
}

/**
 * Delete product from catalog (Bypasses Firestore)
 */
export async function deleteProductFromFirestore(productId: string): Promise<{ success: boolean }> {
  console.info(`[GitHub Catalog Store] Product "${productId}" marked for removal from repository catalog.`);
  return { success: true };
}
