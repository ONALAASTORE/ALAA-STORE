import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  MessageCircle
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
}

const TRADE_IN_DATABASE: Record<string, { models: string[]; baseValues: Record<string, number> }> = {
  Apple: {
    models: [
      'iPhone 15 Pro Max',
      'iPhone 15 Pro',
      'iPhone 15 Plus',
      'iPhone 15',
      'iPhone 14 Pro Max',
      'iPhone 14 Pro',
      'iPhone 14',
      'iPhone 13 Pro Max',
      'iPhone 13 Pro',
      'iPhone 13',
      'iPhone 12 Pro Max',
      'iPhone 12',
      'iPhone 11'
    ],
    baseValues: {
      'iPhone 15 Pro Max': 780,
      'iPhone 15 Pro': 650,
      'iPhone 15 Plus': 520,
      'iPhone 15': 480,
      'iPhone 14 Pro Max': 580,
      'iPhone 14 Pro': 490,
      'iPhone 14': 390,
      'iPhone 13 Pro Max': 440,
      'iPhone 13 Pro': 380,
      'iPhone 13': 310,
      'iPhone 12 Pro Max': 320,
      'iPhone 12': 220,
      'iPhone 11': 160
    }
  },
  Samsung: {
    models: [
      'Galaxy S24 Ultra',
      'Galaxy S24 Plus',
      'Galaxy S24',
      'Galaxy S23 Ultra',
      'Galaxy S23 Plus',
      'Galaxy S23',
      'Galaxy S22 Ultra',
      'Galaxy Z Fold 5',
      'Galaxy Z Flip 5'
    ],
    baseValues: {
      'Galaxy S24 Ultra': 720,
      'Galaxy S24 Plus': 510,
      'Galaxy S24': 420,
      'Galaxy S23 Ultra': 480,
      'Galaxy S23 Plus': 360,
      'Galaxy S23': 290,
      'Galaxy S22 Ultra': 310,
      'Galaxy Z Fold 5': 650,
      'Galaxy Z Flip 5': 380
    }
  },
  Xiaomi: {
    models: [
      'Xiaomi 13 Ultra',
      'Xiaomi 13 Pro',
      'Xiaomi 13T Pro',
      'Xiaomi 12 Pro'
    ],
    baseValues: {
      'Xiaomi 13 Ultra': 460,
      'Xiaomi 13 Pro': 340,
      'Xiaomi 13T Pro': 280,
      'Xiaomi 12 Pro': 210
    }
  }
};

export const TradeInModal: React.FC<TradeInModalProps> = ({
  isOpen,
  onClose,
  currency,
}) => {
  if (!isOpen) return null;

  const [brand, setBrand] = useState<'Apple' | 'Samsung' | 'Xiaomi'>('Apple');
  const [model, setModel] = useState(TRADE_IN_DATABASE['Apple'].models[0]);
  const [storage, setStorage] = useState('256GB');
  const [condition, setCondition] = useState<'flawless' | 'good' | 'fair' | 'cracked'>('flawless');
  const [batteryHealth, setBatteryHealth] = useState('>85%');

  const basePrice = TRADE_IN_DATABASE[brand]?.baseValues[model] || 300;

  // Calculate condition multiplier
  let conditionMultiplier = 1.0;
  if (condition === 'good') conditionMultiplier = 0.9;
  if (condition === 'fair') conditionMultiplier = 0.75;
  if (condition === 'cracked') conditionMultiplier = 0.5;

  // Storage bonus
  let storageBonus = 0;
  if (storage === '256GB') storageBonus = 25;
  if (storage === '512GB') storageBonus = 55;
  if (storage === '1TB') storageBonus = 90;

  const estimatedUSD = Math.round((basePrice + storageBonus) * conditionMultiplier);

  const whatsappTradeInMessage = encodeURIComponent(
    `Hello On Alaa Store! 🇱🇧\nI want to trade-in my device for a new upgrade:\n- Brand: ${brand}\n- Model: ${model}\n- Storage: ${storage}\n- Condition: ${condition.toUpperCase()}\n- Battery Health: ${batteryHealth}\n- Estimated Credit: ~$${estimatedUSD}\n\nPlease let me know how to bring it in or swap with delivery!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              Trade-In Value Estimator 🇱🇧
            </h3>
            <p className="text-xs text-slate-500">
              Instant Lebanese market valuation to upgrade to any new device
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Brand Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">1. Select Brand:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Apple', 'Samsung', 'Xiaomi'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    setModel(TRADE_IN_DATABASE[b].models[0]);
                  }}
                  className={`py-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    brand === b 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">2. Device Model:</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-500 text-xs font-semibold"
            >
              {TRADE_IN_DATABASE[brand].models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Storage Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">3. Storage Capacity:</label>
            <div className="grid grid-cols-4 gap-2">
              {['128GB', '256GB', '512GB', '1TB'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStorage(st)}
                  className={`py-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    storage === st 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Physical Condition */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">4. Physical Condition:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'flawless', label: 'Flawless (No scratches)' },
                { id: 'good', label: 'Good (Minor wear)' },
                { id: 'fair', label: 'Fair (Visible scratches)' },
                { id: 'cracked', label: 'Cracked Glass / Back' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition cursor-pointer ${
                    condition === c.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' 
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Battery Health Selection */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">5. Battery Health (Estimated):</label>
            <div className="grid grid-cols-3 gap-2">
              {['>85% (Healthy)', '80% - 85%', '<80% (Service)'].map((bh) => (
                <button
                  key={bh}
                  type="button"
                  onClick={() => setBatteryHealth(bh)}
                  className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                    batteryHealth === bh
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                  }`}
                >
                  {bh}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Value Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl space-y-2 mt-4">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Estimated Trade-In Credit</span>
              <span className="text-emerald-400">Live Quote</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white font-display">
                {formatPrice(estimatedUSD, currency)}
              </div>
              {currency === 'USD' && (
                <div className="text-xs text-slate-300 font-medium">
                  ≈ {formatPrice(estimatedUSD, 'LBP')}
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
              Apply this direct credit toward purchasing any new iPhone, Samsung, MacBook, or gaming device. Swap on delivery or in-store at our Jadra Warehouse Store!
            </p>
          </div>

          <a
            href={`https://wa.me/96171135241?text=${whatsappTradeInMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Submit Trade-In Request via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
