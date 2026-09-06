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
  isDarkTheme = false,
  withTagline = false,
  withLebanonBadge = false,
  className = '',
  withPerspectivePlate = false,
  withPlayIconO = false,
}) => {
  // Sizing definitions
  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    hero: 'text-4xl sm:text-5xl lg:text-6xl',
  };

  const playIconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7 sm:w-8 sm:h-8',
    xl: 'w-9 h-9 sm:w-10 sm:h-10',
    hero: 'w-11 h-11 sm:w-14 sm:h-14',
  };

  const content = (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`font-black tracking-tight font-display ${textSizes[size]} flex items-center gap-1.5`}>
          {/* ON ALAA in Vibrant Red 3D Extrusion */}
          <div className="flex items-center gap-1">
            {withPlayIconO && (
              <span className={`inline-flex items-center justify-center rounded-full bg-[#FF0000] ${playIconSizes[size]} shadow-md shadow-red-600/40 border border-white/40 shrink-0 transform -translate-y-0.5`}>
                <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
              </span>
            )}
            <span className={size === 'hero' || size === 'xl' ? 'text-3d-red-hero' : 'text-3d-red'}>
              {withPlayIconO ? 'N ALAA' : 'ON ALAA'}
            </span>
          </div>
          
          {/* STORE in Solid Metallic Black or Metallic White */}
          <span className={isDarkTheme ? 'text-3d-white tracking-wider' : 'text-3d-dark tracking-wider'}>
            STORE
          </span>
        </div>

        {withLebanonBadge && (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-red-50 text-[#FF0000] border border-red-200/80 shadow-xs uppercase tracking-wider">
            Lebanon 🇱🇧
          </span>
        )}
      </div>

      {withTagline && (
        <p className={`text-[11px] font-semibold tracking-wide mt-0.5 ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
          Authorized Tech & Mobile Flagships • All Lebanon Delivery 🚚
        </p>
      )}
    </div>
  );

  if (withPerspectivePlate) {
    return (
      <div className="signage-3d-container" style={{ perspective: '1000px' }}>
        <div className="signage-3d-plate p-1">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

