import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  ArrowLeftRight, 
  Menu, 
  X, 
  ShieldCheck, 
  Coins, 
  Calculator, 
  MessageCircle, 
  Sun, 
  Moon, 
  Check, 
  HelpCircle,
  Box,
  User
} from 'lucide-react';
import { Currency, Product } from '../types';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { LogoAvatar, Brand3DText } from './brand';
import { SearchAutocomplete } from './SearchAutocomplete';
import { buildWhatsAppLink } from '../utils/phone';
import { CategoryIcon } from '../utils/categoryIcons';
import { DEFAULT_USD_TO_LBP_RATE } from '../utils/currency';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenTradeIn: () => void;
  onOpenContact: () => void;
  onOpenAccount?: () => void;
  onOpenAdmin?: () => void;
  topBannerText?: string;
  isTopBannerActive?: boolean;
  whatsappNumber?: string;
  onSwitchToShowroom?: () => void;
  isOffersPage?: boolean;
  onNavigateToOffers?: () => void;
  offersCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
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
  onAddToCart,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  compareCount,
  onOpenCompare,
  onOpenTradeIn,
  onOpenContact,
  onOpenAccount,
  onOpenAdmin,
  topBannerText = 'Lebanon Delivery: Beirut, Tripoli, Saida, Bekaa & Mount Lebanon',
  isTopBannerActive = true,
  whatsappNumber = '+961 71 135 241',
  onSwitchToShowroom,
  isOffersPage = false,
  onNavigateToOffers,
  offersCount = 0,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header 
      id="main-header" 
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        isDark 
          ? 'bg-[#09090b]/80 border-b border-zinc-800/80 backdrop-blur-md text-zinc-100' 
          : 'bg-white/85 border-b border-zinc-200/80 backdrop-blur-md text-zinc-900'
      }`}
    >
      {/* Top Technical Status Ticker (1-line restrained status bar) */}
      {isTopBannerActive && (
        <div 
          id="top-technical-ticker"
          className={`text-[11px] font-mono tracking-tight py-1.5 px-4 border-b transition-colors ${
            isDark 
              ? 'bg-zinc-950/90 text-zinc-400 border-zinc-800/60' 
              : 'bg-zinc-100/90 text-zinc-600 border-zinc-200/60'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-none whitespace-nowrap">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{topBannerText.toUpperCase()}</span>
              </span>
              <span className="text-zinc-600 dark:text-zinc-700">//</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-400" />
                <span>100% AGENCY SEALED</span>
              </span>
              <span className="hidden md:inline text-zinc-600 dark:text-zinc-700">//</span>
              <span className="hidden md:flex items-center gap-1 text-zinc-400">
                <Coins className="w-3 h-3 text-zinc-400" />
                <span>RATE: $1 = {DEFAULT_USD_TO_LBP_RATE.toLocaleString()} L.L.</span>
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {onSwitchToShowroom && (
                <button 
                  id="showroom-top-btn"
                  onClick={onSwitchToShowroom}
                  className="hover:text-zinc-100 transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-[11px] uppercase font-mono"
                  title="Enter 3D Spatial Showroom"
                >
                  <Box className="w-3 h-3" />
                  <span>3D ROOM</span>
                </button>
              )}
              {onSwitchToShowroom && <span className="hidden sm:inline text-zinc-600 dark:text-zinc-700">//</span>}
              <button 
                id="contact-top-btn"
                onClick={onOpenContact}
                className="hover:text-zinc-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px] uppercase font-mono"
                title="Customer Support"
              >
                <HelpCircle className="w-3 h-3" />
                <span>SUPPORT</span>
              </button>
              <span className="text-zinc-600 dark:text-zinc-700">//</span>
              <button 
                id="trade-in-top-btn"
                onClick={onOpenTradeIn}
                className="hover:text-zinc-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px] uppercase font-mono"
              >
                <Calculator className="w-3 h-3" />
                <span>TRADE-IN</span>
              </button>
              <span className="text-zinc-600 dark:text-zinc-700">//</span>
              {onOpenAdmin && (
                <button 
                  id="admin-top-btn"
                  onClick={onOpenAdmin}
                  className="hover:text-zinc-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px] uppercase font-mono"
                  title="Admin Portal"
                >
                  <span>ADMIN</span>
                </button>
              )}
              {onOpenAdmin && <span className="text-zinc-600 dark:text-zinc-700">//</span>}
              <a 
                href={buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store, I have an inquiry about a product')} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-zinc-100 transition-colors flex items-center gap-1 text-[11px] font-mono text-zinc-400"
              >
                <MessageCircle className="w-3 h-3 text-zinc-400" />
                <span>WA: {whatsappNumber}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center md:hidden rounded-lg transition-micro cursor-pointer -ml-1 ${
                isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button 
              id="brand-logo-btn"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="ON ALAA STORE Homepage"
            >
              <LogoAvatar size="sm" withGlow={false} />
              <Brand3DText 
                size="sm" 
                isDarkTheme={isDark} 
                withLebanonBadge={true} 
                withTagline={false} 
              />
            </button>
          </div>

          {/* Dedicated Always-Visible Persistent Search Bar */}
          <div 
            id="header-search-container" 
            className="flex-1 max-w-lg lg:max-w-xl hidden md:block"
          >
            <SearchAutocomplete
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              products={products}
              onSelectProduct={onSelectProduct}
              onSelectCategory={onSelectCategory}
              onAddToCart={onAddToCart}
              currency={currency}
              placeholder="Search flagship devices, chips, models... (Press /)"
              idPrefix="header-desktop"
            />
          </div>

          {/* Technical Controls & User Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Minimalist Segmented Currency Selector */}
            <div 
              role="radiogroup" 
              aria-label="Store Currency"
              className={`flex items-center p-0.5 rounded-lg border text-[11px] font-mono transition-colors ${
                isDark 
                  ? 'bg-zinc-900/90 border-zinc-800 text-zinc-400' 
                  : 'bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={currency === 'USD'}
                id="currency-usd-btn"
                onClick={() => onCurrencyChange('USD')}
                className={`px-2 py-1 rounded-md transition-micro cursor-pointer font-mono font-medium ${
                  currency === 'USD'
                    ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-2xs font-semibold' : 'bg-white text-zinc-950 shadow-2xs font-semibold')
                    : 'hover:text-zinc-200'
                }`}
                title="US Dollars"
              >
                USD
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={currency === 'LBP'}
                id="currency-lbp-btn"
                onClick={() => onCurrencyChange('LBP')}
                className={`px-2 py-1 rounded-md transition-micro cursor-pointer font-mono font-medium ${
                  currency === 'LBP'
                    ? (isDark ? 'bg-zinc-100 text-zinc-950 shadow-2xs font-semibold' : 'bg-white text-zinc-950 shadow-2xs font-semibold')
                    : 'hover:text-zinc-200'
                }`}
                title="Lebanese Pounds (L.L.)"
              >
                LBP
              </button>
            </div>

            {/* Dark / Light Theme Toggle Button */}
            {onToggleTheme && (
              <button
                id="header-theme-toggle-btn"
                type="button"
                onClick={onToggleTheme}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-micro cursor-pointer ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700'
                    : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300'
                }`}
                title={isDark ? "Switch to Minimal Light Mode" : "Switch to Tech Dark Mode"}
                aria-label="Toggle visual theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Special Archive / Offers Link */}
            {onNavigateToOffers && (
              <button
                id="header-offers-btn"
                onClick={onNavigateToOffers}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-tight uppercase border transition-micro cursor-pointer ${
                  isOffersPage
                    ? (isDark ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold' : 'bg-zinc-900 text-white border-zinc-900 font-semibold')
                    : (isDark ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-zinc-700 hover:text-zinc-950')
                }`}
                title="View Special Offers & Discounted Products"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                <span>OFFERS</span>
                {offersCount > 0 && (
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                    isOffersPage ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {offersCount}
                  </span>
                )}
              </button>
            )}

            {/* Compare Specifications Button */}
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className={`w-9 h-9 rounded-lg border hidden md:flex items-center justify-center transition-micro relative cursor-pointer ${
                compareCount > 0 
                  ? 'border-blue-500 text-white bg-blue-600/30' 
                  : (isDark ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300')
              }`}
              title="Compare Specifications"
              aria-label="Compare specifications"
            >
              <ArrowLeftRight className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-mono text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Saved Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className={`w-9 h-9 rounded-lg border hidden sm:flex items-center justify-center transition-micro relative cursor-pointer ${
                wishlistCount > 0 
                  ? 'border-blue-500 text-white bg-blue-600/30' 
                  : (isDark ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300')
              }`}
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-blue-500 text-blue-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-mono text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Profile / Account Button (Ishtari style) */}
            {onOpenAccount && (
              <button
                id="header-account-btn"
                onClick={onOpenAccount}
                className={`w-9 h-9 rounded-lg border hidden sm:flex items-center justify-center transition-micro cursor-pointer ${
                  isDark
                    ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800'
                    : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                }`}
                title="Account, Orders & Delivery Profile"
                aria-label="User Account"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            {/* Primary Action: Vibrant Electric Blue Cart Trigger */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-lg shadow-blue-600/30"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">CART</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black bg-white text-blue-600 shadow-xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        <div className="mt-2.5 md:hidden">
          <SearchAutocomplete
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            products={products}
            onSelectProduct={onSelectProduct}
            onSelectCategory={onSelectCategory}
            onAddToCart={onAddToCart}
            currency={currency}
            placeholder="Search flagships, chips, devices..."
            isMobile={true}
            idPrefix="header-mobile"
          />
        </div>
      </div>

      {/* Category Pills Bar (Subtle, technical 1px row) */}
      <div className={`border-t overflow-x-auto scrollbar-none py-2 px-4 transition-colors ${
        isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-white border-zinc-200/80'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-nav-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-mono transition-micro cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : (isDark ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800' : 'text-[#333333] hover:text-[#111111] hover:bg-[#F8F9FA] border border-transparent hover:border-zinc-200')
                }`}
              >
                <CategoryIcon
                  nameOrId={cat.iconName || cat.id}
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-white' : (isDark ? 'text-zinc-400' : 'text-[#555555]')
                  }`}
                />
                <span>{cat.name.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 space-y-3 transition-colors ${
          isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}>
          {/* Mobile Currency & Theme Grid */}
          <div className={`p-3 rounded-xl border space-y-2.5 font-mono text-xs ${
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span>CURRENCY & THEME</span>
              <span>$1 = {DEFAULT_USD_TO_LBP_RATE.toLocaleString()} L.L.</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCurrencyChange('USD')}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center justify-center gap-1 transition-micro cursor-pointer ${
                  currency === 'USD'
                    ? (isDark ? 'bg-zinc-100 text-zinc-950 border-transparent font-semibold' : 'bg-zinc-900 text-white border-transparent font-semibold')
                    : (isDark ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-700')
                }`}
              >
                <span>USD ($)</span>
                {currency === 'USD' && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>

              <button
                type="button"
                onClick={() => onCurrencyChange('LBP')}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center justify-center gap-1 transition-micro cursor-pointer ${
                  currency === 'LBP'
                    ? (isDark ? 'bg-zinc-100 text-zinc-950 border-transparent font-semibold' : 'bg-zinc-900 text-white border-transparent font-semibold')
                    : (isDark ? 'border-zinc-800 text-zinc-300' : 'border-zinc-200 text-zinc-700')
                }`}
              >
                <span>LBP (L.L.)</span>
                {currency === 'LBP' && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className={`w-full min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-micro cursor-pointer ${
                  isDark ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800/50' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>THEME MODE</span>
                </span>
                <span className="uppercase text-[10px] text-zinc-400 font-semibold">{theme}</span>
              </button>
            )}
          </div>

          {/* Special Offers Mobile Link */}
          {onNavigateToOffers && (
            <button
              onClick={() => {
                onNavigateToOffers();
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-mono tracking-tight uppercase border flex items-center justify-between transition-micro ${
                isDark ? 'border-zinc-800 bg-zinc-900/60 text-zinc-200' : 'border-zinc-200 bg-zinc-50 text-zinc-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
                <span>ARCHIVE OFFERS</span>
              </span>
              <span className="text-zinc-400">[{offersCount}] →</span>
            </button>
          )}

          {/* User Account / Orders Mobile Button */}
          {onOpenAccount && (
            <button
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-mono tracking-tight uppercase border flex items-center justify-between transition-micro ${
                isDark ? 'border-blue-900/60 bg-blue-950/30 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>MY ACCOUNT & ORDERS</span>
              </span>
              <span>→</span>
            </button>
          )}

          {/* Quick Support Links */}
          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
            <button 
              onClick={() => {
                onOpenTradeIn();
                setMobileMenuOpen(false);
              }}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              TRADE-IN ESTIMATOR
            </button>
            <a 
              href={buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store')}
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-100 transition-colors"
            >
              WHATSAPP SUPPORT
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
