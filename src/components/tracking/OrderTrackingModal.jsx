import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const OrderTrackingModal = () => {
  const { 
    isTrackingModalOpen, 
    setIsTrackingModalOpen, 
    orders, 
    searchOrder, 
    storeInfo,
    activeTrackingQuery,
    setActiveTrackingQuery 
  } = useStore();

  const [query, setQuery] = useState(activeTrackingQuery || 'AG-88412');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState(() => searchOrder(query || 'AG-88412'));

  if (!isTrackingModalOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const order = searchOrder(query);
      setFoundOrder(order);
      setSearched(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Track Your Consignment</h2>
              <p className="text-[11px] text-slate-500">Live courier tracking across 25,000+ Indian PIN codes</p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. AG-88412) or Mobile Number"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {/* Quick test suggestion */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Quick test:</span>
            <button
              onClick={() => {
                setQuery('AG-88412');
                setFoundOrder(searchOrder('AG-88412'));
                setSearched(true);
              }}
              className="font-mono text-rose-600 underline font-semibold cursor-pointer"
            >
              AG-88412
            </button>
            <span>or your recent order ID</span>
          </div>
        </div>

        {/* Results Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {foundOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Banner */}
              <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-5 rounded-2xl border border-rose-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                    CURRENT SHIPMENT STATUS
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-lg font-black text-slate-900">{foundOrder.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Courier: <strong>{foundOrder.courier}</strong> • AWB: <span className="font-mono">{foundOrder.trackingNumber}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Est. Delivery</span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                    {foundOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Shipment Milestone Timeline
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {foundOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start justify-between gap-4">
                      {/* Timeline dot */}
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                        step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      <div>
                        <h5 className={`text-xs font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.time}</p>
                      </div>

                      {step.completed && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Done
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient & Items */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Delivery Address</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{foundOrder.customer.fullName}</p>
                  <p className="text-slate-500 text-[11px]">{foundOrder.customer.address}, {foundOrder.customer.city} ({foundOrder.customer.pincode})</p>
                  <p className="text-slate-500 text-[11px]">Phone: {foundOrder.customer.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Items in Package</span>
                  <div className="space-y-1 mt-0.5">
                    {foundOrder.items.map(item => (
                      <div key={item.id} className="text-[11px] text-slate-700 truncate">
                        • {item.name} (x{item.quantity})
                      </div>
                    ))}
                  </div>
                  <p className="text-rose-600 font-bold text-xs mt-2">
                    Total: ₹{foundOrder.total.toLocaleString()} ({foundOrder.paymentMethod})
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No matching order found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Please double check your Order ID (starts with AG-) or the 10-digit mobile number used during checkout.
              </p>
            </div>
          )}

          {/* Need help footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Any issues with your delivery?</span>
            <a
              href={`https://wa.me/${storeInfo.whatsappNumber.replace(/\D/g, '')}?text=Hi%2C%20need%20help%20tracking%20my%20order`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Courier Help</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
