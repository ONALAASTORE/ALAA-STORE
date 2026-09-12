import React from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Currency } from '../types';

interface PromoBannersGridProps {
  onSelectCategory?: (categoryId: string) => void;
  onNavigateToOffers?: () => void;
  theme?: 'dark' | 'light';
  currency?: Currency;
}

export const PromoBannersGrid: React.FC<PromoBannersGridProps> = ({
  onSelectCategory,
  onNavigateToOffers,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  const banners = [
    {
      id: 'promo-apple',
      eyebrow: 'OFFICIAL AGENCY SEALED',
      title: 'Apple Flagship Ecosystem',
      subtitle: 'iPhone 16 Pro Max, M3 Silicon & AirPods Pro 2',
      discountBadge: 'CASH ON DELIVERY',
      ctaText: 'Explore Apple',
      category: 'smartphones',
      bgGradient: isDark
        ? 'from-[#0A1628] via-[#0E1522] to-[#12141A]'
        : 'from-blue-50 via-sky-50 to-white',
      borderColor: isDark ? 'border-blue-900/40' : 'border-blue-200/80',
      tagColor: 'bg-[#0066FF] text-white',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'promo-gaming',
      eyebrow: 'NEXT-GEN HARDWARE',
      title: 'Pro Gaming & Consoles',
      subtitle: 'PlayStation 5 Pro, DualSense & Racing Wheels',
      discountBadge: 'UP TO 25% OFF',
      ctaText: 'Enter Gaming Zone',
      category: 'gaming',
      bgGradient: isDark
        ? 'from-[#140F28] via-[#12111E] to-[#12141A]'
        : 'from-indigo-50 via-purple-50 to-white',
      borderColor: isDark ? 'border-indigo-900/40' : 'border-indigo-200/80',
      tagColor: 'bg-[#0066FF] text-white',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'promo-audio',
      eyebrow: 'STUDIO SOUND & GAN POWER',
      title: 'ANC Audio & 140W Chargers',
      subtitle: 'Sony XM5, Marshall & Anker Prime GaN Power',
      discountBadge: 'FAST DISPATCH',
      ctaText: 'Discover Gear',
      category: 'audio',
      bgGradient: isDark
        ? 'from-[#0F1E28] via-[#101920] to-[#12141A]'
        : 'from-cyan-50 via-slate-50 to-white',
      borderColor: isDark ? 'border-cyan-900/40' : 'border-cyan-200/80',
      tagColor: 'bg-[#0066FF] text-white',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <section id="promo-banners-grid" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {banners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => {
              if (banner.category && onSelectCategory) {
                onSelectCategory(banner.category);
                const el = document.getElementById('catalog-feed-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else if (onNavigateToOffers) {
                onNavigateToOffers();
              }
            }}
            className={`group relative rounded-2xl border p-5 sm:p-6 overflow-hidden transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl bg-gradient-to-br ${banner.bgGradient} ${banner.borderColor} flex flex-col justify-between min-h-[210px]`}
          >
            {/* Top Eyebrow & Badge */}
            <div className="flex items-center justify-between gap-2 z-10">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0066FF]" />
                <span>{banner.eyebrow}</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.tagColor} shadow-xs`}>
                {banner.discountBadge}
              </span>
            </div>

            {/* Content & Imagery */}
            <div className="grid grid-cols-12 gap-3 items-center py-2 z-10">
              <div className="col-span-8 space-y-1">
                <h3 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'} group-hover:text-[#0066FF] transition-colors line-clamp-1`}>
                  {banner.title}
                </h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'} line-clamp-2 leading-relaxed`}>
                  {banner.subtitle}
                </p>
              </div>

              <div className="col-span-4 flex justify-end">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white/40 p-1 flex items-center justify-center shadow-xs">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-2 border-t border-zinc-200/40 dark:border-zinc-800/60 flex items-center justify-between text-xs font-bold text-[#0066FF] z-10">
              <span className="group-hover:underline flex items-center gap-1.5">
                <span>{banner.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'} flex items-center gap-1`}>
                <ShieldCheck className="w-3 h-3" />
                <span>LEBANON STOCK</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
