import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Check, 
  MessageCircle, 
  ShoppingCart, 
  ArrowLeftRight, 
  Heart,
  CreditCard,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  LayoutGrid,
  SlidersHorizontal,
  Images
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
}) => {
  if (!product) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'delivery'>('specs');
  const [added, setAdded] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  // Product image carousel iterating through the 'allImages' array
  const allImages = useMemo<string[]>(() => {
    // 1. Direct 'imageUrls' array on product
    if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      const valid = product.imageUrls.filter(
        (url): url is string => typeof url === 'string' && url.trim().length > 0
      );
      if (valid.length > 0) return valid;
    }
    // 2. Direct 'image_urls' array fallback
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      const valid = product.image_urls.filter(
        (url): url is string => typeof url === 'string' && url.trim().length > 0
      );
      if (valid.length > 0) return valid;
    }
    // 3. Fallback to unified extraction
    return getProductImages(product);
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [galleryViewMode, setGalleryViewMode] = useState<'slider' | 'grid'>('slider');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  // Seamless pagination helper with infinite loop
  const paginate = (newDirection: number) => {
    if (allImages.length <= 1) return;
    setActiveImageIndex((current) => (current + newDirection + allImages.length) % allImages.length);
  };

  // Keyboard navigation for gallery carousel & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && allImages.length > 1) {
        paginate(-1);
      } else if (e.key === 'ArrowRight' && allImages.length > 1) {
        paginate(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length, onClose, activeImageIndex]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRefs.current[activeImageIndex]) {
      thumbnailRefs.current[activeImageIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeImageIndex]);

  // Touch swipe gesture handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && allImages.length > 1) {
      paginate(1);
    } else if (isRightSwipe && allImages.length > 1) {
      paginate(-1);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    paginate(-1);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    paginate(1);
  };

  const handleAddToCart = () => {
    onAddToCart(product, currentVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleShare = async () => {
    // Generate clean product link with the active '?product=ID' query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    const shareUrl = url.toString();

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      } catch (err) {
        console.warn('navigator.clipboard.writeText failed, falling back:', err);
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (e) {
        console.error('Failed to copy product link', e);
      }
    }

    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello On Alaa Store! 🇱🇧\nI would like to order:\n- Item: ${product.name}\n- Variant: ${currentVariant.name}\n- Price: $${currentVariant.priceUSD}\n- Qty: ${quantity}\n\nPlease let me know delivery timeframe and payment details.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Multi-Image Interactive Gallery */}
          <div className="md:col-span-5 space-y-3">
            {/* Gallery Header Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Images className="w-3.5 h-3.5 text-blue-600" />
                <span>Product Media</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {allImages.length} {allImages.length === 1 ? 'photo' : 'photos'}
                </span>
              </div>

              {allImages.length > 1 && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
                  <button
                    type="button"
                    onClick={() => setGalleryViewMode('slider')}
                    className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      galleryViewMode === 'slider'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                    title="Featured Carousel View"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryViewMode('grid')}
                    className={`p-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      galleryViewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'hover:text-slate-900'
                    }`}
                    title="Multi-Angle Grid View"
                  >
                    <LayoutGrid className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Slider / Carousel View Mode */}
            {galleryViewMode === 'slider' ? (
              <div className="space-y-2.5">
                {/* Main Featured Stage */}
                <div 
                  className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden group cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={allImages[activeImageIndex] || DEFAULT_PRODUCT_IMAGE}
                    alt={`${product.name} - View ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain object-center transition duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                    }}
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.isHotDeal && (
                      <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                        Hot Deal
                      </span>
                    )}
                    {product.condition && product.condition !== 'Brand New (Sealed)' && (
                      <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {product.condition}
                      </span>
                    )}
                  </div>

                  {/* Zoom Action Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center transition opacity-80 hover:opacity-100 cursor-pointer"
                    title="Open Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Previous / Next Arrows on Main Stage */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Counter Badge */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-10 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
                      {activeImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Slider Strip */}
                {allImages.length > 1 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIndex(i)}
                          className={`w-14 h-14 rounded-xl border-2 p-1 bg-slate-50 shrink-0 transition overflow-hidden cursor-pointer ${
                            activeImageIndex === i
                              ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Thumbnail ${i + 1}`} 
                            className="w-full h-full object-contain" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-1.5 pt-0.5">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIndex(i)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            activeImageIndex === i
                              ? 'w-5 bg-blue-600'
                              : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                          }`}
                          title={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Multi-Angle Grid View Mode */
              <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveImageIndex(i);
                      setIsLightboxOpen(true);
                    }}
                    className={`relative aspect-square rounded-xl border p-2 bg-slate-50 overflow-hidden cursor-pointer group transition ${
                      activeImageIndex === i ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${i + 1}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />
                    <span className="absolute bottom-1.5 right-1.5 bg-slate-900/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Guarantees Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Direct dispatch • Fast nationwide delivery all Lebanon</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Cash on Delivery in USD, L.L., or Whish Money</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Variant Selection */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {product.brand} • {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id="modal-share-icon-btn"
                    type="button"
                    onClick={handleShare}
                    className={`p-2 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                      shareStatus === 'copied'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                    title={
                      shareStatus === 'copied'
                        ? 'Product link copied to clipboard!'
                        : 'Share (Copy product URL)'
                    }
                    aria-label="Share product"
                  >
                    {shareStatus === 'copied' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      isWishlisted ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-slate-200 text-slate-600 hover:text-rose-500'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      isCompared ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:text-blue-600'
                    }`}
                    title="Compare"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display leading-snug">
                {product.name}
              </h2>

              {/* Reviews & Condition */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-md border border-amber-200/60 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-amber-700">({product.reviewCount} customer reviews)</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200/60 font-semibold">
                  {product.condition}
                </span>
                <span className="text-slate-500">
                  Status: <strong className="text-emerald-600">In Stock (Warehouse Lebanon)</strong>
                </span>
              </div>

              {/* Price Block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Price (Cash / COD)</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    {formatPrice(currentVariant.priceUSD, currency)}
                  </div>
                  {currency === 'USD' && (
                    <div className="text-xs text-slate-500 font-medium">
                      ≈ {formatPrice(currentVariant.priceUSD, 'LBP')} (Rate: 89,500 L.L.)
                    </div>
                  )}
                </div>

                {product.originalPriceUSD && (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block line-through">
                      Was {formatPrice(product.originalPriceUSD, currency)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save ${(product.originalPriceUSD - currentVariant.priceUSD).toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Select Model / Storage / Color Variant:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      return (
                        <button
                          key={v.id}
                          id={`modal-variant-btn-${idx}`}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {v.colorHex && (
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" 
                                style={{ backgroundColor: v.colorHex }}
                              />
                            )}
                            <span className="text-xs font-semibold truncate">{v.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-900 shrink-0">
                            ${v.priceUSD}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-bold text-xs text-slate-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart (${currentVariant.priceUSD * quantity})</span>
                    </>
                  )}
                </button>

                <a
                  id="modal-whatsapp-order-btn"
                  href={`https://wa.me/96171135241?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {/* Share Product Link Button */}
              <button
                id="modal-share-product-btn"
                type="button"
                onClick={handleShare}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-2 cursor-pointer ${
                  shareStatus === 'copied'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-2xs'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 hover:border-blue-200 shadow-2xs'
                }`}
                title="Copy product link with ?product=ID to clipboard"
              >
                {shareStatus === 'copied' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-700">Product Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>Share (Copy Link)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Tabbed Specifications & Features Section */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs font-bold pb-1 cursor-pointer transition ${
                activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`text-xs font-bold pb-1 cursor-pointer transition ${
                activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`text-xs font-bold pb-1 cursor-pointer transition ${
                activeTab === 'delivery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lebanon Delivery & Warranty
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-500 block text-[11px] uppercase tracking-wider">{key}</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'features' && (
            <ul className="space-y-2.5 text-xs text-slate-700 bg-white p-4 rounded-xl border border-slate-200/80">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'delivery' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Delivery Guidelines for Lebanon</h4>
              <p>
                <strong>Dispatch & Coverage:</strong> Direct dispatch from Jadra Warehouse Store. Express delivery across Greater Beirut, Chouf, Mount Lebanon, Tripoli, Saida, Tyre, Nabatieh, and Bekaa within 24 to 48 hours.
              </p>
              <p>
                <strong>Warranty Claims:</strong> All sealed items include official agent barcode stickers. You can claim service directly at authorized brand centers in Lebanon (e.g. Apple Authorized, CTC Samsung, Xiaomi Lebanon) or through our Jadra Warehouse Store counter.
              </p>
            </div>
          )}
        </div>

        {/* Fullscreen High-Resolution Lightbox Overlay */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Top Bar */}
            <div className="flex items-center justify-between z-20 text-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{product.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
                  {activeImageIndex + 1} / {allImages.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Close lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Center Image Stage */}
            <div 
              className="relative flex-1 flex items-center justify-center overflow-hidden my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition cursor-pointer shadow-lg"
                  title="Previous image (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={allImages[activeImageIndex] || DEFAULT_PRODUCT_IMAGE}
                alt={`${product.name} high-res view ${activeImageIndex + 1}`}
                className="max-h-[75vh] max-w-[90vw] object-contain select-none"
                referrerPolicy="no-referrer"
              />

              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition cursor-pointer shadow-lg"
                  title="Next image (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Bottom Thumbnail Carousel */}
            {allImages.length > 1 && (
              <div 
                className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-20 scrollbar-none"
                onClick={(e) => e.stopPropagation()}
              >
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-14 h-14 rounded-xl border-2 p-1 bg-white/5 shrink-0 transition overflow-hidden cursor-pointer ${
                      activeImageIndex === i
                        ? 'border-blue-500 ring-2 ring-blue-500/50 opacity-100 scale-105'
                        : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${i + 1}`} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
