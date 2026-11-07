import React from 'react';
import { useStore } from '../../context/StoreContext';

export const CategoryGrid = () => {
  const store = useStore();
  const { 
    navigateToCategory, 
    setSelectedCategory, 
    setSelectedSort, 
    setSearchQuery, 
    setViewWithUrl 
  } = store;

  // 7 Core categories matching SUGAR reference layout (media_1794040014714_1b6c12bb.jpg)
  const categoryCards = [
    {
      id: 'lips',
      label: 'LIPS',
      image: '/categories/lips.png',
      alt: 'Shop Lips - Lipsticks, Lip Oils, Gloss & Liners',
      url: '/category/lips',
      action: () => navigateToCategory('lips'),
    },
    {
      id: 'eyes',
      label: 'EYES',
      image: '/categories/eyes.png',
      alt: 'Shop Eyes - Kohl, Kajal, Eyeliners & Mascara',
      url: '/category/eyes',
      action: () => navigateToCategory('eyes'),
    },
    {
      id: 'face',
      label: 'FACE',
      image: '/categories/face.png',
      alt: 'Shop Face - Foundations, Primers & Compacts',
      url: '/category/face',
      action: () => navigateToCategory('face'),
    },
    {
      id: 'nails',
      label: 'NAILS',
      image: '/categories/nails.png',
      alt: 'Shop Nails - Longwear Polish & Colors',
      url: '/category/nails',
      action: () => navigateToCategory('nails'),
    },
    {
      id: 'kits',
      label: 'KITS',
      image: '/categories/kits.png',
      alt: 'Shop Beauty Kits, Combos & Gift Sets',
      url: '/shop?search=kit',
      action: () => {
        setSelectedCategory('all');
        setSearchQuery('kit');
        setViewWithUrl('shop');
      },
    },
    {
      id: 'skin',
      label: 'SKIN',
      image: '/categories/skin.png',
      alt: 'Shop Skin - Moisturizers, Serums & Cleansers',
      url: '/category/skincare',
      action: () => navigateToCategory('skincare'),
    },
    {
      id: 'store-249',
      label: '249 STORE',
      image: '/categories/deals.png',
      alt: 'Shop Special Offers & Budget Bestsellers',
      url: '/shop?sort=price-low',
      action: () => {
        setSelectedCategory('all');
        setSelectedSort('price-low');
        setSearchQuery('');
        setViewWithUrl('shop');
      },
    },
  ];

  return (
    <section className="w-full bg-[#f3f4f6]/70 sm:bg-[#f4f4f5] py-8 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================= */}
        {/* SECTION TITLE: SHOP BY CATEGORY. (Centered Modern Clean Bold) */}
        {/* ============================================================= */}
        <h2 className="text-center font-extrabold tracking-[0.08em] sm:tracking-[0.14em] text-neutral-900 uppercase text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-sans">
          SHOP BY CATEGORY.
        </h2>

        {/* ============================================================= */}
        {/* CATEGORY CARDS ROW: 7 Vibrant Gradient Cards with Hover FX    */}
        {/* ============================================================= */}
        <div className="flex items-center justify-start lg:justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 sm:pb-0 px-1">
          {categoryCards.map((card) => (
            <a
              key={card.id}
              href={card.url}
              onClick={(e) => {
                e.preventDefault();
                card.action();
              }}
              className="group shrink-0 w-[115px] sm:w-[132px] md:w-[145px] lg:w-[155px] xl:w-[162px] aspect-square rounded-2xl sm:rounded-3xl transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] active:scale-95 focus:outline-none select-none cursor-pointer"
              title={card.alt}
              aria-label={card.label}
            >
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-contain rounded-2xl sm:rounded-3xl drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 pointer-events-none"
                loading="eager"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
