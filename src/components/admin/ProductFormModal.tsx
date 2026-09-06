import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Tag, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  Link2,
  FileText
} from 'lucide-react';
import { Product } from '../../types';
import { getProductImages, DEFAULT_PRODUCT_IMAGE, cleanImageUrls } from '../../utils/productImages';


interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}) => {
  // Base fields
  const [name, setName] = useState(productToEdit?.name || '');
  const [brand, setBrand] = useState(productToEdit?.brand || 'Apple');
  const [category, setCategory] = useState(productToEdit?.category || 'smartphones');
  const [basePriceUSD, setBasePriceUSD] = useState<number>(productToEdit?.basePriceUSD || 0);
  const [originalPriceUSD, setOriginalPriceUSD] = useState<number | ''>(
    productToEdit?.originalPriceUSD || ''
  );
  
  // Multi-image management state
  const [imagesList, setImagesList] = useState<string[]>(() => {
    return getProductImages(productToEdit);
  });
  const [singleUrlInput, setSingleUrlInput] = useState('');
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [isBulkUrlOpen, setIsBulkUrlOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(productToEdit?.description || '');
  const [inStock, setInStock] = useState<boolean>(productToEdit ? productToEdit.inStock : true);
  const [condition, setCondition] = useState<'Brand New (Sealed)' | 'Open Box' | 'Certified Pre-Owned'>(
    productToEdit?.condition || 'Brand New (Sealed)'
  );
  const [warranty, setWarranty] = useState(productToEdit?.warranty || '1 Year Official Agency Warranty');

  // Bulleted Description Points / Features
  const [features, setFeatures] = useState<string[]>(
    productToEdit?.features && productToEdit.features.length > 0
      ? [...productToEdit.features]
      : ['Official Agency Warranty included', 'High performance battery', 'Original sealed packaging']
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Dynamic Custom Key-Value Columns / Attributes (e.g. Color, Storage, Warranty, RAM, Screen)
  const initialSpecs = productToEdit?.specs
    ? Object.entries(productToEdit.specs).map(([key, value]) => ({ key, value }))
    : [
        { key: 'Storage', value: '256GB' },
        { key: 'Color', value: 'Black Titanium' },
        { key: 'Warranty', value: '1 Year Official Lebanese Warranty' }
      ];
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>(initialSpecs);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Error validation
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handlers for Features / Bullet points
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Handlers for Dynamic Attributes
  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setSpecsList([...specsList, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index: number) => {
    setSpecsList(specsList.filter((_, i) => i !== index));
  };

  const handleUpdateSpec = (index: number, key: string, value: string) => {
    const updated = [...specsList];
    updated[index] = { key, value };
    setSpecsList(updated);
  };

  // Multi-image file processing
  const processImageFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setImageError('Please select valid image files (JPG, PNG, WebP, GIF, SVG)');
      return;
    }
    setUploadLoading(true);
    setImageError('');

    const fileReaders = validFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed reading image file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((newImages) => {
        setImagesList((prev) => {
          const filteredPrev = prev.filter((img) => img !== DEFAULT_PRODUCT_IMAGE);
          return [...filteredPrev, ...newImages];
        });
      })
      .catch((err) => {
        console.error('File upload error:', err);
        setImageError('Could not process some image files.');
      })
      .finally(() => {
        setUploadLoading(false);
      });
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  // Add single image URL
  const handleAddSingleUrl = () => {
    const trimmed = singleUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setImageError('Please enter a valid image URL starting with http:// or https://');
      return;
    }
    setImagesList((prev) => {
      const filteredPrev = prev.filter((img) => img !== DEFAULT_PRODUCT_IMAGE);
      if (filteredPrev.includes(trimmed)) return filteredPrev;
      return [...filteredPrev, trimmed];
    });
    setSingleUrlInput('');
    setImageError('');
  };

  // Add bulk image URLs simultaneously
  const handleAddBulkUrls = () => {
    const trimmed = bulkUrlsInput.trim();
    if (!trimmed) return;
    const extracted = trimmed
      .split(/[\n,;]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/')));

    if (extracted.length === 0) {
      setImageError('No valid image URLs found. Please ensure URLs start with http:// or https://');
      return;
    }

    setImagesList((prev) => {
      const filteredPrev = prev.filter((img) => img !== DEFAULT_PRODUCT_IMAGE);
      const combined = [...filteredPrev];
      for (const url of extracted) {
        if (!combined.includes(url)) {
          combined.push(url);
        }
      }
      return combined;
    });

    setBulkUrlsInput('');
    setIsBulkUrlOpen(false);
    setImageError('');
  };

  // Move image to primary position (index 0)
  const handleSetPrimary = (index: number) => {
    if (index <= 0 || index >= imagesList.length) return;
    setImagesList((prev) => {
      const target = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [target, ...remaining];
    });
  };

  // Reorder image left or right
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imagesList.length) return;
    setImagesList((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Remove individual image
  const handleRemoveImage = (index: number) => {
    setImagesList((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.length > 0 ? filtered : [DEFAULT_PRODUCT_IMAGE];
    });
  };

  // Save product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product title is required');
      return;
    }
    if (basePriceUSD <= 0) {
      setErrorMsg('Please specify a valid price in USD (greater than 0)');
      return;
    }

    // Clean and normalize multi-image list
    const finalImages = cleanImageUrls(imagesList);
    const primaryImage = finalImages[0] || DEFAULT_PRODUCT_IMAGE;

    // Compile dynamic specs object
    const compiledSpecs: Record<string, string> = {};
    specsList.forEach(({ key, value }) => {
      if (key.trim()) {
        compiledSpecs[key.trim()] = value.trim();
      }
    });

    const newId = productToEdit?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const savedProduct: Product = {
      id: newId,
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      subcategory: productToEdit?.subcategory || 'Electronics',
      description: description.trim() || `${name} with official Lebanese warranty and nationwide express delivery.`,
      features: features.length > 0 ? features : ['Official Lebanese Agency Warranty', 'Brand New Original Unit'],
      specs: compiledSpecs,
      image: primaryImage,
      galleryImages: finalImages,
      imageUrls: finalImages,
      image_urls: finalImages,
      additional_images: finalImages.slice(1),
      basePriceUSD: Number(basePriceUSD),
      originalPriceUSD: originalPriceUSD !== '' && Number(originalPriceUSD) > Number(basePriceUSD) ? Number(originalPriceUSD) : undefined,
      variants: productToEdit?.variants?.length 
        ? productToEdit.variants 
        : [
            {
              id: `${newId}-standard`,
              name: 'Standard Option',
              priceUSD: Number(basePriceUSD),
              inStock: inStock
            }
          ],
      rating: productToEdit?.rating || 4.9,
      reviewCount: productToEdit?.reviewCount || 12,
      condition: condition,
      warranty: warranty.trim() || '1 Year Official Agency Warranty',
      inStock: inStock,
      isFeatured: productToEdit?.isFeatured ?? true,
      tags: productToEdit?.tags || [brand, category, 'Trending'],
      freeDelivery: basePriceUSD >= 150
    };

    onSave(savedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{productToEdit ? 'Edit Product' : 'Add New Product'}</span>
          </div>
          <h3 className="text-2xl font-black text-white font-display">
            {productToEdit ? `Updating: ${productToEdit.name}` : 'Create Catalog Product'}
          </h3>
          <p className="text-xs text-slate-400">
            Fill in the details below. All updates reflect instantly on the public store.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF0000] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Product Title / Model Name <span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-[#FF0000] outline-none"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Sony">Sony (PlayStation & Audio)</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Honor">Honor</option>
                <option value="Anker">Anker</option>
                <option value="Google">Google Pixel</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Other">Other Brand</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-[#FF0000] outline-none"
              >
                <option value="smartphones">Smartphones</option>
                <option value="tablets">iPads & Tablets</option>
                <option value="laptops">MacBooks & Laptops</option>
                <option value="gaming">PlayStation & Gaming</option>
                <option value="audio">AirPods & Headphones</option>
                <option value="wearables">Apple Watch & Smartwatches</option>
                <option value="chargers">Fast Chargers & GaN Power</option>
                <option value="accessories">Cases & Screen Protectors</option>
              </select>
            </div>

            {/* Base Price USD */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Base Price (USD) <span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  value={basePriceUSD || ''}
                  onChange={(e) => setBasePriceUSD(parseFloat(e.target.value) || 0)}
                  placeholder="1280"
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] outline-none"
                />
              </div>
            </div>

            {/* Discount / Original Price USD */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Original / Strike Price (USD) <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs font-bold">$</span>
                <input
                  type="number"
                  step="any"
                  value={originalPriceUSD}
                  onChange={(e) => setOriginalPriceUSD(e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="1350"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:border-[#FF0000] outline-none"
                />
              </div>
            </div>

            {/* Multi-Image Upload & Media Gallery Section */}
            <div className="sm:col-span-2 space-y-3 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-[#FF0000] flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white block">
                      Product Images & Media Gallery
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Upload multiple image files or enter image URLs. The first image is highlighted as the ★ Primary Cover.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                    {imagesList.length} {imagesList.length === 1 ? 'image' : 'images'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBulkUrlOpen(!isBulkUrlOpen)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-slate-900 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Link2 className="w-3 h-3 text-[#FF0000]" />
                    <span>{isBulkUrlOpen ? 'Hide Bulk URLs' : 'Paste Multiple URLs'}</span>
                  </button>
                </div>
              </div>

              {/* Error Notification */}
              {imageError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{imageError}</span>
                </div>
              )}

              {/* Drag & Drop File Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-[#FF0000] bg-red-950/20 text-white'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-slate-300'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processImageFiles(e.target.files);
                    }
                  }}
                />
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white">
                  <Upload className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {uploadLoading ? 'Processing files...' : 'Click to browse or drag & drop multiple image files'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Supports selecting multiple PNG, JPG, WebP, GIF files simultaneously
                  </div>
                </div>
              </div>

              {/* Bulk URLs Input Drawer */}
              {isBulkUrlOpen && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 animate-in fade-in">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Paste Multiple URLs Simultaneously</span>
                  </label>
                  <textarea
                    rows={3}
                    value={bulkUrlsInput}
                    onChange={(e) => setBulkUrlsInput(e.target.value)}
                    placeholder="Paste image URLs separated by newlines, commas, or spaces:&#10;https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono placeholder-slate-600 focus:border-[#FF0000] outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBulkUrlOpen(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddBulkUrls}
                      className="px-3 py-1.5 bg-[#FF0000] hover:bg-red-600 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Import All URLs
                    </button>
                  </div>
                </div>
              )}

              {/* Single URL Quick Add Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="url"
                    value={singleUrlInput}
                    onChange={(e) => setSingleUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSingleUrl();
                      }
                    }}
                    placeholder="Enter image URL (e.g. https://... or CDN link)"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSingleUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              </div>

              {/* Uploaded Images Gallery Grid */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Current Gallery Images ({imagesList.length})</span>
                  {imagesList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setImagesList([DEFAULT_PRODUCT_IMAGE])}
                      className="text-[10px] text-slate-500 hover:text-red-400 transition"
                    >
                      Reset Images
                    </button>
                  )}
                </div>

                {imagesList.length === 0 ? (
                  <div className="p-6 text-center border border-slate-800 rounded-xl bg-slate-950/40 text-slate-500 text-xs">
                    No images added yet. Upload files or enter URLs above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imagesList.map((imgUrl, index) => (
                      <div
                        key={index}
                        className={`group relative rounded-xl border p-2 bg-slate-950 flex flex-col justify-between overflow-hidden transition ${
                          index === 0
                            ? 'border-amber-500/80 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Primary Badge or Make Primary Button */}
                        <div className="flex items-center justify-between mb-1.5 z-10">
                          {index === 0 ? (
                            <span className="bg-amber-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-black" />
                              Primary Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(index)}
                              className="text-[9px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 cursor-pointer"
                              title="Set this image as primary cover"
                            >
                              <Star className="w-2.5 h-2.5" />
                              Make Primary
                            </button>
                          )}
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            #{index + 1}
                          </span>
                        </div>

                        {/* Image Preview Canvas */}
                        <div className="aspect-square w-full rounded-lg bg-slate-900/60 p-2 flex items-center justify-center overflow-hidden mb-2">
                          <img
                            src={imgUrl}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-contain rounded"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                            }}
                          />
                        </div>

                        {/* Card Footer: Reordering & Delete Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveImage(index, 'left')}
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                              title="Move earlier"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === imagesList.length - 1}
                              onClick={() => handleMoveImage(index, 'right')}
                              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                              title="Move later"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 rounded bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 transition cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Condition & Inventory Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-[#FF0000] outline-none"
              >
                <option value="Brand New (Sealed)">Brand New (Sealed)</option>
                <option value="Open Box">Open Box</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Inventory Stock Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex-1">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF0000] focus:ring-[#FF0000] bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    {inStock ? 'Available In Stock' : 'Mark Out of Stock'}
                  </span>
                </label>
              </div>
            </div>

            {/* Warranty field */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Official Warranty Policy
              </label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="1 Year Official Agency Warranty (Apple / Samsung / Sony)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Overview Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary highlighting the key flagship features..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:border-[#FF0000] outline-none resize-none"
              />
            </div>
          </div>

          {/* Section: Bulleted Description Points / Highlights */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Bulleted Feature Points ({features.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Key highlights shown on the product card & detailed specs page
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-slate-500 font-bold">•</span>
                  <span className="flex-1 text-slate-200 truncate">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new feature input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add bullet highlight (e.g. 48MP Main Camera with 5x Optical Zoom)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>
          </div>

          {/* Section: Dynamic Key-Value Columns / Attributes */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>Dynamic Custom Columns & Attributes ({specsList.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Custom properties such as Color, Storage, RAM, Battery, Camera, Display
                </p>
              </div>
            </div>

            {/* List of custom key-value pairs */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {specsList.map((spec, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleUpdateSpec(idx, e.target.value, spec.value)}
                      placeholder="Attribute Name"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs focus:border-[#FF0000] outline-none"
                    />
                  </div>
                  <div className="col-span-7">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, spec.key, e.target.value)}
                      placeholder="Attribute Value"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-[#FF0000] outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new attribute input row */}
            <div className="grid grid-cols-12 gap-2 pt-1">
              <div className="col-span-4">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="New Column (e.g. Storage)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
                />
              </div>
              <div className="col-span-6">
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g. 512GB NVMe)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-[#FF0000] outline-none"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0000] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
