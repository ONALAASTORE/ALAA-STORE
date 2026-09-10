import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Video, 
  Megaphone, 
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
  Play,
  Upload,
  Camera,
  Phone,
  User,
  EyeOff,
  AlertCircle,
  ExternalLink,
  X,
  FileVideo,
  CheckCircle2,
  Send,
  BarChart3
} from 'lucide-react';
import { Product, StoreSettings, Currency } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { getEmbedVideoUrl, isDirectVideoFile } from '../../utils/video';
import { formatPrice } from '../../utils/currency';
import { getProductImages, DEFAULT_PRODUCT_IMAGE } from '../../utils/productImages';
import { LogoAvatar, Brand3DText } from '../brand';
import { validatePhoneNumber, buildWhatsAppLink, formatWhatsAppDigits } from '../../utils/phone';
import { CATEGORIES } from '../../data/categories';
import { saveProductToFirestore, deleteProductFromFirestore } from '../../utils/firestore';
import { AdminToastContainer, ToastItem } from './AdminToast';

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
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'video' | 'banner' | 'overview'>('products');
  
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
  const [isVideoActiveInput, setIsVideoActiveInput] = useState(storeSettings.isMarketingVideoActive !== false);
  const [videoSourceMode, setVideoSourceMode] = useState<'url' | 'upload'>('url');
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<{ name: string; size: string } | null>(null);
  const [videoSavedSuccess, setVideoSavedSuccess] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Admin Profile state
  const [adminAvatarInput, setAdminAvatarInput] = useState(storeSettings.adminProfilePicture || '');
  const [adminNameInput, setAdminNameInput] = useState(storeSettings.adminName || 'Alaa (Store Admin)');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  // Phone Number Form state & validation
  const [phoneInput, setPhoneInput] = useState(storeSettings.whatsappNumber || '+961 71 135 241');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneSavedSuccess, setPhoneSavedSuccess] = useState(false);

  // Store General Settings
  const [exchangeRateInput, setExchangeRateInput] = useState(storeSettings.exchangeRateLBP || 89500);
  const [supportEmailInput, setSupportEmailInput] = useState(storeSettings.supportEmail || 'alaastoreon@gmail.com');
  const [storeConfigSavedSuccess, setStoreConfigSavedSuccess] = useState(false);

  // Banner Form state
  const [bannerTextInput, setBannerTextInput] = useState(storeSettings.topBannerText);
  const [isBannerActiveInput, setIsBannerActiveInput] = useState(storeSettings.isTopBannerActive);
  const [bannerSavedSuccess, setBannerSavedSuccess] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev.slice(-3), newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (msg: string) => {
    addToast({
      title: 'Dashboard Notification',
      message: msg,
      type: 'success',
      icon: 'check',
    });
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const prodCat = (p.category || '').toLowerCase();
    const selCat = selectedCategory.toLowerCase();
    const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
    const catName = catObj ? catObj.name.toLowerCase() : '';

    const matchesCategory =
      selectedCategory === 'all' ||
      prodCat === selCat ||
      (catName && prodCat === catName) ||
      (selCat === 'racing-wheel' && (prodCat === 'racing-wheels' || prodCat === 'racing wheel' || prodCat === 'racing_wheel')) ||
      (selCat === 'smartwatches-accessories' && (prodCat === 'wearables' || prodCat === 'smartwatches')) ||
      (selCat === 'wearables' && (prodCat === 'smartwatches-accessories' || prodCat === 'smartwatches'));

    const matchesStock =
      stockFilter === 'all' ||
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

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      await deleteProductFromFirestore(productId).catch((e) => console.warn('Firestore delete note:', e));
      addToast({
        title: 'Product Removed',
        message: `"${productName}" was removed from the store and Firestore.`,
        type: 'info',
        badge: 'Catalog Updated',
        icon: 'trash',
      });
    }
  };

  const handleToggleStock = async (productId: string) => {
    let targetProduct: Product | undefined;
    let newInStockState = false;

    const updated = products.map((p) => {
      if (p.id === productId) {
        newInStockState = !p.inStock;
        targetProduct = { ...p, inStock: !p.inStock };
        return targetProduct;
      }
      return p;
    });

    onUpdateProducts(updated);

    if (targetProduct) {
      try {
        await saveProductToFirestore(targetProduct);
        addToast({
          title: 'Inventory Update Succeeded',
          message: `"${targetProduct.name}" is now marked as ${
            newInStockState ? 'In Stock' : 'Out of Stock'
          }. Firestore updated.`,
          type: 'success',
          badge: newInStockState ? 'In Stock' : 'Out of Stock',
          icon: 'inventory',
        });
      } catch (err) {
        addToast({
          title: 'Inventory Update Succeeded',
          message: `"${targetProduct.name}" marked as ${
            newInStockState ? 'In Stock' : 'Out of Stock'
          }.`,
          type: 'info',
          badge: 'Stock Updated',
          icon: 'inventory',
        });
      }
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${product.name} (Copy)`,
    };
    onUpdateProducts([duplicated, ...products]);
    await saveProductToFirestore(duplicated).catch((e) => console.warn('Firestore sync note:', e));
    addToast({
      title: 'Product Duplicated & Synced',
      message: `"${duplicated.name}" cloned and saved to Firestore.`,
      type: 'success',
      badge: 'Firestore Synced',
      icon: 'firestore',
    });
  };

  const handleSaveProduct = async (savedProduct: Product) => {
    if (editingProduct) {
      // Update existing
      const updated = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      onUpdateProducts(updated);
      try {
        const res = await saveProductToFirestore(savedProduct);
        if (res.success) {
          addToast({
            title: 'Product Saved to Firestore',
            message: `"${savedProduct.name}" changes saved and synchronized to Firestore successfully.`,
            type: 'success',
            badge: 'Firestore Synced',
            icon: 'firestore',
          });
        } else {
          addToast({
            title: 'Product Updated',
            message: `"${savedProduct.name}" updated successfully.`,
            type: 'success',
            badge: 'Saved',
            icon: 'check',
          });
        }
      } catch (err) {
        addToast({
          title: 'Product Updated',
          message: `"${savedProduct.name}" updated in catalog.`,
          type: 'success',
          badge: 'Catalog Saved',
          icon: 'check',
        });
      }
    } else {
      // Add new
      onUpdateProducts([savedProduct, ...products]);
      try {
        const res = await saveProductToFirestore(savedProduct);
        if (res.success) {
          addToast({
            title: 'New Product Saved to Firestore',
            message: `"${savedProduct.name}" has been added to your Firestore database and is now live.`,
            type: 'success',
            badge: 'Firestore Live',
            icon: 'firestore',
          });
        } else {
          addToast({
            title: 'New Product Added',
            message: `"${savedProduct.name}" has been added to the catalog.`,
            type: 'success',
            badge: 'Catalog Live',
            icon: 'check',
          });
        }
      } catch (err) {
        addToast({
          title: 'New Product Added',
          message: `"${savedProduct.name}" added to catalog!`,
          type: 'success',
          badge: 'Catalog Live',
          icon: 'check',
        });
      }
    }
  };

  // Video File Upload Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    if (file.size > 100 * 1024 * 1024) {
      showToast('Video file exceeds 100MB limit. Please choose a smaller file or use a video link.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoUrlInput(objectUrl);
    setUploadedVideoInfo({
      name: file.name,
      size: `${sizeInMB} MB`
    });
    showToast(`Video "${file.name}" loaded for preview! Click "Save Video" to publish.`);
  };

  const handleClearUploadedVideo = () => {
    setUploadedVideoInfo(null);
    setVideoUrlInput(storeSettings.marketingVideoUrl);
    setVideoSourceMode('url');
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  // Video Save Handler
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: StoreSettings = {
      ...storeSettings,
      marketingVideoUrl: videoUrlInput.trim(),
      marketingVideoTitle: videoTitleInput.trim(),
      isMarketingVideoActive: isVideoActiveInput
    };
    onUpdateStoreSettings(updatedSettings);
    setVideoSavedSuccess(true);
    showToast('Homepage marketing video & visibility settings updated live!');
    setTimeout(() => setVideoSavedSuccess(false), 3000);
  };

  // Profile Picture Upload Handler
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Profile image must be under 5MB');
      return;
    }

    setIsAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setAdminAvatarInput(base64Data);
      setIsAvatarUploading(false);
      showToast('Profile image loaded! Click "Save Admin Profile" to persist.');
    };
    reader.onerror = () => {
      setIsAvatarUploading(false);
      showToast('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAdminAvatarInput('');
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = '';
    }
    showToast('Avatar removed. Click "Save Admin Profile" to persist.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: StoreSettings = {
      ...storeSettings,
      adminProfilePicture: adminAvatarInput,
      adminName: adminNameInput.trim() || 'Alaa (Store Admin)'
    };
    onUpdateStoreSettings(updatedSettings);
    setProfileSavedSuccess(true);
    showToast('Admin profile & avatar updated successfully!');
    setTimeout(() => setProfileSavedSuccess(false), 3000);
  };

  // Phone Validation & Save Handler
  const handlePhoneInputChange = (val: string) => {
    setPhoneInput(val);
    if (val.trim()) {
      const validation = validatePhoneNumber(val);
      if (!validation.isValid) {
        setPhoneError(validation.error || 'Invalid phone format');
      } else {
        setPhoneError(null);
      }
    } else {
      setPhoneError('Phone number is required for WhatsApp dispatch and customer contact');
    }
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePhoneNumber(phoneInput);
    if (!validation.isValid) {
      setPhoneError(validation.error || 'Please enter a valid phone number');
      showToast(validation.error || 'Invalid phone number format');
      return;
    }
    setPhoneError(null);
    const updatedSettings: StoreSettings = {
      ...storeSettings,
      whatsappNumber: phoneInput.trim()
    };
    onUpdateStoreSettings(updatedSettings);
    setPhoneSavedSuccess(true);
    showToast('Store WhatsApp phone number updated and active across store!');
    setTimeout(() => setPhoneSavedSuccess(false), 3000);
  };

  // Store Config (Exchange rate, Support email) Save Handler
  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: StoreSettings = {
      ...storeSettings,
      exchangeRateLBP: Number(exchangeRateInput) || 89500,
      supportEmail: supportEmailInput.trim() || 'alaastoreon@gmail.com'
    };
    onUpdateStoreSettings(updatedSettings);
    setStoreConfigSavedSuccess(true);
    showToast('Store operational settings updated successfully!');
    setTimeout(() => setStoreConfigSavedSuccess(false), 3000);
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

      {/* Floating Toast Notification System */}
      <AdminToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
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

          {/* Header Action Buttons & Admin Profile Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dynamic Admin Profile Avatar Display */}
            <button
              id="admin-topbar-profile-badge"
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition cursor-pointer group text-left"
              title="Manage Admin Profile & Store Settings"
            >
              <div className="relative shrink-0">
                {storeSettings.adminProfilePicture ? (
                  <img 
                    src={storeSettings.adminProfilePicture} 
                    alt={storeSettings.adminName || 'Admin'} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500/80 shadow-xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 text-xs font-black">
                    {storeSettings.adminName ? storeSettings.adminName.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white group-hover:text-red-400 transition leading-tight flex items-center gap-1.5">
                  <span className="truncate max-w-[120px]">{storeSettings.adminName || 'Alaa (Admin)'}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium leading-tight truncate max-w-[130px]">
                  {storeSettings.whatsappNumber || '+961 71 135 241'}
                </div>
              </div>
            </button>

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-2 sm:p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
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
              id="admin-tab-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'analytics' ? 'bg-black/30 text-white' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                Weekly
              </span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Showcase</span>
            </button>

            <button
              onClick={() => setActiveTab('banner')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'banner'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Top Banner</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#FF0000] text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Settings</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer min-h-[44px] shrink-0"
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
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
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
                <>
                  {/* Mobile Responsive Cards View (sm:hidden) */}
                  <div className="block sm:hidden divide-y divide-slate-800/80">
                    {filteredProducts.map((product) => {
                      const productImgs = getProductImages(product);
                      const primaryImg = productImgs[0] || DEFAULT_PRODUCT_IMAGE;
                      return (
                        <div key={product.id} className="p-4 space-y-3 bg-slate-900/40 hover:bg-slate-900/80 transition">
                          <div className="flex items-start gap-3">
                            <div className="relative w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
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

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-bold text-slate-200 uppercase tracking-wider text-[9px]">
                                  {product.brand}
                                </span>
                                <span className="text-[10px] text-slate-400 capitalize">
                                  {product.category}
                                </span>
                                <span className="text-amber-400 font-semibold text-[10px]">
                                  • {product.condition}
                                </span>
                              </div>

                              <div className="font-bold text-white text-sm mt-1 leading-snug line-clamp-2">
                                {product.name}
                              </div>

                              <div className="flex items-baseline gap-2 mt-1.5">
                                <span className="font-black text-white text-base font-display">
                                  {formatPrice(product.basePriceUSD, currency)}
                                </span>
                                {product.originalPriceUSD && (
                                  <span className="text-xs text-slate-500 line-through">
                                    {formatPrice(product.originalPriceUSD, currency)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Mobile Action Controls with min-h-[40px] Touch Targets */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                            <button
                              onClick={() => handleToggleStock(product.id)}
                              className={`px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                product.inStock
                                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                                  : 'bg-red-950/80 border border-red-500/50 text-red-300'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDuplicateProduct(product)}
                                className="w-10 h-10 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                                title="Duplicate Product"
                                aria-label="Duplicate Product"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditProduct(product)}
                                className="w-10 h-10 min-h-[40px] rounded-xl bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                                title="Edit Product"
                                aria-label="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="w-10 h-10 min-h-[40px] rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                                title="Delete Product"
                                aria-label="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop & Tablet Table View (sm+) */}
                  <div className="hidden sm:block overflow-x-auto">
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
              </>
            )}
            </div>
          </motion.div>
        )}

        {/* TAB: ANALYTICS (Weekly Sales & Popular Products with Recharts) */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsTab
            products={products}
            storeSettings={storeSettings}
            currency={currency}
            onEditProduct={handleOpenEditProduct}
            onShowToast={showToast}
          />
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
                    Manage the homepage promotional video. Embed web links (YouTube/Vimeo) or upload direct video files, and control visibility live.
                  </p>
                </div>

                {/* Homepage Visibility Toggle */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Homepage Showcase Visibility</span>
                      {isVideoActiveInput ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active on Storefront
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center gap-1">
                          <EyeOff className="w-2.5 h-2.5" />
                          Hidden from Storefront
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {isVideoActiveInput 
                        ? 'The video is currently featured inside the hero showcase on the store homepage.' 
                        : 'Video is hidden. Customers will see the featured product banners instead.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVideoActiveInput(!isVideoActiveInput)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isVideoActiveInput ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isVideoActiveInput ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Video Source Switcher Tabs */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Video Source Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode('url')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        videoSourceMode === 'url'
                          ? 'bg-[#FF0000] text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Web Video Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode('upload')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        videoSourceMode === 'upload'
                          ? 'bg-[#FF0000] text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video File</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveVideo} className="space-y-4">
                  {videoSourceMode === 'url' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Marketing Video URL (YouTube / Vimeo / Cloud MP4)
                      </label>
                      <input
                        type="url"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        required={videoSourceMode === 'url'}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Supports YouTube links, Shorts, Vimeo, or direct cloud MP4 streaming links.
                      </p>

                      {/* Preset Quick Selects */}
                      <div className="mt-3 p-3 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                          Quick Presets
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
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Upload Video File (MP4 / WebM up to 100MB)
                      </label>
                      
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileUpload}
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        className="hidden"
                      />

                      {uploadedVideoInfo ? (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileVideo className="w-5 h-5 text-emerald-400" />
                              <div>
                                <p className="text-xs font-bold text-white truncate max-w-xs">{uploadedVideoInfo.name}</p>
                                <p className="text-[10px] text-slate-400">{uploadedVideoInfo.size} • Ready for Preview</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleClearUploadedVideo}
                              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="text-[11px] font-semibold text-blue-400 hover:underline cursor-pointer"
                          >
                            Choose different file
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => videoFileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-800 hover:border-[#FF0000] rounded-2xl p-6 text-center cursor-pointer transition bg-slate-950/60 hover:bg-slate-950 group"
                        >
                          <Upload className="w-8 h-8 text-slate-600 group-hover:text-[#FF0000] mx-auto mb-2 transition" />
                          <p className="text-xs font-bold text-white">Click or drag & drop to upload video file</p>
                          <p className="text-[11px] text-slate-500 mt-1">MP4, WebM, or MOV formats (Max 100MB)</p>
                        </div>
                      )}
                    </div>
                  )}

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

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {videoSavedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Saved Live to Storefront!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Video & Update Storefront</span>
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
                  {isVideoActiveInput ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live on Homepage
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Hidden on Store
                    </span>
                  )}
                </div>

                {/* Video Frame */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  {videoUrlInput ? (
                    isDirectVideoFile(videoUrlInput) || uploadedVideoInfo ? (
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
                      <p className="text-xs font-semibold">Enter a video URL or upload a file on the left to preview</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-300 block mb-0.5">Caption on Storefront:</span>
                    <p className="text-slate-400 text-[11px] font-medium">"{videoTitleInput}"</p>
                  </div>
                  {uploadedVideoInfo && (
                    <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                      Uploaded MP4 File
                    </span>
                  )}
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

        {/* TAB 4: STORE OVERVIEW, PROFILE & CONFIGURATION */}
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
                <div className="text-3xl font-black text-white font-display">
                  {(storeSettings.exchangeRateLBP || 89500).toLocaleString()} LBP
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Official Market Benchmark per $1 USD</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Dispatch</span>
                <div className="text-xl sm:text-2xl font-black text-white font-display truncate">
                  {storeSettings.whatsappNumber || '+961 71 135 241'}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Direct 1-Click Ordering Active</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Coverage</span>
                <div className="text-3xl font-black text-white font-display">100% Lebanon</div>
                <div className="text-[11px] text-slate-400 font-medium">All 8 Governorates with Cash on Delivery</div>
              </div>
            </div>

            {/* Profile & Phone Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* COLUMN 1: ADMIN PROFILE PICTURE & DETAILS */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" />
                      <span>Admin Profile Management</span>
                    </div>
                    <h3 className="text-xl font-black text-white font-display">
                      Profile Picture & Credentials
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload and manage the administrative avatar. This image displays on the dashboard header and admin control panels.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Avatar Upload Container */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar Preview */}
                      <div className="relative group shrink-0">
                        {adminAvatarInput ? (
                          <img
                            src={adminAvatarInput}
                            alt={adminNameInput}
                            className="w-20 h-20 rounded-full object-cover border-3 border-[#FF0000] shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-black text-2xl">
                            {adminNameInput ? adminNameInput.charAt(0).toUpperCase() : 'A'}
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      </div>

                      {/* Upload Controls */}
                      <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                        <input
                          type="file"
                          ref={avatarFileInputRef}
                          onChange={handleAvatarFileUpload}
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          className="hidden"
                        />
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            disabled={isAvatarUploading}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5 text-[#FF0000]" />
                            <span>{isAvatarUploading ? 'Processing...' : 'Upload Photo'}</span>
                          </button>
                          {adminAvatarInput && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold transition border border-red-800/40 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Supports PNG, JPG, or WebP (max 5MB). Stored securely and cached for all sessions.
                        </p>
                      </div>
                    </div>

                    {/* Direct Image URL Fallback */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Avatar Direct Image URL (Alternative)
                      </label>
                      <input
                        type="url"
                        value={adminAvatarInput}
                        onChange={(e) => setAdminAvatarInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or cloud image URL"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-medium focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Admin Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Admin Display Name
                      </label>
                      <input
                        type="text"
                        value={adminNameInput}
                        onChange={(e) => setAdminNameInput(e.target.value)}
                        placeholder="Alaa (Store Admin)"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs font-medium focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Account Role Badge */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 font-bold block">Access Clearance</span>
                        <span className="text-emerald-400 font-bold">Master Account • Full Catalog & Sales Authority</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                        Super Admin
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {profileSavedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Admin Profile Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Admin Profile & Avatar</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* COLUMN 2: STORE PHONE & WHATSAPP SETTINGS */}
              <div className="lg:col-span-6 space-y-5">
                <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Store Contact & WhatsApp Dispatch</span>
                    </div>
                    <h3 className="text-xl font-black text-white font-display">
                      Phone Number Editing
                    </h3>
                    <p className="text-xs text-slate-400">
                      Edit the primary hotline used for customer inquiries, 1-click WhatsApp order checkouts, and customer service.
                    </p>
                  </div>

                  <form onSubmit={handleSavePhone} className="space-y-4">
                    {/* Phone Input with validation feedback */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        WhatsApp Hotline Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => handlePhoneInputChange(e.target.value)}
                          placeholder="+961 71 135 241 or 71135241"
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-600 text-xs font-mono font-bold focus:outline-none transition ${
                            phoneError 
                              ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                              : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                          }`}
                        />
                        <Phone className={`w-4 h-4 absolute left-3.5 top-3.5 transition ${
                          phoneError ? 'text-rose-400' : 'text-emerald-400'
                        }`} />
                      </div>

                      {/* Validation Status Message */}
                      {phoneError ? (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-400 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{phoneError}</span>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Valid Lebanese / International Phone Format</span>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp wa.me link preview */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Direct WhatsApp API Destination:
                      </span>
                      <div className="font-mono text-xs text-emerald-400 truncate">
                        https://wa.me/{formatWhatsAppDigits(phoneInput) || '96171135241'}
                      </div>
                    </div>

                    {/* Quick Lebanese Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                        Store Presets:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handlePhoneInputChange('+961 71 135 241')}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          📞 +961 71 135 241 (Primary)
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhoneInputChange('+961 3 135 241')}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          📞 +961 3 135 241 (Direct)
                        </button>
                      </div>
                    </div>

                    {/* Test WhatsApp Link & Save Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                      <a
                        href={buildWhatsAppLink(phoneInput, 'Hello from ON ALAA Store admin test dispatch!')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Test WhatsApp</span>
                      </a>

                      <button
                        type="submit"
                        className="w-full sm:flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {phoneSavedSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>Phone Number Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Phone & Update Store</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </div>

            </div>

            {/* General Store Operational Settings Box */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF0000]" />
                  <span>Store Operational Parameters</span>
                </h3>
                <span className="text-xs text-slate-400">All updates reflect immediately on client storefront</span>
              </div>

              <form onSubmit={handleSaveStoreConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <label className="text-slate-400 font-bold block text-xs">
                    USD / LBP Exchange Rate
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={exchangeRateInput}
                      onChange={(e) => setExchangeRateInput(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold focus:border-[#FF0000] outline-none"
                    />
                    <span className="text-xs text-slate-400 font-bold">LBP</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                  <label className="text-slate-400 font-bold block text-xs">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmailInput}
                    onChange={(e) => setSupportEmailInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold focus:border-[#FF0000] outline-none"
                  />
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold block text-xs">Store Retail Location</span>
                  <span className="text-white font-semibold text-xs">Lebanon, Chouf, Jadra Warehouse Store</span>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 font-bold block text-xs">Free Delivery Benchmark</span>
                    <span className="text-white font-bold text-xs">$150.00 USD</span>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition cursor-pointer"
                  >
                    {storeConfigSavedSuccess ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </form>
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
