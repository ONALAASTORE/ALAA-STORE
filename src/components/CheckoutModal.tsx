import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  MessageCircle, 
  MapPin, 
  Phone, 
  User, 
  Banknote,
  QrCode,
  Store,
  FileText
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onOrderCompleted: () => void;
}

const LEBANON_REGIONS = [
  'Beirut - Central District & Hamra',
  'Beirut - Achrafieh & Gemmayze',
  'Beirut - Ras Beirut & Verdun',
  'Mount Lebanon - Metn (Jdeideh, Antelias, Sin El Fil, Dbayeh)',
  'Mount Lebanon - Keserwan (Jounieh, Zouk, Kaslik)',
  'Mount Lebanon - Baabda & Hazmieh',
  'Mount Lebanon - Aley & Chouf',
  'North Lebanon - Tripoli, Mina, Koura',
  'North Lebanon - Batroun & Zgharta',
  'South Lebanon - Saida & Jezzine',
  'South Lebanon - Tyre & Nabatieh',
  'Bekaa - Zahle, Chtaura & Bekaa Valley',
  'Bekaa - Baalbek & Hermel'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState(LEBANON_REGIONS[0]);
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod_usd' | 'cod_lbp' | 'whish' | 'omt' | 'usdt'>('cod_usd');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const subtotalUSD = items.reduce((sum, item) => sum + item.selectedVariant.priceUSD * item.quantity, 0);
  const deliveryFeeUSD = deliveryType === 'pickup' ? 0 : subtotalUSD >= 150 ? 0 : 3;
  const totalUSD = subtotalUSD + deliveryFeeUSD;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please provide your full name and Lebanese contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderRef = `OAS-LB-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderSuccess(orderRef);
      setIsSubmitting(false);
      onOrderCompleted();
    }, 800);
  };

  const generateWhatsAppOrderText = (orderRef: string) => {
    return encodeURIComponent(
      `🇱🇧 *ON ALAA STORE - NEW ORDER CONFIRMATION*\n` +
      `*Order Reference:* #${orderRef}\n` +
      `-----------------------------\n` +
      `*Customer:* ${fullName}\n` +
      `*Phone:* ${phone}\n` +
      `*Method:* ${deliveryType === 'delivery' ? `Doorstep Delivery (${region})` : 'Store Pickup (Jadra Warehouse Store)'}\n` +
      `*Address:* ${address || 'N/A'}\n` +
      `*Payment:* ${
        paymentMethod === 'cod_usd' ? 'Cash on Delivery (USD)' :
        paymentMethod === 'cod_lbp' ? 'Cash on Delivery (L.L.)' :
        paymentMethod === 'whish' ? 'Whish Money' :
        paymentMethod === 'omt' ? 'OMT Intra-Lebanon' : 'USDT Crypto'
      }\n` +
      `-----------------------------\n` +
      `*Items:*\n` +
      items.map((it, i) => ` ${i+1}. ${it.product.name} (${it.selectedVariant.name}) x${it.quantity} = $${it.selectedVariant.priceUSD * it.quantity}`).join('\n') +
      `\n-----------------------------\n` +
      `*Total Due:* $${totalUSD} (≈ ${(totalUSD * 89500).toLocaleString()} L.L.)\n` +
      (notes ? `*Notes:* ${notes}\n` : '') +
      `\nPlease confirm stock availability and dispatch time.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {orderSuccess ? (
          /* Order Confirmation Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Order Received Successfully
              </span>
              <h3 className="text-2xl font-black text-slate-900 font-display mt-2">
                Thank you, {fullName}!
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Your order reference code is <strong className="text-blue-600 font-mono">#{orderSuccess}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                <span>Total Due on Arrival</span>
                <span className="text-sm text-blue-600 font-display">${totalUSD} (≈ {(totalUSD * 89500).toLocaleString()} L.L.)</span>
              </div>
              <p><strong>Contact Phone:</strong> {phone}</p>
              <p><strong>Destination:</strong> {deliveryType === 'pickup' ? 'In-Store Pickup (Jadra Warehouse Store)' : `${region} - ${address}`}</p>
              <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={`https://wa.me/96171135241?text=${generateWhatsAppOrderText(orderSuccess)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Order & Live Tracking via WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Order Checkout Form */
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div>
              <h3 className="text-xl font-black text-slate-900 font-display">
                Complete Your Order 🇱🇧
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Fast doorstep delivery all across Lebanon with Cash on Delivery (USD or L.L.)
              </p>
            </div>

            {/* Delivery Type Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Truck className="w-4 h-4 text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold">Doorstep Delivery</div>
                  <div className="text-[10px] text-slate-500">All Lebanon Regions</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                  deliveryType === 'pickup'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Store className="w-4 h-4 text-blue-600" />
                <div className="text-xs">
                  <div className="font-bold">Store Pickup</div>
                  <div className="text-[10px] text-slate-500">Jadra Warehouse Store</div>
                </div>
              </button>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alaa Kassir"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lebanese Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+961 71 135 241"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Governorate Area *
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 bg-white"
                    >
                      {LEBANON_REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Street, Building, Floor & Landmark Details
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Main street, Al-Salam Bldg, 4th floor, near Pharmacy..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Select Preferred Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod_usd')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    paymentMethod === 'cod_usd' ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600 mb-1" />
                  <div>Cash on Delivery ($ USD)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod_lbp')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    paymentMethod === 'cod_lbp' ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-amber-600 mb-1" />
                  <div>Cash on Delivery (L.L.)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('whish')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    paymentMethod === 'whish' ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-purple-600 mb-1" />
                  <div>Whish Money / OMT</div>
                </button>
              </div>
            </div>

            {/* Optional Delivery Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Order Notes / Special Instructions (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before arrival, leave with concierge, package discreetly..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Order Summary & Final Submit */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900 font-display">{formatPrice(subtotalUSD, currency)}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Delivery:</span>
                <span className="font-bold text-emerald-600">
                  {deliveryFeeUSD === 0 ? 'FREE' : formatPrice(deliveryFeeUSD, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <div className="text-right">
                  <span className="text-base text-blue-600 font-display">{formatPrice(totalUSD, currency)}</span>
                  {currency === 'USD' && (
                    <span className="text-[10px] text-slate-500 block font-normal">
                      ≈ {formatPrice(totalUSD, 'LBP')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming Order...' : `Confirm Order ($${totalUSD})`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
