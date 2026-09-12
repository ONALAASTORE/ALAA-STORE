import React from 'react';
import { LogoAvatar } from './LogoAvatar';
import { Brand3DText } from './Brand3DText';
import { Sparkles, ShieldCheck, MapPin, Award } from 'lucide-react';

interface Brand3DBadgeProps {
  variant?: 'hero' | 'video-showcase' | 'compact' | 'footer';
  className?: string;
  onClick?: () => void;
}

export const Brand3DBadge: React.FC<Brand3DBadgeProps> = ({
  variant = 'hero',
  className = '',
  onClick,
}) => {
  if (variant === 'video-showcase') {
    return (
      <div 
        onClick={onClick}
        className={`inline-block w-full ${className}`}
      >
        <div className="bg-zinc-900/80 border border-zinc-800/90 p-4 sm:p-5 rounded-xl backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 transition-all">
          <div className="relative">
            <LogoAvatar size="lg" withGlow={false} />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center text-[10px] font-mono border border-zinc-950">
              ▶
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-300 uppercase tracking-tight">
                <Sparkles className="w-2.5 h-2.5 text-zinc-400" />
                <span>OFFICIAL ARCHIVE</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400">
                <MapPin className="w-2.5 h-2.5" />
                <span>CHOUF, LB</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400">
                <Award className="w-2.5 h-2.5" />
                <span>AGENCY SEALED</span>
              </span>
            </div>

            <Brand3DText size="lg" isDarkTheme={true} withPlayIconO={false} />
            
            <p className="text-xs text-zinc-400 font-normal max-w-lg leading-relaxed">
              Official video reveal, unboxing, and benchmark recordings from our Jadra Warehouse hub.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex ${className}`}
      >
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-lg backdrop-blur-md flex items-center gap-3 transition-all">
          <LogoAvatar size="md" withGlow={false} />
          <div>
            <Brand3DText size="sm" isDarkTheme={true} withLebanonBadge={true} />
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-0.5">
              <span className="text-zinc-300">JADRA WAREHOUSE</span>
              <span>//</span>
              <span>ALL LEBANON DISPATCH</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hero Signage Variant
  return (
    <div 
      onClick={onClick}
      className={`inline-flex ${className}`}
    >
      <div className="bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800/80 p-2.5 sm:p-3 rounded-lg backdrop-blur-md flex items-center gap-3 transition-all">
        <LogoAvatar size="sm" withGlow={false} />
        <div>
          <Brand3DText size="sm" isDarkTheme={true} withLebanonBadge={false} />
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-0.5">
            <span className="flex items-center gap-1 text-zinc-300">
              <ShieldCheck className="w-3 h-3 text-zinc-400" />
              100% SEALED
            </span>
            <span>//</span>
            <span>LEBANON DISPATCH</span>
          </div>
        </div>
      </div>
    </div>
  );
};


