import React, { useState } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check, Sparkles } from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartFinalTotal, 
    discountAmount, 
    shippingFee, 
    isFreeShipping, 
    storeInfo, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    setIsCheckoutOpen,
    navigateToProduct,
    setCurrentView 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Free shipping threshold calculations
  const remainingForFreeShipping = Math.max(0, storeInfo.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / storeInfo.freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
              <span className="text-xs bg-black text-white font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter Banner */}
          <div className="bg-amber-50/70 p-4 border-b border-amber-100">
            {remainingForFreeShipping > 0 ? (
              <div>
                <p className="text-xs font-semibold text-amber-900 mb-1.5">
                  Add <span className="font-bold text-black">₹{remainingForFreeShipping}</span> more to get <span className="font-bold">FREE Express Delivery</span>!
                </p>
                <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You've unlocked FREE Express Shipping Across India!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-black flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your bag is empty</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
                  Looks like you haven't added any authentic skincare creams or serums yet.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="bg-black text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Start Shopping Now
                </button>
              </div>
            ) : (
              cart.map(item => {
                const cleanSlug = item.product.slug || slugify(item.product.name || item.product.id);
                const directUrl = `/product/${cleanSlug}`;

                return (
                  <div key={item.product.id} className="py-4 flex gap-4">
                    <a
                      href={directUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsCartOpen(false);
                        navigateToProduct(item.product);
                      }}
                      className="cursor-pointer shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-18 h-18 object-cover rounded-2xl border border-slate-100 hover:opacity-90 transition-opacity"
                      />
                    </a>
                    <div className="flex-1 min-w-0">
                      <a
                        href={directUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsCartOpen(false);
                          navigateToProduct(item.product);
                        }}
                        className="text-xs font-bold text-slate-900 hover:text-rose-600 transition-colors leading-snug line-clamp-2 block cursor-pointer"
                      >
                        {item.product.name}
                      </a>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.product.size}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:text-black font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:text-black font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          {storeInfo?.currency?.symbol || '₹'}{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        {item.product.originalPrice > item.product.price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {storeInfo?.currency?.symbol || '₹'}{(item.product.originalPrice * item.quantity).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-1 self-start"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            }))}
          </div>

          {/* Footer & Checkout if items present */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
              
              {/* Coupon code input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. GLOW20)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-mono placeholder:normal-case placeholder:font-sans focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">
                    {storeInfo?.currency?.symbol || '₹'}{cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount:</span>
                    <span>-{storeInfo?.currency?.symbol || '₹'}{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `${storeInfo?.currency?.symbol || '₹'}${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-black font-black text-base">
                    {storeInfo?.currency?.symbol || '₹'}{cartFinalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-black/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Proceed to Checkout (COD / UPI)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Guaranteed • Fast 2-4 Days Shipping</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

