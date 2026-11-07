import React from 'react';
import { useStore } from '../../context/StoreContext';
import { categories as defaultCategories } from '../../data/categories';

export const CategoryGrid = () => {
  const { navigateToCategory, categoriesList = [] } = useStore();

  // Dynamically sourced from StoreContext (Controlled & live-editable via Admin Profile)
  const cats = (categoriesList && categoriesList.length > 0) ? categoriesList : defaultCategories;

  // Filter out any 'all' placeholder — show ONLY real active categories from the store
  const activeCategories = cats.filter(c => c && c.id !== 'all');

  // Fallback high-res artwork map for standard beauty categories
  const artworkFallbackMap = {
    lips: '/categories/lips.png',
    eyes: '/categories/eyes.png',
    face: '/categories/face.png',
    nails: '/categories/nails.png',
    skincare: '/categories/skin.png',
    skin: '/categories/skin.png',
  };

  // Gradient themes for modern cards
  const gradientMap = {
    lips: 'from-[#ff2e93] via-[#e60067] to-[#800036]',
    eyes: 'from-[#8b5cf6] via-[#6d28d9] to-[#3b0764]',
    face: 'from-[#ff8a7a] via-[#f87171] to-[#b91c1c]',
    nails: 'from-[#f43f5e] via-[#e11d48] to-[#881337]',
    skincare: 'from-[#fb923c] via-[#ea580c] to-[#9a3412]',
    skin: 'from-[#fb923c] via-[#ea580c] to-[#9a3412]',
  };

  return (
    <section className="w-full bg-[#f3f4f6]/70 sm:bg-[#f4f4f5] pt-6 sm:pt-7 pb-5 sm:pb-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================= */}
        {/* SECTION TITLE: SHOP BY CATEGORY. (Centered Modern Bold)       */}
        {/* ============================================================= */}
        <h2 className="text-center font-extrabold tracking-[0.08em] sm:tracking-[0.14em] text-neutral-900 uppercase text-lg sm:text-xl md:text-2xl mb-3.5 sm:mb-4 font-sans">
          SHOP BY CATEGORY.
        </h2>

        {/* ============================================================= */}
        {/* DYNAMIC CATEGORY CARDS (Live from Store & Admin Profile)      */}
        {/* ============================================================= */}
        <div className="flex items-center justify-start lg:justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 sm:pb-0 px-1">
          {activeCategories.map((cat) => {
            const catSlug = cat.slug || cat.id;
            
            // If admin uploaded or changed bannerImg, use it; otherwise use category artwork
            const imageSrc = cat.bannerImg && !cat.bannerImg.includes('unsplash.com')
              ? cat.bannerImg
              : (artworkFallbackMap[catSlug] || cat.bannerImg || '/categories/skin.png');

            const gradient = gradientMap[catSlug] || 'from-[#a855f7] via-[#7c3aed] to-[#4c1d95]';

            return (
              <a
                key={cat.id || catSlug}
                href={`/category/${catSlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToCategory(catSlug);
                }}
                className="group relative shrink-0 w-[120px] sm:w-[136px] md:w-[150px] lg:w-[165px] xl:w-[172px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] active:scale-95 focus:outline-none select-none cursor-pointer block bg-slate-100"
                title={`Shop ${cat.name}`}
                aria-label={`Category ${cat.name}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>

                {/* Category Product Image */}
                <img
                  src={imageSrc}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    if (artworkFallbackMap[catSlug]) {
                      e.target.src = artworkFallbackMap[catSlug];
                    }
                  }}
                />

                {/* Top White Pill Label with Dynamic Category Name (Updates live when edited in Admin Profile!) */}
                <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-xs px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm border border-black/5 whitespace-nowrap min-w-[60px] sm:min-w-[76px] text-center">
                    <span className="font-extrabold uppercase text-[10px] sm:text-xs md:text-[13px] tracking-[0.12em] text-neutral-900 select-none block">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
