import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  Flame, 
  MessageCircle, 
  CheckCircle2,
  Play,
  Video,
  X
} from 'lucide-react';
import { Currency, Product } from '../types';
import { formatPrice } from '../utils/currency';
import { getEmbedVideoUrl, isDirectVideoFile } from '../utils/video';
import { Brand3DBadge } from './brand';

interface HeroBannerProps {
  featuredProducts: Product[];
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onSelectCategory?: (catId: string) => void;
  marketingVideoUrl?: string;
  marketingVideoTitle?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredProducts,
  currency,
  onSelectProduct,
  marketingVideoUrl,
  marketingVideoTitle,
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const heroProduct = featuredProducts[0]; // iPhone 16 Pro Max
  const embedUrl = marketingVideoUrl ? getEmbedVideoUrl(marketingVideoUrl) : '';

  return (
    <div className="space-y-6">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
              <Brand3DBadge variant="hero" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] font-display">
              Latest Flagships & Tech <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                At The Best Prices in Lebanon
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Shop authentic smartphones, MacBooks, gaming consoles, audio gear & GaN chargers. Guaranteed official agency warranties with cash on delivery across Lebanon.
            </p>

            {/* Quick Benefits Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-semibold text-slate-300 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Sealed & Original</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 p-2.5 rounded-xl">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Fast All-Lebanon Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-xs border border-slate-700/60 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>USD or L.L. Cash / Whish</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              {heroProduct && (
                <button
                  id="hero-buy-featured-btn"
                  onClick={() => onSelectProduct(heroProduct)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore {heroProduct.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {marketingVideoUrl && (
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-sm px-4 py-3 rounded-xl transition flex items-center gap-2 border border-slate-700 shadow-md cursor-pointer group"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FF0000] text-white flex items-center justify-center group-hover:scale-110 transition shadow-md shadow-red-600/40">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </span>
                  <span>Watch Video Showcase</span>
                </button>
              )}

              <a
                href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store%2C%20I%20want%20to%20order%20or%20ask%20about%20a%20device"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Hero Product Card Showcase */}
          {heroProduct && (
            <div className="lg:col-span-5">
              <div 
                onClick={() => onSelectProduct(heroProduct)}
                className="relative bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 hover:border-blue-500/60 transition cursor-pointer group shadow-2xl backdrop-blur-md"
              >
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-end">
                  <span className="bg-rose-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Flame className="w-3 h-3 fill-white" />
                    Hot Release
                  </span>
                  <span className="bg-slate-900/90 border border-slate-700 text-amber-300 font-bold text-[11px] px-2 py-0.5 rounded-md">
                    Agency Warranty
                  </span>
                </div>

                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900/80 flex items-center justify-center p-4">
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {heroProduct.brand} • {heroProduct.category}
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition">
                    {heroProduct.name}
                  </h3>
                  
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-700/60">
                    <div>
                      <div className="text-2xl font-black text-white font-display">
                        {formatPrice(heroProduct.basePriceUSD, currency)}
                      </div>
                      {currency === 'USD' && (
                        <div className="text-xs text-slate-400 font-medium">
                          ≈ {formatPrice(heroProduct.basePriceUSD, 'LBP')}
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View Specs & Options →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Marketing Video Interactive Section if active */}
      {marketingVideoUrl && (
        <div className="space-y-4">
          {/* 3D Brand Badge Banner above Video Showcase */}
          <div className="flex justify-center sm:justify-start">
            <Brand3DBadge variant="video-showcase" />
          </div>

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center gap-5 justify-between mb-4">
              <div className="space-y-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0000]/15 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold uppercase tracking-wider">
                  <Video className="w-3.5 h-3.5" />
                  <span>Featured Tech & Flagship Showcase</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  {marketingVideoTitle || 'Featured Video Tour'}
                </h3>
              </div>
              
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700 shadow-md cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white text-[#FF0000]" />
                <span>Open in Fullscreen Theater</span>
              </button>
            </div>

            <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
              {isDirectVideoFile(marketingVideoUrl) ? (
                <video 
                  src={marketingVideoUrl} 
                  controls 
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={embedUrl}
                  title={marketingVideoTitle || 'Featured Video'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {isVideoModalOpen && marketingVideoUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-[#FF0000]" />
                <span>{marketingVideoTitle || 'Video Showcase'}</span>
              </h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
              {isDirectVideoFile(marketingVideoUrl) ? (
                <video 
                  src={marketingVideoUrl} 
                  autoPlay 
                  controls 
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                  title={marketingVideoTitle || 'Video Showcase'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4 Feature Value Props */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">All-Lebanon Delivery</h4>
            <p className="text-xs text-slate-500">Fast delivery across all cities & governorates</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">100% Agency Warranty</h4>
            <p className="text-xs text-slate-500">Official distributor warranty support</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Cash on Delivery</h4>
            <p className="text-xs text-slate-500">Pay in USD, LBP, or Whish upon receipt</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Instant WhatsApp Order</h4>
            <p className="text-xs text-slate-500">Quick 1-click booking with our team</p>
          </div>
        </div>
      </div>
    </div>
  );
};
