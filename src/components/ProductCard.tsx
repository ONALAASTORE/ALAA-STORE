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
  Images
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
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
}) => {
  const defaultVariant = product.variants[0];
  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);
  const activeVariant = product.variants[selectedVariantIndex] || defaultVariant;

  const [addedAnimation, setAddedAnimation] = React.useState(false);

  // Multi-image handling
  const productImages = getProductImages(product);
  const primaryImage = productImages[0] || DEFAULT_PRODUCT_IMAGE;
  const secondaryImage = productImages.length > 1 ? productImages[1] : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeVariant);
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
          <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1 shadow-xs">
            <Truck className="w-2.5 h-2.5" />
            Free Delivery
          </span>
        )}
      </div>

      {/* Action Buttons Overlay (Wishlist, Compare, Quick View) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-md border transition ${
            isWishlisted 
              ? 'border-rose-300 text-rose-500 bg-rose-50' 
              : 'border-slate-200 text-slate-600 hover:text-rose-500'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        <button
          id={`compare-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-md border transition ${
            isCompared 
              ? 'border-blue-300 text-blue-600 bg-blue-50' 
              : 'border-slate-200 text-slate-600 hover:text-blue-600'
          }`}
          title={isCompared ? "Remove from comparison" : "Compare specifications"}
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <button
          id={`quickview-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/95 backdrop-blur-xs shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 transition"
          title="Quick preview"
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
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition cursor-pointer ${
                    selectedVariantIndex === idx
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
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
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                {formatPrice(activeVariant.priceUSD, currency)}
              </span>
              {product.originalPriceUSD && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPriceUSD, currency)}
                </span>
              )}
            </div>
            {currency === 'USD' && (
              <span className="text-[10px] text-slate-400 font-medium block">
                ≈ {formatPrice(activeVariant.priceUSD, 'LBP')}
              </span>
            )}
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            onClick={handleAdd}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
              addedAnimation 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-900 hover:bg-blue-600 text-white'
            }`}
          >
            {addedAnimation ? (
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
        </div>
      </div>
    </div>
  );
};
