import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const subtotalUSD = items.reduce((sum, item) => sum + (item.selectedVariant.priceUSD * item.quantity), 0);
  const freeDeliveryThreshold = 150;
  const isFreeDelivery = subtotalUSD >= freeDeliveryThreshold;
  const progressPercent = Math.min(100, (subtotalUSD / freeDeliveryThreshold) * 100);

  const whatsappCartMessage = encodeURIComponent(
    `Hello On Alaa Store! 🇱🇧\nHere is my shopping cart order:\n\n${items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name}\n   - Variant: ${item.selectedVariant.name}\n   - Qty: ${item.quantity} x $${item.selectedVariant.priceUSD} = $${item.selectedVariant.priceUSD * item.quantity}`
      )
      .join('\n')}\n\n*Total:* $${subtotalUSD}\n\nPlease proceed with my delivery!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500">{items.reduce((s, i) => s + i.quantity, 0)} items in basket</p>
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-bold"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100 text-xs">
          <div className="flex items-center justify-between text-blue-900 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              {isFreeDelivery ? 'You unlocked Free Lebanon Delivery!' : `Add $${(freeDeliveryThreshold - subtotalUSD).toFixed(0)} more for Free Delivery`}
            </span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-blue-200/80 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our collection of phones, laptops, audio gear & accessories to add items.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = item.selectedVariant.priceUSD * item.quantity;
              return (
                <div key={`${item.product.id}-${item.selectedVariant.id}`} className="pt-3 first:pt-0 flex gap-3 items-start">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-slate-200/80 p-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-blue-600 font-semibold truncate">
                      {item.selectedVariant.name}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-slate-900 block font-display">
                          {formatPrice(itemTotal, currency)}
                        </span>
                        {currency === 'USD' && (
                          <span className="text-[9px] text-slate-400">
                            ≈ {formatPrice(itemTotal, 'LBP')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedVariant.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
            {/* Subtotal Calculation */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900 font-display">{formatPrice(subtotalUSD, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (All Lebanon)</span>
                <span className="font-bold text-emerald-600">
                  {isFreeDelivery ? 'FREE' : '$3.00 (≈ 270,000 L.L.)'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Estimated Total</span>
                <div className="text-right">
                  <span className="font-display block">
                    {formatPrice(subtotalUSD + (isFreeDelivery ? 0 : 3), currency)}
                  </span>
                  {currency === 'USD' && (
                    <span className="text-[10px] text-slate-400 font-medium block">
                      ≈ {formatPrice(subtotalUSD + (isFreeDelivery ? 0 : 3), 'LBP')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                id="cart-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="cart-whatsapp-order-btn"
                href={`https://wa.me/96171135241?text=${whatsappCartMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Fast 1-Click WhatsApp Order</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Cash on Delivery • 100% Sealed Original Items</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
