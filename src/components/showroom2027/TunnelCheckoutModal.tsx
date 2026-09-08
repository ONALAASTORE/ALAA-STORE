import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Sparkles, 
  Tag, 
  MessageCircle, 
  ArrowRight,
  MoveRight
} from 'lucide-react';
import { CartItem, Currency, StoreSettings } from '../../types';
import { formatPrice } from '../../utils/currency';
import { buildWhatsAppLink } from '../../utils/phone';
import { 
  playClickBeep, 
  playHologramActivation, 
  playWarpConfirmation 
} from '../../utils/audio2027';

interface TunnelCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  storeSettings: StoreSettings;
  onClearCart: () => void;
}

export const TunnelCheckoutModal: React.FC<TunnelCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  storeSettings,
  onClearCart,
}) => {
  if (!isOpen) return null;

  // Tunnel Chambers: 0: Items, 1: Coordinates, 2: Gesture & Payment, 3: Hologram Confirmation
  const [currentRoom, setCurrentRoom] = useState<number>(0);

  // Form coordinates
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cityRegion, setCityRegion] = useState('Beirut (Central & Suburbs)');
  const [addressDetails, setAddressDetails] = useState('');

  // Coupon state
  const [couponApplied, setCouponApplied] = useState(false);

  // Swipe-to-confirm state
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.selectedVariant.priceUSD * item.quantity, 0);
  const deliveryUSD = couponApplied ? 0 : 5;
  const totalUSD = subtotalUSD + deliveryUSD;

  // Slide to confirm drag handler
  const handleSliderDrag = (_: unknown, info: { point: { x: number }; offset: { x: number } }) => {
    if (info.offset.x > 180 && !isOrderConfirmed) {
      confirmOrder();
    }
  };

  const confirmOrder = () => {
    playWarpConfirmation();
    const generatedId = `ALAA-2027-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setIsOrderConfirmed(true);
    setCurrentRoom(3);
    onClearCart();
  };

  const nextRoom = () => {
    playHologramActivation();
    setCurrentRoom((prev) => Math.min(prev + 1, 3));
  };

  const prevRoom = () => {
    playClickBeep();
    setCurrentRoom((prev) => Math.max(prev - 1, 0));
  };

  // WhatsApp Order payload
  const whatsappUrl = React.useMemo(() => {
    const summaryLines = cartItems.map(item => 
      `• ${item.quantity}x ${item.product.name} (${item.selectedVariant.name}) - $${item.selectedVariant.priceUSD * item.quantity}`
    ).join('\n');

    const message = 
`🚀 *ON ALAA STORE — 2027 QUANTUM ORDER*
Ref: *#${orderId || 'ALAA-2027-EXP'}*

👤 *Customer:* ${customerName || 'Valued Client'}
📞 *Phone:* ${customerPhone || 'Not provided'}
📍 *Region:* ${cityRegion}
🏠 *Coordinates:* ${addressDetails || 'Direct Dispatch'}

📦 *Acquired Items:*
${summaryLines}

💰 *Total USD:* $${totalUSD} (LBP ${Number(totalUSD * storeSettings.exchangeRateLBP).toLocaleString()})
🚚 *Status:* Priority Lebanese Dispatch Requested`;

    return buildWhatsAppLink(storeSettings.whatsappNumber, message);
  }, [cartItems, customerName, customerPhone, cityRegion, addressDetails, totalUSD, storeSettings.exchangeRateLBP, storeSettings.whatsappNumber, orderId]);

  const chambers = [
    { title: 'Quantum Items Matrix', icon: Layers },
    { title: 'Spatial Coordinates', icon: MapPin },
    { title: 'Gesture Authorization', icon: CreditCard },
    { title: 'Order Hologram Sealed', icon: CheckCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, z: -100 }}
        animate={{ opacity: 1, scale: 1.0, z: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl h-[90vh] max-h-[760px] rounded-3xl glass-2027 border border-[#00F0FF]/40 shadow-[0_0_70px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3D Tunnel Progress Indicator Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-2027 border border-[#00F0FF]/50 flex items-center justify-center text-[#00F0FF]">
              <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest block">
                3D Tunnel Checkout Chamber {currentRoom + 1} of 4
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {chambers[currentRoom].title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step Pipeline Pills */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2">
              {chambers.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentRoom 
                      ? 'w-8 bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] shadow-[0_0_10px_#00F0FF]' 
                      : idx < currentRoom 
                        ? 'w-4 bg-[#00F0FF]/70' 
                        : 'w-3 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full glass-2027 hover:border-rose-500 hover:text-rose-400 flex items-center justify-center text-slate-400 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CHAMBER ROOM VIEWS (3D Tunnel Perspective Transition)
           ========================================================================= */}
        <div className="relative flex-1 p-6 sm:p-8 overflow-y-auto preserve-3d">
          <AnimatePresence mode="wait">
            
            {/* ---------------- ROOM 1: QUANTUM CART MATRIX ---------------- */}
            {currentRoom === 0 && (
              <motion.div
                key="room-0"
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-bold text-white">Verify Quantum Payload</h4>
                  <p className="text-xs text-slate-300">
                    Your selected items floating ready for Lebanese nationwide dispatch.
                  </p>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-12 glass-2027 rounded-2xl border border-white/10 space-y-3">
                    <p className="text-sm text-slate-400">Your smart cart has zero payload items.</p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] font-bold text-xs"
                    >
                      Return to Showroom
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedVariant.id}`}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl glass-2027 border border-white/10 hover:border-[#00F0FF]/40 transition shadow-lg"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 object-contain shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-white truncate">{item.product.name}</h5>
                            <span className="text-xs text-[#00F0FF] font-mono block truncate">
                              {item.selectedVariant.name}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-gradient-gold">
                            {formatPrice(item.selectedVariant.priceUSD * item.quantity, currency)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal Preview */}
                <div className="p-4 rounded-2xl glass-2027 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 uppercase">Subtotal Payload</span>
                  <span className="text-lg font-black text-gradient-gold">
                    {formatPrice(subtotalUSD, currency)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* ---------------- ROOM 2: SPATIAL COORDINATES ---------------- */}
            {currentRoom === 1 && (
              <motion.div
                key="room-1"
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 max-w-xl mx-auto"
              >
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-bold text-white">Spatial Delivery Coordinates</h4>
                  <p className="text-xs text-slate-300">
                    Fast courier delivery across all Lebanon regions.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alaa Kassir"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-2027 border border-white/20 text-white placeholder:text-slate-500 text-sm focus:border-[#00F0FF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Lebanese Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +961 71 123 456"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-2027 border border-white/20 text-white placeholder:text-slate-500 text-sm focus:border-[#00F0FF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Province / City Region *
                    </label>
                    <select
                      value={cityRegion}
                      onChange={(e) => setCityRegion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-2027 border border-white/20 text-white text-sm focus:border-[#00F0FF] focus:outline-none bg-[#0A0F1E]"
                    >
                      <option value="Beirut (Central & Suburbs)">Beirut (Central & Suburbs)</option>
                      <option value="Mount Lebanon (Keserwan, Jbeil, Metn, Chouf)">Mount Lebanon (Keserwan, Jbeil, Metn, Chouf)</option>
                      <option value="North Lebanon (Tripoli, Koura, Batroun, Zgharta)">North Lebanon (Tripoli, Koura, Batroun, Zgharta)</option>
                      <option value="South Lebanon (Saida, Tyre, Nabatieh, Jezzine)">South Lebanon (Saida, Tyre, Nabatieh, Jezzine)</option>
                      <option value="Bekaa (Zahle, Chtaura, Baalbek, West Bekaa)">Bekaa (Zahle, Chtaura, Baalbek, West Bekaa)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Detailed Street Address & Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="Street, Building, Floor or Landmark"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-2027 border border-white/20 text-white placeholder:text-slate-500 text-sm focus:border-[#00F0FF] focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---------------- ROOM 3: GESTURE MATRIX & PAYMENT ---------------- */}
            {currentRoom === 2 && (
              <motion.div
                key="room-2"
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div className="text-center space-y-1">
                  <h4 className="text-xl font-bold text-white">Gesture Authorization Matrix</h4>
                  <p className="text-xs text-slate-300">
                    Interactive gesture checkout. Drag coupon to apply, then swipe to authorize.
                  </p>
                </div>

                {/* Drag-to-Apply Coupon Interactive Slot */}
                <div className="p-4 rounded-2xl glass-2027 border border-[#00F0FF]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#00F0FF] uppercase flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Quantum Coupon Node</span>
                    </span>
                    {couponApplied && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                        FREE LEBANON DELIVERY APPLIED
                      </span>
                    )}
                  </div>

                  {!couponApplied ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-dashed border-white/20">
                      {/* Draggable Coupon Token */}
                      <motion.div
                        drag
                        dragConstraints={{ left: 0, right: 120, top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 80) {
                            playWarpConfirmation();
                            setCouponApplied(true);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-950 font-mono text-xs font-black cursor-grab active:cursor-grabbing shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center gap-1.5"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>DRAG: GALAXY2027</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>

                      <div className="text-center sm:text-right">
                        <button
                          type="button"
                          onClick={() => {
                            playWarpConfirmation();
                            setCouponApplied(true);
                          }}
                          className="text-[11px] text-[#00F0FF] underline hover:text-white font-mono"
                        >
                          Or click here to apply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Coupon &quot;GALAXY2027&quot; active — $5 delivery charge waived!</span>
                    </div>
                  )}
                </div>

                {/* Cost Matrix Breakdown */}
                <div className="p-4 rounded-2xl glass-2027 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Hardware Payload Total:</span>
                    <span className="font-mono font-bold">${subtotalUSD}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Lebanon Priority Courier:</span>
                    <span className="font-mono font-bold">
                      {couponApplied ? <s className="text-slate-500">$5</s> : '$5'} {couponApplied && <span className="text-emerald-400">FREE</span>}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Total Amount Due:</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-gradient-gold block">
                        ${totalUSD}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ≈ {(totalUSD * storeSettings.exchangeRateLBP).toLocaleString()} LBP (Cash on Delivery)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gesture: Swipe-to-Confirm Slider */}
                <div className="space-y-2 pt-2">
                  <span className="block text-center text-xs font-mono text-[#00F0FF] uppercase tracking-wider">
                    Gesture Authorization: Slide to Confirm Order
                  </span>

                  <div className="relative w-full h-14 rounded-2xl glass-2027 border border-[#00F0FF]/50 flex items-center p-1.5 overflow-hidden shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                    {/* Background track text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-black tracking-widest text-slate-400 uppercase">
                      <span>Slide Right to Transmit &gt;&gt;&gt;</span>
                    </div>

                    {/* Draggable glowing authorization thumb */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 280 }}
                      dragElastic={0.1}
                      onDrag={handleSliderDrag}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 180) {
                          confirmOrder();
                        }
                      }}
                      className="relative z-10 w-12 h-11 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_20px_#00F0FF]"
                    >
                      <MoveRight className="w-5 h-5 font-black" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---------------- ROOM 4: ORDER CONFIRMATION HOLOGRAPH ---------------- */}
            {currentRoom === 3 && (
              <motion.div
                key="room-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 max-w-lg mx-auto text-center py-4"
              >
                {/* Hologram Verified Seal */}
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00F0FF] animate-ping opacity-30 [animation-duration:3s]" />
                  <div className="w-20 h-20 rounded-full glass-2027 border-2 border-[#00F0FF] shadow-[0_0_30px_#00F0FF] flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-[#00F0FF]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#FFD700] uppercase tracking-widest block">
                    Order Sealed & Teleported
                  </span>
                  <h4 className="text-2xl font-black text-white">
                    Order Ref: #{orderId}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you {customerName || 'valuable client'}! Your tech order has been registered for express dispatch to {cityRegion}.
                  </p>
                </div>

                {/* WhatsApp Dispatch Button */}
                <div className="pt-2 space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Confirm Directly on WhatsApp Express</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl glass-2027 hover:border-white/40 text-xs font-bold text-slate-300 hover:text-white transition"
                  >
                    Return to 2027 Showroom
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Navigation Dock */}
        {currentRoom < 3 && (
          <div className="px-6 py-4 border-t border-white/10 glass-2027 flex items-center justify-between z-20">
            {currentRoom > 0 ? (
              <button
                type="button"
                onClick={prevRoom}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-2027 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chamber</span>
              </button>
            ) : (
              <div />
            )}

            {currentRoom < 2 ? (
              <button
                type="button"
                onClick={nextRoom}
                disabled={cartItems.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 text-xs sm:text-sm font-black hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer disabled:opacity-50"
              >
                <span>Proceed to Chamber {currentRoom + 2}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}

      </motion.div>
    </div>
  );
};
