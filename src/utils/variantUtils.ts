import { Product, ProductVariant, StorageOption, ColorOption } from '../types';

export const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'Natural Titanium', hex: '#9E9E9C' },
  { name: 'Desert Titanium', hex: '#CDBCA7' },
  { name: 'Black Titanium', hex: '#2B2B2C' },
  { name: 'White Titanium', hex: '#E4E5E7' },
  { name: 'Midnight', hex: '#1A232E' },
  { name: 'Starlight', hex: '#F0ECE1' },
  { name: 'Titanium Gray', hex: '#7B7D82' },
  { name: 'Titanium Silver Blue', hex: '#A6B8C7' },
  { name: 'Space Black', hex: '#1E2024' },
  { name: 'Silver', hex: '#E2E4E6' },
  { name: 'Deep Blue', hex: '#1F3A5A' },
  { name: 'Gold', hex: '#EBD8C1' },
  { name: 'Emerald Green', hex: '#2A5442' },
  { name: 'Phantom Black', hex: '#111112' },
];

export const STORAGE_PRESETS = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Normalizes or extracts storage options, color options, and variants for a product.
 * Handles both new schema and backwards compatibility with existing legacy products.
 */
export function extractProductVariantConfig(product?: Partial<Product> | null): {
  storageOptions: StorageOption[];
  colorOptions: ColorOption[];
  variants: ProductVariant[];
} {
  const basePrice = product?.basePriceUSD && product.basePriceUSD > 0 ? product.basePriceUSD : 500;

  // 1. Storage Options
  let storageOptions: StorageOption[] = [];
  if (product?.storageOptions && product.storageOptions.length > 0) {
    storageOptions = product.storageOptions.map((opt) => ({
      capacity: opt.capacity,
      priceUSD: Number(opt.priceUSD) || basePrice,
      inStock: opt.inStock !== false,
    }));
  } else if (product?.variants && product.variants.length > 0) {
    // Extract distinct storages from existing variants
    const seenStorage = new Map<string, number>();
    product.variants.forEach((v) => {
      if (v.storage && !seenStorage.has(v.storage)) {
        seenStorage.set(v.storage, v.priceUSD || basePrice);
      }
    });

    if (seenStorage.size > 0) {
      storageOptions = Array.from(seenStorage.entries()).map(([capacity, priceUSD]) => ({
        capacity,
        priceUSD,
        inStock: true,
      }));
    }
  }

  if (storageOptions.length === 0) {
    storageOptions = [
      { capacity: '128GB', priceUSD: basePrice, inStock: true },
      { capacity: '256GB', priceUSD: basePrice + 70, inStock: true },
      { capacity: '512GB', priceUSD: basePrice + 190, inStock: true },
    ];
  }

  // 2. Color Options
  let colorOptions: ColorOption[] = [];
  if (product?.colorOptions && product.colorOptions.length > 0) {
    colorOptions = product.colorOptions.map((c) => ({
      name: c.name,
      hex: c.hex || '#383838',
    }));
  } else if (product?.variants && product.variants.length > 0) {
    // Extract distinct colors from existing variants
    const seenColors = new Map<string, string>();
    product.variants.forEach((v) => {
      if (v.color && !seenColors.has(v.color)) {
        seenColors.set(v.color, v.colorHex || '#383838');
      }
    });

    if (seenColors.size > 0) {
      colorOptions = Array.from(seenColors.entries()).map(([name, hex]) => ({
        name,
        hex,
      }));
    }
  }

  if (colorOptions.length === 0) {
    colorOptions = [
      { name: 'Natural Titanium', hex: '#9E9E9C' },
      { name: 'Black Titanium', hex: '#2B2B2C' },
      { name: 'Desert Titanium', hex: '#CDBCA7' },
    ];
  }

  // 3. Variants
  let variants: ProductVariant[] = [];
  if (product?.variants && product.variants.length > 0) {
    variants = [...product.variants];
  } else {
    variants = generateVariantsMatrix({
      productId: product?.id || 'prod',
      productName: product?.name || 'Product',
      storageOptions,
      colorOptions,
      defaultBasePrice: basePrice,
    });
  }

  return { storageOptions, colorOptions, variants };
}

/**
 * Dynamically builds variant combinations from Storage Options and Color Options.
 * Preserves custom price overrides or stock statuses from existing variants where keys match.
 */
export function generateVariantsMatrix(params: {
  productId: string;
  productName?: string;
  storageOptions: StorageOption[];
  colorOptions: ColorOption[];
  existingVariants?: ProductVariant[];
  defaultBasePrice?: number;
}): ProductVariant[] {
  const {
    productId,
    storageOptions,
    colorOptions,
    existingVariants = [],
    defaultBasePrice = 500,
  } = params;

  // Build a lookup of existing variants by storage-color key
  const existingMap = new Map<string, ProductVariant>();
  existingVariants.forEach((v) => {
    const key = `${(v.storage || '').trim().toLowerCase()}|${(v.color || '').trim().toLowerCase()}`;
    existingMap.set(key, v);
  });

  const matrix: ProductVariant[] = [];

  // If we have both storage and color options
  if (storageOptions.length > 0 && colorOptions.length > 0) {
    storageOptions.forEach((sOpt) => {
      colorOptions.forEach((cOpt) => {
        const key = `${sOpt.capacity.trim().toLowerCase()}|${cOpt.name.trim().toLowerCase()}`;
        const existing = existingMap.get(key);

        const variantId = existing?.id || `${productId}-${slugify(sOpt.capacity)}-${slugify(cOpt.name)}`;
        const priceUSD = existing?.priceUSD ?? sOpt.priceUSD ?? defaultBasePrice;
        const inStock = existing !== undefined ? existing.inStock : (sOpt.inStock !== false);

        matrix.push({
          id: variantId,
          name: `${sOpt.capacity} - ${cOpt.name}`,
          storage: sOpt.capacity,
          color: cOpt.name,
          colorHex: cOpt.hex,
          priceUSD: Number(priceUSD),
          inStock,
        });
      });
    });
    return matrix;
  }

  // If only storage options exist
  if (storageOptions.length > 0) {
    return storageOptions.map((sOpt) => {
      const key = `${sOpt.capacity.trim().toLowerCase()}|`;
      const existing = existingMap.get(key);
      return {
        id: existing?.id || `${productId}-${slugify(sOpt.capacity)}`,
        name: `${sOpt.capacity} Option`,
        storage: sOpt.capacity,
        priceUSD: existing?.priceUSD ?? sOpt.priceUSD ?? defaultBasePrice,
        inStock: existing !== undefined ? existing.inStock : (sOpt.inStock !== false),
      };
    });
  }

  // If only color options exist
  if (colorOptions.length > 0) {
    return colorOptions.map((cOpt) => {
      const key = `|${cOpt.name.trim().toLowerCase()}`;
      const existing = existingMap.get(key);
      return {
        id: existing?.id || `${productId}-${slugify(cOpt.name)}`,
        name: cOpt.name,
        color: cOpt.name,
        colorHex: cOpt.hex,
        priceUSD: existing?.priceUSD ?? defaultBasePrice,
        inStock: existing !== undefined ? existing.inStock : true,
      };
    });
  }

  // Fallback single standard variant
  return [
    {
      id: `${productId}-standard`,
      name: 'Standard Option',
      priceUSD: defaultBasePrice,
      inStock: true,
    },
  ];
}

/**
 * Finds the best matching variant for given storage capacity and color.
 */
export function findBestMatchingVariant(
  variants: ProductVariant[],
  storage?: string,
  color?: string
): ProductVariant | undefined {
  if (!variants || variants.length === 0) return undefined;

  // 1. Exact match for both storage & color
  if (storage && color) {
    const exact = variants.find(
      (v) =>
        v.storage?.trim().toLowerCase() === storage.trim().toLowerCase() &&
        v.color?.trim().toLowerCase() === color.trim().toLowerCase()
    );
    if (exact) return exact;
  }

  // 2. Match storage first
  if (storage) {
    const storageMatch = variants.find(
      (v) => v.storage?.trim().toLowerCase() === storage.trim().toLowerCase()
    );
    if (storageMatch) return storageMatch;
  }

  // 3. Match color
  if (color) {
    const colorMatch = variants.find(
      (v) => v.color?.trim().toLowerCase() === color.trim().toLowerCase()
    );
    if (colorMatch) return colorMatch;
  }

  // 4. Default to first variant
  return variants[0];
}
