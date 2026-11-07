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
  categoryBannerImage: "/banners/classic-glow-hero-clean.jpg",
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
  badge: "ABOUT THE BRAND",
  title: "Empowering Everyday Beauty & Uncompromising Purity",
  subtitle: "We create high-performance color cosmetics and scientifically backed skincare that enhance your natural glow with pure, certified formulations.",
  storyTitle: "Our Story",
  storyParagraph1: "Born out of a passion for high-impact beauty without compromises, Classic Glow brings together rich pigment payoff, velvety textures, and skin-loving active ingredients. From signature peptide lip oils to seamless HD foundations, every formula is designed for real life.",
  storyParagraph2: "We believe beauty should be genuine, accessible, and safe. That's why every product in our catalog undergoes rigorous batch verification, carrying our security hologram seal so you never have to doubt what touches your skin.",
  storyImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
  establishedYear: "Est. 2018",
  statNumber: "50,000+",
  statLabel: "Happy Customers Across India",
  pillars: [
    {
      title: "100% Genuine Certified",
      desc: "Tamper-evident batch hologram seals ensuring untampered purity.",
      badge: "Verified Purity"
    },
    {
      title: "Express Pan-India Delivery",
      desc: "Swift 2-4 day dispatch with live tracking and Cash On Delivery available.",
      badge: "Fast Dispatch"
    },
    {
      title: "Cruelty-Free Formulations",
      desc: "Thoughtfully crafted formulations that nourish and protect your skin.",
      badge: "Safe Ingredients"
    }
  ],
  ctaTitle: "Need help finding your perfect shade or routine?",
  ctaSubtitle: "Our beauty advisors are available on WhatsApp 7 days a week for personalized recommendations.",
  ctaButtonText: "Chat with Beauty Advisor"
};

export const initialPolicies = {
  shippingPolicy: {
    title: "Shipping & Delivery Policy",
    lastUpdated: "November 2026",
    introText: "At our store, we strive to deliver your orders in the quickest and safest possible manner across India with tamper-proof security packaging.",
    dispatchTimeline: "Orders are processed and dispatched within 24 to 48 hours of order confirmation.",
    courierPartners: "Delhivery, BlueDart, XpressBees, DTDC Express",
    deliveryMetro: "2 to 3 business days (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata)",
    deliveryNonMetro: "3 to 5 business days (Tier 2 & Tier 3 Cities / Rest of India)",
    deliveryRemote: "5 to 7 business days (Northeast & Remote Pin Codes)",
    freeShippingThreshold: 999,
    standardShippingFee: 79,
    codVerificationNote: "To prevent false delivery attempts, our automated system or support executive may verify your delivery address via WhatsApp or a short phone call before releasing the consignment for dispatch.",
    packagingNote: "All shipments are packed in tamper-proof bubble security packaging with genuine batch holograms to ensure untampered product purity."
  },
  returnPolicy: {
    title: "Return & Replacement Policy",
    lastUpdated: "November 2026",
    introText: "We take extreme care in packaging your cosmetic, skincare, and beauty formulations. In the unlikely event that you receive a damaged, leaked, expired, or incorrect item:",
    returnWindowDays: 7,
    windowNote: "Please notify our customer care team on WhatsApp or email within 7 days of receiving your package.",
    conditions: "The item must be reported with unboxing pictures or a short unboxing video showing the damage, leakage, or seal issue. Products that have been used or opened (broken seal) are non-returnable due to strict hygiene and health safety protocols.",
    refundTimeline: "Approved refunds for prepaid orders (UPI / Card / NetBanking) are credited back to your original source account within 3 to 5 business days. For COD orders, refund is processed directly via instant UPI transfer or bank NEFT.",
    replacementProcess: "Free doorstep pickup & immediate replacement dispatch upon verification by our support desk.",
    supportContact: "WhatsApp Live Chat or email support"
  },
  privacyPolicy: {
    title: "Privacy Policy",
    lastUpdated: "November 2026",
    introText: "This Privacy Policy describes how we collect, use, and protect the personal details you provide while placing orders on our website.",
    dataCollection: "We collect your name, phone number, shipping address, and email solely for order delivery fulfillment, courier airway bills, and invoice communication.",
    dataSecurity: "We never sell, rent, or trade your personal information to third-party marketers. Your delivery address is shared only with our trusted courier logistics partners (e.g. Delhivery, BlueDart).",
    contactEmail: "care@glowbasket.in"
  },
  termsPolicy: {
    title: "Terms & Conditions",
    lastUpdated: "November 2026",
    introText: "Welcome to our store. By accessing our platform and placing an order, you agree to comply with and be bound by the following terms of service.",
    authenticityClause: "All products sold on our platform are 100% genuine with verified manufacturer holograms and security seals.",
    usageAdvisory: "Since individual skin types vary, we strongly advise performing a patch test on a small area behind your ear or inner forearm prior to full facial application of any whitening cream or serum.",
    jurisdiction: "Any legal disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, India."
  }
};


