import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Truck, Copy, Check, MessageCircle, MapPin } from 'lucide-react';

export const TopAnnouncementBar = () => {
  const { storeInfo, addToast, setIsTrackingModalOpen } = useStore();
  const [copied, setCopied] = useState(false);

  const copyCoupon = () => {
    navigator.clipboard.writeText(storeInfo.announcement.code);
    setCopied(true);
    addToast(`Coupon "${storeInfo.announcement.code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-rose-900/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Contact support & India dispatch */}
        <div className="hidden lg:flex items-center gap-5 text-slate-300">
          <a
            href={`tel:${storeInfo.supportPhone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <span>Call: {storeInfo.supportPhone}</span>
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={`https://wa.me/${storeInfo.whatsappNumber.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(storeInfo.storeName)}%2C%20I%20have%20an%20inquiry`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Center: Promo Offer & Coupon */}
        <div className="flex items-center justify-center gap-2 text-center font-medium">
          <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase animate-pulse">
            {storeInfo.announcement.badge}
          </span>
          <span className="text-slate-200">
            {storeInfo.announcement.text}
          </span>
          <button
            onClick={copyCoupon}
            className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 px-2 py-0.5 rounded font-mono font-bold text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
            title="Click to copy coupon code"
          >
            {storeInfo.announcement.code}
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300" />}
          </button>
        </div>

        {/* Right: Track order & COD banner */}
        <div className="flex items-center gap-4 text-slate-300">
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Order</span>
          </button>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            <span>Cash On Delivery Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
