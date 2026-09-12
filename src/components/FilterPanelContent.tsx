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
  theme?: 'dark' | 'light';
}

export const FilterPanelContent: React.FC<FilterPanelContentProps> = ({
  filterState,
  setFilterState,
  currency,
  onResetFilters,
  hasActiveFilters,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-5 font-mono">
      {/* Header with Title & Reset Button */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDark ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-tight flex items-center gap-2 ${
          isDark ? 'text-zinc-200' : 'text-zinc-900'
        }`}>
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span>FILTER PARAMETERS</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer flex items-center gap-1 font-mono uppercase"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight block">
          MANUFACTURER
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => setFilterState((prev) => ({ ...prev, brand }))}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono transition-micro cursor-pointer flex items-center justify-between ${
                filterState.brand === brand
                  ? (isDark ? 'bg-zinc-100 text-zinc-950 font-bold' : 'bg-zinc-900 text-white font-bold')
                  : (isDark ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100')
              }`}
            >
              <span>{brand.toUpperCase()}</span>
              {filterState.brand === brand && <span>•</span>}
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
        className={isDark ? 'border-zinc-800' : 'border-zinc-200'}
      />

      {/* Condition Filter */}
      <div className={`space-y-2 pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight block">
          HARDWARE STATE
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'ALL CONDITIONS' },
            { id: 'Brand New (Sealed)', label: 'BRAND NEW (SEALED)' },
            { id: 'Open Box', label: 'OPEN BOX / LIKE NEW' },
            { id: 'Certified Pre-Owned', label: 'CERTIFIED PRE-OWNED' },
          ].map((cond) => (
            <button
              key={cond.id}
              onClick={() => setFilterState((prev) => ({ ...prev, condition: cond.id }))}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono transition-micro cursor-pointer flex items-center justify-between ${
                filterState.condition === cond.id
                  ? (isDark ? 'bg-zinc-100 text-zinc-950 font-bold' : 'bg-zinc-900 text-white font-bold')
                  : (isDark ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100')
              }`}
            >
              <span>{cond.label}</span>
              {filterState.condition === cond.id && <span>•</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className={`pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-mono">
          <input
            type="checkbox"
            checked={filterState.onlyInStock}
            onChange={(e) => setFilterState((prev) => ({ ...prev, onlyInStock: e.target.checked }))}
            className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-zinc-100 focus:ring-0 cursor-pointer accent-zinc-500"
          />
          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
            IN-STOCK ONLY
          </span>
        </label>
      </div>

      {/* WhatsApp Help banner in sidebar */}
      <div className={`p-3.5 rounded-xl border space-y-1.5 text-xs font-mono ${
        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>
          <MessageCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>CUSTOM HARDWARE?</span>
        </div>
        <p className="text-zinc-500 text-[11px] leading-relaxed">
          Need specific memory, GPU configuration, or unlisted colors? We source directly from authorized Lebanese distributors.
        </p>
        <a
          href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store%2C%20I%20am%20looking%20for%20a%20custom%20device%20spec"
          target="_blank"
          rel="noreferrer"
          className="inline-block text-zinc-300 hover:text-white underline text-[11px] pt-0.5"
        >
          CONTACT DISPATCH DESK →
        </a>
      </div>
    </div>
  );
};
