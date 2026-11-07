import React, { useState } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { ProductCard } from '../home/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from 'lucide-react';

export const ShopPage = () => {
  const { 
    productsList, 
    selectedCategory, 
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    navigateToCategory,
    setViewWithUrl,
    searchQuery,
    setSearchQuery,
    selectedSort,
    setSelectedSort,
    priceFilter,
    setPriceFilter,
    categoriesList,
    storeInfo
  } = useStore();

  const cats = (categoriesList && categoriesList.length > 0) ? categoriesList : categories;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Filter products logic
  const filteredProducts = productsList.filter(prod => {
    // Category match
    const matchCategory = selectedCategory === 'all' || 
      prod.category === selectedCategory || 
      slugify(prod.category) === selectedCategory;

    // Subcategory match
    const matchSubCategory = !selectedSubCategory || selectedSubCategory === 'all' ||
      (prod.subCategory && (
        prod.subCategory.toLowerCase() === selectedSubCategory.toLowerCase() ||
        slugify(prod.subCategory) === slugify(selectedSubCategory)
      ));

    // Search match
    const matchSearch = !searchQuery.trim() || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    // Price match
    const matchPrice = prod.price <= priceFilter;
    // Rating match
    const matchRating = prod.rating >= minRating;

    return matchCategory && matchSubCategory && matchSearch && matchPrice && matchRating;
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
    setSelectedSubCategory('all');
    setSearchQuery('');
    setPriceFilter(3000);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCategory !== 'all' || (selectedSubCategory && selectedSubCategory !== 'all') || searchQuery.trim() !== '' || priceFilter < 3000 || minRating > 0;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="hover:text-black transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-slate-800">Shop Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
            {selectedCategory === 'all' 
              ? 'Complete Beauty & Skincare Collection' 
              : cats.find(c => c.id === selectedCategory)?.name || 'Products'}
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
                    Category: {cats.find(c => c.id === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => { setSelectedCategory('all'); setSelectedSubCategory('all'); }} className="hover:text-rose-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSubCategory && selectedSubCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    Subcategory: {selectedSubCategory}
                    <button onClick={() => setSelectedSubCategory('all')} className="hover:text-rose-300">
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
                <div className="space-y-1.5">
                  <a
                    href="/shop"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToCategory('all', 'all');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-black text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-black font-semibold'
                    }`}
                  >
                    <span>All Products</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedCategory === 'all' ? 'bg-neutral-800 text-white' : 'text-slate-400 bg-slate-100'
                    }`}>
                      {productsList.length}
                    </span>
                  </a>

                  {cats.filter(c => c.id !== 'all').map(cat => {
                    const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                    return (
                      <div key={cat.id || cat.slug} className="space-y-1">
                        <a
                          href={`/category/${cat.slug || cat.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToCategory(cat.slug || cat.id, 'all');
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                            isSelected && (!selectedSubCategory || selectedSubCategory === 'all')
                              ? 'bg-black text-white font-bold'
                              : 'text-slate-800 hover:bg-slate-50 hover:text-black font-semibold'
                          }`}
                        >
                          <span className="uppercase tracking-wider">{cat.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isSelected && (!selectedSubCategory || selectedSubCategory === 'all') ? 'bg-neutral-800 text-white' : 'text-slate-400 bg-slate-100'
                          }`}>
                            {productsList.filter(p => p.category === cat.id || p.category === cat.slug).length}
                          </span>
                        </a>

                        {/* Subcategories (Inside this Category) */}
                        {cat.subcategories && cat.subcategories.length > 0 && isSelected && (
                          <div className="pl-3 py-1 space-y-1 border-l-2 border-slate-200 ml-2 animate-in slide-in-from-top-1 duration-150">
                            {cat.subcategories.map(sub => {
                              const isSubSelected = selectedSubCategory === sub.name || selectedSubCategory === sub.id || selectedSubCategory === sub.slug;
                              const subCount = productsList.filter(p => 
                                (p.category === cat.id || p.category === cat.slug) && 
                                (p.subCategory === sub.name || slugify(p.subCategory) === slugify(sub.slug))
                              ).length;

                              return (
                                <button
                                  key={sub.id || sub.slug}
                                  type="button"
                                  onClick={() => navigateToCategory(cat.id, sub.name)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                                    isSubSelected
                                      ? 'bg-slate-900 text-white font-bold'
                                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">({subCount})</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                  <span>Max Price:</span>
                  <span className="text-black font-black">₹{priceFilter}</span>
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
                        className="accent-black"
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

