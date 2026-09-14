import { Product } from '../types';
import { safeSaveProducts, PRODUCTS_STORAGE_KEY } from './productStorage';

export const GITHUB_CATALOG_STORAGE_KEY = PRODUCTS_STORAGE_KEY;
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

    // Persist to quota-safe local storage & IndexedDB cache
    safeSaveProducts(updatedList);

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
    safeSaveProducts(updated);
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

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  validatedProduct?: Product;
  jsonStructure?: string;
}

export type ProductInputData = Omit<Partial<Product>, 'basePriceUSD' | 'originalPriceUSD'> & {
  basePriceUSD?: number | string;
  originalPriceUSD?: number | string;
  priceUSD?: number | string;
  specsInput?: string;
  featuresInput?: string;
  galleryImagesInput?: string;
};

/**
 * Validates a single product data payload against the official Product schema
 * and generates the formatted JSON structure if compliant.
 */
export function validateProductAgainstSchema(
  rawInput: ProductInputData,
  existingProducts: Product[] = []
): SchemaValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // 1. Name validation
  const name = (rawInput.name || '').trim();
  if (!name) {
    errors.push({ field: 'name', message: 'Product name is required (string).' });
  } else if (name.length < 3) {
    errors.push({ field: 'name', message: 'Product name must be at least 3 characters.' });
  }

  // 2. Brand validation
  const brand = (rawInput.brand || '').trim();
  if (!brand) {
    errors.push({ field: 'brand', message: 'Brand is required (e.g. Apple, Samsung, Sony).' });
  }

  // 3. Category validation
  const category = (rawInput.category || '').trim();
  if (!category || category === 'all') {
    errors.push({ field: 'category', message: 'Please select a specific category taxonomy.' });
  }

  // 4. Base Price (USD) validation
  const rawPrice = rawInput.basePriceUSD !== undefined ? rawInput.basePriceUSD : rawInput.priceUSD;
  const numPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);
  if (rawPrice === undefined || rawPrice === null || rawPrice === '' || isNaN(numPrice)) {
    errors.push({ field: 'basePriceUSD', message: 'Base price USD must be a valid number.' });
  } else if (numPrice <= 0) {
    errors.push({ field: 'basePriceUSD', message: 'Base price USD must be greater than $0.00.' });
  }

  // 5. Original / MSRP Price validation (optional)
  let numOriginalPrice: number | undefined;
  if (rawInput.originalPriceUSD !== undefined && rawInput.originalPriceUSD !== null && (rawInput.originalPriceUSD as any) !== '') {
    numOriginalPrice = typeof rawInput.originalPriceUSD === 'string' ? parseFloat(rawInput.originalPriceUSD) : Number(rawInput.originalPriceUSD);
    if (isNaN(numOriginalPrice) || numOriginalPrice <= 0) {
      errors.push({ field: 'originalPriceUSD', message: 'Original price must be a positive number if specified.' });
    } else if (numOriginalPrice < numPrice) {
      warnings.push({ field: 'originalPriceUSD', message: `Original price is lower than base price ($${numOriginalPrice} < $${numPrice}). Discount badge will not display.` });
    }
  }

  // 6. ID validation
  let id = (rawInput.id || '').trim().toLowerCase();
  if (!id && name && brand) {
    id = `${brand.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  }
  if (!id) {
    errors.push({ field: 'id', message: 'Product ID is required or must be derivable from brand and name.' });
  } else {
    // Check ID collisions
    const duplicate = existingProducts.find(p => p.id === id);
    if (duplicate) {
      warnings.push({ field: 'id', message: `ID "${id}" matches existing product "${duplicate.name}". Submitting will update this record.` });
    }
  }

  // 7. Image validation
  const image = (rawInput.image || '').trim();
  if (!image) {
    errors.push({ field: 'image', message: 'Primary image URL is required.' });
  } else if (!image.startsWith('http://') && !image.startsWith('https://') && !image.startsWith('/') && !image.startsWith('data:image/')) {
    errors.push({ field: 'image', message: 'Image must be an absolute URL (https://...) or local path (/images/...).' });
  }

  // 8. Description check
  const description = (rawInput.description || '').trim();
  if (!description) {
    warnings.push({ field: 'description', message: 'Description is currently empty; adding one enhances customer engagement.' });
  }

  // 9. Gallery images
  let galleryImages: string[] = [];
  if (Array.isArray(rawInput.galleryImages) && rawInput.galleryImages.length > 0) {
    galleryImages = rawInput.galleryImages;
  } else if (rawInput.galleryImagesInput) {
    galleryImages = rawInput.galleryImagesInput
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  if (image && !galleryImages.includes(image)) {
    galleryImages = [image, ...galleryImages];
  }

  // 10. Features list
  let features: string[] = [];
  if (Array.isArray(rawInput.features)) {
    features = rawInput.features;
  } else if (rawInput.featuresInput) {
    features = rawInput.featuresInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  if (features.length === 0) {
    features = ['Official Lebanese Agency Warranty', 'Brand New Sealed'];
  }

  // 11. Specs object
  let specs: Record<string, string> = {};
  if (rawInput.specs && typeof rawInput.specs === 'object') {
    specs = { ...rawInput.specs };
  } else if (rawInput.specsInput) {
    try {
      if (rawInput.specsInput.trim().startsWith('{')) {
        specs = JSON.parse(rawInput.specsInput);
      } else {
        rawInput.specsInput.split('\n').forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            const k = line.slice(0, colonIdx).trim();
            const v = line.slice(colonIdx + 1).trim();
            if (k && v) specs[k] = v;
          }
        });
      }
    } catch {
      warnings.push({ field: 'specs', message: 'Could not parse specs text; using standard brand specs.' });
    }
  }
  if (Object.keys(specs).length === 0) {
    specs = { Brand: brand, Category: category };
  }

  const isValid = errors.length === 0;

  let validatedProduct: Product | undefined;
  let jsonStructure: string | undefined;

  if (isValid) {
    validatedProduct = sanitizeProductForGitHub({
      id,
      name,
      brand,
      category,
      subcategory: rawInput.subcategory || '',
      description: description || `${name} official retail model for the Lebanese market.`,
      features,
      specs,
      image,
      galleryImages,
      basePriceUSD: numPrice,
      originalPriceUSD: numOriginalPrice,
      promotionalPriceUSD: numOriginalPrice && numOriginalPrice > numPrice ? numPrice : undefined,
      variants: Array.isArray(rawInput.variants) && rawInput.variants.length > 0
        ? rawInput.variants
        : [{ id: `${id}-std`, name: 'Standard Edition', priceUSD: numPrice, inStock: rawInput.inStock !== false }],
      rating: typeof rawInput.rating === 'number' ? rawInput.rating : 5.0,
      reviewCount: typeof rawInput.reviewCount === 'number' ? rawInput.reviewCount : 8,
      condition: rawInput.condition || 'Brand New (Sealed)',
      warranty: rawInput.warranty || '1 Year Official Lebanese Agency Warranty',
      inStock: rawInput.inStock !== false,
      stockCount: typeof rawInput.stockCount === 'number' ? rawInput.stockCount : 10,
      isFeatured: rawInput.isFeatured ?? true,
      isHotDeal: Boolean(rawInput.isHotDeal),
      isNewArrival: Boolean(rawInput.isNewArrival),
      tags: Array.isArray(rawInput.tags) && rawInput.tags.length > 0 ? rawInput.tags : [brand, category],
      freeDelivery: rawInput.freeDelivery !== false
    });

    jsonStructure = JSON.stringify(validatedProduct, null, 2);
  }

  return {
    isValid,
    errors,
    warnings,
    validatedProduct,
    jsonStructure
  };
}

/**
 * Runs a real-time schema audit on the currently loaded catalog
 */
export function auditCatalogSchemaIntegrity(products: Product[]): {
  total: number;
  validCount: number;
  invalidCount: number;
  categoryBreakdown: Record<string, number>;
  brandBreakdown: Record<string, number>;
  inStockCount: number;
  outOfStockCount: number;
  estimatedPayloadKB: number;
  issues: { id: string; name: string; error: string }[];
} {
  let validCount = 0;
  let invalidCount = 0;
  const issues: { id: string; name: string; error: string }[] = [];
  const categoryBreakdown: Record<string, number> = {};
  const brandBreakdown: Record<string, number> = {};
  let inStockCount = 0;
  let outOfStockCount = 0;

  products.forEach(p => {
    if (p.inStock) inStockCount++;
    else outOfStockCount++;

    const cat = p.category || 'uncategorized';
    const br = p.brand || 'unknown';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    brandBreakdown[br] = (brandBreakdown[br] || 0) + 1;

    const res = validateProductAgainstSchema(p, []);
    if (res.isValid) {
      validCount++;
    } else {
      invalidCount++;
      issues.push({
        id: p.id,
        name: p.name,
        error: res.errors.map(e => e.message).join(', ')
      });
    }
  });

  const jsonStr = JSON.stringify(products);
  const estimatedPayloadKB = Math.round((new Blob([jsonStr]).size / 1024) * 10) / 10;

  return {
    total: products.length,
    validCount,
    invalidCount,
    categoryBreakdown,
    brandBreakdown,
    inStockCount,
    outOfStockCount,
    estimatedPayloadKB,
    issues
  };
}
