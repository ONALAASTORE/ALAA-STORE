import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  RotateCw, 
  Layers, 
  Sparkles, 
  Camera, 
  ZoomIn, 
  ZoomOut, 
  Box, 
  ShoppingCart, 
  Scan
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { playHoverBlip, playClickBeep, playHologramActivation, playCartChime } from '../../utils/audio2027';

interface ProductViewer3DModalProps {
  product: Product | null;
  currency: Currency;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductViewer3DModal: React.FC<ProductViewer3DModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  // 360 degree rotation angle
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [startRotationY, setStartRotationY] = useState(0);

  // View modes
  const [viewMode, setViewMode] = useState<'standard' | 'hologram' | 'exploded'>('standard');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isARActive, setIsARActive] = useState(false);
  const [arScale, setArScale] = useState(100);
  const [cameraPermission, setCameraPermission] = useState<'idle' | 'granted' | 'denied'>('idle');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start drag rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setStartRotationY(rotationY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    // Map pixels to degrees (1px = 0.8deg)
    const newAngle = (startRotationY + deltaX * 0.8) % 360;
    setRotationY(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Camera stream cleanup for AR mode
  useEffect(() => {
    if (isARActive) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            streamRef.current = stream;
            setCameraPermission('granted');
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch(() => {
            setCameraPermission('denied');
          });
      } else {
        setCameraPermission('denied');
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isARActive]);

  const toggleARMode = () => {
    playHologramActivation();
    setIsARActive(!isARActive);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1.0, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl h-[90vh] max-h-[820px] rounded-3xl glass-2027 border border-[#00F0FF]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-2027 border border-[#00F0FF]/50 flex items-center justify-center text-[#00F0FF]">
              <Box className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-wider">
                  360° Spatial Hologram Viewer
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[10px] text-[#00F0FF] font-mono">
                  {Math.round(rotationY)}° AZIMUTH
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate max-w-sm sm:max-w-md">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AR Preview Trigger Button */}
            <button
              type="button"
              onClick={toggleARMode}
              onMouseEnter={playHoverBlip}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isARActive 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' 
                  : 'bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>{isARActive ? 'Exit AR Chamber' : 'View in Your Space (AR)'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full glass-2027 hover:border-rose-500 hover:text-rose-400 flex items-center justify-center text-slate-400 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main 3D Canvas / Stage Body */}
        <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
          
          {/* If AR Mode is active */}
          {isARActive ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
              {/* Real Camera Stream if granted */}
              {cameraPermission === 'granted' ? (
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              ) : (
                /* Simulated AR Room environment */
                <div className="absolute inset-0 bg-radial from-[#1E293B] via-[#0A0F1E] to-[#020617] flex items-center justify-center">
                  <div className="absolute inset-0 laser-grid-floor opacity-50" />
                  <div className="text-center p-6 glass-2027 rounded-2xl max-w-md border border-[#00F0FF]/30 z-0">
                    <Camera className="w-8 h-8 text-[#00F0FF] mx-auto mb-2 animate-bounce" />
                    <h4 className="font-bold text-sm text-white">Spatial AR Chamber Simulation</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Projecting 1:1 scale model onto simulated Lebanese living space floor.
                    </p>
                  </div>
                </div>
              )}

              {/* AR Reticle / Surface Detection Laser Grid */}
              <div className="absolute bottom-16 w-80 h-36 rounded-full border-2 border-dashed border-[#00F0FF]/60 bg-radial from-[#00F0FF]/15 to-transparent pointer-events-none animate-pulse flex items-center justify-center">
                <div className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-full border border-[#00F0FF]/40">
                  Surface Plane Locked
                </div>
              </div>

              {/* Floating Product in AR Space with Scale Control */}
              <div 
                className="relative z-20 cursor-grab active:cursor-grabbing"
                style={{ transform: `scale(${arScale / 100})` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-72 sm:h-96 object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* AR Controls Floating Dock */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-3 p-3 rounded-2xl glass-2027 border border-white/20 z-30 max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300">AR Scale:</span>
                  <input
                    type="range"
                    min={40}
                    max={160}
                    value={arScale}
                    onChange={(e) => setArScale(Number(e.target.value))}
                    className="w-28 sm:w-36 accent-[#00F0FF]"
                  />
                  <span className="text-xs font-mono font-bold text-[#00F0FF]">{arScale}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => setArScale(100)}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg glass-2027 text-slate-300 hover:text-white"
                >
                  Reset Scale
                </button>
              </div>
            </div>
          ) : (
            /* Standard 360° Stage with Hologram & Exploded Layers */
            <div 
              className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Hologram Pedestal with Laser Rings */}
              <div className="absolute bottom-10 w-80 sm:w-96 h-28 pointer-events-none">
                <div className="absolute inset-0 rounded-full border-2 border-[#00F0FF]/40 animate-ping opacity-20 [animation-duration:5s]" />
                <div className="absolute inset-3 rounded-full border border-[#7B2FFF]/60 shadow-[0_0_25px_rgba(123,47,255,0.6)]" />
                <div className="absolute inset-8 rounded-full border border-[#00F0FF] shadow-[0_0_20px_#00F0FF]" />
                <div className="absolute inset-12 rounded-full bg-radial from-[#00F0FF]/25 to-transparent blur-md" />
              </div>

              {/* 360 Model Container with 3D Rotation */}
              <div 
                className="relative flex items-center justify-center transition-transform duration-75 preserve-3d"
                style={{
                  transform: `scale(${zoomLevel}) rotateY(${rotationY}deg)`,
                }}
              >
                {/* EXPLODED LAYERS VIEW MODE */}
                {viewMode === 'exploded' ? (
                  <div className="relative flex items-center justify-center h-80 sm:h-96 w-80 preserve-3d">
                    {/* Layer 1: Display Glass */}
                    <motion.div 
                      animate={{ z: 80, y: -40, opacity: 0.9 }}
                      className="absolute inset-0 flex items-center justify-center filter drop-shadow-[0_0_15px_#00F0FF]"
                    >
                      <img 
                        src={product.image} 
                        alt="Display Glass Layer" 
                        className="max-h-full object-contain filter hue-rotate-90 opacity-70"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-0 right-0 px-2 py-0.5 rounded-md bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[10px] font-mono text-[#00F0FF]">
                        Layer 1: OLED Glass
                      </span>
                    </motion.div>

                    {/* Layer 2: Titanium Chassis */}
                    <motion.div 
                      animate={{ z: 0, y: 0, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <img 
                        src={product.image} 
                        alt="Chassis" 
                        className="max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-1/2 left-0 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[#7B2FFF]/20 border border-[#7B2FFF]/50 text-[10px] font-mono text-[#7B2FFF]">
                        Layer 2: Grade 5 Titanium
                      </span>
                    </motion.div>

                    {/* Layer 3: Silicon Processor & Logic Board */}
                    <motion.div 
                      animate={{ z: -80, y: 40, opacity: 0.85 }}
                      className="absolute inset-0 flex items-center justify-center filter drop-shadow-[0_0_20px_#FFD700]"
                    >
                      <img 
                        src={product.image} 
                        alt="SoC Motherboard" 
                        className="max-h-full object-contain filter invert opacity-50"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-md bg-[#FFD700]/20 border border-[#FFD700]/50 text-[10px] font-mono text-[#FFD700]">
                        Layer 3: SoC Architecture
                      </span>
                    </motion.div>
                  </div>
                ) : (
                  /* STANDARD & HOLOGRAM VIEW MODE */
                  <div className="relative flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`h-72 sm:h-96 object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                        viewMode === 'hologram' 
                          ? 'opacity-80 contrast-150 brightness-125 filter drop-shadow-[0_0_25px_#00F0FF] hue-rotate-180' 
                          : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />

                    {/* Holographic Scanline Wave Overlay when in Hologram Mode */}
                    {viewMode === 'hologram' && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="w-full h-16 bg-gradient-to-b from-transparent via-[#00F0FF]/40 to-transparent animate-holo-scanline" />
                        <div className="absolute inset-0 laser-grid-floor opacity-30" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Drag Hint Overlay */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass-2027 border border-[#00F0FF]/30 text-xs font-mono text-slate-300 flex items-center gap-2 pointer-events-none">
                <RotateCw className="w-3.5 h-3.5 text-[#00F0FF] animate-spin [animation-duration:8s]" />
                <span>Drag left / right to orbit 360°</span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Mode Switchers & Actions Dock */}
        <div className="px-6 py-4 border-t border-white/10 glass-2027 flex flex-wrap items-center justify-between gap-4 z-20">
          
          {/* Mode Tabs: Standard / Hologram / Exploded */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/80 border border-white/10">
            <button
              type="button"
              onClick={() => {
                playClickBeep();
                setViewMode('standard');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'standard' 
                  ? 'bg-white/15 text-white border border-white/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard 3D
            </button>

            <button
              type="button"
              onClick={() => {
                playHologramActivation();
                setViewMode('hologram');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'hologram' 
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                  : 'text-slate-400 hover:text-[#00F0FF]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Holographic</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickBeep();
                setViewMode('exploded');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'exploded' 
                  ? 'bg-[#7B2FFF]/20 text-[#7B2FFF] border border-[#7B2FFF]/50 shadow-[0_0_15px_rgba(123,47,255,0.3)]' 
                  : 'text-slate-400 hover:text-[#7B2FFF]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Exploded Layers</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.15))}
              className="w-8 h-8 rounded-lg glass-2027 flex items-center justify-center text-slate-300 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-slate-300 w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(1.6, zoomLevel + 0.15))}
              className="w-8 h-8 rounded-lg glass-2027 flex items-center justify-center text-slate-300 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Acquire CTA */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Pricing</span>
              <span className="text-base font-black text-gradient-gold">
                {formatPrice(product.basePriceUSD, currency)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playCartChime();
                onAddToCart(product);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Smart Cart</span>
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
