import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  XCircle,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export const OrderTrackingModal = () => {
  const { 
    isTrackingModalOpen, 
    setIsTrackingModalOpen, 
    trackingModalMode,
    setTrackingModalMode,
    orders, 
    searchOrder, 
    cancelOrder,
    processOrderReturn,
    storeInfo,
    activeTrackingQuery,
    setActiveTrackingQuery 
  } = useStore();

  const [query, setQuery] = useState(activeTrackingQuery || 'AG-88412');
  const [searched, setSearched] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found better price elsewhere');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Keep query synced if set externally
  useEffect(() => {
    if (activeTrackingQuery) {
      setQuery(activeTrackingQuery);
    }
  }, [activeTrackingQuery]);

  const foundOrder = searchOrder(query);

  if (!isTrackingModalOpen) return null;

  const currentMode = trackingModalMode || 'track';

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  const handleExecuteCancel = () => {
    if (foundOrder) {
      cancelOrder(foundOrder.orderId, cancelReason);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Header with Mode Switcher */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              currentMode === 'cancel' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
            }`}>
              {currentMode === 'cancel' ? <XCircle className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentMode === 'cancel' ? 'Cancel / Return Order' : 'Track Your Consignment'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {currentMode === 'cancel' 
                  ? 'Request instant order cancellation before dispatch or return an item' 
                  : 'Live courier tracking across 25,000+ Indian PIN codes'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-100 bg-white text-xs font-bold">
          <button
            type="button"
            onClick={() => setTrackingModalMode('track')}
            className={`flex items-center gap-2 py-2.5 px-4 border-b-2 transition-all cursor-pointer ${
              currentMode === 'track' 
                ? 'border-black text-black font-extrabold' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Track Order</span>
          </button>

          <button
            type="button"
            onClick={() => setTrackingModalMode('cancel')}
            className={`flex items-center gap-2 py-2.5 px-4 border-b-2 transition-all cursor-pointer ${
              currentMode === 'cancel' 
                ? 'border-rose-600 text-rose-600 font-extrabold' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel / Return</span>
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
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-black outline-none"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick test suggestion */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Quick test:</span>
            <button
              onClick={() => {
                setQuery('AG-88412');
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
              <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
                foundOrder.status === 'Cancelled'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-100'
              }`}>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    foundOrder.status === 'Cancelled' ? 'text-rose-600' : 'text-slate-500'
                  }`}>
                    ORDER #{foundOrder.orderId} • {foundOrder.status === 'Cancelled' ? 'CANCELLED' : 'STATUS'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      foundOrder.status === 'Cancelled' ? 'bg-rose-500' : 'bg-emerald-500 animate-ping'
                    }`}></span>
                    <span className="text-lg font-black text-slate-900">{foundOrder.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Courier: <strong>{foundOrder.courier}</strong> • AWB: <span className="font-mono">{foundOrder.trackingNumber}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Est. Delivery</span>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg inline-block mt-0.5 ${
                    foundOrder.status === 'Cancelled' 
                      ? 'text-rose-700 bg-rose-100' 
                      : 'text-emerald-700 bg-emerald-100'
                  }`}>
                    {foundOrder.status === 'Cancelled' ? 'Order Cancelled' : foundOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* CANCEL ORDER ACTION SECTION (When Cancel Mode is Active) */}
              {currentMode === 'cancel' && (
                <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cancellation & Return Policy</span>
                  </div>

                  {foundOrder.status === 'Cancelled' ? (
                    <div className="bg-white p-3 rounded-xl border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>This order has already been cancelled. If payment was made online, refund will credit in 2-3 business days.</span>
                    </div>
                  ) : ['Delivered'].includes(foundOrder.status) ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        This order has been delivered. You can initiate a 7-day hassle-free return or replacement.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          processOrderReturn(foundOrder.orderId, 'Customer return request');
                        }}
                        className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Return / Replacement</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Your order is currently <strong>{foundOrder.status}</strong>. You can cancel it immediately before dispatch.
                      </p>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Reason for cancellation:</label>
                        <select
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                        >
                          <option>Found better price elsewhere</option>
                          <option>Ordered by mistake / duplicate order</option>
                          <option>Delivery time is too long</option>
                          <option>Need to change delivery address or phone number</option>
                          <option>Other / personal reason</option>
                        </select>
                      </div>

                      {showCancelConfirm ? (
                        <div className="p-3 bg-white border border-rose-300 rounded-xl space-y-2">
                          <p className="text-xs font-bold text-rose-700">Are you sure you want to cancel Order #{foundOrder.orderId}?</p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleExecuteCancel}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Yes, Confirm Cancellation
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCancelConfirm(false)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Keep Order
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCancelConfirm(true)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order Now</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Progress Timeline (When in Track Mode) */}
              {currentMode === 'track' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Shipment Milestone Timeline
                  </h4>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(foundOrder.timeline || []).map((step, idx) => (
                      <div key={idx} className="relative flex items-start justify-between gap-4">
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
              )}

              {/* Recipient & Items */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Delivery Address</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{foundOrder.customer?.fullName}</p>
                  <p className="text-slate-500 text-[11px]">{foundOrder.customer?.address}, {foundOrder.customer?.city} ({foundOrder.customer?.pincode})</p>
                  <p className="text-slate-500 text-[11px]">Phone: {foundOrder.customer?.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Items in Package</span>
                  <div className="space-y-1 mt-0.5">
                    {(foundOrder.items || []).map(item => (
                      <div key={item.id} className="text-[11px] text-slate-700 truncate">
                        • {item.name} (x{item.quantity})
                      </div>
                    ))}
                  </div>
                  <p className="text-rose-600 font-bold text-xs mt-2">
                    Total: ₹{foundOrder.total?.toLocaleString()} ({foundOrder.paymentMethod})
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
            <span>Any issues with your delivery or order?</span>
            <a
              href={`https://wa.me/${(storeInfo?.whatsappNumber || '919820045678').replace(/\D/g, '')}?text=Hi%2C%20need%20help%20with%20my%20order`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact WhatsApp Support</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackingModal;

