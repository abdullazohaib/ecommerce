import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Clock } from 'lucide-react';

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
        
        {/* Header with Clean Title & Countdown timer matching reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-neutral-200/70">
          <h2 className="font-extrabold tracking-[0.08em] sm:tracking-[0.14em] text-neutral-900 uppercase text-lg sm:text-xl md:text-2xl font-sans">
            DEALS OF THE DAY.
          </h2>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2.5 bg-black text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs self-start sm:self-auto">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Ends In:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm">
              <span className="bg-neutral-800 text-amber-300 px-2 py-0.5 rounded-md">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="bg-neutral-800 text-amber-300 px-2 py-0.5 rounded-md">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-amber-400 font-bold">:</span>
              <span className="bg-neutral-800 text-amber-300 px-2 py-0.5 rounded-md">
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

