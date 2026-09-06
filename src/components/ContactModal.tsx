import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Mail,
  Store
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display">
              On Alaa Store Lebanon
            </h3>
            <p className="text-xs text-slate-500">
              Customer Support, Store Locations & Assistance
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700">
          {/* Main WhatsApp Support */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-900 text-sm block">Live WhatsApp Support</span>
              <span className="text-emerald-700 text-xs font-medium">Quick order booking, price inquiries & live photos</span>
            </div>
            <a
              href="https://wa.me/96171135241?text=Hello%20On%20Alaa%20Store%2C%20I%20need%20assistance"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-700 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>+961 71 135 241</span>
            </a>
          </div>

          {/* Locations */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Warehouse Store & Direct Pickup</strong>
                <p className="text-slate-600 font-medium text-[11px] mt-0.5">
                  Lebanon, Chouf, Jadra Warehouse Store
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Working Hours</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Monday – Saturday: 10:00 AM – 8:30 PM <br />
                  Sunday: Closed (Online Orders & WhatsApp remain active)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Direct Phone Line</strong>
                <p className="text-slate-600 font-medium text-[11px] mt-0.5">
                  +961 71 135 241
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Official Agency Warranty Claims</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Direct drop-off at our Jadra Warehouse Store for official Apple, Samsung & Xiaomi agency servicing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
              <Mail className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block text-xs">Direct Email</strong>
                <p className="text-slate-600 font-medium text-[11px] mt-0.5">
                  alaastoreon@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Coverage Grid */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Lebanon Nationwide Delivery Coverage</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We deliver to all areas across Greater Beirut, Mount Lebanon (Metn, Keserwan, Jounieh, Baabda, Chouf), North (Tripoli, Batroun, Koura), South (Saida, Tyre, Nabatieh), and Bekaa (Zahle, Chtaura).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
