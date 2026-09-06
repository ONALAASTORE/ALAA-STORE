import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  ArrowLeftRight, 
  HelpCircle, 
  MessageCircle,
  Truck,
  ShieldCheck,
  Menu,
  X,
  Calculator
} from 'lucide-react';
import { Currency, Product } from '../types';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { LogoAvatar, Brand3DText } from './brand';
import { SearchAutocomplete } from './SearchAutocomplete';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenTradeIn: () => void;
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
  topBannerText?: string;
  isTopBannerActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  products = PRODUCTS,
  onSelectProduct,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  compareCount,
  onOpenCompare,
  onOpenTradeIn,
  onOpenContact,
  onOpenAdmin,
  topBannerText = 'Available delivery to all Lebanon 🚚 (Beirut, Tripoli, Saida, Bekaa)',
  isTopBannerActive = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Bar - Lebanese Market Focus */}
      {isTopBannerActive && (
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Truck className="w-3.5 h-3.5" />
                <span>{topBannerText}</span>
              </span>
              <span className="hidden md:inline-block text-slate-500">•</span>
              <span className="hidden md:flex items-center gap-1 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>100% Official Agency Warranties</span>
              </span>
              <span className="hidden lg:inline-block text-slate-500">•</span>
              <span className="hidden lg:inline-block text-amber-300">
                Cash on Delivery in USD or L.L. (89,500 LBP/$)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                id="trade-in-top-btn"
                onClick={onOpenTradeIn}
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold px-2 py-0.5 rounded-sm bg-amber-950/40 hover:bg-amber-900/50 transition cursor-pointer"
              >
                <Calculator className="w-3 h-3" />
                <span>Trade-In</span>
              </button>
              {onOpenAdmin && (
                <button 
                  id="admin-top-btn"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold px-2 py-0.5 rounded-sm bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                  title="Admin Portal"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]"></span>
                  <span>Admin</span>
                </button>
              )}
              <a 
                href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store%2C%20I%20have%20an%20inquiry%20about%20a%20product" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: +961 71 135 241</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button 
              id="brand-logo-btn"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
              }}
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer"
              title="ON ALAA STORE Homepage"
            >
              {/* 3D Elevated Logo Avatar */}
              <LogoAvatar size="md" withGlow={true} />
              
              {/* 3D Dynamic Brand Typography */}
              <Brand3DText 
                size="md" 
                withLebanonBadge={true} 
                withTagline={true} 
              />
            </button>
          </div>

          {/* Dedicated Always-Visible Persistent Search Bar (Desktop & Tablet Large) */}
          <div 
            id="header-search-container" 
            className="flex-1 max-w-xl lg:max-w-2xl hidden md:block rounded-2xl transition-all focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:animate-pulse"
          >
            <SearchAutocomplete
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              products={products}
              onSelectProduct={onSelectProduct}
              onSelectCategory={onSelectCategory}
              currency={currency}
              placeholder="Search iPhone 16 Pro, S25 Ultra, PS5 Pro, MacBook, Sony..."
              idPrefix="header-desktop"
            />
          </div>

          {/* Currency Switcher & User Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Currency Switcher Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="currency-usd-btn"
                onClick={() => onCurrencyChange('USD')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  currency === 'USD' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View prices in US Dollars"
              >
                $ USD
              </button>
              <button
                id="currency-lbp-btn"
                onClick={() => onCurrencyChange('LBP')}
                className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  currency === 'LBP' 
                    ? 'bg-white text-emerald-600 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View prices in Lebanese Pounds (L.L.)"
              >
                L.L.
              </button>
            </div>

            {/* Compare Tool Button */}
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className={`p-2 rounded-xl border transition relative hidden md:flex items-center justify-center cursor-pointer ${
                compareCount > 0 
                  ? 'border-blue-300 bg-blue-50 text-blue-600' 
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Compare Specifications"
            >
              <ArrowLeftRight className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className={`p-2 rounded-xl border transition relative hidden sm:flex items-center justify-center cursor-pointer ${
                wishlistCount > 0 
                  ? 'border-rose-300 bg-rose-50 text-rose-600' 
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Saved Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 sm:px-3.5 py-2 rounded-xl font-semibold text-sm transition shadow-sm shadow-blue-500/25 cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-blue-600">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Cart</span>
            </button>
          </div>
        </div>

        {/* Dedicated Always-Visible Persistent Search Bar for Mobile & Compact Screens */}
        <div className="mt-2.5 md:hidden">
          <SearchAutocomplete
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            products={products}
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            currency={currency}
            placeholder="Search electronics, brands, models..."
            isMobile={true}
            idPrefix="header-mobile"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="bg-slate-50/90 border-t border-slate-200/60 overflow-x-auto scrollbar-none py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-nav-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenTradeIn();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Trade-In Value</span>
            </button>
            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-200 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Compare ({compareCount})</span>
            </button>
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-800 font-semibold text-xs border border-rose-200 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Wishlist ({wishlistCount})</span>
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-200 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>Store Branches & Help</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
