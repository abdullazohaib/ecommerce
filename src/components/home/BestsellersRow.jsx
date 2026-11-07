import React, { useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const BestsellersRow = () => {
  const { 
    productsList = [], 
    addToCart, 
    addToast, 
    navigateToProduct,
    storeInfo = {} 
  } = useStore();

  const scrollContainerRef = useRef(null);
  const [selectedShades, setSelectedShades] = useState({});
  const [addedItems, setAddedItems] = useState({});

  // LIVE CONNECTION TO ADMIN PROFILE:
  // Filter products marked as Bestseller or Featured in Admin Profile catalog
  const adminBestsellers = (productsList || []).filter(
    p => p && (p.isBestseller === true || p.featured === true || (p.badge && p.badge.toLowerCase().includes('bestseller')))
  );

  // Fallback to top rated products if admin hasn't marked any yet
  const displayProducts = adminBestsellers.length > 0
    ? adminBestsellers
    : (productsList || []).slice(0, 8);

  if (displayProducts.length === 0) {
    return null;
  }

  // Smooth scroll handler for carousel arrows
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    if (addToast) addToast(`Added "${product.name}" to cart!`, 'success');
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const hasProductShades = (product) => {
    return Boolean(
      product.hasShades && 
      Array.isArray(product.shades) && 
      product.shades.length > 0
    );
  };

  return (
    <section className="w-full bg-white pt-6 sm:pt-8 pb-5 sm:pb-7 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================= */}
        {/* SECTION TITLE: BESTSELLERS (Centered Modern Clean Sans-Serif) */}
        {/* ============================================================= */}
        <h2 className="text-center font-bold tracking-[0.18em] sm:tracking-[0.24em] text-neutral-900 uppercase text-lg sm:text-xl md:text-2xl mb-4 sm:mb-5 font-sans">
          BESTSELLERS
        </h2>

        {/* Carousel Container with Navigation Arrows */}
        <div className="relative group/carousel">
          
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer disabled:opacity-0"
            aria-label="Previous bestsellers"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all opacity-90 sm:opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            aria-label="Next bestsellers"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Products Horizontal Slider */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-1"
          >
            {displayProducts.map((product) => {
              const discount = product.discountPercentage || 
                (product.originalPrice && product.originalPrice > product.price 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                  : 15);

              const activeShade = selectedShades[product.id] || 0;
              const hasShades = hasProductShades(product);
              const shadesList = hasShades ? product.shades : [];
              const isAdded = addedItems[product.id];
              const reviews = product.reviewsCount || Math.floor(product.price * 1.8) + 120;

              return (
                <div
                  key={product.id}
                  onClick={() => navigateToProduct(product)}
                  className="shrink-0 w-[240px] sm:w-[270px] md:w-[285px] bg-white rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer group border border-slate-100 select-none"
                >
                  <div>
                    {/* Top Image Area with Stacked Black Badges matching SUGAR Reference */}
                    <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden mb-3">
                      
                      {/* Stacked Black Badges on Top Left */}
                      <div className="absolute top-0 left-0 flex flex-col items-start gap-1 z-10 pointer-events-none">
                        <span className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-2xs">
                          BESTSELLER
                        </span>
                        {discount > 0 ? (
                          <span className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-2xs">
                            SAVE {discount}%
                          </span>
                        ) : (
                          <span className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-2xs">
                            ON SALE
                          </span>
                        )}
                      </div>

                      {/* Product Visual */}
                      <img
                        src={(product.images && product.images[0]) || product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>

                    {/* Shade Swatches Row (Circular dots + extra count) - Only shown if product has shades */}
                    {hasShades && (
                      <div className="flex items-center gap-1.5 my-2">
                        {shadesList.slice(0, 5).map((sh, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShades(prev => ({ ...prev, [product.id]: idx }));
                            }}
                            style={{ backgroundColor: sh.color || sh }}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all cursor-pointer ${
                              activeShade === idx 
                                ? 'border-black ring-1 ring-black scale-110' 
                                : 'border-slate-300 hover:scale-110'
                            }`}
                            title={sh.name || `Shade ${idx + 1}`}
                          />
                        ))}
                        {product.shadeCountText && (
                          <span className="text-[10px] font-bold text-neutral-900 ml-1">
                            {product.shadeCountText}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Product Name (Uppercase & letter-spaced matching reference) */}
                    <h3 className="font-bold text-neutral-900 text-xs sm:text-[13px] uppercase tracking-wider line-clamp-1 group-hover:text-black transition-colors">
                      {product.name}
                    </h3>

                    {/* Solid Black Stars Rating */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex text-black text-xs tracking-tight">
                        ★★★★★
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        ({reviews})
                      </span>
                    </div>

                    {/* Price Row: Rs. Price  Rs. OriginalPrice | Discount% Off */}
                    <div className="flex items-baseline gap-1.5 mt-2 flex-wrap text-xs sm:text-sm">
                      <span className="font-bold text-neutral-900">
                        Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-slate-400 line-through text-xs">
                          Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="text-emerald-600 font-semibold text-xs ml-0.5">
                          | {discount}% Off
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Full-width Solid Black ADD TO CART Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`w-full mt-3 font-bold text-xs py-2.5 rounded-md transition-all uppercase tracking-wider text-center cursor-pointer shadow-xs active:scale-98 ${
                      isAdded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-black hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <span className="inline-flex items-center gap-1 justify-center">
                        <Check className="w-3.5 h-3.5" /> ADDED
                      </span>
                    ) : (
                      'ADD TO CART'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

