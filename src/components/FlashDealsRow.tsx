import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  ChevronRight, 
  ShoppingCart, 
  MessageCircle
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';
import { buildWhatsAppLink } from '../utils/phone';

interface FlashDealsRowProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  whatsappNumber?: string;
  onViewAllOffers?: () => void;
  theme?: 'dark' | 'light';
}

export const FlashDealsRow: React.FC<FlashDealsRowProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  whatsappNumber = '+961 71 135 241',
  onViewAllOffers,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  // Live countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter products that have discounts or promotional prices
  const flashProducts = products.filter(p => {
    const promo = p.promotionalPriceUSD ?? p.salePriceUSD ?? p.promotionalPrice;
    return (promo && promo < p.basePriceUSD) || (p.discountPercentage && p.discountPercentage > 0) || p.onSale;
  }).slice(0, 6);

  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-deals-section" className="w-full space-y-3">
      {/* Flash Deals Header Bar with Live Countdown */}
      <div className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs transition-colors duration-200 ${
        isDark
          ? 'bg-gradient-to-r from-blue-950/40 via-[#141418] to-[#121214] border-zinc-800'
          : 'bg-gradient-to-r from-blue-50/70 via-white to-sky-50/50 border-blue-200/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shadow-md shadow-[#0066FF]/30">
            <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base font-black uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                ⚡ FLASH DEALS
              </span>
              <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Limited Quantity
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Exclusive discount drops on agency guaranteed electronics in Lebanon
            </p>
          </div>
        </div>

        {/* Countdown Timer Blocks (Ishtari Style Flash Ticker) */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs border ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200 shadow-2xs'
          }`}>
            <Clock className="w-3.5 h-3.5 text-[#0066FF] mr-1" />
            <span className={`text-[10px] uppercase font-bold mr-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              ENDS IN
            </span>
            <span className="bg-[#0066FF] text-white font-bold px-1.5 py-0.5 rounded text-xs min-w-[24px] text-center shadow-xs">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[#0066FF] font-bold">:</span>
            <span className="bg-[#0066FF] text-white font-bold px-1.5 py-0.5 rounded text-xs min-w-[24px] text-center shadow-xs">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[#0066FF] font-bold">:</span>
            <span className="bg-[#0066FF] text-white font-bold px-1.5 py-0.5 rounded text-xs min-w-[24px] text-center shadow-xs">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          {onViewAllOffers && (
            <button
              onClick={onViewAllOffers}
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 transition shrink-0 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Carousel / Grid of Flash Deal Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashProducts.map((product) => {
          const promo = product.promotionalPriceUSD ?? product.salePriceUSD ?? product.promotionalPrice ?? product.basePriceUSD;
          const original = product.originalPriceUSD || product.basePriceUSD;
          const discountPct = Math.round(((original - promo) / original) * 100);
          const images = getProductImages(product);
          const img = images[0] || DEFAULT_PRODUCT_IMAGE;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`group rounded-2xl border p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer relative shadow-xs hover:shadow-xl ${
                isDark
                  ? 'bg-[#16161A] hover:bg-[#1A1A22] border-zinc-800 hover:border-[#0066FF]'
                  : 'bg-white hover:bg-slate-50/80 border-zinc-200 hover:border-[#0066FF]'
              }`}
            >
              {/* Discount Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="bg-[#0066FF] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                  -{discountPct > 0 ? discountPct : 20}%
                </span>
              </div>

              {/* Product Thumbnail */}
              <div className={`w-full aspect-square rounded-xl p-3 flex items-center justify-center overflow-hidden mb-2.5 ${
                isDark ? 'bg-zinc-950/60' : 'bg-zinc-50'
              }`}>
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-108"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="space-y-1 text-left">
                <div className={`text-[10px] uppercase font-bold tracking-wider truncate ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {product.brand}
                </div>
                <h4 className={`text-xs font-semibold line-clamp-1 group-hover:text-[#0066FF] transition-colors ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  {product.name}
                </h4>

                {/* Price block */}
                <div className="pt-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-black text-[#0066FF]">
                      {formatPrice(promo, currency)}
                    </span>
                    {original > promo && (
                      <span className={`text-[10px] line-through ${
                        isDark ? 'text-zinc-500' : 'text-zinc-400'
                      }`}>
                        {formatPrice(original, currency)}
                      </span>
                    )}
                  </div>
                  {currency === 'USD' && (
                    <div className={`text-[9px] ${
                      isDark ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      ≈ {formatPrice(promo, 'LBP')}
                    </div>
                  )}
                </div>

                {/* Progress bar (Ishtari sold stock claim bar) */}
                <div className="pt-1 space-y-1">
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${
                    isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                  }`}>
                    <div className="bg-[#0066FF] h-full rounded-full w-3/4" />
                  </div>
                  <div className={`flex justify-between text-[9px] font-mono ${
                    isDark ? 'text-zinc-500' : 'text-zinc-500'
                  }`}>
                    <span>Claimed: 78%</span>
                    <span className="text-[#0066FF] font-bold">Hot Deal</span>
                  </div>
                </div>

                {/* Instant Actions (Add + Direct WhatsApp Buy) */}
                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="bg-[#0066FF] hover:bg-[#0052CC] active:scale-95 text-white font-bold text-[11px] py-1.5 rounded-lg transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>ADD</span>
                  </button>

                  <a
                    href={buildWhatsAppLink(
                      whatsappNumber,
                      `Hello ON-ALAA-STORE, I want to order this Flash Deal: ${product.name} (Discount Price: $${promo.toLocaleString()}). Please confirm delivery!`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`border text-[11px] py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer text-center font-semibold ${
                      isDark 
                        ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white' 
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                    title="Order directly on WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3 text-[#0066FF]" />
                    <span>ORDER</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
