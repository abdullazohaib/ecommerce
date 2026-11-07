import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Quote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerReviews = () => {
  const { reviewsList = [], reviewsHeader = {} } = useStore();

  const badge = reviewsHeader?.badge || "Verified Experiences";
  const title = reviewsHeader?.title || "Real Transformations, Real Stories";
  const subtitle = reviewsHeader?.subtitle || "Read what authentic buyers have to say about our creams, soaps, and wellness formulas.";
  const aggregateRating = reviewsHeader?.aggregateRating || "4.9";
  const reviewCountText = reviewsHeader?.reviewCountText || "Based on 2,840+ genuine buyer reviews";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="font-extrabold tracking-[0.08em] sm:tracking-[0.14em] text-neutral-900 uppercase text-lg sm:text-xl md:text-2xl font-sans">
            {title ? (title.endsWith('.') ? title.toUpperCase() : `${title.toUpperCase()}.`) : 'VERIFIED CUSTOMER REVIEWS.'}
          </h2>
        </div>

        {/* Aggregate score card */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200/80 px-4 py-2.5 rounded-2xl self-start md:self-auto">
          <div className="text-2xl font-black text-amber-600">{aggregateRating}</div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[10px] text-slate-600 font-medium">{reviewCountText}</p>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviewsList.map(item => {
          const safeStars = Math.max(1, Math.min(5, Math.floor(Number(item.rating) || 5)));
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars & Verified */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(safeStars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {item.verified !== false && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                {/* Title & Review body */}
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  "{item.title}"
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              {/* Product & User Meta */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                {item.productName && (
                  <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mb-2 truncate">
                    Purchased: {item.productName}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80";
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">{item.city} • {item.date}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
