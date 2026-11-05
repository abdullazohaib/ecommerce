import React, { useState } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    storeInfo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateToProduct
  } = useStore();

  const [selectedShade, setSelectedShade] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const cleanSlug = product.slug || slugify(product.name || product.id);
  const directProductUrl = `/products/${cleanSlug}`;

  // Shade palettes matching cosmetic products
  const shadeSwatches = product.shades || [
    { color: '#e8be9b', name: 'Fair Ivory' },
    { color: '#dca47e', name: 'Natural Beige' },
    { color: '#b96c4b', name: 'Warm Tan' },
    { color: '#9d3d3c', name: 'Coral Spice' },
    { color: '#74232c', name: 'Plum Crimson' }
  ];

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discount = product.discountPercentage || 
    (product.originalPrice && product.originalPrice > product.price 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 30);

  return (
    <div
      onClick={() => navigateToProduct(product)}
      className="group relative bg-white rounded-lg border border-slate-200/90 hover:border-black transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer p-3 sm:p-4 hover:shadow-md"
    >
      {/* Top Image Container & Badges */}
      <div className="relative aspect-square overflow-hidden bg-white mb-2 flex items-center justify-center">
        <img
          src={(product.images && product.images[0]) || product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Top-Left Pure Black Badges (Matching Screenshot) */}
        <div className="absolute top-1 left-1 flex flex-col items-start gap-1 z-10 pointer-events-none">
          <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-xs">
            {product.badge || 'BESTSELLER'}
          </span>
          {discount > 0 && (
            <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-xs">
              SAVE {discount}%
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart */}
        <div className="absolute top-1 right-1 z-10">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-xs transition-all shadow-xs ${
              inWishlist
                ? 'text-black'
                : 'text-slate-400 hover:text-black hover:scale-110'
            }`}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-black text-black' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          {/* Shades Swatches Selector (Matching Screenshot) */}
          <div className="flex items-center gap-1.5 my-2">
            <div className="flex items-center gap-1.5">
              {shadeSwatches.map((shade, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedShade(idx);
                  }}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    selectedShade === idx
                      ? 'ring-2 ring-black ring-offset-2 scale-110'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: shade.color || shade }}
                  title={shade.name || `Shade ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-800 ml-1">
              +{product.shadesCount || 6} Shades
            </span>
          </div>

          {/* Title - clickable direct anchor with URL */}
          <a
            href={directProductUrl}
            onClick={(e) => {
              e.preventDefault();
              navigateToProduct(product);
            }}
            className="text-xs sm:text-[13px] font-bold text-black uppercase tracking-wide line-clamp-1 hover:underline cursor-pointer block leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </a>

          {/* Rating with solid black stars and review count in parentheses */}
          <div className="flex items-center gap-1.5 text-xs mb-2">
            <div className="flex text-black">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-black text-black'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-700 text-xs font-semibold">
              ({product.reviewsCount || 1479})
            </span>
          </div>

          {/* Pricing Row: Rs. 617.00  Rs. 949.00 | 35% Off */}
          <div className="flex items-baseline gap-2 flex-wrap text-xs mb-3">
            <span className="text-sm sm:text-base font-black text-black">
              Rs. {Number(product.price || 0).toFixed(2)}
            </span>
            {Number(product.originalPrice || 0) > Number(product.price || 0) && (
              <span className="text-xs text-slate-400 line-through">
                Rs. {Number(product.originalPrice || 0).toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs text-emerald-600 font-bold">
                | {discount}% Off
              </span>
            )}
          </div>
        </div>

        {/* Bottom Full-Width Solid Black ADD TO CART Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full font-black text-xs uppercase tracking-widest py-3 px-4 rounded-md transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-black hover:bg-neutral-800 active:bg-neutral-900 text-white'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>ADDED TO CART</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
