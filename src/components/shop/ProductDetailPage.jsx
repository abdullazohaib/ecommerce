import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../home/ProductCard';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MapPin, 
  Check, 
  Sparkles, 
  ArrowLeft,
  Share2,
  AlertCircle
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    selectedProduct, 
    setCurrentView, 
    storeInfo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen,
    productsList,
    addToast
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('benefits');
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  // Review form states
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [submittedReview, setSubmittedReview] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 mb-4">No product selected.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const product = selectedProduct;
  const inWishlist = isInWishlist(product.id);

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus({
        valid: true,
        message: "Delivery available! Estimated 2-4 business days. Cash On Delivery (COD) supported."
      });
    } else {
      setDeliveryStatus({
        valid: false,
        message: "Please enter a valid 6-digit Indian PIN code."
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ${storeInfo.storeName}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      setSubmittedReview(true);
      addToast('Thank you! Your verified review has been submitted for moderation.', 'success');
      setNewReview({ name: '', rating: 5, comment: '' });
    }
  };

  // Related products in same category
  const relatedProducts = productsList
    .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Main Product Two-Column Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
              <img
                src={product.images[selectedImgIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Hologram Protected
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImgIdx === idx
                        ? 'border-rose-600 scale-105 shadow-md'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Original Brand Formulation</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Direct batch dispatch with security hologram. If you receive a tampered product, we replace it with no questions asked.
              </p>
            </div>
          </div>

          {/* Right Product Overview & Purchase (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Brand & Stock */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  {product.brand}
                </span>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock} units ready)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-900">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">
                  Based on <strong>{product.reviewsCount}</strong> verified buyer reviews
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">SKU: {product.sku}</span>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-gradient-to-r from-rose-50/50 to-amber-50/50 rounded-2xl border border-rose-100 flex flex-wrap items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {storeInfo.currency.symbol}{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through">
                    {storeInfo.currency.symbol}{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  Save {storeInfo.currency.symbol}{(product.originalPrice - product.price).toLocaleString()} ({product.discountPercentage}% OFF)
                </span>
                <div className="w-full text-[11px] text-slate-500 mt-1">
                  Inclusive of all taxes • Free Shipping on orders over ₹{storeInfo.freeShippingThreshold}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Key Bullet Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Pincode Delivery Estimator */}
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>Check COD & Express Delivery to your Pincode:</span>
                </label>
                <form onSubmit={checkPincode} className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode (e.g. 400001)"
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Check
                  </button>
                </form>

                {deliveryStatus && (
                  <div className={`mt-2.5 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    deliveryStatus.valid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {deliveryStatus.valid ? (
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{deliveryStatus.message}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-4 pt-6 border-t border-slate-100 mt-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-slate-700 hover:text-black font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-slate-700 hover:text-black font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                    inWishlist
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
                  <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setIsCheckoutOpen(true);
                  }}
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Buy Now (Cash on Delivery)</span>
                </button>
              </div>

              {/* Safe Checkout Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Safe Checkout
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-rose-600" />
                  Fast Tracked Delivery
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                  7 Days Replacement
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-100 overflow-x-auto pb-4 mb-6">
            {[
              { id: 'benefits', label: 'Key Benefits' },
              { id: 'ingredients', label: 'Ingredients & Science' },
              { id: 'how-to-use', label: 'Directions & How to Use' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900">
                Transformative Results You Can Expect:
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <ul className="space-y-3 pt-2">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900">
                Active Compounds & Formulation Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We take utmost pride in disclosing our clean, bioactive ingredients:
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed">
                {product.ingredients}
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
                <strong>Certified Clean:</strong> Free from harmful parabens, heavy metals, synthetic hydroquinone, and toxic bleaches.
              </div>
            </div>
          )}

          {activeTab === 'how-to-use' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900">
                Recommended Daily Routine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.howToUse}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-rose-600 font-bold text-xs uppercase mb-1">Step 1</div>
                  <div className="text-xs font-bold text-slate-800">Cleanse</div>
                  <p className="text-[11px] text-slate-500 mt-1">Wash face with mild cleanser and lukewarm water.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-rose-600 font-bold text-xs uppercase mb-1">Step 2</div>
                  <div className="text-xs font-bold text-slate-800">Apply</div>
                  <p className="text-[11px] text-slate-500 mt-1">Gently massage in circular motions across face and neck.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <div className="text-rose-600 font-bold text-xs uppercase mb-1">Step 3</div>
                  <div className="text-xs font-bold text-slate-800">Restore</div>
                  <p className="text-[11px] text-slate-500 mt-1">Leave overnight to allow deep cellular hydration and repair.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-3xl font-black text-slate-900">{product.rating} / 5.0</div>
                  <div className="flex items-center gap-1 text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">98% of reviewers recommend this product</p>
                </div>

                <a
                  href="#write-review"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
                >
                  Write a Review
                </a>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900">Dr. Sunita Patel (Dermatologist)</span>
                    <span className="text-[10px] text-slate-400">Verified Purchase</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600">
                    "I tested this formulation in our clinic. The glutathione purity is exceptional, with no harsh bleaching agents. It maintains natural skin moisture while gently treating melasma."
                  </p>
                </div>
              </div>

              {/* Write Review Form */}
              <div id="write-review" className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Add Your Experience</h4>
                {submittedReview ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs">
                    Thank you! Your feedback has been received and will appear shortly.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="Your Full Name"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                      >
                        <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                        <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                      </select>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share details about texture, results, delivery, etc..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  You Might Also Like
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                  Frequently Bought Together
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
