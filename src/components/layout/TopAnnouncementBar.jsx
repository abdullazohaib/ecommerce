import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

export const TopAnnouncementBar = () => {
  const { storeInfo = {}, addToast } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Dynamic Announcement from Admin Settings
  const customAnnouncement = storeInfo?.announcement?.text
    ? {
        text: `${storeInfo.announcement.badge ? `[${storeInfo.announcement.badge}] ` : ''}${storeInfo.announcement.text}${storeInfo.announcement.code ? ` | Use Code: ${storeInfo.announcement.code}` : ''}`,
        code: storeInfo.announcement.code || ''
      }
    : null;

  const defaultAnnouncements = [
    { text: "Buy Any 2 Products at ₹699 | Use Code: BUY2", code: "BUY2" },
    { text: `Welcome to ${storeInfo?.storeName || 'Glow Basket'} — Flat 20% OFF on all Skincare Ranges! Use Code: GLOW20`, code: "GLOW20" },
    { text: "⚡ Free Express Cash on Delivery (COD) Across India on Orders ₹699+", code: "" }
  ];

  const announcements = customAnnouncement
    ? [customAnnouncement, ...defaultAnnouncements.filter(a => a.text !== customAnnouncement.text)]
    : defaultAnnouncements;

  // Auto-rotate announcement every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const activeMsg = announcements[currentIdx];

  const copyCoupon = (code) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      addToast(`Coupon "${code}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-black text-white text-xs py-2 px-4 border-b border-neutral-900 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Arrow Button (Matching Dr. Sheth's) */}
        <button
          onClick={() => setCurrentIdx(prev => (prev - 1 + announcements.length) % announcements.length)}
          className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Center Text (Matching Dr. Sheth's: Buy Any 2 Products at ₹699 | Use Code: BUY2) */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs font-semibold tracking-wide flex-1 px-2">
          <span>{activeMsg.text}</span>
          {activeMsg.code && (
            <button
              onClick={() => copyCoupon(activeMsg.code)}
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 border border-white/20 px-2 py-0.5 rounded font-mono font-bold text-amber-300 hover:text-white transition-all cursor-pointer text-[10px]"
              title="Click to copy coupon code"
            >
              <span>{activeMsg.code}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300" />}
            </button>
          )}
        </div>

        {/* Right Arrow Button (Matching Dr. Sheth's) */}
        <button
          onClick={() => setCurrentIdx(prev => (prev + 1) % announcements.length)}
          className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
