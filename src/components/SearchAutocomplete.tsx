import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  CornerDownLeft,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Layers,
  Loader2,
  Mic,
  AlertCircle,
  ShoppingCart,
  Check
} from 'lucide-react';
import { Product, Currency } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/currency';
import { debounce } from '../utils/debounce';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../utils/productImages';

interface SearchAutocompleteProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onSelectCategory?: (categoryId: string) => void;
  onAddToCart?: (product: Product) => void;
  currency: Currency;
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
  idPrefix?: string;
}

const RECENT_SEARCHES_KEY = 'on_alaa_recent_searches';
const POPULAR_SEARCHES = [
  'iPhone 16 Pro Max',
  'Samsung Galaxy S25 Ultra',
  'PlayStation 5 Pro',
  'MacBook Pro M3',
  'AirPods Pro 2',
  'Sony WH-1000XM5',
  'DJI Neo Drone',
  'Apple Watch Ultra 2'
];

// Helper to safely retrieve Web Speech API class across browsers
const getSpeechRecognitionClass = () => {
  if (typeof window === 'undefined') return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
};

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  searchQuery,
  onSearchChange,
  products = [],
  onSelectProduct,
  onSelectCategory,
  onAddToCart,
  currency,
  placeholder = 'Search iPhone 16 Pro, S25 Ultra, PS5 Pro, MacBook, Sony...',
  className = '',
  isMobile = false,
  idPrefix = 'header',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedViaSlash, setFocusedViaSlash] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ['iPhone 16 Pro', 'PS5 Pro', 'Galaxy S25'];
    } catch {
      return ['iPhone 16 Pro', 'PS5 Pro', 'Galaxy S25'];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local input state for smooth typing without lag
  const [inputValue, setInputValue] = useState(searchQuery);

  // Keep input value synchronized if searchQuery prop changes externally (e.g. clear, brand click)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounced search logic to execute search query processing only after the user stops typing for 300ms
  const debouncedSearch = useMemo(() => {
    return debounce((query: string) => {
      onSearchChange(query);
      setIsSearching(false);
    }, 300);
  }, [onSearchChange]);

  // Clean up debounced search timer on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Search input change handler with 300ms debouncing utility
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInputValue(nextVal);
    if (!isOpen) setIsOpen(true);
    setSelectedIndex(-1);

    if (nextVal.trim()) {
      setIsSearching(true);
      debouncedSearch(nextVal);
    } else {
      // Immediate reset when input is cleared completely
      debouncedSearch.cancel();
      setIsSearching(false);
      onSearchChange('');
    }
  };

  // Web Speech API Voice-to-Text State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const isSpeechSupported = useMemo(() => Boolean(getSpeechRecognitionClass()), []);

  // Cleanup speech recognition session on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auto-dismiss voice status/error notifications after 4.5 seconds
  useEffect(() => {
    if (speechError) {
      const timer = setTimeout(() => {
        setSpeechError(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [speechError]);

  // Web Speech API Microphone Toggle Handler
  const handleToggleVoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const SpeechAPI = getSpeechRecognitionClass();
    if (!SpeechAPI) {
      setSpeechError('Web Speech API is not supported in this browser. Please try Google Chrome, MS Edge, or Safari.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.warn('Speech recognition stop warning:', err);
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechAPI();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputValue(transcript);
          setIsSearching(true);
          debouncedSearch(transcript);
          if (!isOpen) setIsOpen(true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Web Speech API event error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone permission blocked. Please allow mic access in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak closer to your microphone.');
        } else if (event.error === 'audio-capture') {
          setSpeechError('No microphone hardware detected on this device.');
        } else {
          setSpeechError(`Voice recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        debouncedSearch.flush();
        inputRef.current?.focus();
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start Web Speech API:', err);
      setIsListening(false);
      setSpeechError('Could not activate microphone voice input.');
    }
  };

  // Save query to recent searches
  const saveRecentSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 2) return;
    try {
      const updated = [cleanTerm, ...recentSearches.filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent search', e);
    }
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Global shortcuts ('/' and Ctrl+K / Cmd+K) to focus persistent search bar from anywhere
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      // 1. Slash '/' key shortcut (when user is not inside an existing input field)
      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        setFocusedViaSlash(true);
        setTimeout(() => setFocusedViaSlash(false), 1200);
        return;
      }

      // 2. Cmd+K / Ctrl+K shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Click outside to close auto-suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered results calculations - using active typed inputValue for INSTANT real-time suggestions
  const queryTrimmed = (inputValue || '').trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!queryTrimmed) return [];
    
    // Relevance scoring to bring the best matches to the top immediately as user types
    return products
      .map((p) => {
        const nameLower = (p.name || '').toLowerCase();
        const brandLower = (p.brand || '').toLowerCase();
        const categoryLower = (p.category || '').toLowerCase();
        const tagsLower = (p.tags || []).map((t) => t.toLowerCase());
        const featuresLower = (p.features || []).map((f) => f.toLowerCase());
        
        let score = 0;
        // Exact name prefix
        if (nameLower.startsWith(queryTrimmed)) score += 120;
        else if (nameLower.includes(queryTrimmed)) score += 80;
        
        // Brand matches
        if (brandLower.startsWith(queryTrimmed)) score += 60;
        else if (brandLower.includes(queryTrimmed)) score += 40;

        // Tags & Categories
        if (tagsLower.some((t) => t.startsWith(queryTrimmed))) score += 35;
        else if (tagsLower.some((t) => t.includes(queryTrimmed))) score += 20;

        if (categoryLower.includes(queryTrimmed)) score += 15;
        if (featuresLower.some((f) => f.includes(queryTrimmed))) score += 10;
        
        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)
      .slice(0, 8);
  }, [products, queryTrimmed]);

  const matchingCategories = useMemo(() => {
    if (!queryTrimmed) return [];
    return CATEGORIES.filter(
      (cat) => cat.id !== 'all' && (cat.name.toLowerCase().includes(queryTrimmed) || cat.id.toLowerCase().includes(queryTrimmed))
    ).slice(0, 3);
  }, [queryTrimmed]);

  const matchingBrands = useMemo(() => {
    if (!queryTrimmed) return [];
    const brands = Array.from(new Set(products.map((p) => p.brand)));
    return brands.filter((b) => b.toLowerCase().includes(queryTrimmed)).slice(0, 4);
  }, [products, queryTrimmed]);

  // Total selectable items for keyboard navigation
  const selectableItemsCount = useMemo(() => {
    if (queryTrimmed) {
      return matchingCategories.length + matchingBrands.length + matchingProducts.length;
    }
    return recentSearches.length + POPULAR_SEARCHES.length;
  }, [queryTrimmed, matchingCategories, matchingBrands, matchingProducts, recentSearches]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setSelectedIndex((prev) => (prev < selectableItemsCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : selectableItemsCount - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      debouncedSearch.cancel();
      setIsSearching(false);

      if (selectedIndex >= 0 && (queryTrimmed || inputValue.trim())) {
        // Find which item was selected
        let currentIndex = 0;
        // Check categories
        if (selectedIndex < matchingCategories.length) {
          const cat = matchingCategories[selectedIndex];
          onSelectCategory?.(cat.id);
          saveRecentSearch(cat.name);
          setIsOpen(false);
          return;
        }
        currentIndex += matchingCategories.length;
        // Check brands
        if (selectedIndex < currentIndex + matchingBrands.length) {
          const brand = matchingBrands[selectedIndex - currentIndex];
          setInputValue(brand);
          onSearchChange(brand);
          saveRecentSearch(brand);
          setIsOpen(false);
          return;
        }
        currentIndex += matchingBrands.length;
        // Check products
        if (selectedIndex < currentIndex + matchingProducts.length) {
          const prod = matchingProducts[selectedIndex - currentIndex];
          handleProductClick(prod);
          return;
        }
      }

      // Default Enter: commit currently typed search query immediately without waiting for debounce
      if (inputValue.trim()) {
        onSearchChange(inputValue.trim());
        saveRecentSearch(inputValue.trim());
      }
      setIsOpen(false);
      scrollToCatalog();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleProductClick = (product: Product) => {
    debouncedSearch.cancel();
    setIsSearching(false);
    setInputValue(product.name);
    saveRecentSearch(product.name);
    setIsOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onSearchChange(product.name);
      scrollToCatalog();
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1500);
    } else if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleSuggestionClick = (term: string) => {
    debouncedSearch.cancel();
    setIsSearching(false);
    setInputValue(term);
    onSearchChange(term);
    saveRecentSearch(term);
    setIsOpen(false);
    scrollToCatalog();
  };

  const handleCategoryClick = (catId: string, catName: string) => {
    debouncedSearch.cancel();
    setIsSearching(false);
    saveRecentSearch(catName);
    onSelectCategory?.(catId);
    setIsOpen(false);
    scrollToCatalog();
  };

  const scrollToCatalog = () => {
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog-section') || document.querySelector('main');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Helper to highlight matching characters in real-time with modern vibrant electric blue
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark 
          key={i} 
          className="bg-blue-100 text-blue-700 font-black rounded-xs px-0.5 not-italic"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Icon for category
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'smartphones': return <Smartphone className="w-3.5 h-3.5" />;
      case 'laptops-macbooks': return <Laptop className="w-3.5 h-3.5" />;
      case 'gaming-consoles': return <Gamepad2 className="w-3.5 h-3.5" />;
      case 'audio-sound': return <Headphones className="w-3.5 h-3.5" />;
      case 'smartwatches': return <Watch className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar (Persistent & Always Visible) */}
      <div 
        className={`relative flex items-center w-full transition-all duration-200 rounded-2xl bg-slate-100/90 hover:bg-slate-100 border ${
          isListening
            ? 'bg-white border-red-500 ring-4 ring-red-500/20 shadow-lg shadow-red-500/10'
            : focusedViaSlash
            ? 'bg-white border-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/10 animate-pulse'
            : isOpen
            ? 'bg-white border-blue-500 ring-3 ring-blue-500/15 shadow-md shadow-blue-500/5'
            : 'border-slate-200/90'
        }`}
      >
        <div className="absolute left-3.5 flex items-center pointer-events-none">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="left-search-spinner"
                id={`${idPrefix}-left-spinner`}
                initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="text-blue-600 flex items-center justify-center"
              >
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              </motion.div>
            ) : (
              <motion.div
                key="left-search-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center text-slate-400"
              >
                <Search className={`w-4 h-4 transition-all duration-200 ${
                  isListening 
                    ? 'text-red-500 animate-pulse' 
                    : focusedViaSlash 
                    ? 'text-blue-600 scale-110' 
                    : isOpen 
                    ? 'text-blue-600' 
                    : 'text-slate-400'
                }`} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={inputRef}
          id={`${idPrefix}-search-input`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening... Speak now 🎙️' : placeholder}
          autoComplete="off"
          spellCheck={false}
          className="w-full pl-10 pr-28 sm:pr-32 py-2 sm:py-2.5 text-xs sm:text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
        />

        {/* Right Action Icons: Loading Spinner + Voice Mic Button + Clear Button with fade & rotate + Keyboard Shortcut Badge */}
        <div className="absolute right-2.5 flex items-center gap-1 sm:gap-1.5">
          {/* Subtle loading spinner during search execution */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                key="search-loading-spinner"
                id="header-search-loading-spinner"
                initial={{ opacity: 0, scale: 0.7, x: 4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 4 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-1 text-blue-600 px-1.5 py-0.5 rounded-md bg-blue-50/90 border border-blue-200/80 shadow-2xs"
                title="Processing search query..."
                aria-label="Searching products"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
                <span className="hidden sm:inline text-[10px] font-bold text-blue-700 tracking-tight select-none">
                  Searching
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Web Speech API Microphone Voice Input Button */}
          <button
            type="button"
            id={idPrefix === 'header-desktop' ? 'header-voice-search-btn' : `${idPrefix}-voice-search-btn`}
            onClick={handleToggleVoice}
            className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center relative ${
              isListening
                ? 'bg-red-500 text-white shadow-md shadow-red-500/40 ring-2 ring-red-400 animate-pulse'
                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-200/70'
            }`}
            title={
              isListening
                ? 'Listening... Click to stop voice search'
                : isSpeechSupported
                ? 'Voice search (Web Speech API) - click and speak'
                : 'Voice search not supported in this browser'
            }
            aria-label={isListening ? 'Stop voice search' : 'Search by voice'}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="flex items-center justify-center"
              >
                <Mic className="w-3.5 h-3.5 text-white" />
              </motion.div>
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}

            {/* Pulsing listening indicator ping dot */}
            {isListening && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-ping" />
            )}
          </button>

          {/* Clear Button with subtle fade-in and rotate entrance animation */}
          <AnimatePresence mode="wait">
            {inputValue ? (
              <motion.button
                key="clear-btn"
                type="button"
                id={`${idPrefix}-clear-search-btn`}
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => {
                  debouncedSearch.cancel();
                  setIsSearching(false);
                  setInputValue('');
                  onSearchChange('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              !isMobile && (
                <motion.span
                  key="shortcut-badge"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-white/90 border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs select-none"
                >
                  <kbd className="font-mono bg-slate-100 px-1 py-0.2 rounded border border-slate-200 text-slate-500 font-bold">/</kbd>
                  <span className="text-slate-300">or</span>
                  <kbd className="font-sans">⌘K</kbd>
                </motion.span>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Voice Status / Error Alert Notification */}
      <AnimatePresence>
        {speechError && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-2.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold flex items-center justify-between gap-2 shadow-2xl border border-red-500/40 z-50 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-slate-200">{speechError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Suggestion Floating Dropdown Popover */}
      {isOpen && (
        <div 
          id={`${idPrefix}-suggestions-dropdown`}
          className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-[80vh] sm:max-h-[500px] overflow-y-auto"
        >
          {/* Subtle Top Loading Line indicator when processing */}
          {isSearching && (
            <div className="h-0.5 w-full bg-blue-100 overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 0.85, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-transparent via-blue-600 to-transparent w-3/4"
              />
            </div>
          )}
          {/* STATE A: User has entered a search query */}
          {queryTrimmed ? (
            <div>
              {/* Category & Brand Quick Chips */}
              {(matchingCategories.length > 0 || matchingBrands.length > 0) && (
                <div className="p-3 bg-slate-50/80 border-b border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-blue-600" />
                    <span>Quick Filter Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id, cat.name)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200/80 hover:border-blue-300 transition shadow-2xs cursor-pointer"
                      >
                        {getCategoryIcon(cat.id)}
                        <span>In {cat.name}</span>
                      </button>
                    ))}
                    {matchingBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleSuggestionClick(brand)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 transition shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Brand: {brand}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Product Match List */}
              {matchingProducts.length > 0 ? (
                <div className="p-2 space-y-1">
                  <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-slate-800">Matching Products ({matchingProducts.length})</span>
                      <span className="bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full font-black">
                        LIVE
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">click to view details</span>
                  </div>

                  {matchingProducts.map((product, idx) => {
                    const thumb = getProductImages(product)[0] || product.image || DEFAULT_PRODUCT_IMAGE;
                    const priceUSD = product.promotionalPriceUSD || product.basePriceUSD;
                    const isPromo = Boolean(product.promotionalPriceUSD && product.promotionalPriceUSD < product.basePriceUSD);
                    const isRecentlyAdded = addedProductId === product.id;

                    return (
                      <div
                        key={product.id}
                        id={`search-item-${product.id}`}
                        onClick={() => handleProductClick(product)}
                        className={`group flex items-center gap-3 p-2.5 rounded-xl transition cursor-pointer ${
                          selectedIndex === idx
                            ? 'bg-blue-50/90 border border-blue-200 shadow-xs'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        {/* Product Thumbnail */}
                        <div className="w-13 h-13 rounded-lg bg-white border border-slate-200/90 p-1 shrink-0 overflow-hidden flex items-center justify-center relative">
                          <img
                            src={thumb}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {isPromo && (
                            <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[8px] font-black px-1 rounded">
                              SALE
                            </span>
                          )}
                        </div>

                        {/* Info & Price */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-800">
                              {product.brand}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-500">
                              {product.condition}
                            </span>
                            {product.warranty && (
                              <span className="text-[9px] font-medium text-slate-400 hidden sm:inline">
                                • {product.warranty}
                              </span>
                            )}
                            {product.inStock ? (
                              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 ml-auto sm:ml-0">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>In Stock</span>
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-600">
                                Pre-order
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {highlightMatch(product.name, inputValue)}
                          </h4>

                          <div className="flex items-baseline gap-2 text-xs flex-wrap">
                            <span className="font-extrabold text-blue-600">
                              {formatPrice(priceUSD, currency)}
                            </span>
                            {isPromo && (
                              <span className="text-[10px] text-slate-400 line-through font-mono">
                                {formatPrice(product.basePriceUSD, currency)}
                              </span>
                            )}
                            {currency === 'USD' && (
                              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                                (≈ {Math.round(priceUSD * 89500).toLocaleString()} L.L.)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Instant Quick Add to Cart Button */}
                        <div className="shrink-0 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isRecentlyAdded
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 active:scale-95'
                            }`}
                            title="Add directly to cart"
                          >
                            {isRecentlyAdded ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span className="hidden sm:inline">Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3 h-3" />
                                <span className="hidden sm:inline">ADD</span>
                              </>
                            )}
                          </button>

                          <div className="p-1 rounded-lg text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800">
                      No matching products for "{inputValue}"
                    </div>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Try searching by brand (Apple, Samsung, Sony), chip, or check spelling.
                    </p>
                  </div>

                  {/* Quick Suggestions Pills */}
                  <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
                    {['iPhone 16', 'Galaxy S25', 'PS5 Pro', 'AirPods'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleSuggestionClick(term)}
                        className="text-[10px] font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-full border border-slate-200 transition cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom "View All Results" Bar */}
              <div 
                onClick={() => {
                  saveRecentSearch(inputValue);
                  setIsOpen(false);
                  scrollToCatalog();
                }}
                className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold flex items-center justify-between cursor-pointer border-t border-slate-100 transition"
              >
                <div className="flex items-center gap-2">
                  <CornerDownLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>View full catalog results for "{inputValue}"</span>
                </div>
                <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                  Press Enter ↵
                </span>
              </div>
            </div>
          ) : (
            /* STATE B: Empty query / Focused state with Recent & Trending searches */
            <div className="p-3 sm:p-4 space-y-4">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={clearAllRecent}
                      className="text-[10px] text-slate-400 hover:text-red-500 font-semibold transition cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <span
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer group"
                      >
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-300/60"
                          title="Remove from history"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular / Trending Lebanese Tech Searches */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-[#FF0000]" />
                  <span>Trending Electronics in Lebanon</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {POPULAR_SEARCHES.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleSuggestionClick(query)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition text-left cursor-pointer group"
                    >
                      <span className="truncate">{query}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Lebanese Store Guarantee Note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Agency Sealed & Guaranteed</span>
                </span>
                <span>Jadra Warehouse Store • All-Lebanon Delivery 🚚</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
