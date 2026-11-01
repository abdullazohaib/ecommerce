import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { ProductCard } from '../home/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from 'lucide-react';

export const ShopPage = () => {
  const { 
    productsList, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedSort,
    setSelectedSort,
    priceFilter,
    setPriceFilter,
    storeInfo
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Filter products logic
  const filteredProducts = productsList.filter(prod => {
    // Category match
    const matchCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    // Search match
    const matchSearch = !searchQuery.trim() || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    // Price match
    const matchPrice = prod.price <= priceFilter;
    // Rating match
    const matchRating = prod.rating >= minRating;

    return matchCategory && matchSearch && matchPrice && matchRating;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'price-low') return a.price - b.price;
    if (selectedSort === 'price-high') return b.price - a.price;
    if (selectedSort === 'rating') return b.rating - a.rating;
    // Default: popular / featured
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviewsCount - a.reviewsCount;
  });

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceFilter(3000);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.trim() !== '' || priceFilter < 3000 || minRating > 0;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-800">Shop Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            {selectedCategory === 'all' 
              ? 'Complete Beauty & Skincare Collection' 
              : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {sortedProducts.length} authentic, tested, and hologram-certified products.
          </p>
        </div>

        {/* Action Bar (Search query indicator, Sort, Mobile Filter Toggle) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Active filter badges */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-200">
                    Category: {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200">
                    Query: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-amber-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priceFilter < 3000 && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                    Under ₹{priceFilter}
                    <button onClick={() => setPriceFilter(3000)} className="hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 font-bold hover:underline ml-1"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-800 py-2.5 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="popular">Most Popular & Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Main Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar (1 col) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              
              {/* Category Filter */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {cat.id === 'all' ? productsList.length : cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                  <span>Max Price:</span>
                  <span className="text-rose-600">₹{priceFilter}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹300</span>
                  <span>₹3,000</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Minimum Rating
                </h3>
                <div className="space-y-1.5">
                  {[4.5, 4.0, 3.5, 0].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        className="accent-rose-600"
                      />
                      <span>{r === 0 ? 'All Ratings' : `${r} Stars & Above`}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Products Grid (3 cols on lg) */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <p className="text-sm font-bold text-slate-700 mb-2">
                  No products match your current filters.
                </p>
                <p className="text-xs text-slate-400 mb-6">
                  Try adjusting your search keyword or clearing the price and category filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
