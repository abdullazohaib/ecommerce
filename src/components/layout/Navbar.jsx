import React from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { Sparkles, Tag, ShieldCheck, Flame, BookOpen, Layers } from 'lucide-react';

export const Navbar = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setCurrentView,
    currentView
  } = useStore();

  return (
    <nav className="hidden lg:block bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs font-semibold h-12">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('shop');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                currentView === 'shop' && selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Products</span>
            </button>

            {categories.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('shop');
                }}
                className={`relative px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'shop' && selectedCategory === cat.id
                    ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${
                    cat.badge === 'Trending' 
                      ? 'bg-amber-100 text-amber-800' 
                      : cat.badge === 'Best Seller'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right Highlights: Flash Deals & Skincare Blog */}
          <div className="flex items-center gap-4 text-slate-500 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                const el = document.getElementById('flash-deals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-rose-600 font-bold hover:text-rose-700 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Flash Deals</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => {
                setCurrentView('home');
                const el = document.getElementById('skincare-guides');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Skincare Tips</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

