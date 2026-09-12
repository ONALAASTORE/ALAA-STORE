export type Currency = 'USD' | 'LBP';

export interface StorageOption {
  capacity: string; // e.g. "128GB", "256GB", "512GB", "1TB"
  priceUSD: number; // specific price for this storage tier
  inStock?: boolean;
}

export interface ColorOption {
  name: string; // e.g. "Desert Titanium", "Midnight", "Silver"
  hex?: string; // Hex color code for swatch preview e.g. "#CDBCA7"
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "256GB - Desert Titanium" or "128GB - Midnight"
  storage?: string;
  color?: string;
  colorHex?: string;
  priceUSD: number;
  inStock: boolean;
  stockCount?: number;
  sku?: string;
}

export type ProductBrand =
  | 'Apple'
  | 'Samsung'
  | 'Xiaomi'
  | 'Sony'
  | 'Anker'
  | 'JBL'
  | 'Asus'
  | 'ASUS'
  | 'HyperX'
  | 'Razer'
  | 'Logitech'
  | 'Dell'
  | 'Lenovo'
  | 'Huawei'
  | 'Tecno'
  | 'Infinix'
  | 'UGREEN'
  | 'Braun'
  | 'Pitaka'
  | 'DeepCool'
  | 'ACEFAST'
  | 'Yesido'
  | 'Wiwu'
  | 'Whoop'
  | 'Marshall'
  | 'DJI'
  | 'Google'
  | 'Honor'
  | 'Nintendo'
  | 'Hoco'
  | 'Green Lion'
  | 'Porodo'
  | string;

export type ProductCategory =
  | 'all'
  | 'smartphones'
  | 'laptops'
  | 'tablets'
  | 'audio'
  | 'wearables'
  | 'gaming'
  | 'racing-wheel'
  | 'racing-wheels'
  | 'Racing Wheel'
  | 'power'
  | 'smart-home'
  | 'bags-cases'
  | 'cables'
  | 'cameras-projectors'
  | 'car-accessories'
  | 'flash-card-memory'
  | 'smartwatches-accessories'
  | 'personal-health-care'
  | 'home-lighting'
  | 'tools'
  | 'kitchen-tools'
  | 'microphones'
  | 'stands-holders'
  | string;

export interface Product {
  id: string;
  name: string;
  brand: ProductBrand;
  category: ProductCategory;
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
  promotionalPriceUSD?: number; // Promotional price in USD
  promotionalPrice?: number; // Alternative alias for promotional price
  salePriceUSD?: number; // Sale price in USD
  discountPercentage?: number; // Explicit discount percentage
  onSale?: boolean; // Flag indicating product is on sale
  storageOptions?: StorageOption[]; // Structured storage memory tiers with tier-specific prices
  colorOptions?: ColorOption[]; // Available device colors with swatches
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  condition: 'Brand New (Sealed)' | 'Open Box' | 'Certified Pre-Owned';
  warranty: string; // e.g., "1 Year Official Apple Warranty"
  inStock: boolean;
  stockCount?: number;
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isNewArrival?: boolean;
  tags?: string[];
  freeDelivery?: boolean;
  has3DModel?: boolean;
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
  isMarketingVideoActive: boolean;
  exchangeRateLBP: number;
  whatsappNumber: string;
  supportEmail: string;
  adminProfilePicture?: string;
  adminName?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  city?: string;
  verifiedBuyer?: boolean;
  photos?: string[];
  helpfulCount?: number;
  variantInfo?: string;
}
