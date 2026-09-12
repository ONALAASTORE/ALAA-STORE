import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  MapPin, 
  Mail, 
  Calculator
} from 'lucide-react';
import { LogoAvatar, Brand3DText } from './brand';
import { buildWhatsAppLink } from '../utils/phone';

interface FooterProps {
  onSelectCategory?: (catId: string) => void;
  onOpenTradeIn?: () => void;
  onOpenContact?: () => void;
  whatsappNumber?: string;
  supportEmail?: string;
  onNavigateToOffers?: () => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTradeIn,
  onOpenContact,
  whatsappNumber = '+961 71 135 241',
  supportEmail = 'alaastoreon@gmail.com',
  onNavigateToOffers,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  return (
    <footer 
      id="main-footer"
      className={`border-t mt-16 transition-colors font-mono ${
        isDark 
          ? 'bg-zinc-950 text-zinc-400 border-zinc-800/80' 
          : 'bg-[#FFFFFF] text-[#555555] border-zinc-200/80'
      }`}
    >
      {/* Top Value Banner (Technical 4-column strip) */}
      <div className={`border-b py-8 px-4 sm:px-6 ${isDark ? 'border-zinc-800/80' : 'border-zinc-200/80'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-[#0052CC]' : 'border-zinc-200 bg-[#FAFAFA] text-[#0052CC]'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-tight ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
                ALL-LEBANON DISPATCH
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
                Beirut, Tripoli, Saida, Chouf, Bekaa & Mount Lebanon door-to-door courier service.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-[#0052CC]' : 'border-zinc-200 bg-[#FAFAFA] text-[#0052CC]'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-tight ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
                100% AGENCY SEALED
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
                Hardware arrives factory sealed with verified manufacturer agency warranties.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-[#0052CC]' : 'border-zinc-200 bg-[#FAFAFA] text-[#0052CC]'
            }`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-tight ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
                USD / L.L. / WHISH
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
                Pay upon delivery in fresh USD, Lebanese Pounds at live rate, or Whish / OMT.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${
              isDark ? 'border-zinc-800 bg-zinc-900 text-[#0052CC]' : 'border-zinc-200 bg-[#FAFAFA] text-[#0052CC]'
            }`}>
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-tight ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
                TRADE-IN APPRAISAL
              </h4>
              <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
                Trade your used iPhone or MacBook with instant market valuation towards new gear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <LogoAvatar size="md" withGlow={false} />
            <Brand3DText size="sm" isDarkTheme={isDark} withLebanonBadge={true} />
          </div>
          <p className={`text-xs max-w-sm leading-relaxed font-normal ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
            Primary technology portal and distribution hub in Jadra, Chouf, Lebanon. Supplying authorized Apple, Samsung, Xiaomi, Sony, Anker, and DJI products.
          </p>
          <div className="pt-1">
            <a
              href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-micro ${
                isDark 
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700' 
                  : 'border-zinc-200 bg-white text-[#111111] hover:text-[#000000] hover:border-zinc-300 shadow-2xs'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>DIRECT WHATSAPP DESK</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2.5 text-xs">
          <h5 className={`font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
            CATALOG
          </h5>
          <ul className={`space-y-1.5 ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
            {onNavigateToOffers && (
              <li>
                <button 
                  id="footer-offers-category-link"
                  onClick={onNavigateToOffers} 
                  className={`transition-colors cursor-pointer text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}
                >
                  // ARCHIVE OFFERS
                </button>
              </li>
            )}
            <li>
              <button onClick={() => onSelectCategory?.('smartphones')} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // SMARTPHONES
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory?.('laptops')} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // MACBOOKS & LAPTOPS
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory?.('audio')} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // AUDIO & NOISE-CANCELLING
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory?.('wearables')} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // SMARTWATCHES
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory?.('gaming')} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // PLAYSTATION & GAMING
              </button>
            </li>
          </ul>
        </div>

        {/* Services & Tools */}
        <div className="space-y-2.5 text-xs">
          <h5 className={`font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
            SERVICES
          </h5>
          <ul className={`space-y-1.5 ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
            <li>
              <button onClick={onOpenTradeIn} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // TRADE-IN CALCULATOR
              </button>
            </li>
            <li>
              <button onClick={onOpenContact} className={`transition-colors text-left ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                // JADRA WAREHOUSE PICKUP
              </button>
            </li>
            <li>
              <span>// CASH ON DELIVERY (COD)</span>
            </li>
            <li>
              <span>// WHISH MONEY & OMT</span>
            </li>
            <li>
              <span>// AGENCY WARRANTY CLAIM</span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-2.5 text-xs">
          <h5 className={`font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-[#000000]'}`}>
            CONTACT & LOCATION
          </h5>
          <div className={`space-y-2 text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#555555]'}`}>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>Chouf, Jadra Warehouse Hub, Lebanon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#0052CC] shrink-0" />
              <a
                href={buildWhatsAppLink(whatsappNumber, 'Hello On Alaa Store')}
                target="_blank"
                rel="noreferrer"
                className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}
              >
                {whatsappNumber}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <a href={`mailto:${supportEmail}`} className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-[#000000]'}`}>
                {supportEmail}
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Geography Bar */}
      <div className={`border-t py-4 px-4 sm:px-6 text-[10px] ${isDark ? 'border-zinc-900 text-zinc-600' : 'border-zinc-200 text-[#555555]'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} ON ALAA STORE. ENGINEERED FOR SPEED.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>CHOUF</span>
            <span>//</span>
            <span>BEIRUT</span>
            <span>//</span>
            <span>MOUNT LEBANON</span>
            <span>//</span>
            <span>TRIPOLI</span>
            <span>//</span>
            <span>SAIDA</span>
            <span>//</span>
            <span>BEKAA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
