import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  Coins, 
  Box, 
  HelpCircle, 
  Calculator, 
  Lock, 
  MessageCircle, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Currency } from '../types';
import { LogoAvatar, Brand3DText } from './brand';
import { buildWhatsAppLink } from '../utils/phone';
import { DEFAULT_USD_TO_LBP_RATE } from '../utils/currency';
import { User, Tag, Sun, Moon } from 'lucide-react';

interface StoreHamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSwitchToShowroom?: () => void;
  onOpenContact?: () => void;
  onOpenTradeIn?: () => void;
  onOpenAdmin?: () => void;
  onOpenAccount?: () => void;
  onNavigateToOffers?: () => void;
  offersCount?: number;
  whatsappNumber?: string;
  currency?: Currency;
  onCurrencyChange?: (c: Currency) => void;
  topBannerText?: string;
}

export const StoreHamburgerDrawer: React.FC<StoreHamburgerDrawerProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onToggleTheme,
  onSwitchToShowroom,
  onOpenContact,
  onOpenTradeIn,
  onOpenAdmin,
  onOpenAccount,
  onNavigateToOffers,
  offersCount = 0,
  whatsappNumber = '+961 71 135 241',
  currency = 'USD',
  onCurrencyChange,
}) => {
  const isDark = theme === 'dark';

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const whatsappChatUrl = buildWhatsAppLink(
    whatsappNumber,
    'Hello On Alaa Store, I have an inquiry regarding product delivery and availability in Lebanon.'
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="hamburger-drawer-overlay"
          className="fixed inset-0 z-50 overflow-hidden font-sans"
        >
          {/* Smooth Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Container (Slide-out from Left) */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <motion.div
              id="store-hamburger-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className={`w-screen max-w-sm sm:max-w-md h-full flex flex-col justify-between shadow-2xl border-r transition-colors ${
                isDark 
                  ? 'bg-[#09090b] border-zinc-800 text-zinc-100' 
                  : 'bg-white border-zinc-200 text-zinc-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top Header */}
              <div 
                className={`p-4 sm:p-5 border-b flex items-center justify-between transition-colors ${
                  isDark 
                    ? 'border-zinc-800/80 bg-zinc-950/80' 
                    : 'border-zinc-200/80 bg-zinc-50/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LogoAvatar size="sm" withGlow={false} />
                  <div>
                    <Brand3DText 
                      size="sm" 
                      isDarkTheme={isDark} 
                      withLebanonBadge={true} 
                      withTagline={false} 
                    />
                    <div className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 font-semibold mt-0.5">
                      Store Navigation & Hub
                    </div>
                  </div>
                </div>

                <button
                  id="hamburger-drawer-close-btn"
                  type="button"
                  onClick={onClose}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isDark 
                      ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800' 
                      : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 hover:border-zinc-300 hover:bg-zinc-100'
                  }`}
                  aria-label="Close navigation drawer"
                  title="Close Menu (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content: Single Well-Organized Vertical Column */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2.5 overscroll-contain">
                
                {/* Section Sub-heading */}
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-1 pb-1">
                  Store Details & Direct Links
                </div>

                {/* 1. AVAILABLE DELIVERY TO ALL LEBANON 🚚 */}
                <div 
                  id="drawer-item-delivery"
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-emerald-500/40 hover:bg-zinc-900/90' 
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-emerald-500/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-[13px] font-bold tracking-tight text-emerald-500 flex items-center gap-1">
                          AVAILABLE DELIVERY TO ALL LEBANON 🚚
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Beirut, Tripoli, Saida, Bekaa
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          24-48H DISPATCH
                        </span>
                        <span>Official Courier Coverage</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 100% AGENCY SEALED */}
                <div 
                  id="drawer-item-sealed"
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-blue-500/40 hover:bg-zinc-900/90' 
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-blue-500/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-[13px] font-bold tracking-tight text-blue-500 flex items-center gap-1">
                          100% AGENCY SEALED
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                          VERIFIED
                        </span>
                      </div>
                      <p className={`text-xs mt-1 font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Factory packed, unopened boxes with official Lebanese warranty and authentic agency barcode verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. RATE: $1 = 89,500 L.L. */}
                <div 
                  id="drawer-item-rate"
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-amber-500/40 hover:bg-zinc-900/90' 
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-amber-500/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-[13px] font-mono font-bold tracking-tight text-amber-500">
                          RATE: $1 = {DEFAULT_USD_TO_LBP_RATE.toLocaleString()} L.L.
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          Daily Fix
                        </span>
                      </div>
                      <p className={`text-xs mt-1 font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Official store exchange standard across USD and Lebanese Pounds.
                      </p>

                      {/* Interactive Currency Selector */}
                      {onCurrencyChange && (
                        <div className="mt-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-500">Display Currency:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onCurrencyChange('USD')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                                currency === 'USD'
                                  ? (isDark ? 'bg-zinc-100 text-zinc-950 border-white' : 'bg-zinc-950 text-white border-zinc-950')
                                  : (isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white' : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-950')
                              }`}
                            >
                              USD ($)
                            </button>
                            <button
                              type="button"
                              onClick={() => onCurrencyChange('LBP')}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                                currency === 'LBP'
                                  ? (isDark ? 'bg-zinc-100 text-zinc-950 border-white' : 'bg-zinc-950 text-white border-zinc-950')
                                  : (isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white' : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-950')
                              }`}
                            >
                              LBP (L.L.)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. 3D ROOM (Link/Button Style) */}
                <button
                  id="drawer-item-3d-room"
                  type="button"
                  onClick={() => {
                    if (onSwitchToShowroom) {
                      onSwitchToShowroom();
                      onClose();
                    }
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border-blue-900/60 hover:border-blue-500 hover:bg-blue-950/50 text-zinc-100' 
                      : 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-blue-200 hover:border-blue-500 hover:bg-blue-100/50 text-zinc-900'
                  }`}
                  title="Enter 3D Spatial Showroom"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-[13px] font-bold uppercase tracking-tight text-blue-600 dark:text-blue-400">
                          3D ROOM
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-600 text-white">
                          NEW
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Interactive 3D Virtual Showroom & Spatial AR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 group-hover:translate-x-1 transition-transform">
                    <span>ENTER</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* 5. SUPPORT (Clickable Help Link) */}
                <button
                  id="drawer-item-support"
                  type="button"
                  onClick={() => {
                    if (onOpenContact) {
                      onOpenContact();
                      onClose();
                    }
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-100' 
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-zinc-300 hover:bg-white text-zinc-900'
                  }`}
                  title="Open Customer Support & FAQ"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300 group-hover:text-white' 
                        : 'bg-white border-zinc-200 text-zinc-700 group-hover:text-zinc-950'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-[13px] font-bold tracking-tight">
                        SUPPORT
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Customer Helpdesk, Order Tracking & Beirut Dispatch
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-1 transition-all shrink-0">
                    <span>HELP</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* 6. TRADE-IN */}
                <button
                  id="drawer-item-trade-in"
                  type="button"
                  onClick={() => {
                    if (onOpenTradeIn) {
                      onOpenTradeIn();
                      onClose();
                    }
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-100' 
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-zinc-300 hover:bg-white text-zinc-900'
                  }`}
                  title="Calculate Device Trade-In Valuation"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300 group-hover:text-white' 
                        : 'bg-white border-zinc-200 text-zinc-700 group-hover:text-zinc-950'
                    }`}>
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-[13px] font-bold tracking-tight flex items-center gap-1.5">
                        <span>TRADE-IN</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          INSTANT VALUE
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Trade your used iPhone, Samsung, or iPad for store credit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-1 transition-all shrink-0">
                    <span>ESTIMATE</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* 7. ADMIN (Secure Dashboard Link) */}
                <button
                  id="drawer-item-admin"
                  type="button"
                  onClick={() => {
                    if (onOpenAdmin) {
                      onOpenAdmin();
                      onClose();
                    }
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                    isDark 
                      ? 'bg-zinc-900/60 border-zinc-800/90 hover:border-purple-500/40 hover:bg-zinc-900 text-zinc-100' 
                      : 'bg-zinc-50 border-zinc-200/90 hover:border-purple-500/40 hover:bg-white text-zinc-900'
                  }`}
                  title="Open Secure Admin Portal"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-500 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-[13px] font-bold tracking-tight flex items-center gap-1.5">
                        <span>ADMIN</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          PORTAL
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Secure product catalog & inventory management
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-purple-500 group-hover:translate-x-1 transition-all shrink-0">
                    <span>LOGIN</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* 8. WHATSAPP: +961 71 135 241 (Direct Click-To-Chat WhatsApp Link) */}
                <a
                  id="drawer-item-whatsapp"
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all flex items-center justify-between gap-3 group shadow-xs cursor-pointer"
                  title="Direct WhatsApp Chat with ON-ALAA-STORE"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-[13px] font-bold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <span>WHATSAPP: {whatsappNumber}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                        Instant Beirut chat, price inquiries & custom orders
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform">
                    <span>CHAT</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </a>

                {/* Additional Store Shortcuts (Offers, Account & Theme) */}
                {(onNavigateToOffers || onOpenAccount || onToggleTheme) && (
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
                      Quick Shortcuts
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {onNavigateToOffers && (
                        <button
                          id="drawer-item-offers"
                          type="button"
                          onClick={() => {
                            onNavigateToOffers();
                            onClose();
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isDark 
                              ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700' 
                              : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:text-zinc-950 hover:border-zinc-300'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-zinc-400" />
                            <span>OFFERS</span>
                          </span>
                          {offersCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                              {offersCount}
                            </span>
                          )}
                        </button>
                      )}

                      {onOpenAccount && (
                        <button
                          id="drawer-item-account"
                          type="button"
                          onClick={() => {
                            onOpenAccount();
                            onClose();
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isDark 
                              ? 'border-blue-900/40 bg-blue-950/30 text-blue-300 hover:border-blue-700' 
                              : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            <span>MY ACCOUNT</span>
                          </span>
                          <span>→</span>
                        </button>
                      )}
                    </div>

                    {onToggleTheme && (
                      <button
                        type="button"
                        onClick={onToggleTheme}
                        className={`w-full p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                          isDark 
                            ? 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800/60' 
                            : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-bold">
                          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-500" />}
                          <span>THEME MODE</span>
                        </span>
                        <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                          {theme}
                        </span>
                      </button>
                    )}
                  </div>
                )}

              </div>

              {/* Drawer Bottom Bar: Store Info & Micro-status */}
              <div 
                className={`p-4 border-t text-xs font-mono flex items-center justify-between transition-colors ${
                  isDark 
                    ? 'border-zinc-800 bg-zinc-950/80 text-zinc-400' 
                    : 'border-zinc-200 bg-zinc-50/80 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium">Beirut, Lebanon • Open Today</span>
                </div>
                <span className="text-[10px] text-zinc-500">v2.4 Agency</span>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
