import React from 'react';

interface ProductCardSkeletonProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      role="status"
      aria-label="Loading product details..."
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xs ${
        isDark
          ? 'bg-zinc-900/40 border-zinc-800/80'
          : 'bg-white border-zinc-200/80'
      } ${className}`}
    >
      {/* Product Image Stage Skeleton */}
      <div
        className={`relative aspect-square w-full p-4 flex flex-col justify-between overflow-hidden ${
          isDark ? 'bg-zinc-950/60' : 'bg-slate-50/90'
        }`}
      >
        {/* Top Badges Row */}
        <div className="flex items-center justify-between z-10 w-full">
          {/* Discount / Condition Tag placeholder */}
          <div
            className={`h-5 w-16 rounded-md animate-skeleton ${
              isDark ? 'bg-zinc-800' : 'bg-slate-200'
            }`}
          />
          {/* Quick Action Circular Icon Placeholders (Wishlist & Compare) */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
            <div
              className={`w-7 h-7 rounded-full animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
          </div>
        </div>

        {/* Center Product Image Placeholder Icon/Silhouette */}
        <div className="self-center my-auto flex flex-col items-center justify-center gap-2 opacity-60">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl animate-skeleton ${
              isDark ? 'bg-zinc-800/80' : 'bg-slate-200/70'
            }`}
          />
        </div>

        {/* Bottom Bar: Floating WhatsApp Pill & Media Count Placeholders */}
        <div className="flex items-center justify-between z-10 w-full pt-2">
          {/* Floating WhatsApp inquiry pill placeholder */}
          <div
            className={`h-6 w-24 rounded-full border animate-skeleton ${
              isDark
                ? 'bg-zinc-900 border-zinc-800'
                : 'bg-white border-emerald-200/60'
            }`}
          />

          {/* Media count pill placeholder */}
          <div
            className={`h-5 w-8 rounded-md animate-skeleton ${
              isDark ? 'bg-zinc-900' : 'bg-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Product Information Body Skeleton */}
      <div
        className={`p-3.5 flex-1 flex flex-col justify-between space-y-3 border-t ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-200/80 bg-white'
        }`}
      >
        <div className="space-y-2">
          {/* Brand & Category reference */}
          <div className="flex items-center justify-between">
            <div
              className={`h-3 w-16 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
            <div
              className={`h-3 w-12 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
          </div>

          {/* Product Title (2 lines) */}
          <div className="space-y-1.5 pt-0.5 min-h-[2.5rem]">
            <div
              className={`h-4 w-11/12 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
            <div
              className={`h-4 w-7/12 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
          </div>

          {/* Warranty / Specs Subtitle */}
          <div className="flex items-center gap-1.5 pt-1">
            <div
              className={`w-3.5 h-3.5 rounded-full animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
            <div
              className={`h-3 w-28 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
          </div>

          {/* Variant Selector mini pills */}
          <div className="flex items-center gap-1 pt-1.5">
            <div
              className={`h-5 w-12 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
            <div
              className={`h-5 w-14 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
            <div
              className={`h-5 w-10 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
          </div>
        </div>

        {/* Pricing & Add to Cart Action Skeleton */}
        <div
          className={`pt-2.5 border-t space-y-2.5 ${
            isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'
          }`}
        >
          {/* Price line */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <div
                className={`h-5 w-20 rounded animate-skeleton ${
                  isDark ? 'bg-zinc-700' : 'bg-slate-300'
                }`}
              />
              <div
                className={`h-3 w-12 rounded animate-skeleton ${
                  isDark ? 'bg-zinc-800' : 'bg-slate-200'
                }`}
              />
            </div>
            {/* L.L. equivalent price line */}
            <div
              className={`h-2.5 w-28 rounded animate-skeleton ${
                isDark ? 'bg-zinc-800' : 'bg-slate-200'
              }`}
            />
          </div>

          {/* Add to Cart CTA Button Placeholder */}
          <div
            className={`h-9 w-full rounded-xl animate-skeleton ${
              isDark ? 'bg-zinc-800' : 'bg-slate-200'
            }`}
          />
        </div>
      </div>
      <span className="sr-only">Loading product information...</span>
    </div>
  );
};
