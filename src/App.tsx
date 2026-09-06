import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search, 
  MessageCircle,
  X,
} from 'lucide-react';
import { Currency, Product, CartItem, ProductVariant, FilterState, StoreSettings } from './types';
import { PRODUCTS } from './data/products';
import { CATEGORIES, BRANDS } from './data/categories';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PriceRangeSlider } from './components/PriceRangeSlider';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CompareModal } from './components/CompareModal';
import { TradeInModal } from './components/TradeInModal';
import { WishlistModal } from './components/WishlistModal';
import { ContactModal } from './components/ContactModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';

const CART_STORAGE_KEY = 'on_alaa_store_cart';
const WISHLIST_STORAGE_KEY = 'on_alaa_store_wishlist';
const PRODUCTS_STORAGE_KEY = 'on_alaa_store_products';
const SETTINGS_STORAGE_KEY = 'on_alaa_store_settings';

const DEFAULT_SETTINGS: StoreSettings = {
  topBannerText: 'Available delivery to all Lebanon 🚚 (Beirut, Tripoli, Saida, Bekaa)',
  isTopBannerActive: true,
  marketingVideoUrl: 'https://www.youtube.com/watch?v=eDqfg_LexCQ',
  marketingVideoTitle: 'Apple iPhone 16 Pro Cinematic Showcase',
  exchangeRateLBP: 89500,
  whatsappNumber: '+961 71 135 241',
  supportEmail: 'alaastoreon@gmail.com',
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

export function App() {
  // Routing View state ('store' | 'admin-login' | 'admin')
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin-login' | 'admin'>(() => {
    const hash = window.location.hash.toLowerCase();
    const isAuth = localStorage.getItem('on_alaa_admin_auth') === 'true';
    if (hash === '#admin' || hash === '#/admin') {
      return isAuth ? 'admin' : 'admin-login';
    }
    if (hash === '#admin-login' || hash === '#/admin/login' || hash === '#login') {
      return 'admin-login';
    }
    return 'store';
  });

  // Currency state (USD or LBP)
  const [currency, setCurrency] = useState<Currency>('USD');

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

  // Active modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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
    } catch {
      // ignore
    }
  }, [productsList]);

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
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
  };

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
      if (filterState.category !== 'all' && p.category !== filterState.category) {
        return false;
      }

      // Brand filter
      if (filterState.brand !== 'All Brands' && p.brand !== filterState.brand) {
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

  // Wishlist products
  const wishlistedProducts = useMemo(() => {
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [productsList, wishlistIds]);

  const featuredList = useMemo(() => {
    const list = productsList.filter((p) => p.isFeatured);
    return list.length > 0 ? list : productsList;
  }, [productsList]);

  // Scroll to top upon navigating between pages/views
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [currentRoute]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      currentRoute === 'store' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
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
        ) : (
          <motion.div
            key="store-front-page"
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-[#FF0000] selection:text-white font-sans"
          >
            {/* Top Header */}
            <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        searchQuery={filterState.searchQuery}
        onSearchChange={(q) => setFilterState((prev) => ({ ...prev, searchQuery: q }))}
        selectedCategory={filterState.category}
        onSelectCategory={(catId) => setFilterState((prev) => ({ ...prev, category: catId }))}
        products={productsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        compareCount={comparedProducts.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleNavigateToAdmin}
        topBannerText={storeSettings.topBannerText}
        isTopBannerActive={storeSettings.isTopBannerActive}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-8 w-full">
        {/* Dynamic Hero Banner with Marketing Video Showcase */}
        <HeroBanner
          featuredProducts={featuredList}
          currency={currency}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onSelectCategory={(catId) => setFilterState((prev) => ({ ...prev, category: catId }))}
          marketingVideoUrl={storeSettings.marketingVideoUrl}
          marketingVideoTitle={storeSettings.marketingVideoTitle}
        />

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterState((prev) => ({ ...prev, category: cat.id }))}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  filterState.category === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Sort & Mobile Filter Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filterState.sortBy}
                onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Catalog Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Refine Catalog</span>
                </h3>
                {(filterState.brand !== 'All Brands' || filterState.condition !== 'all' || filterState.onlyInStock || filterState.searchQuery || filterState.minPriceUSD > 0 || filterState.maxPriceUSD < 3000) && (
                  <button
                    onClick={() =>
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
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Brand / Manufacturer
                </label>
                <div className="space-y-1">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setFilterState((prev) => ({ ...prev, brand }))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        filterState.brand === brand
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider-based Price Range Filter */}
              <PriceRangeSlider
                minPriceUSD={filterState.minPriceUSD}
                maxPriceUSD={filterState.maxPriceUSD}
                onChange={(min, max) =>
                  setFilterState((prev) => ({
                    ...prev,
                    minPriceUSD: min,
                    maxPriceUSD: max,
                  }))
                }
                currency={currency}
                minLimit={0}
                maxLimit={3000}
                step={25}
              />

              {/* Condition Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Item Condition
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Conditions' },
                    { id: 'Brand New (Sealed)', label: 'Brand New (Sealed)' },
                    { id: 'Open Box', label: 'Open Box / Like New' },
                    { id: 'Certified Pre-Owned', label: 'Certified Pre-Owned' },
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      onClick={() => setFilterState((prev) => ({ ...prev, condition: cond.id }))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        filterState.condition === cond.id
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterState.onlyInStock}
                    onChange={(e) => setFilterState((prev) => ({ ...prev, onlyInStock: e.target.checked }))}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Show In-Stock Only
                  </span>
                </label>
              </div>

              {/* WhatsApp Help banner in sidebar */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Looking for a specific device?</span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  We can source customized specs or special colors from authorized distributors in Lebanon.
                </p>
                <a
                  href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store%2C%20I%20am%20looking%20for%20a%20specific%20device"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block font-bold text-emerald-700 hover:underline text-[11px]"
                >
                  Contact WhatsApp Rep →
                </a>
              </div>

            </div>
          </aside>

          {/* Product Cards Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Active Filters / Result count */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> items in catalog
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {filterState.searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-slate-200/80 px-2.5 py-1 rounded-full text-slate-800 font-medium">
                    <span>Search: "{filterState.searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                      className="hover:text-red-500 transition cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filterState.minPriceUSD > 0 || filterState.maxPriceUSD < 3000) && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-full text-blue-700 font-medium">
                    <span>Price: ${filterState.minPriceUSD} – ${filterState.maxPriceUSD}</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, minPriceUSD: 0, maxPriceUSD: 3000 }))}
                      className="hover:text-blue-900 transition cursor-pointer"
                      title="Reset price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.brand !== 'All Brands' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 font-medium">
                    <span>{filterState.brand}</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, brand: 'All Brands' }))}
                      className="hover:text-red-500 transition cursor-pointer"
                      title="Clear brand filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.condition !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 font-medium">
                    <span>{filterState.condition}</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, condition: 'all' }))}
                      className="hover:text-red-500 transition cursor-pointer"
                      title="Clear condition filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.onlyInStock && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-emerald-700 font-medium">
                    <span>In Stock</span>
                    <button
                      type="button"
                      onClick={() => setFilterState((prev) => ({ ...prev, onlyInStock: false }))}
                      className="hover:text-emerald-900 transition cursor-pointer"
                      title="Clear in-stock filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">No products match your criteria</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing some of your filters or search for another model or brand.
                  </p>
                </div>
                <button
                  onClick={() =>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    isCompared={comparedProducts.some((p) => p.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onToggleCompare={handleToggleCompare}
                    onAddToCart={(p, v) => handleAddToCart(p, v, 1)}
                    onQuickView={handleOpenProductDetail}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Product Detail Modal */}
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
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
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
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        currency={currency}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => {
          handleAddToCart(p, p.variants?.[0], 1);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onQuickView={(p) => {
          setIsWishlistOpen(false);
          handleOpenProductDetail(p);
        }}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setFilterState((prev) => ({ ...prev, category: catId }));
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenTradeIn={() => setIsTradeInOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton threshold={400} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
