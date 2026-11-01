export const storeConfig = {
  // Brand Identity - Easily rename your store anytime here!
  storeName: "AuraGlow",
  storeTagline: "Authentic Skincare & Herbal Beauty Solutions",
  logoText: "AuraGlow",
  domainName: "auraglow.in",
  
  // Contact & Support Info
  supportPhone: "+91 98200 45678",
  whatsappNumber: "+91 98200 45678",
  supportEmail: "care@auraglow.in",
  businessAddress: "402, Lotus Corporate Park, Off Western Express Highway, Goregaon (East), Mumbai - 400063, Maharashtra, India",
  supportTiming: "Mon - Sat: 9:30 AM - 7:00 PM IST",
  
  // Currency & Shipping
  currency: {
    symbol: "₹",
    code: "INR",
    locale: "en-IN"
  },
  freeShippingThreshold: 999,
  standardShippingFee: 79,
  codFee: 0, // Free COD for high conversions!

  // Announcement Bar message
  announcement: {
    badge: "Special Sale",
    text: "Flat 20% OFF on all Night Creams & Glutathione Combos! Use Code:",
    code: "GLOW20",
    tickerNotice: "⚡ Free Cash on Delivery (COD) & Fast 2-4 Days Express Dispatch across India"
  },

  // Promo Codes Available
  promoCodes: [
    { code: "GLOW20", discountPercent: 20, minAmount: 799, description: "Flat 20% OFF on orders above ₹799" },
    { code: "FLAT10", discountPercent: 10, minAmount: 499, description: "10% OFF on your first purchase" },
    { code: "BEAUTY500", discountAmount: 500, minAmount: 2500, description: "Flat ₹500 OFF on orders above ₹2,500" }
  ],

  // Trust Highlights
  trustHighlights: [
    {
      title: "100% Original & Authentic",
      desc: "Direct from verified manufacturers with hologram seals",
      icon: "ShieldCheck"
    },
    {
      title: "Free Express Delivery",
      desc: "Delivered to 25,000+ pin codes in 2-4 business days",
      icon: "Truck"
    },
    {
      title: "Cash On Delivery (COD)",
      desc: "Pay securely at your doorstep when you receive your order",
      icon: "Banknote"
    },
    {
      title: "7-Day Easy Replacement",
      desc: "Hassle-free guarantee if damaged in transit",
      icon: "RotateCcw"
    },
    {
      title: "WhatsApp Order & Support",
      desc: "Instant live assistance and order updates 7 days a week",
      icon: "MessageCircle"
    }
  ]
};
