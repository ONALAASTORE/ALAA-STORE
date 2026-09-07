import React, { useState, useMemo } from 'react';
import { Star, CheckCircle2, MessageSquarePlus, Send, Sparkles, User, MapPin } from 'lucide-react';
import { Product, ProductReview } from '../types';

interface ProductReviewsSectionProps {
  product: Product;
  reviews: ProductReview[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'];

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  reviews,
  onAddReview,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('Beirut');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculate statistics
  const totalCount = reviews.length;
  const averageRating = useMemo(() => {
    if (totalCount === 0) return product.rating || 5;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / totalCount).toFixed(1));
  }, [reviews, totalCount, product.rating]);

  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

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
    });

    setSubmitted(true);
    setComment('');
    setAuthorName('');
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="product-reviews-section">
      {/* Top Review Metrics Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Rating Summary */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 w-24 h-24 text-center shrink-0">
              <span className="text-3xl font-black text-amber-900 font-display leading-none">
                {averageRating}
              </span>
              <div className="flex items-center gap-0.5 mt-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-amber-800 mt-1">
                {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Customer Feedback for {product.name}
              </h4>
              <p className="text-xs text-slate-500">
                Real customer experiences with original warranty, speed, and battery performance.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Authentic Agent Warranty Verified</span>
              </div>
            </div>
          </div>

          {/* Action to Toggle Review Form */}
          <div className="shrink-0">
            <button
              type="button"
              id="open-write-review-btn"
              onClick={() => {
                setShowForm((prev) => !prev);
                setFormError('');
              }}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                showForm
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((starVal) => {
            const count = distribution[starVal as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={starVal} className="flex items-center gap-2 text-slate-600">
                <span className="w-10 font-bold flex items-center gap-1 shrink-0">
                  <span>{starVal}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px] text-slate-400 font-medium">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Form Collapsible */}
      {showForm && (
        <form
          id="product-review-form"
          onSubmit={handleSubmit}
          className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="font-extrabold text-sm text-slate-900">
                Share Your Product Review
              </h4>
            </div>
            <span className="text-[11px] text-blue-700 font-medium">
              Verified Buyer Review
            </span>
          </div>

          {/* Interactive Star Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Your Rating: <span className="text-amber-700 font-extrabold">{RATING_LABELS[hoverRating || rating]}</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    id={`star-btn-${star}`}
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
                Your Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="review-author-name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Ziad Khoury"
                  className="w-full bg-white border border-slate-200 pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City / Region in Lebanon
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="review-city-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                >
                  <option value="Beirut">Beirut</option>
                  <option value="Tripoli">Tripoli</option>
                  <option value="Saida">Saida</option>
                  <option value="Jounieh / Keserwan">Jounieh / Keserwan</option>
                  <option value="Chouf / Jadra">Chouf / Jadra</option>
                  <option value="Metn">Metn</option>
                  <option value="Zahle / Bekaa">Zahle / Bekaa</option>
                  <option value="Tyre / South">Tyre / South</option>
                  <option value="Nabatieh">Nabatieh</option>
                  <option value="Other Lebanon City">Other Lebanon City</option>
                </select>
              </div>
            </div>
          </div>

          {/* Short Review Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Review & Experience *
            </label>
            <textarea
              id="review-comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you think about this product (build quality, battery, performance, camera, delivery)..."
              rows={3}
              maxLength={500}
              className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-blue-500 resize-none font-medium leading-relaxed"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
              <span>Short text review (min 5 characters)</span>
              <span>{comment.length} / 500</span>
            </div>
          </div>

          {/* Error Message */}
          {formError && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {formError}
            </p>
          )}

          {/* Success Message */}
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your review has been saved and published.</span>
            </div>
          ) : (
            <button
              type="submit"
              id="submit-product-review-btn"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Review</span>
            </button>
          )}
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3" id="reviews-list">
        {reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-2">
            <Star className="w-8 h-8 text-amber-400 fill-amber-100 mx-auto" />
            <h5 className="font-bold text-sm text-slate-800">No reviews yet</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to review this {product.brand} product and share your thoughts with other shoppers in Lebanon!
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Write the first review
            </button>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              id={`review-item-${rev.id}`}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  {/* Avatar with initial */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {(rev.authorName || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">
                        {rev.authorName}
                      </span>
                      {rev.verifiedBuyer && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    {rev.city && (
                      <span className="text-[10px] text-slate-400 block">
                        {rev.city}, Lebanon
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Stars & Date */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs text-slate-700 leading-relaxed pl-10 font-normal">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
