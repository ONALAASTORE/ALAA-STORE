import React from 'react';
import { 
  Heart, 
  ArrowLeftRight, 
  Eye, 
  ShoppingCart, 
  ShieldCheck, 
  Check, 
  Images, 
  MessageCircle,
  Bell,
  Flame,
  Tag
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';
import { buildWhatsAppLink } from '../utils/phone';
import { getProductSku } from '../utils/sku';
import { NotifyMeModal } from './NotifyMeModal';
import { hasUserRequestedNotification } from '../services/notificationService';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  whatsappNumber?: string;
  theme?: 'dark' | 'light';
  lowStockThreshold?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  whatsappNumber = '+961 71 135 241',
  theme = 'dark',
  lowStockThreshold = 2,
}) => {
  const isDark = theme === 'dark';

  const variants = React.useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants;
    }
    return [
      {
        id: `${product.id}-default`,
        name: 'Standard Option',
        priceUSD: product.basePriceUSD,
        inStock: product.inStock !== false,
      },
    ];
  }, [product.variants, product.id, product.basePriceUSD, product.inStock]);

  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);
  const activeVariant = variants[selectedVariantIndex] || variants[0];
  const [addedAnimation, setAddedAnimation] = React.useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = React.useState(false);
  const [isAlertRegistered, setIsAlertRegistered] = React.useState(() => hasUserRequestedNotification(product.id));

  React.useEffect(() => {
    setIsAlertRegistered(hasUserRequestedNotification(product.id, activeVariant.id));
  }, [product.id, activeVariant.id]);

  // Multi-image handling
  const productImages = getProductImages(product);
  const primaryImage = productImages[0] || DEFAULT_PRODUCT_IMAGE;
  const secondaryImage = productImages.length > 1 ? productImages[1] : null;

  // Availability & Stock status
  const stockQuantity = activeVariant.stockCount ?? product.stockCount ?? (product as any).quantity;
  const isOutOfStock = !product.inStock || (stockQuantity !== undefined && stockQuantity <= 0);
  const currentLowStockThreshold = lowStockThreshold ?? 2;
  const isLowStock = !isOutOfStock && stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= currentLowStockThreshold;

  // Price calculations
  const basePrice = activeVariant.priceUSD || product.basePriceUSD;
  const originalPrice = product.originalPriceUSD;
  const promotionalPrice = product.promotionalPriceUSD ?? product.promotionalPrice ?? product.salePriceUSD;
  const explicitDiscount = product.discountPercentage;
  const isOnSale = product.onSale;

  const effectivePrice = (promotionalPrice !== undefined && promotionalPrice < basePrice)
    ? promotionalPrice
    : basePrice;

  const hasPromotionalPrice = Boolean(
    (originalPrice !== undefined && originalPrice > effectivePrice) ||
    (promotionalPrice !== undefined && promotionalPrice < (originalPrice ?? product.basePriceUSD)) ||
    (explicitDiscount !== undefined && explicitDiscount > 0) ||
    isOnSale
  );

  const discountPercent = (() => {
    if (explicitDiscount !== undefined && explicitDiscount > 0) {
      return Math.round(explicitDiscount);
    }
    const higherPrice = originalPrice ?? (promotionalPrice !== undefined && promotionalPrice < product.basePriceUSD ? product.basePriceUSD : undefined);
    if (higherPrice && higherPrice > effectivePrice) {
      return Math.round(((higherPrice - effectivePrice) / higherPrice) * 100);
    }
    return null;
  })();

  const strikePrice = (promotionalPrice !== undefined && promotionalPrice < basePrice)
    ? basePrice
    : (originalPrice !== undefined && originalPrice > effectivePrice ? originalPrice : undefined);

  const productSku = getProductSku(product, activeVariant);

  const whatsappBuyLink = buildWhatsAppLink(
    whatsappNumber || '+961 71 135 241',
    `Hello On Alaa Store! 🇱🇧\nI would like to order:\n• Product: ${product.name}\n• SKU: ${productSku}\n• Variant: ${activeVariant.name}\n• Price: $${effectivePrice}\n\nPlease confirm availability and dispatch details.`
  );

  const whatsappInquiryLink = buildWhatsAppLink(
    whatsappNumber || '+961 71 135 241',
    `Hello On Alaa Store! 🇱🇧\n\nI have a quick inquiry about this product:\n• Product: ${product.name}\n• SKU: ${productSku}\n• Brand: ${product.brand}\n• Variant: ${activeVariant.name}\n• Price: $${effectivePrice} USD (${formatPrice(effectivePrice, 'LBP')})\n• Warranty: ${product.warranty || 'Agency Sealed'}\n\nCould you please confirm if it is currently in stock at the warehouse and available for fast dispatch to my area? Thank you!`
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, {
      ...activeVariant,
      priceUSD: effectivePrice
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className={`group rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative shadow-sm hover:shadow-xl ${
        isDark 
          ? 'bg-[#141418] hover:bg-[#181822] border-zinc-800 hover:border-blue-500/80 text-zinc-100 hover:shadow-blue-500/10' 
          : 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-blue-400 text-zinc-900 hover:shadow-blue-500/10'
      }`}
    >
      {/* Badges Overlay (Technical tags) */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none font-mono text-[10px]">
        {isOutOfStock ? (
          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950/90 text-zinc-500 uppercase tracking-tight">
            [ OUT OF STOCK ]
          </span>
        ) : isLowStock ? (
          <span 
            id={`low-stock-badge-${product.id}`}
            data-testid="low-stock-badge"
            className="px-2 py-0.5 rounded-md border border-amber-500/50 bg-amber-500/20 text-amber-500 dark:text-amber-400 font-mono font-bold text-[10px] uppercase tracking-tight flex items-center gap-1.5 shadow-xs shadow-amber-500/10 backdrop-blur-xs"
            title={`Only ${stockQuantity} left in stock`}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
            </span>
            <span>Low Stock{stockQuantity !== undefined ? ` • ${stockQuantity} Left` : ''}</span>
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded border border-zinc-800/80 bg-zinc-950/80 text-zinc-400 uppercase text-[9px]">
            SEALED
          </span>
        )}

        {hasPromotionalPrice && discountPercent && discountPercent > 0 && (
          <span 
            id={`sale-discount-badge-${product.id}`}
            data-testid="sale-discount-badge"
            className="px-2 py-0.5 rounded-md bg-blue-600 text-white uppercase font-mono font-bold shadow-md shadow-blue-600/40 text-[10px]"
          >
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Action Buttons Overlay (Wishlist, Compare, Quick View, WhatsApp Inquiry) */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          id={`floating-wa-inquiry-btn-${product.id}`}
          href={whatsappInquiryLink}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
          className={`animate-wa-pulse w-7 h-7 rounded-md flex items-center justify-center border transition-micro cursor-pointer ${
            isDark 
              ? 'border-emerald-800/80 bg-zinc-950/90 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/80 hover:border-emerald-600' 
              : 'border-emerald-200 bg-white/95 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 shadow-2xs'
          }`}
          title="Ask on WhatsApp"
          aria-label={`Ask about ${product.name} on WhatsApp`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>

        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`w-7 h-7 rounded-md flex items-center justify-center border transition-micro cursor-pointer ${
            isWishlisted 
              ? 'border-zinc-500 bg-zinc-800 text-zinc-100' 
              : (isDark ? 'border-zinc-800 bg-zinc-950/90 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700' : 'border-zinc-200 bg-white/90 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300')
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        <button
          id={`compare-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          className={`w-7 h-7 rounded-md flex items-center justify-center border transition-micro cursor-pointer ${
            isCompared 
              ? 'border-zinc-500 bg-zinc-800 text-zinc-100' 
              : (isDark ? 'border-zinc-800 bg-zinc-950/90 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700' : 'border-zinc-200 bg-white/90 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300')
          }`}
          title={isCompared ? "Remove from comparison" : "Compare specifications"}
          aria-label="Compare"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        <button
          id={`quickview-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className={`w-7 h-7 rounded-md flex items-center justify-center border transition-micro cursor-pointer ${
            isDark ? 'border-zinc-800 bg-zinc-950/90 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700' : 'border-zinc-200 bg-white/90 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
          }`}
          title="Quick preview"
          aria-label="Quick view"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className={`relative aspect-square overflow-hidden p-5 flex items-center justify-center transition-colors ${
        isDark ? 'bg-zinc-950/50' : 'bg-zinc-100/50'
      }`}>
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-contain object-center transition-all duration-300 ${
            secondaryImage ? 'group-hover:opacity-0 group-hover:scale-95 group-hover:scale-102' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="w-full h-full object-contain object-center absolute inset-0 p-5 transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        )}
        {productImages.length > 1 && (
          <div className="absolute bottom-2 right-2 z-10 bg-zinc-950/80 border border-zinc-800 text-zinc-400 text-[9px] font-mono px-1 py-0.5 rounded flex items-center gap-1 opacity-70 group-hover:opacity-100 transition pointer-events-none">
            <Images className="w-2.5 h-2.5" />
            <span>{productImages.length}</span>
          </div>
        )}

        {/* Floating Quick-Action WhatsApp Inquiry Pill on Card Image */}
        <div className="absolute bottom-2 left-2 z-10">
          <a
            id={`floating-wa-inquiry-pill-${product.id}`}
            href={whatsappInquiryLink}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noreferrer"
            className={`animate-wa-pulse inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium shadow-xs transition-micro cursor-pointer active:scale-95 border backdrop-blur-xs ${
              isDark
                ? 'bg-zinc-950/90 hover:bg-emerald-950 text-emerald-400 border-emerald-900/60 hover:border-emerald-600'
                : 'bg-white/95 hover:bg-emerald-50 text-emerald-700 border-emerald-300/80 hover:border-emerald-500 shadow-2xs'
            }`}
            title={`Ask specifically about ${product.name} on WhatsApp`}
            aria-label={`Ask about ${product.name} on WhatsApp`}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <MessageCircle className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="tracking-tight uppercase font-semibold">WA Inquiry</span>
          </a>
        </div>
      </div>

      {/* Product Information Body */}
      <div className={`p-3.5 flex-1 flex flex-col justify-between space-y-2.5 border-t transition-colors ${
        isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-200/80 bg-white'
      }`}>
        <div>
          {/* Brand & Stock Reference */}
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className={`uppercase tracking-wider font-semibold ${isDark ? 'text-zinc-300' : 'text-[#333333]'}`}>
              {product.brand}
            </span>
            <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-[#555555]'}`}>
              {product.category.toUpperCase()}
            </span>
          </div>

          {/* Product Title */}
          <h3 className={`font-semibold text-xs sm:text-sm line-clamp-2 transition-colors min-h-[2.5rem] tracking-tight ${
            isDark ? 'text-zinc-100 group-hover:text-white' : 'text-[#000000] group-hover:text-[#0052CC]'
          }`}>
            {product.name}
          </h3>

          {/* Model SKU Identifier */}
          <div className="flex items-center gap-1.5 mt-1">
            <span 
              id={`product-card-sku-${product.id}`}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                isDark 
                  ? 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300' 
                  : 'bg-slate-100/90 border-slate-200 text-slate-700'
              }`}
              title={`Unique Model SKU: ${productSku}`}
            >
              <Tag className="w-2.5 h-2.5 text-blue-500 shrink-0" />
              <span className="opacity-60 text-[9px] uppercase font-bold tracking-tight">SKU:</span>
              <span className="font-semibold tracking-tight">{productSku}</span>
            </span>
          </div>

          {/* Warranty / Specs Subtitle */}
          <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-mono ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
            <ShieldCheck className={`w-3 h-3 shrink-0 ${isDark ? 'text-zinc-400' : 'text-[#0052CC]'}`} />
            <span className="truncate">{product.warranty}</span>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              {product.variants.slice(0, 4).map((variant, idx) => (
                <button
                  key={variant.id}
                  id={`variant-btn-${product.id}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-micro cursor-pointer ${
                    selectedVariantIndex === idx
                      ? (isDark ? 'border-zinc-400 bg-zinc-100 text-zinc-950 font-bold' : 'border-[#0052CC] bg-[#0052CC] text-white font-bold')
                      : (isDark ? 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200' : 'border-zinc-200 bg-[#FAFAFA] text-[#333333] hover:border-zinc-300')
                  }`}
                >
                  {variant.storage || variant.name.split('-')[0]}
                </button>
              ))}
              {product.variants.length > 4 && (
                <span className={`text-[9px] font-mono ${isDark ? 'text-zinc-500' : 'text-[#555555]'}`}>+{product.variants.length - 4}</span>
              )}
            </div>
          )}

          {/* Low Stock Urgency Text Indicator */}
          {isLowStock && (
            <div 
              id={`low-stock-indicator-${product.id}`}
              data-testid="low-stock-indicator"
              className={`mt-2 flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                Low Stock: Only <strong className="font-bold underline decoration-amber-500/50">{stockQuantity} {stockQuantity === 1 ? 'unit' : 'units'}</strong> left!
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'}`}>
          <div className="flex items-baseline justify-between gap-1 flex-wrap font-mono">
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-zinc-100' : 'text-[#000000]'}`}>
                  {formatPrice(effectivePrice, currency)}
                </span>
                {strikePrice && (
                  <span className={`text-[10px] line-through ${isDark ? 'text-zinc-500' : 'text-[#555555]'}`}>
                    {formatPrice(strikePrice, currency)}
                  </span>
                )}
              </div>
              {currency === 'USD' && (
                <span className={`text-[10px] block ${isDark ? 'text-zinc-500' : 'text-[#555555]'}`}>
                  ≈ {formatPrice(effectivePrice, 'LBP')}
                </span>
              )}
            </div>
            {hasPromotionalPrice && discountPercent && discountPercent > 0 && (
              <span className={`text-[10px] border px-1.5 py-0.5 rounded font-mono ${
                isDark 
                  ? 'text-zinc-400 border-zinc-800 bg-zinc-950' 
                  : 'text-[#0052CC] border-[#0052CC]/30 bg-blue-50/50 font-semibold'
              }`}>
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 font-mono">
            {isOutOfStock ? (
              <div className="col-span-2 space-y-1.5">
                <button
                  type="button"
                  id={`notify-me-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotifyOpen(true);
                  }}
                  className={`w-full min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border shadow-sm ${
                    isAlertRegistered
                      ? isDark
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 hover:bg-emerald-950/60'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                      : isDark
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 shadow-amber-500/10'
                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-amber-500/10'
                  }`}
                  title="Receive an instant alert via WhatsApp or Email as soon as this item restocks"
                  aria-label={`Notify me when ${product.name} is available`}
                >
                  {isAlertRegistered ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Alert Set • Notify Me</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Notify When Available</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-between px-1 text-[10px] text-zinc-500 font-mono">
                  <span>STATUS: <strong className="text-amber-500">OUT OF STOCK</strong></span>
                  <a
                    href={whatsappInquiryLink}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1 text-zinc-400 hover:text-emerald-400"
                    title="Inquire expected restock date on WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-500" />
                    <span>Inquire ETA</span>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <button
                  id={`add-cart-btn-${product.id}`}
                  onClick={handleAdd}
                  className={`min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-bold uppercase tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border ${
                    addedAnimation 
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  }`}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>ADD</span>
                    </>
                  )}
                </button>

                <a
                  id={`whatsapp-buy-btn-${product.id}`}
                  href={whatsappBuyLink}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noreferrer"
                  className={`min-h-[38px] px-2 py-1.5 rounded-lg text-xs font-medium uppercase tracking-tight border transition-micro flex items-center justify-center gap-1 cursor-pointer active:scale-98 ${
                    isDark 
                      ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700' 
                      : 'border-zinc-200 bg-[#FAFAFA] hover:bg-zinc-100 text-[#333333] hover:text-[#000000] hover:border-zinc-300'
                  }`}
                  title="Order immediately on WhatsApp"
                  aria-label={`Order ${product.name} directly on WhatsApp`}
                >
                  <MessageCircle className={`w-3 h-3 shrink-0 ${isDark ? 'text-zinc-400' : 'text-[#0052CC]'}`} />
                  <span className="truncate">WA ORDER</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notify Me When Available Modal */}
      <NotifyMeModal
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        product={product}
        variant={activeVariant}
        theme={theme}
        whatsappNumber={whatsappNumber}
        onNotificationSaved={() => setIsAlertRegistered(true)}
      />
    </div>
  );
};
