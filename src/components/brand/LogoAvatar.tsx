import React from 'react';
import { BrandLogoImage } from './BrandLogoImage';

interface LogoAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showHoverEffect?: boolean;
  onClick?: () => void;
  alt?: string;
  withGlow?: boolean;
}

const SIZE_MAP = {
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const LogoAvatar: React.FC<LogoAvatarProps> = ({
  size = 'md',
  className = '',
  showHoverEffect = true,
  onClick,
  alt = 'ON ALAA STORE Official Logo Avatar',
  withGlow = true,
}) => {
  return (
    <div
      onClick={onClick}
      title={alt}
      aria-label={alt}
      role="img"
      className={`relative rounded-full select-none shrink-0 ${SIZE_MAP[size]} ${
        showHoverEffect ? 'logo-avatar-interactive cursor-pointer' : ''
      } ${className}`}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer 3D Ambient Red Glow Halo */}
      {withGlow && (
        <div 
          className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#FF0000]/35 via-[#FF0000]/15 to-transparent blur-md -z-10 pointer-events-none animate-pulse opacity-90" 
        />
      )}

      {/* 3D Elevated Medallion Container with metallic/glass ring border & shadow */}
      <div
        className={`w-full h-full rounded-full p-[2px] bg-gradient-to-b from-white/90 via-slate-200/90 to-slate-400/90 border border-white/40 shadow-xl ${
          size === 'xl' || size === '2xl' ? 'logo-avatar-3d-shadow-lg' : 'logo-avatar-3d-shadow'
        } relative overflow-hidden flex items-center justify-center`}
      >
        {/* Inner White Ceramic/Glass Disc */}
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden p-0.5 shadow-inner">
          
          {/* Top Gloss Arc Reflection (Physical 3D Glass Highlight) */}
          <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/90 via-white/20 to-transparent rounded-t-full pointer-events-none z-10" />
          
          {/* Render Primary Logo Asset: Exact Vector matching uploaded picture */}
          <div className="w-full h-full flex items-center justify-center scale-95 transition-transform duration-300">
            <BrandLogoImage className="w-full h-full object-contain" />
          </div>

          {/* Bottom subtle edge shadow inside disc */}
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-slate-300/30 to-transparent rounded-b-full pointer-events-none" />
        </div>
      </div>
    </div>
  );
};


