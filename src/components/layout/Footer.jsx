import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Send, 
  CheckCircle,
  MessageCircle
} from 'lucide-react';

export const Footer = () => {
  const { storeInfo, setCurrentView, setSelectedCategory, addToast, setIsTrackingModalOpen } = useStore();
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubscribed(true);
      addToast('Thank you for subscribing! Your 15% welcome code is WELCOME15', 'success');
      setEmailSub('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Benefits banner */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 rounded-3xl p-6 sm:p-10 mb-16 border border-rose-900/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Join our Beauty Circle
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3 leading-snug">
                Get ₹200 OFF on your first herbal skincare order
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Subscribe for private flash sales, authenticity guides, and dermatologist-recommended routines.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero spam. Unsubscribe anytime.</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif font-black text-2xl tracking-tight text-white">
                {storeInfo.storeName}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier online destination for certified herbal skin whitening treatments, glutathione night creams, organic face serums, and holistic wellness supplements.
            </p>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Genuine Hologram Guarantee</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Every product comes with tamper-evident serials and manufacturer authenticity verification.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-rose-400 transition-colors text-slate-400 hover:translate-x-1 inline-block duration-200"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Help & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hover:text-rose-400 transition-colors hover:translate-x-1 inline-block duration-200"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('shipping-policy')}
                  className="hover:text-rose-400 transition-colors hover:translate-x-1 inline-block duration-200"
                >
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('refund-policy')}
                  className="hover:text-rose-400 transition-colors hover:translate-x-1 inline-block duration-200"
                >
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('privacy-policy')}
                  className="hover:text-rose-400 transition-colors hover:translate-x-1 inline-block duration-200"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('terms')}
                  className="hover:text-rose-400 transition-colors hover:translate-x-1 inline-block duration-200"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Contact Care
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <a
                href={`tel:${storeInfo.supportPhone.replace(/\s+/g, '')}`}
                className="flex items-start gap-2.5 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white group-hover:text-rose-400">{storeInfo.supportPhone}</div>
                  <div className="text-[10px] text-slate-500">Toll Free / Direct line</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${storeInfo.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-400">WhatsApp Live Chat</div>
                  <div className="text-[10px] text-slate-500">Fast replies under 5 mins</div>
                </div>
              </a>

              <a
                href={`mailto:${storeInfo.supportEmail}`}
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="truncate">{storeInfo.supportEmail}</span>
              </a>

              <div className="flex items-start gap-2.5 text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-[11px]">{storeInfo.businessAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {storeInfo.storeName}. All rights reserved. Registered in India.
          </p>
          
          <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold">
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">
              💵 Cash on Delivery
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">
              ⚡ UPI / QR Code
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">
              💳 Visa & Mastercard
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">
              🇮🇳 RuPay
            </span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">
              🏦 Net Banking
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
