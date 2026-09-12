import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  ShoppingCart, 
  User, 
  Flame
} from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount?: number;
  onOpenMobileFilters?: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onScrollToTop: () => void;
  onOpenCategories?: () => void;
  onOpenAccount?: () => void;
  onNavigateToOffers?: () => void;
  isOffersActive?: boolean;
  offersCount?: number;
  theme?: 'dark' | 'light';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenWishlist,
  onScrollToTop,
  onOpenCategories,
  onOpenAccount,
  onNavigateToOffers,
  isOffersActive = false,
  offersCount = 0,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      id="mobile-bottom-navigation-bar"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg md:hidden pb-safe transition-colors duration-200 ${
        isDark 
          ? 'bg-[#0B0B0C]/95 border-zinc-800/90 text-zinc-400' 
          : 'bg-white/95 border-zinc-200/90 text-zinc-600'
      }`}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        
        {/* 1. Home (Ishtari style) */}
        <button
          id="mobile-nav-home"
          type="button"
          onClick={onScrollToTop}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer rounded-xl ${
            !isOffersActive 
              ? 'text-blue-500 font-bold' 
              : 'hover:text-zinc-200 text-zinc-400'
          }`}
          aria-label="Home"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Categories (Ishtari style) */}
        <button
          id="mobile-nav-categories"
          type="button"
          onClick={onOpenCategories || onScrollToTop}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer rounded-xl hover:text-blue-400 text-zinc-400"
          aria-label="Categories"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Categories</span>
        </button>

        {/* 3. Flash Offers / Deals */}
        <button
          id="mobile-nav-offers"
          type="button"
          onClick={onNavigateToOffers || onScrollToTop}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer rounded-xl relative ${
            isOffersActive ? 'text-amber-400 font-bold' : 'hover:text-amber-400 text-zinc-400'
          }`}
          aria-label="Offers"
        >
          <div className="relative">
            <Flame className="w-4 h-4" />
            {offersCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-mono px-1 h-3.5 min-w-3.5 rounded-full flex items-center justify-center bg-amber-500 text-black font-bold">
                {offersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Deals</span>
        </button>

        {/* 4. Cart (Ishtari style prominent cart) */}
        <button
          id="mobile-nav-cart"
          type="button"
          onClick={onOpenCart}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer rounded-xl relative text-zinc-200"
          aria-label="Shopping Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 text-[9px] font-mono px-1.5 h-4 min-w-4 rounded-full flex items-center justify-center font-black bg-blue-600 text-white shadow-md shadow-blue-600/50">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Cart</span>
        </button>

        {/* 5. Profile / Account (Ishtari style) */}
        <button
          id="mobile-nav-profile"
          type="button"
          onClick={onOpenAccount || onOpenWishlist}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer rounded-xl hover:text-blue-400 text-zinc-400"
          aria-label="My Profile & Orders"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>

      </div>
    </nav>
  );
};
