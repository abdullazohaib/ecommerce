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
  Zap,
  ShieldCheck,
  Flame,
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
    navigateToProduct,
    navigateToCategory,
    setSelectedSort,
    openTrackingModal,
    setIsAuthModalOpen,
    setAuthModalTab,
    currentUser,
    isAdminAuthenticated
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* ============================================================= */}
          {/* LEFT: SIGNATURE LUXURY BRAND LOGO (GB Watermark + Script / Image) */}
          {/* ============================================================= */}
          <div className="flex items-center gap-6 lg:gap-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="flex items-center gap-2 select-none group py-1 shrink-0"
              title={storeInfo?.storeName || "Glow Basket"}
            >
              <BrandLogo size="normal" />
            </a>

            {/* ============================================================= */}
            {/* CENTER-LEFT: NAVIGATION MENU (Home, Categories ⌵, Trends, Orders ⌵, Help ⌵) */}
            {/* ============================================================= */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 ml-2">
              {/* 1. Home */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setViewWithUrl('home');
                }}
                className={`text-[13px] font-bold transition-colors whitespace-nowrap ${
                  currentView === 'home' ? 'text-black' : 'text-slate-800 hover:text-black'
                }`}
              >
                Home
              </a>

              {/* 2. Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setViewWithUrl('shop')}
                  className={`flex items-center gap-1 text-[13px] font-bold transition-colors cursor-pointer py-2 ${
                    currentView === 'shop' || currentView === 'category' ? 'text-black' : 'text-slate-800 hover:text-black'
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu on hover - Dynamically synced with Admin Categories */}
                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <a
                      href="/shop"
                      onClick={(e) => {
                        e.preventDefault();
                        setCategoriesDropdownOpen(false);
                        navigateToCategory('all');
                      }}
                      className="block px-3.5 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-50 hover:text-black rounded-xl transition-colors"
                    >
                      All Formulations & Products
                    </a>
                    <div className="h-px bg-slate-100 my-1"></div>
                    {(categoriesList || []).filter(c => c.id !== 'all').map(cat => (
                      <a
                        key={cat.id || cat.slug}
                        href={`/category/${cat.slug || cat.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCategoriesDropdownOpen(false);
                          navigateToCategory(cat.slug || cat.id);
                        }}
                        className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-black rounded-xl transition-colors"
                      >
                        <span className="truncate">{cat.name}</span>
                        {cat.itemCount ? (
                          <span className="text-[10px] text-slate-400 font-mono">({cat.itemCount})</span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Trends */}
              <a
                href="/shop?sort=bestsellers"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSort('bestsellers');
                  navigateToCategory('all');
                  setViewWithUrl('shop');
                }}
                className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800 hover:text-black transition-colors whitespace-nowrap py-2 cursor-pointer group"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                <span>Trends</span>
              </a>

              {/* 4. Orders Dropdown (Track Order & Cancel Order) */}
              <div 
                className="relative"
                onMouseEnter={() => setOrdersDropdownOpen(true)}
                onMouseLeave={() => setOrdersDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setOrdersDropdownOpen(!ordersDropdownOpen)}
                  className="flex items-center gap-1 text-[13px] font-bold text-slate-800 hover:text-black transition-colors cursor-pointer py-2"
                >
                  <span>Orders</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${ordersDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {ordersDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50 space-y-1">
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

              {/* 5. Help Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setHelpDropdownOpen(true)}
                onMouseLeave={() => setHelpDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                  className="flex items-center gap-1 text-[13px] font-bold text-slate-800 hover:text-black transition-colors cursor-pointer py-2"
                >
                  <span>Help</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${helpDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {helpDropdownOpen && (
                  <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50 space-y-1">
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
          {/* RIGHT: SEARCH BAR + LIGHTNING/USER ICON + CART (🛍️ [0]) */}
          {/* ============================================================= */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Embedded Dr. Sheth's Style Search Input */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center w-56 lg:w-72 xl:w-80 h-9 px-3 bg-white border border-slate-300 rounded-lg focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search For Cleanser, Serum, Cream..."
                    className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 text-slate-400 hover:text-slate-700"
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

            {/* Lightning / User Account Icon (Matching Dr. Sheth's [👤⚡] profile icon) */}
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="relative flex items-center p-1 text-slate-900 hover:text-black transition-colors cursor-pointer group"
              title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In / Register"}
            >
              <User className="w-5 h-5 stroke-[1.8]" />
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500 -ml-1 -mt-2 group-hover:scale-110 transition-transform" />
              {currentUser && (
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              )}
              {isAdminAuthenticated && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" title="Admin Active"></span>
              )}
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
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('shop');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 hover:text-black"
            >
              CATEGORIES
            </a>
            <a
              href="/shop?sort=bestsellers"
              onClick={(e) => {
                e.preventDefault();
                setSelectedSort('bestsellers');
                navigateToCategory('all');
                setViewWithUrl('shop');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 w-full text-left py-2 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
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
