import React from 'react';
import { X, Images, ShieldCheck, Truck, CreditCard } from 'lucide-react';

interface ProductDetailModalSkeletonProps {
  onClose?: () => void;
  className?: string;
}

export const ProductDetailModalSkeleton: React.FC<ProductDetailModalSkeletonProps> = ({
  onClose,
  className = '',
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-label="Loading product details..."
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 ${className}`}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 pb-safe animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Placeholder */}
        <button
          id="close-skeleton-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-8">
          {/* Left Column: Media Gallery Skeleton */}
          <div className="md:col-span-5 space-y-3">
            {/* Gallery Header Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Images className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                <div className="h-3.5 w-24 rounded animate-skeleton bg-slate-200" />
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <div className="w-6 h-6 rounded animate-skeleton bg-slate-200" />
                <div className="w-6 h-6 rounded animate-skeleton bg-slate-200" />
              </div>
            </div>

            {/* Main Stage Skeleton */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col items-center justify-center overflow-hidden">
              {/* Badges placeholder */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <div className="h-5 w-16 rounded-md animate-skeleton bg-slate-200" />
              </div>

              {/* Magnifier Controls Toolbar Placeholder */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <div className="h-6 w-16 rounded-full animate-skeleton bg-slate-200" />
                <div className="w-6 h-6 rounded-full animate-skeleton bg-slate-200" />
              </div>

              {/* Center Silhouette */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl animate-skeleton bg-slate-200/70" />

              {/* Bottom Lens indicator pill */}
              <div className="absolute bottom-3 left-3 z-10 h-6 w-36 rounded-full animate-skeleton bg-slate-200" />
            </div>

            {/* Thumbnail Slider Strip */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-xl border-2 border-slate-200 p-1 bg-slate-50 shrink-0 overflow-hidden"
                  >
                    <div className="w-full h-full rounded-lg animate-skeleton bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Guarantees Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 opacity-60 shrink-0" />
                <div className="h-3.5 w-44 rounded animate-skeleton bg-slate-200" />
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500 opacity-60 shrink-0" />
                <div className="h-3.5 w-52 rounded animate-skeleton bg-slate-200" />
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500 opacity-60 shrink-0" />
                <div className="h-3.5 w-48 rounded animate-skeleton bg-slate-200" />
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Controls Skeleton */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Category row + Share / Wishlist / Compare buttons */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 rounded animate-skeleton bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl animate-skeleton bg-slate-200" />
                  <div className="w-8 h-8 rounded-xl animate-skeleton bg-slate-200" />
                  <div className="w-8 h-8 rounded-xl animate-skeleton bg-slate-200" />
                </div>
              </div>

              {/* Title (2 lines) */}
              <div className="space-y-2">
                <div className="h-7 w-11/12 rounded-lg animate-skeleton bg-slate-300" />
                <div className="h-7 w-7/12 rounded-lg animate-skeleton bg-slate-300" />
              </div>

              {/* Reviews, Verified Pill & Status Row */}
              <div className="flex items-center gap-3 flex-wrap pt-0.5">
                {/* Visual Stars Placeholder */}
                <div className="h-5 w-28 rounded-md animate-skeleton bg-slate-200" />
                {/* Verified Buyer Reviews Pill */}
                <div className="h-6 w-36 rounded-lg animate-skeleton bg-blue-100" />
                {/* Condition Tag */}
                <div className="h-5 w-20 rounded-md animate-skeleton bg-emerald-100" />
                {/* Status */}
                <div className="h-4 w-36 rounded animate-skeleton bg-slate-200" />
              </div>

              {/* Price Block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded animate-skeleton bg-slate-200" />
                  <div className="h-8 w-36 rounded-lg animate-skeleton bg-slate-400" />
                  <div className="h-3 w-48 rounded animate-skeleton bg-slate-200" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="h-3.5 w-20 rounded animate-skeleton bg-slate-200 ml-auto" />
                  <div className="h-6 w-24 rounded-md animate-skeleton bg-emerald-100 ml-auto" />
                </div>
              </div>

              {/* Delivery Estimate Notice */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl animate-skeleton bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-40 rounded animate-skeleton bg-slate-300" />
                  <div className="h-3 w-64 rounded animate-skeleton bg-slate-200" />
                </div>
              </div>

              {/* Storage Capacity Selector Skeleton */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-28 rounded animate-skeleton bg-slate-200" />
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="h-9 w-20 rounded-xl animate-skeleton bg-slate-200" />
                  <div className="h-9 w-20 rounded-xl animate-skeleton bg-slate-200" />
                  <div className="h-9 w-20 rounded-xl animate-skeleton bg-slate-200" />
                </div>
              </div>

              {/* Color Selection Swatches Skeleton */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-24 rounded animate-skeleton bg-slate-200" />
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="h-8 w-24 rounded-xl animate-skeleton bg-slate-200" />
                  <div className="h-8 w-24 rounded-xl animate-skeleton bg-slate-200" />
                  <div className="h-8 w-24 rounded-xl animate-skeleton bg-slate-200" />
                </div>
              </div>

              {/* Action Buttons: Quantity + Add to Cart + WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="h-12 w-32 rounded-xl animate-skeleton bg-slate-200" />
                <div className="h-12 flex-1 rounded-xl animate-skeleton bg-blue-200" />
                <div className="h-12 flex-1 rounded-xl animate-skeleton bg-emerald-200" />
              </div>
            </div>

            {/* Bottom Tabs Skeleton */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
                <div className="h-4 w-20 rounded animate-skeleton bg-blue-200" />
                <div className="h-4 w-24 rounded animate-skeleton bg-slate-200" />
                <div className="h-4 w-32 rounded animate-skeleton bg-slate-200" />
                <div className="h-4 w-36 rounded animate-skeleton bg-slate-200" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3.5 w-full rounded animate-skeleton bg-slate-200" />
                <div className="h-3.5 w-11/12 rounded animate-skeleton bg-slate-200" />
                <div className="h-3.5 w-4/5 rounded animate-skeleton bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
