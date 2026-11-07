import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { BrandLogo } from '../ui/BrandLogo';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Send, 
  Check,
  MessageCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

export const Footer = () => {
  const { 
    storeInfo, 
    setCurrentView, 
    setViewWithUrl,
    navigateToCategory, 
    categoriesList,
    addToast, 
    setIsTrackingModalOpen 
  } = useStore();

  const cats = (categoriesList && categoriesList.length > 0) ? categoriesList : categories;
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubscribed(true);
      if (addToast) {
        addToast('Welcome to our Beauty Circle! Use code WELCOME15 for 15% OFF.', 'success');
      }
      setEmailSub('');
    }
  };

  const supportPhone = storeInfo?.supportPhone || '7349066949';
  const whatsappNumber = storeInfo?.whatsappNumber || supportPhone;
  const cleanPhone = supportPhone.replace(/\s+/g, '');
  const cleanWa = whatsappNumber.replace(/\D/g, '');
  const supportEmail = storeInfo?.supportEmail || 'abdullazohaib.work@gmail.com';
  const businessAddress = storeInfo?.businessAddress || '402, Lotus Corporate Park, Off Western Express Highway, Goregaon (East), Mumbai - 400063, Maharashtra, India';
  const storeName = storeInfo?.storeName || 'Classic Glow';

  return (
    <footer className="w-full bg-black text-white selection:bg-rose-500 selection:text-white pt-2 pb-24 lg:pb-10 font-sans border-t border-neutral-900">
      
      {/* ================================================================= */}
      {/* 1. TOP QUALITY & TRUST ASSURANCE STRIP (Clean Modern Icons)        */}
      {/* ================================================================= */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center text-center sm:text-left">
            
            {/* Trust 1: Free Shipping */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">Free Shipping</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">On all prepaid orders over ₹999</p>
              </div>
            </div>

            {/* Trust 2: 100% Authentic */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">100% Authentic</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Batch-verified & tamper sealed</p>
              </div>
            </div>

            {/* Trust 3: Easy Returns */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white">
                <RotateCcw className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">7-Day Easy Returns</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Hassle-free replacement policy</p>
              </div>
            </div>

            {/* Trust 4: WhatsApp Support */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-white">Live WhatsApp Care</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Direct beauty expert assistance</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================================================================= */}
        {/* 2. NEWSLETTER STRIP (Clean Modern High-Fashion Sans-Serif)        */}
        {/* ================================================================= */}
        <div className="py-10 sm:py-14 border-b border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            
            <div className="max-w-xl">
              <span className="text-[10px] font-bold text-neutral-400 tracking-[0.2em] uppercase block mb-1">
                BEAUTY INSIDER ACCESS
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-white">
                LET'S STAY IN TOUCH.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
                Get ₹200 OFF your first order, plus VIP access to new shade drops, flash sales, and exclusive beauty tips.
              </p>
            </div>

            {/* Subscription Form */}
            <div className="w-full lg:max-w-md">
              {subscribed ? (
                <div className="p-3.5 bg-neutral-900 border border-emerald-500/40 rounded-lg flex items-center gap-2.5 text-xs text-emerald-400 font-semibold animate-in fade-in duration-200">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>You're on the VIP list! Use code <strong className="text-white font-mono tracking-wider">WELCOME15</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs sm:text-sm px-4 py-3 rounded-md outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md transition-all shrink-0 cursor-pointer shadow-sm active:scale-98"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}
              <p className="text-[10px] text-neutral-500 mt-2">
                By signing up, you agree to our Terms & Privacy Policy. No spam, ever.
              </p>
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. FOUR MAIN STRUCTURED FOOTER COLUMNS                             */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 py-12 sm:py-14 border-b border-neutral-800">
          
          {/* Column 1: Brand Info & Social (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-block">
              <BrandLogo size="footer" />
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed max-w-md">
              India's premier modern beauty destination for certified, high-pigment cosmetics, nourishing lip glazes, dewy foundations, and authentic advanced skincare treatments.
            </p>

            {/* Authenticity Guarantee Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine with Security Scratch Hologram Seal</span>
            </div>

            {/* Social Media Links (Clean Minimal Circular Icons) */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2.5">
                CONNECT WITH US
              </span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.593 0 9 1.582 9 4.615V8z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
                  aria-label="Twitter X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Categories (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.14em] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {cats.filter(c => c && c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/category/${cat.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToCategory(cat.id);
                    }}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 block py-0.5"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('shop');
                  }}
                  className="text-neutral-400 hover:text-white transition-colors duration-200 block py-0.5"
                >
                  All Products
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Policies (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.14em] mb-4">
              Help & Info
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hover:text-white transition-colors duration-200 cursor-pointer text-left block py-0.5"
                >
                  Track Order
                </button>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('shipping-policy');
                  }}
                  className="hover:text-white transition-colors duration-200 block py-0.5"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('refund-policy');
                  }}
                  className="hover:text-white transition-colors duration-200 block py-0.5"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('privacy-policy');
                  }}
                  className="hover:text-white transition-colors duration-200 block py-0.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('terms');
                  }}
                  className="hover:text-white transition-colors duration-200 block py-0.5"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/admin/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('admin');
                  }}
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 duration-200 text-neutral-500 pt-1 text-xs"
                >
                  <Lock className="w-3 h-3 text-neutral-500" />
                  <span>Admin Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Care (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.14em] mb-4">
              Customer Care
            </h4>

            {/* Direct Phone */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-start gap-2.5 text-xs text-neutral-400 hover:text-white transition-colors group"
            >
              <Phone className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block group-hover:underline">
                  {supportPhone}
                </span>
                <span className="text-[10px] text-neutral-500">Mon - Sat (10:00 AM - 7:00 PM)</span>
              </div>
            </a>

            {/* WhatsApp Support */}
            <a
              href={`https://wa.me/${cleanWa}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 text-xs text-neutral-400 hover:text-emerald-400 transition-colors group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-400 block group-hover:underline">
                  WhatsApp Support
                </span>
                <span className="text-[10px] text-neutral-500">Instant resolution & updates</span>
              </div>
            </a>

            {/* Support Email */}
            <a
              href={`mailto:${supportEmail}`}
              className="flex items-start gap-2.5 text-xs text-neutral-400 hover:text-white transition-colors group"
            >
              <Mail className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span className="truncate group-hover:underline">{supportEmail}</span>
            </a>

            {/* Business Address */}
            <div className="flex items-start gap-2.5 text-xs text-neutral-400 pt-1">
              <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed text-[11px] text-neutral-500">
                {businessAddress}
              </span>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* 4. BOTTOM COPYRIGHT & SECURE PAYMENTS ROW                         */}
        {/* ================================================================= */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} {storeName} Cosmetics. All rights reserved. Crafted for beauty lovers.
          </p>

          {/* Modern Minimal Payment Badges */}
          <div className="flex items-center flex-wrap justify-center gap-1.5 text-[10px] font-bold">
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300">
              UPI
            </span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300">
              VISA
            </span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300">
              MASTERCARD
            </span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300">
              RUPAY
            </span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300">
              NET BANKING
            </span>
            <span className="bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300">
              CASH ON DELIVERY
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
