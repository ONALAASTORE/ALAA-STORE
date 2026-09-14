import React, { useState, useRef } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface InfoTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  icon?: 'help' | 'info';
  theme?: 'dark' | 'light';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  children,
  title,
  position = 'top',
  className = '',
  icon = 'help',
  theme = 'dark',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onClick={() => setIsVisible((prev) => !prev)}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          className={`p-0.5 rounded-full transition-colors cursor-help inline-flex items-center justify-center ${
            isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-800'
          }`}
          aria-label={title || 'More information'}
        >
          {icon === 'help' ? (
            <HelpCircle className="w-3.5 h-3.5" />
          ) : (
            <Info className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none w-64 max-w-xs px-3 py-2 text-xs rounded-xl shadow-xl border backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${positionClasses} ${
            isDark
              ? 'bg-zinc-900/95 border-zinc-700 text-zinc-200 shadow-black/60'
              : 'bg-white/95 border-zinc-200 text-zinc-800 shadow-slate-300/60'
          }`}
        >
          {title && (
            <div className={`font-bold pb-1 mb-1 border-b text-[11px] uppercase tracking-wider ${
              isDark ? 'border-zinc-800 text-zinc-300' : 'border-zinc-100 text-zinc-700'
            }`}>
              {title}
            </div>
          )}
          <div className="text-[11px] leading-relaxed font-sans">{content}</div>
        </div>
      )}
    </div>
  );
};
