import React, { useState, useMemo } from 'react';
import { 
  Monitor, 
  Cpu, 
  Camera, 
  BatteryCharging, 
  Wifi, 
  ShieldCheck, 
  Layers, 
  ChevronDown, 
  Sliders,
  Maximize2,
  Minimize2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpecsAccordionProps {
  specs: Record<string, string>;
  productName?: string;
  className?: string;
}

interface SpecCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
  keywords: string[];
  items: { key: string; value: string }[];
}

const CATEGORY_DEFINITIONS = [
  {
    id: 'display',
    title: 'Display & Screen',
    icon: Monitor,
    accentColor: {
      bg: 'bg-blue-50/80',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      badgeBg: 'bg-blue-100 text-blue-800'
    },
    keywords: ['display', 'screen', 'oled', 'amoled', 'retina', 'resolution', 'refresh rate', 'hz', 'brightness', 'nits', 'glass']
  },
  {
    id: 'performance',
    title: 'Processor & Hardware',
    icon: Cpu,
    accentColor: {
      bg: 'bg-purple-50/80',
      text: 'text-purple-700',
      border: 'border-purple-200/80',
      badgeBg: 'bg-purple-100 text-purple-800'
    },
    keywords: ['processor', 'chip', 'cpu', 'gpu', 'ram', 'memory', 'storage', 'bionic', 'snapdragon', 'tensor', 'os', 'operating system', 'hardware']
  },
  {
    id: 'camera',
    title: 'Camera System',
    icon: Camera,
    accentColor: {
      bg: 'bg-rose-50/80',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      badgeBg: 'bg-rose-100 text-rose-800'
    },
    keywords: ['camera', 'rear camera', 'front camera', 'main camera', 'telephoto', 'ultra-wide', 'zoom', 'megapixels', 'mp', 'lens', 'video', 'recording']
  },
  {
    id: 'battery',
    title: 'Battery & Charging',
    icon: BatteryCharging,
    accentColor: {
      bg: 'bg-amber-50/80',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      badgeBg: 'bg-amber-100 text-amber-800'
    },
    keywords: ['battery', 'charging', 'mah', 'watt', 'magsafe', 'wireless charging', 'fast charging', 'endurance', 'usb-c', 'power']
  },
  {
    id: 'connectivity',
    title: 'Connectivity & Network',
    icon: Wifi,
    accentColor: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      badgeBg: 'bg-emerald-100 text-emerald-800'
    },
    keywords: ['sim', 'esim', '5g', '4g', 'lte', 'wi-fi', 'wifi', 'bluetooth', 'nfc', 'network', 'bands', 'gps', 'cellular', 'ports']
  },
  {
    id: 'build',
    title: 'Build, Durability & Warranty',
    icon: ShieldCheck,
    accentColor: {
      bg: 'bg-sky-50/80',
      text: 'text-sky-700',
      border: 'border-sky-200/80',
      badgeBg: 'bg-sky-100 text-sky-800'
    },
    keywords: ['water', 'ip68', 'ip67', 'resistance', 'durability', 'titanium', 'aluminum', 'weight', 'dimensions', 'warranty', 'condition', 'package', 'in the box']
  }
];

export const SpecsAccordion: React.FC<SpecsAccordionProps> = ({
  specs,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Group specs into defined categories + catch-all for remaining
  const categories = useMemo<SpecCategory[]>(() => {
    if (!specs || Object.keys(specs).length === 0) return [];

    const entries = Object.entries(specs);
    const assignedKeys = new Set<string>();

    const categorizedList: SpecCategory[] = CATEGORY_DEFINITIONS.map(def => {
      const items: { key: string; value: string }[] = [];

      entries.forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();
        const matches = def.keywords.some(keyword => lowerKey.includes(keyword));

        if (matches && !assignedKeys.has(key)) {
          items.push({ key, value });
          assignedKeys.add(key);
        }
      });

      return {
        ...def,
        items
      };
    }).filter(cat => cat.items.length > 0);

    // Any specs that did not match predefined categories
    const unassignedItems = entries
      .filter(([key]) => !assignedKeys.has(key))
      .map(([key, value]) => ({ key, value }));

    if (unassignedItems.length > 0) {
      categorizedList.push({
        id: 'general',
        title: 'Additional Specifications',
        icon: Layers,
        accentColor: {
          bg: 'bg-slate-50/80',
          text: 'text-slate-700',
          border: 'border-slate-200/80',
          badgeBg: 'bg-slate-200 text-slate-800'
        },
        keywords: [],
        items: unassignedItems
      });
    }

    return categorizedList;
  }, [specs]);

  // Track which category accordions are open
  // Default: Open the first category to keep content concise while immediately informative
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(() => {
    if (categories.length > 0) {
      return new Set([categories[0].id]);
    }
    return new Set<string>();
  });

  const toggleCategory = (id: string) => {
    setOpenCategoryIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenCategoryIds(new Set(categories.map(c => c.id)));
  };

  const collapseAll = () => {
    setOpenCategoryIds(new Set());
  };

  const allExpanded = categories.length > 0 && openCategoryIds.size === categories.length;

  // Filter categories and items based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();

    return categories
      .map(cat => {
        const matchingItems = cat.items.filter(
          item => item.key.toLowerCase().includes(query) || item.value.toLowerCase().includes(query)
        );
        return {
          ...cat,
          items: matchingItems
        };
      })
      .filter(cat => cat.items.length > 0);
  }, [categories, searchQuery]);

  // If searching, automatically expand matching categories
  const effectiveOpenIds = useMemo(() => {
    if (searchQuery.trim()) {
      return new Set(filteredCategories.map(c => c.id));
    }
    return openCategoryIds;
  }, [searchQuery, filteredCategories, openCategoryIds]);

  const totalSpecsCount = Object.keys(specs || {}).length;

  if (totalSpecsCount === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
        <Sliders className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="font-semibold">Detailed specifications will be updated soon for this item.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} id="product-specs-accordion-container">
      {/* Header bar with total counter, search input, and Expand/Collapse All buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            Specifications Overview
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
            {totalSpecsCount} {totalSpecsCount === 1 ? 'spec' : 'specs'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search Filter */}
          {totalSpecsCount > 4 && (
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Toggle All Button */}
          <button
            type="button"
            onClick={allExpanded ? collapseAll : expandAll}
            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shrink-0"
            title={allExpanded ? 'Collapse all accordion sections' : 'Expand all accordion sections'}
          >
            {allExpanded ? (
              <>
                <Minimize2 className="w-3 h-3 text-slate-500" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 text-slate-500" />
                <span>Expand All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion Categories List */}
      <div className="space-y-2.5">
        {filteredCategories.map((category) => {
          const isOpen = effectiveOpenIds.has(category.id);
          const Icon = category.icon;
          const firstItemSnippet = category.items[0]?.value;

          return (
            <div
              key={category.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden bg-white ${
                isOpen 
                  ? 'border-slate-300/90 shadow-2xs' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Accordion Header / Trigger Button */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left transition-colors hover:bg-slate-50/70 cursor-pointer select-none"
                aria-expanded={isOpen}
                aria-controls={`specs-section-${category.id}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${category.accentColor.bg} ${category.accentColor.border}`}>
                    <Icon className={`w-3.5 h-3.5 ${category.accentColor.text}`} />
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800 truncate">
                        {category.title}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${category.accentColor.badgeBg}`}>
                        {category.items.length}
                      </span>
                    </div>

                    {/* Collapsed Preview Line */}
                    {!isOpen && firstItemSnippet && (
                      <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md mt-0.5">
                        {category.items[0].key}: {firstItemSnippet}
                      </p>
                    )}
                  </div>
                </div>

                {/* Chevron Indicator */}
                <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                  <span className="text-[10px] font-medium hidden sm:inline text-slate-400">
                    {isOpen ? 'Hide' : 'Show'}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </motion.div>
                </div>
              </button>

              {/* Accordion Content Panel with framer-motion collapsible height animation */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`specs-section-${category.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 bg-slate-50/40">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {category.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-2.5 rounded-lg border border-slate-200/70 hover:border-slate-300 transition-colors shadow-2xs"
                          >
                            <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">
                              {item.key}
                            </span>
                            <span className="font-semibold text-slate-800 text-xs block leading-relaxed break-words">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filteredCategories.length === 0 && searchQuery && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-500">
            <p>No specifications matched &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 font-bold hover:underline"
            >
              Clear search filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
