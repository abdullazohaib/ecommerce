import React from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid = () => {
  const { setSelectedCategory, setCurrentView } = useStore();

  const handleCategoryClick = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified formulations tested for safety, purity, and fast results.
          </p>
        </div>

        <button
          onClick={() => handleCategoryClick('all')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors group cursor-pointer"
        >
          <span>Explore All Collections</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.filter(c => c.id !== 'all').map(cat => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="group relative bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 cursor-pointer flex flex-col items-center text-center overflow-hidden"
          >
            {/* Category image thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3.5 ring-4 ring-slate-50 group-hover:ring-rose-100 transition-all group-hover:scale-105">
              <img
                src={cat.bannerImg}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Badge */}
            {cat.badge && (
              <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {cat.badge}
              </span>
            )}

            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
              {cat.name}
            </h3>
            
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              {cat.count} Products
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
