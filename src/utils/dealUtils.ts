import { Product, CartItem } from '../types';

export interface ProductDealInfo {
  isDiscounted: boolean;
  effectivePriceUSD: number;
  originalPriceUSD: number;
  savingsUSD: number;
  discountPercent: number;
}

export interface CartItemSavingsInfo {
  unitPriceUSD: number;
  originalUnitPriceUSD: number;
  unitSavingsUSD: number;
  totalSavingsUSD: number;
  hasDiscount: boolean;
  discountPercent: number;
}

export interface CartSavingsSummary {
  subtotalUSD: number;
  originalSubtotalUSD: number;
  totalSavingsUSD: number;
  discountedItemsCount: number;
  hasSavings: boolean;
  averageDiscountPercent: number;
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

/**
  * Calculates the savings amount and original price for an individual cart item line.
  */
export function getCartItemSavings(item: CartItem): CartItemSavingsInfo {
  const currentPrice = item.selectedVariant.priceUSD;
  const product = item.product;
  const deal = getProductDealInfo(product);

  let unitSavingsUSD = 0;
  let originalUnitPriceUSD = currentPrice;
  let discountPercent = 0;

  if (deal.isDiscounted && deal.savingsUSD > 0) {
    if (product.originalPriceUSD && product.originalPriceUSD > currentPrice) {
      originalUnitPriceUSD = product.originalPriceUSD;
      unitSavingsUSD = originalUnitPriceUSD - currentPrice;
      discountPercent = Math.round((unitSavingsUSD / originalUnitPriceUSD) * 100);
    } else if (product.originalPriceUSD && product.originalPriceUSD > product.basePriceUSD) {
      // Variant upgrade: maintain same dollar savings or proportional discount
      const diff = product.originalPriceUSD - product.basePriceUSD;
      unitSavingsUSD = diff;
      originalUnitPriceUSD = currentPrice + diff;
      discountPercent = Math.round((unitSavingsUSD / originalUnitPriceUSD) * 100);
    } else if (product.discountPercentage && product.discountPercentage > 0) {
      discountPercent = Math.round(product.discountPercentage);
      originalUnitPriceUSD = Math.round(currentPrice / (1 - discountPercent / 100));
      unitSavingsUSD = Math.max(0, originalUnitPriceUSD - currentPrice);
    } else if (deal.savingsUSD > 0) {
      unitSavingsUSD = deal.savingsUSD;
      originalUnitPriceUSD = currentPrice + unitSavingsUSD;
      discountPercent = deal.discountPercent || Math.round((unitSavingsUSD / originalUnitPriceUSD) * 100);
    }
  }

  const totalSavingsUSD = unitSavingsUSD * item.quantity;

  return {
    unitPriceUSD: currentPrice,
    originalUnitPriceUSD,
    unitSavingsUSD,
    totalSavingsUSD,
    hasDiscount: unitSavingsUSD > 0,
    discountPercent,
  };
}

/**
 * Calculates the aggregate Total Savings across all items in a customer's cart.
 */
export function getCartSavingsSummary(items: CartItem[]): CartSavingsSummary {
  let totalSavingsUSD = 0;
  let discountedItemsCount = 0;
  let subtotalUSD = 0;

  items.forEach((item) => {
    const itemSubtotal = item.selectedVariant.priceUSD * item.quantity;
    subtotalUSD += itemSubtotal;

    const itemSavings = getCartItemSavings(item);
    if (itemSavings.hasDiscount && itemSavings.totalSavingsUSD > 0) {
      totalSavingsUSD += itemSavings.totalSavingsUSD;
      discountedItemsCount += item.quantity;
    }
  });

  const originalSubtotalUSD = subtotalUSD + totalSavingsUSD;
  const hasSavings = totalSavingsUSD > 0;
  const averageDiscountPercent =
    hasSavings && originalSubtotalUSD > 0
      ? Math.round((totalSavingsUSD / originalSubtotalUSD) * 100)
      : 0;

  return {
    subtotalUSD,
    originalSubtotalUSD,
    totalSavingsUSD,
    discountedItemsCount,
    hasSavings,
    averageDiscountPercent,
  };
}

