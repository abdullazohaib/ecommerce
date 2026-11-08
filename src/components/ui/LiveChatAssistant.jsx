import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Phone, 
  ChevronRight,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';

export const LiveChatAssistant = () => {
  const { 
    storeInfo = {}, 
    products = [], 
    currentView, 
    setCurrentView,
    setQuickViewProduct, 
    navigateToProduct, 
    openTrackingModal, 
    setIsCartOpen 
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const storeName = storeInfo?.storeName || 'Glow Basket';
  const supportEmail = storeInfo?.supportEmail || 'care@glowbasket.in';
  const supportPhone = storeInfo?.supportPhone || '+91 98200 45678';
  const freeShippingThreshold = storeInfo?.freeShippingThreshold || 999;
  const promptText = storeInfo?.whatsappPromptText || "Need help choosing a cream? Chat with us!";

  // Don't render on admin dashboard
  if (currentView === 'admin' || storeInfo?.whatsappEnabled === false) {
    return null;
  }

  // Pre-configured welcome message and options
  const initialMessages = [
    {
      id: 'welcome',
      sender: 'bot',
      time: 'Just now',
      text: `Hello gorgeous! ✨ Welcome to **${storeName}**.\n\nI am your 24/7 automated beauty & orders assistant. How can I help you today?`,
      showQuickOptions: true
    }
  ];

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('glowbasket_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialMessages;
  });

  // Save conversation history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('glowbasket_chat_history', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Scroll to bottom when new messages arrive or typing status changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
    setShowTeaser(false);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    try {
      sessionStorage.removeItem('glowbasket_chat_history');
    } catch (e) {}
  };

  // Find relevant products for recommendations
  const getRecommendedProducts = (filterKeyword = '') => {
    if (!products || products.length === 0) return [];
    
    let filtered = products.filter(p => p.status !== 'Draft');
    
    if (filterKeyword) {
      const kw = filterKeyword.toLowerCase();
      const specific = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(kw)) ||
        (p.category && p.category.toLowerCase().includes(kw)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(kw)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(kw))
      );
      if (specific.length > 0) return specific.slice(0, 3);
    }

    // Default to bestsellers or top products
    const bestsellers = filtered.filter(p => p.isBestseller || p.featured || (p.rating && p.rating >= 4.7));
    if (bestsellers.length > 0) return bestsellers.slice(0, 3);
    return filtered.slice(0, 3);
  };

  // Generate automated reply based on query or option clicked
  const processAutoReply = (query) => {
    const q = (query || '').toLowerCase().trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let botResponse = {
      id: 'bot_' + Date.now(),
      sender: 'bot',
      time: timeStr,
      text: '',
      products: [],
      action: null,
      showQuickOptions: false
    };

    if (
      q.includes('cream') || 
      q.includes('recommend') || 
      q.includes('whitening') || 
      q.includes('glow') || 
      q.includes('skin') || 
      q.includes('serum') || 
      q.includes('product') ||
      q.includes('bestseller') ||
      q.includes('acne') ||
      q.includes('dark spot')
    ) {
      const keyword = q.includes('acne') ? 'acne' : 
                      q.includes('serum') ? 'serum' : 
                      q.includes('cream') ? 'cream' : '';
      const recs = getRecommendedProducts(keyword);
      botResponse.text = `Here are our most-loved, authentic beauty formulations crafted for radiant, glowing skin:\n\n✨ **Dermatologically tested & 100% genuine formulation.**`;
      botResponse.products = recs;
      botResponse.action = {
        type: 'shop',
        label: '🛍️ Explore Full Skincare Catalog'
      };
    } else if (
      q.includes('track') || 
      q.includes('order status') || 
      q.includes('where is my order') || 
      q.includes('tracking') || 
      q.includes('package')
    ) {
      botResponse.text = `📦 **Real-Time Order Tracking**\n\nYou can track your shipment instantly using your **Order ID** or **Phone Number**.\n\nAll orders are dispatched within **24 hours** via express couriers (Delhivery, BlueDart, DTDC).`;
      botResponse.action = {
        type: 'track',
        label: '🔍 Open Live Order Tracker'
      };
    } else if (
      q.includes('shipping') || 
      q.includes('delivery') || 
      q.includes('free shipping') || 
      q.includes('charge') || 
      q.includes('time') || 
      q.includes('how long')
    ) {
      botResponse.text = `🚚 **Shipping & Delivery Information:**\n\n• **FREE Shipping:** On all orders above **Rs. ${freeShippingThreshold}**!\n• **Standard Shipping:** Flat Rs. 60 for smaller orders.\n• **Delivery Timeline:** 2 to 4 business days across India.\n• **Same-Day Dispatch:** Orders placed before 2 PM are shipped the same day.`;
    } else if (
      q.includes('cod') || 
      q.includes('cash on delivery') || 
      q.includes('payment') || 
      q.includes('pay') || 
      q.includes('upi') || 
      q.includes('card')
    ) {
      botResponse.text = `💵 **Payment & Cash on Delivery (COD):**\n\n• **100% Cash on Delivery (COD)** is available across all serviceable pincodes in India with zero hidden fees.\n• We also accept **UPI (Google Pay, PhonePe, Paytm)**, Debit/Credit Cards (Visa, RuPay, Mastercard), and Net Banking.\n• All online transactions are 256-bit SSL encrypted.`;
    } else if (
      q.includes('discount') || 
      q.includes('coupon') || 
      q.includes('offer') || 
      q.includes('promo') || 
      q.includes('deal') || 
      q.includes('code')
    ) {
      botResponse.text = `🎉 **Exclusive Offers for You Today:**\n\n• Use code **GLOW10** for flat **10% OFF** on your entire purchase!\n• **FREE Delivery** automatically applied on orders above Rs. ${freeShippingThreshold}.\n• Special bundle discounts available on select bestsellers.`;
      botResponse.action = {
        type: 'coupon',
        code: 'GLOW10',
        label: '📋 Copy Coupon: GLOW10'
      };
    } else if (
      q.includes('return') || 
      q.includes('refund') || 
      q.includes('exchange') || 
      q.includes('damage') || 
      q.includes('policy')
    ) {
      botResponse.text = `↩️ **7-Day Hassle-Free Replacement Policy:**\n\n• If your product arrived damaged, leaked, or incorrect, we provide a free replacement or full refund within 7 days of delivery.\n• Simply reach out with your Order ID and an unboxing picture to **${supportEmail}**.`;
    } else if (
      q.includes('contact') || 
      q.includes('support') || 
      q.includes('human') || 
      q.includes('agent') || 
      q.includes('call') || 
      q.includes('phone') || 
      q.includes('email') || 
      q.includes('help')
    ) {
      botResponse.text = `📞 **Customer Support Contacts:**\n\n• **Email:** ${supportEmail}\n• **Phone:** ${supportPhone}\n• **Timings:** Monday to Saturday, 9:30 AM – 7:30 PM IST\n\nOur customer care team is dedicated to assisting you with any specific queries!`;
    } else if (
      q.includes('shade') || 
      q.includes('foundation') || 
      q.includes('color') || 
      q.includes('match')
    ) {
      botResponse.text = `🎨 **Shade Matching Guide:**\n\nOur makeup, foundation, and BB creams feature specialized shades created for Indian & Asian undertones. Click any product with the **+Shades** badge to view live swatches and select your exact match!`;
      botResponse.action = {
        type: 'shop',
        label: '🛍️ Browse Cosmetics & Shades'
      };
    } else {
      // Friendly fallback
      botResponse.text = `Thank you for asking! As your automated beauty advisor, I'm here to help with product recommendations, order tracking, shipping, and discounts.\n\nPlease choose one of the topics below or reach our team at **${supportEmail}**:`;
      botResponse.showQuickOptions = true;
    }

    return botResponse;
  };

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend !== null ? textToSend : inputText).trim();
    if (!text || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      time: timeStr,
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate smart auto-reply delay (500ms to 750ms)
    setTimeout(() => {
      const reply = processAutoReply(text);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickOptionClick = (optionText) => {
    handleSendMessage(optionText);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === 'track') {
      openTrackingModal('track');
    } else if (action.type === 'shop') {
      setCurrentView('shop');
      setIsOpen(false);
    } else if (action.type === 'cart') {
      setIsCartOpen(true);
      setIsOpen(false);
    } else if (action.type === 'coupon') {
      if (action.code) {
        navigator.clipboard?.writeText(action.code);
        setCopiedCoupon(true);
        setTimeout(() => setCopiedCoupon(false), 2000);
      }
    }
  };

  const handleProductCardClick = (product) => {
    if (navigateToProduct) {
      navigateToProduct(product);
    } else if (setQuickViewProduct) {
      setQuickViewProduct(product);
    }
  };

  const quickPills = [
    { label: '✨ Recommend a Cream', query: 'Recommend a bestselling cream for glowing skin' },
    { label: '📦 Track My Order', query: 'How do I track my order?' },
    { label: '🚚 Shipping & Times', query: 'What are the delivery charges and shipping times?' },
    { label: '💵 Cash on Delivery', query: 'Is Cash on Delivery (COD) available?' },
    { label: '🏷️ Discount Codes', query: 'Do you have any discount coupons or offers?' },
    { label: '↩️ 7-Day Return Policy', query: 'What is your refund and return policy?' },
    { label: '📞 Talk to Support', query: 'How do I contact customer support?' }
  ];

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end select-none">
      
      {/* ==================== EXPANDED CHAT WINDOW ==================== */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[390px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl shadow-slate-900/30 border border-slate-200/80 flex flex-col overflow-hidden mb-3.5 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-4 py-3.5 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-500 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-rose-400" />
                  </div>
                </div>
                {/* Active Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide text-white">{storeName} Assistant</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    AI Auto-Reply
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online • Instant answers 24/7
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart chat"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender badge + timestamp */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                  <span>{msg.sender === 'user' ? 'You' : `${storeName} Bot`}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-xs whitespace-pre-wrap leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs shadow-slate-900/10'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-slate-200/50'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Product Cards in Message */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2.5 w-full max-w-[90%] space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Recommended Products:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleProductCardClick(prod)}
                          className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <img
                            src={prod.imageUrl || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black text-slate-900">
                                Rs. {(Number(prod.price) || 0).toLocaleString('en-IN')}
                              </span>
                              {prod.originalPrice && Number(prod.originalPrice) > Number(prod.price) && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  Rs. {Number(prod.originalPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center gap-0.5"
                          >
                            View
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Action Button in Message */}
                {msg.action && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.action)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {msg.action.type === 'coupon' && copiedCoupon ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Coupon Copied!</span>
                        </>
                      ) : (
                        <>
                          {msg.action.type === 'coupon' ? <Copy className="w-3.5 h-3.5" /> : null}
                          <span>{msg.action.label}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Quick Option Buttons inside Message */}
                {msg.showQuickOptions && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {quickPills.slice(0, 4).map((pill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickOptionClick(pill.query)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer text-left"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="text-[10px] text-slate-400 mb-1 px-1">{storeName} Bot is replying...</div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Row above input */}
          <div className="px-3 py-1.5 bg-slate-100/90 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-rose-500" />
              Quick:
            </span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickOptionClick(pill.query)}
                className="text-[10px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-200 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything or pick a topic..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-9 h-9 rounded-2xl bg-slate-900 text-white hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-slate-900 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-md shadow-slate-900/10"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* ==================== FLOATING TRIGGER BUTTON & TEASER ==================== */}
      <div className="flex items-center gap-3">
        {/* Modern Teaser Tooltip */}
        {!isOpen && showTeaser && (
          <div 
            onClick={handleOpenChat}
            className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-200/90 text-xs text-slate-800 hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer animate-in slide-in-from-right-3 duration-300 group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-semibold group-hover:text-slate-950 transition-colors">
              {promptText}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close chat' : 'Open instant assistance'}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group cursor-pointer ${
            isOpen 
              ? 'bg-slate-900 text-white shadow-slate-900/40 rotate-90' 
              : 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white shadow-indigo-950/40 hover:scale-110 active:scale-95 border border-white/20'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:scale-110" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <Sparkles className="w-3.5 h-3.5 text-rose-400 absolute top-3 right-3 animate-pulse" />
              
              {/* Unread notification ping */}
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-md border-2 border-white animate-bounce">
                  1
                </span>
              )}
            </>
          )}
        </button>
      </div>

    </div>
  );
};

