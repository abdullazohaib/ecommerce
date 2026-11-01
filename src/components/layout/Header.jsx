import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  Settings,
  ArrowRight
} from 'lucide-react';

export const Header = () => {
  const { 
    storeInfo, 
    cartItemCount, 
    cartSubtotal, 
    setIsCartOpen, 
    wishlist, 
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    productsList,
    navigateToProduct,
    setIsTrackingModalOpen,
    setIsAdminOpen
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Live search filtered results
  const liveResults = searchQuery.trim().length > 1
    ? productsList.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesQuery && matchesCat;
      }).slice(0, 6)
    : [];

  // Close live search if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setCurrentView('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo / Brand Name */}
          <div 
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-2xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                  {storeInfo.storeName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                  India
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:block">
                100% Authentic Herbal & Beauty Store
              </p>
            </div>
          </div>

          {/* Search Bar with Category Filter & Instant Results (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 pl-3 pr-8 bg-slate-100 border-r border-slate-200 rounded-l-2xl text-xs font-semibold text-slate-700 focus:outline-none hover:bg-slate-200/70 transition-colors cursor-pointer appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500 text-xs">
                  ▼
                </div>
              </div>

              {/* Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search Vita Glow, Glutathione creams, soaps, serums..."
                  className="w-full h-12 pl-4 pr-11 bg-slate-100 border-none rounded-r-2xl text-sm placeholder-slate-400 text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Results Dropdown */}
              {isSearchFocused && liveResults.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Products Matching "{searchQuery}"</span>
                    <span className="text-rose-600">{liveResults.length} found</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {liveResults.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigateToProduct(prod);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-rose-50/60 transition-colors cursor-pointer group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-rose-600 transition-colors">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-rose-600">
                              {storeInfo.currency.symbol}{prod.price}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              {storeInfo.currency.symbol}{prod.originalPrice}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              {prod.badge}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                    <button
                      type="submit"
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      View all results in Shop →
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Action Icons (Wishlist, Admin, Cart) */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Quick Admin Settings launcher */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-all cursor-pointer"
              title="Open Store Configuration & Orders Manager"
            >
              <Settings className="w-3.5 h-3.5 text-rose-500" />
              <span>Store Admin</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white pl-3.5 pr-4 py-2.5 rounded-2xl shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 transition-all cursor-pointer select-none group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-rose-200 font-medium">My Cart</span>
                <span className="text-xs font-bold text-white">
                  {storeInfo.currency.symbol}{cartSubtotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Search input bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search whitening creams, soaps, serums..."
              className="w-full h-11 pl-4 pr-10 bg-slate-100 border-none rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-2.5 bg-rose-600 text-white rounded-lg flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left p-3 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setIsTrackingModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 p-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl"
              >
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Track Your Order</span>
              </button>
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 p-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl"
              >
                <Settings className="w-4 h-4 text-rose-500" />
                <span>Store Admin & Customization</span>
              </button>
              <a
                href={`tel:${storeInfo.supportPhone.replace(/\s+/g, '')}`}
                className="w-full flex items-center gap-2 p-3 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Call Helpline: {storeInfo.supportPhone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
