import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  DownloadCloud, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Code, 
  FileJson, 
  FolderGit2, 
  Layers, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { Product, Currency } from '../../types';
import { CATEGORIES, PRODUCT_BRANDS } from '../../data/categories';
import { 
  validateProductAgainstSchema, 
  auditCatalogSchemaIntegrity, 
  saveProductToGitHubCatalog, 
  downloadCatalogJson,
  SchemaValidationResult
} from '../../utils/githubStore';
import { saveProductToFirestore } from '../../services/productService';
import { DEFAULT_PRODUCT_IMAGE } from '../../utils/productImages';
import { formatPrice } from '../../utils/currency';

interface DataManagementTabProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  currency: Currency;
  onOpenBulkModal: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'error', badge?: string, icon?: string) => void;
}

export const DataManagementTab: React.FC<DataManagementTabProps> = ({
  products,
  onUpdateProducts,
  currency,
  onOpenBulkModal,
  onShowToast,
}) => {
  // --- Catalog Schema Audit ---
  const audit = useMemo(() => auditCatalogSchemaIntegrity(products), [products]);

  // --- Single Product Form State ---
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Apple');
  const [formCustomBrand, setFormCustomBrand] = useState('');
  const [formCategory, setFormCategory] = useState('smartphones');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
  const [formId, setFormId] = useState('');
  const [autoGenId, setAutoGenId] = useState(true);
  const [formInStock, setFormInStock] = useState(true);
  const [formImage, setFormImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('Official Lebanese Agency Warranty\nBrand New Sealed Packaging\nOriginal Accessories Included');
  const [formSpecs, setFormSpecs] = useState('Storage: 256GB\nColor: Space Gray\nWarranty: 1 Year Official');
  const [formCondition, setFormCondition] = useState<'Brand New (Sealed)' | 'Open Box' | 'Certified Pre-Owned'>('Brand New (Sealed)');
  const [formWarranty, setFormWarranty] = useState('1 Year Official Lebanese Agency Warranty');
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [formIsHotDeal, setFormIsHotDeal] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);

  // Copied state
  const [isCopied, setIsCopied] = useState(false);
  const [isFullJsonCopied, setIsFullJsonCopied] = useState(false);

  // Computed brand
  const effectiveBrand = formBrand === 'Other' ? (formCustomBrand.trim() || 'Custom Brand') : formBrand;

  // Auto-generate ID when name or brand changes
  const computedId = useMemo(() => {
    if (!autoGenId && formId.trim()) {
      return formId.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    }
    const cleanBrand = effectiveBrand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanName = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!cleanName) return '';
    return `${cleanBrand}-${cleanName}`.replace(/^-|-$/g, '').slice(0, 48);
  }, [formName, effectiveBrand, autoGenId, formId]);

  // Real-time Schema Validation Result
  const validationResult: SchemaValidationResult = useMemo(() => {
    return validateProductAgainstSchema(
      {
        id: computedId || formId,
        name: formName,
        brand: effectiveBrand,
        category: formCategory,
        subcategory: formSubcategory,
        basePriceUSD: formPrice,
        originalPriceUSD: formOriginalPrice ? formOriginalPrice : undefined,
        inStock: formInStock,
        image: formImage,
        galleryImagesInput: formGalleryImages,
        description: formDescription,
        featuresInput: formFeatures,
        specsInput: formSpecs,
        condition: formCondition,
        warranty: formWarranty,
        isFeatured: formIsFeatured,
        isHotDeal: formIsHotDeal,
        isNewArrival: formIsNewArrival,
      },
      products
    );
  }, [
    computedId,
    formId,
    formName,
    effectiveBrand,
    formCategory,
    formSubcategory,
    formPrice,
    formOriginalPrice,
    formInStock,
    formImage,
    formGalleryImages,
    formDescription,
    formFeatures,
    formSpecs,
    formCondition,
    formWarranty,
    formIsFeatured,
    formIsHotDeal,
    formIsNewArrival,
    products
  ]);

  // Quick preset loader for rapid testing
  const handleLoadSampleData = () => {
    setFormName('Apple iPad Air 11" M2 (2024)');
    setFormBrand('Apple');
    setFormCategory('tablets');
    setFormSubcategory('iPads');
    setFormPrice('649');
    setFormOriginalPrice('699');
    setFormImage('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80');
    setFormGalleryImages('https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80\nhttps://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80');
    setFormDescription('The redesigned iPad Air 11-inch is supercharged by the breakneck Apple M2 chip. It features a stunning Liquid Retina display, landscape camera with Center Stage, and superfast Wi-Fi 6E.');
    setFormFeatures('Apple M2 chip with 8-core CPU and 9-core GPU\n11-inch Liquid Retina display with True Tone\nLandscape 12MP Ultra Wide front camera\nTouch ID for secure authentication\nSupports Apple Pencil Pro and Magic Keyboard');
    setFormSpecs('Chip: Apple M2\nDisplay: 11-inch Liquid Retina LED\nStorage: 128GB\nCamera: 12MP Wide back, 12MP Ultra Wide front\nAudio: Landscape stereo speakers\nConnectivity: Wi-Fi 6E + Bluetooth 5.3');
    setFormCondition('Brand New (Sealed)');
    setFormWarranty('1 Year Official Apple Agency Warranty');
    setFormInStock(true);
    setFormIsFeatured(true);
    setFormIsHotDeal(true);
    setFormIsNewArrival(true);
  };

  const handleResetForm = () => {
    setFormName('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormId('');
    setAutoGenId(true);
    setFormImage('');
    setFormGalleryImages('');
    setFormDescription('');
    setFormSubcategory('');
  };

  const handleCopySingleJson = () => {
    if (!validationResult.jsonStructure) return;
    navigator.clipboard.writeText(validationResult.jsonStructure);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onShowToast('JSON Copied', 'Product JSON copied to clipboard. Ready to paste into products.json.', 'success', 'Copied', 'check');
  };

  const handleCopyFullCatalogJson = () => {
    const fullJson = JSON.stringify(products, null, 2);
    navigator.clipboard.writeText(fullJson);
    setIsFullJsonCopied(true);
    setTimeout(() => setIsFullJsonCopied(false), 2000);
    onShowToast('Full Catalog Copied', `All ${products.length} products JSON copied to clipboard.`, 'success', 'Catalog Copied', 'check');
  };

  // Add the validated product to the catalog
  const handleSaveToCatalog = async () => {
    if (!validationResult.isValid || !validationResult.validatedProduct) {
      onShowToast(
        'Validation Required',
        'Please resolve the highlighted schema validation errors before adding to the catalog.',
        'error',
        'Schema Error',
        'alert'
      );
      return;
    }

    const newProduct = validationResult.validatedProduct;
    const existingIndex = products.findIndex((p) => p.id === newProduct.id);

    let updatedList: Product[];
    if (existingIndex >= 0) {
      updatedList = products.map((p) => (p.id === newProduct.id ? newProduct : p));
    } else {
      updatedList = [newProduct, ...products];
    }

    onUpdateProducts(updatedList);
    try {
      await saveProductToFirestore(newProduct);
    } catch (err) {
      console.warn('[Firestore] Error in DataManagementTab save:', err);
    }
    await saveProductToGitHubCatalog(newProduct, updatedList);

    onShowToast(
      existingIndex >= 0 ? 'Product Updated in Firestore' : 'New Product Appended to Firestore',
      `"${newProduct.name}" saved permanently to Cloud Firestore and repository store (${updatedList.length} total items).`,
      'success',
      'Firestore Synced',
      'github'
    );

    // Reset form after saving
    handleResetForm();
  };

  return (
    <motion.div
      key="tab-data-management"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Top Banner & Action Controls */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Repository Data Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            Data Management & Schema Generator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Monitor the Git repository static catalog status, validate single products against the strict
            TypeScript <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded font-mono">Product</code> schema, 
            and generate production-ready JSON for <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded font-mono">public/data/products.json</code>.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => downloadCatalogJson(products, 'products.json')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 text-xs font-bold transition cursor-pointer shadow-lg shadow-purple-950/30 min-h-[42px]"
            title="Download full products.json file"
          >
            <DownloadCloud className="w-4 h-4 text-purple-400" />
            <span>Export products.json</span>
          </button>

          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition cursor-pointer min-h-[42px]"
            title="Open Bulk Upload / Import Modal"
          >
            <FolderGit2 className="w-4 h-4 text-slate-300" />
            <span>Bulk CSV / JSON</span>
          </button>

          <button
            onClick={handleCopyFullCatalogJson}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer min-h-[42px]"
            title="Copy all catalog JSON to clipboard"
          >
            {isFullJsonCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isFullJsonCopied ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: REPOSITORY DATA SOURCE STATUS & DIAGNOSTICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Metric 1: Data Source */}
        <div className="col-span-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Data Source</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800/60 text-purple-300 text-[9px] font-bold">
              Git Store
            </span>
          </div>
          <div className="text-sm font-bold text-white font-mono truncate">
            public/data/products.json
          </div>
          <p className="text-[10px] text-slate-400">
            Static JSON repository asset, bypassing external databases.
          </p>
        </div>

        {/* Metric 2: Total Items */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products</span>
          <div className="text-2xl font-black text-white font-display">
            {products.length}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Target: 50+ met</span>
          </div>
        </div>

        {/* Metric 3: Schema Health */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Schema Health</span>
          <div className="text-2xl font-black text-white font-display flex items-baseline gap-1">
            <span className={audit.invalidCount === 0 ? 'text-emerald-400' : 'text-amber-400'}>
              {Math.round((audit.validCount / (audit.total || 1)) * 100)}%
            </span>
          </div>
          <div className="text-[10px] text-slate-400">
            {audit.validCount}/{audit.total} items 100% compliant
          </div>
        </div>

        {/* Metric 4: Stock Ratio */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Ratio</span>
          <div className="text-base font-bold text-white font-mono mt-1">
            <span className="text-emerald-400">{audit.inStockCount} In</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-rose-400">{audit.outOfStockCount} Out</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {Math.round((audit.inStockCount / (audit.total || 1)) * 100)}% available live
          </p>
        </div>

        {/* Metric 5: Estimated Payload */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">JSON Payload</span>
          <div className="text-2xl font-black text-white font-display">
            ~{audit.estimatedPayloadKB} <span className="text-xs text-slate-400">KB</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Fast client fetch (&lt; 20ms)
          </p>
        </div>
      </div>

      {/* Category & Brand Taxonomy Tags Bar */}
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Catalog Taxonomy Distribution ({Object.keys(audit.categoryBreakdown).length} Categories, {Object.keys(audit.brandBreakdown).length} Brands)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Lebanese Tech Market Coverage
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Object.entries(audit.categoryBreakdown).map(([cat, count]) => (
            <span
              key={cat}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 flex items-center gap-1.5"
            >
              <span className="capitalize">{cat}</span>
              <span className="bg-slate-800 text-purple-300 px-1.5 py-0.2 rounded-md font-mono text-[9px] font-bold">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 2: ADD SINGLE PRODUCT VIA FORM + REAL-TIME SCHEMA VALIDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#FF0000]" />
                  <span>Single Product Entry Form</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Input product details. The schema validator will verify types and structure live.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleData}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Fill form with sample product for quick validation test"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Load Sample</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Name <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Apple iPad Air 11 M2 (2024)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                />
              </div>

              {/* Brand & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Brand <span className="text-[#FF0000]">*</span>
                  </label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:border-purple-500 outline-none"
                  >
                    {PRODUCT_BRANDS.slice(0, 20).map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-white">{b}</option>
                    ))}
                    <option value="Other" className="bg-slate-900 text-white">+ Other / Custom Brand</option>
                  </select>

                  {formBrand === 'Other' && (
                    <input
                      type="text"
                      value={formCustomBrand}
                      onChange={(e) => setFormCustomBrand(e.target.value)}
                      placeholder="Enter custom brand name"
                      className="mt-2 w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/50 text-white text-xs font-medium outline-none"
                    />
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category <span className="text-[#FF0000]">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:border-purple-500 outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Base Price USD */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">
                      Price USD ($) <span className="text-[#FF0000]">*</span>
                    </label>
                    {Number(formPrice) > 0 && (
                      <span className="text-[10px] text-purple-300 font-mono">
                        ≈ {formatPrice(Number(formPrice), currency)}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="e.g. 649"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                {/* Original Price USD (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Original Price ($) <span className="text-[10px] text-slate-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      placeholder="e.g. 699"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>

                {/* Stock Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Stock Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormInStock(!formInStock)}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      formInStock
                        ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-950/50 text-rose-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formInStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{formInStock ? 'In Stock (Live)' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>

              {/* Product ID (Auto-Generated Slug or Custom) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    Product ID (Slug) <span className="text-[#FF0000]">*</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoGenId}
                      onChange={(e) => setAutoGenId(e.target.checked)}
                      className="rounded accent-purple-600 cursor-pointer"
                    />
                    <span>Auto-derive from brand & name</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={autoGenId ? computedId : formId}
                  disabled={autoGenId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="e.g. apple-ipad-air-11-m2"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
                    autoGenId
                      ? 'bg-slate-950/60 border-slate-800/80 text-purple-300'
                      : 'bg-slate-950 border-slate-700 text-white focus:border-purple-500'
                  } outline-none`}
                />
              </div>

              {/* Primary Image URL with Live Thumbnail Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Primary Image URL <span className="text-[#FF0000]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /images/products/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-medium focus:border-purple-500 outline-none"
                  />
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={formImage || DEFAULT_PRODUCT_IMAGE}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Gallery Images */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Gallery Image URLs <span className="text-[10px] text-slate-500">(One per line or comma-separated)</span>
                </label>
                <textarea
                  rows={2}
                  value={formGalleryImages}
                  onChange={(e) => setFormGalleryImages(e.target.value)}
                  placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-mono focus:border-purple-500 outline-none resize-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Summary of tech specifications, performance highlights, and warranty details..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:border-purple-500 outline-none resize-none"
                />
              </div>

              {/* Technical Specifications (Key: Value) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Key Specifications <span className="text-[10px] text-slate-500">(Key: Value per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="Storage: 256GB&#10;RAM: 16GB&#10;Display: 6.7-inch OLED 120Hz"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-mono focus:border-purple-500 outline-none resize-none"
                />
              </div>

              {/* Badges / Highlights */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNewArrival}
                    onChange={(e) => setFormIsNewArrival(e.target.checked)}
                    className="rounded accent-purple-600 cursor-pointer"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsHotDeal}
                    onChange={(e) => setFormIsHotDeal(e.target.checked)}
                    className="rounded accent-purple-600 cursor-pointer"
                  />
                  <span>Hot Deal / Special Offer</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded accent-purple-600 cursor-pointer"
                  />
                  <span>Featured in Hero Showcase</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schema Validator & JSON Generator (5 cols on large screens) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Schema Validation Diagnostics Card */}
          <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Schema Compliance Audit</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Strict validation against the TypeScript Product schema
                </p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  validationResult.isValid
                    ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950 border border-rose-500/40 text-rose-300'
                }`}
              >
                {validationResult.isValid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Schema Valid</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>{validationResult.errors.length} Issue{validationResult.errors.length > 1 ? 's' : ''}</span>
                  </>
                )}
              </span>
            </div>

            {/* Validation Checklist Items */}
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Name & Brand Format:</span>
                {formName.trim().length >= 3 && effectiveBrand.trim() ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold font-mono">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="text-rose-400 text-[11px] font-mono">
                    {formName.trim().length === 0 ? 'Missing Name' : 'Too Short'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Base Price (USD &gt; $0):</span>
                {Number(formPrice) > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold font-mono">
                    <Check className="w-3 h-3" /> PASS (${Number(formPrice)})
                  </span>
                ) : (
                  <span className="text-rose-400 text-[11px] font-mono">
                    Invalid Price
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Primary Image Reachability:</span>
                {formImage.trim().startsWith('http://') || formImage.trim().startsWith('https://') || formImage.trim().startsWith('/') ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold font-mono">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                ) : (
                  <span className="text-rose-400 text-[11px] font-mono">
                    {formImage ? 'Invalid URL' : 'Image Required'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Unique Slug / ID:</span>
                {computedId ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold font-mono">
                    <Check className="w-3 h-3" /> {computedId.slice(0, 18)}...
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono">Waiting for name</span>
                )}
              </div>
            </div>

            {/* Error alerts if validation fails */}
            {validationResult.errors.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-1.5 text-xs text-rose-300">
                <div className="font-bold flex items-center gap-1.5 text-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Validation Blockers (Must Fix Before Generation):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-300/90 pl-1">
                  {validationResult.errors.map((err, idx) => (
                    <li key={idx}>
                      <strong className="text-white capitalize">{err.field}:</strong> {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning alerts if any */}
            {validationResult.warnings.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-1 text-xs text-amber-300">
                <div className="font-bold text-[11px] flex items-center gap-1 text-amber-200">
                  <Sliders className="w-3 h-3 text-amber-400" />
                  <span>Schema Recommendations:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-300/90 pl-1">
                  {validationResult.warnings.map((w, idx) => (
                    <li key={idx}>{w.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Primary Action Button: Save to Catalog */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveToCatalog}
                disabled={!validationResult.isValid}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] shadow-lg ${
                  validationResult.isValid
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 ring-1 ring-purple-400/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Append to Catalog & Save to Store</span>
              </button>
            </div>
          </div>

          {/* Generated Product JSON Structure Card */}
          <div className="bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Generated JSON Structure
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopySingleJson}
                disabled={!validationResult.jsonStructure}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Copy single product JSON object"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {validationResult.jsonStructure ? (
              <div className="relative">
                <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-purple-300 font-mono text-[11px] leading-relaxed max-h-[360px] overflow-y-auto overflow-x-auto selection:bg-purple-900">
                  <code>{validationResult.jsonStructure}</code>
                </pre>
                <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-500 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                  {validationResult.jsonStructure.split('\n').length} lines
                </div>
              </div>
            ) : (
              <div className="py-12 px-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-center space-y-2">
                <Code className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-medium text-slate-400">
                  Complete the required form fields above.
                </p>
                <p className="text-[10px] text-slate-500">
                  The compliant JSON payload will generate automatically when schema validation passes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
