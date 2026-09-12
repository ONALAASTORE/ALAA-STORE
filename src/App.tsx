import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  X,
  Grid2X2,
  Square,
} from 'lucide-react';
import { Currency, Product, CartItem, ProductVariant, FilterState, StoreSettings } from './types';
import { PRODUCTS } from './data/products';
import { CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RecentlyViewedSlider } from './components/RecentlyViewedSlider';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CompareModal } from './components/CompareModal';
import { TradeInModal } from './components/TradeInModal';
import { WishlistModal } from './components/WishlistModal';
import { ContactModal } from './components/ContactModal';
import { EmptyProductsState } from './components/EmptyProductsState';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileFilterDrawer } from './components/MobileFilterDrawer';
import { FilterPanelContent } from './components/FilterPanelContent';
import { getProductImages } from './utils/productImages';
import { CategoryIcon } from './utils/categoryIcons';
import { Showroom2027View } from './components/showroom2027/Showroom2027View';
import { decodeWishlistIds } from './utils/wishlistShare';
import { SpecialOffersPage } from './components/SpecialOffersPage';
import { getDiscountedProducts } from './utils/dealUtils';
import { AccountModal } from './components/AccountModal';
import { CategoryQuickLinks } from './components/CategoryQuickLinks';
import { FlashDealsRow } from './components/FlashDealsRow';
import { ProductFeedTabs } from './components/ProductFeedTabs';

const CART_STORAGE_KEY = 'on_alaa_store_cart';
const WISHLIST_STORAGE_KEY = 'on_alaa_store_wishlist';
const PRODUCTS_STORAGE_KEY = 'on_alaa_store_products';
const SETTINGS_STORAGE_KEY = 'on_alaa_store_settings';
const RECENTLY_VIEWED_STORAGE_KEY = 'on_alaa_store_recently_viewed';
const SHOWROOM_STORAGE_KEY = 'on_alaa_store_showroom_2027';

const DEFAULT_SETTINGS: StoreSettings = {
  topBannerText: 'Available delivery to all Lebanon 🚚 (Beirut, Tripoli, Saida, Bekaa)',
  isTopBannerActive: true,
  marketingVideoUrl: 'https://www.youtube.com/watch?v=eDqfg_LexCQ',
  marketingVideoTitle: 'Apple iPhone 16 Pro Cinematic Showcase',
  isMarketingVideoActive: true,
  exchangeRateLBP: 89500,
  whatsappNumber: '+961 71 135 241',
  supportEmail: 'alaastoreon@gmail.com',
  adminProfilePicture: '',
  adminName: 'Alaa (Store Admin)',
};

// Smooth, fluid framer-motion transition variants between views
const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const CURRENCY_STORAGE_KEY = 'on_alaa_store_currency';
const THEME_STORAGE_KEY = 'on_alaa_store_theme';

export function App() {
  // Theme state ('dark' | 'light') with modern blue & black tech aesthetic default
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Routing View state ('store' | 'offers' | 'admin-login' | 'admin')
  const [currentRoute, setCurrentRoute] = useState<'store' | 'offers' | 'admin-login' | 'admin'>(() => {
    const hash = window.location.hash.toLowerCase();
    const isAuth = localStorage.getItem('on_alaa_admin_auth') === 'true';
    if (hash === '#admin' || hash === '#/admin') {
      return isAuth ? 'admin' : 'admin-login';
    }
    if (hash === '#admin-login' || hash === '#/admin/login' || hash === '#login') {
      return 'admin-login';
    }
    if (hash === '#offers' || hash === '#/offers' || hash === '#deals' || hash === '#special-offers') {
      return 'offers';
    }
    return 'store';
  });

  // Currency state (USD or LBP) with persistence
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return saved === 'LBP' || saved === 'USD' ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  // Dynamic Product Catalog State
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Global Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare state
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    brand: 'All Brands',
    minPriceUSD: 0,
    maxPriceUSD: 3000,
    condition: 'all',
    onlyInStock: false,
    sortBy: 'featured',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // Mobile grid column layout state (1 column or 2 columns on mobile screens)
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2>(2);

  // Active modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Shared Wishlist from URL state (?wishlist=...)
  const [sharedWishlistIds, setSharedWishlistIds] = useState<string[] | null>(null);
  const [isViewingSharedWishlist, setIsViewingSharedWishlist] = useState(false);

  // Recently Viewed products list (stored in sessionStorage, max 5 items)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const raw = sessionStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map((id) => productsList.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds, productsList]);

  // 2027 Cutting-Edge 3D Showroom Mode state (Default to Ishtari storefront layout)
  const [showroomMode, setShowroomMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SHOWROOM_STORAGE_KEY);
      return saved === 'true'; // Default to false (Ishtari Storefront Mode)
    } catch {
      return false;
    }
  });

  const handleToggleShowroom = (enabled: boolean) => {
    setShowroomMode(enabled);
    try {
      localStorage.setItem(SHOWROOM_STORAGE_KEY, enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  // Hash route listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const isAuth = localStorage.getItem('on_alaa_admin_auth') === 'true';
      if (hash === '#admin' || hash === '#/admin') {
        if (isAuth) {
          setCurrentRoute('admin');
        } else {
          window.location.hash = '#/admin/login';
          setCurrentRoute('admin-login');
        }
      } else if (hash === '#admin-login' || hash === '#/admin/login' || hash === '#login') {
        setCurrentRoute('admin-login');
      } else if (hash === '#offers' || hash === '#/offers' || hash === '#deals' || hash === '#special-offers') {
        setCurrentRoute('offers');
      } else if (hash === '' || hash === '#' || hash === '#/' || hash === '#store') {
        setCurrentRoute('store');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save Products to local storage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsList));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [productsList]);

  // Save Currency to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch (e) {
      console.error('Failed to save currency to localStorage', e);
    }
  }, [currency]);

  // Save Store Settings to local storage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(storeSettings));
    } catch (e) {
      console.error('Failed to save store settings to localStorage', e);
    }
  }, [storeSettings]);

  // Save Cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Save Wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Support direct product link sharing (URL query ?product=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId) {
        const found = productsList.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
        }
      }

      // Support shared wishlist link (?wishlist=...)
      const encodedWishlist = params.get('wishlist');
      if (encodedWishlist) {
        const decoded = decodeWishlistIds(encodedWishlist);
        if (decoded.length > 0) {
          setSharedWishlistIds(decoded);
          setIsViewingSharedWishlist(true);
          setIsWishlistOpen(true);
        }
      }
    } catch {
      // ignore
    }
  }, [productsList]);

  // Dynamic SEO Title and Meta Description Injection
  useEffect(() => {
    let title = 'ON ALAA STORE | Premium Electronics & Tech in Lebanon';
    let description = 'Premium electronics and smart devices storefront for the Lebanese market with dual USD/LBP pricing, WhatsApp ordering, and fast delivery.';
    let ogType = 'website';
    let ogImage = '';

    if (selectedProduct) {
      title = `${selectedProduct.name} | On Alaa Store Lebanon`;
      const cleanDesc = selectedProduct.description
        ? selectedProduct.description.replace(/\s+/g, ' ').trim()
        : '';
      description = cleanDesc
        ? `Buy ${selectedProduct.name} at On Alaa Store in Lebanon. ${cleanDesc.length > 140 ? cleanDesc.slice(0, 137) + '...' : cleanDesc}`
        : `Buy ${selectedProduct.name} at On Alaa Store in Lebanon. Dual USD/LBP pricing, express courier delivery, and official warranty.`;
      ogType = 'product';
      const prodImages = getProductImages(selectedProduct);
      ogImage = prodImages[0] || '';
    } else if (currentRoute === 'admin') {
      title = 'Admin Dashboard | On Alaa Store Lebanon';
      description = 'Administrator control center for On Alaa Store. Manage product catalog, inventory, exchange rates, and store settings.';
    } else if (currentRoute === 'admin-login') {
      title = 'Admin Portal Login | On Alaa Store Lebanon';
      description = 'Secure admin sign-in portal for On Alaa Store management.';
    } else if (currentRoute === 'offers') {
      title = 'Special Offers & Hot Deals | ON ALAA STORE Lebanon';
      description = 'Discover genuine discounted prices, hot deals, and exclusive promotional offers on smartphones, MacBooks, gaming consoles, and audio gear at ON ALAA STORE Lebanon.';
    } else if (isCheckoutOpen) {
      title = 'Order Checkout | On Alaa Store Lebanon';
      description = 'Complete your electronics order with fast cash-on-delivery across all regions of Lebanon.';
    } else if (isCartOpen) {
      title = 'Shopping Cart | On Alaa Store Lebanon';
      description = 'Review items in your shopping cart with dual USD and LBP conversion at On Alaa Store.';
    } else if (isWishlistOpen) {
      title = 'Saved Wishlist | On Alaa Store Lebanon';
      description = 'View and manage your saved electronics and smart devices at On Alaa Store.';
    } else if (isCompareOpen) {
      title = 'Compare Products | On Alaa Store Lebanon';
      description = 'Side-by-side technical comparison of smartphones, gadgets, and tech gear at On Alaa Store.';
    } else if (isTradeInOpen) {
      title = 'Device Trade-In Estimation | On Alaa Store Lebanon';
      description = 'Calculate estimated trade-in value for your used smartphone, tablet, or laptop in Lebanon.';
    } else if (isContactOpen) {
      title = 'Contact & WhatsApp Support | On Alaa Store Lebanon';
      description = 'Reach On Alaa Store for inquiries, WhatsApp orders, warranty service, and nationwide delivery support.';
    } else if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.trim();
      title = `Search: "${q}" | On Alaa Store Lebanon`;
      description = `Explore search results for "${q}" with competitive USD/LBP pricing and nationwide Lebanon delivery at On Alaa Store.`;
    } else if (filterState.category !== 'all') {
      const catObj = CATEGORIES.find((c) => c.id === filterState.category);
      const catName = catObj ? catObj.name : filterState.category;
      title = `${catName} in Lebanon | On Alaa Store`;
      description = `Shop premium ${catName} at On Alaa Store. Official warranty, fast delivery across Lebanon, and cash on delivery in USD/LBP.`;
    } else if (filterState.brand !== 'All Brands') {
      title = `${filterState.brand} Products in Lebanon | On Alaa Store`;
      description = `Browse authentic ${filterState.brand} smartphones, gadgets, and tech accessories at On Alaa Store Lebanon.`;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to create or update meta tags in document head
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Dynamically inject/update standard meta description
    setMetaTag('name', 'description', description);

    // 4. Update Open Graph and Twitter Card tags for social & search indexing
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
  }, [
    selectedProduct,
    currentRoute,
    isCheckoutOpen,
    isCartOpen,
    isWishlistOpen,
    isCompareOpen,
    isTradeInOpen,
    isContactOpen,
    filterState.searchQuery,
    filterState.category,
    filterState.brand,
  ]);

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);

    // Save to recently viewed list (max 5 items, latest first)
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== product.id);
      const updated = [product.id, ...filtered].slice(0, 5);
      try {
        sessionStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recently viewed to sessionStorage', e);
      }
      return updated;
    });

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('product', product.id);
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    } catch {
      // ignore
    }
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('product')) {
        url.searchParams.delete('product');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      }
    } catch {
      // ignore
    }
  };

  // Route Handlers
  const handleNavigateToAdmin = () => {
    const isAuth = localStorage.getItem('on_alaa_admin_auth') === 'true';
    if (isAuth) {
      window.location.hash = '#/admin';
      setCurrentRoute('admin');
    } else {
      window.location.hash = '#/admin/login';
      setCurrentRoute('admin-login');
    }
  };

  const handleAdminLoginSuccess = () => {
    window.location.hash = '#/admin';
    setCurrentRoute('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('on_alaa_admin_auth');
    localStorage.removeItem('on_alaa_admin_auth_time');
    window.location.hash = '#/admin/login';
    setCurrentRoute('admin-login');
  };

  const handleNavigateToStore = () => {
    window.location.hash = '';
    setCurrentRoute('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToOffers = () => {
    window.location.hash = '#offers';
    setCurrentRoute('offers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Discounted products count for promotional badges
  const discountedProductsCount = useMemo(() => {
    return getDiscountedProducts(productsList).length;
  }, [productsList]);

  // Cart operations
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const chosenVariant = variant || product.variants?.[0] || {
      id: `${product.id}-std`,
      name: 'Standard Option',
      priceUSD: product.basePriceUSD,
      inStock: product.inStock
    };
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === chosenVariant.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, selectedVariant: chosenVariant, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant?.id === variantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant?.id === variantId)
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSaveSharedWishlist = () => {
    if (sharedWishlistIds && sharedWishlistIds.length > 0) {
      setWishlistIds((prev) => Array.from(new Set([...prev, ...sharedWishlistIds])));
      setIsViewingSharedWishlist(false);
    }
  };

  const handleAddAllWishlistToCart = (productsToAdd: Product[]) => {
    productsToAdd.forEach((p) => {
      handleAddToCart(p, p.variants?.[0], 1);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  // Compare operations
  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 devices at a time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCompare = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      // Search query filter
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (filterState.category !== 'all') {
        const prodCat = (p.category || '').toLowerCase();
        const selCat = filterState.category.toLowerCase();
        const catObj = CATEGORIES.find((c) => c.id === filterState.category);
        const catName = catObj ? catObj.name.toLowerCase() : '';

        const matchesCat =
          prodCat === selCat ||
          (catName && prodCat === catName) ||
          (selCat === 'racing-wheel' && (prodCat === 'racing-wheels' || prodCat === 'racing wheel' || prodCat === 'racing_wheel')) ||
          (selCat === 'smartwatches-accessories' && (prodCat === 'wearables' || prodCat === 'smartwatches')) ||
          (selCat === 'wearables' && (prodCat === 'smartwatches-accessories' || prodCat === 'smartwatches'));

        if (!matchesCat) {
          return false;
        }
      }

      // Brand filter
      if (
        filterState.brand !== 'All Brands' &&
        p.brand.toLowerCase() !== filterState.brand.toLowerCase()
      ) {
        return false;
      }

      // Price filter
      if (p.basePriceUSD < filterState.minPriceUSD || p.basePriceUSD > filterState.maxPriceUSD) {
        return false;
      }

      // Condition filter
      if (filterState.condition !== 'all' && p.condition !== filterState.condition) {
        return false;
      }

      // Stock filter
      if (filterState.onlyInStock && !p.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') {
        return a.basePriceUSD - b.basePriceUSD;
      }
      if (filterState.sortBy === 'price-desc') {
        return b.basePriceUSD - a.basePriceUSD;
      }
      if (filterState.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filterState.sortBy === 'newest') {
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      }
      // default: featured
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [productsList, filterState]);

  // Runtime Performance Monitor: logs product grid render time to console for developers
  useEffect(() => {
    const startTime = performance.now();
    const rafId = requestAnimationFrame(() => {
      const renderDurationMs = (performance.now() - startTime).toFixed(2);
      console.log(
        `%c[Catalog Perf Monitor]%c Product grid rendered %c${filteredProducts.length} items%c in %c${renderDurationMs}ms%c (category: "${filterState.category}", brand: "${filterState.brand}", sort: "${filterState.sortBy}", query: "${filterState.searchQuery || 'none'}")`,
        'color: #3b82f6; font-weight: bold;',
        'color: inherit;',
        'color: #10b981; font-weight: bold;',
        'color: inherit;',
        'color: #ef4444; font-weight: bold;',
        'color: inherit;'
      );
    });
    return () => cancelAnimationFrame(rafId);
  }, [filteredProducts, filterState]);

  // Wishlist products (personal or shared list if visiting a friend's link)
  const displayedWishlistProducts = useMemo(() => {
    if (isViewingSharedWishlist && sharedWishlistIds && sharedWishlistIds.length > 0) {
      const matched = productsList.filter((p) => sharedWishlistIds.includes(p.id));
      if (matched.length > 0) return matched;
    }
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [productsList, wishlistIds, isViewingSharedWishlist, sharedWishlistIds]);

  const featuredList = useMemo(() => {
    const list = productsList.filter((p) => p.isFeatured);
    return list.length > 0 ? list : productsList;
  }, [productsList]);

  // Scroll to top upon navigating between pages/views
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [currentRoute]);

  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      category: 'all',
      brand: 'All Brands',
      minPriceUSD: 0,
      maxPriceUSD: 3000,
      condition: 'all',
      onlyInStock: false,
      sortBy: 'featured',
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filterState.brand !== 'All Brands' ||
      filterState.condition !== 'all' ||
      filterState.onlyInStock ||
      Boolean(filterState.searchQuery) ||
      filterState.minPriceUSD > 0 ||
      filterState.maxPriceUSD < 3000 ||
      filterState.category !== 'all'
    );
  }, [filterState]);

  const activeFilterCount = useMemo(() => {
    return [
      Boolean(filterState.searchQuery),
      filterState.category !== 'all',
      filterState.brand !== 'All Brands',
      filterState.minPriceUSD > 0 || filterState.maxPriceUSD < 3000,
      filterState.condition !== 'all',
      filterState.onlyInStock,
    ].filter(Boolean).length;
  }, [filterState]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#09090b] text-zinc-100' : 'bg-[#fafafa] text-zinc-900'
    }`}>
      <AnimatePresence mode="wait" initial={false}>
        {currentRoute === 'admin' ? (
          <motion.div
            key="admin-dashboard-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            <AdminDashboard
              products={productsList}
              onUpdateProducts={setProductsList}
              storeSettings={storeSettings}
              onUpdateStoreSettings={setStoreSettings}
              onLogout={handleAdminLogout}
              onNavigateToStore={handleNavigateToStore}
              currency={currency}
            />
          </motion.div>
        ) : currentRoute === 'admin-login' ? (
          <motion.div
            key="admin-login-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onBackToStore={handleNavigateToStore}
            />
          </motion.div>
        ) : currentRoute === 'offers' ? (
          <motion.div
            key="special-offers-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`min-h-screen min-h-[100dvh] w-full overflow-x-hidden flex flex-col justify-between font-sans pb-24 md:pb-0 ${
              theme === 'dark' 
                ? 'bg-[#09090b] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950' 
                : 'bg-[#FFFFFF] text-[#000000] selection:bg-[#0052CC] selection:text-white'
            }`}
          >
            {/* Top Header */}
            <Header
              theme={theme}
              onToggleTheme={handleToggleTheme}
              currency={currency}
              onCurrencyChange={setCurrency}
              searchQuery=""
              onSearchChange={(q) => {
                setFilterState((prev) => ({ ...prev, searchQuery: q }));
                handleNavigateToStore();
              }}
              selectedCategory="all"
              onSelectCategory={(catId) => {
                setFilterState((prev) => ({ ...prev, category: catId }));
                handleNavigateToStore();
              }}
              products={productsList}
              onSelectProduct={handleOpenProductDetail}
              onAddToCart={(p) => handleAddToCart(p, p.variants[0], 1)}
              cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
              onOpenCart={() => setIsCartOpen(true)}
              wishlistCount={wishlistIds.length}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              compareCount={comparedProducts.length}
              onOpenCompare={() => setIsCompareOpen(true)}
              onOpenTradeIn={() => setIsTradeInOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
              onOpenAdmin={handleNavigateToAdmin}
              topBannerText={storeSettings.topBannerText}
              isTopBannerActive={storeSettings.isTopBannerActive}
              whatsappNumber={storeSettings.whatsappNumber}
              onSwitchToShowroom={() => handleToggleShowroom(true)}
              isOffersPage={true}
              onNavigateToOffers={handleNavigateToOffers}
              offersCount={discountedProductsCount}
            />

            {/* Special Offers Dedicated View */}
            <SpecialOffersPage
              products={productsList}
              currency={currency}
              onSelectProduct={handleOpenProductDetail}
              onAddToCart={(p, v) => handleAddToCart(p, v, 1)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              comparedProducts={comparedProducts}
              onToggleCompare={handleToggleCompare}
              onBackToStore={handleNavigateToStore}
              whatsappNumber={storeSettings.whatsappNumber}
            />

            {/* Footer */}
            <Footer
              theme={theme}
              onSelectCategory={(catId) => {
                setFilterState((prev) => ({ ...prev, category: catId }));
                handleNavigateToStore();
              }}
              onOpenTradeIn={() => setIsTradeInOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
              whatsappNumber={storeSettings.whatsappNumber}
              supportEmail={storeSettings.supportEmail}
              onNavigateToOffers={handleNavigateToOffers}
            />

            {/* Floating Scroll to Top Button */}
            <ScrollToTopButton threshold={400} />

            {/* Mobile Sticky Bottom Navigation Bar (< 768px) */}
            <MobileBottomNav
              theme={theme}
              cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
              wishlistCount={wishlistIds.length}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
              onOpenCategories={handleNavigateToStore}
              onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onNavigateToOffers={handleNavigateToOffers}
              isOffersActive={true}
              offersCount={discountedProductsCount}
            />
          </motion.div>
        ) : showroomMode ? (
          <motion.div
            key="showroom-2027-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen w-full"
          >
            <Showroom2027View
              products={productsList}
              currency={currency}
              onCurrencyChange={setCurrency}
              onSelectProduct={handleOpenProductDetail}
              onAddToCart={(p, v) => handleAddToCart(p, v || p.variants[0], 1)}
              cartItems={cartItems}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onRemoveCartItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              recentlyViewed={recentlyViewedProducts}
              storeSettings={storeSettings}
              onSwitchToClassic={() => handleToggleShowroom(false)}
              onOpenAdmin={handleNavigateToAdmin}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              onOpenCompare={() => setIsCompareOpen(true)}
              onNavigateToOffers={handleNavigateToOffers}
            />
          </motion.div>
        ) : (
          <motion.div
            key="store-front-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`min-h-screen min-h-[100dvh] w-full overflow-x-hidden flex flex-col justify-between font-sans pb-24 md:pb-0 ${
              theme === 'dark' 
                ? 'bg-[#09090b] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950' 
                : 'bg-[#FFFFFF] text-[#000000] selection:bg-[#0052CC] selection:text-white'
            }`}
          >
            {/* Top Header */}
            <Header
              theme={theme}
              onToggleTheme={handleToggleTheme}
              currency={currency}
              onCurrencyChange={setCurrency}
              searchQuery={filterState.searchQuery}
              onSearchChange={(q) => setFilterState((prev) => ({ ...prev, searchQuery: q }))}
              selectedCategory={filterState.category}
              onSelectCategory={(catId) => setFilterState((prev) => ({ ...prev, category: catId }))}
              products={productsList}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p, p.variants[0], 1)}
              cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
              onOpenCart={() => setIsCartOpen(true)}
              wishlistCount={wishlistIds.length}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              compareCount={comparedProducts.length}
              onOpenCompare={() => setIsCompareOpen(true)}
              onOpenTradeIn={() => setIsTradeInOpen(true)}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenAccount={() => setIsAccountOpen(true)}
              onOpenAdmin={handleNavigateToAdmin}
              topBannerText={storeSettings.topBannerText}
              isTopBannerActive={storeSettings.isTopBannerActive}
              whatsappNumber={storeSettings.whatsappNumber}
              onSwitchToShowroom={() => handleToggleShowroom(true)}
              isOffersPage={false}
              onNavigateToOffers={handleNavigateToOffers}
              offersCount={discountedProductsCount}
            />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1 space-y-6 sm:space-y-8 w-full">
        {/* 1. Dynamic Hero Banner / Slider with Featured Tech & Video Showcase */}
        <HeroBanner
          theme={theme}
          featuredProducts={featuredList}
          currency={currency}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onSelectCategory={(catId) => setFilterState((prev) => ({ ...prev, category: catId }))}
          marketingVideoUrl={storeSettings.marketingVideoUrl}
          marketingVideoTitle={storeSettings.marketingVideoTitle}
          isMarketingVideoActive={storeSettings.isMarketingVideoActive}
          whatsappNumber={storeSettings.whatsappNumber}
          onNavigateToOffers={handleNavigateToOffers}
        />

        {/* 2. Horizontal Category Quick-Links Bar (Ishtari Style right below Hero) */}
        <CategoryQuickLinks
          selectedCategory={filterState.category}
          onSelectCategory={(catId) => {
            setFilterState((prev) => ({ ...prev, category: catId }));
            const el = document.getElementById('catalog-feed-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToOffers={handleNavigateToOffers}
          discountedCount={discountedProductsCount}
        />

        {/* 3. Flash Deals Row with Live Countdown & Direct Buy */}
        <FlashDealsRow
          products={productsList}
          currency={currency}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, p.variants[0], 1)}
          whatsappNumber={storeSettings.whatsappNumber}
          onViewAllOffers={handleNavigateToOffers}
        />

        {/* 4. Product Feed Sections Organized by Tabs (Trending, Best Sellers, Audio, Smartphones, Gaming) */}
        <ProductFeedTabs
          products={productsList}
          currency={currency}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p, v) => handleAddToCart(p, v, 1)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          comparedProducts={comparedProducts}
          onToggleCompare={handleToggleCompare}
          whatsappNumber={storeSettings.whatsappNumber}
          theme={theme}
          onViewCategory={(catId) => {
            setFilterState((prev) => ({ ...prev, category: catId }));
            const el = document.getElementById('catalog-feed-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. Complete Catalog & Advanced Filter Grid */}
        <div id="catalog-feed-section" className="space-y-4 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Full Electronics Catalog</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              {filteredProducts.length} Items Available
            </span>
          </div>

        {/* Filter Controls Bar */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 rounded-xl border backdrop-blur-md font-mono ${
          theme === 'dark' 
            ? 'bg-zinc-900/40 border-zinc-800/80' 
            : 'bg-white/80 border-zinc-200/80'
        }`}>
          {/* Category Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = filterState.category === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-chip-${cat.id}`}
                  onClick={() => setFilterState((prev) => ({ ...prev, category: cat.id }))}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-micro cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                    isSelected
                      ? (theme === 'dark' 
                          ? 'bg-zinc-100 text-zinc-950 font-bold border-zinc-100' 
                          : 'bg-zinc-950 text-white font-bold border-zinc-950')
                      : (theme === 'dark'
                          ? 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800/80 hover:border-zinc-700'
                          : 'bg-white text-zinc-600 hover:text-zinc-950 border-zinc-200 hover:border-zinc-300')
                  }`}
                >
                  <CategoryIcon
                    nameOrId={cat.iconName || cat.id}
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isSelected 
                        ? (theme === 'dark' ? 'text-zinc-950' : 'text-white')
                        : 'text-zinc-400'
                    }`}
                  />
                  <span>{cat.name.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Sort & Mobile Filter Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={filterState.sortBy}
                onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className={`border text-xs font-mono rounded-md px-2.5 py-1.5 outline-none cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-zinc-500' 
                    : 'bg-white border-zinc-300 text-zinc-800 focus:border-zinc-700'
                }`}
              >
                <option value="featured">FEATURED FIRST</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="rating">TOP RATED</option>
                <option value="newest">NEW ARRIVALS</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className={`lg:hidden flex items-center justify-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border cursor-pointer transition-micro ${
                theme === 'dark' 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800' 
                  : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200'
              }`}
              aria-label="Open filter menu"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>FILTERS</span>
              {activeFilterCount > 0 && (
                <span className={`w-3.5 h-3.5 rounded-full text-[9px] font-mono flex items-center justify-center font-bold ${
                  theme === 'dark' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white'
                }`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Catalog Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Desktop Filter Sidebar (Hidden on Mobile/Tablet, visible on LG+) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' 
                ? 'bg-zinc-900/40 border-zinc-800/80 backdrop-blur-md' 
                : 'bg-white/80 border-zinc-200/80 backdrop-blur-md'
            }`}>
              <FilterPanelContent
                filterState={filterState}
                setFilterState={setFilterState}
                currency={currency}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                theme={theme}
              />
            </div>
          </aside>

          {/* Product Cards Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Active Filters / Result count */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span>
                  SHOWING <strong className={theme === 'dark' ? 'text-zinc-200' : 'text-zinc-900'}>{filteredProducts.length}</strong> ITEMS IN CATALOG
                </span>

                {/* Mobile 1-col vs 2-col toggle button */}
                <div className={`flex sm:hidden items-center border rounded-md p-0.5 ml-1 ${
                  theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <button
                    type="button"
                    onClick={() => setMobileGridCols(1)}
                    className={`p-1 rounded transition-micro cursor-pointer ${
                      mobileGridCols === 1
                        ? (theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-white text-zinc-950')
                        : 'text-zinc-500'
                    }`}
                    title="1 Column View"
                    aria-label="1 Column Layout"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileGridCols(2)}
                    className={`p-1 rounded transition-micro cursor-pointer ${
                      mobileGridCols === 2
                        ? (theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-white text-zinc-950')
                        : 'text-zinc-500'
                    }`}
                    title="2 Columns View"
                    aria-label="2 Columns Layout"
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {filterState.searchQuery && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                  }`}>
                    <span>QUERY: "{filterState.searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                      className="hover:text-red-400 transition cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filterState.minPriceUSD > 0 || filterState.maxPriceUSD < 3000) && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                  }`}>
                    <span>PRICE: ${filterState.minPriceUSD}–${filterState.maxPriceUSD}</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, minPriceUSD: 0, maxPriceUSD: 3000 }))}
                      className="hover:text-red-400 transition cursor-pointer"
                      title="Reset price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.brand !== 'All Brands' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                  }`}>
                    <span>{filterState.brand.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, brand: 'All Brands' }))}
                      className="hover:text-red-400 transition cursor-pointer"
                      title="Clear brand filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.condition !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                  }`}>
                    <span>{filterState.condition.toUpperCase()}</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, condition: 'all' }))}
                      className="hover:text-red-400 transition cursor-pointer"
                      title="Clear condition filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.onlyInStock && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-200 text-zinc-800'
                  }`}>
                    <span>IN-STOCK</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, onlyInStock: false }))}
                      className="hover:text-red-400 transition cursor-pointer"
                      title="Clear in-stock filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <EmptyProductsState
                  key="empty-state"
                  filterState={filterState}
                  onResetFilters={() =>
                    setFilterState({
                      searchQuery: '',
                      category: 'all',
                      brand: 'All Brands',
                      minPriceUSD: 0,
                      maxPriceUSD: 3000,
                      condition: 'all',
                      onlyInStock: false,
                      sortBy: 'featured',
                    })
                  }
                />
              ) : (
                <motion.div
                  key="products-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`grid ${
                    mobileGridCols === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  } sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={currency}
                      theme={theme}
                      isWishlisted={wishlistIds.includes(product.id)}
                      isCompared={comparedProducts.some((p) => p.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onToggleCompare={handleToggleCompare}
                      onAddToCart={(p, v) => handleAddToCart(p, v, 1)}
                      onQuickView={handleOpenProductDetail}
                      whatsappNumber={storeSettings.whatsappNumber}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recently Viewed Products Horizontal Slider */}
            {recentlyViewedProducts.length > 0 && (
              <div className={`mt-12 pt-8 border-t ${
                theme === 'dark' ? 'border-zinc-800/80' : 'border-zinc-200/80'
              }`}>
                <RecentlyViewedSlider
                  products={recentlyViewedProducts}
                  currency={currency}
                  onProductClick={handleOpenProductDetail}
                  onAddToCart={(p) => handleAddToCart(p, p.variants[0], 1)}
                  onClear={() => {
                    setRecentlyViewedIds([]);
                    try {
                      sessionStorage.removeItem(RECENTLY_VIEWED_STORAGE_KEY);
                    } catch {
                      // ignore
                    }
                  }}
                />
              </div>
            )}

          </div>

        </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        theme={theme}
        onSelectCategory={(catId) => {
          setFilterState((prev) => ({ ...prev, category: catId }));
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        whatsappNumber={storeSettings.whatsappNumber}
        supportEmail={storeSettings.supportEmail}
        onNavigateToOffers={handleNavigateToOffers}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton threshold={400} />

      {/* Mobile Filter Slide-Over Drawer (< 1024px) */}
      <MobileFilterDrawer
        theme={theme}
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filterState={filterState}
        setFilterState={setFilterState}
        currency={currency}
        itemCount={filteredProducts.length}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Mobile Sticky Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav
        theme={theme}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCategories={() => {
          const el = document.getElementById('category-quick-links-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigateToOffers={handleNavigateToOffers}
        isOffersActive={false}
        offersCount={discountedProductsCount}
      />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shared Global Modals & Drawers (accessible across Store, Offers, Showroom) */}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            currency={currency}
            onClose={handleCloseProductDetail}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            isCompared={comparedProducts.some((p) => p.id === selectedProduct.id)}
            onToggleCompare={handleToggleCompare}
            onAddToCart={handleAddToCart}
            whatsappNumber={storeSettings.whatsappNumber}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        whatsappNumber={storeSettings.whatsappNumber}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        onOrderCompleted={() => {
          handleClearCart();
          setIsCheckoutOpen(false);
        }}
        whatsappNumber={storeSettings.whatsappNumber}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparedProducts}
        currency={currency}
        onRemoveFromCompare={handleRemoveFromCompare}
        onAddToCart={(p) => {
          handleAddToCart(p, p.variants?.[0], 1);
          setIsCompareOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Trade In Modal */}
      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        currency={currency}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => {
          setIsWishlistOpen(false);
          setIsViewingSharedWishlist(false);
        }}
        products={displayedWishlistProducts}
        currency={currency}
        onRemoveFromWishlist={(productId) => {
          handleToggleWishlist(productId);
          if (isViewingSharedWishlist && sharedWishlistIds) {
            setSharedWishlistIds((prev) => (prev ? prev.filter((id) => id !== productId) : null));
          }
        }}
        onAddToCart={(p) => {
          handleAddToCart(p, p.variants?.[0], 1);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onAddAllToCart={handleAddAllWishlistToCart}
        onQuickView={(p) => {
          setIsWishlistOpen(false);
          handleOpenProductDetail(p);
        }}
        isSharedWishlist={isViewingSharedWishlist}
        onSaveSharedWishlist={handleSaveSharedWishlist}
        onViewMyWishlist={() => setIsViewingSharedWishlist(false)}
        myWishlistCount={wishlistIds.length}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        whatsappNumber={storeSettings.whatsappNumber}
        supportEmail={storeSettings.supportEmail}
      />

      {/* Ishtari Account / Order Tracking Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        whatsappNumber={storeSettings.whatsappNumber}
      />
    </div>
  );
}

export default App;
