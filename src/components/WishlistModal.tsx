import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-rose-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              Saved Wishlist
            </h3>
            <p className="text-xs text-slate-500">
              {products.length} saved item{products.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Your wishlist is empty</p>
            <p className="text-xs text-slate-400">Save items you want to keep an eye on by tapping the heart icon on any device.</p>
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {products.map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-4 justify-between">
                <div 
                  onClick={() => {
                    onClose();
                    onQuickView(p);
                  }}
                  className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{p.brand}</span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                      {p.name}
                    </h4>
                    <div className="text-xs font-black text-slate-900 font-display mt-0.5">
                      {formatPrice(p.basePriceUSD, currency)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart(p)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
