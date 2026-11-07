import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, ShoppingBag, Zap, Heart, ShieldCheck, Check, Truck } from 'lucide-react';

export const ProductDetailModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    storeInfo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setIsCheckoutOpen,
    navigateToProduct
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedShadeIdx, setSelectedShadeIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Gallery */}
        <div className="p-6 bg-slate-50 flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm mb-4">
            <img
              src={product.images[selectedImgIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercentage && (
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shadow-xs">
                SAVE {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnails if multiple */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImgIdx === idx ? 'border-black scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Genuine Guarantee */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>100% Genuine with security hologram scratch seal</span>
          </div>
        </div>

        {/* Right Details & CTA */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Brand & Stock */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                {product.brand}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                In Stock ({product.stock} available)
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-2xl font-black text-slate-900">
                {storeInfo?.currency?.symbol || '₹'}{Number(product.price || 0).toLocaleString()}
              </span>
              {Number(product.originalPrice || 0) > Number(product.price || 0) && (
                <span className="text-sm text-slate-400 line-through">
                  {storeInfo?.currency?.symbol || '₹'}{Number(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 ml-auto">
                Save {storeInfo?.currency?.symbol || '₹'}{(Number(product.originalPrice || product.price) - Number(product.price)).toLocaleString()}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {product.shortDescription}
            </p>

            {/* Benefits preview */}
            <div className="space-y-1.5 mb-6">
              {product.benefits.slice(0, 2).map((b, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
            {/* Color Shades Selector (Shown only when product has shades enabled) */}
            {product.hasShades && product.shades && product.shades.length > 0 && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800">Select Shade:</span>
                  <span className="text-slate-600 font-semibold text-[11px]">
                    {product.shades[selectedShadeIdx]?.name || `Shade ${selectedShadeIdx + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.shades.map((sh, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedShadeIdx(idx)}
                      style={{ backgroundColor: sh.color }}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                        selectedShadeIdx === idx
                          ? 'border-black ring-2 ring-black scale-110'
                          : 'border-slate-300 hover:scale-110'
                      }`}
                      title={sh.name}
                    />
                  ))}
                  {product.shadeCountText && (
                    <span className="text-[11px] font-bold text-slate-700 ml-1">
                      {product.shadeCountText}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-black font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:text-black font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`ml-auto p-2.5 rounded-xl border transition-all cursor-pointer ${
                  inWishlist
                    ? 'border-black bg-black text-white'
                    : 'border-slate-200 text-slate-700 hover:text-black hover:bg-slate-50'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white text-white' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-white border-2 border-black text-black hover:bg-slate-50 font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-md shadow-xs transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-md shadow-md shadow-black/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Buy Now (COD)</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateToProduct(product);
                }}
                className="text-xs font-bold text-black hover:underline cursor-pointer uppercase tracking-wider"
              >
                View Full Product Page & Ingredients →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

