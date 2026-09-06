export type Currency = 'USD' | 'LBP';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "256GB - Desert Titanium" or "128GB - Midnight"
  storage?: string;
  color?: string;
  colorHex?: string;
  priceUSD: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  image: string; // Primary featured image
  galleryImages: string[]; // List of all gallery image URLs
  imageUrls?: string[]; // Array of product image URLs
  image_urls?: string[]; // Supabase / PostgreSQL array representation of all product images
  additional_images?: string[]; // Supplementary gallery images excluding primary
  basePriceUSD: number;
  originalPriceUSD?: number; // For discount display
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  condition: 'Brand New (Sealed)' | 'Open Box' | 'Certified Pre-Owned';
  warranty: string; // e.g., "1 Year Official Apple Warranty"
  inStock: boolean;
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
  freeDelivery?: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPriceUSD: number;
  maxPriceUSD: number;
  condition: string;
  onlyInStock: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface TradeInEstimation {
  brand: string;
  model: string;
  storage: string;
  condition: 'flawless' | 'good' | 'fair' | 'broken';
  batteryHealth: string;
  estimatedValueUSD: number;
}

export interface StoreSettings {
  topBannerText: string;
  isTopBannerActive: boolean;
  marketingVideoUrl: string;
  marketingVideoTitle: string;
  exchangeRateLBP: number;
  whatsappNumber: string;
  supportEmail: string;
}
