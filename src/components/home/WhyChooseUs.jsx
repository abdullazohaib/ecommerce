import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, Sparkles, Award, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs = () => {
  const { storeInfo } = useStore();

  const points = [
    {
      title: "Hologram Security on Every Jar",
      desc: "We source directly from licensed importers with tamper-proof scratch hologram seals so you never receive an unauthorized replica.",
      icon: ShieldCheck,
      color: "text-rose-600 bg-rose-50 border border-rose-100"
    },
    {
      title: "Fast Air Express Dispatch",
      desc: "Orders are dispatched within 24 hours from central warehouses in Mumbai and Delhi via premium couriers like Delhivery and BlueDart.",
      icon: Truck,
      color: "text-amber-600 bg-amber-50 border border-amber-100"
    },
    {
      title: "Potent Dermatological Ingredients",
      desc: "High active levels of stabilized L-Glutathione, Alpha Arbutin, Kojic Acid, and organic saffron for real, noticeable results.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 border border-purple-100"
    },
    {
      title: "Pay On Delivery (COD) Confidence",
      desc: "Inspect your package upon arrival and pay cash or UPI directly to the delivery agent with total peace of mind.",
      icon: Award,
      color: "text-emerald-600 bg-emerald-50 border border-emerald-100"
    }
  ];

  return (
    <section className="bg-slate-50 text-slate-900 py-16 my-8 border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-black uppercase tracking-widest bg-slate-200/70 px-3 py-1 rounded-full border border-slate-300">
            The {storeInfo?.storeName || 'Classic Glow'} Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-3">
            Why 50,000+ Customers Trust Our Formulations
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            In an industry crowded with lookalikes, we guarantee 100% genuine batch certifications, uncompromised purity, and transparent customer care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-black transition-all hover:-translate-y-1 duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${pt.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {pt.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
