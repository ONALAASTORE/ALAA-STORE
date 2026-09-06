import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Video, 
  Megaphone, 
  Settings, 
  LogOut, 
  Store, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  Save, 
  ShieldCheck,
  Truck,
  Copy,
  RefreshCw,
  Play
} from 'lucide-react';
import { Product, StoreSettings, Currency } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { getEmbedVideoUrl, isDirectVideoFile } from '../../utils/video';
import { formatPrice } from '../../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../../utils/productImages';
import { LogoAvatar, Brand3DText } from '../brand';

interface AdminDashboardProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onLogout: () => void;
  onNavigateToStore: () => void;
  currency: Currency;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onUpdateProducts,
  storeSettings,
  onUpdateStoreSettings,
  onLogout,
  onNavigateToStore,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'video' | 'banner' | 'overview'>('products');
  
  // Product Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Video Form state
  const [videoUrlInput, setVideoUrlInput] = useState(storeSettings.marketingVideoUrl);
  const [videoTitleInput, setVideoTitleInput] = useState(storeSettings.marketingVideoTitle || 'Featured Tech Showcase');
  const [videoSavedSuccess, setVideoSavedSuccess] = useState(false);

  // Banner Form state
  const [bannerTextInput, setBannerTextInput] = useState(storeSettings.topBannerText);
  const [isBannerActiveInput, setIsBannerActiveInput] = useState(storeSettings.isTopBannerActive);
  const [bannerSavedSuccess, setBannerSavedSuccess] = useState(false);

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'inStock' && p.inStock) || 
      (stockFilter === 'outOfStock' && !p.inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      showToast(`Product "${productName}" removed from store.`);
    }
  };

  const handleToggleStock = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${product.name} (Copy)`,
    };
    onUpdateProducts([duplicated, ...products]);
    showToast(`Duplicated "${product.name}"`);
  };

  const handleSaveProduct = (savedProduct: Product) => {
    if (editingProduct) {
      // Update existing
      const updated = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      onUpdateProducts(updated);
      showToast(`Updated "${savedProduct.name}" successfully!`);
    } else {
      // Add new
      onUpdateProducts([savedProduct, ...products]);
      showToast(`Added new product "${savedProduct.name}" to catalog!`);
    }
  };

  // Video Save Handler
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: StoreSettings = {
      ...storeSettings,
      marketingVideoUrl: videoUrlInput.trim(),
      marketingVideoTitle: videoTitleInput.trim()
    };
    onUpdateStoreSettings(updatedSettings);
    setVideoSavedSuccess(true);
    showToast('Homepage marketing video updated successfully!');
    setTimeout(() => setVideoSavedSuccess(false), 3000);
  };

  // Banner Save Handler
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: StoreSettings = {
      ...storeSettings,
      topBannerText: bannerTextInput.trim(),
      isTopBannerActive: isBannerActiveInput
    };
    onUpdateStoreSettings(updatedSettings);
    setBannerSavedSuccess(true);
    showToast('Top banner settings updated live on store!');
    setTimeout(() => setBannerSavedSuccess(false), 3000);
  };

  const activeEmbedUrl = getEmbedVideoUrl(videoUrlInput);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#FF0000] selection:text-white font-sans antialiased pb-12">
      {/* 3D Visual Atmosphere */}
      <div className="fixed inset-0 bg-[radial-gradient(#FF0000_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-[#FF0000]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FF0000] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <LogoAvatar size="md" withGlow={true} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Brand3DText size="sm" isDarkTheme={true} />
                <span className="px-2 py-0.5 rounded-full bg-[#FF0000]/20 border border-[#FF0000]/40 text-[#FF0000] text-[10px] font-black uppercase tracking-wider">
                  Admin Dashboard
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Authenticated <span className="text-emerald-400 font-semibold">• Active Session</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onNavigateToStore}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 shadow-md cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#FF0000]" />
              <span className="hidden sm:inline">View Public Store</span>
              <span className="sm:hidden">Store</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white text-xs font-bold transition border border-red-800/60 shadow-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full space-y-6 relative z-10 flex-1">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Manager</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'products' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Homepage Video Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('banner')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'banner'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Top Banner & Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Configuration</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* TAB 1: PRODUCT MANAGER (CRUD) */}
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="tab-products"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
            
            {/* Filter & Search Bar Card */}
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title, brand, or model..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="sm:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium focus:border-[#FF0000] outline-none"
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="tablets">iPads & Tablets</option>
                  <option value="laptops">MacBooks & Laptops</option>
                  <option value="gaming">Gaming & Consoles</option>
                  <option value="audio">Audio & AirPods</option>
                  <option value="wearables">Smartwatches</option>
                  <option value="chargers">Chargers & Cables</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="sm:col-span-3">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium focus:border-[#FF0000] outline-none"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="inStock">In Stock Only</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Live Catalog Inventory</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {filteredProducts.length} items
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, duplicate or toggle live stock availability
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset catalog to official baseline products?')) {
                        localStorage.removeItem('on_alaa_store_products');
                        window.location.reload();
                      }
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                    title="Reset to default seed products"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Catalog</span>
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Package className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-400">No products match your criteria</div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setStockFilter('all');
                    }}
                    className="text-xs font-bold text-[#FF0000] hover:underline cursor-pointer"
                  >
                    Clear Search Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Category / Brand</th>
                        <th className="py-3 px-4">Price (USD)</th>
                        <th className="py-3 px-4">Custom Columns / Specs</th>
                        <th className="py-3 px-4">Stock Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.map((product) => {
                        const specsEntries = Object.entries(product.specs || {}).slice(0, 3);
                        const productImgs = getProductImages(product);
                        const primaryImg = productImgs[0] || DEFAULT_PRODUCT_IMAGE;
                        return (
                          <tr key={product.id} className="hover:bg-slate-800/40 transition">
                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden group">
                                  <img
                                    src={primaryImg}
                                    alt={product.name}
                                    className="w-full h-full object-contain rounded"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                                    }}
                                  />
                                  {productImgs.length > 1 && (
                                    <span className="absolute bottom-0.5 right-0.5 bg-slate-900/90 text-white font-mono text-[9px] font-bold px-1 rounded">
                                      {productImgs.length}
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-white text-xs truncate max-w-xs sm:max-w-sm">
                                    {product.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="text-slate-500 font-mono text-[10px]">ID: {product.id}</span>
                                    <span>•</span>
                                    <span className="text-amber-400 font-medium">{product.condition}</span>
                                    {productImgs.length > 1 && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-400 font-medium">{productImgs.length} photos</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category / Brand */}
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                                {product.brand}
                              </span>
                              <div className="text-[11px] text-slate-400 capitalize mt-1">
                                {product.category}
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4">
                              <div className="font-black text-white text-sm font-display">
                                {formatPrice(product.basePriceUSD, currency)}
                              </div>
                              {product.originalPriceUSD && (
                                <div className="text-[10px] text-slate-500 line-through">
                                  {formatPrice(product.originalPriceUSD, currency)}
                                </div>
                              )}
                            </td>

                            {/* Dynamic Specs / Columns */}
                            <td className="py-3 px-4 max-w-xs">
                              <div className="space-y-1">
                                {specsEntries.length > 0 ? (
                                  specsEntries.map(([k, v], idx) => (
                                    <div key={idx} className="text-[10px] text-slate-300 truncate">
                                      <strong className="text-slate-400 font-semibold">{k}:</strong> {v}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">No custom specs</span>
                                )}
                              </div>
                            </td>

                            {/* Stock Status Button */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleStock(product.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                  product.inStock
                                    ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                                    : 'bg-red-950/70 border border-red-500/40 text-red-300 hover:bg-red-900/60'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleDuplicateProduct(product)}
                                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                  title="Duplicate Product"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditProduct(product)}
                                  className="p-2 rounded-lg bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white transition cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: HOMEPAGE MARKETING VIDEO MANAGER */}
        {activeTab === 'video' && (
          <motion.div
            key="tab-video"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Video Configuration Form */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold uppercase tracking-wider">
                    <Video className="w-3.5 h-3.5" />
                    <span>Homepage Video Showcase</span>
                  </div>
                  <h3 className="text-xl font-black text-white font-display">
                    Marketing Video Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Paste any YouTube, Vimeo, or direct MP4 video link. It will immediately feature on the public storefront.
                  </p>
                </div>

                <form onSubmit={handleSaveVideo} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Marketing Video URL (YouTube / Vimeo / MP4)
                    </label>
                    <input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports YouTube Watch links, Shorts, Embed links, Vimeo, and direct video files.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Showcase Headline / Video Caption
                    </label>
                    <input
                      type="text"
                      value={videoTitleInput}
                      onChange={(e) => setVideoTitleInput(e.target.value)}
                      placeholder="e.g. Official Apple iPhone 16 Pro Showcase"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none"
                    />
                  </div>

                  {/* Preset Quick Selects */}
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      Quick Video Presets
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrlInput('https://www.youtube.com/watch?v=eDqfg_LexCQ');
                          setVideoTitleInput('Apple iPhone 16 Pro Cinematic Showcase');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        🎬 iPhone 16 Pro
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrlInput('https://www.youtube.com/watch?v=QfdeTf0mY8k');
                          setVideoTitleInput('Samsung Galaxy S25 Ultra 5G Tour');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        ⚡ Galaxy S25 Ultra
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoUrlInput('https://www.youtube.com/watch?v=VGYLrnV-x_I');
                          setVideoTitleInput('PlayStation 5 Pro Next-Gen Experience');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        🎮 PS5 Pro Gaming
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {videoSavedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Saved Live!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Video & Publish to Homepage</span>
                      </>
                    )}
                  </button>

                </form>
              </div>
            </div>

            {/* Live Video Preview Box */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Play className="w-4 h-4 text-[#FF0000]" />
                      <span>Live Video Preview</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Real-time interactive check of the video player
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    Embed Ready
                  </span>
                </div>

                {/* Video Frame */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  {videoUrlInput ? (
                    isDirectVideoFile(videoUrlInput) ? (
                      <video 
                        src={videoUrlInput} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={activeEmbedUrl}
                        title={videoTitleInput}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                      <Video className="w-12 h-12 text-slate-700" />
                      <p className="text-xs font-semibold">Enter a video URL on the left to preview</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block mb-0.5">Caption on Storefront:</span>
                  <p className="text-slate-400 text-[11px] font-medium">"{videoTitleInput}"</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 3: TOP BANNER MANAGER */}
        {activeTab === 'banner' && (
          <motion.div
            key="tab-banner"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold uppercase tracking-wider">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Storewide Alert & Announcement</span>
                </div>
                <h3 className="text-2xl font-black text-white font-display">
                  Top Banner Manager
                </h3>
                <p className="text-xs text-slate-400">
                  Configure the global top announcement message seen by every customer in Lebanon.
                </p>
              </div>

              <form onSubmit={handleSaveBanner} className="space-y-5">
                {/* Banner Active Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-white block">
                      Enable Top Announcement Banner
                    </label>
                    <span className="text-[11px] text-slate-400">
                      When active, banner displays at the very top of every page
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isBannerActiveInput}
                    onChange={(e) => setIsBannerActiveInput(e.target.checked)}
                    className="w-5 h-5 rounded text-[#FF0000] focus:ring-[#FF0000] bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>

                {/* Banner Text Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Banner Announcement Text
                  </label>
                  <input
                    type="text"
                    value={bannerTextInput}
                    onChange={(e) => setBannerTextInput(e.target.value)}
                    placeholder="Available delivery to all Lebanon 🚚"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Recommended: Include delivery highlights, promo codes, or official warranty notices.
                  </p>
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    Quick Preset Messages:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBannerTextInput('Available delivery to all Lebanon 🚚 (Beirut, Tripoli, Saida, Bekaa)')}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      🚚 All Lebanon Fast Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerTextInput('🔥 Hot Deals on iPhone 16 Pro & Galaxy S25 Series • Official Warranty')}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      🔥 Flagship Phone Specials
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerTextInput('🇱🇧 Payment in Cash USD / L.L. (89,500 LBP) / Whish Money upon delivery')}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      💵 Dual Currency & Whish COD
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerTextInput('⚡ Trade-in your old phone for instant cash credit or upgrade')}
                      className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      🔄 Trade-In Program Banner
                    </button>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Live Banner Preview:
                  </span>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    {isBannerActiveInput ? (
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{bannerTextInput}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Banner is currently disabled</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {bannerSavedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Top Banner Updated Live!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Apply Banner to Storefront</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 4: STORE OVERVIEW & CONFIGURATION */}
        {activeTab === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            
            {/* 3D Stats Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                <div className="text-3xl font-black text-white font-display">{products.length}</div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{products.filter(p => p.inStock).length} in stock right now</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lebanese Exchange Rate</span>
                <div className="text-3xl font-black text-white font-display">89,500 LBP</div>
                <div className="text-[11px] text-slate-400 font-medium">Official Market Benchmark per $1 USD</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Dispatch</span>
                <div className="text-2xl font-black text-white font-display">+961 71 135 241</div>
                <div className="text-[11px] text-emerald-400 font-semibold">Direct 1-Click Ordering Active</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Coverage</span>
                <div className="text-3xl font-black text-white font-display">100% Lebanon</div>
                <div className="text-[11px] text-slate-400 font-medium">All 8 Governorates with Cash on Delivery</div>
              </div>
            </div>

            {/* Store Operational Info Box */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF0000]" />
                <span>Store Security & Admin Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold block">Administrator Access</span>
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Master Account Active & Secured
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold block">Store Retail Location</span>
                  <span className="text-white font-semibold">Lebanon, Chouf, Jadra Warehouse Store</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold block">Customer Support Email</span>
                  <span className="font-mono text-white font-bold">alaastoreon@gmail.com</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold block">Free Delivery Benchmark</span>
                  <span className="text-white font-bold">$150.00 USD (All Lebanon)</span>
                </div>
              </div>
            </div>

          </motion.div>
        )}
        </AnimatePresence>

      </main>

      {/* Product Add/Edit Form Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          productToEdit={editingProduct}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
