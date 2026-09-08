import React from 'react';
import { Star } from 'lucide-react';

export interface VisualStarRatingProps {
  /** Numerical rating value (e.g. 4.8 out of 5) */
  rating: number;
  /** Maximum number of stars (default: 5) */
  maxStars?: number;
  /** Size scale for the stars */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Whether to display the numerical score badge (e.g. 4.8) */
  showScore?: boolean;
  /** Whether to display review count */
  showReviewCount?: boolean;
  /** Number of customer reviews */
  reviewCount?: number;
  /** Optional interactive click handler (e.g. jump to reviews tab) */
  onClick?: () => void;
  /** Optional container CSS class */
  className?: string;
  /** Element ID */
  id?: string;
}

const SIZE_CONFIGS = {
  xs: {
    star: 'w-3 h-3',
    gap: 'gap-0.5',
    text: 'text-[11px]',
    badge: 'px-1.5 py-0.5 text-[10px]',
  },
  sm: {
    star: 'w-3.5 h-3.5',
    gap: 'gap-0.5',
    text: 'text-xs',
    badge: 'px-2 py-0.5 text-xs',
  },
  md: {
    star: 'w-4 h-4',
    gap: 'gap-1',
    text: 'text-sm',
    badge: 'px-2.5 py-1 text-xs',
  },
  lg: {
    star: 'w-5 h-5',
    gap: 'gap-1',
    text: 'text-base',
    badge: 'px-3 py-1 text-sm',
  },
};

export const VisualStarRating: React.FC<VisualStarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showScore = true,
  showReviewCount = false,
  reviewCount,
  onClick,
  className = '',
  id,
}) => {
  // Normalize and clamp rating value to [0, maxStars]
  const validRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, Math.min(maxStars, rating)) : 5;
  const formattedScore = validRating.toFixed(1);
  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.sm;

  const starsArray = Array.from({ length: maxStars }, (_, i) => i + 1);

  const content = (
    <div
      id={id}
      className={`inline-flex items-center gap-1.5 select-none ${className}`}
      aria-label={`Rating: ${formattedScore} out of ${maxStars} stars`}
    >
      {/* 5-Star Visual Display with fractional fill */}
      <div className={`flex items-center ${cfg.gap}`} title={`${formattedScore} / ${maxStars} stars`}>
        {starsArray.map((starIndex) => {
          let fillPercent = 0;
          if (validRating >= starIndex) {
            fillPercent = 100;
          } else if (validRating > starIndex - 1) {
            fillPercent = Math.round((validRating - (starIndex - 1)) * 100);
          }

          return (
            <div
              key={starIndex}
              className="relative inline-flex items-center justify-center shrink-0"
            >
              {/* Background empty star */}
              <Star
                className={`${cfg.star} text-amber-200/60 fill-amber-50`}
                strokeWidth={1.5}
              />
              {/* Foreground filled star with exact fractional clipping */}
              {fillPercent > 0 && (
                <div
                  className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star
                    className={`${cfg.star} text-amber-500 fill-amber-400 shrink-0`}
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Numeric Score */}
      {showScore && (
        <span className={`font-black text-slate-800 ${cfg.text} tracking-tight`}>
          {formattedScore}
        </span>
      )}

      {/* Reviews Count Label */}
      {showReviewCount && reviewCount !== undefined && (
        <span className="text-amber-700/90 font-medium text-xs">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        id={id ? `${id}-btn` : 'visual-star-rating-btn'}
        onClick={onClick}
        className="inline-flex items-center bg-amber-50/80 hover:bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200/90 font-bold transition-all duration-200 cursor-pointer hover:shadow-xs group"
        title="View customer reviews and rating breakdown"
      >
        {content}
      </button>
    );
  }

  return content;
};
