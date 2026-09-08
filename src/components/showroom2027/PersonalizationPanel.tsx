import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  ShoppingCart
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { playHoverBlip, playClickBeep, playCartChime } from '../../utils/audio2027';

interface PersonalizationPanelProps {
  products: Product[];
  currency: Currency;
  recentlyViewed: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({
  products,
  currency,
  recentlyViewed,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activePersona, setActivePersona] = useState<'flagship' | 'creative' | 'gaming' | 'value'>('flagship');

  const personaConfigs = {
    flagship: {
      label: 'Executive Flagship',
      tagline: 'Titanium grade materials & fastest silicon',
      filter: (p: Product) => p.isFeatured || p.name.includes('Pro Max') || p.name.includes('Ultra'),
    },
    creative: {
      label: 'Studio Creator',
      tagline: 'ProRes 4K video, XDR displays & color accuracy',
      filter: (p: Product) => p.category === 'laptops' || p.specs?.Display?.includes('OLED') || p.name.includes('Pro'),
    },
    gaming: {
      label: 'High-FPS Gaming',
      tagline: '120Hz+ refresh rates & extreme thermal headroom',
      filter: (p: Product) => p.category === 'gaming' || p.specs?.Display?.includes('120Hz') || p.name.includes('PlayStation'),
    },
    value: {
      label: 'Quantum Value',
      tagline: 'Maximum benchmark performance per dollar',
      filter: (p: Product) => p.basePriceUSD < 900,
    },
  };

  const curatedProducts = products
    .filter(personaConfigs[activePersona].filter)
    .slice(0, 4);

  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Neural Personalization Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              <span className="text-gradient-2027">AI Tailored For Your Digital Lifestyle</span>
            </h2>
          </div>

          {/* Persona Tuning Switchers */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-2027 border border-white/15 overflow-x-auto no-scrollbar">
            {(Object.keys(personaConfigs) as Array<keyof typeof personaConfigs>).map((key) => {
              const isActive = activePersona === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    playClickBeep();
                    setActivePersona(key);
                  }}
                  onMouseEnter={playHoverBlip}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {personaConfigs[key].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl glass-2027 border border-white/10 hover:border-[#00F0FF]/50 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
            >
              {/* Product Image */}
              <div 
                className="relative h-44 flex items-center justify-center cursor-pointer mb-3"
                onClick={() => onSelectProduct(product)}
              >
                <div className="w-28 h-8 rounded-full bg-[#00F0FF]/20 blur-md absolute -bottom-1 group-hover:scale-125 transition-transform" />
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-[80%] object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-[#00F0FF] uppercase">
                  {product.brand} // {product.category}
                </div>
                <h4 
                  onClick={() => onSelectProduct(product)}
                  className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate cursor-pointer"
                >
                  {product.name}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-black text-gradient-gold">
                    {formatPrice(product.basePriceUSD, currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playCartChime();
                      onAddToCart(product);
                    }}
                    className="p-2 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-slate-950 border border-[#00F0FF]/40 transition cursor-pointer"
                    title="Add to Smart Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recently Projected Holograms Slider */}
        {recentlyViewed.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase">
              <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Recently Projected Holograms</span>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              {recentlyViewed.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-2027 border border-white/10 hover:border-[#00F0FF]/50 shrink-0 cursor-pointer group"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block truncate max-w-36">
                      {prod.name}
                    </span>
                    <span className="text-[11px] font-black text-gradient-gold">
                      {formatPrice(prod.basePriceUSD, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
