import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroSlider = () => {
  const { setCurrentView, setSelectedCategory, storeInfo } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: "India's #1 Night Cream Formula",
      title: "Vita Glow Advanced Night Creams",
      subtitle: "Unleash overnight radiance with pure L-Glutathione & Kojic Acid. Visibly reduces dark spots, pigmentation & sun tan in 7 days.",
      offerText: "FLAT 30% OFF + FREE COD",
      coupon: "GLOW20",
      ctaText: "Shop Night Creams",
      catSlug: "night-creams",
      bgGradient: "from-rose-950 via-slate-900 to-slate-950",
      accentColor: "text-amber-400",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      tag: "Pure Glutathione Concentrate",
      title: "Gluta White Concentrated Serums",
      subtitle: "Accelerated skin brightness with 20% stabilized Vitamin C, Hyaluronic Acid, and Swiss-formulated skin whitening peptides.",
      offerText: "SPECIAL BUNDLE DEALS",
      coupon: "BEAUTY500",
      ctaText: "Explore Face Serums",
      catSlug: "serums",
      bgGradient: "from-slate-950 via-purple-950 to-slate-900",
      accentColor: "text-rose-400",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      tag: "Authentic & 100% Herbal",
      title: "Handcrafted Whitening Soaps & Bars",
      subtitle: "Enriched with goat milk, papaya enzymes, and Kojic acid for daily deep cleansing and soft, luminous skin tone.",
      offerText: "STARTING AT JUST ₹349",
      coupon: "FLAT10",
      ctaText: "Shop Herbal Soaps",
      catSlug: "soaps",
      bgGradient: "from-amber-950 via-slate-900 to-rose-950",
      accentColor: "text-emerald-400",
      image: "https://images.unsplash.com/photo-1607006314647-79a6d05634e7?auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bgGradient} text-white shadow-2xl min-h-[460px] sm:min-h-[500px] flex items-center transition-all duration-700`}>
        
        {/* Glow ambient background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12 lg:p-16">
          
          {/* Left Text content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span className={slide.accentColor}>{slide.tag}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-extrabold tracking-tight leading-[1.15] text-white">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            {/* Offer highlight pill */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                {slide.offerText}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Genuine Hologram Verified
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => {
                  setSelectedCategory(slide.catSlug);
                  setCurrentView('shop');
                }}
                className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-rose-600/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentView('shop');
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all cursor-pointer"
              >
                View Full Catalog
              </button>
            </div>
          </div>

          {/* Right Product Spotlight Image */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-amber-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl max-w-sm sm:max-w-md">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-64 sm:h-80 object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fast Dispatch</span>
                    <p className="font-bold text-white">Delivery Across India in 2-4 Days</p>
                  </div>
                  <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md uppercase">
                    In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-rose-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
