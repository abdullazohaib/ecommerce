import React, { useState, useRef, useEffect } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
import { BrandLogo } from '../ui/BrandLogo';
import { 
  Search, 
  User, 
  ShoppingBag, 
  X, 
  Menu, 
  ArrowRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Truck,
  XCircle,
  HelpCircle,
  PhoneCall,
  Info,
  MessageCircle
} from 'lucide-react';

export const Header = () => {
  const { 
    storeInfo, 
    cartItemCount, 
    setIsCartOpen, 
    setViewWithUrl,
    currentView,
    searchQuery,
    setSearchQuery,
    productsList,
    categoriesList,
    selectedCategory,
    navigateToProduct,
    navigateToCategory,
    selectedSort,
    setSelectedSort,
    openTrackingModal,
    setIsAuthModalOpen,
    setAuthModalTab,
    currentUser,
    isAdminAuthenticated
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close live search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search autocomplete
  const liveResults = searchQuery.trim().length > 1
    ? productsList.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setMobileSearchOpen(false);
      setViewWithUrl('shop');
    }
  };

  // Render department item in the luxury category strip (SALE | LIPS | EYES | SKIN | FACE | NAILS)
  const renderCategoryStripItem = (catId, displayName, catSlug) => {
    const catData = (categoriesList || []).find(c => c.id === catId || c.slug === catSlug);
    const subList = catData?.subcategories || [];
    const isActive = currentView === 'category' && (selectedCategory === catSlug || selectedCategory === catId);

    return (
      <div key={catId} className="relative group shrink-0">
        <a
          href={`/category/${catSlug}`}
          onClick={(e) => {
            e.preventDefault();
            navigateToCategory(catSlug, 'all');
          }}
          className={`px-2.5 py-0.5 border transition-all cursor-pointer block select-none ${
            isActive
              ? 'border-black text-black font-semibold'
              : 'border-transparent hover:border-black text-black'
          }`}
        >
          {displayName}
        </a>

        {/* Hover Dropdown with all subcategories */}
        {subList.length > 0 && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-2.5 min-w-[200px] normal-case tracking-normal font-sans text-left">
              <a
                href={`/category/${catSlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToCategory(catSlug, 'all');
                }}
                className="block px-3 py-1.5 text-xs font-bold text-slate-900 hover:text-[#ba5d5d] hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100 mb-1"
              >
                All {displayName === 'SKIN' ? 'Skincare' : displayName} ({subList.length})
              </a>
              <div className="space-y-0.5 max-h-60 overflow-y-auto">
                {subList.map(sub => (
                  <a
                    key={sub.id || sub.slug}
                    href={`/category/${catSlug}/${sub.slug || sub.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToCategory(catSlug, sub.slug || sub.id);
                    }}
                    className="block px-3 py-1 text-xs text-slate-600 hover:text-black hover:bg-slate-50 rounded-lg transition-colors capitalize font-medium"
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* ============================================================= */}
          {/* LEFT: BRAND LOGO + CONNECTED LUXURY NAVIGATION */}
          {/* ============================================================= */}
          <div className="flex items-center gap-6 xl:gap-9 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="flex items-center gap-2 select-none group py-1 shrink-0"
              title={storeInfo?.storeName || "Classic Glow"}
            >
              <BrandLogo size="normal" />
            </a>

            {/* Primary Navigation Menu - Matching Roman Serif Luxury UI (Cinzel, All-Caps, Wide Letter-Spacing & Generous Spacing) */}
            <nav className="hidden lg:flex items-center gap-7 lg:gap-9 xl:gap-13 font-cinzel text-[13px] xl:text-[14px] font-semibold tracking-[0.16em] uppercase">
              {/* 1. HOME */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setViewWithUrl('home');
                }}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  currentView === 'home' ? 'text-black font-bold border-b-2 border-black' : 'text-slate-800 hover:text-black'
                }`}
              >
                HOME
              </a>

              {/* 2. CATEGORIES Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setViewWithUrl('shop')}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 ${
                    currentView === 'shop' || currentView === 'category' ? 'text-black font-bold border-b-2 border-black' : 'text-slate-800 hover:text-black'
                  }`}
                >
                  <span>CATEGORIES</span>
                  <ChevronDown className={`w-3.5 h-3.5 stroke-[1.8] text-slate-500 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-black' : ''}`} />
                </button>

                {/* Luxury 5-Column Mega Menu - Proportionally Positioned */}
                {categoriesDropdownOpen && (
                  <div className="absolute top-full -left-20 xl:-left-24 w-[820px] xl:w-[920px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in slide-in-from-top-1 duration-150 z-50 normal-case tracking-normal">
                    <div className="grid grid-cols-5 gap-6">
                      {(categoriesList || []).filter(c => c.id !== 'all').map(cat => (
                        <div key={cat.id || cat.slug} className="space-y-3">
                          {/* Column Parent Category Header (Uppercase Bold) */}
                          <a
                            href={`/category/${cat.slug || cat.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setCategoriesDropdownOpen(false);
                              navigateToCategory(cat.slug || cat.id, 'all');
                            }}
                            className="block font-cinzel text-xs font-bold uppercase tracking-wider text-black hover:text-[#ba5d5d] transition-colors pb-2 border-b border-slate-200"
                          >
                            {cat.name}
                          </a>

                          {/* Subcategories (Inside it all products) */}
                          <div className="space-y-2">
                            {(cat.subcategories || []).map(sub => (
                              <a
                                key={sub.id || sub.slug}
                                href={`/category/${cat.slug || cat.id}/${sub.slug || sub.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCategoriesDropdownOpen(false);
                                  navigateToCategory(cat.slug || cat.id, sub.slug || sub.id);
                                }}
                                className="block font-sans text-xs font-medium text-slate-600 hover:text-black hover:font-bold hover:translate-x-0.5 transition-all py-0.5 capitalize"
                              >
                                {sub.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Utility Bar */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 -mx-6 -mb-6 px-6 py-3.5 rounded-b-3xl">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Curated Luxury Cosmetics & Dermatological Formulations</span>
                      </div>
                      <a
                        href="/shop"
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoriesDropdownOpen(false);
                          navigateToCategory('all', 'all');
                        }}
                        className="font-bold text-black hover:underline flex items-center gap-1 group font-sans"
                      >
                        <span>View All Products ({productsList.length})</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. TRENDS */}
              <a
                href="/shop?sort=bestsellers"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSort('bestsellers');
                  navigateToCategory('all');
                  setViewWithUrl('shop');
                }}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  currentView === 'shop' && selectedSort === 'bestsellers' ? 'text-black font-bold border-b-2 border-black' : 'text-slate-800 hover:text-black'
                }`}
              >
                TRENDS
              </a>

              {/* 4. ORDERS Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOrdersDropdownOpen(true)}
                onMouseLeave={() => setOrdersDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setOrdersDropdownOpen(!ordersDropdownOpen)}
                  className="flex items-center gap-1.5 text-slate-800 hover:text-black transition-colors cursor-pointer py-1"
                >
                  <span>ORDERS</span>
                  <ChevronDown className={`w-3.5 h-3.5 stroke-[1.8] text-slate-500 transition-transform duration-200 ${ordersDropdownOpen ? 'rotate-180 text-black' : ''}`} />
                </button>

                {ordersDropdownOpen && (
                  <div className="absolute top-full -left-6 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50 space-y-1 normal-case tracking-normal font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setOrdersDropdownOpen(false);
                        openTrackingModal('track');
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-black">Track Order</span>
                        <span className="text-[11px] text-slate-500 block leading-tight">Live shipment status & courier AWB</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOrdersDropdownOpen(false);
                        openTrackingModal('cancel');
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-rose-50/60 transition-colors text-left cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <XCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block group-hover:text-rose-700">Cancel Order</span>
                        <span className="text-[11px] text-slate-500 block leading-tight">Cancel before dispatch or return items</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 5. HELP Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setHelpDropdownOpen(true)}
                onMouseLeave={() => setHelpDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                  className="flex items-center gap-1.5 text-slate-800 hover:text-black transition-colors cursor-pointer py-1"
                >
                  <span>HELP</span>
                  <ChevronDown className={`w-3.5 h-3.5 stroke-[1.8] text-slate-500 transition-transform duration-200 ${helpDropdownOpen ? 'rotate-180 text-black' : ''}`} />
                </button>

                {helpDropdownOpen && (
                  <div className="absolute top-full -left-6 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50 space-y-1 normal-case tracking-normal font-sans">
                    <a
                      href={`https://wa.me/${(storeInfo?.whatsappNumber || '919820045678').replace(/\D/g, '')}?text=Hi%2C%20I%20need%20help%20with%20my%20order`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setHelpDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">WhatsApp 24/7 Support</span>
                        <span className="text-[10px] text-slate-400 block">Instant chat with specialist</span>
                      </div>
                    </a>

                    <a
                      href="/contact-us"
                      onClick={(e) => {
                        e.preventDefault();
                        setHelpDropdownOpen(false);
                        setViewWithUrl('contact');
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 hover:text-black transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-xs font-bold">Contact Us</span>
                    </a>

                    <a
                      href="/about-us"
                      onClick={(e) => {
                        e.preventDefault();
                        setHelpDropdownOpen(false);
                        setViewWithUrl('about');
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 hover:text-black transition-colors"
                    >
                      <Info className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-xs font-bold">About Us</span>
                    </a>

                    <a
                      href="/shipping-policy"
                      onClick={(e) => {
                        e.preventDefault();
                        setHelpDropdownOpen(false);
                        setViewWithUrl('shipping-policy');
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 hover:text-black transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-xs font-bold">Shipping & Return Policy</span>
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* ============================================================= */}
          {/* RIGHT: EXPANDING PILL SEARCH BAR + USER ICON + CART */}
          {/* ============================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end max-w-sm lg:max-w-md xl:max-w-lg ml-auto">
            {/* Embedded Dr. Sheth's Style Pill Search Input */}
            <div ref={searchContainerRef} className="relative hidden md:block flex-1 min-w-[200px]">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center w-full h-10 px-3.5 bg-slate-50/90 hover:bg-slate-50 border border-slate-300 rounded-full focus-within:bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all shadow-2xs">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search For Cleanser, Serum, Cream..."
                    className="w-full text-xs xl:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Live search autocomplete dropdown */}
                {isSearchFocused && liveResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Matching Products ({liveResults.length})</span>
                      <button 
                        type="button"
                        onClick={() => setIsSearchFocused(false)} 
                        className="text-slate-400 hover:text-slate-700"
                      >
                        Close
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {liveResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigateToProduct(prod);
                          }}
                          className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer"
                        >
                          <img src={prod.images[0]} alt={prod.name} className="w-9 h-9 object-cover rounded border border-slate-200 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                            <span className="text-xs font-black text-black">₹{prod.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-1.5 text-slate-800 hover:text-black transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Clean Luxury User Account Icon */}
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="p-1.5 text-slate-800 hover:text-black transition-colors cursor-pointer"
              title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In / Register"}
              aria-label="User Account"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Shopping Bag Icon with Dr. Sheth's Red Circular Badge [🛍️ 0] */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 text-slate-900 hover:text-black transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute -top-1.5 -right-2 bg-[#d12420] text-white text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-slate-900 hover:text-black cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Overlay Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden py-2.5 border-t border-slate-100 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center h-9 px-3 bg-white border border-slate-300 rounded-lg">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search For Cleanser, Serum, Cream..."
                  className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-black text-white text-xs font-bold rounded-lg shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* LUXURY CATEGORY STRIP: SALE | LIPS | EYES | SKIN | FACE | NAILS */}
      {/* (Centered Geometric Sans Strip Matching User UI Reference) */}
      {/* ============================================================= */}
      <div className="w-full border-t border-b border-slate-100 bg-white py-2.5 sm:py-3 shadow-3xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center overflow-x-auto no-scrollbar">
          <nav className="flex items-center justify-center gap-0 font-sans text-[11px] sm:text-xs font-medium tracking-[0.24em] uppercase text-black shrink-0">
            {/* 1. SALE with Gold A */}
            <a
              href="/shop?sort=bestsellers"
              onClick={(e) => {
                e.preventDefault();
                setSelectedSort('bestsellers');
                navigateToCategory('all');
                setViewWithUrl('shop');
              }}
              className="border border-transparent hover:border-black px-2 sm:px-2.5 py-0.5 transition-all cursor-pointer select-none shrink-0"
              title="Shop Special Sale & Trending Offers"
            >
              S<span className="text-amber-500 font-bold">A</span>LE
            </a>

            {/* Separator */}
            <span className="text-slate-300 font-light select-none mx-3 sm:mx-5 md:mx-7 text-xs shrink-0">|</span>

            {/* 2. LIPS */}
            {renderCategoryStripItem('lips', 'LIPS', 'lips')}

            {/* Separator */}
            <span className="text-slate-300 font-light select-none mx-3 sm:mx-5 md:mx-7 text-xs shrink-0">|</span>

            {/* 3. EYES */}
            {renderCategoryStripItem('eyes', 'EYES', 'eyes')}

            {/* Separator */}
            <span className="text-slate-300 font-light select-none mx-3 sm:mx-5 md:mx-7 text-xs shrink-0">|</span>

            {/* 4. SKIN */}
            {renderCategoryStripItem('skincare', 'SKIN', 'skincare')}

            {/* Separator */}
            <span className="text-slate-300 font-light select-none mx-3 sm:mx-5 md:mx-7 text-xs shrink-0">|</span>

            {/* 5. FACE */}
            {renderCategoryStripItem('face', 'FACE', 'face')}

            {/* Separator */}
            <span className="text-slate-300 font-light select-none mx-3 sm:mx-5 md:mx-7 text-xs shrink-0">|</span>

            {/* 6. NAILS */}
            {renderCategoryStripItem('nails', 'NAILS', 'nails')}
          </nav>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-5 shadow-xl animate-in slide-in-from-top-2">
          <nav className="space-y-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-black text-black border-b border-slate-100"
            >
              HOME
            </a>
            <div>
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="flex items-center justify-between w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-black cursor-pointer"
              >
                <span>CATEGORIES</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileCategoriesOpen && (
                <div className="pl-3 py-2 space-y-3 bg-slate-50 rounded-xl my-1 border border-slate-100">
                  {(categoriesList || []).filter(c => c.id !== 'all').map(cat => (
                    <div key={cat.id || cat.slug} className="space-y-1">
                      <a
                        href={`/category/${cat.slug || cat.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToCategory(cat.slug || cat.id, 'all');
                          setMobileMenuOpen(false);
                        }}
                        className="block text-xs font-black text-slate-900 uppercase"
                      >
                        {cat.name}
                      </a>
                      <div className="pl-2 space-y-1">
                        {(cat.subcategories || []).map(sub => (
                          <a
                            key={sub.id || sub.slug}
                            href={`/category/${cat.slug || cat.id}/${sub.slug || sub.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToCategory(cat.slug || cat.id, sub.slug || sub.id);
                              setMobileMenuOpen(false);
                            }}
                            className="block text-[11px] text-slate-600 hover:text-black"
                          >
                            • {sub.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/shop?sort=bestsellers"
              onClick={(e) => {
                e.preventDefault();
                setSelectedSort('bestsellers');
                navigateToCategory('all');
                setViewWithUrl('shop');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-black tracking-wider"
            >
              <span>TRENDS</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openTrackingModal('track');
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-black cursor-pointer"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span>TRACK ORDER</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openTrackingModal('cancel');
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>CANCEL ORDER</span>
            </button>
            <a
              href="/contact-us"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-black"
            >
              HELP & SUPPORT
            </a>
            <a
              href="/about-us"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-black"
            >
              ABOUT US
            </a>
            <a
              href="/admin/dashboard"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Store Admin Portal (/admin)
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
