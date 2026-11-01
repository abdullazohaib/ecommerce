import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

export const PolicyPage = ({ type }) => {
  const { storeInfo, setCurrentView } = useStore();

  const getContent = () => {
    switch (type) {
      case 'shipping-policy':
        return {
          title: "Shipping & Delivery Policy",
          icon: Truck,
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                At <strong>{storeInfo.storeName}</strong>, we strive to deliver your orders in the quickest and safest possible manner across India.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">1. Dispatch Timeline</h3>
              <p>
                All orders are processed and handed over to our express courier partners (Delhivery, BlueDart, XpressBees) within 24 to 48 hours of confirmation. You will receive an SMS and WhatsApp tracking update as soon as the package leaves our warehouse.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">2. Delivery Duration</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 3 business days.</li>
                <li><strong>Tier 2 & Tier 3 Cities / Rest of India:</strong> 3 to 5 business days.</li>
                <li><strong>Northeast & Remote Regions:</strong> 5 to 7 business days.</li>
              </ul>
              <h3 className="text-base font-bold text-slate-900 pt-2">3. Shipping Charges</h3>
              <p>
                We offer <strong>FREE Shipping</strong> on all prepaid and Cash On Delivery (COD) orders exceeding ₹{storeInfo.freeShippingThreshold}. For orders below ₹{storeInfo.freeShippingThreshold}, a nominal fee of ₹{storeInfo.standardShippingFee} applies.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">4. Cash On Delivery (COD) Verification</h3>
              <p>
                To prevent false orders, our automated system or customer executive may verify your address via WhatsApp or a short phone call before releasing the consignment for dispatch.
              </p>
            </div>
          )
        };
      case 'refund-policy':
        return {
          title: "Return & Replacement Policy",
          icon: RotateCcw,
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                We take extreme care in packaging your herbal and cosmetic beauty products. In the unlikely event that you receive a damaged, expired, or incorrect item:
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">1. 7-Day Replacement Window</h3>
              <p>
                Please notify our customer care team on WhatsApp at <strong>{storeInfo.whatsappNumber}</strong> or email <strong>{storeInfo.supportEmail}</strong> within 7 days of receiving your package.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">2. Conditions for Replacement</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The item must be reported with unboxing pictures or a short unboxing clip showing the damage or seal issue.</li>
                <li>Products that have been used or opened (broken seal) are non-returnable due to strict hygiene and health safety protocols.</li>
              </ul>
              <h3 className="text-base font-bold text-slate-900 pt-2">3. Refund Processing</h3>
              <p>
                Approved refunds for prepaid orders will be credited back to your original source account (UPI or Card) within 3-5 business days. For COD orders, refund will be processed directly via your UPI ID or bank NEFT transfer.
              </p>
            </div>
          )
        };
      case 'privacy-policy':
        return {
          title: "Privacy Policy",
          icon: ShieldCheck,
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                This Privacy Policy describes how <strong>{storeInfo.storeName}</strong> collects, uses, and protects the personal details you provide while placing orders on our website.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">1. Information We Collect</h3>
              <p>
                We collect your name, phone number, shipping address, and email solely for order delivery fulfillment, courier airway bills, and invoice communication.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">2. Data Security & Third Parties</h3>
              <p>
                We never sell, rent, or trade your personal information to third-party marketers. Your delivery address is shared only with our trusted courier logistics partners (e.g. Delhivery).
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">3. Contact Us</h3>
              <p>
                If you have questions regarding your data, contact our grievance officer at <strong>{storeInfo.supportEmail}</strong>.
              </p>
            </div>
          )
        };
      default:
        return {
          title: "Terms & Conditions",
          icon: FileText,
          content: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Welcome to <strong>{storeInfo.storeName}</strong>. By accessing our platform and placing an order, you agree to comply with and be bound by the following terms of service.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">1. Product Authenticity</h3>
              <p>
                All products sold on our platform are 100% genuine with verified manufacturer holograms and security seals.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">2. Usage & Patch Test Advisory</h3>
              <p>
                Since individual skin types vary, we strongly advise performing a patch test on a small area behind your ear or inner forearm prior to full facial application of any whitening cream or serum.
              </p>
              <h3 className="text-base font-bold text-slate-900 pt-2">3. Jurisdiction</h3>
              <p>
                Any legal disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.
              </p>
            </div>
          )
        };
    }
  };

  const { title, icon: Icon, content } = getContent();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                {title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: October 2026 • {storeInfo.storeName}</p>
            </div>
          </div>

          {content}
        </div>
      </div>
    </div>
  );
};
