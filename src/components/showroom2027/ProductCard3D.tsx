import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, 
  ShoppingCart, 
  Heart, 
  RotateCw, 
  Cpu, 
  Check, 
  Maximize2
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { playHoverBlip, playClickBeep, playCartChime } from '../../utils/audio2027';

interface ProductCard3DProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpen3DViewer: (product: Product) => void;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
  onOpen3DViewer,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateState, setRotateState] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Mouse tilt 3D parallax handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle 3D tilt (-12deg to +12deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotateState({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverBlip();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateState({ x: 0, y: 0 });
  };

  const handleFlipCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickBeep();
    setIsFlipped(!isFlipped);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickBeep();
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
    onToggleWishlist(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCartChime();
    onAddToCart(product);
  };

  return (
    <div 
      className="relative w-full h-[450px] perspective-1000 select-none group"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Transform Wrapper with Tilt and Flip */}
      <motion.div
        animate={{
          rotateX: isFlipped ? 0 : rotateState.x,
          rotateY: isFlipped ? 180 : rotateState.y,
          translateZ: isHovered ? 20 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 22,
        }}
        className="w-full h-full preserve-3d relative rounded-3xl"
      >
        {/* =========================================================================
            FRONT FACE OF 3D CARD
           ========================================================================= */}
        <div className="absolute inset-0 w-full h-full rounded-3xl glass-2027 border border-[#00F0FF]/25 hover:border-[#00F0FF]/60 transition-colors p-5 flex flex-col justify-between overflow-hidden backface-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_50px_rgba(0,240,255,0.2)]">
          
          {/* Dynamic Light Refraction Sheen on Hover */}
          <div 
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${50 + rotateState.y * 2}% ${50 + rotateState.x * 2}%, rgba(0, 240, 255, 0.15), transparent 70%)`
            }}
          />

          {/* Holographic Scanline */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
            <div className="w-full h-10 bg-gradient-to-b from-transparent via-[#00F0FF]/30 to-transparent animate-holo-scanline" />
          </div>

          {/* Card Top Controls */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Hologram Status / Brand Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-[#00F0FF]/40 text-[10px] font-mono text-[#00F0FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>{product.brand}</span>
            </div>

            {/* Top Right Action Nodes (Wishlist & 360 Flip) */}
            <div className="flex items-center gap-2">
              {/* 360 Flip / Rotate Card Button */}
              <button
                type="button"
                onClick={handleFlipCard}
                className="w-8 h-8 rounded-full glass-2027 hover:border-[#00F0FF] text-slate-300 hover:text-[#00F0FF] flex items-center justify-center transition cursor-pointer"
                title="Rotate card for technical holo-specs"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Wishlist with 3D Heart burst */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleWishlistClick}
                  className={`w-8 h-8 rounded-full glass-2027 flex items-center justify-center transition cursor-pointer ${
                    isWishlisted 
                      ? 'border-rose-500 text-rose-500 bg-rose-500/20' 
                      : 'border-white/10 text-slate-400 hover:text-rose-400'
                  }`}
                  aria-label="Add to Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>

                {/* 3D Heart Burst Particle Animation */}
                <AnimatePresence>
                  {showHeartBurst && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 1, y: 0 }}
                      animate={{ scale: 2.2, opacity: 0, y: -24 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_10px_#f43f5e]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Center Holographic Product Floating Model */}
          <div 
            className="relative z-10 my-auto flex flex-col items-center justify-center cursor-pointer py-2"
            onClick={() => onSelectProduct(product)}
          >
            {/* Pulsing Holo Ring underneath product */}
            <div className="w-36 h-12 rounded-full border border-[#00F0FF]/30 absolute -bottom-2 bg-radial from-[#00F0FF]/20 to-transparent blur-xs opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all" />

            <img
              src={product.image}
              alt={product.name}
              className="h-44 sm:h-48 max-w-[85%] object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)] group-hover:scale-108 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom Specs & Acquisition Bar */}
          <div className="relative z-10 space-y-3 pt-2">
            <div>
              <h3 
                onClick={() => onSelectProduct(product)}
                className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate cursor-pointer"
              >
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-400 font-mono">
                  {product.specs?.Display ? product.specs.Display.split(',')[0] : product.category}
                </span>
                <span className="text-base font-black text-gradient-gold">
                  {formatPrice(product.basePriceUSD, currency)}
                </span>
              </div>
            </div>

            {/* Hologram Action Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* 360 3D Viewer Launch */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen3DViewer(product);
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl glass-2027 hover:border-[#00F0FF] text-[11px] font-bold text-[#00F0FF] hover:bg-[#00F0FF]/10 transition cursor-pointer"
              >
                <Box className="w-3.5 h-3.5" />
                <span>360° Holo</span>
              </button>

              {/* Add to Smart Cart */}
              <button
                type="button"
                onClick={handleAddToCartClick}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 text-[11px] font-black hover:brightness-110 active:scale-95 transition shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Acquire</span>
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BACK FACE OF 3D CARD (Holographic Telemetry & Specs)
           ========================================================================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-3xl glass-2027 border border-[#7B2FFF]/50 p-5 flex flex-col justify-between overflow-hidden backface-hidden shadow-[0_15px_40px_rgba(123,47,255,0.3)]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#7B2FFF]" />
              <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                Hardware Matrix
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleFlipCard}
              className="w-7 h-7 rounded-full glass-2027 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              title="Return to front view"
            >
              <RotateCw className="w-3 h-3" />
            </button>
          </div>

          {/* Specs List */}
          <div className="space-y-2 my-auto overflow-y-auto max-h-[250px] pr-1">
            {Object.entries(product.specs || {}).slice(0, 5).map(([key, val]) => (
              <div key={key} className="glass-2027 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">{key}</span>
                <span className="text-xs font-semibold text-slate-200 block truncate mt-0.5">{val}</span>
              </div>
            ))}
            {product.features?.slice(0, 2).map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                <Check className="w-3 h-3 text-[#00F0FF] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>

          {/* Bottom Actions on Back Face */}
          <div className="space-y-2 border-t border-white/10 pt-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Stock Status</span>
              <span className="font-bold text-[#00F0FF] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                Ready for Dispatch
              </span>
            </div>

            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#00F0FF]/40 text-xs font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Open Full Modal Spec Sheet</span>
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
