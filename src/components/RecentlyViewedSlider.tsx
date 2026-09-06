import React, { useRef } from 'react';
import { History, ChevronLeft, ChevronRight, ShoppingCart, Eye, Trash2, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';

interface RecentlyViewedSliderProps {
  products: Product[];
  currency: Currency;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onClear: () => void;
}

export const RecentlyViewedSlider: React.FC<RecentlyViewedSliderProps> = ({
  products,
  currency,
  onProductClick,
  onAddToCart,
  onClear,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) {
    return null;
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section 
      id="recently-viewed-section" 
      aria-labelledby="recently-viewed-heading"
      className="w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden"
    >
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 
                id="recently-viewed-heading" 
                className="text-base sm:text-lg font-extrabold text-slate-900 font-display tracking-tight"
              >
                Recently Viewed
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Products you looked at in this session (last {products.length})
            </p>
          </div>
        </div>

        {/* Action buttons & Slider Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="clear-recently-viewed-btn"
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition flex items-center gap-1 cursor-pointer mr-1"
            title="Clear recently viewed history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            type="button"
            id="recently-viewed-prev-btn"
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs hover:border-slate-300 cursor-pointer disabled:opacity-40"
            aria-label="Scroll recently viewed left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="recently-viewed-next-btn"
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs hover:border-slate-300 cursor-pointer disabled:opacity-40"
            aria-label="Scroll recently viewed right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={scrollContainerRef}
        id="recently-viewed-slider"
        data-testid="recently-viewed-slider"
        className="flex gap-4 overflow-x-auto pb-2 pt-1 px-1 scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const images = getProductImages(product);
          const primaryImage = images[0] || DEFAULT_PRODUCT_IMAGE;
          const defaultVariant = product.variants?.[0];
          const displayPrice = defaultVariant?.priceUSD ?? product.basePriceUSD;
          const isOutOfStock = !product.inStock || (product.stockCount !== undefined && product.stockCount <= 0);

          return (
            <div
              key={product.id}
              id={`recently-viewed-card-${product.id}`}
              onClick={() => onProductClick(product)}
              className="group w-[210px] sm:w-[230px] shrink-0 bg-slate-50/60 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:shadow-md relative"
            >
              {/* Product Thumbnail & Badge */}
              <div className="relative aspect-square w-full rounded-xl bg-white border border-slate-100 overflow-hidden mb-2.5 flex items-center justify-center p-3">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Stock Tag */}
                {isOutOfStock ? (
                  <span className="absolute top-2 left-2 bg-rose-600/95 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Sold Out
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    In Stock
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1 mb-2.5 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block truncate">
                  {product.brand}
                </span>
                <h3 
                  className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight"
                  title={product.name}
                >
                  {product.name}
                </h3>
              </div>

              {/* Price & Action Row */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1.5">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-display block">
                    {formatPrice(displayPrice, currency)}
                  </span>
                  {currency === 'USD' && (
                    <span className="text-[9px] text-slate-400 font-medium block">
                      ≈ {formatPrice(displayPrice, 'LBP')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                    title="Quick View"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-blue-600 text-white cursor-pointer shadow-2xs'
                    }`}
                    title={isOutOfStock ? 'Sold out' : 'Add to cart'}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
