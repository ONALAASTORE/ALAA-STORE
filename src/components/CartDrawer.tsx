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
import { buildWhatsAppLink } from '../utils/phone';
import { formatWhatsAppCartSummary } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  onClearCart: () => void;
  whatsappNumber?: string;
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
  whatsappNumber = '+961 71 135 241',
}) => {
  if (!isOpen) return null;

  const subtotalUSD = items.reduce((sum, item) => sum + (item.selectedVariant.priceUSD * item.quantity), 0);
  const freeDeliveryThreshold = 150;
  const isFreeDelivery = subtotalUSD >= freeDeliveryThreshold;
  const progressPercent = Math.min(100, (subtotalUSD / freeDeliveryThreshold) * 100);

  const whatsappCartMessage = formatWhatsAppCartSummary({
    items,
    deliveryFeeUSD: isFreeDelivery ? 0 : 3,
  });

  const whatsappOrderHref = buildWhatsAppLink(whatsappNumber, whatsappCartMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500">{items.reduce((s, i) => s + i.quantity, 0)} items in basket</p>
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer"
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
            className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
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
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 text-xs overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-bold text-slate-900 min-w-[28px] text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 active:bg-slate-200 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-slate-900 block font-display">
                          {formatPrice(itemTotal, currency)}
                        </span>
                        {currency === 'USD' && (
                          <span className="text-[10px] text-slate-400">
                            ≈ {formatPrice(itemTotal, 'LBP')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedVariant.id)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3 pb-safe">
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

            {/* Action Buttons (Frictionless Touch Targets min-h-[48px]) */}
            <div className="space-y-2.5 pt-2">
              <button
                id="cart-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full min-h-[48px] py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="cart-whatsapp-order-btn"
                href={whatsappOrderHref}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer text-center"
                title="Send whole cart to WhatsApp instantly"
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
