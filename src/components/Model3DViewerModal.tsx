import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Box, 
  Camera, 
  Scan, 
  Sparkles, 
  Compass, 
  Layers, 
  Ruler, 
  Check, 
  Share2, 
  Smartphone, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  QrCode, 
  ShoppingCart, 
  MessageCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Product, Currency, ProductVariant } from '../types';
import { formatPrice } from '../utils/currency';
import { buildWhatsAppLink } from '../utils/phone';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';

interface Model3DViewerModalProps {
  product: Product;
  currency: Currency;
  onClose: () => void;
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  whatsappNumber?: string;
}

interface SpecHotspot {
  id: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  x: number; // percentage on face
  y: number; // percentage on face
  viewAngle: number; // best viewing angle (0 to 360)
}

export const is3DSupported = (product?: Product | null): boolean => {
  if (!product) return false;
  if (product.has3DModel) return true;

  const highEndBrands = ['apple', 'samsung', 'sony', 'dji', 'asus', 'hyperx', 'razer', 'logitech', 'dell', 'lenovo', 'huawei', 'nintendo', 'google'];
  const highEndCategories = ['smartphones', 'laptops', 'laptops-macbooks', 'tablets', 'gaming', 'gaming-consoles', 'wearables', 'audio', 'cameras-projectors'];

  const prodBrand = (product.brand || '').toLowerCase();
  const prodCategory = (product.category || '').toLowerCase();
  const prodName = (product.name || '').toLowerCase();

  const hasHighEndKeyword = [
    'pro', 'ultra', 'max', 'macbook', 'iphone', 'galaxy', 'playstation', 'ps5',
    'vision', 'rog', 'wh-1000', 'airpods', 'ipad', 'fold', 'flip', 'drone', 'watch ultra',
    'titanium', 'rtx', 'oled', 'bionic', 'snapdragon', 'pixel', 'switch'
  ].some((kw) => prodName.includes(kw));

  const isBrandMatch = highEndBrands.some((b) => prodBrand.includes(b));
  const isCategoryMatch = highEndCategories.some((c) => prodCategory.includes(c));
  const isPremiumPrice = (product.basePriceUSD || 0) >= 199;

  return hasHighEndKeyword || (isBrandMatch && isCategoryMatch) || isPremiumPrice;
};

export const Model3DViewerModal: React.FC<Model3DViewerModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  whatsappNumber = '+961 71 135 241',
}) => {
  const [activeMode, setActiveMode] = useState<'3d' | 'ar'>('3d');
  
  // 3D Model rotation & camera state
  const [rotX, setRotX] = useState<number>(10);
  const [rotY, setRotY] = useState<number>(30);
  const [zoom, setZoom] = useState<number>(1.05);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [lightingMode, setLightingMode] = useState<'studio' | 'cyber' | 'noir'>('studio');
  const [isExplodedView, setIsExplodedView] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<SpecHotspot | null>(null);
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [arSnapshotFlash, setArSnapshotFlash] = useState<boolean>(false);
  const [arScale, setArScale] = useState<number>(1.0); // 1.0 = 100%
  const [arPlaced, setArPlaced] = useState<boolean>(true);
  const [arSurfaceScanning, setArSurfaceScanning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const productImages = useMemo(() => {
    return getProductImages(product);
  }, [product]);

  const primaryImage = productImages[0] || product.image || DEFAULT_PRODUCT_IMAGE;
  const secondaryImage = productImages[1] || productImages[0] || primaryImage;

  // Selected Color Swatch
  const availableColors = useMemo(() => {
    if (product.colorOptions && product.colorOptions.length > 0) {
      return product.colorOptions;
    }
    return [
      { name: 'Natural Titanium', hex: '#8F8D88' },
      { name: 'Midnight Obsidian', hex: '#1C1C1E' },
      { name: 'Silver Frost', hex: '#E2E4E5' },
      { name: 'Cyber Electric Blue', hex: '#0066FF' },
    ];
  }, [product]);

  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0]?.name || 'Default');

  // Interactive Hardware Spec Hotspots dynamically customized to the product
  const hotspots = useMemo<SpecHotspot[]>(() => {
    const isPhone = product.category === 'smartphones' || product.name.toLowerCase().includes('iphone') || product.name.toLowerCase().includes('galaxy');
    const isLaptop = product.category === 'laptops-macbooks' || product.category === 'laptops' || product.name.toLowerCase().includes('macbook');
    const isConsole = product.category === 'gaming-consoles' || product.category === 'gaming' || product.name.toLowerCase().includes('playstation') || product.name.toLowerCase().includes('ps5');

    if (isPhone) {
      return [
        {
          id: 'camera',
          title: 'Periscope Fusion Camera Array',
          category: 'Optics & Sensors',
          description: 'Custom 48MP Quad-Pixel sensor with 5x optical telephoto, LiDAR laser autofocus, and 4K 120fps Dolby Vision HDR capture.',
          metric: '48MP • ƒ/1.78 • 5x Zoom',
          x: 32,
          y: 28,
          viewAngle: 180,
        },
        {
          id: 'display',
          title: 'Super Retina XDR OLED',
          category: 'Display Architecture',
          description: 'Adaptive 120Hz ProMotion panel with Ceramic Shield front glass, 2000 nits peak outdoor brightness, and micro-bezel border.',
          metric: '120Hz • 2000 Nits • OLED',
          x: 50,
          y: 45,
          viewAngle: 0,
        },
        {
          id: 'silicon',
          title: 'Flagship 3nm Bionic Processor',
          category: 'Core Compute & AI',
          description: 'Advanced 3-nanometer architecture with dedicated 16-core Neural Engine delivering over 35 trillion operations per second.',
          metric: '3nm • 6-Core GPU • Ray Tracing',
          x: 50,
          y: 60,
          viewAngle: 0,
        },
        {
          id: 'chassis',
          title: 'Grade 5 Aerospace Titanium Chassis',
          category: 'Structural Materials',
          description: 'Precision machined internal aluminum substructure fused with an exterior titanium band for highest strength-to-weight ratio.',
          metric: 'Grade 5 Titanium • 221g',
          x: 75,
          y: 70,
          viewAngle: 45,
        },
      ];
    }

    if (isLaptop) {
      return [
        {
          id: 'display',
          title: 'Liquid Retina XDR Mini-LED',
          category: 'Display',
          description: '1,000,000:1 contrast ratio, 1600 nits peak HDR brightness with 1 Billion colors and ProMotion dynamic refresh.',
          metric: 'Mini-LED • 1600 Nits • 120Hz',
          x: 50,
          y: 35,
          viewAngle: 0,
        },
        {
          id: 'keyboard',
          title: 'Magic Keyboard & Force Touch Trackpad',
          category: 'Haptics & Input',
          description: 'Full-height function row, Touch ID biometric sensor, and haptic Force Touch gesture glass trackpad.',
          metric: 'Full Travel • Touch ID',
          x: 50,
          y: 65,
          viewAngle: 25,
        },
        {
          id: 'thermal',
          title: 'Active Thermal Architecture',
          category: 'Cooling & Acoustic',
          description: 'Dual-fan intake and exhaust channels with vapor chamber heat pipe for sustained peak performance under heavy compute loads.',
          metric: 'Dual Fan • Whisper Quiet',
          x: 25,
          y: 70,
          viewAngle: 180,
        },
      ];
    }

    if (isConsole) {
      return [
        {
          id: 'gpu',
          title: 'Spectral Super Resolution GPU',
          category: 'Compute & Rendering',
          description: 'Custom RDNA graphics architecture delivering 16.7 TFLOPs with AI upscaling and advanced ray tracing acceleration.',
          metric: '16.7 TFLOPs • 4K 120fps',
          x: 50,
          y: 40,
          viewAngle: 45,
        },
        {
          id: 'storage',
          title: 'Ultra-High Speed Custom NVMe SSD',
          category: 'I/O & Memory',
          description: 'Integrated 2TB PCIe Gen 4 solid-state drive delivering 5.5GB/s raw read throughput with near-instant world streaming.',
          metric: '5.5 GB/s • 2TB Storage',
          x: 40,
          y: 65,
          viewAngle: 90,
        },
      ];
    }

    // Generic Flagship Hotspots
    return [
      {
        id: 'build',
        title: 'Precision CNC Machined Chassis',
        category: 'Build & Materials',
        description: 'Aerospace-grade composite alloy with anti-reflective oleophobic coating and IP68 water & dust resistance.',
        metric: 'IP68 • Anti-Reflective',
        x: 50,
        y: 40,
        viewAngle: 0,
      },
      {
        id: 'hardware',
        title: 'Next-Gen Performance Architecture',
        category: 'Hardware Specs',
        description: 'Engineered for low latency, extended battery efficiency, and ultra-high reliability with international warranty coverage.',
        metric: 'High Efficiency • 1-Yr Warranty',
        x: 50,
        y: 65,
        viewAngle: 45,
      },
    ];
  }, [product]);

  // Smooth continuous auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || isDragging || activeMode === 'ar') return;

    const animate = () => {
      setRotY((prev) => (prev + 0.35) % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoRotating, isDragging, activeMode]);

  // Drag interaction handlers for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotY((prev) => (prev + deltaX * 0.75 + 360) % 360);
    setRotX((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.4)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture handlers for mobile 360 rotation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotating(false);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;

    setRotY((prev) => (prev + deltaX * 0.75 + 360) % 360);
    setRotX((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.4)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Camera presets
  const handleSetPreset = (yAngle: number, xAngle: number = 8) => {
    setIsAutoRotating(false);
    setRotY(yAngle);
    setRotX(xAngle);
  };

  const handleCopyShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleArSnapshot = () => {
    setArSnapshotFlash(true);
    setTimeout(() => setArSnapshotFlash(false), 300);
  };

  const handleRescanSurface = () => {
    setArSurfaceScanning(true);
    setArPlaced(false);
    setTimeout(() => {
      setArSurfaceScanning(false);
      setArPlaced(true);
    }, 1200);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoRotating((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const priceUSD = product.promotionalPriceUSD || product.basePriceUSD;
  const activeVariant: ProductVariant = product.variants?.[0] || {
    id: `${product.id}-default`,
    name: selectedColor,
    priceUSD: priceUSD,
    inStock: product.inStock,
  };

  const currentColorHex = useMemo(() => {
    const match = availableColors.find((c) => c.name === selectedColor);
    return match?.hex || '#0066FF';
  }, [availableColors, selectedColor]);

  // Lighting atmosphere classes
  const getLightingStyle = () => {
    switch (lightingMode) {
      case 'cyber':
        return 'from-slate-950 via-blue-950/40 to-purple-950/40 border-blue-500/40 shadow-[inset_0_0_80px_rgba(0,102,255,0.2)]';
      case 'noir':
        return 'from-zinc-950 via-zinc-900 to-black border-zinc-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]';
      default:
        return 'from-slate-900 via-slate-900/90 to-blue-950/30 border-slate-800 shadow-[inset_0_0_60px_rgba(255,255,255,0.03)]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-zinc-950 text-white border border-blue-500/30 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col overflow-hidden shadow-2xl shadow-blue-950/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar / Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-zinc-800/90 flex items-center justify-between gap-4 bg-zinc-950/90 backdrop-blur-md z-30 shrink-0">
          
          {/* Product Brand & Model Identification */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Box className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {product.brand}
                </span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">
                  Interactive Spatial Inspection
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Mode Switcher Tabs (3D Model Studio vs AR View) */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              id="toggle-mode-3d-btn"
              onClick={() => setActiveMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeMode === '3d'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Studio</span>
            </button>
            <button
              type="button"
              id="toggle-mode-ar-btn"
              onClick={() => setActiveMode('ar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeMode === 'ar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>AR Room View</span>
              <span className="text-[9px] bg-cyan-400/20 text-cyan-300 font-mono px-1 rounded">LIVE</span>
            </button>
          </div>

          {/* Actions: Share & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
              title="Share 3D Model Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              id="close-3d-modal-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-red-950/60 hover:text-red-400 text-zinc-400 flex items-center justify-center border border-zinc-800 transition cursor-pointer"
              aria-label="Close 3D Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Viewport Workspace */}
        <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
          
          {/* Main 3D / AR Viewport */}
          <div 
            ref={containerRef}
            className={`flex-1 relative overflow-hidden bg-gradient-to-b ${getLightingStyle()} transition-all duration-500 flex items-center justify-center ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Grid Floor Mesh & Holographic Horizon in 3D Mode */}
            {activeMode === '3d' && (
              <div className="absolute inset-0 pointer-events-none opacity-25">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 102, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 102, 255, 0.15) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(120px) scale(2.2)',
                    transformOrigin: 'bottom center',
                  }}
                />
              </div>
            )}

            {/* In AR Mode: Simulated Room Backdrop & Reticle */}
            {activeMode === 'ar' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Simulated Desk / Room Ambient Camera Environment */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-slate-900/60 backdrop-blur-2xs" />
                
                {/* Holographic AR Surface Mesh */}
                <div 
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[520px] h-[320px] rounded-full border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] transition-all duration-700"
                  style={{
                    transform: 'perspective(600px) rotateX(72deg)',
                    background: 'radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, transparent 70%)',
                  }}
                >
                  <div className="absolute inset-0 border border-dashed border-cyan-400/50 rounded-full animate-spin [animation-duration:18s]" />
                </div>

                {/* AR Viewfinder Corner Reticles */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80" />

                {/* AR Status Pill */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/40 text-xs font-mono flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${arSurfaceScanning ? 'bg-amber-400 animate-spin' : arPlaced ? 'bg-cyan-400 animate-ping' : 'bg-zinc-500'}`} />
                  <span className="text-cyan-300 font-bold">
                    {arSurfaceScanning 
                      ? 'Scanning Physical Tabletop...' 
                      : arPlaced 
                      ? 'Surface Locked: Ready in Room' 
                      : 'Detecting Spatial Plane...'}
                  </span>
                  <span className="text-zinc-400">|</span>
                  <span className="text-white font-bold">{Math.round(arScale * 100)}% Scale</span>
                </div>
              </div>
            )}

            {/* Flash Effect when AR Snapshot is triggered */}
            <AnimatePresence>
              {arSnapshotFlash && (
                <motion.div
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 bg-white z-40 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* 3D Model Visual Representation (360 Volumetric Simulation) */}
            <div
              className="relative transition-transform duration-75 ease-out select-none flex items-center justify-center"
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* The 3D Rotating Device Assembly */}
              <div
                id="device-3d-model-stage"
                className="relative will-change-transform flex items-center justify-center transition-transform duration-100 ease-out"
                style={{
                  transform: `scale(${zoom * (activeMode === 'ar' ? arScale : 1)}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Simulated Ambient Contact Shadow on Ground */}
                <div 
                  className="absolute -bottom-16 w-64 h-16 rounded-full blur-xl pointer-events-none transition-opacity duration-300"
                  style={{
                    backgroundColor: lightingMode === 'cyber' ? 'rgba(0, 102, 255, 0.35)' : 'rgba(0, 0, 0, 0.75)',
                    transform: 'rotateX(90deg) translateZ(-40px)',
                  }}
                />

                {/* Main Volumetric Device Body Container */}
                <div 
                  className={`relative w-64 sm:w-72 h-[380px] sm:h-[430px] rounded-[38px] p-2 transition-all duration-300 border-4 shadow-2xl ${
                    isExplodedView ? 'scale-105' : ''
                  }`}
                  style={{
                    borderColor: currentColorHex,
                    backgroundColor: '#0F1117',
                    boxShadow: lightingMode === 'cyber' 
                      ? `0 20px 60px rgba(0,102,255,0.4), 0 0 20px ${currentColorHex}66`
                      : `0 25px 60px rgba(0,0,0,0.8), 0 0 15px ${currentColorHex}33`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Outer Bezel Rim / Matte Glass Finish */}
                  <div className="absolute inset-0 rounded-[34px] border border-white/20 pointer-events-none" />

                  {/* Device Front/Back Image with Dynamic Sheen Reflection */}
                  <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black/95 flex items-center justify-center p-3">
                    <img
                      src={Math.abs(rotY % 360) > 90 && Math.abs(rotY % 360) < 270 ? secondaryImage : primaryImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain pointer-events-none filter drop-shadow-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />

                    {/* Specular Light Dynamic Sweep Reflection */}
                    <div 
                      className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                      style={{
                        transform: `translateX(${(rotY % 180 - 90) * 1.5}%)`,
                        transition: 'transform 0.05s ease-out',
                      }}
                    />

                    {/* Exploded Architecture Wireframe Lines (When Enabled) */}
                    {isExplodedView && (
                      <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-[28px] pointer-events-none flex flex-col justify-between p-3 animate-pulse">
                        <span className="text-[9px] font-mono text-cyan-300 font-bold bg-black/80 px-1 py-0.5 rounded w-fit">
                          LAYER 01: OLED SUBSTRATE
                        </span>
                        <div className="border border-dashed border-cyan-500/40 h-24 rounded-lg flex items-center justify-center">
                          <span className="text-[9px] font-mono text-cyan-400 font-bold">
                            INTERNAL 3NM CORE ARCHITECTURE
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-cyan-300 font-bold bg-black/80 px-1 py-0.5 rounded w-fit">
                          LAYER 02: TITANIUM SHELL
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dimension Ruler Overlay (When Enabled) */}
                  {showRuler && (
                    <div className="absolute -left-10 inset-y-0 flex flex-col justify-between items-center text-[10px] font-mono text-cyan-400 border-l border-dashed border-cyan-500/60 pl-2 pointer-events-none">
                      <span>159.9 mm</span>
                      <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                      <span>76.7 mm</span>
                    </div>
                  )}

                  {/* Interactive Hotspot Nodes on Device in 3D Mode */}
                  {activeMode === '3d' && hotspots.map((spot, idx) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(spot);
                      }}
                      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        transform: 'translateZ(25px)',
                      }}
                      title={spot.title}
                    >
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border border-white text-white text-[10px] font-black items-center justify-center shadow-lg">
                          {idx + 1}
                        </span>
                      </span>

                      {/* Tooltip on Hover */}
                      <span className="absolute left-7 top-1/2 -translate-y-1/2 bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-700 shadow-md">
                        {spot.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Viewport Floating HUD Overlays */}
            
            {/* Top-Left: Orientation Compass & Readouts */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
              <div className="bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>Yaw: {Math.round(rotY)}°</span>
                <span className="text-zinc-600">•</span>
                <span>Pitch: {Math.round(rotX)}°</span>
                <span className="text-zinc-600">•</span>
                <span>Zoom: {zoom.toFixed(1)}x</span>
              </div>

              <div className="text-[10px] font-medium text-zinc-400 pl-1">
                Drag to rotate 360° • Click nodes for specs
              </div>
            </div>

            {/* Top-Right: Camera Presets Bar */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => handleSetPreset(0, 0)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Front Display View"
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(45, 12)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Hero Angle 45°"
              >
                45° Hero
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(90, 0)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Side Profile"
              >
                Side
              </button>
              <button
                type="button"
                onClick={() => handleSetPreset(180, 0)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                title="Back Camera View"
              >
                Back
              </button>
            </div>

            {/* Bottom-Left Controls: Play/Pause Auto-Spin, Zoom In/Out, Ruler & Exploded Mode */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAutoRotating((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  isAutoRotating
                    ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:text-white'
                }`}
                title="Toggle Auto-Rotate (Spacebar)"
              >
                {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isAutoRotating ? 'Pause Spin' : 'Auto Rotate'}</span>
              </button>

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(1.8, prev + 0.15))}
                className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(0.75, prev - 0.15))}
                className="p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowRuler((prev) => !prev)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  showRuler
                    ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:text-white'
                }`}
                title="Toggle Dimensions Ruler"
              >
                <Ruler className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExplodedView((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition cursor-pointer ${
                  isExplodedView
                    ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-xs'
                    : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:text-white'
                }`}
                title="Toggle Internal Hardware Layers"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layers</span>
              </button>
            </div>

            {/* Bottom-Right: Lighting Environment Presets */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 px-1.5 hidden sm:inline">Lighting:</span>
              <button
                type="button"
                onClick={() => setLightingMode('studio')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lightingMode === 'studio' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => setLightingMode('cyber')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lightingMode === 'cyber' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Neon
              </button>
              <button
                type="button"
                onClick={() => setLightingMode('noir')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  lightingMode === 'noir' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Obsidian
              </button>
            </div>

            {/* AR Mode Specific Controls (Snapshot, Scale, Rescan) */}
            {activeMode === 'ar' && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/40 shadow-2xl">
                <button
                  type="button"
                  onClick={handleRescanSurface}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300 hover:bg-cyan-950/40 border border-cyan-500/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Rescan Surface</span>
                </button>

                {/* AR Scale Slider */}
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] text-zinc-400 font-mono">Scale:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={arScale}
                    onChange={(e) => setArScale(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">
                    {Math.round(arScale * 100)}%
                  </span>
                </div>

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={handleArSnapshot}
                  className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-black flex items-center justify-center shadow-lg shadow-cyan-500/30 transition active:scale-95 cursor-pointer"
                  title="Capture AR Scene Photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Color Swatches, Spec Hotspots & Mobile AR QR Code */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-800/90 bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto z-20 space-y-4 shrink-0">
            
            <div className="space-y-4">
              {/* Color Material Finishes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-300">Finish & Colorway</span>
                  <span className="text-blue-400 font-mono text-[11px]">{selectedColor}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                        selectedColor === color.name
                          ? 'border-blue-500 bg-blue-950/30 text-white ring-1 ring-blue-500/50'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: color.hex || '#0066FF' }}
                      />
                      <span className="truncate">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotspot Spec Detail Card (When Selected) */}
              {selectedHotspot ? (
                <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-2 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {selectedHotspot.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedHotspot(null)}
                      className="text-zinc-400 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-extrabold text-white">
                    {selectedHotspot.title}
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {selectedHotspot.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between border-t border-blue-500/20">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">
                      {selectedHotspot.metric}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSetPreset(selectedHotspot.viewAngle, 10)}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Center View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Hardware Inspection Prompt */
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-zinc-300">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Interactive Engineering Points</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    Click any numbered beacon on the 3D model above to inspect camera sensor optics, silicon specs, and chassis materials.
                  </p>
                </div>
              )}

              {/* Physical Dimension Metrics Box */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-blue-400" />
                    <span>Hardware Dimensions</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">1:1 Scale</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[9px]">Height × Width</span>
                    <span className="text-zinc-200 font-bold">159.9 × 76.7 mm</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[9px]">Thickness / Weight</span>
                    <span className="text-zinc-200 font-bold">8.25 mm • 221g</span>
                  </div>
                </div>
              </div>

              {/* Mobile AR QuickLook QR Code */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/20 to-zinc-900/50 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Instant Phone AR View</h5>
                    <p className="text-[10px] text-zinc-400">USDZ (iOS) & GLTF (Android)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="w-16 h-16 rounded-lg bg-white p-1.5 shrink-0 flex items-center justify-center">
                    {/* Stylized QR Code SVG Pattern */}
                    <div className="w-full h-full bg-slate-900 rounded grid grid-cols-4 gap-0.5 p-1">
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-transparent" />
                      <div className="bg-white rounded-xs" />
                      <div className="bg-white rounded-xs" />
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-300 space-y-1">
                    <p>Scan with your phone's camera to place this {product.brand} flagship directly on your desk.</p>
                    <span className="text-blue-400 font-bold block">No app install required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Checkout / WhatsApp Action CTA */}
            <div className="pt-3 border-t border-zinc-800/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Special Online Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-white">
                      {formatPrice(priceUSD, currency)}
                    </span>
                    {currency === 'USD' && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        (≈ {Math.round(priceUSD * 89500).toLocaleString()} L.L.)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Agency Warranty</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Official Lebanese Stock</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onAddToCart && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, activeVariant, 1);
                      onClose();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                )}

                <a
                  href={buildWhatsAppLink(
                    whatsappNumber,
                    `Hello ON-ALAA-STORE, I am inspecting the 3D/AR model for ${product.name} (${selectedColor}). Is it currently available for immediate order?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
                  title="Direct WhatsApp Order"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
