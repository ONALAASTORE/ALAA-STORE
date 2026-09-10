import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  Watch, 
  ShieldCheck, 
  Truck, 
  ArrowRightLeft, 
  Heart,
  X,
  Flame 
} from 'lucide-react';
import { Product, Currency, CartItem, ProductVariant, StoreSettings } from '../../types';
import { ShowroomMeshBackground } from './ShowroomMeshBackground';
import { Hero3DCarousel } from './Hero3DCarousel';
import { OrbitalMenu } from './OrbitalMenu';
import { ProductCard3D } from './ProductCard3D';
import { ProductViewer3DModal } from './ProductViewer3DModal';
import { TunnelCheckoutModal } from './TunnelCheckoutModal';
import { AIAssistantHologram } from './AIAssistantHologram';
import { SmartCart3D } from './SmartCart3D';
import { PersonalizationPanel } from './PersonalizationPanel';
import { 
  playHoverBlip, 
  playClickBeep, 
  isAudioMuted, 
  setAudioMuted 
} from '../../utils/audio2027';

interface Showroom2027ViewProps {
  products: Product[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product, variant?: ProductVariant) => void;
  cartItems: CartItem[];
  onUpdateCartQuantity: (productId: string, variantId: string, qty: number) => void;
  onRemoveCartItem: (productId: string, variantId: string) => void;
  onClearCart: () => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  recentlyViewed: Product[];
  storeSettings: StoreSettings;
  onSwitchToClassic: () => void;
  onOpenAdmin: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onNavigateToOffers?: () => void;
}

export const Showroom2027View: React.FC<Showroom2027ViewProps> = ({
  products,
  currency,
  onCurrencyChange,
  onSelectProduct,
  onAddToCart,
  cartItems,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onClearCart,
  wishlistIds,
  onToggleWishlist,
  recentlyViewed,
  storeSettings,
  onSwitchToClassic,
  onOpenAdmin,
  onOpenWishlist,
  onOpenCompare,
  onNavigateToOffers,
}) => {
  // Category filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [soundMuted, setSoundMuted] = useState<boolean>(isAudioMuted());

  // 3D Product Viewer Modal
  const [viewerProduct, setViewerProduct] = useState<Product | null>(null);

  // 3D Tunnel Checkout Modal
  const [isTunnelCheckoutOpen, setIsTunnelCheckoutOpen] = useState(false);

  // AI Assistant Window
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setAudioMuted(next);
  };

  const categories = [
    { id: 'all', label: 'All Quantum Tech', icon: Sparkles },
    { id: 'phones', label: 'Flagship Phones', icon: Smartphone },
    { id: 'laptops', label: 'Pro Workstations', icon: Laptop },
    { id: 'audio', label: 'Spatial Audio', icon: Headphones },
    { id: 'gaming', label: 'Gaming Rigs', icon: Gamepad2 },
    { id: 'wearables', label: 'Smart Wearables', icon: Watch },
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#0A0F1E] text-white selection:bg-[#00F0FF] selection:text-slate-950 font-sans pb-28">
      
      {/* 3D Animated Mesh Gradients & Particle System */}
      <ShowroomMeshBackground />

      {/* =========================================================================
          FUTURISTIC HUD NAVIGATION BAR
         ========================================================================= */}
      <header className="sticky top-0 z-40 w-full glass-2027 border-b border-[#00F0FF]/25 backdrop-blur-2xl">
        {/* Top Nationwide Teleport Ticker */}
        {storeSettings.isTopBannerActive && (
          <div className="bg-gradient-to-r from-[#00F0FF]/15 via-[#7B2FFF]/15 to-[#FFD700]/15 py-1.5 px-4 text-center border-b border-white/5">
            <span className="text-[11px] font-mono tracking-wider text-slate-200 flex items-center justify-center gap-2">
              <Truck className="w-3 h-3 text-[#00F0FF] shrink-0" />
              <span>{storeSettings.topBannerText}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            </span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* 2027 Brand Logo with Hologram Flare */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl glass-2027 border border-[#00F0FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <span className="text-xl font-black text-gradient-2027">A</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-white font-display">
                  ON ALAA STORE
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[9px] font-mono font-bold text-[#00F0FF]">
                  2027 HUD
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Holographic Flagship Showroom
              </span>
            </div>
          </div>

          {/* Center Search Matrix */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00F0FF] pointer-events-none" />
              <input
                type="text"
                placeholder="Scan hardware catalog (iPhone, S25, M4, PS5)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl glass-2027 border border-white/15 text-white placeholder:text-slate-400 text-xs focus:border-[#00F0FF] focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Matrix */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Sci-Fi Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl glass-2027 border border-white/10 hover:border-[#00F0FF] text-slate-300 hover:text-white transition cursor-pointer"
              title={soundMuted ? 'Unmute 2027 Sci-Fi Audio' : 'Mute Sci-Fi Audio'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00F0FF]" />}
            </button>

            {/* Currency Switcher */}
            <button
              type="button"
              onClick={() => {
                playClickBeep();
                onCurrencyChange(currency === 'USD' ? 'LBP' : 'USD');
              }}
              onMouseEnter={playHoverBlip}
              className="px-2.5 py-1.5 rounded-xl glass-2027 border border-white/15 text-xs font-mono font-bold text-white hover:border-[#FFD700] transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="text-[#FFD700] font-black">{currency}</span>
              <span className="text-[10px] text-slate-400">⇄</span>
            </button>

            {/* Wishlist Matrix */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl glass-2027 border border-white/10 hover:border-rose-500 text-slate-300 hover:text-rose-400 transition cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Compare Matrix */}
            <button
              type="button"
              onClick={onOpenCompare}
              className="p-2 rounded-xl glass-2027 border border-white/10 hover:border-[#00F0FF] text-slate-300 hover:text-[#00F0FF] transition cursor-pointer hidden sm:flex"
              title="Compare Hardware"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* Special Offers Teleport */}
            {onNavigateToOffers && (
              <button
                type="button"
                onClick={() => {
                  playClickBeep();
                  onNavigateToOffers();
                }}
                onMouseEnter={playHoverBlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white text-xs font-black hover:brightness-110 active:scale-95 transition cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                title="View Active Discounts & Special Offers"
              >
                <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
                <span>Offers</span>
              </button>
            )}

            {/* Classic View Mode Switcher */}
            <button
              type="button"
              onClick={() => {
                playClickBeep();
                onSwitchToClassic();
              }}
              onMouseEnter={playHoverBlip}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-2027 border border-white/20 text-xs font-semibold text-slate-300 hover:text-white hover:border-white/50 transition cursor-pointer"
              title="Switch to Classic Store View"
            >
              <span>Classic Store</span>
            </button>

            {/* Admin Teleport */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 rounded-xl glass-2027 border border-white/10 hover:border-purple-400 text-slate-400 hover:text-purple-300 transition cursor-pointer"
              title="Admin Terminal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          3D HERO CAROUSEL OF SUSPENDED PRODUCTS
         ========================================================================= */}
      <Hero3DCarousel
        products={products}
        currency={currency}
        onSelectProduct={onSelectProduct}
        onAddToCart={(p) => onAddToCart(p)}
        onOpen3DViewer={(p) => setViewerProduct(p)}
      />

      {/* =========================================================================
          CATEGORY CAPSULES BAR
         ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playClickBeep();
                  setSelectedCategory(cat.id);
                }}
                onMouseEnter={playHoverBlip}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                    : 'glass-2027 border-white/10 text-slate-300 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MAIN 3D PRODUCT SHOWROOM GRID
         ========================================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-mono">
              Quantum Hardware Inventory
            </h2>
            <span className="text-xs font-mono text-[#00F0FF] px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40">
              {filteredProducts.length} models
            </span>
          </div>
        </div>

        {/* 3D Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-2027 rounded-3xl border border-white/10 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-500 mx-auto animate-pulse" />
            <h3 className="text-base font-bold text-white">Zero Hardware Matches Found</h3>
            <p className="text-xs text-slate-400">Try recalibrating your search query or selecting another tech category.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard3D
                key={prod.id}
                product={prod}
                currency={currency}
                isWishlisted={wishlistIds.includes(prod.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p) => onAddToCart(p)}
                onOpen3DViewer={(p) => setViewerProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* =========================================================================
          AI PERSONALIZATION PANEL
         ========================================================================= */}
      <PersonalizationPanel
        products={products}
        currency={currency}
        recentlyViewed={recentlyViewed}
        onSelectProduct={onSelectProduct}
        onAddToCart={(p) => onAddToCart(p)}
      />

      {/* =========================================================================
          3D ORBITAL MENU (Circular navigation orbiting center point)
         ========================================================================= */}
      <OrbitalMenu
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        onOpenAI={() => setIsAIAssistantOpen(true)}
        onOpenCart={() => {}}
        onOpenCheckoutTunnel={() => setIsTunnelCheckoutOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />

      {/* =========================================================================
          FLOATING 3D SMART CART
         ========================================================================= */}
      <SmartCart3D
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveCartItem}
        onOpenTunnelCheckout={() => setIsTunnelCheckoutOpen(true)}
      />

      {/* =========================================================================
          AI SHOPPING ASSISTANT WITH HOLOGRAPHIC PROJECTION
         ========================================================================= */}
      <AIAssistantHologram
        products={products}
        currency={currency}
        onSelectProduct={onSelectProduct}
        onAddToCart={(p) => onAddToCart(p)}
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
      />

      {/* =========================================================================
          360° ROTATABLE 3D PRODUCT VIEWER & AR PREVIEW MODAL
         ========================================================================= */}
      <AnimatePresence>
        {viewerProduct && (
          <ProductViewer3DModal
            product={viewerProduct}
            currency={currency}
            onClose={() => setViewerProduct(null)}
            onAddToCart={(p) => onAddToCart(p)}
          />
        )}
      </AnimatePresence>

      {/* =========================================================================
          3D TUNNEL CHECKOUT MODAL FLOW
         ========================================================================= */}
      <AnimatePresence>
        {isTunnelCheckoutOpen && (
          <TunnelCheckoutModal
            isOpen={isTunnelCheckoutOpen}
            onClose={() => setIsTunnelCheckoutOpen(false)}
            cartItems={cartItems}
            currency={currency}
            storeSettings={storeSettings}
            onClearCart={onClearCart}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
