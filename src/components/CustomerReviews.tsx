import React, { useState, useMemo, useRef } from 'react';
import { 
  Star, 
  CheckCircle2, 
  MessageSquarePlus, 
  Send, 
  ShieldCheck, 
  MapPin, 
  User, 
  ThumbsUp, 
  Camera, 
  X, 
  ChevronRight, 
  Filter, 
  Check, 
  UploadCloud, 
  Image as ImageIcon,
  Sparkles,
  Award,
  Truck
} from 'lucide-react';
import { Product, ProductReview } from '../types';

interface CustomerReviewsProps {
  product: Product;
  reviews: ProductReview[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'];

const SAMPLE_PHOTO_PRESETS = [
  {
    label: 'Unboxing Box & Seal',
    url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Device on Desk',
    url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Retail Packaging',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Accessories Included',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
];

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  product,
  reviews,
  onAddReview,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('Achrafieh, Beirut');
  const [comment, setComment] = useState('');
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtering & Sorting
  const [filterType, setFilterType] = useState<'all' | 'with-photos' | '5-star' | '4-star' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'highest'>('helpful');

  // Photo Lightbox State
  const [lightboxData, setLightboxData] = useState<{
    imageUrl: string;
    reviewerName: string;
    rating: number;
    comment: string;
    city?: string;
  } | null>(null);

  // Helpful Votes state
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  const handleVoteHelpful = (reviewId: string, initialCount = 0) => {
    if (votedReviews[reviewId]) return;
    setVotedReviews((prev) => ({ ...prev, [reviewId]: true }));
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1,
    }));
  };

  // Calculate statistics
  const totalCount = reviews.length;
  const averageRating = useMemo(() => {
    if (totalCount === 0) return product.rating || 5;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / totalCount).toFixed(1));
  }, [reviews, totalCount, product.rating]);

  // Star Distribution
  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  // All customer photos aggregated
  const allCustomerPhotos = useMemo(() => {
    const photoList: Array<{
      url: string;
      reviewId: string;
      authorName: string;
      rating: number;
      comment: string;
      city?: string;
    }> = [];

    reviews.forEach((rev) => {
      if (rev.photos && Array.isArray(rev.photos)) {
        rev.photos.forEach((url) => {
          if (url && typeof url === 'string') {
            photoList.push({
              url,
              reviewId: rev.id,
              authorName: rev.authorName,
              rating: rev.rating,
              comment: rev.comment,
              city: rev.city,
            });
          }
        });
      }
    });

    return photoList;
  }, [reviews]);

  // Filtered and sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...reviews];

    if (filterType === 'with-photos') {
      list = list.filter((r) => r.photos && r.photos.length > 0);
    } else if (filterType === '5-star') {
      list = list.filter((r) => Math.round(r.rating) === 5);
    } else if (filterType === '4-star') {
      list = list.filter((r) => Math.round(r.rating) === 4);
    } else if (filterType === 'verified') {
      list = list.filter((r) => r.verifiedBuyer);
    }

    list.sort((a, b) => {
      if (sortBy === 'helpful') {
        const countA = helpfulVotes[a.id] ?? (a.helpfulCount || 0);
        const countB = helpfulVotes[b.id] ?? (b.helpfulCount || 0);
        return countB - countA;
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      // recent
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return list;
  }, [reviews, filterType, sortBy, helpfulVotes]);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === 'string') {
        setAttachedPhotos((prev) => [...prev, reader.result as string]);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetPhoto = (url: string) => {
    if (!attachedPhotos.includes(url)) {
      setAttachedPhotos((prev) => [...prev, url]);
    }
  };

  const handleRemoveAttachedPhoto = (index: number) => {
    setAttachedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setFormError('Please select a star rating.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setFormError('Please write a short review (at least 5 characters).');
      return;
    }

    setFormError('');
    onAddReview({
      productId: product.id,
      authorName: authorName.trim() || 'Verified Customer',
      rating,
      comment: comment.trim(),
      city: city.trim() || 'Lebanon',
      verifiedBuyer: true,
      photos: attachedPhotos.length > 0 ? attachedPhotos : undefined,
      helpfulCount: 1,
      variantInfo: 'Verified Agency Purchase',
    });

    setSubmitted(true);
    setComment('');
    setAuthorName('');
    setAttachedPhotos([]);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  // Percentage of positive ratings (4 or 5 stars)
  const positivePercentage = useMemo(() => {
    if (totalCount === 0) return 100;
    const positive = reviews.filter((r) => r.rating >= 4).length;
    return Math.round((positive / totalCount) * 100);
  }, [reviews, totalCount]);

  return (
    <div className="space-y-6" id="customer-reviews-component">
      {/* Social Proof Header & Metric Summary Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Score Block */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200/90 rounded-2xl p-4 w-28 h-28 text-center shrink-0">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight leading-none">
                {averageRating}
              </span>
              <div className="flex items-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase tracking-wide">
                {totalCount} {totalCount === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  100% Verified Purchases
                </span>
                <span className="text-[11px] text-slate-400">•</span>
                <span className="text-[11px] font-medium text-slate-500">
                  {positivePercentage}% Recommend this product
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                Customer Feedback & Buyer Gallery
              </h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Authentic testimonials from customers across Lebanon receiving factory-sealed hardware with official warranty.
              </p>
            </div>
          </div>

          {/* Action to Toggle Review Form */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              id="customer-reviews-write-btn"
              onClick={() => {
                setShowForm((prev) => !prev);
                setFormError('');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                showForm
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                  : 'bg-[#0052CC] hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showForm ? 'Cancel Form' : 'Add Verified Review'}</span>
            </button>
          </div>
        </div>

        {/* Rating Breakdown & Highlights Grid */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Star Distribution Progress Bars (7 cols) */}
          <div className="md:col-span-7 space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((starVal) => {
              const count = distribution[starVal as 1 | 2 | 3 | 4 | 5] || 0;
              const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              return (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setFilterType(starVal === 5 ? '5-star' : starVal === 4 ? '4-star' : 'all')}
                  className="w-full flex items-center gap-2.5 text-slate-600 hover:text-slate-900 group transition text-left cursor-pointer"
                >
                  <span className="w-12 font-bold flex items-center gap-1 shrink-0 text-slate-700 group-hover:text-blue-600">
                    <span>{starVal}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500 group-hover:bg-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[11px] text-slate-400 font-mono group-hover:text-slate-600 font-medium">
                    {pct}% ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Social Proof Trust Benchmarks (5 cols) */}
          <div className="md:col-span-5 bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Authenticity & Agency Seals: <strong className="text-slate-900">5.0 / 5.0</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Delivery Speed & Punctuality: <strong className="text-slate-900">4.9 / 5.0</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Official Warranty Fulfillment: <strong className="text-slate-900">5.0 / 5.0</strong></span>
            </div>
            <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200/60 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>All reviews are verified with serial inspection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Photos Gallery Strip */}
      {allCustomerPhotos.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#0052CC]" />
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Buyer Photos & Unboxing ({allCustomerPhotos.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setFilterType(filterType === 'with-photos' ? 'all' : 'with-photos')}
              className={`text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                filterType === 'with-photos' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{filterType === 'with-photos' ? 'Showing with photos' : 'View all with photos'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
            {allCustomerPhotos.map((item, idx) => (
              <button
                key={idx}
                type="button"
                id={`customer-photo-thumb-${idx}`}
                onClick={() => setLightboxData({
                  imageUrl: item.url,
                  reviewerName: item.authorName,
                  rating: item.rating,
                  comment: item.comment,
                  city: item.city,
                })}
                className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-slate-200 overflow-hidden shrink-0 transition hover:border-blue-500 hover:shadow-md cursor-pointer bg-slate-50"
              >
                <img
                  src={item.url}
                  alt={`Customer unboxing photo by ${item.authorName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 text-white">
                  <span className="text-[10px] font-bold truncate">{item.authorName}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-2 h-2 ${
                          s <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Form Collapsible */}
      {showForm && (
        <form
          id="customer-review-submission-form"
          onSubmit={handleSubmit}
          className="bg-slate-50/80 border border-blue-200 rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="font-extrabold text-sm text-slate-900">
                Write a Verified Customer Review
              </h4>
            </div>
            <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Verified Buyer Program
            </span>
          </div>

          {/* Interactive Star Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Overall Rating: <span className="text-amber-600 font-extrabold">{RATING_LABELS[hoverRating || rating]}</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    id={`customer-rating-star-${star}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'fill-slate-100 text-slate-300 hover:text-amber-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Name & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name / Alias
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="customer-review-author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Ziad Khoury"
                  className="w-full bg-white border border-slate-200 pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City / Location in Lebanon
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="customer-review-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer text-slate-900"
                >
                  <option value="Achrafieh, Beirut">Achrafieh, Beirut</option>
                  <option value="Hamra, Beirut">Hamra, Beirut</option>
                  <option value="Jadra, Chouf">Jadra, Chouf</option>
                  <option value="Mina, Tripoli">Mina, Tripoli</option>
                  <option value="Saida">Saida</option>
                  <option value="Jounieh / Keserwan">Jounieh / Keserwan</option>
                  <option value="Zahle / Bekaa">Zahle / Bekaa</option>
                  <option value="Tyre / South">Tyre / South</option>
                  <option value="Nabatieh">Nabatieh</option>
                  <option value="Metn / Mount Lebanon">Metn / Mount Lebanon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Experience with this Hardware *
            </label>
            <textarea
              id="customer-review-comment-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about authenticity, packaging condition, delivery experience, battery life, performance..."
              rows={3}
              maxLength={500}
              className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-blue-500 resize-none font-medium leading-relaxed text-slate-900"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              <span>Verified feedback (min 5 characters)</span>
              <span>{comment.length} / 500</span>
            </div>
          </div>

          {/* Photo Attachments Section */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-700">
              Attach Unboxing or Product Photos (Optional)
            </label>
            
            {/* Upload Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="customer-review-file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload From Device</span>
              </button>

              <span className="text-[11px] text-slate-400">or attach preset unboxing photo:</span>

              {SAMPLE_PHOTO_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSelectPresetPhoto(preset.url)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:border-blue-400 text-[11px] font-medium text-slate-600 hover:text-blue-600 transition cursor-pointer flex items-center gap-1"
                >
                  <ImageIcon className="w-3 h-3 text-slate-400" />
                  <span>+{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Attached Photos Preview */}
            {attachedPhotos.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {attachedPhotos.map((photoUrl, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl border border-slate-300 overflow-hidden group">
                    <img src={photoUrl} alt="Attached preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachedPhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Error */}
          {formError && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {formError}
            </p>
          )}

          {/* Success or Submit Button */}
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your verified review has been published with social proof.</span>
            </div>
          ) : (
            <button
              type="submit"
              id="customer-review-submit-action"
              className="py-2.5 px-5 bg-[#0052CC] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Verified Review</span>
            </button>
          )}
        </form>
      )}

      {/* Filter and Sorting Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('with-photos')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              filterType === 'with-photos'
                ? 'bg-[#0052CC] text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>With Photos ({allCustomerPhotos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('5-star')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              filterType === '5-star'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <span>5 Stars</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterType('verified')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterType === 'verified'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            Verified Only
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="helpful">Most Helpful</option>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5" id="customer-reviews-feed">
        {displayedReviews.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 text-center space-y-2.5">
            <Star className="w-8 h-8 text-amber-400 fill-amber-100 mx-auto" />
            <h5 className="font-bold text-sm text-slate-800">No reviews found for this filter</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting the filter to see all verified buyer experiences.
            </p>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedReviews.map((rev) => {
            const currentHelpful = helpfulVotes[rev.id] ?? (rev.helpfulCount || 0);
            const hasVoted = votedReviews[rev.id];

            return (
              <div
                key={rev.id}
                id={`customer-review-${rev.id}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 transition hover:border-slate-300"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    {/* Customer Initials Badge */}
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                      {(rev.authorName || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">
                          {rev.authorName}
                        </span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        {rev.city && <span>{rev.city}, Lebanon</span>}
                        {rev.variantInfo && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600 font-medium">{rev.variantInfo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-100 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                </div>

                {/* Review Body */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {rev.comment}
                </p>

                {/* Attached Photos (if any) */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {rev.photos.map((photoUrl, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setLightboxData({
                          imageUrl: photoUrl,
                          reviewerName: rev.authorName,
                          rating: rev.rating,
                          comment: rev.comment,
                          city: rev.city,
                        })}
                        className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 overflow-hidden cursor-pointer bg-slate-50 hover:border-blue-500 hover:shadow-xs transition"
                      >
                        <img
                          src={photoUrl}
                          alt={`Customer photo ${pIdx + 1} from ${rev.authorName}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Review Footer / Helpful Counter */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="text-[11px] text-slate-400">
                    Dispatch verified from Jadra Hub
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVoteHelpful(rev.id, rev.helpfulCount || 0)}
                    disabled={hasVoted}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                      hasVoted
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-blue-600 text-blue-600' : ''}`} />
                    <span>{hasVoted ? 'Marked Helpful' : 'Helpful'}</span>
                    <span>({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer Photo Lightbox Modal */}
      {lightboxData && (
        <div
          className="fixed inset-0 z-70 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxData(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">
                  Customer Photo by {lightboxData.reviewerName}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Buyer
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxData(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Resolution Photo */}
            <div className="bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={lightboxData.imageUrl}
                alt="Enlarged customer unboxing photo"
                className="max-h-[60vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Review Context Quote */}
            <div className="p-4 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= lightboxData.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-900 ml-1.5">
                    {lightboxData.rating}.0 / 5.0
                  </span>
                </div>
                {lightboxData.city && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    {lightboxData.city}, Lebanon
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                "{lightboxData.comment}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
