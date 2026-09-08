import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { CartItem, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { playHoverBlip, playHologramActivation } from '../../utils/audio2027';

interface SmartCart3DProps {
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, variantId: string, qty: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onOpenTunnelCheckout: () => void;
}

export const SmartCart3D: React.FC<SmartCart3DProps> = ({
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onOpenTunnelCheckout,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.selectedVariant.priceUSD * item.quantity, 0);

  const toggleCart = () => {
    playHologramActivation();
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating 3D Smart Cart Orb in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={toggleCart}
          onMouseEnter={playHoverBlip}
          className="relative group cursor-pointer"
          aria-label="Toggle 3D Floating Smart Cart"
        >
          {/* Cyan Glow Pulse Aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* Cart Orb */}
          <div className="relative w-14 h-14 rounded-full glass-2027 border-2 border-[#00F0FF] flex items-center justify-center shadow-[0_0_35px_rgba(0,240,255,0.6)] group-hover:scale-108 transition-all">
            <ShoppingCart className="w-6 h-6 text-[#00F0FF]" />

            {/* Live Count Badge */}
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-950 font-black text-[10px] flex items-center justify-center shadow-lg animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Expanded 3D Floating Mini-Cart Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, z: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0, z: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[92vw] sm:w-[420px] max-h-[580px] rounded-3xl glass-2027 border border-[#00F0FF]/50 shadow-[0_0_60px_rgba(0,240,255,0.35)] flex flex-col overflow-hidden text-white"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-white/10 glass-2027 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-sm font-bold text-white">Floating Smart Cart</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 text-[#00F0FF] text-[10px] font-mono">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full glass-2027 hover:border-rose-500 hover:text-rose-400 flex items-center justify-center text-slate-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <ShoppingCart className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">Your smart cart payload is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant.id}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl glass-2027 border border-white/10 hover:border-[#00F0FF]/40 transition shadow-md"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain shrink-0 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                      referrerPolicy="no-referrer"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <span className="text-[10px] text-[#00F0FF] font-mono block truncate">
                        {item.selectedVariant.name}
                      </span>
                      <span className="text-xs font-black text-gradient-gold">
                        {formatPrice(item.selectedVariant.priceUSD, currency)}
                      </span>
                    </div>

                    {/* Quantity Selector & Trash */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 glass-2027 rounded-lg p-0.5 border border-white/10">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.selectedVariant.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Totals & 3D Tunnel Checkout Action */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-white/10 glass-2027 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">Payload Total:</span>
                  <span className="text-base font-black text-gradient-gold">
                    {formatPrice(subtotalUSD, currency)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenTunnelCheckout();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#7B2FFF] to-[#FFD700] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Launch 3D Tunnel Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
