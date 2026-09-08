import React, { useState } from 'react';
import { 
  Palette, 
  HardDrive, 
  Sliders, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Boxes,
  Sparkles
} from 'lucide-react';
import { StorageOption, ColorOption, ProductVariant } from '../../types';
import { COLOR_PRESETS, STORAGE_PRESETS, generateVariantsMatrix } from '../../utils/variantUtils';

interface VariantManagerProps {
  productId: string;
  productName: string;
  basePriceUSD: number;
  storageOptions: StorageOption[];
  setStorageOptions: React.Dispatch<React.SetStateAction<StorageOption[]>>;
  colorOptions: ColorOption[];
  setColorOptions: React.Dispatch<React.SetStateAction<ColorOption[]>>;
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
}

export const VariantManager: React.FC<VariantManagerProps> = ({
  productId,
  productName,
  basePriceUSD,
  storageOptions,
  setStorageOptions,
  colorOptions,
  setColorOptions,
  variants,
  setVariants,
}) => {
  // New color inputs
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2B2B2C');

  // New storage inputs
  const [newStorageCapacity, setNewStorageCapacity] = useState('');
  const [newStoragePrice, setNewStoragePrice] = useState<number | ''>(basePriceUSD || 500);

  // Active sub-tab in variant manager ('storage-pricing' | 'colors' | 'matrix')
  const [activeSubTab, setActiveSubTab] = useState<'storage-pricing' | 'colors' | 'matrix'>('storage-pricing');

  // Auto-sync / regenerate matrix handler
  const handleRegenerateMatrix = (
    currentStorage: StorageOption[] = storageOptions,
    currentColors: ColorOption[] = colorOptions
  ) => {
    const newMatrix = generateVariantsMatrix({
      productId: productId || 'prod',
      productName: productName || 'Product',
      storageOptions: currentStorage,
      colorOptions: currentColors,
      existingVariants: variants,
      defaultBasePrice: basePriceUSD || 500,
    });
    setVariants(newMatrix);
  };

  // --- COLOR MANAGEMENT ---
  const handleAddColor = (name: string, hex: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (colorOptions.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return; // Already exists
    }
    const updated = [...colorOptions, { name: trimmed, hex: hex || '#383838' }];
    setColorOptions(updated);
    handleRegenerateMatrix(storageOptions, updated);
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    const updated = colorOptions.filter((_, i) => i !== index);
    setColorOptions(updated);
    handleRegenerateMatrix(storageOptions, updated);
  };

  const handleUpdateColorHex = (index: number, newHex: string) => {
    const updated = [...colorOptions];
    updated[index] = { ...updated[index], hex: newHex };
    setColorOptions(updated);
    
    // Also update matching variants' colorHex
    const targetName = updated[index].name;
    setVariants((prev) =>
      prev.map((v) => (v.color === targetName ? { ...v, colorHex: newHex } : v))
    );
  };

  // --- STORAGE MEMORY & TIERED PRICING ---
  const handleAddStorage = (capacity: string, price: number) => {
    const trimmed = capacity.trim();
    if (!trimmed) return;
    if (storageOptions.some((s) => s.capacity.toLowerCase() === trimmed.toLowerCase())) {
      return; // Already exists
    }
    const updated = [...storageOptions, { capacity: trimmed, priceUSD: price, inStock: true }];
    setStorageOptions(updated);
    handleRegenerateMatrix(updated, colorOptions);
    setNewStorageCapacity('');
    setNewStoragePrice(basePriceUSD || 500);
  };

  const handleRemoveStorage = (index: number) => {
    const updated = storageOptions.filter((_, i) => i !== index);
    setStorageOptions(updated);
    handleRegenerateMatrix(updated, colorOptions);
  };

  const handleUpdateStoragePrice = (index: number, newPrice: number) => {
    const updated = [...storageOptions];
    updated[index] = { ...updated[index], priceUSD: newPrice };
    setStorageOptions(updated);

    // Also update matching variants' price
    const targetCapacity = updated[index].capacity;
    setVariants((prev) =>
      prev.map((v) => (v.storage === targetCapacity ? { ...v, priceUSD: newPrice } : v))
    );
  };

  const handleToggleStorageStock = (index: number) => {
    const updated = [...storageOptions];
    const newStock = !(updated[index].inStock !== false);
    updated[index] = { ...updated[index], inStock: newStock };
    setStorageOptions(updated);

    // Update variants stock for this storage tier
    const targetCapacity = updated[index].capacity;
    setVariants((prev) =>
      prev.map((v) => (v.storage === targetCapacity ? { ...v, inStock: newStock } : v))
    );
  };

  // Quick price modifier calculator for storage tier
  const applySuggestedTierPricing = () => {
    const base = Number(basePriceUSD) || 500;
    const tierOffsets: Record<string, number> = {
      '64GB': 0,
      '128GB': 0,
      '256GB': 70,
      '512GB': 210,
      '1TB': 440,
      '2TB': 800,
    };

    const updated = storageOptions.map((opt) => {
      const offset = tierOffsets[opt.capacity.toUpperCase()] ?? 100;
      return {
        ...opt,
        priceUSD: base + offset,
      };
    });

    setStorageOptions(updated);
    handleRegenerateMatrix(updated, colorOptions);
  };

  // --- VARIANT MATRIX OVERRIDES ---
  const handleUpdateVariantPrice = (variantId: string, newPrice: number) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, priceUSD: newPrice } : v))
    );
  };

  const handleToggleVariantStock = (variantId: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, inStock: !v.inStock } : v))
    );
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  return (
    <div className="p-4 sm:p-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-4">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-[#FF0000]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Variants, Colors & Tiered Storage Pricing
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Manage storage capacities with dynamic prices, color swatches, and active inventory combinations.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('storage-pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'storage-pricing'
                ? 'bg-[#FF0000] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Storage & Prices ({storageOptions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('colors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'colors'
                ? 'bg-[#FF0000] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>Colors ({colorOptions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'matrix'
                ? 'bg-[#FF0000] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Combinations ({variants.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: STORAGE MEMORY OPTIONS & DYNAMIC TIER PRICING
         ========================================================================= */}
      {activeSubTab === 'storage-pricing' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-slate-300">
              Base Product Price:{' '}
              <strong className="text-emerald-400 font-mono font-bold">
                ${basePriceUSD || 0} USD
              </strong>
            </div>
            <button
              type="button"
              onClick={applySuggestedTierPricing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-[11px] font-semibold cursor-pointer transition w-fit"
              title="Auto-calculate prices: Base for 128GB, +$70 for 256GB, +$210 for 512GB, +$440 for 1TB"
            >
              <Sparkles className="w-3 h-3" />
              <span>Apply Tech Industry Tiered Price Increments</span>
            </button>
          </div>

          {/* Preset Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Add Storage Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STORAGE_PRESETS.map((cap) => {
                const alreadyAdded = storageOptions.some(
                  (s) => s.capacity.toLowerCase() === cap.toLowerCase()
                );
                return (
                  <button
                    key={cap}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => {
                      const offset =
                        cap === '256GB' ? 70 : cap === '512GB' ? 210 : cap === '1TB' ? 440 : cap === '2TB' ? 800 : 0;
                      handleAddStorage(cap, (basePriceUSD || 500) + offset);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                      alreadyAdded
                        ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <Plus className="w-3 h-3 text-[#FF0000]" />
                    <span>{cap}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Configured Storage Tiers */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Storage Tiers & Pricing:
            </span>

            {storageOptions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                No storage tiers added. Click a preset chip above or add a custom capacity below.
              </div>
            ) : (
              <div className="space-y-2">
                {storageOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div className="font-bold text-white text-sm font-mono">{opt.capacity}</div>
                      <span className="text-slate-500">→</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          value={opt.priceUSD}
                          onChange={(e) =>
                            handleUpdateStoragePrice(idx, Math.max(0, Number(e.target.value)))
                          }
                          className="w-24 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-xs focus:border-[#FF0000] outline-none"
                          placeholder="Price USD"
                        />
                        <span className="text-[11px] text-slate-400">USD</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      {/* In Stock toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleStorageStock(idx)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                          opt.inStock !== false
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        }`}
                      >
                        {opt.inStock !== false ? 'In Stock' : 'Out of Stock'}
                      </button>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveStorage(idx)}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-950/80 text-slate-500 hover:text-red-400 transition cursor-pointer"
                        title="Remove storage tier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom Storage Tier Input */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-900">
            <input
              type="text"
              value={newStorageCapacity}
              onChange={(e) => setNewStorageCapacity(e.target.value)}
              placeholder="Custom capacity (e.g. 128GB or 1TB NVMe)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
            />
            <div className="flex items-center gap-1 w-full sm:w-44">
              <span className="text-slate-400 text-xs font-bold pl-1">$</span>
              <input
                type="number"
                value={newStoragePrice}
                onChange={(e) => setNewStoragePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Tier Price"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono placeholder-slate-500 focus:border-[#FF0000] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (newStorageCapacity.trim()) {
                  handleAddStorage(newStorageCapacity, Number(newStoragePrice) || basePriceUSD || 500);
                }
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>Add Tier</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AVAILABLE DEVICE COLORS & SWATCHES
         ========================================================================= */}
      {activeSubTab === 'colors' && (
        <div className="space-y-4">
          {/* Presets Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Popular Phone Color Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map((preset) => {
                const alreadyAdded = colorOptions.some(
                  (c) => c.name.toLowerCase() === preset.name.toLowerCase()
                );
                return (
                  <button
                    key={preset.name}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddColor(preset.name, preset.hex)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      alreadyAdded
                        ? 'bg-slate-900/40 text-slate-600 border border-slate-800/40 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-500/40 shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configured Colors List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Colors & Swatches ({colorOptions.length}):
            </span>

            {colorOptions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                No colors specified. Add at least one color tag or preset above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {colorOptions.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {/* Interactive Color Swatch Picker */}
                      <label 
                        className="relative w-6 h-6 rounded-full border-2 border-slate-600 overflow-hidden cursor-pointer shrink-0 shadow-xs hover:scale-105 transition"
                        title="Click to adjust hex swatch color"
                      >
                        <input
                          type="color"
                          value={col.hex || '#383838'}
                          onChange={(e) => handleUpdateColorHex(idx, e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                        <span
                          className="block w-full h-full"
                          style={{ backgroundColor: col.hex || '#383838' }}
                        />
                      </label>
                      <span className="font-bold text-white truncate">{col.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{col.hex}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-950/80 text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Remove color"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Custom Color Input */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-900">
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Color name (e.g. Sierra Blue, Desert Titanium, Obsidian)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none w-full"
            />
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label 
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs font-mono text-slate-300"
                title="Select Hex Color"
              >
                <span 
                  className="w-4 h-4 rounded-full border border-slate-600 shrink-0" 
                  style={{ backgroundColor: newColorHex }}
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-0 h-0 opacity-0"
                />
                <span>{newColorHex}</span>
              </label>

              <button
                type="button"
                onClick={() => handleAddColor(newColorName, newColorHex)}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF0000]" />
                <span>Add Color</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VARIANT MATRIX (COMBINATIONS & OVERRIDES)
         ========================================================================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <p className="text-slate-400">
              Each combination represents an exact purchasable SKU with its own price & stock status.
            </p>
            <button
              type="button"
              onClick={() => handleRegenerateMatrix()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-700 text-[11px] font-semibold cursor-pointer transition"
              title="Sync combinations from Storage Tiers & Colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate Matrix</span>
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 border border-slate-800/80 rounded-xl p-2 bg-slate-950">
            {variants.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No variants available. Please configure Storage and Colors.
              </div>
            ) : (
              variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {variant.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                    )}
                    <div className="font-semibold text-slate-200 truncate">
                      {variant.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        value={variant.priceUSD}
                        onChange={(e) =>
                          handleUpdateVariantPrice(variant.id, Math.max(0, Number(e.target.value)))
                        }
                        className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-xs focus:border-[#FF0000] outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleVariantStock(variant.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                        variant.inStock
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {variant.inStock ? 'In Stock' : 'Out'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="p-1 rounded bg-slate-950 hover:bg-red-950/80 text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Remove variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
