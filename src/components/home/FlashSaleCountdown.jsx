import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Flame, Clock, Sparkles } from 'lucide-react';

export const FlashSaleCountdown = () => {
  const { productsList } = useStore();

  // Deal of the day countdown: resets daily
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = productsList.filter(p => p.isDealOfDay).slice(0, 4);

  return (
    <section id="flash-deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs">
        
        {/* Header with Countdown timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-widest">
              <Flame className="w-4 h-4 fill-black text-black" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-1">
              Deals of the Day
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Special daily discounted prices on genuine bestselling skincare essentials.
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-lg border border-slate-800 self-start md:self-auto">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-xs font-semibold text-slate-300 mr-2">Ends In:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
              <span className="bg-slate-800 text-amber-300 px-2 py-1 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-amber-400">:</span>
              <span className="bg-slate-800 text-amber-300 px-2 py-1 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-amber-400">:</span>
              <span className="bg-slate-800 text-amber-300 px-2 py-1 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

