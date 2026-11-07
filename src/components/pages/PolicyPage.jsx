import React from 'react';
import { useStore } from '../../context/StoreContext';
import { initialPolicies } from '../../config/storeConfig';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  MessageCircle, 
  Mail, 
  Phone, 
  Lock, 
  Scale, 
  Sparkles 
} from 'lucide-react';

export const PolicyPage = ({ type = 'shipping-policy' }) => {
  const { storeInfo, setViewWithUrl, policies } = useStore();

  const currentPolicies = policies || initialPolicies;
  const shipping = currentPolicies.shippingPolicy || initialPolicies.shippingPolicy;
  const returns = currentPolicies.returnPolicy || initialPolicies.returnPolicy;
  const privacy = currentPolicies.privacyPolicy || initialPolicies.privacyPolicy;
  const terms = currentPolicies.termsPolicy || initialPolicies.termsPolicy;

  // Policy Tabs definition for easy navigation between legal/policy documents
  const policyTabs = [
    { id: 'shipping-policy', label: 'Shipping & Delivery', icon: Truck },
    { id: 'refund-policy', label: 'Returns & Replacement', icon: RotateCcw },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText }
  ];

  const cleanStoreName = storeInfo?.storeName || 'Classic Glow';
  const cleanPhone = storeInfo?.whatsappNumber || storeInfo?.supportPhone || '+91 98200 45678';
  const cleanEmail = storeInfo?.supportEmail || 'care@glowbasket.in';
  const freeThreshold = shipping.freeShippingThreshold || storeInfo?.freeShippingThreshold || 999;
  const standardFee = shipping.standardShippingFee || storeInfo?.standardShippingFee || 79;
  const returnDays = returns.returnWindowDays || 7;

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setViewWithUrl('home');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </a>

          <span className="text-[11px] font-semibold text-slate-400">
            {cleanStoreName} Official Store Policy
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap gap-1.5 mb-8">
          {policyTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = type === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewWithUrl(tab.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-slate-600 hover:text-black hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Document Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-8">
          
          {/* =============================================================== */}
          {/* VIEW A: SHIPPING & DELIVERY POLICY                               */}
          {/* =============================================================== */}
          {type === 'shipping-policy' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 block mb-0.5">
                      DELIVERY FULFILLMENT
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
                      {shipping.title || 'Shipping & Delivery Policy'}
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Last Updated: {shipping.lastUpdated || 'November 2026'} • Official Policy of {cleanStoreName}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Free Shipping</span>
                  <span className="text-xs font-black text-black">On Orders ₹{freeThreshold}+</span>
                </div>
              </div>

              {/* Quick Trust Highlights Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <Clock className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dispatch</span>
                  <span className="text-xs font-bold text-slate-800">24-48 Hours</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <Truck className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery</span>
                  <span className="text-xs font-bold text-slate-800">2-5 Business Days</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <PackageCheck className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Packaging</span>
                  <span className="text-xs font-bold text-slate-800">Tamper-Proof</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <CheckCircle2 className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Tracking</span>
                  <span className="text-xs font-bold text-slate-800">SMS & WhatsApp</span>
                </div>
              </div>

              {/* Introductory Paragraph */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {shipping.introText || `At ${cleanStoreName}, we strive to deliver your orders in the quickest and safest possible manner across India with tamper-proof security packaging.`}
              </div>

              {/* Policy Sections */}
              <div className="space-y-6 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                
                {/* 1. Dispatch Timeline */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>Order Processing & Dispatch Timeline</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p className="font-semibold text-slate-800">
                      {shipping.dispatchTimeline || 'Orders are processed and dispatched within 24 to 48 hours of order confirmation.'}
                    </p>
                    <p className="text-slate-500">
                      {shipping.dispatchDetails || 'All orders placed before 3:00 PM are handed over to our express logistics partners on the same or next business day. You will receive an SMS and WhatsApp tracking notification with live tracking airway bills as soon as your package leaves our fulfillment warehouse.'}
                    </p>
                  </div>
                </div>

                {/* 2. Delivery Durations */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
                    <span>Estimated Delivery Duration Across India</span>
                  </h3>
                  <div className="pl-8 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Metro Cities</span>
                        <p className="font-bold text-slate-800">{shipping.deliveryMetro || '2 to 3 business days'}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Tier 2 & 3 Cities</span>
                        <p className="font-bold text-slate-800">{shipping.deliveryNonMetro || '3 to 5 business days'}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">State capitals, district headquarters, and regional towns</span>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Remote & Northeast</span>
                        <p className="font-bold text-slate-800">{shipping.deliveryRemote || '5 to 7 business days'}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">Special regional routes and hilly areas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Shipping Charges & Free Delivery */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
                    <span>Shipping Charges & Free Delivery Threshold</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      We offer <strong>FREE Express Shipping</strong> on all prepaid and Cash On Delivery (COD) orders exceeding <strong>₹{freeThreshold}</strong>.
                    </p>
                    <p className="text-slate-500">
                      For orders below ₹{freeThreshold}, a nominal standard delivery charge of <strong>₹{standardFee}</strong> is applied at checkout to cover express courier costs.
                    </p>
                  </div>
                </div>

                {/* 4. Courier Partners */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
                    <span>Trusted Courier & Logistics Partners</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      We partner exclusively with India’s leading tier-1 surface and air cargo couriers:
                    </p>
                    <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 inline-block">
                      {shipping.courierPartners || 'Delhivery, BlueDart, XpressBees, DTDC Express'}
                    </p>
                  </div>
                </div>

                {/* 5. Cash On Delivery (COD) Verification */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
                    <span>Cash On Delivery (COD) Address Verification</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {shipping.codVerificationNote || 'To prevent false delivery attempts, our automated system or support executive may verify your delivery address via WhatsApp or a short phone call before releasing the consignment for dispatch.'}
                    </p>
                  </div>
                </div>

                {/* 6. Packaging & Hologram Protection */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
                    <span>Tamper-Evident Security Packaging</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {shipping.packagingNote || 'All shipments are packed in tamper-proof bubble security packaging with genuine batch holograms to ensure untampered product purity.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW B: RETURN & REPLACEMENT POLICY                             */}
          {/* =============================================================== */}
          {type === 'refund-policy' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 block mb-0.5">
                      HASSLE-FREE GUARANTEE
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
                      {returns.title || 'Return & Replacement Policy'}
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Last Updated: {returns.lastUpdated || 'November 2026'} • Official Policy of {cleanStoreName}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Replacement Window</span>
                  <span className="text-xs font-black text-black">{returnDays} Days Easy Returns</span>
                </div>
              </div>

              {/* Quick Trust Highlights Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <Clock className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Window</span>
                  <span className="text-xs font-bold text-slate-800">{returnDays} Days Window</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <Truck className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Doorstep Pickup</span>
                  <span className="text-xs font-bold text-slate-800">100% Free Pickup</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <PackageCheck className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Refund Time</span>
                  <span className="text-xs font-bold text-slate-800">3-5 Business Days</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <CheckCircle2 className="w-4 h-4 mx-auto text-black mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Hygiene Safe</span>
                  <span className="text-xs font-bold text-slate-800">Batch Sealed</span>
                </div>
              </div>

              {/* Introductory Paragraph */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {returns.introText || `We take extreme care in packaging your cosmetic, skincare, and beauty formulations. In the unlikely event that you receive a damaged, leaked, expired, or incorrect item:`}
              </div>

              {/* Policy Sections */}
              <div className="space-y-6 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                
                {/* 1. Return Window */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>{returnDays}-Day Replacement Window</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p className="font-semibold text-slate-800">
                      {returns.windowNote || `Please notify our customer care team on WhatsApp or email within ${returnDays} days of receiving your package.`}
                    </p>
                    <p className="text-slate-500">
                      Reach our support desk at <strong>{cleanPhone}</strong> or email <strong>{cleanEmail}</strong>.
                    </p>
                  </div>
                </div>

                {/* 2. Conditions for Replacement */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
                    <span>Conditions for Free Replacement or Return</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {returns.conditions || 'The item must be reported with unboxing pictures or a short unboxing video showing the damage, leakage, or seal issue. Products that have been used or opened (broken seal) are non-returnable due to strict hygiene and health safety protocols.'}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-600">
                      <li>Items damaged during transit or with visible cosmetic leakage are eligible for 100% free doorstep replacement.</li>
                      <li>Wrong item delivered: Replacement unit dispatched immediately at no additional charge.</li>
                      <li>For safety reasons, opened cosmetics with broken seals cannot be accepted once applied.</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Doorstep Replacement Process */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
                    <span>Doorstep Pickup & Replacement Dispatch</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {returns.replacementProcess || 'Free doorstep pickup & immediate replacement dispatch upon verification by our support desk.'}
                    </p>
                  </div>
                </div>

                {/* 4. Refund Processing */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
                    <span>Refund Processing Timelines</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {returns.refundTimeline || 'Approved refunds for prepaid orders (UPI / Card / NetBanking) are credited back to your original source account within 3 to 5 business days. For COD orders, refund is processed directly via instant UPI transfer or bank NEFT.'}
                    </p>
                  </div>
                </div>

                {/* 5. Support Assistance Card */}
                <div className="mt-8 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Need help initiating a return or replacement?</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Our customer support team is available Mon-Sat to assist you instantly.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${cleanPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(cleanStoreName)}%20Support,%20I%20need%20help%20with%20a%20return/replacement`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>

              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW C: PRIVACY POLICY                                          */}
          {/* =============================================================== */}
          {type === 'privacy-policy' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-slate-100 pb-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 block mb-0.5">
                    DATA INTEGRITY & SECURITY
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
                    {privacy.title || 'Privacy Policy'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Last Updated: {privacy.lastUpdated || 'November 2026'} • Official Policy of {cleanStoreName}
                  </p>
                </div>
              </div>

              {/* Introductory Paragraph */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {privacy.introText || `This Privacy Policy describes how ${cleanStoreName} collects, uses, and protects the personal details you provide while placing orders on our website.`}
              </div>

              <div className="space-y-6 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>Information We Collect</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {privacy.dataCollection || 'We collect your name, phone number, shipping address, and email solely for order delivery fulfillment, courier airway bills, and invoice communication.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
                    <span>Data Security & Third Parties</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {privacy.dataSecurity || 'We never sell, rent, or trade your personal information to third-party marketers. Your delivery address is shared only with our trusted courier logistics partners (e.g. Delhivery, BlueDart).'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
                    <span>Contact & Data Grievance</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      If you have questions regarding your data privacy, contact our grievance officer at <strong>{privacy.contactEmail || cleanEmail}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW D: TERMS & CONDITIONS                                      */}
          {/* =============================================================== */}
          {type === 'terms' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-slate-100 pb-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 block mb-0.5">
                    LEGAL AGREEMENT
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
                    {terms.title || 'Terms & Conditions'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Last Updated: {terms.lastUpdated || 'November 2026'} • Official Policy of {cleanStoreName}
                  </p>
                </div>
              </div>

              {/* Introductory Paragraph */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {terms.introText || `Welcome to ${cleanStoreName}. By accessing our platform and placing an order, you agree to comply with and be bound by the following terms of service.`}
              </div>

              <div className="space-y-6 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>100% Product Authenticity Guarantee</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {terms.authenticityClause || 'All products sold on our platform are 100% genuine with verified manufacturer holograms and security seals.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
                    <span>Usage & Skin Patch Test Advisory</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {terms.usageAdvisory || 'Since individual skin types vary, we strongly advise performing a patch test on a small area behind your ear or inner forearm prior to full facial application of any whitening cream or serum.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
                    <span>Governing Law & Legal Jurisdiction</span>
                  </h3>
                  <div className="pl-8 space-y-1.5">
                    <p>
                      {terms.jurisdiction || 'Any legal disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
