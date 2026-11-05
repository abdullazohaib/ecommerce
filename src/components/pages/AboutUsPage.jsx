import React from 'react';
import { useStore } from '../../context/StoreContext';
import { initialAboutSection } from '../../config/storeConfig';
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Award, 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  MessageCircle,
  Building2,
  Users
} from 'lucide-react';

export const AboutUsPage = () => {
  const { storeInfo, aboutSection: storeAbout, setViewWithUrl } = useStore();
  const about = storeAbout || initialAboutSection;

  const pillarIcons = [ShieldCheck, Truck, Award, Sparkles];

  const handleCtaClick = () => {
    const rawNumber = (storeInfo.whatsappNumber || '').replace(/[^\d]/g, '');
    if (rawNumber) {
      const msg = encodeURIComponent(`Hi ${storeInfo.storeName}, I am visiting your About Us page and would like guidance on choosing the right skincare formula.`);
      window.open(`https://wa.me/${rawNumber}?text=${msg}`, '_blank');
    } else {
      setViewWithUrl('contact');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('home');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </a>

        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-sm space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 pb-8 border-b border-slate-100">
            <span className="text-xs font-bold text-[#5B4DF5] uppercase tracking-widest bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              {about.badge || "Our Heritage & Mission"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
              {about.title || `Welcome to ${storeInfo.storeName}`}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {about.subtitle || "India's leading destination for authenticated skin whitening treatments, pure glutathione serums, and herbal formulations."}
            </p>

            {/* Quick Stat Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {about.establishedYear && (
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#5B4DF5]" />
                  <span>{about.establishedYear}</span>
                </span>
              )}
              {about.statNumber && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{about.statNumber} {about.statLabel || "Happy Customers"}</span>
                </span>
              )}
            </div>
          </div>

          {/* Story Section (With Optional Brand/Story Image) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {about.storyImage && (
              <div className="md:col-span-5 order-2 md:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                  <img
                    src={about.storyImage}
                    alt={storeInfo.storeName}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white space-y-0.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300">
                        Tamper-Proof Hologram Standard
                      </span>
                      <p className="text-xs font-bold">100% Genuine Certified Formulation</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`${about.storyImage ? 'md:col-span-7' : 'md:col-span-12'} space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed order-1 md:order-2`}>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{about.storyTitle || "Who We Are"}</span>
              </h2>
              <p>
                {about.storyParagraph1 || `Founded with the vision to bring genuine, dermatologist-endorsed cosmetic solutions to Indian households, ${storeInfo.storeName} bridges the gap between traditional herbal wisdom and modern skincare science.`}
              </p>
              <p>
                {about.storyParagraph2 || `In an industry where duplicate and unauthorized replicas are rampant, we stand as a fortress of purity. Every jar and serum sold carries our tamper-proof security hologram seal and verifiable batch certification.`}
              </p>
            </div>
          </div>

          {/* Core Trust Pillars */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 text-center">
              Our Core Promises & Standards
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(about.pillars || []).map((pillar, idx) => {
                const IconComponent = pillarIcons[idx % pillarIcons.length] || ShieldCheck;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-2 hover:border-[#5B4DF5]/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#5B4DF5] flex items-center justify-center mx-auto shadow-2xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {pillar.badge && (
                      <span className="text-[10px] font-bold text-[#5B4DF5] bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                        {pillar.badge}
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{pillar.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skincare Specialist CTA Box */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/20">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{about.ctaTitle || "Have questions about our formulations?"}</span>
              </h4>
              <p className="text-xs text-slate-300">
                {about.ctaSubtitle || "Our skincare advisory team is available on WhatsApp 7 days a week."}
              </p>
            </div>

            <button
              onClick={handleCtaClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-md shadow-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{about.ctaButtonText || "Chat with Skincare Specialist"}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
