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
    <div className={`space-y-3 pt-3 border-t font-mono ${className}`}>
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-tight flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
          <span>PRICE RANGE</span>
        </label>
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[10px] uppercase text-zinc-400 hover:text-zinc-100 transition cursor-pointer"
            title="Reset price range"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Current Range Summary Display */}
      <div className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-zinc-950/70 border border-zinc-800 rounded-md text-zinc-200">
        <span className="font-semibold">
          {formatPrice(minPriceUSD, currency)}
        </span>
        <span className="text-zinc-500 text-[10px]">TO</span>
        <span className="font-semibold">
          {formatPrice(maxPriceUSD, currency)}
        </span>
      </div>

      {/* Dual Slider Range Track Container */}
      <div className="relative h-6 flex items-center px-1">
        {/* Grey Background Track */}
        <div className="absolute left-1 right-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden" />

        {/* Active Track Between Min and Max */}
        <div
          className="absolute h-1.5 bg-zinc-300 rounded-full transition-all duration-75 shadow-xs"
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
          className={`absolute left-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-100 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:shadow-xs [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-100 [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-900 ${
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
          className="absolute left-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-100 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:shadow-xs [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-100 [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-900 z-25"
          aria-label="Maximum price in USD"
        />
      </div>

      {/* Manual Numeric Inputs for Precision */}
      <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
        <div className="flex-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
            MIN ($)
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-zinc-500 pointer-events-none">$</span>
            <input
              type="number"
              id="price-min-number-input"
              min={minLimit}
              max={maxPriceUSD - step}
              step={step}
              value={minPriceUSD}
              onChange={(e) => handleMinChange(Number(e.target.value) || 0)}
              className="w-full pl-6 pr-2 py-1 text-xs font-mono text-zinc-200 bg-zinc-950 border border-zinc-800 rounded-md focus:border-zinc-500 focus:outline-none transition"
            />
          </div>
        </div>

        <span className="text-zinc-600 mt-4 select-none">—</span>

        <div className="flex-1">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
            MAX ($)
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-zinc-500 pointer-events-none">$</span>
            <input
              type="number"
              id="price-max-number-input"
              min={minPriceUSD + step}
              max={maxLimit}
              step={step}
              value={maxPriceUSD}
              onChange={(e) => handleMaxChange(Number(e.target.value) || maxLimit)}
              className="w-full pl-6 pr-2 py-1 text-xs font-mono text-zinc-200 bg-zinc-950 border border-zinc-800 rounded-md focus:border-zinc-500 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Quick Budget Presets */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
          PRESETS
        </span>
        <div className="flex flex-wrap gap-1">
          {[
            { label: '<$300', min: 0, max: 300 },
            { label: '$300–800', min: 300, max: 800 },
            { label: '$800–1.5K', min: 800, max: 1500 },
            { label: '$1.5K+', min: 1500, max: 3000 },
          ].map((preset) => {
            const isActive = minPriceUSD === preset.min && maxPriceUSD === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.min, preset.max)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-micro cursor-pointer border ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
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
