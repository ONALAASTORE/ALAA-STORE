import { Product } from '../types';

/**
 * Fallback image placeholder when no images are provided or if an image fails to load.
 */
export const DEFAULT_PRODUCT_IMAGE = 
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80';

/**
 * Extracts and deduplicates all valid image URLs for a product across all schema conventions:
 * - product.image (primary featured image)
 * - product.galleryImages (array of gallery images)
 * - product.image_urls (standard PostgreSQL / Supabase array)
 * - product.additional_images (secondary image list)
 *
 * Guarantees that the primary featured image is the first item in the returned array.
 */
export function getProductImages(product?: Partial<Product> | null): string[] {
  if (!product) return [DEFAULT_PRODUCT_IMAGE];

  const results: string[] = [];
  const seen = new Set<string>();

  const addImage = (rawUrl: unknown) => {
    if (typeof rawUrl === 'string') {
      const trimmed = rawUrl.trim();
      if (trimmed.length > 0 && !seen.has(trimmed)) {
        seen.add(trimmed);
        results.push(trimmed);
      }
    }
  };

  // 1. Primary image takes priority as index 0
  if (product.image) {
    addImage(product.image);
  }

  // 2. imageUrls / image_urls (standard array representation)
  if (Array.isArray(product.imageUrls)) {
    product.imageUrls.forEach(addImage);
  }
  if (Array.isArray(product.image_urls)) {
    product.image_urls.forEach(addImage);
  }

  // 3. galleryImages
  if (Array.isArray(product.galleryImages)) {
    product.galleryImages.forEach(addImage);
  }

  // 4. additional_images
  if (Array.isArray(product.additional_images)) {
    product.additional_images.forEach(addImage);
  }

  // Fallback if empty
  if (results.length === 0) {
    results.push(DEFAULT_PRODUCT_IMAGE);
  }

  return results;
}

/**
 * Normalizes a list of image URLs, ensuring clean strings and removing empty inputs.
 */
export function cleanImageUrls(urls: (string | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const url of urls) {
    if (url && typeof url === 'string') {
      const trimmed = url.trim();
      if (trimmed.length > 0 && !seen.has(trimmed)) {
        seen.add(trimmed);
        cleaned.push(trimmed);
      }
    }
  }

  return cleaned.length > 0 ? cleaned : [DEFAULT_PRODUCT_IMAGE];
}
