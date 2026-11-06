import React from 'react';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from './ProductCard.jsx';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function CatalogView() {
  const {
    lang,
    t,
    products,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedBrand,
    setSelectedBrand
  } = useStore();

  // Filter products
  let filtered = [...products];

  // Category filter
  if (activeCategory && activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  // Brand filter
  if (selectedBrand && selectedBrand !== 'all') {
    filtered = filtered.filter(p => p.brand === selectedBrand);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.nameBn && p.nameBn.includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Sort
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.discountPrice || a.regularPrice) - (b.discountPrice || b.regularPrice));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.discountPrice || b.regularPrice) - (a.discountPrice || a.regularPrice));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  const allBrands = ['all', ...new Set(products.map(p => p.brand).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            {lang === 'bn' ? 'বাংলাদেশি ই-কমার্স ক্যাটালগ' : 'Verified Catalog'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {lang === 'bn' ? 'সকল প্রিমিয়াম পণ্য' : 'Curated Products & Heritage Collection'}
          </h1>
        </div>

        {/* Total found count */}
        <div className="text-xs text-slate-500 font-mono">
          Showing <span className="font-bold text-slate-900">{filtered.length}</span> items
        </div>
      </div>

      {/* Category Segmented Controls (Button-based filter control, clean and unboxed) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-medium">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const catName = lang === 'bn' ? (cat.nameBn || cat.name) : cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 text-xs">
        {/* Brand Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Brand:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          >
            {allBrands.map(b => (
              <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">{t.sortBy}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          >
            <option value="featured">{t.sortFeatured}</option>
            <option value="price-low">{t.sortPriceLow}</option>
            <option value="price-high">{t.sortPriceHigh}</option>
            <option value="rating">{t.sortRating}</option>
            <option value="newest">{t.sortNewest}</option>
          </select>

          {/* Reset Filters */}
          {(activeCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors ml-2"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No products matched your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, changing the category, or clearing filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedBrand('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
