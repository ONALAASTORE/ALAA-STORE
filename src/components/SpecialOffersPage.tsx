import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  ArrowUpDown, 
  Percent, 
  SlidersHorizontal, 
  ArrowLeft, 
  Search, 
  X, 
  Truck, 
  ShieldCheck, 
  Coins, 
  Grid2X2, 
  Square,
  Clock,
  TrendingDown
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils/currency';
import { getProductDealInfo, getDiscountedProducts } from '../utils/dealUtils';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from '../utils/categoryIcons';

interface SpecialOffersPageProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  comparedProducts: Product[];
  onToggleCompare: (product: Product) => void;
  onBackToStore: () => void;
  whatsappNumber?: string;
}

type DealSortOption = 
  | 'discount-desc' 
  | 'savings-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating' 
  | 'newest';

export const SpecialOffersPage: React.FC<SpecialOffersPageProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  comparedProducts,
  onToggleCompare,
  onBackToStore,
  whatsappNumber = '+961 71 135 241',
}) => {
  // 1. Extract all products with an active discount
  const allDiscountedProducts = useMemo(() => {
    return getDiscountedProducts(products);
  }, [products]);

  // 2. Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<DealSortOption>('discount-desc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileGridCols, setMobileGridCols] = useState<1 | 2>(2);

  // 3. Weekly Deal Countdown Timer calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 2, hours: 14, minutes: 36, seconds: 48 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + ((7 - targetDate.getDay() + 7) % 7 || 7));
    targetDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 3, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 4. Extract unique brands from discounted products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    allDiscountedProducts.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return ['All Brands', ...Array.from(brandsSet).sort()];
  }, [allDiscountedProducts]);

  // 5. Category counts in deals
  const categoryDealCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allDiscountedProducts.length };
    allDiscountedProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allDiscountedProducts]);

  // 6. Overall stats
  const dealStats = useMemo(() => {
    if (allDiscountedProducts.length === 0) {
      return { totalDeals: 0, maxDiscount: 0, maxSavings: 0, avgDiscount: 0 };
    }
    let maxDiscount = 0;
    let maxSavings = 0;
    let sumDiscount = 0;

    allDiscountedProducts.forEach((p) => {
      const deal = getProductDealInfo(p);
      if (deal.discountPercent > maxDiscount) maxDiscount = deal.discountPercent;
      if (deal.savingsUSD > maxSavings) maxSavings = deal.savingsUSD;
      sumDiscount += deal.discountPercent;
    });

    return {
      totalDeals: allDiscountedProducts.length,
      maxDiscount,
      maxSavings,
      avgDiscount: Math.round(sumDiscount / allDiscountedProducts.length),
    };
  }, [allDiscountedProducts]);

  // 7. Filtered & Sorted Deals List
  const filteredDeals = useMemo(() => {
    return allDiscountedProducts
      .filter((product) => {
        const deal = getProductDealInfo(product);

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = product.name.toLowerCase().includes(q);
          const brandMatch = product.brand.toLowerCase().includes(q);
          const catMatch = product.category.toLowerCase().includes(q);
          const descMatch = product.description.toLowerCase().includes(q);
          if (!nameMatch && !brandMatch && !catMatch && !descMatch) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'All Brands' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }

        // Minimum discount percentage
        if (minDiscount > 0 && deal.discountPercent < minDiscount) {
          return false;
        }

        // Price filter (based on effective price)
        if (deal.effectivePriceUSD < minPrice || deal.effectivePriceUSD > maxPrice) {
          return false;
        }

        // In-stock only filter
        if (inStockOnly && !product.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dealA = getProductDealInfo(a);
        const dealB = getProductDealInfo(b);

        if (sortBy === 'discount-desc') {
          return dealB.discountPercent - dealA.discountPercent;
        }
        if (sortBy === 'savings-desc') {
          return dealB.savingsUSD - dealA.savingsUSD;
        }
        if (sortBy === 'price-asc') {
          return dealA.effectivePriceUSD - dealB.effectivePriceUSD;
        }
        if (sortBy === 'price-desc') {
          return dealB.effectivePriceUSD - dealA.effectivePriceUSD;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'newest') {
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        }
        return 0;
      });
  }, [
    allDiscountedProducts,
    searchQuery,
    selectedCategory,
    selectedBrand,
    minDiscount,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const hasActiveFilters = useMemo(() => {
    return (
      Boolean(searchQuery) ||
      selectedCategory !== 'all' ||
      selectedBrand !== 'All Brands' ||
      minDiscount > 0 ||
      minPrice > 0 ||
      maxPrice < 3000 ||
      inStockOnly
    );
  }, [searchQuery, selectedCategory, selectedBrand, minDiscount, minPrice, maxPrice, inStockOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('All Brands');
    setMinDiscount(0);
    setMinPrice(0);
    setMaxPrice(3000);
    setInStockOnly(false);
    setSortBy('discount-desc');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-12">
      {/* Top Banner Bar with Quick Back & Context */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToStore}
            id="offers-back-to-store-top-btn"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Products</span>
          </button>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:flex items-center gap-1 text-emerald-400">
              <Truck className="w-3.5 h-3.5" />
              <span>Fast Delivery Across Lebanon</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Cash on Delivery in USD & LBP</span>
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
        {/* Deal Header Hero Section */}
        <section 
          aria-label="Special Offers Hero"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-rose-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 border border-rose-900/40 shadow-xl"
        >
          {/* Decorative ambient radial glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
                <span>Special Offers & Deals</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Lebanon Verified</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
                Top Electronics Deals with <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">Official Agency Warranty</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Explore genuine discounted prices on flagship smartphones, MacBooks, gaming gear, and audio accessories. Pay upon delivery in fresh USD or Lebanese Pounds with full agency warranty.
              </p>

              {/* Deal Metrics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center sm:text-left">
                  <div className="text-xs text-slate-400 font-semibold">Active Offers</div>
                  <div className="text-xl sm:text-2xl font-black text-white">{dealStats.totalDeals} Deals</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center sm:text-left">
                  <div className="text-xs text-rose-300 font-semibold">Max Discount</div>
                  <div className="text-xl sm:text-2xl font-black text-rose-400">Up to {dealStats.maxDiscount}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center sm:text-left">
                  <div className="text-xs text-amber-300 font-semibold">Max Savings</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">Save ${dealStats.maxSavings}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center sm:text-left">
                  <div className="text-xs text-emerald-300 font-semibold">Agency Sealed</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">100% Genuine</div>
                </div>
              </div>
            </div>

            {/* Flash Deal Urgency Timer Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-rose-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4 animate-spin text-rose-400" style={{ animationDuration: '6s' }} />
                    <span>Weekly Flash Deals End In</span>
                  </div>
                  <span className="bg-rose-500/20 text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-500/30">
                    Live Stock
                  </span>
                </div>

                {/* Countdown Digit Blocks */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-2xl border border-slate-800">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Days</div>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-2xl border border-slate-800">
                    <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Hours</div>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-2xl border border-slate-800">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Mins</div>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-2xl border border-slate-800">
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Secs</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Prices valid for delivery in Beirut, Tripoli, Saida, & all Lebanon</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Filter & Search Bar */}
        <section aria-label="Deal Filters" className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            
            {/* Search Input & Sort Selector Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Within Deals */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  id="offers-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals (e.g., iPhone 16 Pro, S25 Ultra, MacBook, PS5, JBL)..."
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <ArrowUpDown className="w-4 h-4 text-rose-500" />
                  <span className="hidden sm:inline">Sort:</span>
                </div>
                <select
                  id="offers-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as DealSortOption)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 min-h-[42px] outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-2xs"
                >
                  <option value="discount-desc">Highest Discount % First (Biggest Savings)</option>
                  <option value="savings-desc">Biggest Dollar Amount Saved ($ First)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="newest">Newest Deals</option>
                </select>

                {/* Mobile Filter Drawer Button */}
                <button
                  type="button"
                  id="offers-mobile-filter-btn"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer min-h-[42px]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Category Pills Bar with Deal Counters */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                id="deal-category-all"
                onClick={() => setSelectedCategory('all')}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${selectedCategory === 'all' ? 'text-white fill-white' : 'text-rose-500'}`} />
                <span>All Offers</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {allDiscountedProducts.length}
                </span>
              </button>

              {CATEGORIES.filter((c) => (categoryDealCounts[c.id] || 0) > 0).map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryDealCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    id={`deal-category-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/25'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <CategoryIcon
                      nameOrId={cat.iconName || cat.id}
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Discount Tier Buttons & Brand Badges (Desktop/Tablet) */}
            <div className="hidden lg:flex items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
              {/* Discount Percentage Tiers */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-rose-500" />
                  <span>Savings:</span>
                </span>
                {[
                  { label: 'All Deals', value: 0 },
                  { label: '5%+ OFF', value: 5 },
                  { label: '10%+ OFF', value: 10 },
                  { label: '15%+ OFF', value: 15 },
                ].map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setMinDiscount(tier.value)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      minDiscount === tier.value
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              {/* Brand Pills */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">Brand:</span>
                <select
                  id="offers-brand-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1 outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
                >
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* In Stock Only Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="offers-instock-toggle"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
                />
                <span className="text-slate-700 font-semibold">In-Stock Only</span>
              </label>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  id="offers-reset-filters-desktop-btn"
                  className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Results Header: Active filter chips, count, and mobile layout toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-950 font-extrabold text-sm">{filteredDeals.length}</strong> active {filteredDeals.length === 1 ? 'deal' : 'deals'}
            </span>

            {/* Mobile Column Toggle */}
            <div className="flex sm:hidden items-center border border-slate-200 rounded-lg p-0.5 bg-white ml-2">
              <button
                type="button"
                onClick={() => setMobileGridCols(1)}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  mobileGridCols === 1
                    ? 'bg-rose-50 text-rose-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="1 Column View"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileGridCols(2)}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  mobileGridCols === 2
                    ? 'bg-rose-50 text-rose-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="2 Columns View"
              >
                <Grid2X2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              {searchQuery && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  Query: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'All Brands' && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('All Brands')} className="hover:text-rose-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minDiscount > 0 && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  Min {minDiscount}% OFF
                  <button onClick={() => setMinDiscount(0)} className="hover:text-rose-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                  In-Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-rose-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Deals Product Grid */}
        {filteredDeals.length > 0 ? (
          <div 
            id="offers-product-grid"
            className={`grid gap-4 sm:gap-6 ${
              mobileGridCols === 1 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {filteredDeals.map((product) => {
              const deal = getProductDealInfo(product);
              return (
                <div key={product.id} className="relative flex flex-col">
                  {/* Deal Callout Banner on Top of Card */}
                  <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white text-[11px] font-black px-3 py-1.5 rounded-t-2xl flex items-center justify-between shadow-xs z-10 -mb-2">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      <span>{deal.discountPercent}% OFF</span>
                    </div>
                    <div className="text-[10px] font-bold opacity-90">
                      Save {formatPrice(deal.savingsUSD, currency)}
                    </div>
                  </div>

                  {/* Enhanced Product Card */}
                  <div className="flex-1 flex flex-col">
                    <ProductCard
                      product={product}
                      currency={currency}
                      onQuickView={onSelectProduct}
                      onAddToCart={onAddToCart}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onToggleWishlist={onToggleWishlist}
                      isCompared={comparedProducts.some((p) => p.id === product.id)}
                      onToggleCompare={onToggleCompare}
                      whatsappNumber={whatsappNumber}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/90 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200/80 flex items-center justify-center mx-auto shadow-inner">
              <TrendingDown className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              No matching special offers found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We couldn't find any promotional products matching your selected category, brand, or discount tier. Try loosening your filters or browsing all active deals.
            </p>
            <button
              type="button"
              id="offers-empty-reset-btn"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Reset All Offer Filters</span>
            </button>
          </div>
        )}

        {/* Why Buy Deals from On Alaa Store Guarantee Grid */}
        <section 
          aria-label="Deals Guarantee" 
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              Why Shop Special Offers at ON ALAA STORE?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We never compromise on authenticity or warranty coverage during sales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">100% Agency Sealed</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Brand new, untouched devices with genuine official manufacturer warranties.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Fair Dual Currency</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check and pay in fresh USD or Lebanese Pounds at the transparent daily market rate.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Fast Doorstep Delivery</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Courier delivery to Beirut, Tripoli, Saida, Nabatieh, Zahle, and all Lebanese towns.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Live WhatsApp Advice</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chat directly with our store team for personalized advice before ordering.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToStore}
              id="offers-back-to-store-bottom-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer active:scale-95 shadow-md shadow-slate-900/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping All Catalog Products</span>
            </button>
          </div>
        </section>
      </main>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                  <span>Filter Deals</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 outline-none"
                >
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Discount */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Minimum Discount</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'All', value: 0 },
                    { label: '5%+ OFF', value: 5 },
                    { label: '10%+ OFF', value: 10 },
                    { label: '15%+ OFF', value: 15 },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setMinDiscount(t.value)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        minDiscount === t.value
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800">Show In-Stock Only</span>
              </label>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Apply Filters ({filteredDeals.length} Deals)
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
