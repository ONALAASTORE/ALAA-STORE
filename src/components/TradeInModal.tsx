import React, { useState, useRef } from 'react';
import { 
  X, 
  Calculator, 
  MessageCircle,
  UploadCloud,
  Image as ImageIcon,
  Film,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Camera
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  whatsappNumber?: string;
}

interface UploadedMedia {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'image' | 'video';
  url: string;
  progress: number;
}

const TRADE_IN_DATABASE: Record<string, { models: string[]; baseValues: Record<string, number> }> = {
  Apple: {
    models: [
      'iPhone 16 Pro Max',
      'iPhone 16 Pro',
      'iPhone 16 Plus',
      'iPhone 16',
      'iPhone 15 Pro Max',
      'iPhone 15 Pro',
      'iPhone 15 Plus',
      'iPhone 15',
      'iPhone 14 Pro Max',
      'iPhone 14 Pro',
      'iPhone 14',
      'iPhone 13 Pro Max',
      'iPhone 13 Pro',
      'iPhone 13',
      'iPhone 12 Pro Max',
      'iPhone 12',
      'iPhone 11'
    ],
    baseValues: {
      'iPhone 16 Pro Max': 980,
      'iPhone 16 Pro': 850,
      'iPhone 16 Plus': 690,
      'iPhone 16': 620,
      'iPhone 15 Pro Max': 780,
      'iPhone 15 Pro': 650,
      'iPhone 15 Plus': 520,
      'iPhone 15': 480,
      'iPhone 14 Pro Max': 580,
      'iPhone 14 Pro': 490,
      'iPhone 14': 390,
      'iPhone 13 Pro Max': 440,
      'iPhone 13 Pro': 380,
      'iPhone 13': 310,
      'iPhone 12 Pro Max': 320,
      'iPhone 12': 220,
      'iPhone 11': 160
    }
  },
  Samsung: {
    models: [
      'Galaxy S24 Ultra',
      'Galaxy S24 Plus',
      'Galaxy S24',
      'Galaxy S23 Ultra',
      'Galaxy S23 Plus',
      'Galaxy S23',
      'Galaxy S22 Ultra',
      'Galaxy Z Fold 5',
      'Galaxy Z Flip 5'
    ],
    baseValues: {
      'Galaxy S24 Ultra': 750,
      'Galaxy S24 Plus': 520,
      'Galaxy S24': 430,
      'Galaxy S23 Ultra': 480,
      'Galaxy S23 Plus': 360,
      'Galaxy S23': 290,
      'Galaxy S22 Ultra': 310,
      'Galaxy Z Fold 5': 650,
      'Galaxy Z Flip 5': 380
    }
  },
  Xiaomi: {
    models: [
      'Xiaomi 14 Ultra',
      'Xiaomi 14 Pro',
      'Xiaomi 13 Ultra',
      'Xiaomi 13 Pro',
      'Xiaomi 13T Pro',
      'Xiaomi 12 Pro'
    ],
    baseValues: {
      'Xiaomi 14 Ultra': 620,
      'Xiaomi 14 Pro': 490,
      'Xiaomi 13 Ultra': 460,
      'Xiaomi 13 Pro': 340,
      'Xiaomi 13T Pro': 280,
      'Xiaomi 12 Pro': 210
    }
  }
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'video/mp4',
  'video/quicktime', // .mov
  'video/webm'
];

const MAX_FILE_SIZE_MB = 25;

export const TradeInModal: React.FC<TradeInModalProps> = ({
  isOpen,
  onClose,
  currency,
  whatsappNumber = '96171135241',
}) => {
  if (!isOpen) return null;

  const [brand, setBrand] = useState<'Apple' | 'Samsung' | 'Xiaomi'>('Apple');
  const [model, setModel] = useState(TRADE_IN_DATABASE['Apple'].models[0]);
  const [storage, setStorage] = useState('256GB');
  const [condition, setCondition] = useState<'flawless' | 'good' | 'fair' | 'cracked'>('flawless');
  const [batteryHealth, setBatteryHealth] = useState('>85% (Healthy)');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrice = TRADE_IN_DATABASE[brand]?.baseValues[model] || 350;

  // Calculate condition multiplier
  let conditionMultiplier = 1.0;
  if (condition === 'good') conditionMultiplier = 0.9;
  if (condition === 'fair') conditionMultiplier = 0.75;
  if (condition === 'cracked') conditionMultiplier = 0.5;

  // Storage bonus
  let storageBonus = 0;
  if (storage === '256GB') storageBonus = 30;
  if (storage === '512GB') storageBonus = 65;
  if (storage === '1TB') storageBonus = 110;

  // Battery health deduction
  let batteryAdjustment = 0;
  if (batteryHealth === '<80% (Service required)') batteryAdjustment = -40;

  const estimatedUSD = Math.max(50, Math.round((basePrice + storageBonus) * conditionMultiplier + batteryAdjustment));

  // Process selected or dropped files
  const handleProcessFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const newMediaItems: UploadedMedia[] = [];

    Array.from(files).forEach((file) => {
      // Check file size (25MB max)
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
        return;
      }

      // Check mime type or extension
      const isAllowed = ALLOWED_MIME_TYPES.includes(file.type) || 
        file.name.match(/\.(mp4|mov|webm|jpg|jpeg|png|webp)$/i);

      if (!isAllowed) {
        setUploadError(`File type not supported for "${file.name}". Please upload MP4, MOV, JPG, or PNG.`);
        return;
      }

      const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm)$/i) !== null;
      const objectUrl = URL.createObjectURL(file);

      newMediaItems.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        type: isVideo ? 'video' : 'image',
        url: objectUrl,
        progress: 100
      });
    });

    if (newMediaItems.length > 0) {
      setUploadedFiles(prev => [...prev, ...newMediaItems]);
    }
  };

  const handleRemoveMedia = (id: string) => {
    setUploadedFiles(prev => {
      const item = prev.find(p => p.id === id);
      if (item) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter(p => p.id !== id);
    });
  };

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
    if (e.dataTransfer.files) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const photoCount = uploadedFiles.filter(f => f.type === 'image').length;
  const videoCount = uploadedFiles.filter(f => f.type === 'video').length;

  const mediaSummaryText = uploadedFiles.length > 0 
    ? `${uploadedFiles.length} media attached (${photoCount} photos, ${videoCount} videos)` 
    : 'None attached yet';

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const whatsappTradeInMessage = encodeURIComponent(
    `Hello ON-ALAA-STORE! 🇱🇧\nI want to trade-in my device for a new upgrade:\n- Brand: ${brand}\n- Model: ${model}\n- Storage: ${storage}\n- Condition: ${condition.toUpperCase()}\n- Battery Health: ${batteryHealth}\n- Visual Proof: ${mediaSummaryText}\n- Estimated Credit: ~$${estimatedUSD} USD\n\nI will send the device photos/videos right here in our chat for your technician to confirm the appraisal!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#0F172A] text-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-800 p-5 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Close Trade-in estimator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-10">
          <div className="w-11 h-11 rounded-2xl bg-[#0066FF]/20 text-[#0066FF] flex items-center justify-center border border-[#0066FF]/40 shadow-sm shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                Trade-In Value Estimator
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0066FF] text-white">
                Lebanon 🇱🇧
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Get an instant valuation and submit visual verification for top-dollar trade credit
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {/* Step 1: Select Brand */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white text-[10px] flex items-center justify-center font-bold">1</span>
              <span>Select Brand:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Apple', 'Samsung', 'Xiaomi'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    setModel(TRADE_IN_DATABASE[b].models[0]);
                  }}
                  className={`py-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                    brand === b 
                      ? 'border-[#0066FF] bg-[#0066FF]/20 text-[#0066FF] shadow-sm shadow-[#0066FF]/20 ring-1 ring-[#0066FF]' 
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Device Model */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white text-[10px] flex items-center justify-center font-bold">2</span>
              <span>Device Model:</span>
            </label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white focus:border-[#0066FF] focus:outline-none text-xs font-semibold"
              >
                {TRADE_IN_DATABASE[brand].models.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Storage Capacity */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white text-[10px] flex items-center justify-center font-bold">3</span>
              <span>Storage Capacity:</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['128GB', '256GB', '512GB', '1TB'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStorage(st)}
                  className={`py-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    storage === st 
                      ? 'border-[#0066FF] bg-[#0066FF]/20 text-[#0066FF] ring-1 ring-[#0066FF]' 
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Physical Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white text-[10px] flex items-center justify-center font-bold">4</span>
              <span>Physical Condition:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'flawless', label: 'Flawless (No scratches)', desc: 'Screen & body in showroom condition' },
                { id: 'good', label: 'Good (Minor wear)', desc: 'Light micro-scratches, no dents' },
                { id: 'fair', label: 'Fair (Visible wear)', desc: 'Noticeable scuffs, fully functional' },
                { id: 'cracked', label: 'Cracked Glass / Back', desc: 'Damaged glass or defective components' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    condition === c.id 
                      ? 'border-[#0066FF] bg-[#0066FF]/15 text-white ring-1 ring-[#0066FF]' 
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{c.label}</span>
                    {condition === c.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF]" />}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Battery Health & Visual Verification (Updated Step) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#0066FF] text-white text-[10px] flex items-center justify-center font-bold">5</span>
                <span>Battery Health & Visual Verification:</span>
              </label>
              <span className="text-[10px] text-[#0066FF] font-semibold flex items-center gap-1">
                <Camera className="w-3 h-3" />
                <span>Photos / Video Proof</span>
              </span>
            </div>

            {/* Battery Health Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '>85% (Healthy)', label: '>85% (Healthy)' },
                { id: '80% - 85%', label: '80% - 85%' },
                { id: '<80% (Service required)', label: '<80% (Service required)' }
              ].map((bh) => (
                <button
                  key={bh.id}
                  type="button"
                  onClick={() => setBatteryHealth(bh.id)}
                  className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                    batteryHealth === bh.id
                      ? 'border-[#0066FF] bg-[#0066FF]/20 text-[#0066FF] ring-1 ring-[#0066FF]'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {bh.label}
                </button>
              ))}
            </div>

            {/* Responsive Multimedia Upload Section */}
            <div className="space-y-2 mt-2">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-[#0066FF] bg-[#0066FF]/10 scale-[1.01]'
                    : 'border-slate-700 hover:border-[#0066FF] bg-slate-900/60 hover:bg-slate-900/90'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/quicktime,video/webm"
                  onChange={(e) => handleProcessFiles(e.target.files)}
                  className="hidden"
                  id="tradein-media-upload-input"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#0066FF]/15 text-[#0066FF] flex items-center justify-center border border-[#0066FF]/30">
                    <UploadCloud className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">
                      Drag & drop photos or video clip here, or <span className="text-[#0066FF] underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Supports MP4, MOV, JPG, PNG, WEBP (Max 25MB per file)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      <ImageIcon className="w-3 h-3 text-[#0066FF]" />
                      <span>Front / Back / Sides</span>
                    </span>
                    <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md">
                      <Film className="w-3 h-3 text-cyan-400" />
                      <span>Screen Video (Optional)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Message if Validation Fails */}
              {uploadError && (
                <div className="flex items-center gap-2 text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Thumbnail Preview Grid */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Uploaded Visual Verification ({uploadedFiles.length} item{uploadedFiles.length > 1 ? 's' : ''})</span>
                    <button
                      type="button"
                      onClick={() => {
                        uploadedFiles.forEach(f => URL.revokeObjectURL(f.url));
                        setUploadedFiles([]);
                      }}
                      className="text-slate-400 hover:text-rose-400 transition text-[10px] cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {uploadedFiles.map((media) => (
                      <div
                        key={media.id}
                        className="group relative rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xs flex flex-col"
                      >
                        {/* Media Preview Box */}
                        <div className="relative w-full aspect-square bg-black flex items-center justify-center overflow-hidden">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                              <video
                                src={media.url}
                                className="w-full h-full object-cover opacity-80"
                                preload="metadata"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg">
                                  <Film className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Delete Action Badge */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMedia(media.id);
                            }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Type indicator */}
                          <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-[9px] font-mono px-1.5 py-0.5 rounded text-white border border-slate-700">
                            {media.type === 'image' ? 'IMG' : 'VIDEO'}
                          </div>
                        </div>

                        {/* File Details & Upload Status */}
                        <div className="p-1.5 bg-slate-900/90 text-left">
                          <p className="text-[10px] font-semibold text-slate-200 truncate" title={media.name}>
                            {media.name}
                          </p>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                            <span>{formatFileSize(media.size)}</span>
                            <span className="text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estimated Value Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#0A1A38] text-white p-5 rounded-2xl space-y-2 border border-[#0066FF]/30 shadow-lg">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Estimated Trade-In Credit</span>
              </span>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Live Quote 🇱🇧
              </span>
            </div>
            
            <div className="flex items-baseline justify-between pt-1">
              <div className="text-3xl font-black text-white font-display tracking-tight text-[#0066FF]">
                {formatPrice(estimatedUSD, currency)}
              </div>
              {currency === 'USD' && (
                <div className="text-xs text-slate-300 font-mono">
                  ≈ {formatPrice(estimatedUSD, 'LBP')}
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              Apply this direct credit toward purchasing any new iPhone, Samsung, MacBook, or gaming hardware. Swap instantly on delivery anywhere in Lebanon or visit our showroom!
            </p>
          </div>

          {/* WhatsApp Direct Submission Button */}
          <a
            href={`https://wa.me/${cleanWaNumber}?text=${whatsappTradeInMessage}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Submit Trade-In Request with Verification</span>
          </a>

          <div className="text-center text-[10px] text-slate-400">
            Official valuation confirmed within 15 minutes by our technical inspection team in Lebanon.
          </div>
        </div>
      </div>
    </div>
  );
};
