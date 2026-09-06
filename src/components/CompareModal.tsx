import React from 'react';
import { X, ArrowLeftRight, Trash2, ShoppingCart } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onRemoveFromCompare: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onRemoveFromCompare,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  // Gather all unique spec keys
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              Side-by-Side Tech Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Comparing {products.length} device{products.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-slate-500">No products added to comparison list yet.</p>
            <p className="text-xs text-slate-400">Click the compare icon (↔) on any product card to compare specs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-3 w-40 text-slate-400 font-bold uppercase text-[10px]">Specification</th>
                  {products.map((p) => (
                    <th key={p.id} className="p-3 min-w-[220px] align-top">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-20 h-20 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => onRemoveFromCompare(p.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                        <div className="text-sm font-black text-blue-600 font-display">
                          {formatPrice(p.basePriceUSD, currency)}
                        </div>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-700">Brand</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 font-semibold text-slate-800">{p.brand}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700">Category</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-slate-600">{p.subcategory || p.category}</td>
                  ))}
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-700">Official Warranty</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 font-medium text-emerald-700">{p.warranty}</td>
                  ))}
                </tr>
                {allSpecKeys.map((key) => (
                  <tr key={key}>
                    <td className="p-3 font-bold text-slate-700">{key}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-3 text-slate-600">
                        {p.specs[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
