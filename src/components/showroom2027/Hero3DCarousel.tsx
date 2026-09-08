import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  ShoppingCart, 
  Box, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { playHoverBlip, playClickBeep, playHologramActivation } from '../../utils/audio2027';

interface Hero3DCarouselProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpen3DViewer: (product: Product) => void;
}

export const Hero3DCarousel: React.FC<Hero3DCarouselProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  onOpen3DViewer,
}) => {
  // Take top featured flagship items
  const featured = products.filter(p => p.isFeatured).slice(0, 5);
  const carouselItems = featured.length >= 3 ? featured : products.slice(0, 5);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto rotation timer
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoRotate, carouselItems.length]);

  const activeProduct = carouselItems[activeIndex] || carouselItems[0];

  const handleNext = () => {
    playClickBeep();
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    playClickBeep();
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const selectSlide = (index: number) => {
    playClickBeep();
    setActiveIndex(index);
  };

  return (
    <div 
      className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center pt-8 pb-14 overflow-hidden"
      onMouseEnter={() => setIsAutoRotate(false)}
      onMouseLeave={() => setIsAutoRotate(true)}
      ref={carouselRef}
    >
      {/* Dynamic Ambient Space Glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-radial from-[#7B2FFF]/20 via-[#00F0FF]/10 to-transparent blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Narrative & Quantum Specs */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            {/* Hologram Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-2027 border border-[#00F0FF]/40 text-xs font-semibold text-[#00F0FF] tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>2027 IMMERSIVE DIGITAL SHOWROOM</span>
            </motion.div>

            {/* Title with Gradient Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                <div className="text-xs uppercase tracking-widest text-[#00F0FF] font-mono">
                  Quantum Flagship // {activeProduct.brand}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  <span className="text-gradient-2027">{activeProduct.name}</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base line-clamp-2 max-w-xl font-light">
                  {activeProduct.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Quick Specs Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="glass-2027 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono uppercase">
                  <Cpu className="w-3 h-3 text-[#00F0FF]" />
                  <span>Architecture</span>
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">
                  {activeProduct.specs?.Processor || 'Next-Gen SoC'}
                </div>
              </div>

              <div className="glass-2027 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono uppercase">
                  <ShieldCheck className="w-3 h-3 text-[#7B2FFF]" />
                  <span>Warranty</span>
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">
                  Official Lebanese
                </div>
              </div>

              <div className="glass-2027 p-2.5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#FFD700] font-mono uppercase">
                  <span>Price Matrix</span>
                </div>
                <div className="text-sm font-black text-gradient-gold mt-0.5">
                  {formatPrice(activeProduct.basePriceUSD, currency)}
                </div>
              </div>
            </div>

            {/* Interactive Holographic Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              {/* 360 3D Viewer Launch */}
              <button
                type="button"
                onClick={() => {
                  playHologramActivation();
                  onOpen3DViewer(activeProduct);
                }}
                onMouseEnter={playHoverBlip}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
              >
                <Box className="w-4 h-4" />
                <span>Enter 360° 3D Holo-Viewer</span>
              </button>

              {/* View Full Modal */}
              <button
                type="button"
                onClick={() => {
                  playClickBeep();
                  onSelectProduct(activeProduct);
                }}
                onMouseEnter={playHoverBlip}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl glass-2027 hover:border-[#00F0FF]/60 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#00F0FF]" />
                <span>Specs & Details</span>
              </button>

              {/* Quick Add */}
              <button
                type="button"
                onClick={() => {
                  playClickBeep();
                  onAddToCart(activeProduct);
                }}
                onMouseEnter={playHoverBlip}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/40 text-[#FFD700] font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Acquire</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Holographic Cylindrical Stage */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center">
            
            {/* 3D Perspective Stage */}
            <div className="relative w-full max-w-[540px] h-[380px] sm:h-[440px] flex items-center justify-center perspective-1500">
              
              {/* Holographic Glowing Pedestal Base */}
              <div className="absolute bottom-6 w-72 sm:w-88 h-24 pointer-events-none">
                {/* Concentric Neon Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-[#00F0FF]/40 animate-ping opacity-25 [animation-duration:4s]" />
                <div className="absolute inset-2 rounded-full border border-[#7B2FFF]/50 shadow-[0_0_30px_rgba(123,47,255,0.5)]" />
                <div className="absolute inset-6 rounded-full border border-[#00F0FF]/60 shadow-[0_0_20px_rgba(0,240,255,0.8)]" />
                <div className="absolute inset-10 rounded-full bg-radial from-[#00F0FF]/30 to-transparent blur-md" />

                {/* Laser Elevation Grid Lines */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-gradient-to-t from-[#00F0FF]/25 to-transparent blur-sm" />
              </div>

              {/* Floating Carousel Items in 3D Space */}
              <div className="relative w-full h-full flex items-center justify-center preserve-3d">
                {carouselItems.map((prod, idx) => {
                  // Calculate angular offset relative to activeIndex
                  const diff = (idx - activeIndex + carouselItems.length) % carouselItems.length;
                  const normalizedDiff = diff > carouselItems.length / 2 ? diff - carouselItems.length : diff;

                  // 3D positioning
                  const isActive = normalizedDiff === 0;
                  const isAdjacent = Math.abs(normalizedDiff) === 1;

                  // Compute transforms
                  const xOffset = normalizedDiff * 140; // horizontal spread
                  const zOffset = -Math.abs(normalizedDiff) * 160; // depth offset
                  const rotateY = -normalizedDiff * 25; // tilt towards center
                  const scale = isActive ? 1.05 : 0.78;
                  const opacity = isActive ? 1 : isAdjacent ? 0.6 : 0.25;

                  return (
                    <motion.div
                      key={prod.id}
                      onClick={() => selectSlide(idx)}
                      animate={{
                        x: xOffset,
                        z: zOffset,
                        rotateY: rotateY,
                        scale: scale,
                        opacity: opacity,
                      }}
                      transition={{
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`absolute w-56 sm:w-68 cursor-pointer preserve-3d select-none ${
                        isActive ? 'z-30' : isAdjacent ? 'z-20' : 'z-10'
                      }`}
                    >
                      {/* Floating Glassmorphism Hologram Card */}
                      <div className={`relative rounded-3xl p-5 transition-all duration-300 ${
                        isActive 
                          ? 'glass-2027 border-[#00F0FF]/60 shadow-[0_20px_50px_rgba(0,240,255,0.25)]' 
                          : 'glass-2027 opacity-80 hover:opacity-100 border-white/10'
                      }`}>
                        
                        {/* Holographic Scanline Overlay on Active */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                            <div className="w-full h-12 bg-gradient-to-b from-transparent via-[#00F0FF]/15 to-transparent animate-holo-scanline" />
                          </div>
                        )}

                        {/* Product Image Floating with Levitation Animation */}
                        <div className="relative w-full h-44 sm:h-52 flex items-center justify-center mb-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className={`max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 ${
                              isActive ? 'animate-float-levitate scale-105' : 'scale-95'
                            }`}
                            referrerPolicy="no-referrer"
                          />

                          {/* 360 indicator on active */}
                          {isActive && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 border border-[#00F0FF]/50 text-[10px] text-[#00F0FF] font-mono flex items-center gap-1">
                              <Box className="w-3 h-3 text-[#FFD700]" />
                              <span>360°</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Price */}
                        <div className="text-center">
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                            {prod.name}
                          </h3>
                          <div className="text-sm font-black text-gradient-gold mt-1">
                            {formatPrice(prod.basePriceUSD, currency)}
                          </div>
                        </div>

                        {/* Holographic Projection Pedestal beneath each */}
                        {isActive && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-full bg-[#00F0FF] blur-xs shadow-[0_0_12px_#00F0FF]" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls & Carousel Dots */}
            <div className="flex items-center gap-4 mt-2 z-20">
              <button
                type="button"
                onClick={handlePrev}
                onMouseEnter={playHoverBlip}
                className="w-10 h-10 rounded-full glass-2027 hover:border-[#00F0FF] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Previous flagship in 3D carousel"
              >
                <ChevronLeft className="w-5 h-5 text-[#00F0FF]" />
              </button>

              {/* Hologram Pagination Dots */}
              <div className="flex items-center gap-2">
                {carouselItems.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectSlide(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeIndex === i
                        ? 'w-8 h-2 bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] shadow-[0_0_10px_#00F0FF]'
                        : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                onMouseEnter={playHoverBlip}
                className="w-10 h-10 rounded-full glass-2027 hover:border-[#00F0FF] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Next flagship in 3D carousel"
              >
                <ChevronRight className="w-5 h-5 text-[#00F0FF]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
