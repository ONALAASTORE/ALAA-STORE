import React from 'react';
import { motion } from 'motion/react';
import { Search, RotateCcw, FilterX } from 'lucide-react';
import { FilterState } from '../types';

interface EmptyProductsStateProps {
  filterState: FilterState;
  onResetFilters: () => void;
}

export const EmptyProductsState: React.FC<EmptyProductsStateProps> = ({
  filterState,
  onResetFilters,
}) => {
  const hasActiveFilters =
    Boolean(filterState.searchQuery) ||
    filterState.category !== 'all' ||
    filterState.brand !== 'All Brands' ||
    filterState.condition !== 'all' ||
    filterState.onlyInStock ||
    filterState.minPriceUSD > 0 ||
    filterState.maxPriceUSD < 3000;

  return (
    <motion.div
      id="no-products-found-card"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-white rounded-2xl border border-slate-200/90 p-10 sm:p-14 text-center shadow-xs overflow-hidden relative"
    >
      {/* Subtle background ambient pulse glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -top-12">
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-72 h-72 rounded-full bg-gradient-to-tr from-blue-100/40 via-sky-100/30 to-indigo-100/40 blur-2xl"
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-5">
        {/* Animated Icon with Radar Rings */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          {/* Outer radar ripple 1 */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1.6],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full border border-blue-400/40 bg-blue-50/20"
          />

          {/* Outer radar ripple 2 (delayed) */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1.6],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2.6,
              delay: 1.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full border border-blue-300/30 bg-blue-50/10"
          />

          {/* Center Icon Container with floating sway */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-50 to-slate-100 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm"
          >
            <Search className="w-8 h-8 text-blue-600" />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs"
            >
              <FilterX className="w-3 h-3" />
            </motion.div>
          </motion.div>
        </div>

        {/* Text Content with subtle slide up */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="space-y-2"
        >
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            No products match your criteria
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {filterState.searchQuery ? (
              <>
                We couldn&apos;t find any phones or devices matching{' '}
                <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  &ldquo;{filterState.searchQuery}&rdquo;
                </span>
                . Try checking for typos or searching a broader term.
              </>
            ) : (
              'Try relaxing your price range, clearing brand or category filters, or toggling stock availability.'
            )}
          </p>
        </motion.div>

        {/* Action Buttons */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <motion.button
              id="clear-all-filters-btn"
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
