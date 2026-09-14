import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Mail, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { createStockNotification, hasUserRequestedNotification } from '../services/notificationService';
import { buildWhatsAppLink } from '../utils/phone';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant?: ProductVariant;
  theme?: 'dark' | 'light';
  whatsappNumber?: string;
  onNotificationSaved?: () => void;
}

const COUNTRY_CODES = [
  { code: '+961', label: '🇱🇧 Lebanon (+961)', flag: '🇱🇧' },
  { code: '+971', label: '🇦🇪 UAE (+971)', flag: '🇦🇪' },
  { code: '+966', label: '🇸🇦 Saudi Arabia (+966)', flag: '🇸🇦' },
  { code: '+965', label: '🇰🇼 Kuwait (+965)', flag: '🇰🇼' },
  { code: '+974', label: '🇶🇦 Qatar (+974)', flag: '🇶🇦' },
  { code: '+1', label: '🇺🇸 / 🇨🇦 USA/Canada (+1)', flag: '🇺🇸' },
  { code: '+44', label: '🇬🇧 UK (+44)', flag: '🇬🇧' },
  { code: '+33', label: '🇫🇷 France (+33)', flag: '🇫🇷' },
  { code: '+49', label: '🇩🇪 Germany (+49)', flag: '🇩🇪' },
];

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  isOpen,
  onClose,
  product,
  variant,
  theme = 'dark',
  whatsappNumber = '+961 71 135 241',
  onNotificationSaved
}) => {
  const isDark = theme === 'dark';
  const [contactType, setContactType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [countryCode, setCountryCode] = useState('+961');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeVariantName = variant?.name || 'Standard Edition';

  // Check initial state if user already requested
  useEffect(() => {
    if (isOpen) {
      const alreadyRequested = hasUserRequestedNotification(product.id, variant?.id);
      if (alreadyRequested) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
      setErrorMsg('');
    }
  }, [isOpen, product.id, variant?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let contactValue = '';
    if (contactType === 'whatsapp') {
      const cleanPhone = phoneDigits.replace(/\D/g, '');
      if (cleanPhone.length < 6) {
        setErrorMsg('Please enter a valid phone number (at least 6 digits).');
        return;
      }
      contactValue = `${countryCode} ${cleanPhone}`;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress.trim())) {
        setErrorMsg('Please enter a valid email address (e.g. name@example.com).');
        return;
      }
      contactValue = emailAddress.trim();
    }

    setIsSubmitting(true);
    try {
      await createStockNotification({
        productId: product.id,
        productName: product.name,
        variantId: variant?.id,
        variantName: activeVariantName,
        contactType,
        contactValue,
        customerName: customerName.trim() || undefined,
        requestedVia: 'modal'
      });

      setIsSuccess(true);
      if (onNotificationSaved) {
        onNotificationSaved();
      }
    } catch (err) {
      console.error('Failed to register stock notification:', err);
      setErrorMsg('Could not register notification. Please try again or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppInquiry = buildWhatsAppLink(
    whatsappNumber,
    `Hello On Alaa Store! 🇱🇧\nI want to check on restock availability for:\n• Product: ${product.name}\n• Variant: ${activeVariantName}\n\nPlease let me know when new warehouse stock is expected to arrive. Thank you!`
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notify-modal-title"
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 id="notify-modal-title" className="font-bold text-sm tracking-tight">
                Restock Alert Request
              </h3>
              <p className={`text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Notify me when available
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark 
                ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                : 'border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product preview snippet */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          isDark ? 'border-zinc-800/80 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/50'
        }`}>
          <img
            src={product.image || (product.galleryImages && product.galleryImages[0])}
            alt={product.name}
            className="w-12 h-12 object-contain rounded-lg border p-1 bg-white shrink-0 border-zinc-200/80"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-semibold text-amber-500 uppercase tracking-wider block">
              Currently Out of Stock
            </span>
            <h4 className="text-xs font-bold truncate">
              {product.name}
            </h4>
            <p className={`text-[11px] font-mono truncate ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {product.brand} • {activeVariantName}
            </p>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base">You're on the priority restock list!</h4>
                <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  We have saved your alert for <span className="font-semibold text-zinc-200">{product.name}</span>. Our warehouse dispatch team will notify you the moment fresh stock arrives.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={directWhatsAppInquiry}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask Dispatch Team for ETA on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-mono border transition cursor-pointer ${
                    isDark 
                      ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300' 
                      : 'border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                  }`}
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed`}>
                Select how you'd like to be alerted when this item arrives at our Beirut warehouse:
              </p>

              {/* Notification Channel Selection Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="notify-channel-whatsapp"
                  onClick={() => setContactType('whatsapp')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    contactType === 'whatsapp'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                      : isDark
                        ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp Alert</span>
                </button>

                <button
                  type="button"
                  id="notify-channel-email"
                  onClick={() => setContactType('email')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    contactType === 'email'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 font-semibold'
                      : isDark
                        ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>Email Alert</span>
                </button>
              </div>

              {/* Channel specific inputs */}
              {contactType === 'whatsapp' ? (
                <div className="space-y-1.5">
                  <label htmlFor="notify-whatsapp-phone" className={`block text-[11px] font-mono font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    WhatsApp Phone Number <span className="text-amber-500">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      id="notify-country-code"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`w-32 text-xs font-mono rounded-xl border px-2 py-2 outline-none cursor-pointer ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus:border-emerald-500' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800 focus:border-emerald-500'
                      }`}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.flag})
                        </option>
                      ))}
                    </select>
                    <input
                      id="notify-whatsapp-phone"
                      type="tel"
                      value={phoneDigits}
                      onChange={(e) => setPhoneDigits(e.target.value)}
                      placeholder="e.g. 71 135 241"
                      className={`flex-1 text-xs font-mono rounded-xl border px-3 py-2 outline-none ${
                        isDark 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-emerald-500 placeholder-zinc-600' 
                          : 'bg-white border-zinc-200 text-zinc-900 focus:border-emerald-500 placeholder-zinc-400'
                      }`}
                      required
                    />
                  </div>
                  <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    We will send a single WhatsApp message when this item restocks.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="notify-email-input" className={`block text-[11px] font-mono font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Email Address <span className="text-amber-500">*</span>
                  </label>
                  <input
                    id="notify-email-input"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className={`w-full text-xs font-mono rounded-xl border px-3 py-2 outline-none ${
                      isDark 
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-blue-500 placeholder-zinc-600' 
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-blue-500 placeholder-zinc-400'
                    }`}
                    required
                  />
                  <p className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    We'll email you immediately when inventory is updated.
                  </p>
                </div>
              )}

              {/* Optional Name */}
              <div className="space-y-1.5">
                <label htmlFor="notify-customer-name" className={`block text-[11px] font-mono font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Your Name <span className="text-zinc-500">(Optional)</span>
                </label>
                <input
                  id="notify-customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alaa"
                  className={`w-full text-xs font-mono rounded-xl border px-3 py-2 outline-none ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-600 placeholder-zinc-600' 
                      : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400 placeholder-zinc-400'
                  }`}
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Trust & Privacy notice */}
              <div className={`flex items-center gap-2 text-[10px] font-mono p-2 rounded-lg border ${
                isDark ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero spam guarantee. Used exclusively for this restock notification.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="submit-notify-me-btn"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-tight bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/25 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Alert...</span>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When Available</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
