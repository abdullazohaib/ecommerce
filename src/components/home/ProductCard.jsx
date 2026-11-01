import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, Eye, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    storeInfo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct,
    navigateToProduct,
    setIsCheckoutOpen
  } = useStore();

  const inWishlist = isInWishlist(product.id);

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={() => navigateToProduct(product)}
      className="group relative bg-white rounded-3xl border border-slate-100/90 shadow-sm hover:shadow-2xl hover:border-rose-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercentage && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Action icons (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              inWishlist
                ? 'bg-rose-600 text-white'
                : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
            }`}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Authentic badge on image */}
        <div className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-sm text-slate-200 text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Original Hologram</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              {product.brand}
            </span>

            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Size / Short spec */}
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            {product.size} • {product.shortDescription}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {storeInfo.currency.symbol}{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {storeInfo.currency.symbol}{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[10px] text-emerald-600 font-bold ml-auto">
              Save {storeInfo.currency.symbol}{(product.originalPrice - product.price).toLocaleString()}
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-rose-700 font-bold text-xs py-2.5 px-2 rounded-xl transition-all border border-slate-200 hover:border-rose-200 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs py-2.5 px-2 rounded-xl shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
