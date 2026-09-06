import React from 'react';
import { DollarSign, RotateCcw } from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface PriceRangeSliderProps {
  minPriceUSD: number;
  maxPriceUSD: number;
  onChange: (min: number, max: number) => void;
  currency: Currency;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  className?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPriceUSD,
  maxPriceUSD,
  onChange,
  currency,
  minLimit = 0,
  maxLimit = 3000,
  step = 25,
  className = '',
}) => {
  const isFiltered = minPriceUSD > minLimit || maxPriceUSD < maxLimit;

  // Calculate percentage positions for active track highlight
  const minPercent = Math.max(0, Math.min(100, ((minPriceUSD - minLimit) / (maxLimit - minLimit)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxPriceUSD - minLimit) / (maxLimit - minLimit)) * 100));

  const handleReset = () => {
    onChange(minLimit, maxLimit);
  };

  const handleMinChange = (newMin: number) => {
    const safeMin = Math.max(minLimit, Math.min(newMin, maxPriceUSD - step));
    onChange(safeMin, maxPriceUSD);
  };

  const handleMaxChange = (newMax: number) => {
    const safeMax = Math.min(maxLimit, Math.max(newMax, minPriceUSD + step));
    onChange(minPriceUSD, safeMax);
  };

  return (
    <div className={`space-y-3 pt-3 border-t border-slate-100 ${className}`}>
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-blue-600" />
          <span>Price Range</span>
        </label>
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
            title="Reset price range"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Current Range Summary Display */}
      <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg">
        <span className="font-bold text-slate-800">
          {formatPrice(minPriceUSD, currency)}
        </span>
        <span className="text-slate-400 font-medium">to</span>
        <span className="font-bold text-slate-800">
          {formatPrice(maxPriceUSD, currency)}
        </span>
      </div>

      {/* Dual Slider Range Track Container */}
      <div className="relative h-7 flex items-center px-1">
        {/* Grey Background Track */}
        <div className="absolute left-1 right-1 h-2 bg-slate-200/80 rounded-full overflow-hidden" />

        {/* Active Blue Colored Track Between Min and Max */}
        <div
          className="absolute h-2 bg-blue-600 rounded-full transition-all duration-75 shadow-xs"
          style={{
            left: `calc(4px + ${minPercent}% * 0.96)`,
            width: `calc(${maxPercent - minPercent}% * 0.96)`,
          }}
        />

        {/* Min Range Slider */}
        <input
          type="range"
          id="price-range-min-slider"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={minPriceUSD}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className={`absolute left-0 w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4.5 [&::-moz-range-thumb]:h-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md ${
            minPriceUSD > maxLimit * 0.75 ? 'z-30' : 'z-20'
          }`}
          aria-label="Minimum price in USD"
        />

        {/* Max Range Slider */}
        <input
          type="range"
          id="price-range-max-slider"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={maxPriceUSD}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute left-0 w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4.5 [&::-webkit-slider-thumb]:h-4.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4.5 [&::-moz-range-thumb]:h-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md z-25"
          aria-label="Maximum price in USD"
        />
      </div>

      {/* Manual Numeric Inputs for Precision */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Min ($)
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs font-semibold text-slate-400 pointer-events-none">$</span>
            <input
              type="number"
              id="price-min-number-input"
              min={minLimit}
              max={maxPriceUSD - step}
              step={step}
              value={minPriceUSD}
              onChange={(e) => handleMinChange(Number(e.target.value) || 0)}
              className="w-full pl-6 pr-2 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        <span className="text-slate-300 font-bold mt-4 select-none">—</span>

        <div className="flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Max ($)
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-xs font-semibold text-slate-400 pointer-events-none">$</span>
            <input
              type="number"
              id="price-max-number-input"
              min={minPriceUSD + step}
              max={maxLimit}
              step={step}
              value={maxPriceUSD}
              onChange={(e) => handleMaxChange(Number(e.target.value) || maxLimit)}
              className="w-full pl-6 pr-2 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Quick Budget Presets */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Budgets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Under $300', min: 0, max: 300 },
            { label: '$300–$800', min: 300, max: 800 },
            { label: '$800–$1.5k', min: 800, max: 1500 },
            { label: '$1.5k+', min: 1500, max: 3000 },
          ].map((preset) => {
            const isActive = minPriceUSD === preset.min && maxPriceUSD === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.min, preset.max)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
