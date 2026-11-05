import React, { useState, useMemo } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
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
  AlertCircle,
  Clock,
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    selectedProduct, 
    setCurrentView, 
    setViewWithUrl,
    navigateToCategory,
    navigateToProduct,
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

  // Modals for the feature buttons matching screenshot
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  // Review form states
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [submittedReview, setSubmittedReview] = useState(false);

  // Calculated delivery window (e.g. "Nov 7 - Nov 10")
  const deliveryDates = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    const end = new Date();
    end.setDate(end.getDate() + 5);

    const startMonth = start.toLocaleString('en-US', { month: 'short' });
    const endMonth = end.toLocaleString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  }, []);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">No product selected.</p>
        <a
          href="/shop"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('shop');
          }}
          className="inline-block bg-[#8B2332] hover:bg-[#6f1b27] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Return to Shop
        </a>
      </div>
    );
  }

  const product = selectedProduct;
  const inWishlist = isInWishlist(product.id);

  // Ensure at least 4-5 images for the vertical strip
  const galleryImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length >= 4) {
      return product.images;
    }
    const fallbackList = [
      product.images[0] || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512290900672-1f55a1532402?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
    ];
    return Array.from(new Set([...(product.images || []), ...fallbackList])).slice(0, 5);
  }, [product.images]);

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryStatus({
        valid: true,
        message: `Delivery available to PIN ${pincode}! Estimated ${deliveryDates}. Free COD supported.`
      });
    } else {
      setDeliveryStatus({
        valid: false,
        message: "Please enter a valid 6-digit Indian PIN code."
      });
    }
  };

  const handleShare = () => {
    const cleanSlug = product.slug || slugify(product.name || product.id);
    const fullProductUrl = `${window.location.origin}/product/${cleanSlug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullProductUrl);
      addToast('Product URL copied to clipboard! (Ready to share with customers)', 'success');
    } else {
      addToast(`Product URL: ${fullProductUrl}`, 'info');
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
    <div className="bg-white min-h-screen pb-16">
      
      {/* Compact Breadcrumb Bar - flush to top without extra gaps */}
      <div className="border-b border-slate-100 py-2.5 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              setViewWithUrl('shop');
            }}
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-[#8B2332] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </a>

          <div className="text-slate-400 hidden sm:flex items-center gap-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="hover:text-[#8B2332] transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <a
              href={`/category/${product.category}`}
              onClick={(e) => {
                e.preventDefault();
                navigateToCategory(product.category);
              }}
              className="hover:text-[#8B2332] capitalize transition-colors"
            >
              {product.category.replace('-', ' ')}
            </a>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-medium"
            title="Share clean product URL"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Product Container - tight vertical rhythm without awkward white gaps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 1. LEFT GALLERY: Vertical thumbnail column + Main image placed right next to it with no gaps */}
          <div className="lg:col-span-6 flex gap-2.5 sm:gap-3.5 items-start">
            
            {/* Vertical Thumbnails Stack (5 thumbnails stacked on far left matching screenshot) */}
            <div className="w-16 sm:w-20 lg:w-22 flex flex-col gap-2 shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  onMouseEnter={() => setSelectedImgIdx(idx)}
                  className={`relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-50 ${
                    selectedImgIdx === idx
                      ? 'border-black ring-2 ring-black/20 shadow-sm scale-[1.02]'
                      : 'border-slate-200/90 hover:border-slate-400 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`Select product image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Main Featured Image Container placed directly beside thumbnails */}
            <div className="flex-1 relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm group">
              <img
                src={galleryImages[selectedImgIdx] || galleryImages[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
              />

              {/* Top-left image headline overlay matching screenshot */}
              <div className="absolute top-4 left-4 max-w-[220px] text-white font-serif font-black text-xs sm:text-sm tracking-wide leading-tight drop-shadow-md bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                {product.overlayText || "YOUTHFUL RADIANCE IN EVERY DROP"}
              </div>

              {/* Hologram security badge overlay */}
              <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Genuine Hologram Sealed</span>
              </span>
            </div>

          </div>

          {/* 2. RIGHT OVERVIEW: Replicating screenshot typography, badges, and button placement */}
          <div className="lg:col-span-6 space-y-3.5">
            
            {/* Red pill badge (e.g. 'Save 15%' / 'Save 30%') */}
            <div>
              <span className="inline-block bg-[#8B2332] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Save {product.discountPercentage || 25}%
              </span>
            </div>

            {/* Product Title matching screenshot */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Subtitle matching screenshot */}
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Star Rating Row */}
            <div className="flex items-center gap-2 pt-0.5 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-slate-700">
                {product.rating} out of 5 ({product.reviewsCount} reviews)
              </span>
            </div>

            {/* Green Delivery Guarantee Box - Exact match to screenshot */}
            <div className="bg-[#eef8f2] border border-[#cbe8d6] rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#1e5d38] font-medium shadow-2xs">
              <div className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div className="leading-snug">
                Order within the next <strong className="font-bold text-[#144729]">4 Hrs 43 Mins</strong> for delivery between 🔥 <strong className="font-bold text-[#144729]">{deliveryDates}</strong> 🔥
              </div>
            </div>

            {/* Type specification */}
            <div className="text-xs text-slate-600 font-medium">
              Type: <span className="font-bold text-slate-900">{product.subCategory || 'Skin Care'}</span>
            </div>

            {/* Feature Action Pills - Exact match to screenshot */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => setShowWhyModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/40 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Why Does This Product Work?</span>
              </button>

              <button
                onClick={() => setShowTimelineModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-600/40 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>How Long Before Results?</span>
              </button>
            </div>

            {/* Checkmark bullet points - Exact match to screenshot */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Powered by {product.keyActives || 'Bioactive L-Glutathione & Natural Plant Peptides'}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Brightens the skin</span>
                </span>
                <span className="flex items-center gap-1.5 ml-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Supports deep skin hydration</span>
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {storeInfo?.currency?.symbol || '₹'}{Number(product.price || 0).toLocaleString()}
              </span>
              {Number(product.originalPrice || 0) > Number(product.price || 0) && (
                <span className="text-base text-slate-400 line-through">
                  {storeInfo?.currency?.symbol || '₹'}{Number(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Save {storeInfo?.currency?.symbol || '₹'}{(Number(product.originalPrice || product.price) - Number(product.price)).toLocaleString()} ({product.discountPercentage || 0}% OFF)
              </span>
              <div className="w-full text-[11px] text-slate-500">
                Inclusive of all taxes • Free Shipping on orders over ₹{storeInfo?.freeShippingThreshold || 999}
              </div>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8B2332]" />
                <span>Check COD & Express Delivery to your Pincode:</span>
              </label>
              <form onSubmit={checkPincode} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 400001)"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#8B2332] outline-none"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Check
                </button>
              </form>

              {deliveryStatus && (
                <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
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

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
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
                      ? 'border-black bg-black text-white'
                      : 'border-slate-200 text-slate-700 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white text-white' : ''}`} />
                  <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Primary Dual CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex items-center justify-center gap-2.5 bg-white border-2 border-black text-black hover:bg-slate-50 font-black text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setIsCheckoutOpen(true);
                  }}
                  className="flex items-center justify-center gap-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-lg shadow-black/20 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Buy Now (Cash on Delivery)</span>
                </button>
              </div>

              {/* Guarantees row */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Genuine Seal
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#8B2332]" />
                  Fast Tracked Shipping
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                  7-Day Replacement
                </span>
              </div>

              {/* Clean Customer Shareable Product URL Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Direct Customer Product URL (No Gaps):
                  </span>
                  <span className="font-mono text-xs text-[#8B2332] font-bold truncate block">
                    {typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug || slugify(product.name)}` : `/product/${product.slug || slugify(product.name)}`}
                  </span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-black border border-slate-200 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#8B2332]" />
                  <span>Copy Product Link</span>
                </button>
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
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Why Customers Love This Formulation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Active Botanical & Dermatological Ingredients</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {product.ingredients}
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Authenticity Guarantee:</strong> Each ingredient is batch-tested for zero mercury, zero lead, and 100% compliant safety standards in India.
              </div>
            </div>
          )}

          {activeTab === 'how-to-use' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recommended Daily Routine</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {product.howToUse}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-2xl font-serif font-black text-slate-900">{product.rating} / 5.0</div>
                  <div className="flex items-center text-amber-500 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Based on {product.reviewsCount} verified purchases</p>
                </div>
              </div>

              {/* Submit a review */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leave a Verified Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#8B2332]"
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#8B2332]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B2332]">Pairs Well With</span>
                <h2 className="text-2xl font-serif font-black text-slate-900">Recommended Formulations</h2>
              </div>
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  setViewWithUrl('shop');
                }}
                className="text-xs font-bold text-[#8B2332] hover:underline"
              >
                View Catalog
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* POPUP MODAL 1: "Why Does This Product Work?" (Matching screenshot feature pill) */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowWhyModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-black text-slate-900">
              Why Does {product.name} Work?
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Cellular Melanin Modulation:</strong> Contains active <strong>{product.keyActives || 'L-Glutathione + Kojic Acid'}</strong> that inhibits tyrosinase enzymes responsible for dark spot formation and uneven skin pigmentation.
              </p>
              <p>
                <strong>Overnight Lipid Barrier Lock:</strong> Penetrates deep into the dermal matrix during sleep when cell regeneration peaks, supplying intensive moisture without clogging pores.
              </p>
              <p>
                <strong>100% Genuine Formula:</strong> Every batch is manufactured under strict cGMP protocols and carries a tamper-evident holographic seal.
              </p>
            </div>
            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: "How Long Before Results?" (Matching screenshot feature pill) */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowTimelineModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-black text-slate-900">
              Expected Results Timeline
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">Days 1 - 3: Intense Hydration</strong>
                <span>Skin texture becomes visibly softer, plump, and morning oiliness is regulated.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">Days 7 - 10: Visible Radiance</strong>
                <span>Sun tan begins fading, dullness lifts, and an illuminated glow appears on face and neck.</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                <strong className="text-emerald-900 block mb-0.5">Days 14 - 21: Deep Spot Correction</strong>
                <span>Stubborn pigmentation, acne scars, and dark patches significantly diminish.</span>
              </div>
            </div>
            <button
              onClick={() => setShowTimelineModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
