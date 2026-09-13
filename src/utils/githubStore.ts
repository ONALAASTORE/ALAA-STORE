import { Product } from '../types';

export const GITHUB_CATALOG_STORAGE_KEY = 'on_alaa_store_products';
export const GITHUB_CATALOG_PATH = '/data/products.json';

/**
 * Validates and sanitizes product objects for GitHub JSON repository storage
 */
export function sanitizeProductForGitHub(product: Product): Product {
  const images = Array.isArray(product.galleryImages) && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];

  return {
    id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: product.name || 'Untitled Product',
    brand: product.brand || 'Apple',
    category: product.category || 'smartphones',
    subcategory: product.subcategory || '',
    description: product.description || '',
    features: Array.isArray(product.features) ? product.features : [],
    specs: product.specs && typeof product.specs === 'object' ? { ...product.specs } : {},
    image: product.image || images[0] || '',
    galleryImages: images,
    imageUrls: images,
    image_urls: images,
    basePriceUSD: typeof product.basePriceUSD === 'number' ? product.basePriceUSD : 0,
    originalPriceUSD: typeof product.originalPriceUSD === 'number' ? product.originalPriceUSD : undefined,
    promotionalPriceUSD: typeof product.promotionalPriceUSD === 'number' ? product.promotionalPriceUSD : undefined,
    salePriceUSD: typeof product.salePriceUSD === 'number' ? product.salePriceUSD : undefined,
    discountPercentage: typeof product.discountPercentage === 'number' ? product.discountPercentage : undefined,
    storageOptions: Array.isArray(product.storageOptions) ? product.storageOptions : undefined,
    colorOptions: Array.isArray(product.colorOptions) ? product.colorOptions : undefined,
    variants: Array.isArray(product.variants) && product.variants.length > 0 
      ? product.variants 
      : [{ id: `${product.id}-default`, name: 'Standard Edition', priceUSD: product.basePriceUSD, inStock: true }],
    rating: typeof product.rating === 'number' ? product.rating : 5.0,
    reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 1,
    condition: product.condition || 'Brand New (Sealed)',
    warranty: product.warranty || '1 Year Official Lebanese Agency Warranty',
    inStock: product.inStock !== false,
    stockCount: typeof product.stockCount === 'number' ? product.stockCount : 10,
    isFeatured: product.isFeatured ?? true,
    isHotDeal: Boolean(product.isHotDeal),
    isNewArrival: Boolean(product.isNewArrival),
    tags: Array.isArray(product.tags) && product.tags.length > 0 ? product.tags : [product.brand, product.category],
    freeDelivery: product.freeDelivery !== false,
    has3DModel: Boolean(product.has3DModel)
  };
}

/**
 * Fetch product catalog dynamically from GitHub repository static file or custom GitHub Raw URL
 */
export async function fetchGitHubCatalog(customUrl?: string): Promise<{ success: boolean; products: Product[]; error?: string }> {
  try {
    const url = customUrl || `${GITHUB_CATALOG_PATH}?v=${Date.now()}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load ${url}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Catalog JSON must contain an array of products');
    }

    const sanitizedProducts = data.map(sanitizeProductForGitHub);
    return { success: true, products: sanitizedProducts };
  } catch (err: any) {
    console.warn('[GitHub Catalog Fetch Warning]', err);
    return { success: false, products: [], error: err?.message || 'Failed to fetch catalog' };
  }
}

/**
 * Save product to GitHub repository catalog (local state + localStorage cache + JSON format)
 */
export async function saveProductToGitHubCatalog(
  product: Product,
  currentProducts: Product[]
): Promise<{ success: boolean; updatedCatalog: Product[]; error?: string }> {
  try {
    const cleanProduct = sanitizeProductForGitHub(product);
    const existingIndex = currentProducts.findIndex((p) => p.id === cleanProduct.id);

    let updatedList: Product[];
    if (existingIndex >= 0) {
      updatedList = currentProducts.map((p) => (p.id === cleanProduct.id ? cleanProduct : p));
    } else {
      updatedList = [cleanProduct, ...currentProducts];
    }

    // Persist to local storage cache
    localStorage.setItem(GITHUB_CATALOG_STORAGE_KEY, JSON.stringify(updatedList));

    return { success: true, updatedCatalog: updatedList };
  } catch (err: any) {
    console.warn('[GitHub Catalog Save Error]', err);
    return { success: false, updatedCatalog: currentProducts, error: err?.message };
  }
}

/**
 * Delete product from GitHub catalog store
 */
export async function deleteProductFromGitHubCatalog(
  productId: string,
  currentProducts: Product[]
): Promise<{ success: boolean; updatedCatalog: Product[] }> {
  try {
    const updated = currentProducts.filter((p) => p.id !== productId);
    localStorage.setItem(GITHUB_CATALOG_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, updatedCatalog: updated };
  } catch (err) {
    console.warn('[GitHub Catalog Delete Error]', err);
    return { success: false, updatedCatalog: currentProducts };
  }
}

/**
 * Triggers a download of the updated products.json file to commit to the GitHub repo
 */
export function downloadCatalogJson(products: Product[], filename = 'products.json'): void {
  const sanitized = products.map(sanitizeProductForGitHub);
  const jsonString = JSON.stringify(sanitized, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse and validate bulk uploaded JSON or CSV text into Product[]
 */
export function parseBulkProductData(rawText: string, format: 'json' | 'csv' = 'json'): {
  products: Product[];
  errors: string[];
} {
  const errors: string[] = [];
  const products: Product[] = [];

  if (format === 'json') {
    try {
      const parsed = JSON.parse(rawText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      items.forEach((item, index) => {
        if (!item.name || typeof item.name !== 'string') {
          errors.push(`Item #${index + 1}: Missing product name`);
          return;
        }
        if (typeof item.basePriceUSD !== 'number' && typeof item.priceUSD !== 'number') {
          errors.push(`Item #${index + 1} ("${item.name}"): Missing valid price`);
          return;
        }

        const price = typeof item.basePriceUSD === 'number' ? item.basePriceUSD : Number(item.priceUSD) || 100;
        const brand = item.brand || 'Apple';
        const category = item.category || 'smartphones';
        const id = item.id || `${brand.toLowerCase()}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        products.push(
          sanitizeProductForGitHub({
            ...item,
            id,
            brand,
            category,
            basePriceUSD: price,
            variants: item.variants || [{ id: `${id}-std`, name: 'Standard Edition', priceUSD: price, inStock: true }]
          })
        );
      });
    } catch (e: any) {
      errors.push(`JSON Syntax Error: ${e.message}`);
    }
  } else if (format === 'csv') {
    // Simple robust CSV parser for name, brand, category, price, description, image
    const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
      errors.push('CSV contains no data rows');
      return { products, errors };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
      if (row.length < 2) continue;

      const record: Record<string, string> = {};
      headers.forEach((header, idx) => {
        record[header] = row[idx] || '';
      });

      const name = record.name || record.title || `Product ${i}`;
      const price = parseFloat(record.price || record.basepriceusd || '100') || 100;
      const brand = record.brand || 'Apple';
      const category = record.category || 'smartphones';
      const id = record.id || `${brand.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;

      products.push(
        sanitizeProductForGitHub({
          id,
          name,
          brand,
          category,
          basePriceUSD: price,
          description: record.description || `${name} official retail model for the Lebanese market.`,
          features: record.features ? record.features.split(';').map(f => f.trim()) : ['Official Agency Warranty', 'Brand New Sealed'],
          specs: { Brand: brand, Category: category },
          image: record.image || record.imageurl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
          galleryImages: [record.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'],
          variants: [{ id: `${id}-var1`, name: 'Standard Edition', priceUSD: price, inStock: true }],
          rating: 4.9,
          reviewCount: 12,
          condition: 'Brand New (Sealed)',
          warranty: '1 Year Official Lebanese Agency Warranty',
          inStock: true
        })
      );
    }
  }

  return { products, errors };
}

/**
 * Generate Git CLI commit snippet for terminal
 */
export function getGitCommitInstructions(productCount: number): string {
  return `# Save the downloaded products.json into your repo:
cp ~/Downloads/products.json ./public/data/products.json

# Commit and push to your GitHub repository:
git add public/data/products.json
git commit -m "feat(catalog): update product database (${productCount} items)"
git push origin main`;
}
