import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloating = () => {
  const { storeInfo } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanNumber = storeInfo.whatsappNumber.replace(/\D/g, '');
  const defaultMsg = encodeURIComponent(`Hi ${storeInfo.storeName}, I want to know more about your authentic skin whitening products and delivery time.`);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-5 z-40 flex items-end gap-3 select-none">
      {/* Tooltip prompt */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200 text-xs text-slate-800 animate-in slide-in-from-right-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Need help choosing a cream? <strong>Chat with us!</strong></span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${cleanNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all duration-300 group cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500 group-hover:scale-105 transition-transform" />
      </a>
    </div>
  );
};
