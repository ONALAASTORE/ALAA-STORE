import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Calculator
} from 'lucide-react';
import { LogoAvatar, Brand3DText } from './brand';

interface FooterProps {
  onSelectCategory: (catId: string) => void;
  onOpenTradeIn: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTradeIn,
  onOpenContact,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-16">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Nationwide Lebanon Shipping</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Reliable door-to-door delivery with live driver updates across all Lebanese cities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Agency Certified</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Brand new sealed electronics with official agency warranty stickers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Dual Currency & COD</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pay upon delivery in fresh USD, Lebanese Pounds (LBP), or via Whish Money / OMT.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Device Trade-In Upgrades</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Swap your old smartphone or MacBook with instant credit toward your new purchase.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3.5">
            <LogoAvatar size="lg" withGlow={true} />
            <Brand3DText size="lg" isDarkTheme={true} withLebanonBadge={true} />
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Your premier electronics and smart technology storefront in Lebanon. Supplying original Apple, Samsung, Xiaomi, Sony, Anker, and DJI products at market-competitive prices with agency warranty.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Store Support</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3 text-xs">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Categories</h5>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSelectCategory('smartphones')} className="hover:text-white transition">
                Smartphones & iPhones
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('laptops')} className="hover:text-white transition">
                Laptops & MacBooks
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('audio')} className="hover:text-white transition">
                Audio & Noise-Cancelling
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('wearables')} className="hover:text-white transition">
                Smartwatches & Bands
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('gaming')} className="hover:text-white transition">
                PlayStation & Gaming Gear
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('power')} className="hover:text-white transition">
                Anker GaN Fast Chargers
              </button>
            </li>
          </ul>
        </div>

        {/* Services & Tools */}
        <div className="space-y-3 text-xs">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Services</h5>
          <ul className="space-y-2">
            <li>
              <button onClick={onOpenTradeIn} className="text-amber-400 hover:text-amber-300 font-semibold transition">
                Device Trade-In Calculator
              </button>
            </li>
            <li>
              <button onClick={onOpenContact} className="hover:text-white transition">
                Store Branches & Pickup
              </button>
            </li>
            <li>
              <span className="text-slate-400">Cash on Delivery (COD)</span>
            </li>
            <li>
              <span className="text-slate-400">Whish Money / OMT Payment</span>
            </li>
            <li>
              <span className="text-slate-400">Official Agency Repair Link</span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-3 text-xs">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Contact Us</h5>
          <div className="space-y-2.5 text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Lebanon, Chouf, Jadra Warehouse Store</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+961 71 135 241</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400 shrink-0" />
              <span>alaastoreon@gmail.com</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ON ALAA STORE. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Chouf</span>
            <span>•</span>
            <span>Beirut</span>
            <span>•</span>
            <span>Mount Lebanon</span>
            <span>•</span>
            <span>Tripoli</span>
            <span>•</span>
            <span>Saida</span>
            <span>•</span>
            <span>Bekaa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
