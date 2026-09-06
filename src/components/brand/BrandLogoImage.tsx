import React from 'react';

interface BrandLogoImageProps {
  className?: string;
  size?: number | string;
}

/**
 * Pixel-faithful vector rendering of the official ON ALAA STORE logo
 * Matching exact uploaded image typography, play button circle, red #FF0000 and black #000000 colors.
 */
export const BrandLogoImage: React.FC<BrandLogoImageProps> = ({
  className = '',
  size = '100%',
}) => {
  return (
    <svg 
      viewBox="0 0 600 600" 
      width={size} 
      height={size} 
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Disc / Canvas */}
      <rect width="600" height="600" fill="#FFFFFF" />

      {/* Main Group Centered */}
      <g transform="translate(300, 300)">
        {/* Top Line: ON ALAA (Y: -25) */}
        <g transform="translate(-215, -20)">
          {/* 'O' with Play Button */}
          <g transform="translate(42, 0)">
            {/* Outer Red Ring */}
            <circle cx="0" cy="0" r="40" fill="none" stroke="#FF0000" strokeWidth="16" />
            {/* Inner Red Play Triangle */}
            <path 
              d="M -9,-17 L 15,0 L -9,17 Z" 
              fill="#FF0000" 
              stroke="#FF0000" 
              strokeWidth="3" 
              strokeLinejoin="round" 
            />
          </g>

          {/* 'N' and 'ALAA' text in red rounded bold */}
          <text 
            x="96" 
            y="26" 
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Arial Rounded MT Bold', sans-serif" 
            fontWeight="900" 
            fontSize="94" 
            fill="#FF0000" 
            letterSpacing="1"
          >
            N ALAA
          </text>
        </g>

        {/* Bottom Line: 'STORE' in Black Uppercase (Y: 65) */}
        <g transform="translate(0, 68)">
          <text 
            x="0" 
            y="0" 
            textAnchor="middle" 
            fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" 
            fontWeight="900" 
            fontSize="46" 
            fill="#000000" 
            letterSpacing="16"
          >
            STORE
          </text>
        </g>
      </g>
    </svg>
  );
};
