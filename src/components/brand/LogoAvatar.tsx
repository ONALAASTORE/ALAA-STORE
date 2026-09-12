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
  withGlow = false,
}) => {
  return (
    <div
      onClick={onClick}
      title={alt}
      aria-label={alt}
      role="img"
      className={`relative rounded-full select-none shrink-0 ${SIZE_MAP[size]} ${
        showHoverEffect ? 'hover:opacity-90 active:scale-95 transition-micro cursor-pointer' : ''
      } ${className}`}
    >
      {/* 1px Ultra-thin technical border ring */}
      <div className={`w-full h-full rounded-full p-[1.5px] bg-zinc-800 border border-zinc-700/80 shadow-xs relative overflow-hidden flex items-center justify-center ${
        withGlow ? 'ring-1 ring-zinc-500/40' : ''
      }`}>
        {/* Inner Clean White Disc */}
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden p-0.5">
          <div className="w-full h-full flex items-center justify-center scale-95 transition-transform duration-200">
            <BrandLogoImage className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};


