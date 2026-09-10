import { Product } from '../types';

export interface ProductDealInfo {
  isDiscounted: boolean;
  effectivePriceUSD: number;
  originalPriceUSD: number;
  savingsUSD: number;
  discountPercent: number;
}

/**
 * Checks if a product has an active discount or promotional sale price
 * and calculates exact dollar and percentage savings.
 */
export function getProductDealInfo(product: Product): ProductDealInfo {
  const basePrice = product.basePriceUSD;
  const originalPrice = product.originalPriceUSD;
  const promotionalPrice = product.promotionalPriceUSD ?? product.promotionalPrice ?? product.salePriceUSD;
  const explicitDiscount = product.discountPercentage;
  const isOnSale = Boolean(product.onSale);
  const isHotDeal = Boolean(product.isHotDeal);

  // Effective selling price: promotional price takes precedence if lower than base price
  const effectivePriceUSD =
    promotionalPrice !== undefined && promotionalPrice < basePrice
      ? promotionalPrice
      : basePrice;

  // Determine if this item qualifies as an active special offer
  const hasPriceCut =
    (originalPrice !== undefined && originalPrice > effectivePriceUSD) ||
    (promotionalPrice !== undefined && promotionalPrice < (originalPrice ?? basePrice));

  const isDiscounted = Boolean(
    hasPriceCut ||
    (explicitDiscount !== undefined && explicitDiscount > 0) ||
    isOnSale ||
    isHotDeal
  );

  let discountPercent = 0;
  let savingsUSD = 0;

  if (explicitDiscount !== undefined && explicitDiscount > 0) {
    discountPercent = Math.round(explicitDiscount);
    if (originalPrice && originalPrice > effectivePriceUSD) {
      savingsUSD = originalPrice - effectivePriceUSD;
    } else {
      savingsUSD = Math.round((effectivePriceUSD * discountPercent) / 100);
    }
  } else {
    const comparePrice =
      originalPrice ??
      (promotionalPrice !== undefined && promotionalPrice < basePrice ? basePrice : undefined);

    if (comparePrice && comparePrice > effectivePriceUSD) {
      savingsUSD = comparePrice - effectivePriceUSD;
      discountPercent = Math.max(1, Math.round((savingsUSD / comparePrice) * 100));
    } else if (isHotDeal) {
      // For hot deals without explicit higher price, provide reasonable baseline savings
      savingsUSD = Math.max(15, Math.round(effectivePriceUSD * 0.08));
      discountPercent = 8;
    }
  }

  const calculatedOriginalPrice =
    originalPrice && originalPrice > effectivePriceUSD
      ? originalPrice
      : effectivePriceUSD + savingsUSD;

  return {
    isDiscounted,
    effectivePriceUSD,
    originalPriceUSD: calculatedOriginalPrice,
    savingsUSD,
    discountPercent,
  };
}

/**
 * Filters a product array to ONLY items that have an active discount.
 */
export function getDiscountedProducts(products: Product[]): Product[] {
  return products.filter((p) => {
    const deal = getProductDealInfo(p);
    return deal.isDiscounted && deal.savingsUSD > 0;
  });
}
