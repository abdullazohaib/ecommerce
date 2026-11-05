import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, Heart, ShoppingBag, Truck } from 'lucide-react';

export const MobileBottomNav = () => {
  const { 
    currentView, 
    setCurrentView,
    setViewWithUrl,
    cartItemCount, 
    wishlist, 
    setIsCartOpen,
    setIsTrackingModalOpen 
  } = useStore();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl py-2 px-3">
      <div className="flex items-center justify-around">
        {/* Home */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('home');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'home' ? 'text-black font-extrabold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </a>

        {/* Categories / Shop */}
        <a
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('shop');
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === 'shop' ? 'text-black font-extrabold' : 'text-slate-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Shop</span>
        </a>

        {/* Wishlist */}
        <a
          href="/wishlist"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('wishlist');
          }}
          className={`relative flex flex-col items-center gap-1 transition-colors ${
            currentView === 'wishlist' ? 'text-black font-extrabold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">Wishlist</span>
        </a>

        {/* Track Order */}
        <button
          onClick={() => setIsTrackingModalOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Truck className="w-5 h-5 text-slate-800" />
          <span className="text-[10px]">Track</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-black cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md shadow-black/20">
              <ShoppingBag className="w-4 h-4" />
            </div>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Cart</span>
        </button>
      </div>
    </div>
  );
};

