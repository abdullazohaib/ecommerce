import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const ProductGrid = () => {
  const { productsList = [], categoriesList = [], setViewWithUrl } = useStore();
  const [activeTab, setActiveTab] = useState('bestsellers');

  const activeCategories = (categoriesList && categoriesList.length > 0) ? categoriesList : [];
  const tabs = [
    { id: 'bestsellers', label: 'Best Sellers' },
    ...activeCategories.filter(c => c.id !== 'all').map(c => ({ id: c.slug || c.id, label: c.name })),
    { id: 'all', label: 'View All' }
  ];

  const getFilteredProducts = () => {
    if (activeTab === 'bestsellers') {
      return productsList.filter(p => p.featured || p.rating >= 4.8);
    }
    if (activeTab === 'all') {
      return productsList;
    }
    return productsList.filter(p => p.category === activeTab);
  };

  const displayedProducts = getFilteredProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Formulations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-1">
            Explore Trending Products
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Top rated skin lightening treatments with thousands of verified customer transformations.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <a
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('shop');
          }}
          className="inline-flex items-center gap-2.5 bg-white border-2 border-slate-900 hover:bg-slate-900 text-slate-900 hover:text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl transition-all shadow-sm hover:shadow-lg cursor-pointer"
        >
          <span>Explore Entire Catalog ({productsList.length} Items)</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

