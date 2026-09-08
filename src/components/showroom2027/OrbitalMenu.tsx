import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Smartphone, 
  Headphones, 
  Bot, 
  ShoppingCart, 
  Orbit, 
  X, 
  Layers
} from 'lucide-react';
import { playHoverBlip, playClickBeep } from '../../utils/audio2027';

interface OrbitalMenuProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenAI: () => void;
  onOpenCart: () => void;
  onOpenCheckoutTunnel: () => void;
  cartCount: number;
}

export const OrbitalMenu: React.FC<OrbitalMenuProps> = ({
  onSelectCategory,
  onOpenAI,
  onOpenCart,
  onOpenCheckoutTunnel,
  cartCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const orbitalItems = [
    {
      id: 'phones',
      label: 'Phones & Devices',
      icon: Smartphone,
      color: '#00F0FF',
      action: () => onSelectCategory('phones'),
    },
    {
      id: 'audio',
      label: 'Spatial Audio',
      icon: Headphones,
      color: '#7B2FFF',
      action: () => onSelectCategory('audio'),
    },
    {
      id: 'ai-assistant',
      label: 'AI Hologram Concierge',
      icon: Bot,
      color: '#00F0FF',
      action: () => onOpenAI(),
    },
    {
      id: 'cart',
      label: `Smart Cart (${cartCount})`,
      icon: ShoppingCart,
      color: '#FFD700',
      action: () => onOpenCart(),
    },
    {
      id: 'tunnel-checkout',
      label: '3D Tunnel Checkout',
      icon: Layers,
      color: '#00F0FF',
      action: () => onOpenCheckoutTunnel(),
    },
    {
      id: 'all',
      label: 'All Quantum Tech',
      icon: Sparkles,
      color: '#7B2FFF',
      action: () => onSelectCategory('all'),
    },
  ];

  const radius = 105; // Orbit radius in pixels

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Floating 3D Orbital Navigation Container */}
      <div className="relative flex items-center justify-center">
        
        {/* Orbit Path Circles when Open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute pointer-events-none"
              style={{ width: radius * 2 + 70, height: radius * 2 + 70 }}
            >
              {/* Outer Orbit Guide Ring */}
              <div className="w-full h-full rounded-full border border-[#00F0FF]/25 animate-orbit-slow" />
              {/* Middle dashed Purple Ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-[#7B2FFF]/40 animate-orbit-counter" />
              {/* Central Glowing Core Backdrop */}
              <div className="absolute inset-10 rounded-full bg-radial from-[#00F0FF]/15 to-transparent blur-xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbiting Satellite Nodes */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute pointer-events-auto">
              {orbitalItems.map((item, index) => {
                const angle = (index / orbitalItems.length) * 2 * Math.PI - Math.PI / 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ x, y, scale: 1, opacity: 1 }}
                    exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute -top-5 -left-5"
                  >
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => {
                          playClickBeep();
                          item.action();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => {
                          playHoverBlip();
                        }}
                        className="w-11 h-11 rounded-full glass-2027 hover:scale-115 active:scale-95 transition-all flex items-center justify-center border shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
                        style={{ borderColor: item.color }}
                        aria-label={item.label}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} />

                        {/* Cart badge if needed */}
                        {item.id === 'cart' && cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFD700] text-slate-950 font-black text-[9px] flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </button>

                      {/* Tooltip on Node */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                        <div className="px-2.5 py-1 rounded-lg glass-2027 border border-[#00F0FF]/50 text-[11px] font-bold text-white whitespace-nowrap shadow-xl">
                          {item.label}
                        </div>
                        <div className="w-1.5 h-1.5 rotate-45 bg-[#00F0FF] -mt-0.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Central Reactor Orb Button */}
        <button
          type="button"
          onClick={() => {
            playClickBeep();
            setIsOpen(!isOpen);
          }}
          onMouseEnter={playHoverBlip}
          className={`relative w-14 h-14 rounded-full glass-2027 flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
            isOpen 
              ? 'border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.5)] rotate-90' 
              : 'border-[#00F0FF]/80 hover:border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.4)]'
          }`}
          aria-label="Toggle 3D Orbital Navigation"
        >
          {/* Animated Glowing Ring Inside */}
          <div className="absolute inset-1 rounded-full border border-[#00F0FF]/40 animate-ping opacity-30 [animation-duration:3s]" />

          {isOpen ? (
            <X className="w-6 h-6 text-[#FFD700]" />
          ) : (
            <div className="flex flex-col items-center">
              <Orbit className="w-6 h-6 text-[#00F0FF] animate-spin [animation-duration:12s]" />
              <span className="text-[8px] font-black tracking-widest text-gradient-2027 uppercase mt-0.5">
                Orbit
              </span>
            </div>
          )}
        </button>

      </div>
    </div>
  );
};
