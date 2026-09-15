import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
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
  Images,
  ZoomIn,
  Scan,
  CircleDot,
  Camera,
  Zap,
  Box,
  Sparkles,
  Bell,
  Loader2,
  Send,
  Copy,
  RotateCcw,
  ZoomOut,
  Tag,
  Move
} from 'lucide-react';
import { Product, Currency, ProductVariant, ProductReview } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';
import { buildWhatsAppLink } from '../utils/phone';
import { extractProductVariantConfig, findBestMatchingVariant } from '../utils/variantUtils';
import { getProductSku } from '../utils/sku';
import { VisualStarRating } from './VisualStarRating';
import { CustomerReviews } from './CustomerReviews';
import { SpecsAccordion } from './SpecsAccordion';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { getStoredReviews, saveStoredReviews, INITIAL_REVIEWS_SEED } from '../data/initialReviews';
import { ProductDetailModalSkeleton } from './ProductDetailModalSkeleton';
import { FrequentlyBoughtTogether } from './FrequentlyBoughtTogether';
import { PRODUCTS } from '../data/products';
import { Model3DViewerModal, is3DSupported } from './Model3DViewerModal';
import { NotifyMeModal } from './NotifyMeModal';
import { hasUserRequestedNotification } from '../services/notificationService';
import { 
  prepareProductShareImageFile, 
  isWebShareSupported, 
  canShareFiles, 
  getSocialShareLinks 
} from '../utils/shareUtils';

/**
 * Fluid UI transition variants for ProductDetailModal
 * Engineered to match the store's fluid iOS/Tailwind spring-cubic physics curve [0.16, 1, 0.3, 1]
 */
export const modalBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

export const modalDialogVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 24,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 26,
      stiffness: 320,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 16,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

export const modalTabVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const modalLightboxVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1],
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.26,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  whatsappNumber?: string;
  isLoading?: boolean;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
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
  whatsappNumber = '+961 71 135 241',
  isLoading = false,
  allProducts = PRODUCTS,
  onSelectProduct,
}) => {
  if (isLoading || !product) {
    return <ProductDetailModalSkeleton onClose={onClose} />;
  }

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'delivery' | 'reviews'>('specs');
  const [added, setAdded] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'preparing' | 'copied' | 'shared'>('idle');
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isRestockAlertActive, setIsRestockAlertActive] = useState(false);

  // Check if current product qualifies for 3D/AR spatial preview
  const supports3D = useMemo(() => is3DSupported(product), [product]);

  // Extract structured variant configuration (Storage options & Color options)
  const variantConfig = useMemo(() => {
    return extractProductVariantConfig(product);
  }, [product]);

  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Sync selected storage and color when product changes
  useEffect(() => {
    if (!product) return;
    const firstVariant = product.variants?.[0];
    const initialStorage = firstVariant?.storage || variantConfig.storageOptions[0]?.capacity || '';
    const initialColor = firstVariant?.color || variantConfig.colorOptions[0]?.name || '';
    setSelectedStorage(initialStorage);
    setSelectedColor(initialColor);
    setSelectedVariantIndex(0);
  }, [product?.id]);

  const handleSelectStorage = (capacity: string) => {
    setSelectedStorage(capacity);
    if (!product?.variants || product.variants.length === 0) return;
    const match = findBestMatchingVariant(product.variants, capacity, selectedColor);
    if (match) {
      const idx = product.variants.findIndex((v) => v.id === match.id);
      if (idx !== -1) setSelectedVariantIndex(idx);
    }
  };

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    if (!product?.variants || product.variants.length === 0) return;
    const match = findBestMatchingVariant(product.variants, selectedStorage, colorName);
    if (match) {
      const idx = product.variants.findIndex((v) => v.id === match.id);
      if (idx !== -1) setSelectedVariantIndex(idx);
    }
  };

  // Product Reviews local state (scoped per product, persisted in localStorage)
  const [reviewsMap, setReviewsMap] = useState<Record<string, ProductReview[]>>(() => {
    return getStoredReviews();
  });

  const currentProductReviews = useMemo<ProductReview[]>(() => {
    if (!product) return [];
    if (reviewsMap[product.id] && reviewsMap[product.id].length > 0) {
      return reviewsMap[product.id];
    }
    const seed = INITIAL_REVIEWS_SEED[product.id] || INITIAL_REVIEWS_SEED.default;
    return seed.map((r, idx) => ({
      ...r,
      id: `seed-${product.id}-${idx}`,
      productId: product.id,
    }));
  }, [product, reviewsMap]);

  const handleAddReview = (newRev: Omit<ProductReview, 'id' | 'date'>) => {
    if (!product) return;
    const reviewObj: ProductReview = {
      ...newRev,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setReviewsMap((prev) => {
      const existing = prev[product.id] || currentProductReviews;
      const updated = {
        ...prev,
        [product.id]: [reviewObj, ...existing],
      };
      saveStoredReviews(updated);
      return updated;
    });
  };

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

  // Hover-to-magnify lens state for the main product image
  const [isLensActive, setIsLensActive] = useState(false);
  const [lensCoords, setLensCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(2.5); // 2x, 2.5x, 3.5x
  const [lensMode, setLensMode] = useState<'lens' | 'zoom'>('lens'); // 'lens' optical loupe vs 'zoom' whole-stage zoom
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom & pan interactive states for main product display
  const [stageZoom, setStageZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMouseDragging, setIsMouseDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchInitialDistRef = useRef<number | null>(null);
  const pinchInitialScaleRef = useRef<number>(1);
  const lastTapTimeRef = useRef<number>(0);

  const isZoomed = stageZoom > 1.05;

  const clampPan = (pan: { x: number; y: number }, scale: number) => {
    if (!imageContainerRef.current || scale <= 1.05) return { x: 0, y: 0 };
    const rect = imageContainerRef.current.getBoundingClientRect();
    const maxPanX = Math.max(0, (rect.width * (scale - 1)) / 2);
    const maxPanY = Math.max(0, (rect.height * (scale - 1)) / 2);
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, pan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, pan.y)),
    };
  };

  const resetZoom = () => {
    setStageZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setIsLensActive(false);
    setIsTouchDragging(false);
    setIsMouseDragging(false);
  };

  // Reset active image and lens state when product or image changes
  useEffect(() => {
    setActiveImageIndex(0);
    resetZoom();
  }, [product?.id]);

  useEffect(() => {
    resetZoom();
  }, [activeImageIndex]);

  const updateLensCoordinates = (clientX: number, clientY: number, isTouch = false) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // For touch devices, offset Y slightly upwards so user's finger/thumb does not obscure the lens
    const touchOffsetY = isTouch ? -45 : 0;
    
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top + touchOffsetY));
    
    setLensCoords({ x, y });
    setContainerDimensions({ width: rect.width, height: rect.height });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLensCoordinates(e.clientX, e.clientY, false);
    if (!isLensActive) setIsLensActive(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLensCoordinates(e.clientX, e.clientY, false);
    setIsLensActive(true);
  };

  const handleMouseLeave = () => {
    setIsLensActive(false);
    setIsTouchDragging(false);
  };

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

  const handleTouchStartLens = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length === 1) {
      const touch = e.targetTouches[0];
      updateLensCoordinates(touch.clientX, touch.clientY, true);
      setIsTouchDragging(true);
      setIsLensActive(true);
    }
    handleTouchStart(e);
  };

  const handleTouchMoveLens = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches.length === 1 && isTouchDragging) {
      const touch = e.targetTouches[0];
      updateLensCoordinates(touch.clientX, touch.clientY, true);
    }
    handleTouchMove(e);
  };

  const handleTouchEndLens = () => {
    setIsTouchDragging(false);
    setIsLensActive(false);
    handleTouchEnd();
  };

  // Pinch-to-zoom and pan gesture handlers for the main product image stage
  const handleStageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom initialization
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchInitialDistRef.current = dist;
      pinchInitialScaleRef.current = stageZoom;
      setIsLensActive(false);
      setIsTouchDragging(false);
      return;
    }

    if (e.touches.length === 1) {
      // Double tap detection
      const now = Date.now();
      if (now - lastTapTimeRef.current < 300) {
        lastTapTimeRef.current = 0;
        if (stageZoom > 1.05) {
          resetZoom();
        } else {
          setStageZoom(2.5);
          setLensMode('zoom');
        }
        return;
      }
      lastTapTimeRef.current = now;

      if (stageZoom > 1.05) {
        // Pan gesture when already zoomed in
        setIsTouchDragging(true);
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStartOffsetRef.current = { ...panOffset };
        setIsLensActive(false);
      } else {
        handleTouchStartLens(e);
      }
    }
  };

  const handleStageTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchInitialDistRef.current !== null) {
      // Pinching gesture
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = currentDist / pinchInitialDistRef.current;
      const nextScale = Math.min(4, Math.max(1, pinchInitialScaleRef.current * scaleFactor));
      setStageZoom(nextScale);
      if (nextScale <= 1.05) {
        setPanOffset({ x: 0, y: 0 });
      } else {
        setPanOffset((prev) => clampPan(prev, nextScale));
        if (lensMode !== 'zoom') setLensMode('zoom');
      }
      return;
    }

    if (e.touches.length === 1) {
      if (stageZoom > 1.05 && isTouchDragging) {
        // Panning gesture
        e.preventDefault();
        const dx = e.touches[0].clientX - dragStartRef.current.x;
        const dy = e.touches[0].clientY - dragStartRef.current.y;
        setPanOffset(clampPan({
          x: panStartOffsetRef.current.x + dx,
          y: panStartOffsetRef.current.y + dy
        }, stageZoom));
      } else if (stageZoom <= 1.05) {
        handleTouchMoveLens(e);
      }
    }
  };

  const handleStageTouchEnd = (_e: React.TouchEvent<HTMLDivElement>) => {
    if (pinchInitialDistRef.current !== null) {
      pinchInitialDistRef.current = null;
      if (stageZoom <= 1.05) {
        resetZoom();
      }
      return;
    }

    if (stageZoom > 1.05) {
      setIsTouchDragging(false);
    } else {
      handleTouchEndLens();
    }
  };

  const handleStageMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stageZoom > 1.05) {
      e.preventDefault();
      setIsMouseDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      panStartOffsetRef.current = { ...panOffset };
    }
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDragging && stageZoom > 1.05) {
      e.preventDefault();
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanOffset(clampPan({
        x: panStartOffsetRef.current.x + dx,
        y: panStartOffsetRef.current.y + dy
      }, stageZoom));
    } else {
      handleMouseMove(e);
    }
  };

  const handleStageMouseUp = () => {
    setIsMouseDragging(false);
  };

  const handleStageDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (stageZoom > 1.05) {
      resetZoom();
    } else {
      setStageZoom(2.5);
      setLensMode('zoom');
    }
  };

  const handleStageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      const delta = -e.deltaY * 0.005;
      setStageZoom((prev) => {
        const next = Math.min(4, Math.max(1, prev + delta));
        if (next <= 1.05) {
          setPanOffset({ x: 0, y: 0 });
        } else {
          setPanOffset((p) => clampPan(p, next));
          if (lensMode !== 'zoom') setLensMode('zoom');
        }
        return next;
      });
    }
  };

  const currentVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return {
        id: `${product.id}-default`,
        name: 'Standard Option',
        priceUSD: product.basePriceUSD || 0,
        inStock: product.inStock ?? true,
      };
    }
    return product.variants[selectedVariantIndex] || product.variants[0];
  }, [product, selectedVariantIndex]);

  const activeSku = useMemo(() => {
    return getProductSku(product, currentVariant);
  }, [product, currentVariant]);

  const [copiedSku, setCopiedSku] = useState(false);

  useEffect(() => {
    if (product) {
      setIsRestockAlertActive(hasUserRequestedNotification(product.id, currentVariant?.id));
    }
  }, [product, currentVariant?.id]);

  const hasStructuredVariants = useMemo(() => {
    return (
      (variantConfig.storageOptions.length > 0 || variantConfig.colorOptions.length > 0) &&
      product.variants.some((v) => Boolean(v.storage || v.color))
    );
  }, [variantConfig, product.variants]);

  // Stock check logic (checks product.inStock, stockCount, and variant availability)
  const isItemInStock = Boolean(
    product.inStock && 
    (product.stockCount === undefined || product.stockCount > 0) && 
    (currentVariant ? currentVariant.inStock !== false : true)
  );

  // Mock calculation for estimated delivery time based on stock status
  const estimatedDeliveryTime = useMemo(() => {
    return isItemInStock ? 'Delivery in 1-2 business days' : 'Delivery in 5-7 business days';
  }, [isItemInStock]);

  // Formatted estimated delivery arrival dates window
  const estimatedDeliveryDates = useMemo(() => {
    const addBusinessDays = (startDate: Date, days: number): Date => {
      let current = new Date(startDate);
      let added = 0;
      while (added < days) {
        current.setDate(current.getDate() + 1);
        const day = current.getDay();
        if (day !== 0 && day !== 6) { // Skip weekends
          added++;
        }
      }
      return current;
    };

    const today = new Date();
    const minDays = isItemInStock ? 1 : 5;
    const maxDays = isItemInStock ? 2 : 7;
    const minDate = addBusinessDays(today, minDays);
    const maxDate = addBusinessDays(today, maxDays);

    const formatOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${minDate.toLocaleDateString('en-US', formatOpts)} - ${maxDate.toLocaleDateString('en-US', formatOpts)}`;
  }, [isItemInStock]);

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

  // Handler and precomputed link for 'Direct WhatsApp Buy'
  // Skips the shopping cart entirely and directly triggers buildWhatsAppLink with the specific selected variant
  const handleDirectWhatsAppBuy = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!product || !currentVariant) return;

    const variantDetails: string[] = [];
    if (currentVariant.name && currentVariant.name !== 'Standard Option') {
      variantDetails.push(currentVariant.name);
    }
    if (currentVariant.storage) {
      variantDetails.push(`Storage: ${currentVariant.storage}`);
    }
    if (currentVariant.color) {
      variantDetails.push(`Color: ${currentVariant.color}`);
    }

    const variantSummary = variantDetails.length > 0 
      ? variantDetails.join(' | ') 
      : (currentVariant.name || 'Standard Specification');

    const unitPrice = currentVariant.priceUSD;
    const totalPrice = unitPrice * quantity;
    const lbpEstimate = (totalPrice * 89500).toLocaleString();

    const directBuyMessage = 
      `*DIRECT WHATSAPP BUY (FAST CHECKOUT)* ⚡\n` +
      `Hello ON-ALAA-STORE! 🇱🇧\n` +
      `I would like to purchase this product directly (skipping cart):\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `🏷️ *Product SKU:* ${activeSku}\n` +
      `🎯 *Selected Variant:* ${variantSummary}\n` +
      `🔢 *Quantity:* ${quantity}\n` +
      `💵 *Unit Price:* $${unitPrice}\n` +
      `💰 *Total Amount:* $${totalPrice} (≈ ${lbpEstimate} L.L.)\n` +
      `🚚 *Delivery Estimate:* ${estimatedDeliveryTime} (Lebanon Nationwide Express)\n` +
      `💳 *Payment Method:* Cash on Delivery (COD in USD or L.L.)\n\n` +
      `📍 *My Delivery Details:*\n` +
      `- Full Name: \n` +
      `- City & Region (Lebanon): \n` +
      `- Delivery Address: \n` +
      `- Contact Phone Number: \n\n` +
      `Please confirm stock availability and proceed with express delivery!`;

    const directUrl = buildWhatsAppLink(whatsappNumber, directBuyMessage);
    if (typeof window !== 'undefined') {
      window.open(directUrl, '_blank', 'noopener,noreferrer');
    }
    return directUrl;
  };

  const directWhatsAppBuyHref = useMemo(() => {
    if (!product || !currentVariant) return '#';

    const variantDetails: string[] = [];
    if (currentVariant.name && currentVariant.name !== 'Standard Option') {
      variantDetails.push(currentVariant.name);
    }
    if (currentVariant.storage) {
      variantDetails.push(`Storage: ${currentVariant.storage}`);
    }
    if (currentVariant.color) {
      variantDetails.push(`Color: ${currentVariant.color}`);
    }

    const variantSummary = variantDetails.length > 0 
      ? variantDetails.join(' | ') 
      : (currentVariant.name || 'Standard Specification');

    const unitPrice = currentVariant.priceUSD;
    const totalPrice = unitPrice * quantity;
    const lbpEstimate = (totalPrice * 89500).toLocaleString();

    const directBuyMessage = 
      `*DIRECT WHATSAPP BUY (FAST CHECKOUT)* ⚡\n` +
      `Hello ON-ALAA-STORE! 🇱🇧\n` +
      `I would like to purchase this product directly (skipping cart):\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `🏷️ *Product SKU:* ${activeSku}\n` +
      `🎯 *Selected Variant:* ${variantSummary}\n` +
      `🔢 *Quantity:* ${quantity}\n` +
      `💵 *Unit Price:* $${unitPrice}\n` +
      `💰 *Total Amount:* $${totalPrice} (≈ ${lbpEstimate} L.L.)\n` +
      `🚚 *Delivery Estimate:* ${estimatedDeliveryTime} (Lebanon Nationwide Express)\n` +
      `💳 *Payment Method:* Cash on Delivery (COD in USD or L.L.)\n\n` +
      `📍 *My Delivery Details:*\n` +
      `- Full Name: \n` +
      `- City & Region (Lebanon): \n` +
      `- Delivery Address: \n` +
      `- Contact Phone Number: \n\n` +
      `Please confirm stock availability and proceed with express delivery!`;

    return buildWhatsAppLink(whatsappNumber, directBuyMessage);
  }, [product, currentVariant, activeSku, quantity, whatsappNumber, estimatedDeliveryTime]);

  const socialLinks = useMemo(() => {
    if (!product) {
      return {
        whatsapp: '#',
        telegram: '#',
        facebook: '#',
        twitter: '#',
      };
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const shareUrl = `${origin}${pathname}?product=${encodeURIComponent(product.id)}`;
    const priceUSDFormatted = formatPrice(currentVariant.priceUSD, 'USD');
    const priceLBPFormatted = formatPrice(currentVariant.priceUSD, 'LBP');
    const activePriceFormatted = formatPrice(currentVariant.priceUSD, currency);

    return getSocialShareLinks({
      name: product.name,
      priceFormatted: activePriceFormatted,
      priceUSDFormatted,
      priceLBPFormatted,
      brand: product.brand,
      condition: product.condition,
      url: shareUrl,
      imageUrl: allImages[activeImageIndex] || product.image,
    });
  }, [product, currentVariant, currency, allImages, activeImageIndex]);

  const handleShare = async () => {
    if (!product) return;
    setShareStatus('preparing');

    // Generate clean product link with the active '?product=ID' query parameter
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    const shareUrl = url.toString();

    const priceUSDFormatted = formatPrice(currentVariant.priceUSD, 'USD');
    const priceLBPFormatted = formatPrice(currentVariant.priceUSD, 'LBP');
    const activePriceFormatted = formatPrice(currentVariant.priceUSD, currency);

    // Title and rich descriptive text including pricing, brand, and warranty
    const shareTitle = `${product.name} — ${activePriceFormatted}`;
    const shareText = `Check out ${product.name} on On Alaa Store!\nPrice: ${priceUSDFormatted} (≈ ${priceLBPFormatted})\nOfficial Lebanese Warranty • Fast Delivery across Lebanon\n${shareUrl}`;

    // Get current product image (either active carousel image or main image)
    const activeImg = allImages[activeImageIndex] || product.image || '';

    // Attempt to prepare image file for Level 2 Web Share API (native file sharing to WhatsApp, Instagram, Messenger, etc.)
    let imageFile: File | null = null;
    if (activeImg) {
      try {
        imageFile = await prepareProductShareImageFile(activeImg, product.name);
      } catch (err) {
        console.warn('Could not prepare image file for sharing:', err);
      }
    }

    // 1. Primary: Use the browser's native Web Share API
    if (isWebShareSupported()) {
      // If image file is available, check if browser supports sharing files
      if (imageFile && canShareFiles(imageFile)) {
        try {
          const shareDataWithFile: ShareData = {
            title: shareTitle,
            text: shareText,
            url: shareUrl,
            files: [imageFile],
          };

          await navigator.share(shareDataWithFile);
          setShareStatus('shared');
          setTimeout(() => setShareStatus('idle'), 3000);
          return;
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            setShareStatus('idle');
            return;
          }
          console.warn('Web Share API with image file failed, trying text & link share:', err);
        }
      }

      // Try sharing without file
      try {
        const basicShareData: ShareData = {
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        };

        if (!navigator.canShare || navigator.canShare(basicShareData)) {
          await navigator.share(basicShareData);
          setShareStatus('shared');
          setTimeout(() => setShareStatus('idle'), 3000);
          return;
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setShareStatus('idle');
          return;
        }
        console.warn('Web Share API standard call failed, falling back to clipboard:', err);
      }
    }

    // 2. Fallback: Copy link & price details to clipboard
    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
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
    setTimeout(() => setShareStatus('idle'), 3500);
  };

  // Geometric calculations for the magnifying lens effect
  const stageWidth = containerDimensions.width || 420;
  const stageHeight = containerDimensions.height || 420;
  // Adaptive lens diameter: 140px on narrow mobile stages, 175px on desktop/tablets
  const lensDiameter = stageWidth < 360 ? 140 : 175;
  const lensRadius = lensDiameter / 2;

  // Clamped outer position of the circular lens to stay cleanly within the stage container
  const clampedLensLeft = Math.max(0, Math.min(stageWidth - lensDiameter, lensCoords.x - lensRadius));
  const clampedLensTop = Math.max(0, Math.min(stageHeight - lensDiameter, lensCoords.y - lensRadius));

  // Cursor position inside the lens circle
  const cursorInLensX = lensCoords.x - clampedLensLeft;
  const cursorInLensY = lensCoords.y - clampedLensTop;

  // Exact mathematical alignment for the magnified image inside the lens:
  const magnifiedImgLeft = cursorInLensX - lensCoords.x * zoomLevel;
  const magnifiedImgTop = cursorInLensY - lensCoords.y * zoomLevel;

  // Target reticle / crop footprint on the base image:
  const cropSize = lensDiameter / zoomLevel;
  const cropLeft = lensCoords.x - cropSize / 2;
  const cropTop = lensCoords.y - cropSize / 2;

  return (
    <motion.div 
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      variants={modalBackdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        variants={modalDialogVariants}
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 pb-safe focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-8">
          
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
                {/* Main Featured Stage with Hover-to-Magnify Lens & Pinch-to-Zoom / Pan */}
                <div 
                  ref={imageContainerRef}
                  id="main-product-image-stage"
                  className={`relative aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden group select-none transition-colors ${
                    isZoomed 
                      ? 'cursor-grab active:cursor-grabbing bg-slate-100/50' 
                      : isLensActive 
                        ? 'cursor-crosshair bg-slate-100/70' 
                        : 'cursor-zoom-in'
                  }`}
                  onClick={() => {
                    if (isZoomed || isMouseDragging) return;
                    setIsLightboxOpen(true);
                  }}
                  onMouseDown={handleStageMouseDown}
                  onMouseMove={handleStageMouseMove}
                  onMouseUp={handleStageMouseUp}
                  onDoubleClick={handleStageDoubleClick}
                  onWheel={handleStageWheel}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => {
                    handleMouseLeave();
                    setIsMouseDragging(false);
                  }}
                  onTouchStart={handleStageTouchStart}
                  onTouchMove={handleStageTouchMove}
                  onTouchEnd={handleStageTouchEnd}
                >
                  {/* Base Product Image with Pinch, Pan & Zoom */}
                  <img
                    src={allImages[activeImageIndex] || DEFAULT_PRODUCT_IMAGE}
                    alt={`${product.name} - View ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain object-center will-change-transform pointer-events-none select-none"
                    style={{
                      transform: isZoomed
                        ? `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${stageZoom})`
                        : lensMode === 'zoom' && isLensActive
                          ? `scale(${zoomLevel})`
                          : 'scale(1)',
                      transformOrigin: isZoomed
                        ? 'center center'
                        : `${(lensCoords.x / (stageWidth || 1)) * 100}% ${(lensCoords.y / (stageHeight || 1)) * 100}%`,
                      transition: (isTouchDragging || isMouseDragging)
                        ? 'none'
                        : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                    }}
                  />

                  {/* Focus Target Crop Box on Base Image (shows what is inside the magnifying lens) */}
                  {!isZoomed && isLensActive && lensMode === 'lens' && (
                    <div
                      id="lens-focus-crop-box"
                      className="absolute pointer-events-none rounded-lg border-2 border-blue-500/70 bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.25)] z-10 transition-[width,height] duration-150"
                      style={{
                        width: `${cropSize}px`,
                        height: `${cropSize}px`,
                        left: `${cropLeft}px`,
                        top: `${cropTop}px`,
                      }}
                    >
                      {/* Precise corner reticle ticks */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-600 -translate-x-0.5 -translate-y-0.5" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-600 translate-x-0.5 -translate-y-0.5" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-600 -translate-x-0.5 translate-y-0.5" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-600 translate-x-0.5 translate-y-0.5" />
                    </div>
                  )}

                  {/* Optical Magnifying Lens Loupe */}
                  {!isZoomed && isLensActive && lensMode === 'lens' && (
                    <div
                      id="product-magnifier-lens"
                      className="absolute pointer-events-none z-30 rounded-full overflow-hidden border-2 border-white shadow-[0_16px_40px_rgba(0,0,0,0.38),0_0_0_1px_rgba(0,0,0,0.12)] ring-4 ring-blue-500/25 bg-white will-change-transform animate-in fade-in zoom-in-95 duration-100"
                      style={{
                        width: `${lensDiameter}px`,
                        height: `${lensDiameter}px`,
                        left: `${clampedLensLeft}px`,
                        top: `${clampedLensTop}px`,
                      }}
                    >
                      {/* High-Resolution Magnified Product Image inside the circular lens */}
                      <img
                        src={allImages[activeImageIndex] || DEFAULT_PRODUCT_IMAGE}
                        alt=""
                        className="absolute pointer-events-none object-contain select-none max-w-none max-h-none will-change-transform"
                        style={{
                          width: `${stageWidth * zoomLevel}px`,
                          height: `${stageHeight * zoomLevel}px`,
                          left: `${magnifiedImgLeft}px`,
                          top: `${magnifiedImgTop}px`,
                        }}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                        }}
                      />

                      {/* Precision Optical Reticle aligned exactly with the inspected pixel */}
                      <div
                        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
                        style={{
                          left: `${cursorInLensX}px`,
                          top: `${cursorInLensY}px`,
                        }}
                      >
                        <div className="w-5 h-5 rounded-full border border-blue-500/70 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-xs" />
                        </div>
                        {/* 4 Optical Crosshair Hairlines */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-blue-500/70" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-blue-500/70" />
                        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1.5 h-0.5 bg-blue-500/70" />
                        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1.5 h-0.5 bg-blue-500/70" />
                      </div>

                      {/* Optical Glass Flare Gloss Overlay */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-white/10 pointer-events-none" />

                      {/* Magnification Power Pill on Lens Rim */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-xs text-[10px] font-extrabold text-white shadow-md flex items-center gap-1 pointer-events-none border border-white/20 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span>{zoomLevel}x Lens</span>
                      </div>
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
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

                  {/* Lens & Zoom Controls Toolbar */}
                  <div 
                    className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Zoom Multipliers & Steppers */}
                    <div className="flex items-center bg-white/90 backdrop-blur-xs rounded-full p-0.5 border border-slate-200 shadow-xs">
                      <button
                        type="button"
                        id="zoom-out-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const next = Math.max(1, (isZoomed ? stageZoom : 1) - 0.5);
                          setStageZoom(next);
                          if (next <= 1.05) setPanOffset({ x: 0, y: 0 });
                          else setPanOffset((p) => clampPan(p, next));
                        }}
                        disabled={!isZoomed}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3 h-3" />
                      </button>

                      {[1.5, 2.5, 3.5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomLevel(lvl);
                            setStageZoom(lvl);
                            setLensMode('zoom');
                          }}
                          className={`hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] font-extrabold transition cursor-pointer ${
                            Math.abs(stageZoom - lvl) < 0.2 && isZoomed
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title={`Set zoom level to ${lvl}x`}
                        >
                          {lvl}x
                        </button>
                      ))}

                      <button
                        type="button"
                        id="zoom-in-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const next = Math.min(4, (isZoomed ? stageZoom : 1) + 0.5);
                          setStageZoom(next);
                          setLensMode('zoom');
                        }}
                        disabled={stageZoom >= 4}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Lens vs Stage Mode Toggle */}
                    <button
                      type="button"
                      onClick={() => setLensMode(prev => prev === 'lens' ? 'zoom' : 'lens')}
                      className={`h-7 px-2 rounded-full text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                        lensMode === 'lens'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-white/90 hover:bg-white text-slate-700 border-slate-200'
                      }`}
                      title={lensMode === 'lens' ? 'Switch to Stage Zoom' : 'Switch to Optical Lens'}
                    >
                      <Scan className="w-3 h-3 text-blue-600" />
                      <span className="hidden sm:inline">{lensMode === 'lens' ? 'Lens' : 'Stage'}</span>
                    </button>

                    {/* View in 3D / AR Quick Button */}
                    {supports3D && (
                      <button
                        type="button"
                        id="stage-3d-ar-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIs3DModalOpen(true);
                        }}
                        className="h-7 px-2 sm:px-2.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xs flex items-center gap-1 transition cursor-pointer"
                        title="View in 3D & Augmented Reality"
                      >
                        <Box className="w-3 h-3" />
                        <span>3D/AR</span>
                      </button>
                    )}

                    {/* Lightbox Fullscreen Action Button */}
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-xs border border-slate-200 flex items-center justify-center transition opacity-80 hover:opacity-100 cursor-pointer"
                      title="Open Fullscreen Lightbox"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Floating Reset Zoom Button - Appears ONLY when image is zoomed in */}
                  <AnimatePresence>
                    {isZoomed && (
                      <motion.button
                        key="floating-reset-zoom-button"
                        id="modal-reset-zoom-button"
                        type="button"
                        initial={{ opacity: 0, y: 14, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetZoom();
                        }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-white/20 hover:border-white/40 cursor-pointer transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Reset zoom to original view"
                        aria-label="Reset zoom to original view"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-400 group-hover:-rotate-90 transition-transform duration-200" />
                        <span>Reset Zoom</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-500/30 text-[10px] font-mono text-blue-200 font-bold border border-blue-400/30">
                          {stageZoom.toFixed(1)}x
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Visual Feedback Indicator Pill */}
                  <div 
                    id="zoom-indicator-pill"
                    className={`absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold pointer-events-none transition-all duration-200 ${
                      isZoomed
                        ? 'bg-blue-600 text-white shadow-md scale-105 opacity-100'
                        : isLensActive 
                          ? 'bg-blue-600 text-white shadow-md scale-105 opacity-100' 
                          : 'bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200 shadow-2xs opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isZoomed ? (
                      <>
                        <Move className="w-3 h-3 text-white animate-pulse" />
                        <span>{stageZoom.toFixed(1)}x Zoom • Drag to pan • Pinch to zoom</span>
                      </>
                    ) : isLensActive ? (
                      <>
                        <CircleDot className="w-3 h-3 text-white animate-pulse" />
                        <span>{zoomLevel}x Lens Active • Move to inspect</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3 h-3 text-blue-600" />
                        <span>Pinch or double-tap to zoom • Hover lens</span>
                      </>
                    )}
                  </div>

                  {/* Previous / Next Arrows on Main Stage */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Counter Badge */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-20 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none">
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

            {/* View in 3D / AR Interactive Banner Button */}
            {supports3D && (
              <button
                type="button"
                id="btn-view-in-3d-ar"
                onClick={() => setIs3DModalOpen(true)}
                className="w-full group p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-zinc-950 via-slate-900 to-blue-950 text-white border border-blue-500/30 hover:border-blue-400 shadow-md hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Box className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white tracking-tight">View in 3D / AR</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Interactive
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      Rotate 360°, inspect hardware nodes, or test scale in your space
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all shrink-0">
                  <span className="hidden sm:inline">Launch</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </button>
            )}

            {/* Quick Guarantees Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span id="modal-guarantee-delivery-estimate">
                  {estimatedDeliveryTime} • Lebanon Nationwide
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
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
                    disabled={shareStatus === 'preparing'}
                    className={`p-2 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                      shareStatus === 'shared' || shareStatus === 'copied'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600 ring-2 ring-emerald-500/20'
                        : shareStatus === 'preparing'
                        ? 'border-blue-300 bg-blue-50 text-blue-600 ring-2 ring-blue-500/20 cursor-wait'
                        : 'border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                    title={
                      shareStatus === 'preparing'
                        ? 'Preparing Web Share sheet...'
                        : shareStatus === 'shared'
                        ? 'Shared successfully!'
                        : shareStatus === 'copied'
                        ? 'Product link copied to clipboard!'
                        : 'Share product via Web Share API'
                    }
                    aria-label="Share product"
                  >
                    {shareStatus === 'preparing' ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : shareStatus === 'shared' || shareStatus === 'copied' ? (
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

              {/* SKU Identifier */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="modal-product-sku-badge"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeSku);
                    setCopiedSku(true);
                    setTimeout(() => setCopiedSku(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-mono text-xs font-semibold transition cursor-pointer group shadow-2xs"
                  title="Click to copy exact SKU for WhatsApp orders"
                >
                  <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-slate-500 font-sans text-[11px] font-bold">SKU:</span>
                  <span className="text-slate-900 group-hover:text-blue-900 font-bold tracking-wide">{activeSku}</span>
                  {copiedSku ? (
                    <span className="text-[10px] text-emerald-600 font-sans font-bold flex items-center gap-0.5 ml-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </span>
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600 ml-0.5 transition" />
                  )}
                </button>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Quote SKU on WhatsApp for fast order confirmation
                </span>
              </div>

              {/* Reviews & Condition */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <VisualStarRating
                  id="modal-visual-star-rating"
                  rating={product.rating}
                  size="sm"
                  showScore={true}
                  showReviewCount={true}
                  reviewCount={currentProductReviews.length || product.reviewCount}
                  onClick={() => setActiveTab('reviews')}
                />
                <button
                  type="button"
                  id="modal-social-proof-pill"
                  onClick={() => setActiveTab('reviews')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/90 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-bold transition cursor-pointer shadow-2xs"
                  title="View verified customer unboxing photos and feedback"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Verified Reviews</span>
                  <span className="text-blue-300">•</span>
                  <Camera className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Buyer Photos</span>
                </button>
                <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md border border-emerald-200/60 font-semibold">
                  {product.condition}
                </span>
                <span className="text-slate-500">
                  Status: <strong className={isItemInStock ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                    {isItemInStock ? "In Stock (Warehouse Lebanon)" : "Out of Stock"}
                  </strong>
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

              {/* Estimated Delivery Time Card (Calculated based on stock availability) */}
              <div 
                id="modal-delivery-estimate-card"
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                  isItemInStock 
                    ? 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950' 
                    : 'bg-amber-50/70 border-amber-200/90 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isItemInStock ? 'bg-emerald-600 text-white shadow-xs' : 'bg-amber-500 text-white shadow-xs'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {estimatedDeliveryTime}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isItemInStock 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isItemInStock ? 'In Stock' : 'Restocking'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isItemInStock
                        ? 'Ships directly via express courier across all Lebanon cities.'
                        : 'Currently out of stock. Orders placed now will dispatch upon warehouse restock.'}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Est. Arrival
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {estimatedDeliveryDates}
                  </span>
                </div>
              </div>

              {/* Structured Storage & Color Variant Selector */}
              {hasStructuredVariants ? (
                <div className="space-y-4 pt-1">
                  {/* 1. Storage Capacity Memory Tiers */}
                  {variantConfig.storageOptions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          <span>Internal Storage Capacity:</span>
                          <span className="text-blue-600 font-mono font-extrabold lowercase">
                            {selectedStorage || currentVariant.storage || ''}
                          </span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">Tiered Pricing</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {variantConfig.storageOptions.map((opt) => {
                          const isSelected = (selectedStorage || currentVariant.storage)?.toLowerCase() === opt.capacity.toLowerCase();
                          // Calculate price for this storage with currently selected color
                          const matchingVar = findBestMatchingVariant(product.variants, opt.capacity, selectedColor);
                          const tierPrice = matchingVar?.priceUSD ?? opt.priceUSD;
                          const tierInStock = matchingVar ? matchingVar.inStock : opt.inStock !== false;

                          return (
                            <button
                              key={opt.capacity}
                              type="button"
                              id={`modal-storage-btn-${opt.capacity.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                              onClick={() => handleSelectStorage(opt.capacity)}
                              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between gap-1 relative cursor-pointer ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-extrabold text-xs font-mono tracking-tight text-slate-900">
                                  {opt.capacity}
                                </span>
                                {isSelected && (
                                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[11px] pt-0.5">
                                <span className="font-bold text-slate-900">
                                  {formatPrice(tierPrice, currency)}
                                </span>
                                {!tierInStock && (
                                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                                    Restocking
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Device Color Swatches */}
                  {variantConfig.colorOptions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          <span>Finish & Color:</span>
                          <span className="text-slate-900 font-extrabold">
                            {selectedColor || currentVariant.color || ''}
                          </span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">Official Finish</span>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        {variantConfig.colorOptions.map((cOpt) => {
                          const isSelected = (selectedColor || currentVariant.color)?.toLowerCase() === cOpt.name.toLowerCase();
                          const matchingVar = findBestMatchingVariant(product.variants, selectedStorage, cOpt.name);
                          const colorInStock = matchingVar ? matchingVar.inStock : true;

                          return (
                            <button
                              key={cOpt.name}
                              type="button"
                              id={`modal-color-btn-${cOpt.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                              onClick={() => handleSelectColor(cOpt.name)}
                              title={`${cOpt.name} - ${colorInStock ? 'In Stock' : 'Restocking'}`}
                              className={`group px-3 py-2 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold shadow-xs'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs transition group-hover:scale-110 ${
                                  isSelected ? 'ring-2 ring-blue-600 ring-offset-1 scale-110' : ''
                                }`}
                                style={{ backgroundColor: cOpt.hex || '#383838' }}
                              />
                              <span className="text-xs font-medium truncate max-w-[130px]">
                                {cOpt.name}
                              </span>
                              {!colorInStock && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Restocking" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected SKU summary banner */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Active Selection:</span>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      {currentVariant.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: currentVariant.colorHex }}
                        />
                      )}
                      <span>{currentVariant.name}</span>
                      <span className="text-blue-600 font-mono">({formatPrice(currentVariant.priceUSD, currency)})</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback for products without split storage/colors */
                product.variants.length > 0 && (
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
                              {formatPrice(v.priceUSD, currency)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
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
                {!isItemInStock ? (
                  <>
                    <button
                      type="button"
                      id="modal-notify-when-available-btn"
                      onClick={() => setIsNotifyModalOpen(true)}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                        isRestockAlertActive
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 active:scale-98'
                      }`}
                      title="Receive a restock alert on WhatsApp or Email as soon as this item arrives"
                    >
                      {isRestockAlertActive ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Restock Alert Set (Click to View)</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
                          <span>Notify Me When Available</span>
                        </>
                      )}
                    </button>

                    <a
                      id="modal-inquire-restock-whatsapp-btn"
                      href={buildWhatsAppLink(
                        whatsappNumber,
                        `Hello On Alaa Store! 🇱🇧\nI want to inquire about restocking for:\n• SKU: ${activeSku}\n• ${product.name}\n• Variant: ${currentVariant.name}\n\nCould you please share the expected arrival date? Thank you!`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition flex items-center justify-center gap-2 shadow-md cursor-pointer group border border-slate-700"
                      title="Inquire expected restock date directly on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="font-extrabold tracking-tight">Ask ETA on WhatsApp</span>
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      id="modal-add-to-cart-btn"
                      onClick={handleAddToCart}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                        added
                          ? 'bg-emerald-600 text-white cursor-pointer'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
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
                      id="modal-direct-whatsapp-buy-btn"
                      data-testid="modal-direct-whatsapp-buy-btn"
                      href={directWhatsAppBuyHref}
                      onClick={handleDirectWhatsAppBuy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 cursor-pointer group"
                      title="Direct WhatsApp Buy: Skip cart and order this specific variant directly on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="font-extrabold tracking-tight">Direct WhatsApp Buy</span>
                      <span className="text-[10px] uppercase font-black bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-100 shrink-0">
                        Skip Cart
                      </span>
                    </a>
                  </>
                )}
              </div>

              {/* Purchase / Restock Status Notice */}
              {!isItemInStock ? (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Warehouse Restock Alert: Enter your email or WhatsApp to receive notification the moment inventory is replenished.
                  </span>
                  <span className="font-bold text-amber-700 whitespace-nowrap ml-2">Zero Spam</span>
                </div>
              ) : (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-600/20" />
                    Direct WhatsApp Buy orders <span className="font-bold text-slate-900 underline decoration-emerald-500/50">{currentVariant.name}</span> instantly without adding to cart
                  </span>
                  <span className="font-bold text-emerald-700 whitespace-nowrap ml-2">Cash on Delivery</span>
                </div>
              )}

              {/* Share via Web Share API & Social Platforms */}
              <div className="space-y-2 pt-0.5">
                <button
                  id="modal-share-product-btn"
                  type="button"
                  onClick={handleShare}
                  disabled={shareStatus === 'preparing'}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs ${
                    shareStatus === 'shared' || shareStatus === 'copied'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : shareStatus === 'preparing'
                      ? 'border-blue-200 bg-blue-50/70 text-blue-700 cursor-wait'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:text-blue-600 hover:border-blue-300'
                  }`}
                  title="Share product link, high-res image, and current price directly to social apps via Web Share API"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {shareStatus === 'preparing' ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : shareStatus === 'shared' ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : shareStatus === 'copied' ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Share2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                    <div className="text-left truncate">
                      <div className="font-bold leading-tight">
                        {shareStatus === 'preparing'
                          ? 'Preparing Share Sheet...'
                          : shareStatus === 'shared'
                          ? 'Shared to Social Apps!'
                          : shareStatus === 'copied'
                          ? 'Link & Price Copied to Clipboard!'
                          : 'Share Product'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal leading-tight">
                        Web Share API • Includes link, photo & live price
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {formatPrice(currentVariant.priceUSD, currency)}
                    </span>
                  </div>
                </button>

                {/* Direct Social App Shortcuts */}
                <div className="flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-[11px]">
                  <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider pl-0.5">
                    Quick Share:
                  </span>
                  <div className="flex items-center gap-1">
                    <a
                      href={socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 font-semibold border border-slate-200 hover:border-emerald-200 transition flex items-center gap-1 text-[11px]"
                      title="Share product with price and photo link to WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-white hover:bg-sky-50 text-sky-700 font-semibold border border-slate-200 hover:border-sky-200 transition flex items-center gap-1 text-[11px]"
                      title="Share product to Telegram"
                    >
                      <Send className="w-3 h-3 text-sky-600" />
                      <span>Telegram</span>
                    </a>
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-700 font-semibold border border-slate-200 hover:border-blue-200 transition flex items-center gap-1 text-[11px]"
                      title="Share product to Facebook"
                    >
                      <span>Facebook</span>
                    </a>
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 font-semibold border border-slate-200 hover:border-zinc-300 transition flex items-center gap-1 text-[11px]"
                      title="Share product to X"
                    >
                      <span>X</span>
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        const origin = typeof window !== 'undefined' ? window.location.origin : '';
                        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
                        const shareUrl = `${origin}${pathname}?product=${encodeURIComponent(product.id)}`;
                        try {
                          await navigator.clipboard.writeText(shareUrl);
                          setShareStatus('copied');
                          setTimeout(() => setShareStatus('idle'), 3000);
                        } catch {
                          handleShare();
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition flex items-center gap-1 text-[11px] cursor-pointer"
                      title="Copy product link to clipboard"
                    >
                      <Copy className="w-3 h-3 text-slate-600" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* View in 3D / AR Interactive Button */}
              {supports3D && (
                <button
                  id="modal-view-in-3d-ar-btn"
                  type="button"
                  onClick={() => setIs3DModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-zinc-950 via-slate-900 to-blue-950 hover:from-black hover:to-blue-900 text-white border border-blue-500/30 hover:border-blue-400 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Box className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>View in 3D & Augmented Reality</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Frequently Bought Together (Related Accessories) Section */}
        <div className="border-t border-slate-200/90 bg-white p-5 sm:p-7">
          <FrequentlyBoughtTogether
            product={product}
            currentVariant={currentVariant}
            currency={currency}
            allProducts={allProducts}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
            whatsappNumber={whatsappNumber}
          />
        </div>

        {/* Tabbed Specifications & Features Section */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs font-bold pb-1 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`text-xs font-bold pb-1 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'features' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`text-xs font-bold pb-1 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'delivery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lebanon Delivery & Warranty
            </button>
            <button
              id="modal-reviews-tab-btn"
              onClick={() => setActiveTab('reviews')}
              className={`text-xs font-bold pb-1 cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Verified Customer Reviews</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                activeTab === 'reviews' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {currentProductReviews.length}
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={modalTabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === 'specs' && (
                <SpecsAccordion
                  specs={product.specs}
                  productName={product.name}
                />
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

              {activeTab === 'reviews' && (
                <CustomerReviews
                  product={product}
                  reviews={currentProductReviews}
                  onAddReview={handleAddReview}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fullscreen High-Resolution Lightbox Overlay */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div 
              variants={modalLightboxVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
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
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* 3D Model & Augmented Reality Spatial Viewer Modal */}
      <AnimatePresence>
        {is3DModalOpen && (
          <Model3DViewerModal
            product={product}
            currency={currency}
            onClose={() => setIs3DModalOpen(false)}
            onAddToCart={onAddToCart}
            whatsappNumber={whatsappNumber}
          />
        )}
      </AnimatePresence>

      {/* Restock Notification Alert Modal */}
      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        product={product}
        variant={currentVariant}
        theme="light"
        whatsappNumber={whatsappNumber}
        onNotificationSaved={() => setIsRestockAlertActive(true)}
      />
    </motion.div>
  );
};
