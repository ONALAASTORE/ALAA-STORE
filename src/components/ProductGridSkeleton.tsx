import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  mobileGridCols?: 1 | 2;
  theme?: 'light' | 'dark';
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  mobileGridCols = 2,
  theme = 'light',
  className = '',
}) => {
  const skeletonArray = Array.from({ length: count });

  return (
    <div
      role="status"
      aria-label="Loading products catalog..."
      aria-busy="true"
      className={`w-full ${className}`}
    >
      <div
        className={`grid ${
          mobileGridCols === 1 ? 'grid-cols-1' : 'grid-cols-2'
        } sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6`}
      >
        {skeletonArray.map((_, index) => (
          <ProductCardSkeleton
            key={`product-skeleton-${index}`}
            theme={theme}
          />
        ))}
      </div>
      <span className="sr-only">Loading products catalog, please wait...</span>
    </div>
  );
};
