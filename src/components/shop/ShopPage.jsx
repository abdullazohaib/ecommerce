import React, { useState } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { ProductCard } from '../home/ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles, ChevronRight, Check, ArrowLeft } from 'lucide-react';

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

  // Active category & subcategory objects
  const currentCat = cats.find(c => c.id === selectedCategory || c.slug === selectedCategory);
  const currentSub = currentCat?.subcategories?.find(s => 
    s.id === selectedSubCategory || 
    s.slug === selectedSubCategory || 
    s.name.toLowerCase() === selectedSubCategory?.toLowerCase() ||
    slugify(s.name) === slugify(selectedSubCategory || '')
  );

  // Fallback high-res artwork map for standard beauty categories
  const artworkFallbackMap = {
    lips: '/categories/lips.png',
    eyes: '/categories/eyes.png',
    face: '/categories/face.png',
    nails: '/categories/nails.png',
    skincare: '/categories/skin.png',
    skin: '/categories/skin.png',
  };

  const gradientMap = {
    lips: 'from-[#2b0816] via-[#1a050d] to-[#0d0206]',
    eyes: 'from-[#190a2c] via-[#0d0417] to-[#06010b]',
    face: 'from-[#2a130f] via-[#180a08] to-[#0c0504]',
    nails: 'from-[#2a0814] via-[#18040b] to-[#0c0205]',
    skincare: 'from-[#281308] via-[#160a04] to-[#0b0402]',
    skin: 'from-[#281308] via-[#160a04] to-[#0b0402]',
  };

  const catSlug = currentCat?.slug || currentCat?.id || 'all';
  const heroGradient = gradientMap[catSlug] || 'from-[#18181b] via-[#09090b] to-[#000000]';
  const heroArtwork = currentCat?.bannerImg && !currentCat.bannerImg.includes('unsplash.com')
    ? currentCat.bannerImg
    : (artworkFallbackMap[catSlug] || currentCat?.bannerImg || '/categories/skin.png');

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
        slugify(prod.subCategory) === slugify(selectedSubCategory) ||
        prod.subCategory.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
        selectedSubCategory.toLowerCase().includes(prod.subCategory.toLowerCase())
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
    navigateToCategory('all', 'all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || (selectedSubCategory && selectedSubCategory !== 'all') || searchQuery.trim() !== '' || priceFilter < 3000 || minRating > 0;

  // Title generation
  const pageHeading = currentSub
    ? currentSub.name
    : (currentCat ? `${currentCat.name} Collection` : 'Complete Beauty & Skincare Collection');

  const pageDescription = currentSub?.description 
    || currentCat?.description 
    || 'Discover our full range of certified high-pigment cosmetics, nourishing lip formulas, HD complexion bases, and dermatologist-tested skincare routines.';

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-6 sm:py-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =============================================================== */}
        {/* 1. DYNAMIC BREADCRUMBS (Clickable Multi-Level Navigation)         */}
        {/* =============================================================== */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 font-semibold">
            <li>
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
            </li>

            <li className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToCategory('all', 'all');
                }}
                className={selectedCategory === 'all' ? 'text-black font-bold' : 'hover:text-black transition-colors'}
              >
                Catalog
              </a>
            </li>

            {currentCat && (
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <a
                  href={`/category/${currentCat.slug || currentCat.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToCategory(currentCat.slug || currentCat.id, 'all');
                  }}
                  className={(!selectedSubCategory || selectedSubCategory === 'all') ? 'text-black font-bold uppercase' : 'hover:text-black transition-colors uppercase'}
                >
                  {currentCat.name}
                </a>
              </li>
            )}

            {currentSub && (
              <li className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-black font-bold uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded-md">
                  {currentSub.name}
                </span>
              </li>
            )}
          </ol>
        </nav>

        {/* =============================================================== */}
        {/* 2. DEDICATED CATEGORY & SUBCATEGORY HERO BANNER                   */}
        {/* =============================================================== */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${heroGradient} text-white p-6 sm:p-10 mb-8 shadow-sm border border-neutral-800`}>
          <div className="relative z-10 max-w-2xl">
            {/* Top Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-white/90 border border-white/15 px-2.5 py-0.5 rounded-full">
                {currentSub 
                  ? `${currentCat?.name || 'CATEGORY'} • ${currentSub.name}` 
                  : (currentCat?.badge || 'OFFICIAL COLLECTION')}
              </span>
              <span className="text-[11px] font-bold text-neutral-400">
                100% Genuine Certified
              </span>
            </div>

            {/* Main Page Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-2 font-sans">
              {pageHeading}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal mb-5 max-w-xl">
              {pageDescription}
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{sortedProducts.length} Items Available</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Free Delivery ₹{storeInfo?.freeShippingThreshold || 999}+</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-rose-400" />
                <span>Hologram Protected</span>
              </span>
            </div>
          </div>

          {/* Right Floating Artwork (Desktop) */}
          {currentCat && (
            <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-48 lg:w-56 h-48 lg:h-56 rounded-full overflow-hidden opacity-85 hover:opacity-100 transition-opacity pointer-events-none">
              <div className="w-full h-full p-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xs">
                <img
                  src={heroArtwork}
                  alt={pageHeading}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* =============================================================== */}
        {/* 3. HORIZONTAL SUBCATEGORY PILLS SWITCHER (Inside Category)       */}
        {/* =============================================================== */}
        {currentCat?.subcategories && currentCat.subcategories.length > 0 && (
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 pl-2 pr-1 select-none">
                Subcategories:
              </span>

              {/* All in Category */}
              <button
                type="button"
                onClick={() => navigateToCategory(currentCat.slug || currentCat.id, 'all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !selectedSubCategory || selectedSubCategory === 'all'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                All {currentCat.name} ({productsList.filter(p => p.category === currentCat.id || p.category === currentCat.slug).length})
              </button>

              {/* Subcategories (e.g. Lip Oil, Lipsticks, Liquid Lipsticks, Gloss) */}
              {currentCat.subcategories.map(sub => {
                const isSubActive = selectedSubCategory === sub.name || 
                  selectedSubCategory === sub.id || 
                  selectedSubCategory === sub.slug ||
                  slugify(selectedSubCategory || '') === slugify(sub.slug);

                const count = productsList.filter(p => 
                  (p.category === currentCat.id || p.category === currentCat.slug) && 
                  (p.subCategory === sub.name || slugify(p.subCategory || '') === slugify(sub.slug))
                ).length;

                return (
                  <button
                    key={sub.id || sub.slug}
                    type="button"
                    onClick={() => navigateToCategory(currentCat.slug || currentCat.id, sub.slug || sub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSubActive
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span className={`text-[10px] font-mono font-normal ${isSubActive ? 'text-neutral-300' : 'text-slate-400'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* 4. ACTION BAR (Filters Trigger, Active Badges, Sort)              */}
        {/* =============================================================== */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Active filter badges */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    <span>{currentCat?.name || selectedCategory}</span>
                    <button 
                      onClick={() => navigateToCategory('all', 'all')} 
                      className="hover:text-neutral-400 p-0.5"
                      title="Clear category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSubCategory && selectedSubCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    <span>Subcategory: {currentSub?.name || selectedSubCategory}</span>
                    <button 
                      onClick={() => navigateToCategory(selectedCategory, 'all')} 
                      className="hover:text-neutral-400 p-0.5"
                      title="Clear subcategory"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-200">
                    <span>Query: "{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-black p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {priceFilter < 3000 && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                    <span>Under ₹{priceFilter}</span>
                    <button onClick={() => setPriceFilter(3000)} className="hover:text-black p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 font-bold hover:underline ml-1 cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="popular">Most Popular & Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 5. MAIN CONTENT (Sidebar + Products Grid)                        */}
        {/* =============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar (1 col) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
              
              {/* Category Hierarchy List */}
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
                            isSelected && (!selectedSubCategory || selectedSubCategory === 'all') 
                              ? 'bg-neutral-800 text-white' 
                              : 'text-slate-400 bg-slate-100'
                          }`}>
                            {productsList.filter(p => p.category === cat.id || p.category === cat.slug).length}
                          </span>
                        </a>

                        {/* Subcategories (Inside this Category) */}
                        {cat.subcategories && cat.subcategories.length > 0 && isSelected && (
                          <div className="pl-3 py-1 space-y-1 border-l-2 border-slate-200 ml-2 animate-in slide-in-from-top-1 duration-150">
                            {cat.subcategories.map(sub => {
                              const isSubSelected = selectedSubCategory === sub.name || 
                                selectedSubCategory === sub.id || 
                                selectedSubCategory === sub.slug ||
                                slugify(selectedSubCategory || '') === slugify(sub.slug);

                              const subCount = productsList.filter(p => 
                                (p.category === cat.id || p.category === cat.slug) && 
                                (p.subCategory === sub.name || slugify(p.subCategory || '') === slugify(sub.slug))
                              ).length;

                              return (
                                <button
                                  key={sub.id || sub.slug}
                                  type="button"
                                  onClick={() => navigateToCategory(cat.slug || cat.id, sub.slug || sub.id)}
                                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                                    isSubSelected
                                      ? 'bg-black text-white font-bold'
                                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  <span className={`text-[10px] font-mono ${isSubSelected ? 'text-neutral-300' : 'text-slate-400'}`}>
                                    ({subCount})
                                  </span>
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
                  className="w-full accent-black cursor-pointer"
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
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-800 mx-auto flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No products found for this subcategory
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    There are currently no items under "{currentSub?.name || selectedSubCategory}". Try exploring other {currentCat?.name || 'store'} products or resetting filters.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  {currentCat && (
                    <button
                      type="button"
                      onClick={() => navigateToCategory(currentCat.slug || currentCat.id, 'all')}
                      className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      View All {currentCat.name}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
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

      {/* =============================================================== */}
      {/* 6. MOBILE FILTER DRAWER                                          */}
      {/* =============================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Filters & Categories</h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories & Subcategories in Mobile Drawer */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Categories
              </span>
              <button
                type="button"
                onClick={() => {
                  navigateToCategory('all', 'all');
                  setMobileFilterOpen(false);
                }}
                className={`w-full text-left p-2 rounded-xl text-xs font-bold ${
                  selectedCategory === 'all' ? 'bg-black text-white' : 'text-slate-800'
                }`}
              >
                All Products
              </button>

              {cats.filter(c => c.id !== 'all').map(cat => (
                <div key={cat.id || cat.slug} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigateToCategory(cat.slug || cat.id, 'all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold uppercase ${
                      selectedCategory === cat.id ? 'bg-black text-white' : 'text-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>

                  {cat.subcategories && cat.subcategories.length > 0 && selectedCategory === cat.id && (
                    <div className="pl-4 space-y-1">
                      {cat.subcategories.map(sub => (
                        <button
                          key={sub.id || sub.slug}
                          type="button"
                          onClick={() => {
                            navigateToCategory(cat.slug || cat.id, sub.slug || sub.id);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                            selectedSubCategory === sub.slug || selectedSubCategory === sub.name
                              ? 'bg-neutral-900 text-white font-bold'
                              : 'text-slate-600 hover:text-black'
                          }`}
                        >
                          • {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Price Filter in Mobile Drawer */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                <span>Max Price:</span>
                <span>₹{priceFilter}</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
