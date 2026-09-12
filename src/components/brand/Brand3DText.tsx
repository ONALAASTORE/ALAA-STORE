import React from 'react';

interface Brand3DTextProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  isDarkTheme?: boolean;
  withTagline?: boolean;
  withLebanonBadge?: boolean;
  className?: string;
  withPerspectivePlate?: boolean;
  withPlayIconO?: boolean;
}

export const Brand3DText: React.FC<Brand3DTextProps> = ({
  size = 'md',
  isDarkTheme = true,
  withTagline = false,
  withLebanonBadge = false,
  className = '',
  withPerspectivePlate = false,
  withPlayIconO = false,
}) => {
  // Sizing definitions
  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-2xl sm:text-3xl',
    hero: 'text-3xl sm:text-4xl lg:text-5xl',
  };

  const playIconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
    hero: 'w-8 h-8',
  };

  const content = (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`font-black tracking-tighter font-display ${textSizes[size]} flex items-center gap-1.5`}>
          {/* ON ALAA in Stark Monochrome with optional technical play mark */}
          <div className="flex items-center gap-1">
            {withPlayIconO && (
              <span className={`inline-flex items-center justify-center rounded-full bg-zinc-100 text-zinc-950 ${playIconSizes[size]} shrink-0`}>
                <span className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-zinc-950 ml-0.5" />
              </span>
            )}
            <span className={`transition-colors ${isDarkTheme ? 'text-zinc-100' : 'text-zinc-900'}`}>
              {withPlayIconO ? 'N ALAA' : 'ON ALAA'}
            </span>
          </div>
          
          {/* STORE in Technical Muted Zinc */}
          <span className={`font-mono text-[0.8em] font-normal tracking-widest uppercase px-1.5 py-0.5 rounded border ${
            isDarkTheme 
              ? 'text-zinc-400 border-zinc-800 bg-zinc-900/50' 
              : 'text-zinc-600 border-zinc-200 bg-zinc-100'
          }`}>
            STORE
          </span>
        </div>

        {withLebanonBadge && (
          <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-tight uppercase border ${
            isDarkTheme
              ? 'bg-zinc-900 text-zinc-400 border-zinc-800'
              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}>
            LEBANON // LB
          </span>
        )}
      </div>

      {withTagline && (
        <p className={`text-[11px] font-mono tracking-tight mt-0.5 ${isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>
          FLAGSHIP DEVICES & HARDWARE // LEBANON
        </p>
      )}
    </div>
  );

  if (withPerspectivePlate) {
    return (
      <div className="inline-block">
        {content}
      </div>
    );
  }

  return content;
};


