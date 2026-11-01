import React from 'react';
import { ShieldCheck, Truck, Banknote, RotateCcw, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TrustBadges = () => {
  const { storeInfo } = useStore();

  const badges = [
    {
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50",
      title: "100% Authentic Products",
      desc: "Manufacturer hologram & batch verified"
    },
    {
      icon: Banknote,
      color: "text-amber-600 bg-amber-50",
      title: "Cash On Delivery Available",
      desc: "Pay securely at your doorstep"
    },
    {
      icon: Truck,
      color: "text-rose-600 bg-rose-50",
      title: `Free Shipping Above ${storeInfo.currency.symbol}${storeInfo.freeShippingThreshold}`,
      desc: "Delivered in 2-4 business days"
    },
    {
      icon: RotateCcw,
      color: "text-sky-600 bg-sky-50",
      title: "7-Day Easy Return",
      desc: "Prompt replacement if damaged"
    },
    {
      icon: MessageCircle,
      color: "text-emerald-600 bg-emerald-50",
      title: "WhatsApp Order & Care",
      desc: "Instant live order assistance"
    }
  ];

  return (
    <div className="bg-white border-y border-slate-100 py-6 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${badge.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
