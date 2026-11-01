import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  MapPin, 
  ArrowRight, 
  Printer, 
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartFinalTotal, 
    cartSubtotal, 
    discountAmount, 
    shippingFee, 
    isFreeShipping, 
    storeInfo, 
    placeOrder,
    addToast
  } = useStore();

  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      addToast('Please fill all required delivery details', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder(formData, paymentMethod);
      setCompletedOrder(order);
      setStep('success');
      setIsSubmitting(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully
      }
    }, 800);
  };

  const copyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
      addToast('Order ID copied!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {step === 'form' ? 'Secure Checkout & Delivery' : 'Order Confirmed! 🎉'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {step === 'form' ? 'Fast dispatch with tracking across India' : `Order ID: ${completedOrder?.orderId}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStep('form');
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: FORM & PAYMENT */}
        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Delivery Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>1. Shipping & Contact Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="For tracking receipt (e.g. name@gmail.com)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Flat / House No. / Building / Street Address *</label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat number, Building name, Street"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Near temple, metro station, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 400053"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>2. Select Payment Method</span>
              </h3>

              <div className="space-y-2.5">
                {/* Cash On Delivery Option */}
                <label className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'Cash on Delivery (COD)'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery (COD)"
                    checked={paymentMethod === 'Cash on Delivery (COD)'}
                    onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                    className="accent-emerald-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Cash On Delivery (COD)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay safely at your doorstep with Cash or UPI scanner when courier arrives.
                    </p>
                  </div>
                </label>

                {/* Instant UPI / QR Code */}
                <label className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'Instant UPI / QR'
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Instant UPI / QR"
                    checked={paymentMethod === 'Instant UPI / QR'}
                    onChange={() => setPaymentMethod('Instant UPI / QR')}
                    className="accent-rose-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Instant UPI (Google Pay, PhonePe, Paytm)
                      </span>
                      <QrCode className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fast 0% transaction fee via any UPI app.
                    </p>
                  </div>
                </label>

                {/* Card / Netbanking */}
                <label className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'Cards / Net Banking'
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Cards / Net Banking"
                    checked={paymentMethod === 'Cards / Net Banking'}
                    onChange={() => setPaymentMethod('Cards / Net Banking')}
                    className="accent-rose-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Credit / Debit Card & Netbanking
                      </span>
                      <CreditCard className="w-4 h-4 text-slate-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Visa, Mastercard, RuPay & all major Indian banks.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.length} items):</span>
                <span>{storeInfo.currency.symbol}{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied:</span>
                  <span>-{storeInfo.currency.symbol}{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>{isFreeShipping ? 'FREE' : `${storeInfo.currency.symbol}${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Due:</span>
                <span className="text-rose-600 font-black">
                  {storeInfo.currency.symbol}{cartFinalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm py-4 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • {storeInfo.currency.symbol}{cartFinalTotal.toLocaleString()} ({paymentMethod.includes('COD') ? 'Cash on Delivery' : 'Pay Now'})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: ORDER SUCCESS RECEIPT */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-black text-slate-900">
                Thank You for Your Order!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Your order has been received and allocated to our warehouse. We have also sent a confirmation message to <strong>{completedOrder.customer.phone}</strong>.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">ORDER ID</span>
                  <div className="flex items-center gap-2 font-mono font-bold text-sm text-slate-900">
                    <span>{completedOrder.orderId}</span>
                    <button onClick={copyOrderId} className="text-slate-400 hover:text-slate-700">
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">TOTAL PAYABLE</span>
                  <span className="font-black text-sm text-rose-600">
                    {storeInfo.currency.symbol}{completedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">DELIVERY TO:</span>
                  <span className="font-semibold text-slate-800">{completedOrder.customer.fullName}</span>
                  <p className="text-[11px] text-slate-500">{completedOrder.customer.address}, {completedOrder.customer.city} ({completedOrder.customer.pincode})</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PAYMENT TYPE:</span>
                  <span className="font-semibold text-slate-800">{completedOrder.paymentMethod}</span>
                  <p className="text-[11px] text-emerald-600 font-medium">Estimated 2-4 Business Days</p>
                </div>
              </div>

              {/* Items in order */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-slate-400 block text-[10px] mb-1.5">ITEMS ORDERED:</span>
                <div className="space-y-1.5">
                  {completedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between text-slate-700 text-[11px]">
                      <span className="truncate max-w-xs">{item.name} × {item.quantity}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp confirmation button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${storeInfo.whatsappNumber.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(storeInfo.storeName)}%2C%20I%20placed%20Order%20${completedOrder.orderId}%20for%20Rs.%20${completedOrder.total}.%20Please%20confirm%20dispatch.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Updates on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3.5 rounded-2xl transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
