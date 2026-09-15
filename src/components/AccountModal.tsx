import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  Truck, 
  Save,
  Search,
  RefreshCw,
  Clock,
  AlertCircle,
  Database,
  Copy,
  Check,
  Calendar,
  CreditCard,
  ExternalLink,
  Sparkles,
  Layers,
  Phone
} from 'lucide-react';
import { buildWhatsAppLink } from '../utils/phone';
import { FirestoreOrder, OrderStatus } from '../types';
import { 
  fetchOrderByNumber, 
  seedDemoOrdersIfEmpty, 
  getLocalOrders,
  DEMO_ORDERS 
} from '../services/orderService';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
  savedOrdersCount?: number;
  initialTab?: 'profile' | 'orders' | 'support';
  initialOrderNumber?: string;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  whatsappNumber = '+961 71 135 241',
  savedOrdersCount = 0,
  initialTab = 'profile',
  initialOrderNumber = '',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'support'>(initialTab);
  
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
  const [lookupOrderNumber, setLookupOrderNumber] = useState(initialOrderNumber);
  const [orderSearchResult, setOrderSearchResult] = useState<FirestoreOrder | null>(null);
  const [searchSource, setSearchSource] = useState<'firestore' | 'local' | 'not_found' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [recentOrders, setRecentOrders] = useState<FirestoreOrder[]>([]);

  // Seed demo orders into Firestore & load recent orders
  useEffect(() => {
    if (isOpen) {
      seedDemoOrdersIfEmpty().catch(() => {});
      setRecentOrders(getLocalOrders());
      if (initialTab) {
        setActiveTab(initialTab);
      }
      if (initialOrderNumber) {
        setLookupOrderNumber(initialOrderNumber);
        performLookup(initialOrderNumber);
      }
    }
  }, [isOpen, initialTab, initialOrderNumber]);

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

  const performLookup = async (orderNum: string) => {
    const clean = orderNum.trim();
    if (!clean) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const result = await fetchOrderByNumber(clean);
      setOrderSearchResult(result.order);
      setSearchSource(result.source);
      // Refresh local list if saved
      setRecentOrders(getLocalOrders());
    } catch (err) {
      console.warn('Order lookup error:', err);
      setOrderSearchResult(null);
      setSearchSource('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(lookupOrderNumber);
  };

  const handleSelectSampleOrder = (sampleId: string) => {
    setLookupOrderNumber(sampleId);
    performLookup(sampleId);
  };

  const copyTrackingSummary = async () => {
    if (!orderSearchResult) return;
    const summary = `On Alaa Store Order Tracking:
Order Reference: #${orderSearchResult.orderNumber}
Status: ${orderSearchResult.status.toUpperCase()}
Customer: ${orderSearchResult.customerName}
Delivery Region: ${orderSearchResult.deliveryRegion}
Courier: ${orderSearchResult.courier || 'Lebanon Express Network'}
ETA: ${orderSearchResult.estimatedDelivery || 'In Transit'}
Total: $${orderSearchResult.totalUSD} (COD)`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        const ta = document.createElement('textarea');
        ta.value = summary;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery (Courier Assigned)',
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: Truck,
          pulse: true
        };
      case 'processing':
        return {
          label: 'Processing & Packaging',
          bg: 'bg-indigo-500/15',
          text: 'text-indigo-400',
          border: 'border-indigo-500/30',
          dot: 'bg-indigo-400',
          icon: Package,
          pulse: false
        };
      case 'confirmed':
        return {
          label: 'Order Confirmed',
          bg: 'bg-blue-500/15',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          dot: 'bg-blue-400',
          icon: CheckCircle2,
          pulse: false
        };
      case 'delivered':
        return {
          label: 'Delivered & Completed',
          bg: 'bg-teal-500/15',
          text: 'text-teal-400',
          border: 'border-teal-500/30',
          dot: 'bg-teal-400',
          icon: CheckCircle2,
          pulse: false
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: 'bg-rose-500/15',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          dot: 'bg-rose-400',
          icon: AlertCircle,
          pulse: false
        };
      case 'pending':
      default:
        return {
          label: 'Order Received (Pending Verification)',
          bg: 'bg-amber-500/15',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          dot: 'bg-amber-400',
          icon: Clock,
          pulse: false
        };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#16161A] text-white rounded-2xl max-w-2xl w-full border border-zinc-800 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800 bg-[#121214] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Customer Account & Orders</h2>
              <p className="text-xs text-zinc-400">Live Lebanese Express Courier & Firestore Database Tracking</p>
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
        <div className="flex items-center border-b border-zinc-800 px-5 sm:px-6 bg-[#141417] shrink-0">
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
            id="tab-track-order-btn"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order Tracking</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Firestore
            </span>
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

        {/* Modal Body Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* PROFILE TAB */}
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

          {/* ORDER TRACKING TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4 text-left">
              {/* Firestore Connected Badge */}
              <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firestore Order Tracking Database</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-emerald-400">Live Synchronized</span>
                </div>
              </div>

              {/* Order Search Input Form */}
              <form onSubmit={handleOrderLookup} className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-200">
                  Input Order Number to Retrieve Status Update
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="order-tracking-input"
                      type="text"
                      value={lookupOrderNumber}
                      onChange={(e) => setLookupOrderNumber(e.target.value)}
                      placeholder="e.g. OAS-LB-10492 or OAS-LB-20815"
                      className="w-full bg-[#1F1F24] border border-zinc-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none uppercase"
                    />
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    {lookupOrderNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          setLookupOrderNumber('');
                          setOrderSearchResult(null);
                          setHasSearched(false);
                        }}
                        className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300 p-0.5 rounded cursor-pointer"
                        title="Clear input"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    id="track-order-submit-btn"
                    type="submit"
                    disabled={isSearching || !lookupOrderNumber.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer shrink-0"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Track Order</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sample Verified Orders for Instant Demo Testing */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Sample Orders in Firestore Database (Click to Test):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_ORDERS.map((demo) => (
                    <button
                      key={demo.orderNumber}
                      type="button"
                      onClick={() => handleSelectSampleOrder(demo.orderNumber)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                        lookupOrderNumber.toUpperCase() === demo.orderNumber
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                          : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 border-zinc-700/70 hover:text-white'
                      }`}
                    >
                      <span className="font-mono font-bold text-white">{demo.orderNumber}</span>
                      <span className="text-zinc-400">({demo.status === 'out_for_delivery' ? 'Out for Delivery' : demo.status === 'processing' ? 'Processing' : 'Delivered'})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RECENT ORDERS LIST (IF SAVED LOCALLY) */}
              {recentOrders.length > 0 && !orderSearchResult && !isSearching && (
                <div className="bg-[#1A1A20] border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Your Recent Orders on This Device</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">{recentOrders.length} recorded</span>
                  </div>
                  <div className="space-y-2">
                    {recentOrders.slice(0, 3).map((rec) => (
                      <div
                        key={rec.orderNumber}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#141418] border border-zinc-800/80 hover:border-zinc-700 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">{rec.orderNumber}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 capitalize">
                              {rec.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {rec.items?.length || 1} items • ${rec.totalUSD} • {rec.deliveryRegion}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectSampleOrder(rec.orderNumber)}
                          className="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-md font-semibold cursor-pointer transition"
                        >
                          Track Status
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEARCH RESULT: ORDER FOUND IN FIRESTORE */}
              {orderSearchResult && (
                <div className="bg-[#1C1C22] border border-zinc-700 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
                  {/* Result Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-white tracking-wider">
                          #{orderSearchResult.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={copyTrackingSummary}
                          className="text-zinc-400 hover:text-white p-1 rounded transition"
                          title="Copy tracking details"
                        >
                          {copiedTracking ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>Placed: {new Date(orderSearchResult.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </p>
                    </div>

                    {/* Status badge */}
                    {(() => {
                      const badge = getStatusBadge(orderSearchResult.status);
                      const BadgeIcon = badge.icon;
                      return (
                        <div className="flex flex-col items-end gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {badge.pulse && <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`} />}
                            <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
                            <Database className="w-2.5 h-2.5" />
                            <span>Verified in Firestore Database</span>
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Status Banner Message */}
                  {orderSearchResult.statusDescription && (
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
                      <Truck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-300">Latest Dispatch Update:</p>
                        <p className="mt-0.5 text-blue-100/90">{orderSearchResult.statusDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* Visual Stepper / Progress Timeline */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Live Delivery Progress
                    </h4>
                    <div className="bg-[#151518] p-3.5 rounded-xl border border-zinc-800/80 space-y-3">
                      {orderSearchResult.timeline && orderSearchResult.timeline.length > 0 ? (
                        orderSearchResult.timeline.map((event, idx) => {
                          const isLast = idx === orderSearchResult.timeline!.length - 1;
                          return (
                            <div key={idx} className="flex items-start gap-3 relative">
                              {/* Step indicator dot & connecting vertical line */}
                              <div className="flex flex-col items-center shrink-0 mt-0.5">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    event.completed
                                      ? 'bg-emerald-500 text-black'
                                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                  }`}
                                >
                                  {event.completed ? '✓' : idx + 1}
                                </div>
                                {!isLast && (
                                  <div
                                    className={`w-0.5 h-7 my-1 ${
                                      event.completed ? 'bg-emerald-500/40' : 'bg-zinc-800'
                                    }`}
                                  />
                                )}
                              </div>
                              {/* Content */}
                              <div className="flex-1 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className={`font-semibold ${event.completed ? 'text-white' : 'text-zinc-400'}`}>
                                    {event.title}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    {event.timestamp}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                  {event.description}
                                </p>
                                {event.location && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 mt-1 bg-zinc-800/60 px-2 py-0.5 rounded">
                                    <MapPin className="w-2.5 h-2.5 text-zinc-400" />
                                    <span>{event.location}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-zinc-400">Tracking updates are being synchronized with the dispatch courier.</div>
                      )}
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Courier & Delivery Info */}
                    <div className="bg-[#151518] p-3 rounded-xl border border-zinc-800/80 space-y-1.5">
                      <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Courier & Transit Details</span>
                      </div>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Carrier:</strong> {orderSearchResult.courier || 'Lebanon Express Network'}
                      </p>
                      {orderSearchResult.trackingNumber && (
                        <p className="text-zinc-300">
                          <strong className="text-zinc-400">Tracking #:</strong>{' '}
                          <span className="font-mono text-blue-300">{orderSearchResult.trackingNumber}</span>
                        </p>
                      )}
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Estimated Delivery:</strong>{' '}
                        <span className="text-emerald-400 font-semibold">{orderSearchResult.estimatedDelivery || 'Within 24-48 Hours'}</span>
                      </p>
                    </div>

                    {/* Recipient & Destination Info */}
                    <div className="bg-[#151518] p-3 rounded-xl border border-zinc-800/80 space-y-1.5">
                      <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>Destination & Recipient</span>
                      </div>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Recipient:</strong> {orderSearchResult.customerName}
                      </p>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Phone:</strong> {orderSearchResult.customerPhone}
                      </p>
                      <p className="text-zinc-300">
                        <strong className="text-zinc-400">Area:</strong> {orderSearchResult.deliveryRegion}
                      </p>
                      {orderSearchResult.deliveryAddress && (
                        <p className="text-zinc-400 text-[11px] truncate" title={orderSearchResult.deliveryAddress}>
                          {orderSearchResult.deliveryAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ordered Items Breakdown */}
                  {orderSearchResult.items && orderSearchResult.items.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Ordered Items ({orderSearchResult.items.length})</span>
                        </span>
                        <span className="text-blue-400 font-bold">
                          ${orderSearchResult.totalUSD} (COD)
                        </span>
                      </div>
                      <div className="divide-y divide-zinc-800/80 rounded-xl bg-[#151518] border border-zinc-800/80 overflow-hidden">
                        {orderSearchResult.items.map((item, i) => (
                          <div key={i} className="p-2.5 flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-2.5">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-9 h-9 object-contain rounded-md bg-white p-0.5 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-white line-clamp-1">{item.productName}</p>
                                <p className="text-[11px] text-zinc-400">
                                  {item.variantName} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold text-white">${item.totalUSD}</span>
                              <p className="text-[10px] text-zinc-400">${item.unitPriceUSD} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial Total Summary */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-zinc-400">Payment Method:</span>
                      <p className="font-semibold text-white mt-0.5">{orderSearchResult.paymentMethod || 'Cash on Delivery (USD / LBP)'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-400">Total Settlement Due:</span>
                      <p className="text-sm font-black text-emerald-400">
                        ${orderSearchResult.totalUSD} <span className="text-[10px] font-normal text-zinc-400">USD</span>
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        ≈ {(orderSearchResult.totalUSD * 89500).toLocaleString()} L.L.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => performLookup(orderSearchResult.orderNumber)}
                      className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSearching ? 'animate-spin' : ''}`} />
                      <span>Refresh Live Status</span>
                    </button>

                    <a
                      href={buildWhatsAppLink(
                        whatsappNumber,
                        `Hello On Alaa Store! I am checking on my Order #${orderSearchResult.orderNumber} (${orderSearchResult.status}). Customer: ${orderSearchResult.customerName}. Could you provide the latest dispatch update?`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Inquire with Showroom on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* SEARCH RESULT: ORDER NOT FOUND IN FIRESTORE */}
              {hasSearched && !orderSearchResult && !isSearching && (
                <div className="bg-[#1E1617] border border-rose-900/60 rounded-2xl p-5 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Order Not Found in Firestore Database</h4>
                      <p className="text-xs text-rose-200/80 mt-1">
                        We could not find any active order matching <strong className="text-white font-mono font-bold">"{lookupOrderNumber}"</strong> in our live Firestore database.
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-1.5 bg-black/40 p-3 rounded-xl border border-rose-900/30">
                    <p className="font-semibold text-zinc-200">Helpful Suggestions:</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400">
                      <li>Check for typos in your order reference code (format is typically <code className="text-blue-300">OAS-LB-XXXXX</code>).</li>
                      <li>If your order was placed recently over phone or direct WhatsApp message, it may take a few minutes to be synchronized by our dispatch team.</li>
                      <li>You can test with any of our active sample orders above to see live Firestore tracking in action.</li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectSampleOrder('OAS-LB-10492')}
                      className="text-xs text-blue-300 hover:text-blue-200 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer"
                    >
                      Try Sample Order: OAS-LB-10492
                    </button>

                    <a
                      href={buildWhatsAppLink(
                        whatsappNumber,
                        `Hello On Alaa Store! I am looking for my order code "${lookupOrderNumber}", but it is not appearing in the database. Can you check my status manually?`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contact Dispatch Desk on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* DEFAULT INITIAL STATE (BEFORE SEARCH) */}
              {!hasSearched && !orderSearchResult && (
                <div className="p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">Live Order & Courier Tracking</h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Enter your order reference number above to check real-time package status, dispatch milestones, and express courier updates across Lebanon.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectSampleOrder('OAS-LB-10492')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Load Active Demo Order (OAS-LB-10492)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUPPORT TAB */}
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
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
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
