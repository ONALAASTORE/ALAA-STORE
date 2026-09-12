import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Award, 
  Headphones, 
  Smartphone, 
  Gamepad2, 
  ChevronRight
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { ProductCard } from './ProductCard';

interface ProductFeedTabsProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, variant: ProductVariant) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  comparedProducts: Product[];
  onToggleCompare: (p: Product) => void;
  whatsappNumber?: string;
  theme?: 'dark' | 'light';
  onViewCategory?: (catId: string) => void;
}

export const ProductFeedTabs: React.FC<ProductFeedTabsProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  comparedProducts,
  onToggleCompare,
  whatsappNumber,
  theme = 'dark',
  onViewCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'bestsellers' | 'audio' | 'smartphones' | 'gaming'>('trending');

  // Filter products by tab
  const feedProducts = useMemo(() => {
    switch (activeTab) {
      case 'trending':
        // Top rated / featured products
        return products.filter(p => p.isFeatured || (p.rating && p.rating >= 4.7)).slice(0, 8);
      case 'bestsellers':
        // High review count / popular devices
        return [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 8);
      case 'audio':
        return products.filter(p => p.category === 'audio' || p.category === 'cables').slice(0, 8);
      case 'smartphones':
        return products.filter(p => p.category === 'smartphones' || p.category === 'tablets').slice(0, 8);
      case 'gaming':
        return products.filter(p => p.category === 'gaming' || p.category === 'racing-wheel').slice(0, 8);
      default:
        return products.slice(0, 8);
    }
  }, [products, activeTab]);

  const tabs = [
    { id: 'trending' as const, label: 'Trending Gadgets', icon: Flame, badge: 'HOT' },
    { id: 'bestsellers' as const, label: 'Best Sellers', icon: Award, badge: 'POPULAR' },
    { id: 'smartphones' as const, label: 'Smartphones & Tablets', icon: Smartphone, badge: 'FLAGSHIP' },
    { id: 'audio' as const, label: 'Audio & ANC', icon: Headphones, badge: 'PRO SOUND' },
    { id: 'gaming' as const, label: 'Gaming & Gear', icon: Gamepad2, badge: 'NEXT-GEN' },
  ];

  return (
    <div id="product-feed-tabs-section" className="w-full space-y-4">
      {/* Tab Navigation Header (Ishtari Style Feed Bar) */}
      <div className="bg-[#141418] border border-zinc-800 rounded-2xl p-2.5 sm:p-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Scrollable Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map(tab => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`feed-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#1C1C22] text-zinc-400 hover:text-white hover:bg-[#22222A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Category Link */}
        {onViewCategory && (
          <button
            onClick={() => {
              if (activeTab === 'smartphones') onViewCategory('smartphones');
              else if (activeTab === 'audio') onViewCategory('audio');
              else if (activeTab === 'gaming') onViewCategory('gaming');
              else onViewCategory('all');
            }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0 px-2 py-1 transition cursor-pointer"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid of Feed Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {feedProducts.map(product => (
          <ProductCard
            key={`feed-${product.id}`}
            product={product}
            currency={currency}
            theme={theme}
            isWishlisted={wishlistIds.includes(product.id)}
            isCompared={comparedProducts.some(p => p.id === product.id)}
            onToggleWishlist={onToggleWishlist}
            onToggleCompare={onToggleCompare}
            onAddToCart={onAddToCart}
            onQuickView={onSelectProduct}
            whatsappNumber={whatsappNumber}
          />
        ))}
      </div>
    </div>
  );
};
