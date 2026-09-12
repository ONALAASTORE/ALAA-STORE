import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterState, Currency } from '../types';
import { FilterPanelContent } from './FilterPanelContent';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  currency: Currency;
  itemCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  theme?: 'dark' | 'light';
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  setFilterState,
  currency,
  itemCount,
  onResetFilters,
  hasActiveFilters,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`w-screen max-w-md border-l flex flex-col justify-between overflow-hidden ${
                isDark 
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
                  : 'bg-white border-zinc-200 text-zinc-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'
              }`}>
                <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-tight">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>CATALOG FILTERS</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    [{itemCount} ITEMS]
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className={`w-8 h-8 rounded-md border flex items-center justify-center transition-micro cursor-pointer ${
                    isDark 
                      ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' 
                      : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950'
                  }`}
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-4 overflow-y-auto flex-1 overscroll-contain">
                <FilterPanelContent
                  filterState={filterState}
                  setFilterState={setFilterState}
                  currency={currency}
                  onResetFilters={onResetFilters}
                  hasActiveFilters={hasActiveFilters}
                  theme={theme}
                />
              </div>

              {/* Drawer Footer with Actions */}
              <div className={`p-4 border-t flex items-center gap-2 pb-safe ${
                isDark ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-zinc-50'
              }`}>
                {hasActiveFilters && (
                  <button
                    onClick={onResetFilters}
                    className={`flex-1 py-2.5 px-3 border text-xs font-mono rounded-md transition-micro cursor-pointer min-h-[44px] flex items-center justify-center ${
                      isDark 
                        ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800' 
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    RESET ALL
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`flex-1 py-2.5 px-3 border text-xs font-mono font-semibold rounded-md transition-micro cursor-pointer min-h-[44px] flex items-center justify-center ${
                    isDark 
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-100 hover:bg-white' 
                      : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  SHOW {itemCount} ITEMS
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
