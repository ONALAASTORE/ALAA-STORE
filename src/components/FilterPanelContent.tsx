import React from 'react';
import { SlidersHorizontal, MessageCircle, RotateCcw } from 'lucide-react';
import { BRANDS } from '../data/categories';
import { PriceRangeSlider } from './PriceRangeSlider';
import { FilterState, Currency } from '../types';

interface FilterPanelContentProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  currency: Currency;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterPanelContent: React.FC<FilterPanelContentProps> = ({
  filterState,
  setFilterState,
  currency,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-6">
      {/* Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Refine Catalog</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Brand / Manufacturer
        </label>
        <div className="space-y-1">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => setFilterState((prev) => ({ ...prev, brand }))}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] flex items-center ${
                filterState.brand === brand
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Slider-based Price Range Filter */}
      <PriceRangeSlider
        minPriceUSD={filterState.minPriceUSD}
        maxPriceUSD={filterState.maxPriceUSD}
        onChange={(min, max) =>
          setFilterState((prev) => ({
            ...prev,
            minPriceUSD: min,
            maxPriceUSD: max,
          }))
        }
        currency={currency}
        minLimit={0}
        maxLimit={3000}
        step={25}
      />

      {/* Condition Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Item Condition
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'All Conditions' },
            { id: 'Brand New (Sealed)', label: 'Brand New (Sealed)' },
            { id: 'Open Box', label: 'Open Box / Like New' },
            { id: 'Certified Pre-Owned', label: 'Certified Pre-Owned' },
          ].map((cond) => (
            <button
              key={cond.id}
              onClick={() => setFilterState((prev) => ({ ...prev, condition: cond.id }))}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] flex items-center ${
                filterState.condition === cond.id
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px] select-none">
          <input
            type="checkbox"
            checked={filterState.onlyInStock}
            onChange={(e) => setFilterState((prev) => ({ ...prev, onlyInStock: e.target.checked }))}
            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
          />
          <span className="text-xs font-semibold text-slate-700">
            Show In-Stock Only
          </span>
        </label>
      </div>

      {/* WhatsApp Help banner in sidebar */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2 text-xs">
        <div className="font-bold text-emerald-900 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Looking for a specific device?</span>
        </div>
        <p className="text-emerald-800 text-[11px] leading-relaxed">
          We can source customized specs or special colors from authorized distributors in Lebanon.
        </p>
        <a
          href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store%2C%20I%20am%20looking%20for%20a%20specific%20device"
          target="_blank"
          rel="noreferrer"
          className="inline-block font-bold text-emerald-700 hover:underline text-[11px]"
        >
          Contact WhatsApp Rep →
        </a>
      </div>
    </div>
  );
};
