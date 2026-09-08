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
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 backdrop-blur-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filter Products</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({itemCount} available)
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-5 overflow-y-auto flex-1 overscroll-contain">
                <FilterPanelContent
                  filterState={filterState}
                  setFilterState={setFilterState}
                  currency={currency}
                  onResetFilters={onResetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              {/* Drawer Footer with Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3 pb-safe">
                {hasActiveFilters && (
                  <button
                    onClick={onResetFilters}
                    className="flex-1 py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer min-h-[48px] flex items-center justify-center"
                  >
                    Reset All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer min-h-[48px] flex items-center justify-center"
                >
                  Show {itemCount} Items
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
