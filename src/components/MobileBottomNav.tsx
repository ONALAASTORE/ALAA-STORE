import React from 'react';
import { 
  Store, 
  SlidersHorizontal, 
  Heart, 
  ArrowLeftRight, 
  ShoppingCart 
} from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onScrollToTop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  compareCount,
  activeFilterCount,
  onOpenMobileFilters,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onScrollToTop,
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] md:hidden pb-safe transition-all duration-200"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        
        {/* 1. Store / Catalog Home */}
        <button
          id="mobile-nav-store"
          type="button"
          onClick={onScrollToTop}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-blue-600 active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-slate-50"
          aria-label="Storefront Top"
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">Store</span>
        </button>

        {/* 2. Filters & Sort Drawer */}
        <button
          id="mobile-nav-filters"
          type="button"
          onClick={onOpenMobileFilters}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-blue-600 active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-slate-50 relative"
          aria-label="Filter products"
        >
          <div className="relative">
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Filters</span>
        </button>

        {/* 3. Wishlist */}
        <button
          id="mobile-nav-wishlist"
          type="button"
          onClick={onOpenWishlist}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-rose-600 active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-slate-50 relative"
          aria-label="Saved Wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Wishlist</span>
        </button>

        {/* 4. Compare */}
        <button
          id="mobile-nav-compare"
          type="button"
          onClick={onOpenCompare}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-blue-600 active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-slate-50 relative"
          aria-label="Compare Devices"
        >
          <div className="relative">
            <ArrowLeftRight className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {compareCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Compare</span>
        </button>

        {/* 5. Cart Drawer */}
        <button
          id="mobile-nav-cart"
          type="button"
          onClick={onOpenCart}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 text-blue-600 hover:text-blue-700 active:scale-95 transition-all cursor-pointer rounded-xl hover:bg-blue-50/60 relative"
          aria-label="Shopping Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#FF0000] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black tracking-tight">Cart</span>
        </button>

      </div>
    </nav>
  );
};
