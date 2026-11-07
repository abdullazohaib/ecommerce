import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export const FlashSaleCountdown = () => {
  const { 
    productsList = [], 
    storeInfo = {}, 
    addToCart, 
    addToast, 
    toggleWishlist, 
    isInWishlist, 
    navigateToProduct,
    setSelectedSort,
    setSelectedCategory,
    setViewWithUrl
  } = useStore();

  // If Deals section is explicitly disabled from Admin Profile
  if (storeInfo?.dealOfTheDay?.enabled === false) {
    return null;
  }

  // Daily Countdown Timer (Resetting daily or based on configured hours)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: storeInfo?.dealOfTheDay?.countdownHours || 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [storeInfo?.dealOfTheDay?.countdownHours]);

  // LIVE CONNECTION TO ADMIN PROFILE:
  // Products marked as 'isDealOfDay: true' in Admin Profile catalog
  const adminDealProducts = (productsList || []).filter(p => p && p.isDealOfDay);

  // If admin has not toggled any deals yet, fallback to top discounted products
  const displayDeals = adminDealProducts.length > 0 
    ? adminDealProducts 
    : (productsList || [])
        .filter(p => p && p.price && p.originalPrice && p.originalPrice > p.price)
        .slice(0, 4);

  if (displayDeals.length === 0) {
    return null;
  }

  const sectionTitle = storeInfo?.dealOfTheDay?.title || 'DEALS OF THE DAY.';

  return (
    <section id="flash-deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 md:p-10 relative overflow-hidden">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* ============================================================= */}
        {/* HEADER: Clean Typography Title matching SHOP BY CATEGORY      */}
        {/* ============================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold tracking-[0.08em] sm:tracking-[0.14em] text-neutral-900 uppercase text-lg sm:text-xl md:text-2xl font-sans">
              {sectionTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 self-start sm:self-auto">
            {/* Sleek Countdown Timer Pill */}
            <div className="flex items-center gap-2 bg-black text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">ENDS IN:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
                <span className="bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-amber-400 font-bold">:</span>
                <span className="bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-amber-400 font-bold">:</span>
                <span className="bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* View All Deals link */}
            <a
              href="/shop?sort=bestsellers"
              onClick={(e) => {
                e.preventDefault();
                setSelectedSort('bestsellers');
                setSelectedCategory('all');
                setViewWithUrl('shop');
              }}
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-rose-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ============================================================= */}
        {/* DEAL PRODUCT CARDS GRID (Live Sync with Admin Profile)        */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayDeals.map(product => {
            const discount = product.discountPercentage || 
              (product.originalPrice && product.originalPrice > product.price 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                : 25);
            const inWish = isInWishlist ? isInWishlist(product.id) : false;
            const stockLeft = product.stock > 0 ? Math.min(product.stock, 9) : 4;

            return (
              <div
                key={product.id}
                onClick={() => navigateToProduct(product)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-black transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer p-4 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Product Image Area */}
                  <div className="relative aspect-square overflow-hidden bg-slate-50/60 rounded-xl mb-3 flex items-center justify-center">
                    <img
                      src={(product.images && product.images[0]) || product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";
                      }}
                    />

                    {/* Deal Discount Badge */}
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs z-10">
                      {discount}% OFF
                    </span>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (toggleWishlist) toggleWishlist(product);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-500 shadow-xs z-10 transition-colors"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Brand & Title */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {product.brand || 'Classic Glow'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mt-0.5 group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Stock Urgency Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <span>⚡</span> Limited Stock: Only {stockLeft} left!
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 h-full rounded-full w-[70%]"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="text-[11px] font-bold text-rose-600 ml-auto">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (addToCart) addToCart(product, 1);
                      if (addToast) addToast(`Added "${product.name}" to bag!`, 'success');
                    }}
                    className="w-full mt-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
