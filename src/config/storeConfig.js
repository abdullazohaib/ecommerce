export const storeConfig = {
  // Brand Identity - Glow Basket
  storeName: "Glow Basket",
  storeTagline: "Luxury Skincare, Cosmetic Glam & Radiant Beauty Formulations",
  logoText: "Glow Basket",
  monogram: "GB",
  logoType: "image",
  logoUrl: "/logo.png",
  domainName: "glowbasket.in",
  siteUrl: "https://glowbasket.in",

  // Contact & Support Info
  supportPhone: "+91 98200 45678",
  whatsappNumber: "+91 98200 45678",
  supportEmail: "care@glowbasket.in",
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
  codFee: 0, // Free COD for maximum conversion

  // Announcement Bar message
  announcement: {
    badge: "Special Sale",
    text: "Welcome to Glow Basket — Flat 20% OFF on all Skincare & Glam Ranges! Use Code:",
    code: "GLOW20",
    tickerNotice: "⚡ Free Cash on Delivery (COD) & Fast 2-4 Days Express Dispatch across India"
  },

  // Deal of the Day Configuration (Editable from Admin Profile)
  dealOfTheDay: {
    enabled: true,
    title: "DEALS OF THE DAY.",
    badge: "FLASH OFFER",
    countdownHours: 12
  },

  // Homepage Hero Banners (Editable from Admin)
  banners: [
    {
      id: "banner-1",
      active: true,
      status: "Active",
      isGraphicBanner: true,
      bannerType: "image",
      tag: "Glow Basket Exclusive",
      title: "9 TO 5 HYA GLAM RANGE",
      subtitle: "Effortless all-day radiance and lightweight hydration. Ready in 5 minutes.",
      offerText: "NEW LAUNCH • SPECIAL OFFERS",
      guaranteeText: "100% Genuine & Authentic",
      coupon: "GLAM20",
      ctaText: "Shop Glam Range",
      ctaLink: "/shop",
      secondaryCtaText: "View Full Catalog",
      secondaryCtaLink: "/shop",
      catSlug: "serums",
      dispatchTag: "FAST DISPATCH",
      dispatchText: "Delivery Across India in 2-4 Days",
      stockBadge: "IN STOCK",
      bgClass: "bg-white text-slate-900 border border-slate-100",
      badgeClass: "bg-rose-100/90 text-rose-800 border-rose-200",
      image: "/banners/classic-glow-hero-clean.jpg"
    },
    {
      id: "banner-2",
      active: true,
      status: "Active",
      isGraphicBanner: true,
      bannerType: "image",
      tag: "Dermatologist Formulated",
      title: "Your AM-to-PM Skincare Routine",
      subtitle: "1% Ceramide Locks in Moisture Throughout The Day • 1% Vitamin C Fades Dark Spots by Night.",
      offerText: "Buy 2 at ₹699 • Use Code: BUY2",
      guaranteeText: "Clinically Tested & Certified",
      coupon: "BUY2",
      ctaText: "SHOP NOW",
      ctaLink: "/shop",
      secondaryCtaText: "View Full Catalog",
      secondaryCtaLink: "/shop",
      catSlug: "all",
      dispatchTag: "EXPRESS DISPATCH",
      dispatchText: "Free Express Shipping on Orders ₹699+",
      stockBadge: "IN STOCK",
      bgClass: "bg-white text-slate-900 border border-slate-100",
      badgeClass: "bg-slate-100 text-slate-900 border-slate-300",
      image: "/banners/dr-sheths-am-pm-routine.jpg"
    },
    {
      id: "banner-3",
      active: true,
      status: "Active",
      isGraphicBanner: true,
      bannerType: "image",
      tag: "Pure Herbal Radiance",
      title: "Handcrafted Herbal Beauty Formulations",
      subtitle: "Papaya, Kojic acid, and pure Glutathione handcrafted bars for deep cleansing and radiant glow.",
      offerText: "STARTING AT JUST ₹349",
      guaranteeText: "100% Genuine Hologram Verified",
      coupon: "FLAT10",
      ctaText: "Shop Herbal Collection",
      ctaLink: "/category/soaps",
      secondaryCtaText: "View Full Catalog",
      secondaryCtaLink: "/shop",
      catSlug: "soaps",
      dispatchTag: "HANDMADE FRESH",
      dispatchText: "Dermatologically Tested Formula",
      stockBadge: "READY TO SHIP",
      bgClass: "bg-white text-slate-900 border border-slate-100",
      badgeClass: "bg-slate-100 text-slate-900 border-slate-300",
      image: "https://images.unsplash.com/photo-1608248597359-25f0a8ea74f5?auto=format&fit=crop&w=1200&q=80"
    }
  ],

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

export const initialAboutSection = {
  badge: "Our Heritage & Mission",
  title: "Crafted for Pure Radiance & Authenticity",
  subtitle: "India's leading destination for authenticated skin whitening treatments, pure glutathione serums, and certified herbal formulations.",
  storyTitle: "Who We Are",
  storyParagraph1: "Founded with the vision to bring genuine, dermatologist-endorsed cosmetic solutions to Indian households, our platform bridges the gap between traditional herbal wisdom and modern skincare science.",
  storyParagraph2: "In an industry where duplicate and unauthorized replicas are rampant, we stand as a fortress of purity. Every jar and serum sold carries our tamper-proof security hologram seal and verifiable batch certification.",
  storyImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
  establishedYear: "Est. 2018",
  statNumber: "50,000+",
  statLabel: "Happy Skin Transformations",
  pillars: [
    {
      title: "100% Hologram Verified",
      desc: "Every package is sealed with verifiable batch holographic stickers.",
      badge: "Purity Guarantee"
    },
    {
      title: "Pan-India Express Dispatch",
      desc: "Fast 2-4 days express delivery across 25,000+ PIN codes with COD available.",
      badge: "Fast Shipping"
    },
    {
      title: "50,000+ Verified Buyers",
      desc: "Consistent 4.9-star satisfaction rate for visible, real skin transformations.",
      badge: "Customer Trust"
    }
  ],
  ctaTitle: "Have questions about our formulations?",
  ctaSubtitle: "Our skincare advisory team is available on WhatsApp 7 days a week.",
  ctaButtonText: "Chat with Skincare Specialist"
};

