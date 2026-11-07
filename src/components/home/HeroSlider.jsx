import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroSlider = () => {
  const { navigateToCategory, navigateToProduct, setViewWithUrl, storeInfo, banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamically powered by Admin Panel Banners!
  const availableBanners = (banners && banners.length > 0) ? banners : (storeInfo.banners || []);
  const activeSlides = availableBanners.filter(b => b.active !== false && b.status !== 'Draft');
  const slides = activeSlides.length > 0 ? activeSlides : availableBanners;

  // Auto slide
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const safeIdx = currentSlide < slides.length ? currentSlide : 0;
  const slide = slides[safeIdx] || {
    id: "fallback",
    isGraphicBanner: true,
    bannerType: "image",
    tag: "Classic Glow Exclusive",
    title: "9 TO 5 HYA GLAM RANGE",
    subtitle: "Effortless all-day radiance and lightweight hydration. Ready in 5 minutes.",
    offerText: "SPECIAL LAUNCH OFFER",
    coupon: "GLAM20",
    ctaText: "Shop Glam Range",
    ctaLink: "/shop",
    secondaryCtaText: "View Full Catalog",
    secondaryCtaLink: "/shop",
    catSlug: "serums",
    bgClass: "bg-white text-slate-900 border border-slate-100",
    badgeClass: "bg-rose-100/90 text-rose-800 border-rose-200",
    image: "/banners/classic-glow-hero-clean.jpg"
  };

  // Safe universal URL handler for internal & external links
  const handleUrlNavigation = (targetUrl) => {
    if (!targetUrl) {
      setViewWithUrl('shop');
      return;
    }
    const clean = targetUrl.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      window.location.href = clean;
      return;
    }
    if (clean.startsWith('/product/') || clean.startsWith('/products/')) {
      const slug = clean.replace(/^\/products?\//, '');
      navigateToProduct(slug);
    } else if (clean.startsWith('/category/')) {
      const cat = clean.replace('/category/', '');
      navigateToCategory(cat);
    } else if (clean === '/shop' || clean === 'shop') {
      setViewWithUrl('shop');
    } else if (clean === '/about-us' || clean === '/about' || clean === 'about') {
      setViewWithUrl('about');
    } else if (clean === '/contact-us' || clean === '/contact' || clean === 'contact') {
      setViewWithUrl('contact');
    } else if (clean === '/blog' || clean === 'blog') {
      setViewWithUrl('blog');
    } else if (clean.startsWith('/')) {
      setViewWithUrl(clean.replace('/', ''));
    } else {
      navigateToProduct(clean);
    }
  };

  const primaryTargetUrl = slide.ctaLink || (slide.catSlug ? `/category/${slide.catSlug}` : '/shop');
  const secondaryTargetUrl = slide.secondaryCtaLink || '/shop';
  const isGraphicBanner = slide.isGraphicBanner !== false && slide.bannerType !== 'split';

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className={`relative w-full overflow-hidden ${isGraphicBanner ? 'bg-white' : slide.bgClass} flex items-center transition-all duration-700`}>
        
        {/* Full Graphic Image Banner (Edge-to-edge full width with NO side gaps) */}
        {isGraphicBanner ? (
          <div 
            onClick={() => handleUrlNavigation(primaryTargetUrl)}
            className="w-full relative group cursor-pointer overflow-hidden"
          >
            <div className="w-full aspect-[16/9] sm:aspect-[2.2/1] md:aspect-[2.6/1] lg:aspect-[3/1] min-h-[240px] sm:min-h-[380px] md:min-h-[460px] max-h-[620px] bg-neutral-100 flex items-center justify-center overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title || "Banner"}
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/banners/classic-glow-hero-clean.jpg";
                }}
              />
            </div>

            {/* Subtle floating CTA button (only if explicitly enabled on graphic banner) */}
            {slide.showCtaOverlay && (
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-10 z-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUrlNavigation(primaryTargetUrl);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer border border-white/20"
                >
                  <span>{slide.ctaText || "Shop Collection"}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Subtle decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12 lg:p-16">
              
              {/* Left Text content */}
              <div className="lg:col-span-7 space-y-5">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-2xs ${slide.badgeClass}`}>
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                  <span>{slide.tag}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif font-extrabold tracking-tight leading-[1.15] text-slate-900">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Offer highlight pill */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="bg-black text-white font-black text-xs px-3.5 py-1.5 rounded-lg uppercase tracking-wider shadow-xs">
                    {slide.offerText || "SPECIAL OFFER"}
                  </span>
                  <span className="text-xs text-slate-700 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {slide.guaranteeText || "100% Genuine Hologram Verified"}
                  </span>
                </div>

                {/* Real Link Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href={primaryTargetUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      handleUrlNavigation(primaryTargetUrl);
                    }}
                    className="bg-black hover:bg-neutral-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-black/20 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer uppercase tracking-wider"
                  >
                    <span>{slide.ctaText || "Shop Collection"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={secondaryTargetUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      handleUrlNavigation(secondaryTargetUrl);
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {slide.secondaryCtaText || "View Full Catalog"}
                  </a>
                </div>
              </div>

              {/* Right Product Spotlight Image */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div 
                  onClick={() => handleUrlNavigation(primaryTargetUrl)}
                  className="relative group cursor-pointer"
                  title={`Click to open ${slide.title}`}
                >
                  <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl max-w-sm sm:max-w-md bg-white p-2">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-64 sm:h-80 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1607006314647-79a6d05634e7?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-100 shadow-md flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-black uppercase font-black tracking-wider">
                          {slide.dispatchTag || "Fast Dispatch"}
                        </span>
                        <p className="font-bold text-slate-800">
                          {slide.dispatchText || "Delivery Across India in 2-4 Days"}
                        </p>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                        {slide.stockBadge || "In Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-20"
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
                currentSlide === idx ? 'w-8 bg-black' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
