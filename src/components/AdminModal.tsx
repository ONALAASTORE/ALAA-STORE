import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onUpdateProductStock?: (productId: string, inStock: boolean) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'settings'>('inventory');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === 'alaastoreon@gmail.com' && password === 'A123321A') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid admin credentials. Please verify email and password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Login Screen */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                ON ALAA STORE Admin Portal
              </h3>
              <p className="text-xs text-slate-500">
                Private administrative dashboard for inventory and orders management
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer mt-2"
              >
                Access Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  OA
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    ON ALAA STORE • Admin Dashboard 🇱🇧
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authenticated <span className="font-semibold text-emerald-600">• Active Session</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Catalog Inventory</div>
                <div className="text-2xl font-black text-blue-950 font-display mt-1">{products.length} Products</div>
                <div className="text-[10px] text-blue-600 mt-0.5">All synced with official warranties</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Exchange Benchmark</div>
                <div className="text-2xl font-black text-emerald-950 font-display mt-1">89,500 LBP/$</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Lebanese Market Standard</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Delivery Coverage</div>
                <div className="text-2xl font-black text-purple-950 font-display mt-1">Nationwide 🚚</div>
                <div className="text-[10px] text-purple-600 mt-0.5">Beirut, South, North, Bekaa</div>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-bold gap-4">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`pb-2.5 transition border-b-2 ${
                  activeTab === 'inventory' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Product Catalog ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`pb-2.5 transition border-b-2 ${
                  activeTab === 'sales' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Delivery & WhatsApp Orders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-2.5 transition border-b-2 ${
                  activeTab === 'settings' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Store Parameters
              </button>
            </div>

            {/* Inventory List */}
            {activeTab === 'inventory' && (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {products.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{p.brand}</span>
                        <h4 className="font-bold text-slate-900 truncate">{p.name}</h4>
                        <div className="text-slate-500 text-[11px]">
                          Price: <strong className="text-slate-900 font-display">{formatPrice(p.basePriceUSD, currency)}</strong> • {p.condition}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp Orders & Deliveries */}
            {activeTab === 'sales' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Live WhatsApp Order Integration Active</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Customer checkout orders are routed directly to <strong>+961 71 135 241</strong> with complete device specifications, client address, selected governorate, and payment method (Cash USD / LBP / Whish Money).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs">
                  <strong>Delivery Coverage Areas:</strong> Chouf, Jadra, Beirut, Metn, Keserwan, Baabda, Tripoli, Batroun, Koura, Saida, Tyre, Nabatieh, Zahle, Chtaura.
                </div>
              </div>
            )}

            {/* Store Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-700 block">WhatsApp Dispatch Number</span>
                    <span className="font-mono text-slate-900 font-bold">+961 71 135 241</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-700 block">Retail Location</span>
                    <span className="text-slate-900 font-semibold">Lebanon, Chouf, Jadra Warehouse Store</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-700 block">Official Support Email</span>
                    <span className="font-mono text-slate-900 font-bold">alaastoreon@gmail.com</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-700 block">Free Shipping Threshold</span>
                    <span className="text-slate-900 font-bold">$150.00 USD</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
