import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  GitBranch, 
  Upload, 
  Download, 
  Check, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Boxes, 
  Code, 
  FolderGit2 
} from 'lucide-react';
import { Product } from '../../types';
import { 
  downloadCatalogJson, 
  parseBulkProductData, 
  fetchGitHubCatalog, 
  getGitCommitInstructions
} from '../../utils/githubStore';
import { saveProductToFirestore } from '../../services/productService';
import { safeSaveProducts } from '../../utils/productStorage';

interface GitHubCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning', badge?: string, icon?: any) => void;
}

export const GitHubCatalogModal: React.FC<GitHubCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bulk-upload' | 'export-git' | 'curated-scale'>('bulk-upload');
  const [jsonOrCsvText, setJsonOrCsvText] = useState('');
  const [formatType, setFormatType] = useState<'json' | 'csv'>('json');
  const [parseResult, setParseResult] = useState<{ products: Product[]; errors: string[] } | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [copiedGitCode, setCopiedGitCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle parsing text
  const handleAnalyzeInput = (text: string, fmt: 'json' | 'csv') => {
    setJsonOrCsvText(text);
    if (!text.trim()) {
      setParseResult(null);
      return;
    }
    const result = parseBulkProductData(text, fmt);
    setParseResult(result);
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isCsv = file.name.endsWith('.csv');
    const detectedFormat = isCsv ? 'csv' : 'json';
    setFormatType(detectedFormat);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleAnalyzeInput(content, detectedFormat);
    };
    reader.readAsText(file);
  };

  // Execute bulk import
  const handleExecuteImport = () => {
    if (!parseResult || parseResult.products.length === 0) return;

    let updatedList: Product[];
    if (importMode === 'replace') {
      updatedList = parseResult.products;
    } else {
      // Merge by ID
      const existingMap = new Map(products.map((p) => [p.id, p]));
      parseResult.products.forEach((p) => {
        existingMap.set(p.id, p);
      });
      updatedList = Array.from(existingMap.values());
    }

    onUpdateProducts(updatedList);
    safeSaveProducts(updatedList);

    // Persist imported items to Firestore
    parseResult.products.forEach((prod) => {
      saveProductToFirestore(prod).catch((e) => console.warn('[Firestore] Bulk save note:', e));
    });

    onShowToast(
      'Bulk Products Imported!',
      `Successfully loaded and synced ${parseResult.products.length} products with Cloud Firestore.`,
      'success',
      'Firestore Synced',
      'github'
    );

    setJsonOrCsvText('');
    setParseResult(null);
    onClose();
  };

  // One-click scale to 50+ products
  const handleLoadCuratedCatalog = async () => {
    setIsSyncing(true);
    try {
      const res = await fetchGitHubCatalog();
      if (res.success && res.products.length >= 50) {
        onUpdateProducts(res.products);
        safeSaveProducts(res.products);
        onShowToast(
          'Catalog Scaled to 50+ Products!',
          `Loaded ${res.products.length} flagship electronics with verified specs, images, and prices.`,
          'success',
          '50+ Active Items',
          'github'
        );
        onClose();
      } else {
        // Fallback to bundled products if server fetch fails
        const { PRODUCTS } = await import('../../data/products');
        onUpdateProducts(PRODUCTS);
        safeSaveProducts(PRODUCTS);
        onShowToast(
          'Catalog Updated!',
          `Loaded ${PRODUCTS.length} curated products from repository data.`,
          'success',
          `${PRODUCTS.length} Products`,
          'github'
        );
        onClose();
      }
    } catch (err: any) {
      onShowToast('Sync Failed', err?.message || 'Could not fetch catalog', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyGitCommands = () => {
    const snippet = getGitCommitInstructions(products.length);
    navigator.clipboard.writeText(snippet);
    setCopiedGitCode(true);
    setTimeout(() => setCopiedGitCode(false), 2500);
  };

  const handleDownload = () => {
    downloadCatalogJson(products, 'products.json');
    onShowToast(
      'products.json Downloaded',
      `Exported ${products.length} products ready for your Git repository commit.`,
      'info',
      'Exported',
      'github'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">GitHub Product Catalog Store</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {products.length} Products Active
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Bypasses cloud database friction. Stores catalog directly in <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">public/data/products.json</code>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('bulk-upload')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeSubTab === 'bulk-upload'
                ? 'bg-neutral-900 text-purple-400 border-purple-500'
                : 'text-neutral-400 hover:text-neutral-200 border-transparent'
            }`}
          >
            <Upload className="w-4 h-4" />
            Bulk Import (JSON / CSV)
          </button>
          <button
            onClick={() => setActiveSubTab('curated-scale')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeSubTab === 'curated-scale'
                ? 'bg-neutral-900 text-emerald-400 border-emerald-500'
                : 'text-neutral-400 hover:text-neutral-200 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Instant 50+ Products Scale
          </button>
          <button
            onClick={() => setActiveSubTab('export-git')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeSubTab === 'export-git'
                ? 'bg-neutral-900 text-blue-400 border-blue-500'
                : 'text-neutral-400 hover:text-neutral-200 border-transparent'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Export & Git Commit
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: BULK IMPORT */}
          {activeSubTab === 'bulk-upload' && (
            <div className="space-y-5">
              {/* Top bar with drag/file button */}
              <div className="border-2 border-dashed border-neutral-700 hover:border-purple-500/60 bg-neutral-950/40 rounded-2xl p-6 text-center transition-all">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".json,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="bulk-catalog-file"
                />
                <label 
                  htmlFor="bulk-catalog-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white hover:underline">
                      Click to choose JSON or CSV file
                    </span>
                    <p className="text-xs text-neutral-400 mt-1">
                      Upload your products list file or paste raw content below
                    </p>
                  </div>
                </label>
              </div>

              {/* Text Input Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300">Or Paste Products Data (JSON or CSV)</label>
                  <div className="flex items-center gap-2 text-xs">
                    <button 
                      type="button" 
                      onClick={() => { setFormatType('json'); handleAnalyzeInput(jsonOrCsvText, 'json'); }}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                        formatType === 'json' ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'border-neutral-800 text-neutral-400'
                      }`}
                    >
                      JSON
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setFormatType('csv'); handleAnalyzeInput(jsonOrCsvText, 'csv'); }}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                        formatType === 'csv' ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'border-neutral-800 text-neutral-400'
                      }`}
                    >
                      CSV
                    </button>
                  </div>
                </div>

                <textarea
                  value={jsonOrCsvText}
                  onChange={(e) => handleAnalyzeInput(e.target.value, formatType)}
                  placeholder={
                    formatType === 'json'
                      ? '[\n  {\n    "name": "Sony WH-1000XM5",\n    "brand": "Sony",\n    "category": "audio",\n    "basePriceUSD": 340,\n    "image": "https://..."\n  }\n]'
                      : 'name,brand,category,price,description\nSony WH-1000XM5,Sony,audio,340,Noise Canceling Headphones'
                  }
                  rows={6}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500/60 transition-all resize-none"
                />
              </div>

              {/* Parse Validation Output */}
              {parseResult && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">
                        {parseResult.products.length} valid product(s) detected
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-neutral-300">
                        <input 
                          type="radio" 
                          name="importMode" 
                          checked={importMode === 'merge'} 
                          onChange={() => setImportMode('merge')} 
                        />
                        Merge with current
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-neutral-300">
                        <input 
                          type="radio" 
                          name="importMode" 
                          checked={importMode === 'replace'} 
                          onChange={() => setImportMode('replace')} 
                        />
                        Replace catalog
                      </label>
                    </div>
                  </div>

                  {/* Errors if any */}
                  {parseResult.errors.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                      <span className="font-bold">Warnings:</span>
                      {parseResult.errors.slice(0, 3).map((err, i) => (
                        <div key={i}>• {err}</div>
                      ))}
                      {parseResult.errors.length > 3 && (
                        <div>...and {parseResult.errors.length - 3} more warnings</div>
                      )}
                    </div>
                  )}

                  {/* Preview Items */}
                  {parseResult.products.length > 0 && (
                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {parseResult.products.slice(0, 8).map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                          <span className="font-medium text-white truncate max-w-[240px]">{p.name}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300">{p.brand}</span>
                            <span className="font-bold text-emerald-400">${p.basePriceUSD}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleExecuteImport}
                    disabled={parseResult.products.length === 0}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Apply {parseResult.products.length} Products to Store
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INSTANT CURATED 50+ SCALE */}
          {activeSubTab === 'curated-scale' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-neutral-900 to-neutral-950 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2.5 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-white">Pre-Configured 50+ Product Tech Catalog</h4>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Instantly expand from 10 items to over <strong>50+ realistic flagships</strong> tailored for Lebanon with dual USD/LBP pricing, official agency warranties, real specs, colorways, and Unsplash photos.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[10px]">Smartphones</span>
                    <span className="font-bold text-white">12+ Devices</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[10px]">Laptops & Macs</span>
                    <span className="font-bold text-white">8+ Systems</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[10px]">Audio & Speakers</span>
                    <span className="font-bold text-white">10+ Models</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[10px]">Gaming & Consoles</span>
                    <span className="font-bold text-white">PS5 Pro, Wheels</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[10px]">Drones & Cameras</span>
                    <span className="font-bold text-white">DJI, GoPro</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block text-[10px]">Power & GaN</span>
                    <span className="font-bold text-white">Anker, UGREEN</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleLoadCuratedCatalog}
                    disabled={isSyncing}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isSyncing ? 'Loading Curated Inventory...' : 'Scale Catalog to 50+ Products Now'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT & GIT COMMIT */}
          {activeSubTab === 'export-git' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Download products.json</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Export all {products.length} products to place inside <code className="text-purple-300">public/data/products.json</code>
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  Download JSON
                </button>
              </div>

              {/* Terminal CLI Instructions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-purple-400" />
                    Git Terminal Commit Commands
                  </label>
                  <button
                    onClick={handleCopyGitCommands}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    {copiedGitCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedGitCode ? 'Copied!' : 'Copy Commands'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-black border border-neutral-800 font-mono text-xs text-emerald-400/90 leading-relaxed overflow-x-auto select-all">
                  <pre>{getGitCommitInstructions(products.length)}</pre>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1">
                <div className="font-semibold text-neutral-300">💡 Why GitHub Repo Storage?</div>
                <div>• Zero recurring database fees or cloud quotas.</div>
                <div>• Products are version-controlled with Git branches, PRs, and instant rollback.</div>
                <div>• Images can reside in <code className="text-neutral-200">public/images/products/</code> or via high-res CDN URLs.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            Database Engine: <span className="font-semibold text-purple-400">GitHub JSON Repo</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
