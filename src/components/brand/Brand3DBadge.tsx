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
        className={`signage-3d-container inline-block ${className}`}
        style={{ perspective: '1000px' }}
      >
        <div className="signage-3d-plate bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-700/80 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group">
          {/* Large 3D Avatar Profile Style with Metallic Border & Red Glow */}
          <div className="relative">
            <LogoAvatar size="xl" withGlow={true} />
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-xs font-black border-2 border-white/60 shadow-lg">
              ▶
            </div>
          </div>

          {/* 3D Typography + Badges */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]/40 uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>Official Channel</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>Chouf, Lebanon</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <Award className="w-3 h-3 text-emerald-400" />
                <span>100% Agency Sealed</span>
              </span>
            </div>

            <Brand3DText size="xl" isDarkTheme={true} withPlayIconO={false} />
            
            <p className="text-xs text-slate-400 font-medium max-w-lg leading-relaxed">
              Watch official hands-on reveals, unboxings, and device speed tests directly from our Jadra Warehouse Store.
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
        className={`signage-3d-container inline-flex ${className}`}
        style={{ perspective: '1000px' }}
      >
        <div className="signage-3d-plate bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md flex items-center gap-3.5 transition-all">
          <LogoAvatar size="lg" withGlow={true} />
          <div>
            <Brand3DText size="md" isDarkTheme={true} withLebanonBadge={true} />
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
              <span className="text-emerald-400 font-bold">Jadra Warehouse Store</span>
              <span>•</span>
              <span className="text-amber-300">All-Lebanon Delivery 🚚</span>
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
      className={`signage-3d-container inline-flex ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div className="signage-3d-plate bg-white/10 hover:bg-white/15 border border-white/20 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-md flex items-center gap-3.5 transition-all">
        <LogoAvatar size="md" withGlow={true} />
        <div>
          <Brand3DText size="sm" isDarkTheme={true} withLebanonBadge={true} />
          <div className="flex items-center gap-2 text-[10px] text-slate-300 font-semibold mt-0.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              100% Agency Sealed
            </span>
            <span>•</span>
            <span className="text-amber-300">Fast Lebanon Delivery 🚚</span>
          </div>
        </div>
      </div>
    </div>
  );
};

