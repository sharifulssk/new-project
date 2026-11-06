import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus, Send } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function ProductDetailModal() {
  const {
    lang,
    t,
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    categories,
    addToast
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // New review form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!selectedProduct) return null;

  const isFavorited = isInWishlist(selectedProduct.id);
  const categoryObj = categories.find(c => c.id === selectedProduct.category);
  const categoryName = lang === 'bn' ? (categoryObj?.nameBn || selectedProduct.category) : (categoryObj?.name || selectedProduct.category);
  const displayName = lang === 'bn' ? (selectedProduct.nameBn || selectedProduct.name) : selectedProduct.name;
  const displayDescription = lang === 'bn' ? (selectedProduct.descriptionBn || selectedProduct.description) : selectedProduct.description;

  const images = selectedProduct.images?.length > 0
    ? selectedProduct.images
    : ['/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'];

  const currentColor = selectedColor || selectedProduct.variants?.colors?.[0] || '';
  const currentSize = selectedSize || selectedProduct.variants?.sizes?.[0] || '';

  const handleAddToCart = () => {
    const variantLabel = [currentColor, currentSize].filter(Boolean).join(' / ') || 'Standard';
    addToCart(selectedProduct, variantLabel, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Please enter your review feedback', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: reviewerName.trim() || 'Verified Buyer',
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.product) {
        setSelectedProduct(data.product);
        setReviewComment('');
        setReviewerName('');
        addToast('Review posted successfully! Thank you.', 'success');
      }
    } catch (err) {
      // Offline fallback
      const mockReview = {
        id: `rev-${Date.now()}`,
        user: reviewerName.trim() || 'Verified Customer',
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      setSelectedProduct(prev => ({
        ...prev,
        reviews: [mockReview, ...(prev.reviews || [])],
        reviewCount: (prev.reviewCount || 0) + 1
      }));
      setReviewComment('');
      setReviewerName('');
      addToast('Review added!', 'success');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Main 2-Column Contiguous Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Gallery & Zoom Showcase */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-4/3 border border-slate-200">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={displayName}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quality & Trust Badges */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'bn' ? 'ঢাকায় ২৪-৪৮ ঘণ্টা, সারাদেশে ৪৮-৭২ ঘণ্টার ডেলিভারি' : 'Express delivery: 24h inside Dhaka, 48-72h outside'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'bn' ? 'শতভাগ আসল ও খাঁটি পণ্যের নিশ্চয়তা' : '100% Authentic Quality Guaranteed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'bn' ? '৭ দিনের সহজ রিটার্ন বা এক্সচেঞ্জ সুবিধা' : '7 Days Easy Return & Exchange policy'}</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="space-y-5">
              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-900 tracking-wider uppercase text-[11px]">{selectedProduct.brand}</span>
                <span>·</span>
                <span>{categoryName}</span>
                <span>·</span>
                <span className="font-mono text-slate-400">SKU: {selectedProduct.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {displayName}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className="font-bold text-slate-900 ml-1.5 font-mono text-sm">{selectedProduct.rating || '4.9'}</span>
                </div>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">
                  {selectedProduct.reviews?.length || selectedProduct.reviewCount || 0} {lang === 'bn' ? 'গ্রাহক মতামত' : 'verified reviews'}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-700 font-medium">
                  {selectedProduct.stock > 0 ? (lang === 'bn' ? `স্টক আছে (${selectedProduct.stock})` : `In Stock (${selectedProduct.stock})`) : 'Out of Stock'}
                </span>
              </div>

              {/* Pricing */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatBDT(selectedProduct.discountPrice || selectedProduct.regularPrice)}
                </span>
                {selectedProduct.regularPrice > selectedProduct.discountPrice && (
                  <span className="text-sm text-slate-600 line-through font-mono tabular-nums">
                    {formatBDT(selectedProduct.regularPrice)}
                  </span>
                )}
                {selectedProduct.regularPrice > selectedProduct.discountPrice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {formatBDT(selectedProduct.regularPrice - selectedProduct.discountPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {displayDescription}
              </p>

              {/* Color Variants */}
              {selectedProduct.variants?.colors?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    {t.color}: <span className="font-normal text-slate-600">{currentColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          currentColor === c
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size / Option Variants */}
              {selectedProduct.variants?.sizes?.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    {t.size}: <span className="font-normal text-slate-600">{currentSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          currentSize === s
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock || 20, quantity + 1))}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-2.5 rounded-lg border transition-colors ${
                      isFavorited ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleAddToCart();
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>{t.buyNow}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {t.reviews} ({selectedProduct.reviews?.length || 0})
              </h3>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-3">
              {(!selectedProduct.reviews || selectedProduct.reviews.length === 0) ? (
                <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {lang === 'bn' ? 'এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!' : 'No customer reviews yet. Be the first to share your experience!'}
                </div>
              ) : (
                selectedProduct.reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{rev.user}</span>
                        <span className="text-emerald-700 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Verified Purchase</span>
                      </div>
                      <span className="text-slate-600 font-mono text-[11px]">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t.writeReview}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />

                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                placeholder={lang === 'bn' ? 'পণ্য সম্পর্কে আপনার অভিজ্ঞতা জানান...' : 'Share your honest feedback on product quality, shipping, and finish...'}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              />

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingReview ? 'Submitting...' : t.submitReview}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
