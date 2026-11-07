import React from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid = () => {
  const { navigateToCategory, categoriesList = [], productsList = [] } = useStore();
  const cats = (categoriesList && categoriesList.length > 0) ? categoriesList : categories;

  const handleCategoryClick = (catSlug) => {
    navigateToCategory(catSlug);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified formulations tested for safety, purity, and fast results.
          </p>
        </div>

        <a
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            navigateToCategory('all');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:text-neutral-700 transition-colors group cursor-pointer uppercase tracking-wider"
        >
          <span>Explore All Collections</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {cats.filter(c => c.id !== 'all').map(cat => {
          const prodCount = productsList.filter(p => p.category === cat.id || p.category === cat.slug).length || cat.count || 0;
          return (
            <a
              key={cat.id || cat.slug}
              href={`/category/${cat.slug || cat.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory(cat.slug || cat.id);
              }}
              className="group relative bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-black transition-all duration-300 cursor-pointer flex flex-col items-center text-center overflow-hidden block"
            >
              {/* Category image thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3.5 ring-4 ring-slate-100 group-hover:ring-slate-300 transition-all group-hover:scale-105">
                <img
                  src={cat.bannerImg}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Badge */}
              {cat.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  {cat.badge}
                </span>
              )}

              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-black transition-colors">
                {cat.name}
              </h3>
              
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {prodCount} Products
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
};

