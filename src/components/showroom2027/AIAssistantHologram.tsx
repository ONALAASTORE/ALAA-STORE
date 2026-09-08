import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  Eye
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { formatPrice } from '../../utils/currency';
import { playHoverBlip, playClickBeep, playHologramActivation, playCartChime } from '../../utils/audio2027';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: Product[];
}

interface AIAssistantHologramProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AIAssistantHologram: React.FC<AIAssistantHologramProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
  isOpen,
  onToggle,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'm1',
      sender: 'ai',
      text: "Greetings! I am Nova, your 2027 Holographic Tech Concierge at ON ALAA STORE. Tell me what you're seeking (e.g. flagship camera, gaming beast, or budget under $500) and I will calibrate the perfect quantum device with official Lebanese warranty.",
      recommendedProducts: products.filter(p => p.isFeatured).slice(0, 2),
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptSuggestions = [
    'Flagship camera phone for 4K video',
    'Best devices under $800',
    'Pro laptop for video editing',
    'PlayStation 5 gaming setup',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    playClickBeep();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate smart AI recommendation search
    setTimeout(() => {
      setIsTyping(false);
      playHologramActivation();

      const lower = query.toLowerCase();
      let matched: Product[] = [];

      if (lower.includes('camera') || lower.includes('photo') || lower.includes('video')) {
        matched = products.filter(p => 
          p.category === 'phones' && (p.specs?.['Rear Camera'] || p.name.includes('Pro') || p.name.includes('Ultra'))
        ).slice(0, 2);
      } else if (lower.includes('under') || lower.includes('cheap') || lower.includes('budget') || lower.includes('800') || lower.includes('500')) {
        matched = products.filter(p => p.basePriceUSD <= 800).slice(0, 2);
      } else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('pc') || lower.includes('editing')) {
        matched = products.filter(p => p.category === 'laptops' || p.category === 'tablets').slice(0, 2);
      } else if (lower.includes('gaming') || lower.includes('playstation') || lower.includes('ps5')) {
        matched = products.filter(p => p.category === 'gaming' || p.name.toLowerCase().includes('playstation')).slice(0, 2);
      } else {
        // Fallback to top rated
        matched = products.filter(p => p.rating >= 4.8).slice(0, 2);
      }

      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I've analyzed your telemetry for "${query}". Here are the top matched quantum hardware models with official Lebanon agency coverage:`,
        recommendedProducts: matched.length > 0 ? matched : products.slice(0, 2),
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 700);
  };

  return (
    <>
      {/* Floating Hologram Orb Launcher Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          type="button"
          onClick={() => {
            playHologramActivation();
            onToggle();
          }}
          onMouseEnter={playHoverBlip}
          className="relative group cursor-pointer"
          aria-label="Open AI Holographic Assistant"
        >
          {/* Hologram projection field emitter below */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#00F0FF] rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Concentric pulsing rings */}
          <div className="w-14 h-14 rounded-full glass-2027 border-2 border-[#00F0FF] flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.5)] group-hover:scale-110 transition-transform">
            <div className="absolute inset-1 rounded-full border border-[#7B2FFF]/50 animate-ping opacity-40 [animation-duration:3s]" />
            <Bot className="w-7 h-7 text-[#00F0FF] animate-pulse" />

            {/* AI badge */}
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-[9px] font-black text-slate-950 font-mono shadow-md">
              AI 2027
            </span>
          </div>
        </button>
      </div>

      {/* Holographic AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[92vw] sm:w-[420px] h-[580px] rounded-3xl glass-2027 border border-[#00F0FF]/50 shadow-[0_0_50px_rgba(0,240,255,0.35)] flex flex-col overflow-hidden text-white"
          >
            {/* Hologram Header with Avatar Projection */}
            <div className="px-5 py-3.5 border-b border-white/10 glass-2027 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Holographic Avatar Orb */}
                <div className="relative w-10 h-10 rounded-full glass-2027 border border-[#00F0FF] flex items-center justify-center shadow-[0_0_15px_#00F0FF]">
                  <Bot className="w-5 h-5 text-[#00F0FF]" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00F0FF] border border-slate-950 animate-ping" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Nova Hologram AI</span>
                    <Sparkles className="w-3 h-3 text-[#FFD700]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#00F0FF] block">
                    Online // Neural Storefront Assistant
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggle}
                className="w-8 h-8 rounded-full glass-2027 hover:border-rose-500 hover:text-rose-400 flex items-center justify-center text-slate-400 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'glass-2027 border border-white/15 text-slate-200 rounded-bl-none shadow-md leading-relaxed'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Recommended Products Carousel Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-2.5 space-y-2 w-full">
                      {msg.recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl glass-2027 border border-[#00F0FF]/30 hover:border-[#00F0FF] transition shadow-md"
                        >
                          <div 
                            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                            onClick={() => onSelectProduct(p)}
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-contain shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-white text-xs block truncate">{p.name}</span>
                              <span className="text-[11px] font-black text-gradient-gold">
                                {formatPrice(p.basePriceUSD, currency)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onSelectProduct(p)}
                              className="p-1.5 rounded-lg glass-2027 text-slate-300 hover:text-white"
                              title="Inspect Specs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playCartChime();
                                onAddToCart(p);
                              }}
                              className="p-1.5 rounded-lg bg-[#00F0FF] text-slate-950 font-bold hover:brightness-110"
                              title="Add to Smart Cart"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                  <Bot className="w-3.5 h-3.5 text-[#00F0FF] animate-spin" />
                  <span>Nova is scanning hardware telemetry...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Query Pills */}
            <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {promptSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-2.5 py-1 rounded-full glass-2027 hover:border-[#00F0FF] text-[10px] text-slate-300 hover:text-[#00F0FF] whitespace-nowrap transition cursor-pointer shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-white/10 glass-2027 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask Nova anything about specs, prices, models..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder:text-slate-500 text-xs focus:border-[#00F0FF] focus:outline-none"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#7B2FFF] text-slate-950 flex items-center justify-center hover:brightness-110 disabled:opacity-40 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
