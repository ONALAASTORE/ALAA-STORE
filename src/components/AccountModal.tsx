import React, { useState } from 'react';
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  Truck, 
  Save
} from 'lucide-react';
import { buildWhatsAppLink } from '../utils/phone';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  savedOrdersCount?: number;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber = '+961 71 135 241',
  savedOrdersCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'support'>('profile');
  
  // Local profile state persisted in localStorage
  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem('on_alaa_user_name') || '';
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return localStorage.getItem('on_alaa_user_phone') || '';
  });
  const [city, setCity] = useState(() => {
    return localStorage.getItem('on_alaa_user_city') || 'Beirut';
  });
  const [address, setAddress] = useState(() => {
    return localStorage.getItem('on_alaa_user_address') || '';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Order lookup state
  const [lookupOrderNumber, setLookupOrderNumber] = useState('');
  const [orderSearchResult, setOrderSearchResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('on_alaa_user_name', fullName);
      localStorage.setItem('on_alaa_user_phone', phoneNumber);
      localStorage.setItem('on_alaa_user_city', city);
      localStorage.setItem('on_alaa_user_address', address);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupOrderNumber.trim()) return;
    
    // Simulate real courier dispatch status (Ishtari / Wakilni / Aramex Lebanon model)
    const simulatedOrders = [
      {
        id: lookupOrderNumber.trim().toUpperCase(),
        status: 'Out for Delivery (Express Courier)',
        courier: 'Lebanon Express Network',
        eta: 'Today before 6:00 PM',
        payment: 'Cash on Delivery (COD)',
        location: city || 'Greater Beirut & Suburbs',
        items: '1x Flagship Electronics Package (Agency Sealed)',
      }
    ];
    setOrderSearchResult(simulatedOrders[0]);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#16161A] text-white rounded-2xl max-w-xl w-full border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#121214]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Customer Account & Orders</h2>
              <p className="text-xs text-zinc-400">ON-ALAA-STORE Customer Service & Express Lebanon Delivery</p>
            </div>
          </div>
          <button
            id="close-account-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="flex items-center border-b border-zinc-800 px-6 bg-[#141417]">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Order</span>
            {savedOrdersCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {savedOrdersCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('support')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'support'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>VIP Support</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Save your delivery address for one-click orders with Cash on Delivery (USD/LBP) anywhere in Lebanon.</span>
              </div>

              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alaa Kanso"
                    className="w-full bg-[#1F1F24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+961 71 123 456"
                      className="w-full bg-[#1F1F24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">City / Region (Lebanon)</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#1F1F24] border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Beirut">Beirut (All Districts)</option>
                      <option value="Mount Lebanon">Mount Lebanon (Metn, Keserwan, Baabda, Chouf)</option>
                      <option value="Tripoli & North">Tripoli & North Lebanon</option>
                      <option value="Saida & South">Saida, Tyre & South Lebanon</option>
                      <option value="Zahle & Bekaa">Zahle, Chtaura & Bekaa Valley</option>
                      <option value="Nabatieh">Nabatieh & Marjeyoun</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Exact Street Address / Building</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Building name, Floor, Nearest landmark"
                    className="w-full bg-[#1F1F24] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wide px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved successfully!</span>
                  </span>
                )}
              </div>
            </form>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <form onSubmit={handleOrderLookup} className="space-y-3">
                <label className="block text-xs font-medium text-zinc-300">
                  Enter Order Number or Tracking Code (e.g. OAS-2026-X)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lookupOrderNumber}
                    onChange={(e) => setLookupOrderNumber(e.target.value)}
                    placeholder="Enter order reference number..."
                    className="flex-1 bg-[#1F1F24] border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Track
                  </button>
                </div>
              </form>

              {orderSearchResult ? (
                <div className="bg-[#1C1C22] border border-zinc-700 rounded-xl p-4 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">{orderSearchResult.id}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>{orderSearchResult.status}</span>
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 space-y-1">
                    <p><strong>Courier:</strong> {orderSearchResult.courier}</p>
                    <p><strong>Expected Delivery:</strong> {orderSearchResult.eta}</p>
                    <p><strong>Payment:</strong> {orderSearchResult.payment}</p>
                    <p><strong>Destination:</strong> {orderSearchResult.location}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-end">
                    <a
                      href={buildWhatsAppLink(whatsappNumber, `Hello On Alaa Store, I am inquiring about Order #${orderSearchResult.id}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl space-y-2">
                  <Package className="w-8 h-8 mx-auto text-zinc-600" />
                  <p className="text-xs text-zinc-400">Track any order placed via website or WhatsApp.</p>
                  <p className="text-[11px] text-zinc-500">Need immediate help? Contact our dispatch desk on WhatsApp below.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-4 text-left">
              <div className="bg-[#1C1C22] border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Direct WhatsApp VIP Desk</span>
                </div>
                <p className="text-xs text-zinc-300">
                  Chat directly with our showroom team for instant stock checks, custom orders, trade-in valuations, and delivery tracking.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store! I need assistance with an inquiry or order.')}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp ({whatsappNumber})</span>
                  </a>
                </div>
              </div>

              <div className="bg-[#1C1C22] border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 space-y-2">
                <div className="font-semibold text-zinc-200">Store Hours & Delivery Timeframe:</div>
                <p>• Monday to Saturday: 9:30 AM – 8:30 PM</p>
                <p>• Beirut & Mount Lebanon: Same-day / 24h Express Delivery</p>
                <p>• North, South & Bekaa: 24-48 Hours Express Delivery</p>
                <p>• Payment: Cash on Delivery (COD) in USD or Lebanese Pounds</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
