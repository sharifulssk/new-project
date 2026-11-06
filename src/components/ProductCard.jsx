import React from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function ProductCard({ product }) {
  const {
    lang,
    t,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    categories
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const categoryObj = categories.find(c => c.id === product.category);
  const categoryName = lang === 'bn' ? (categoryObj?.nameBn || product.category) : (categoryObj?.name || product.category);
  const displayName = lang === 'bn' ? (product.nameBn || product.name) : product.name;

  const discountPercent = product.regularPrice > product.discountPrice
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Product Image Slot (65-75% visual weight) */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative w-full aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.images?.[0] || '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'}
          alt={displayName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Discount / Flash text tag (Quiet, no pill sandwich) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick View'}</span>
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Unboxed Metadata with · separator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-slate-700 uppercase tracking-wider text-[11px]">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{categoryName}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer mb-2"
          title={displayName}
        >
          {displayName}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-800 ml-1 font-mono">{product.rating || '4.9'}</span>
          </div>
          <span aria-hidden="true">·</span>
          <span>({product.reviewCount || product.reviews?.length || 0})</span>
        </div>

        {/* Pricing and Cart CTA Row */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {formatBDT(product.discountPrice || product.regularPrice)}
            </div>
            {product.regularPrice > product.discountPrice && (
              <div className="text-xs text-slate-600 line-through font-mono tabular-nums">
                {formatBDT(product.regularPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'কার্টে নিন' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
