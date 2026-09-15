import React, { useState, useMemo } from 'react';
import { 
  Check, 
  Plus, 
  ShoppingCart, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckSquare,
  Square
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';
import { DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';
import { buildWhatsAppLink } from '../utils/phone';
import { VisualStarRating } from './VisualStarRating';
import { 
  getFrequentlyBoughtTogether, 
  buildBundleWhatsAppMessage 
} from '../utils/frequentlyBoughtTogether';

interface FrequentlyBoughtTogetherProps {
  product: Product;
  currentVariant: ProductVariant;
  currency: Currency;
  allProducts: Product[];
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
  whatsappNumber?: string;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  product,
  currentVariant,
  currency,
  allProducts,
  onAddToCart,
  onSelectProduct,
  whatsappNumber = '+961 71 135 241',
}) => {
  // Dynamically compute the matching bundle for the current product & category
  const bundle = useMemo(() => {
    return getFrequentlyBoughtTogether(product, allProducts);
  }, [product, allProducts]);

  // Track which accessories are selected in the bundle (all selected by default)
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    bundle.accessories.forEach((acc) => {
      initial[acc.id] = true;
    });
    return initial;
  });

  // Track if main product is included in bundle purchase (default true)
  const [includeMainProduct, setIncludeMainProduct] = useState(true);

  // Added-to-cart confirmation animation state
  const [isBundleAdded, setIsBundleAdded] = useState(false);
  const [addedSingleId, setAddedSingleId] = useState<string | null>(null);

  // Sync selected accessory IDs when product changes
  React.useEffect(() => {
    const initial: Record<string, boolean> = {};
    bundle.accessories.forEach((acc) => {
      initial[acc.id] = true;
    });
    setSelectedAccessoryIds(initial);
    setIncludeMainProduct(true);
    setIsBundleAdded(false);
  }, [product.id, bundle]);

  const toggleAccessory = (accId: string) => {
    setSelectedAccessoryIds((prev) => ({
      ...prev,
      [accId]: !prev[accId],
    }));
  };

  const selectedAccessories = useMemo(() => {
    return bundle.accessories.filter((acc) => selectedAccessoryIds[acc.id]);
  }, [bundle.accessories, selectedAccessoryIds]);

  const totalItemsSelected = (includeMainProduct ? 1 : 0) + selectedAccessories.length;

  // Regular and bundle pricing calculation
  const { regularTotalUSD, bundleTotalUSD, savingsUSD, hasDiscount } = useMemo(() => {
    const mainPrice = includeMainProduct ? currentVariant.priceUSD : 0;
    const accessoriesPrice = selectedAccessories.reduce((acc, item) => acc + item.basePriceUSD, 0);
    const regularTotal = mainPrice + accessoriesPrice;

    // Apply bundle discount if at least 1 accessory is selected along with main product, or 2+ accessories
    const qualifiesForDiscount = totalItemsSelected >= 2;
    const discountRate = qualifiesForDiscount ? bundle.discountRate : 0;
    
    // Discount applied on accessories to incentivize companion purchase
    const accessoriesDiscount = accessoriesPrice * discountRate;
    const bundleTotal = Math.max(0, regularTotal - accessoriesDiscount);
    const savings = regularTotal - bundleTotal;

    return {
      regularTotalUSD: regularTotal,
      bundleTotalUSD: bundleTotal,
      savingsUSD: savings,
      hasDiscount: savings > 0.5,
    };
  }, [includeMainProduct, currentVariant.priceUSD, selectedAccessories, totalItemsSelected, bundle.discountRate]);

  // Handle adding the entire bundle to the cart
  const handleAddBundleToCart = () => {
    if (totalItemsSelected === 0) return;

    // 1. Add main product if selected
    if (includeMainProduct) {
      onAddToCart(product, currentVariant, 1);
    }

    // 2. Add each selected accessory with its primary variant
    selectedAccessories.forEach((acc) => {
      const defaultVariant = acc.variants?.[0] || {
        id: `${acc.id}-default`,
        name: acc.name,
        priceUSD: acc.basePriceUSD,
        inStock: true,
      };
      onAddToCart(acc, defaultVariant, 1);
    });

    setIsBundleAdded(true);
    setTimeout(() => {
      setIsBundleAdded(false);
    }, 2200);
  };

  // Handle single accessory quick-add
  const handleAddSingleAccessory = (acc: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = acc.variants?.[0] || {
      id: `${acc.id}-default`,
      name: acc.name,
      priceUSD: acc.basePriceUSD,
      inStock: true,
    };
    onAddToCart(acc, defaultVariant, 1);
    setAddedSingleId(acc.id);
    setTimeout(() => {
      setAddedSingleId(null);
    }, 1500);
  };

  // If no accessories are available, do not render an empty container
  if (bundle.accessories.length === 0) {
    return null;
  }

  // Pre-fill direct WhatsApp link for this custom bundle
  const bundleWhatsAppHref = buildWhatsAppLink(
    whatsappNumber,
    buildBundleWhatsAppMessage(
      product,
      currentVariant.name,
      currentVariant.priceUSD,
      selectedAccessories,
      currency,
      formatPrice(bundleTotalUSD, currency)
    )
  );

  return (
    <section 
      id="frequently-bought-together-section" 
      data-testid="frequently-bought-together-section"
      className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-white p-5 sm:p-7 shadow-xs relative overflow-hidden"
    >
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

      {/* Header with category matching reason */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-5 border-b border-slate-200/80 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Frequently Bought Together
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/60 shrink-0">
              {bundle.bundleBadge}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            {bundle.bundleSubtitle}
          </p>
        </div>

        {/* Value badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            <Truck className="w-3 h-3" />
            <span>Free Delivery</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3" />
            <span>Agency Warranty</span>
          </span>
        </div>
      </div>

      {/* Visual Bundle Flow: Items Row connected by "+" icons */}
      <div className="py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column: Visual Products Flow (Device + Accessories) */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
              
              {/* 1. Main Product Card */}
              <div 
                className={`flex-1 w-full p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  includeMainProduct 
                    ? 'border-blue-500/80 bg-white ring-2 ring-blue-500/15 shadow-xs' 
                    : 'border-slate-200 bg-slate-50/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Interactive toggle */}
                  <button
                    type="button"
                    onClick={() => setIncludeMainProduct(!includeMainProduct)}
                    className="mt-0.5 text-blue-600 hover:text-blue-700 transition cursor-pointer shrink-0"
                    title={includeMainProduct ? 'Deselect main product' : 'Select main product'}
                    aria-label="Toggle main product in bundle"
                  >
                    {includeMainProduct ? (
                      <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-slate-100 p-1 border border-slate-200/80 shrink-0 overflow-hidden">
                    <img
                      src={product.image || DEFAULT_PRODUCT_IMAGE}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded mb-1">
                      This Item
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      Variant: {currentVariant.name}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    {formatPrice(currentVariant.priceUSD, currency)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Selected Model
                  </span>
                </div>
              </div>

              {/* Dynamic Accessories */}
              {bundle.accessories.map((acc) => {
                const isSelected = !!selectedAccessoryIds[acc.id];
                const isSingleAdding = addedSingleId === acc.id;

                return (
                  <React.Fragment key={acc.id}>
                    {/* Plus Icon Divider */}
                    <div className="flex items-center justify-center shrink-0">
                      <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center shadow-2xs font-bold">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Accessory Card */}
                    <div 
                      className={`flex-1 w-full p-3.5 rounded-xl border transition-all relative flex flex-col justify-between group ${
                        isSelected 
                          ? 'border-blue-500/80 bg-white ring-2 ring-blue-500/15 shadow-xs' 
                          : 'border-slate-200 bg-slate-50/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox toggle */}
                        <button
                          type="button"
                          id={`fbt-checkbox-${acc.id}`}
                          data-testid={`fbt-checkbox-${acc.id}`}
                          onClick={() => toggleAccessory(acc.id)}
                          className="mt-0.5 text-blue-600 hover:text-blue-700 transition cursor-pointer shrink-0"
                          title={isSelected ? 'Remove from bundle' : 'Add to bundle'}
                          aria-label={`Toggle ${acc.name} in bundle`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Thumbnail */}
                        <div 
                          onClick={() => onSelectProduct && onSelectProduct(acc)}
                          className="w-16 h-16 rounded-lg bg-slate-100 p-1 border border-slate-200/80 shrink-0 overflow-hidden cursor-pointer hover:opacity-90 transition"
                          title="Click to view accessory details"
                        >
                          <img
                            src={acc.image || DEFAULT_PRODUCT_IMAGE}
                            alt={acc.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded mb-1">
                            {acc.subcategory || acc.category}
                          </span>
                          <h4 
                            onClick={() => onSelectProduct && onSelectProduct(acc)}
                            className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight hover:text-blue-600 cursor-pointer transition-colors"
                            title={acc.name}
                          >
                            {acc.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <VisualStarRating rating={acc.rating || 4.8} size="xs" />
                            <span className="text-[10px] text-slate-500 font-medium">
                              ({acc.reviewCount || 28})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 font-mono">
                            {formatPrice(acc.basePriceUSD, currency)}
                          </span>
                          {acc.originalPriceUSD && acc.originalPriceUSD > acc.basePriceUSD && (
                            <span className="text-[10px] text-slate-400 line-through ml-1 font-mono">
                              {formatPrice(acc.originalPriceUSD, currency)}
                            </span>
                          )}
                        </div>

                        {/* Quick single add action */}
                        <button
                          type="button"
                          id={`fbt-single-add-${acc.id}`}
                          onClick={(e) => handleAddSingleAccessory(acc, e)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                            isSingleAdding
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200'
                          }`}
                          title="Add only this accessory to cart"
                        >
                          {isSingleAdding ? (
                            <>
                              <Check className="w-2.5 h-2.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-2.5 h-2.5" />
                              <span>Add Only</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

            </div>

            {/* Explanatory checkbox checklist below */}
            <div className="pt-2 space-y-1.5 text-xs text-slate-700 bg-white/60 p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fbt-main-check-footer"
                  checked={includeMainProduct}
                  onChange={(e) => setIncludeMainProduct(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="fbt-main-check-footer" className="cursor-pointer truncate">
                  <strong>This item:</strong> {product.name} ({currentVariant.name}) -{' '}
                  <span className="font-mono font-bold text-slate-900">
                    {formatPrice(currentVariant.priceUSD, currency)}
                  </span>
                </label>
              </div>

              {bundle.accessories.map((acc) => (
                <div key={acc.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`fbt-acc-check-footer-${acc.id}`}
                    checked={!!selectedAccessoryIds[acc.id]}
                    onChange={() => toggleAccessory(acc.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`fbt-acc-check-footer-${acc.id}`} className="cursor-pointer truncate">
                    <strong>Accessory:</strong> {acc.name} -{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {formatPrice(acc.basePriceUSD, currency)}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bundle Pricing & Checkout Action Card */}
          <div className="md:col-span-4 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Bundle Total ({totalItemsSelected} {totalItemsSelected === 1 ? 'item' : 'items'})
                </span>
                {hasDiscount && (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save {Math.round(bundle.discountRate * 100)}%
                  </span>
                )}
              </div>

              {/* Price Display */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {formatPrice(bundleTotalUSD, currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through font-mono font-semibold">
                      {formatPrice(regularTotalUSD, currency)}
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Bundle savings: {formatPrice(savingsUSD, currency)}</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Compatible with {product.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Lebanon 24-48h Express Shipping</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                id="fbt-add-bundle-btn"
                data-testid="fbt-add-bundle-btn"
                disabled={totalItemsSelected === 0}
                onClick={handleAddBundleToCart}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98 ${
                  isBundleAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : totalItemsSelected === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/30'
                }`}
                title="Add all checked items into your shopping cart in one click"
              >
                {isBundleAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Bundle Added to Cart! ✨</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      Add {totalItemsSelected === 1 ? 'Item' : `All ${totalItemsSelected} Items`} to Cart
                    </span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp Ordering */}
              <a
                id="fbt-whatsapp-bundle-btn"
                data-testid="fbt-whatsapp-bundle-btn"
                href={bundleWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-1.5 border border-slate-700 hover:border-slate-600 shadow-2xs cursor-pointer group"
                title="Order this entire bundle directly with our sales team on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:scale-110" />
                <span>Order Bundle on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
