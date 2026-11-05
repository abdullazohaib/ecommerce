import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../home/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlist, productsList, setViewWithUrl } = useStore();

  const wishlistedProducts = productsList.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              You have {wishlistedProducts.length} items saved for later.
            </p>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Explore our range of authentic skin whitening night creams, soaps, and serums and tap the heart icon to save your favorites.
            </p>
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('shop');
              }}
              className="inline-block bg-black hover:bg-neutral-800 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-black/20 uppercase tracking-widest transition-all cursor-pointer"
            >
              Browse Catalog
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

