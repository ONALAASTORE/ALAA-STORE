import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  ArrowRight, 
  Play, 
  MessageCircle, 
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Smartphone,
  Headphones
} from 'lucide-react';
import { getProductImages } from '../utils/productImages';
import { Currency, Product } from '../types';
import { formatPrice } from '../utils/currency';
import { getEmbedVideoUrl } from '../utils/video';
import { buildWhatsAppLink } from '../utils/phone';

interface HeroBannerProps {
  featuredProducts: Product[];
  currency: Currency;
  onSelectProduct: (p: Product) => void;
  onSelectCategory?: (catId: string) => void;
  marketingVideoUrl?: string;
  marketingVideoTitle?: string;
  isMarketingVideoActive?: boolean;
  whatsappNumber?: string;
  theme?: 'dark' | 'light';
  onNavigateToOffers?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredProducts,
  currency,
  onSelectProduct,
  onSelectCategory,
  marketingVideoUrl,
  marketingVideoTitle,
  isMarketingVideoActive = true,
  whatsappNumber = '+961 71 135 241',
  onNavigateToOffers,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const heroProduct = featuredProducts[0];
  const secondProduct = featuredProducts[1] || featuredProducts[0];
  const thirdProduct = featuredProducts[2] || featuredProducts[0];

  const isVideoVisible = Boolean(isMarketingVideoActive && marketingVideoUrl && marketingVideoUrl.trim().length > 0);
  const embedUrl = isVideoVisible && marketingVideoUrl ? getEmbedVideoUrl(marketingVideoUrl) : '';

  const slides = [
    {
      id: 'slide-flash-sale',
      tag: 'TECH MEGA SALE // SERIES 2026',
      tagIcon: Flame,
      title: 'Mega Tech Deals & Flagships in Lebanon',
      titleHighlight: 'Up to 40% OFF',
      description: 'Official Agency Sealed smartphones, Apple Silicon MacBooks, high-performance GaN chargers, and wireless ANC audio with door-to-door delivery across all Lebanon.',
      primaryBtnText: 'Shop Flash Deals',
      primaryAction: () => {
        if (onNavigateToOffers) onNavigateToOffers();
        else if (heroProduct) onSelectProduct(heroProduct);
      },
      secondaryBtnText: 'WhatsApp Order',
      secondaryHref: buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store, I am inquiring about the Mega Tech Deals advertised on the homepage.'),
      badgeText: '100% Agency Sealed',
      bgGradient: 'from-blue-950/70 via-[#101015] to-[#0A0A0C]',
      featuredProduct: heroProduct,
      accentColor: 'text-blue-400',
    },
    {
      id: 'slide-flagship-phones',
      tag: 'NEW ARRIVALS // SMARTPHONES & TABLETS',
      tagIcon: Smartphone,
      title: 'Flagship Smartphones, iPhones & Galaxy Ultra',
      titleHighlight: 'Cash on Delivery',
      description: 'Dual SIM & eSIM unlocked devices with Lebanon agency warranty. Pay comfortably in USD or Lebanese Pounds at daily market rate.',
      primaryBtnText: 'Explore Smartphones',
      primaryAction: () => {
        if (onSelectCategory) onSelectCategory('smartphones');
      },
      secondaryBtnText: 'Instant WA Quote',
      secondaryHref: buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store, I would like to check current iPhone and Samsung smartphone pricing in Lebanon.'),
      badgeText: 'Official Agency Stock',
      bgGradient: 'from-[#0C1528] via-[#101118] to-[#090A0E]',
      featuredProduct: secondProduct,
      accentColor: 'text-cyan-400',
    },
    {
      id: 'slide-audio-gaming',
      tag: 'PRO AUDIO & NEXT-GEN GAMING GEAR',
      tagIcon: Headphones,
      title: 'Studio Noise Cancelling & High-Power Gaming',
      titleHighlight: 'Sound & Speed',
      description: 'Experience Sony ANC headphones, Marshall speakers, PS5 Pro consoles, and ultra-durable fast GaN powerbanks with instant Lebanon dispatch.',
      primaryBtnText: 'View Audio & Gaming',
      primaryAction: () => {
        if (onSelectCategory) onSelectCategory('audio');
      },
      secondaryBtnText: 'Direct Inquiry',
      secondaryHref: buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store, I am inquiring about audio gear and gaming consoles.'),
      badgeText: 'Express 24h Delivery',
      bgGradient: 'from-[#121020] via-[#101018] to-[#090A0D]',
      featuredProduct: thirdProduct,
      accentColor: 'text-blue-400',
    },
  ];

  // Auto-advance slides every 6.5 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const activeSlide = slides[currentSlide];
  const TagIcon = activeSlide.tagIcon;

  return (
    <section 
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Slide Container */}
      <div 
        id="hero-banner-main"
        className={`relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-r ${activeSlide.bgGradient} text-white shadow-2xl transition-all duration-500`}
      >
        {/* Subtle electric blue top border glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
          
          {/* Left Column: Headline, Highlights & Direct Action */}
          <div className="lg:col-span-7 space-y-5 text-left z-10">
            
            {/* Tag / Eyebrow */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono tracking-tight uppercase bg-blue-600/20 border border-blue-500/40 text-blue-300">
                <TagIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>{activeSlide.tag}</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-tight bg-[#16161C] border border-zinc-700 text-zinc-300">
                🇱🇧 LEBANON WIDE DELIVERY
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-fluid-hero font-black tracking-tight text-white leading-tight">
              {activeSlide.title.split(' ')[0]} {activeSlide.title.split(' ')[1]}{' '}
              <br className="hidden sm:inline" />
              <span className="text-blue-500 font-extrabold">
                {activeSlide.titleHighlight}
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-fluid-body max-w-xl leading-relaxed text-sm sm:text-base text-zinc-300 font-normal">
              {activeSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={activeSlide.primaryAction}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/40 flex items-center gap-2 cursor-pointer"
              >
                <span>{activeSlide.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={activeSlide.secondaryHref}
                target="_blank"
                rel="noreferrer"
                className="bg-[#18181E] hover:bg-[#202028] text-white border border-zinc-700 hover:border-emerald-500 text-xs sm:text-sm font-semibold uppercase tracking-wider px-5 py-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{activeSlide.secondaryBtnText}</span>
              </a>

              {isVideoVisible && (
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="p-3.5 rounded-xl border border-zinc-700 bg-[#16161C] hover:bg-[#22222A] text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Watch Store Tech Showcase Video"
                >
                  <Play className="w-4 h-4 text-blue-400" />
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>100% Genuine Sealed</span>
              </span>
              <span className="text-zinc-600">//</span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>COD in USD or L.L.</span>
              </span>
            </div>
          </div>

          {/* Right Column: Featured Electronics Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            {activeSlide.featuredProduct && (
              <div 
                onClick={() => onSelectProduct(activeSlide.featuredProduct!)}
                className="group relative bg-[#16161A]/90 backdrop-blur-md border border-zinc-700/80 hover:border-blue-500 rounded-2xl p-4 sm:p-5 w-full max-w-sm transition-all duration-300 shadow-2xl hover:shadow-blue-600/20 cursor-pointer"
              >
                {/* Floating Tag */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Featured Deal
                  </span>
                </div>

                {/* Product Image */}
                <div className="w-full h-56 sm:h-64 rounded-xl bg-[#0F0F14] p-4 flex items-center justify-center overflow-hidden mb-3">
                  <img
                    src={getProductImages(activeSlide.featuredProduct)[0] || activeSlide.featuredProduct.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'}
                    alt={activeSlide.featuredProduct.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                  />
                </div>

                {/* Info & Price */}
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {activeSlide.featuredProduct.brand} • {activeSlide.featuredProduct.warranty || 'Official Warranty'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {activeSlide.featuredProduct.name}
                  </h3>
                  <div className="flex items-baseline justify-between pt-1 font-mono">
                    <span className="text-base sm:text-lg font-extrabold text-blue-400">
                      {formatPrice(activeSlide.featuredProduct.promotionalPriceUSD || activeSlide.featuredProduct.basePriceUSD, currency)}
                    </span>
                    <span className="text-[11px] text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1 font-sans">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Carousel Slide Indicators & Controls */}
        <div className="absolute bottom-3 left-0 right-0 px-4 sm:px-8 flex items-center justify-between pointer-events-none">
          {/* Slide Dots */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === index
                    ? 'w-8 bg-blue-500'
                    : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-8 h-8 rounded-lg bg-[#14141A]/80 hover:bg-blue-600 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-8 h-8 rounded-lg bg-[#14141A]/80 hover:bg-blue-600 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal if active */}
      {isVideoModalOpen && embedUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="bg-[#16161A] border border-zinc-800 rounded-2xl max-w-3xl w-full p-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white">
                {marketingVideoTitle || 'ON ALAA STORE Tech Showcase'}
              </h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src={embedUrl}
                title="Store Showcase"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
