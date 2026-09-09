import React from 'react';
import { 
  Heart, 
  ArrowLeftRight, 
  Eye, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Truck,
  Check,
  Images,
  Tag,
  MessageCircle
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';
import { buildWhatsAppLink } from '../utils/phone';

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
}) => {
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

  // Multi-image handling
  const productImages = getProductImages(product);
  const primaryImage = productImages[0] || DEFAULT_PRODUCT_IMAGE;
  const secondaryImage = productImages.length > 1 ? productImages[1] : null;

  // Availability status: 'In Stock', 'Low Stock', 'Out of Stock'
  const isOutOfStock = !product.inStock || (product.stockCount !== undefined && product.stockCount <= 0);
  const isLowStock = !isOutOfStock && product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5;

  // Promotional pricing & Discount calculation (fetched directly from product object)
  const basePrice = activeVariant.priceUSD || product.basePriceUSD;
  const originalPrice = product.originalPriceUSD;
  const promotionalPrice = product.promotionalPriceUSD ?? product.promotionalPrice ?? product.salePriceUSD;
  const explicitDiscount = product.discountPercentage;
  const isOnSale = product.onSale;

  // Effective selling price: uses promotionalPrice if explicitly set and lower than basePrice
  const effectivePrice = (promotionalPrice !== undefined && promotionalPrice < basePrice)
    ? promotionalPrice
    : basePrice;

  // Check if product has a promotional price / discount from the product object
  const hasPromotionalPrice = Boolean(
    (originalPrice !== undefined && originalPrice > effectivePrice) ||
    (promotionalPrice !== undefined && promotionalPrice < (originalPrice ?? product.basePriceUSD)) ||
    (explicitDiscount !== undefined && explicitDiscount > 0) ||
    isOnSale
  );

  // Calculate discount percentage if original price or explicit discount is available
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

  // Strike-through comparison price (shows regular price when on sale/discount)
  const strikePrice = (promotionalPrice !== undefined && promotionalPrice < basePrice)
    ? basePrice
    : (originalPrice !== undefined && originalPrice > effectivePrice ? originalPrice : undefined);

  const whatsappBuyLink = buildWhatsAppLink(
    whatsappNumber || '+961 71 135 241',
    `Hello On Alaa Store! 🇱🇧\nI would like to order:\n• Product: ${product.name}\n• Variant: ${activeVariant.name}\n• Price: $${effectivePrice}\n\nPlease confirm availability and delivery details.`
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
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {/* Availability Status Badge */}
        {isOutOfStock ? (
          <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-200" />
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Low Stock ({product.stockCount})
          </span>
        ) : (
          <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
            In Stock
          </span>
        )}

        {/* Sale / Discount Promotional Price Badge */}
        {hasPromotionalPrice && (
          <span 
            id={`sale-discount-badge-${product.id}`}
            data-testid="sale-discount-badge"
            className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs animate-in fade-in"
            title="Promotional Price / Discount Active"
          >
            <Tag className="w-2.5 h-2.5 shrink-0" />
            <span>Sale</span>
            {discountPercent && discountPercent > 0 && (
              <span>-{discountPercent}%</span>
            )}
            <span className="sr-only">Discount</span>
          </span>
        )}

        {product.isHotDeal && (
          <span className="bg-rose-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide shadow-xs">
            Deal
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide shadow-xs">
            New
          </span>
        )}
        {product.freeDelivery && (
          <span className="bg-emerald-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1 shadow-xs">
            <Truck className="w-2.5 h-2.5" />
            Free Delivery
          </span>
        )}
      </div>

      {/* Action Buttons Overlay (Wishlist, Compare, Quick View) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 sm:gap-1.5 opacity-95 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-md border transition cursor-pointer active:scale-95 ${
            isWishlisted 
              ? 'border-rose-300 text-rose-500 bg-rose-50' 
              : 'border-slate-200 text-slate-600 hover:text-rose-500'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        <button
          id={`compare-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          className={`w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-md border transition cursor-pointer active:scale-95 ${
            isCompared 
              ? 'border-blue-300 text-blue-600 bg-blue-50' 
              : 'border-slate-200 text-slate-600 hover:text-blue-600'
          }`}
          title={isCompared ? "Remove from comparison" : "Compare specifications"}
          aria-label="Compare"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <button
          id={`quickview-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer active:scale-95"
          title="Quick preview"
          aria-label="Quick view"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden p-6 flex items-center justify-center group/img">
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-contain object-center transition-all duration-500 ${
            secondaryImage ? 'group-hover/img:opacity-0 group-hover/img:scale-95 group-hover:scale-105' : 'group-hover:scale-108'
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
            className="w-full h-full object-contain object-center absolute inset-0 p-6 transition-all duration-500 opacity-0 scale-95 group-hover/img:opacity-100 group-hover/img:scale-108"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
        )}
        {productImages.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shadow-xs pointer-events-none">
            <Images className="w-3 h-3" />
            <span>{productImages.length}</span>
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-slate-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-blue-600 transition min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Condition & Warranty Subtitle */}
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>

          {/* Variant Selector (if multiple variants) */}
          {product.variants.length > 1 && (
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              {product.variants.slice(0, 4).map((variant, idx) => (
                <button
                  key={variant.id}
                  id={`variant-btn-${product.id}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIndex(idx);
                  }}
                  className={`text-[10px] sm:text-[11px] font-semibold min-h-[30px] px-2.5 py-1 rounded-lg border transition cursor-pointer active:scale-95 ${
                    selectedVariantIndex === idx
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {variant.storage || variant.name.split('-')[0]}
                </button>
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-slate-400">+{product.variants.length - 4}</span>
              )}
            </div>
          )}

          {/* Color Swatch Dots Preview */}
          {product.colorOptions && product.colorOptions.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colorOptions.slice(0, 5).map((col) => (
                  <span
                    key={col.name}
                    className="w-2.5 h-2.5 rounded-full border border-slate-200 shadow-2xs inline-block"
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
                {product.colorOptions.length > 5 && (
                  <span className="text-[9px] text-slate-400 font-semibold">+{product.colorOptions.length - 5}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base font-display">
                  {formatPrice(effectivePrice, currency)}
                </span>
                {strikePrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    {formatPrice(strikePrice, currency)}
                  </span>
                )}
              </div>
              {currency === 'USD' && (
                <span className="text-[10px] text-slate-400 font-medium block">
                  ≈ {formatPrice(effectivePrice, 'LBP')}
                </span>
              )}
            </div>
            {hasPromotionalPrice && discountPercent && discountPercent > 0 && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Dual Action Buttons (Mobile-first, touch-friendly min-h-[44px]) */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              id={`add-cart-btn-${product.id}`}
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 col-span-2'
                  : addedAnimation 
                    ? 'bg-emerald-600 text-white cursor-pointer ring-2 ring-emerald-500/30' 
                    : 'bg-slate-900 hover:bg-blue-600 text-white cursor-pointer active:scale-95'
              }`}
              aria-label={isOutOfStock ? "Sold out" : `Add ${product.name} to cart`}
            >
              {isOutOfStock ? (
                <span>Sold Out</span>
              ) : addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>

            {!isOutOfStock && (
              <a
                id={`whatsapp-buy-btn-${product.id}`}
                href={whatsappBuyLink}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1 shadow-xs active:scale-95 text-center cursor-pointer"
                title="Order immediately on WhatsApp"
                aria-label={`Order ${product.name} directly on WhatsApp`}
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
