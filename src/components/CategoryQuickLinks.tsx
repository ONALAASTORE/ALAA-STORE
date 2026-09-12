import React, { useRef } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Gamepad2, 
  Zap, 
  Home, 
  Car, 
  Briefcase, 
  Flame,
  Grid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CategoryQuickLinksProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onNavigateToOffers?: () => void;
  discountedCount?: number;
  theme?: 'dark' | 'light';
}

interface QuickCatItem {
  id: string;
  name: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CategoryQuickLinks: React.FC<CategoryQuickLinksProps> = ({
  selectedCategory,
  onSelectCategory,
  onNavigateToOffers,
  discountedCount = 0,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const quickCategories: QuickCatItem[] = [
    { id: 'all', name: 'All Departments', count: '50+ Items', icon: Grid },
    { id: 'smartphones', name: 'Mobiles & Tablets', count: 'iPhones, S25', icon: Smartphone },
    { id: 'laptops', name: 'Laptops & Mac', count: 'Apple M3, RTX', icon: Laptop },
    { id: 'audio', name: 'Audio & ANC', count: 'Sony, Marshall', icon: Headphones },
    { id: 'wearables', name: 'Smartwatches', count: 'Ultra 2, Fit', icon: Watch },
    { id: 'gaming', name: 'Gaming Zone', count: 'PS5 Pro, Wheels', icon: Gamepad2 },
    { id: 'power', name: 'GaN & Power', count: '140W Chargers', icon: Zap },
    { id: 'car-accessories', name: 'Car Electronics', count: 'Mounts, Inverters', icon: Car },
    { id: 'bags-cases', name: 'Cases & Bags', count: 'Armor & Sleeves', icon: Briefcase },
    { id: 'smart-home', name: 'Smart Home & TV', count: 'Security & IoT', icon: Home },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="category-quick-links-section" className="w-full">
      <div className={`rounded-2xl border transition-colors duration-200 p-4 sm:p-5 shadow-xs relative ${
        isDark 
          ? 'bg-[#141418] border-zinc-800' 
          : 'bg-white border-zinc-200'
      }`}>
        {/* Carousel Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-pulse" />
            <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${
              isDark ? 'text-zinc-200' : 'text-zinc-900'
            }`}>
              Shop By Department
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToOffers && (
              <button
                onClick={onNavigateToOffers}
                className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 transition cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Special Offers ({discountedCount})</span>
              </button>
            )}

            {/* Left / Right Carousel Controls */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                  isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                  isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Icon Circles Row (Ishtari trademark circular categories) */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        >
          {quickCategories.map((item) => {
            const isSelected = selectedCategory === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`quick-cat-${item.id}`}
                onClick={() => onSelectCategory(item.id)}
                className={`group flex flex-col items-center gap-2 shrink-0 transition-all cursor-pointer p-1.5 rounded-2xl ${
                  isSelected ? 'scale-102' : 'hover:scale-102'
                }`}
              >
                {/* Circular Container matching Ishtari category circles */}
                <div 
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-lg shadow-[#0066FF]/35 ring-3 ring-[#0066FF]/25'
                      : isDark
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300 group-hover:border-[#0066FF] group-hover:text-[#0066FF] group-hover:bg-zinc-800'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 group-hover:border-[#0066FF] group-hover:text-[#0066FF] group-hover:bg-blue-50/50'
                  }`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:scale-110" />
                </div>

                {/* Category Label and Deals Subtitle */}
                <div className="text-center space-y-0.5">
                  <span 
                    className={`block text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap transition-colors ${
                      isSelected 
                        ? 'text-[#0066FF]' 
                        : isDark ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-800 group-hover:text-[#0066FF]'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className={`block text-[9px] font-mono whitespace-nowrap ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {item.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
