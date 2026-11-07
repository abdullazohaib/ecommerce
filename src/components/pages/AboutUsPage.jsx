import React from 'react';
import { useStore } from '../../context/StoreContext';
import { initialAboutSection } from '../../config/storeConfig';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  MessageCircle,
  Check,
  Heart,
  Award
} from 'lucide-react';

export const AboutUsPage = () => {
  const { storeInfo = {}, aboutSection: storeAbout, setViewWithUrl } = useStore();
  const about = storeAbout || initialAboutSection;

  const pillarIcons = [ShieldCheck, Truck, Sparkles, Award, Heart];

  const handleCtaClick = () => {
    const rawNumber = (storeInfo?.whatsappNumber || storeInfo?.supportPhone || '').replace(/[^\d]/g, '');
    if (rawNumber) {
      const msg = encodeURIComponent(`Hi ${storeInfo?.storeName || 'Classic Glow'}, I am on your About Us page and would like guidance on finding the right shade & products.`);
      window.open(`https://wa.me/${rawNumber}?text=${msg}`, '_blank');
    } else {
      setViewWithUrl('contact');
    }
  };

  const storeName = storeInfo?.storeName || 'Classic Glow';

  return (
    <div className="w-full bg-white text-neutral-900 min-h-screen font-sans selection:bg-black selection:text-white">
      
      {/* ================================================================= */}
      {/* 1. TOP BREADCRUMB & BACK LINK                                     */}
      {/* ================================================================= */}
      <div className="border-b border-neutral-100 bg-neutral-50/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-500">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="hover:text-black transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">About Us</span>
          </div>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setViewWithUrl('home');
            }}
            className="inline-flex items-center gap-1.5 font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* ================================================================= */}
        {/* 2. HERO HEADER (Clean, Bold, High-Fashion Sans-Serif)             */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[11px] font-bold tracking-[0.22em] text-neutral-500 uppercase block">
            {about.badge || "ABOUT THE BRAND"}
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-neutral-950 leading-tight">
            {about.title || `Empowering Everyday Beauty & Uncompromising Purity`}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto pt-1">
            {about.subtitle || "We create high-performance cosmetics and scientifically backed skincare that celebrate your individuality with 100% genuine, certified formulations."}
          </p>
        </div>

        {/* ================================================================= */}
        {/* 3. KEY STATS & METRICS BAR (Minimalist Numbers Strip)             */}
        {/* ================================================================= */}
        <div className="my-10 sm:my-14 py-6 sm:py-8 border-y border-neutral-200/90 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
              {about.statNumber || "50,000+"}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">
              {about.statLabel || "Happy Customers Across India"}
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
              100%
            </div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">
              Genuine Hologram Certified
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
              2-4 Days
            </div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">
              Express Pan-India Delivery
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
              {about.establishedYear || "Est. 2018"}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">
              Trusted Beauty Heritage
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. THE BRAND STORY (Editorial Two-Column Layout)                  */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center my-10 sm:my-16">
          
          {/* Left: Brand / Story Image */}
          {about.storyImage && (
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-sm aspect-4/5 group bg-neutral-100">
                <img
                  src={about.storyImage}
                  alt={storeName}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                
                {/* Floating Minimal Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-xs text-white p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="leading-tight">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-400">Authenticity Guarantee</span>
                    <span className="text-xs font-semibold">Every product carries verifiable serials</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right: Editorial Story Copy */}
          <div className={`${about.storyImage ? 'md:col-span-7' : 'md:col-span-12'} space-y-5 order-1 md:order-2`}>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-neutral-900 font-sans">
                {about.storyTitle || "Our Story"}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {about.storyParagraph1 || `Born out of a passion for high-impact beauty without compromises, ${storeName} brings together rich pigment payoff, velvety textures, and skin-loving active ingredients. From signature peptide lip oils to seamless HD foundations, every formula is designed for real life.`}
            </p>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              {about.storyParagraph2 || `We believe beauty should be genuine, accessible, and safe. That's why every product in our catalog undergoes rigorous batch verification, carrying our security hologram seal so you never have to doubt what touches your skin.`}
            </p>

            {/* Quick Core Assurances */}
            <div className="pt-2 space-y-2 border-t border-neutral-100">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Cruelty-Free, 100% Vegetarian & Safe Formulations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Dermatologically Endorsed & Clinically Verified</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Free Express Shipping on Orders Above ₹999</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* 5. CORE PROMISES & PILLARS (Clean Minimal Grid)                   */}
        {/* ================================================================= */}
        <div className="my-12 sm:my-16 pt-8 border-t border-neutral-200">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
              THE STANDARD WE LIVE BY
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-neutral-900 font-sans">
              OUR CORE PROMISES.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(about.pillars || []).map((pillar, idx) => {
              const IconComponent = pillarIcons[idx % pillarIcons.length] || ShieldCheck;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-white border border-neutral-200 text-left space-y-3 hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {pillar.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        {pillar.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                    {pillar.title}
                  </h4>

                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. WHATSAPP BEAUTY SPECIALIST CALLOUT (Sleek Pure Black Box)     */}
        {/* ================================================================= */}
        <div className="my-10 p-6 sm:p-10 bg-black text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
              PERSONALIZED BEAUTY CONSULTATION
            </span>
            <h4 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
              {about.ctaTitle || "Need help finding your perfect shade or routine?"}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {about.ctaSubtitle || "Our certified beauty advisory team is available on WhatsApp 7 days a week for shade matching and ingredient guidance."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCtaClick}
            className="bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-md transition-all cursor-pointer shrink-0 flex items-center gap-2 active:scale-98 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>{about.ctaButtonText || "Chat with Beauty Advisor"}</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 7. BOTTOM EXPLORE CTA LINK                                       */}
        {/* ================================================================= */}
        <div className="pt-6 text-center">
          <p className="text-xs text-neutral-500 mb-2">Ready to experience the glow?</p>
          <button
            type="button"
            onClick={() => setViewWithUrl('shop')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:underline cursor-pointer"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
