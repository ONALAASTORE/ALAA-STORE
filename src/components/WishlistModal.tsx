import React, { useState, useMemo } from 'react';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { 
  buildWishlistShareUrl, 
  buildWhatsAppShareWishlistUrl, 
  formatWishlistShareMessage 
} from '../utils/wishlistShare';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onAddAllToCart?: (products: Product[]) => void;
  onQuickView: (product: Product) => void;
  isSharedWishlist?: boolean;
  onSaveSharedWishlist?: () => void;
  onViewMyWishlist?: () => void;
  myWishlistCount?: number;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onRemoveFromWishlist,
  onAddToCart,
  onAddAllToCart,
  onQuickView,
  isSharedWishlist = false,
  onSaveSharedWishlist,
  onViewMyWishlist,
  myWishlistCount = 0,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Subtle confetti explosion state for micro-particles
  const [burstCenter, setBurstCenter] = useState<{ x: number; y: number } | null>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
  }>>([]);

  // Generate shareable URL with encoded product IDs
  const productIds = useMemo(() => products.map((p) => p.id), [products]);
  const shareUrl = useMemo(() => buildWishlistShareUrl(productIds), [productIds]);
  const totalUSD = useMemo(
    () => products.reduce((sum, p) => sum + p.basePriceUSD, 0),
    [products]
  );

  const whatsAppShareUrl = useMemo(
    () => buildWhatsAppShareWishlistUrl(products, shareUrl, currency),
    [products, shareUrl, currency]
  );

  const formattedShareMessage = useMemo(
    () => formatWishlistShareMessage(products, shareUrl, currency),
    [products, shareUrl, currency]
  );

  // Trigger subtle confetti burst on successful copy
  const triggerSubtleConfetti = (e?: React.MouseEvent | null) => {
    try {
      let originX = 0.5;
      let originY = 0.45;
      if (e && typeof window !== 'undefined' && window.innerWidth > 0 && window.innerHeight > 0) {
        if (typeof e.clientX === 'number' && e.clientX > 0) {
          originX = Math.max(0.12, Math.min(0.88, e.clientX / window.innerWidth));
        }
        if (typeof e.clientY === 'number' && e.clientY > 0) {
          originY = Math.max(0.12, Math.min(0.88, e.clientY / window.innerHeight));
        }
      }

      // Subtle, refined explosion using brand jewelry and storefront tones
      confetti({
        particleCount: 45,
        angle: 90,
        spread: 68,
        origin: { x: originX, y: originY },
        colors: [
          '#f43f5e', // rose-500
          '#e11d48', // rose-600
          '#fb7185', // rose-400
          '#38bdf8', // sky-400
          '#10b981', // emerald-500
          '#f59e0b', // amber-500
          '#a855f7', // purple-500
          '#ec4899', // pink-500
        ],
        ticks: 180,
        gravity: 1.15,
        decay: 0.94,
        scalar: 0.85,
        shapes: ['circle', 'square'],
        disableForReducedMotion: true,
        zIndex: 99999,
      });
    } catch (err) {
      console.warn('Canvas confetti error:', err);
    }

    // Localized tactile motion micro-particles
    const clientX = e?.clientX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
    const clientY = e?.clientY ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 200);
    const colors = ['#f43f5e', '#e11d48', '#38bdf8', '#10b981', '#f59e0b', '#a855f7'];
    const newParticles = Array.from({ length: 18 }).map((_, i) => {
      const angle = (i / 18) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 35 + Math.random() * 55;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: colors[i % colors.length],
        size: 4 + Math.floor(Math.random() * 4),
        rotation: Math.random() * 360,
      };
    });
    setBurstCenter({ x: clientX, y: clientY });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      throw new Error('Clipboard API not available');
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
        return false;
      }
    }
  };

  const handleCopyLink = async (e?: React.MouseEvent) => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      triggerSubtleConfetti(e);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopySummary = async () => {
    const ok = await copyToClipboard(formattedShareMessage);
    if (ok) {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (products.length === 0) return;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'My Wishlist | ON ALAA STORE Lebanon',
          text: `Check out my ${products.length} saved item${products.length !== 1 ? 's' : ''} on ON ALAA STORE Lebanon!`,
          url: shareUrl,
        });
        setShareFeedback('Wishlist shared successfully!');
        setTimeout(() => setShareFeedback(null), 2500);
        return;
      } catch (err: unknown) {
        // User cancelled or aborted the share picker
        if ((err as Error)?.name === 'AbortError') {
          return;
        }
        console.warn('Native share failed, falling back to copy link:', err);
      }
    }

    // Fallback if browser does not support Native Share API
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      triggerSubtleConfetti(e);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      setShareFeedback('Wishlist link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 3000);
    } else {
      setIsShareOpen(true);
    }
  };

  const handleSaveToMyWishlist = () => {
    if (onSaveSharedWishlist) {
      onSaveSharedWishlist();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-7 pb-safe"
        onClick={(e) => e.stopPropagation()}
        id="wishlist-modal-container"
      >
        {/* Confetti Explosion Micro-Particles Overlay */}
        <AnimatePresence>
          {particles.length > 0 && burstCenter && (
            <div 
              className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
              aria-hidden="true"
            >
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{
                    x: burstCenter.x,
                    y: burstCenter.y,
                    scale: 0,
                    opacity: 1,
                    rotate: 0,
                  }}
                  animate={{
                    x: burstCenter.x + p.x,
                    y: burstCenter.y + p.y + 20,
                    scale: [0, 1.35, 0.7],
                    opacity: [1, 1, 0],
                    rotate: p.rotation,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.95,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    backgroundColor: p.color,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                  }}
                  className="absolute rounded-xs shadow-xs"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Top Header Controls: Native Share Button & Close Button */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {products.length > 0 && (
            <button
              onClick={(e) => handleNativeShare(e)}
              id="wishlist-native-share-btn"
              className="relative w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 flex items-center justify-center transition cursor-pointer shadow-2xs hover:scale-105 active:scale-95 group overflow-visible"
              aria-label="Share wishlist"
              title="Share Wishlist via Native Share API (distribute to social media or messaging apps)"
            >
              {/* Subtle pulsing ping wave when wishlist has items */}
              <span className="absolute inset-0 rounded-full bg-rose-400/35 animate-ping pointer-events-none" />

              {/* Animated pulsing Share icon */}
              <motion.span
                animate={products.length > 0 ? {
                  scale: [1, 1.25, 1],
                  opacity: [0.85, 1, 0.85],
                } : {}}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeInOut',
                }}
                className="relative z-10 inline-flex items-center justify-center text-rose-600"
              >
                <Share2 className="w-4 h-4" />
              </motion.span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close wishlist"
            id="close-wishlist-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Share Feedback Toast */}
        {shareFeedback && (
          <div 
            id="wishlist-share-feedback-toast"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-slate-900/95 text-white text-xs font-semibold rounded-full shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{shareFeedback}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 mb-5 pr-10">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${
              isSharedWishlist 
                ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {isSharedWishlist ? (
                <Users className="w-6 h-6 text-purple-600" />
              ) : (
                <Heart className="w-6 h-6 fill-rose-600 text-rose-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 font-display">
                  {isSharedWishlist ? "Friend's Shared Wishlist" : 'Saved Wishlist'}
                </h3>
                {isSharedWishlist && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    Shared Link
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {products.length} saved item{products.length !== 1 ? 's' : ''} 
                {products.length > 0 && ` • Estimated value: ${formatPrice(totalUSD, currency)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Shared Wishlist Alert Banner */}
        {isSharedWishlist && (
          <div className="mb-4 p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-purple-950">Viewing a shared wishlist</p>
                <p className="text-[11px] text-purple-700">A friend shared these {products.length} device picks with you!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="save-shared-wishlist-btn"
                onClick={handleSaveToMyWishlist}
                className="flex-1 sm:flex-none px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved to My Wishlist!</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Save to My Wishlist</span>
                  </>
                )}
              </button>
              {onViewMyWishlist && myWishlistCount > 0 && (
                <button
                  type="button"
                  onClick={onViewMyWishlist}
                  className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  My List ({myWishlistCount})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Your wishlist is empty</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Save items you want to keep an eye on by tapping the heart icon on any product, then easily share them with friends.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Toolbar Actions: Native Share, Share Panel & Add All to Cart */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2">
                {/* Native Share Icon Button with Pulse Animation */}
                <button
                  type="button"
                  id="wishlist-native-share-toolbar-btn"
                  onClick={(e) => handleNativeShare(e)}
                  className="relative min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 shadow-2xs active:scale-95 group"
                  title="Trigger browser's Native Share API to distribute current wishlist URL"
                  aria-label="Share via Native Share API"
                >
                  {/* Glowing beacon when items exist */}
                  {products.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                  )}
                  <motion.span
                    animate={products.length > 0 ? {
                      scale: [1, 1.25, 1],
                      opacity: [0.85, 1, 0.85],
                    } : {}}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: 'easeInOut',
                    }}
                    className="inline-flex items-center justify-center text-rose-600"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </motion.span>
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  id="share-wishlist-toggle-btn"
                  onClick={() => setIsShareOpen((prev) => !prev)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isShareOpen
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
                  }`}
                  title="Open advanced share options and view encoded wishlist link"
                >
                  <span>Link Options</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isShareOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {products.length}
                  </span>
                </button>

                <button
                  type="button"
                  id="quick-copy-link-btn"
                  onClick={(e) => handleCopyLink(e)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border ${
                    copiedLink
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                  }`}
                  title="Quick 1-tap copy shareable wishlist URL"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {onAddAllToCart && (
                <button
                  type="button"
                  id="add-all-wishlist-btn"
                  onClick={() => onAddAllToCart(products)}
                  className="min-h-[38px] px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add All ({formatPrice(totalUSD, currency)})</span>
                </button>
              )}
            </div>

            {/* Expandable Share Wishlist Feature Card */}
            {isShareOpen && (
              <div 
                id="share-wishlist-panel"
                className="p-4 bg-gradient-to-br from-rose-50/70 via-slate-50 to-white rounded-2xl border border-rose-200/80 shadow-sm space-y-3.5 animate-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs">
                      <motion.span
                        animate={products.length > 0 ? {
                          scale: [1, 1.2, 1],
                        } : {}}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: 'easeInOut',
                        }}
                        className="inline-flex items-center justify-center"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.span>
                      <span>Shareable Wishlist URL</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sends your {products.length} saved product IDs encoded directly in the link. Anyone with this link can view and import your wishlist picks!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                    title="Collapse share panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Encoded Shareable URL Display & Copy Button */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Shareable Link (Contains Encoded Product IDs)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="w-full pl-3 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30 select-all shadow-inner"
                        id="wishlist-share-url-input"
                      />
                    </div>
                    <button
                      type="button"
                      id="copy-wishlist-url-btn"
                      onClick={(e) => handleCopyLink(e)}
                      className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                        copiedLink
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                      }`}
                      title="Copy URL to clipboard"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Instant Social Sharing Buttons (WhatsApp, Native Share, Text Summary) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <a
                    href={whatsAppShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    id="share-wishlist-whatsapp-btn"
                    className="min-h-[40px] px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer text-center"
                    title="Send wishlist to friends on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Share on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    id="share-wishlist-native-btn"
                    onClick={(e) => handleNativeShare(e)}
                    className="min-h-[40px] px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    title="Trigger browser Native Share API to distribute wishlist URL across social media or messaging apps"
                  >
                    <motion.span
                      animate={products.length > 0 ? {
                        scale: [1, 1.22, 1],
                      } : {}}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: 'easeInOut',
                      }}
                      className="inline-flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4 shrink-0" />
                    </motion.span>
                    <span>Native Share (Apps)</span>
                  </button>

                  <button
                    type="button"
                    id="copy-wishlist-summary-btn"
                    onClick={handleCopySummary}
                    className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                      copiedSummary
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                    }`}
                    title="Copy formatted text block with product names & pricing"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Text Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>Copy Text Summary</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Optional Message Preview Toggle */}
                <div className="pt-1 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowTextPreview((prev) => !prev)}
                    className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showTextPreview ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide Message Preview</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Preview Formatted Share Text</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Includes {products.length} items & prices
                  </span>
                </div>

                {showTextPreview && (
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800 selection:bg-rose-600/50 scrollbar-thin">
                    {formattedShareMessage}
                  </div>
                )}
              </div>
            )}

            {/* Saved Items List */}
            <div className="space-y-3 divide-y divide-slate-100 max-h-[55vh] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3 sm:gap-4 justify-between">
                  <div 
                    onClick={() => {
                      onClose();
                      onQuickView(p);
                    }}
                    className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 object-contain bg-slate-50 rounded-xl p-1 border border-slate-200 shrink-0 group-hover:border-rose-300 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{p.brand}</span>
                        {p.condition && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {p.condition}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {p.name}
                      </h4>
                      <div className="text-xs sm:text-sm font-black text-slate-900 font-display mt-0.5">
                        {formatPrice(p.basePriceUSD, currency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      title="Add product to cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Add to Cart</span>
                      <span className="xs:hidden">Add</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Remove from wishlist"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Summary Bar */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                <span className="font-semibold">{products.length}</span> item{products.length !== 1 ? 's' : ''} saved • Total: <strong className="text-slate-900 font-display">{formatPrice(totalUSD, currency)}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="wishlist-footer-native-share-btn"
                  onClick={(e) => handleNativeShare(e)}
                  className="px-2.5 py-1 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Share wishlist via Native Share"
                >
                  <motion.span
                    animate={products.length > 0 ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: 'easeInOut',
                    }}
                    className="inline-flex items-center justify-center text-rose-600"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </motion.span>
                  <span>Share Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
