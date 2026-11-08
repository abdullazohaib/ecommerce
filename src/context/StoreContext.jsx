import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { storeConfig, initialAboutSection, initialPolicies } from '../config/storeConfig';
import { testimonials as initialReviews } from '../data/testimonials';
import { slugify, safeStorageSet, idbSet, idbGet, idbDelete } from '../utils/helpers';

export { slugify, safeStorageSet, idbSet, idbGet, idbDelete };

const StoreContext = createContext();

// URL Route Parser Helper
const parseUrlPath = (pathname = '') => {
  const clean = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '') {
    return { view: 'home', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  if (clean === '/shop') {
    return { view: 'shop', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  if (clean.startsWith('/category/')) {
    const parts = clean.replace('/category/', '').split('/').filter(Boolean);
    const cat = parts[0] || 'all';
    const sub = parts[1] || 'all';
    return { view: 'shop', category: cat, subCategory: sub, productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  // Matches both /product/:slug and /products/:slug (with NO GAPS)
  if (clean.startsWith('/product/') || clean.startsWith('/products/')) {
    const slug = clean.replace(/^\/products?\//, '');
    return { view: 'product-detail', category: 'all', productSlug: slug, isAdmin: false, adminTab: 'dashboard' };
  }
  if (clean === '/about-us' || clean === '/about') {
    return { view: 'about', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  if (clean === '/contact-us' || clean === '/contact') {
    return { view: 'contact', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  if (clean === '/blog') {
    return { view: 'blog', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  if (clean === '/wishlist') {
    return { view: 'wishlist', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }

  // Admin routes & dedicated sub-pages (e.g. /admin/dashboard, /admin/deshbord, /admin/products, /admin/banners, etc.)
  if (clean === '/admin' || clean.startsWith('/admin/')) {
    const rawSub = clean.replace(/^\/admin\/?/, '').trim();
    let tab = 'dashboard';
    if (!rawSub || rawSub === 'dashboard' || rawSub === 'deshbord' || rawSub === 'dashbord') {
      tab = 'dashboard';
    } else if (['products', 'product', 'product-list', 'items'].includes(rawSub)) {
      tab = 'products';
    } else if (['categories', 'category', 'catalog'].includes(rawSub)) {
      tab = 'categories';
    } else if (['banners', 'banner', 'hero', 'slider', 'slides'].includes(rawSub)) {
      tab = 'banners';
    } else if (['sales', 'orders', 'order', 'transactions'].includes(rawSub)) {
      tab = 'sales';
    } else if (['customers', 'customer', 'users', 'user'].includes(rawSub)) {
      tab = 'customers';
    } else if (['analytics', 'reports', 'stats'].includes(rawSub)) {
      tab = 'analytics';
    } else if (['notifications', 'notification', 'alerts'].includes(rawSub)) {
      tab = 'notifications';
    } else if (['settings', 'setting', 'branding', 'logo', 'store-settings'].includes(rawSub)) {
      tab = 'settings';
    } else if (['about', 'about-us', 'brand-story'].includes(rawSub)) {
      tab = 'about';
    } else if (['policies', 'policy', 'shipping-policy', 'refund-policy', 'legal'].includes(rawSub)) {
      tab = 'policies';
    } else if (['reviews', 'review', 'testimonials', 'ratings'].includes(rawSub)) {
      tab = 'reviews';
    } else {
      tab = rawSub;
    }
    return { view: 'admin', adminTab: tab, category: 'all', productSlug: null, isAdmin: true };
  }

  if (clean === '/terms' || clean === '/terms-and-conditions') {
    return { view: 'terms', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  if (['/shipping-policy', '/refund-policy', '/privacy-policy'].includes(clean)) {
    const pol = clean.replace('/', '');
    return { view: pol, category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
  }
  return { view: 'home', category: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };
};

export const StoreProvider = ({ children }) => {
  // Store Branding & Settings
  const [storeInfo, setStoreInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_store_info') || localStorage.getItem('auraglow_store_info');
      const backupLogoUrl = localStorage.getItem('glowbasket_logo_url');
      const backupLogoType = localStorage.getItem('glowbasket_logo_type');
      const backupStoreName = localStorage.getItem('glowbasket_store_name');
      const backupMonogram = localStorage.getItem('glowbasket_monogram');

      let parsed = {};
      if (saved) {
        try {
          const res = JSON.parse(saved);
          if (res && typeof res === 'object') parsed = res;
        } catch (e) {}
      }

      // Respect user's explicit saved choices first, fallback to backup keys, then storeConfig
      const storeName = parsed.storeName || backupStoreName || storeConfig.storeName || 'Classic Glow';
      const logoText = parsed.logoText || backupStoreName || storeName;
      let monogram = parsed.monogram || backupMonogram || storeConfig.monogram || 'CG';
      // If brand name is changed (e.g. Classic Glow) but monogram was still stale 'GB', auto-heal to brand initials
      if (monogram === 'GB' && storeName && !storeName.toLowerCase().includes('glow basket')) {
        const words = storeName.trim().split(/\s+/).filter(Boolean);
        monogram = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : storeName.trim().slice(0, 2).toUpperCase();
      }
      const logoType = parsed.logoType || backupLogoType || storeConfig.logoType || 'text';
      const logoUrl = parsed.logoUrl || backupLogoUrl || storeConfig.logoUrl || '/logo.png';

      // Strip duplicate banners from storeInfo to prevent localStorage quota exhaustion
      const { banners: _unused, ...cleanParsed } = parsed;

      const normalized = {
        ...storeConfig,
        ...cleanParsed,
        storeName,
        logoText,
        monogram,
        logoType,
        logoUrl,
        supportEmail: cleanParsed.supportEmail || storeConfig.supportEmail || 'care@glowbasket.in',
        currency: storeConfig.currency || { symbol: "₹", code: "INR", locale: "en-IN" },
        announcement: {
          ...storeConfig.announcement,
          ...(cleanParsed.announcement || {})
        },
        dealOfTheDay: {
          ...storeConfig.dealOfTheDay,
          ...(cleanParsed.dealOfTheDay || {})
        }
      };

      return normalized;
    } catch (e) {
      // Fallback
    }
    return storeConfig;
  });

  // Customer Reviews State (Editable from Admin)
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialReviews;
  });

  const [reviewsHeader, setReviewsHeader] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_reviews_header');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return {
      badge: "Verified Experiences",
      title: "Real Transformations, Real Stories",
      subtitle: "Read what authentic buyers have to say about our creams, soaps, and wellness formulas.",
      aggregateRating: "4.9",
      reviewCountText: "Based on 2,840+ genuine buyer reviews"
    };
  });

  // Products state (can be edited/added in admin panel)
  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_products') || localStorage.getItem('auraglow_products');
      const parsed = saved ? JSON.parse(saved) : null;
      let list = Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProducts;

      // Auto-migrate legacy category IDs to new beauty categories
      const catMap = {
        'whitening-creams': 'skincare',
        'night-creams': 'skincare',
        'serums': 'skincare',
        'soaps': 'skincare',
        'lotions-cleansers': 'skincare',
        'health-wellness': 'skincare'
      };

      list = list.map(p => {
        const initMatch = initialProducts.find(ip => ip.id === p.id);
        const cat = catMap[p.category] || p.category || initMatch?.category || 'skincare';
        const subCategory = p.subCategory || initMatch?.subCategory || '';
        const isSkincare = cat === 'skincare';
        return {
          ...p,
          category: cat,
          subCategory: subCategory,
          status: p.status || (p.stock > 10 ? 'Active' : p.stock > 0 ? 'Scheduled' : 'Draft'),
          hasShades: isSkincare ? false : (p.hasShades !== undefined ? p.hasShades : Boolean(p.shades && p.shades.length > 0)),
          isNewLaunch: p.isNewLaunch !== undefined ? Boolean(p.isNewLaunch) : Boolean(initMatch?.isNewLaunch),
          isBestseller: p.isBestseller !== undefined ? Boolean(p.isBestseller) : Boolean(p.featured || initMatch?.isBestseller)
        };
      });

      // Ensure new initial products (Lips, Eyes, Face, Nails) are populated if not already in list
      const existingIds = new Set(list.map(p => p.id));
      const missingInitial = initialProducts.filter(p => !existingIds.has(p.id));
      if (missingInitial.length > 0) {
        list = [...list, ...missingInitial];
      }

      return list;
    } catch {
      return initialProducts.map(p => ({
        ...p,
        status: p.status || (p.stock > 10 ? 'Active' : p.stock > 0 ? 'Scheduled' : 'Draft')
      }));
    }
  });

  // Website Homepage Banners State (Controlled from Admin with Instant Reactive Sync)
  const [banners, setBanners] = useState(() => {
    try {
      // 1. Read deleted banner IDs
      let deletedBannerIds = new Set();
      try {
        const d = JSON.parse(localStorage.getItem('glowbasket_deleted_banners') || '[]');
        if (Array.isArray(d)) deletedBannerIds = new Set(d);
      } catch (e) {}

      // 2. Read individual guaranteed home banner keys (crash-proof persistence)
      const customImages = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('glowbasket_home_banner_')) {
            const bId = key.replace('glowbasket_home_banner_', '');
            const val = localStorage.getItem(key);
            if (val) customImages[bId] = val;
          }
        }
      } catch (e) {}

      const saved = localStorage.getItem('glowbasket_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep user's custom changes, uploads, and additions exactly as saved
          return parsed
            .filter(b => !deletedBannerIds.has(b.id))
            .map((b, idx) => {
              const bId = b.id || `banner-${idx + 1}`;
              return {
                ...b,
                id: bId,
                active: b.active !== false && b.status !== 'Draft',
                status: b.status || (b.active !== false ? 'Active' : 'Draft'),
                isGraphicBanner: b.isGraphicBanner !== false,
                bannerType: b.bannerType || (b.isGraphicBanner !== false ? 'image' : 'split'),
                image: customImages[bId] || b.image || (idx === 1 ? "/banners/dr-sheths-am-pm-routine.jpg" : "/banners/classic-glow-hero-clean.jpg"),
                ctaLink: b.ctaLink || '/shop'
              };
            });
        }
      }

      // Check default banners against custom individual image keys and deletions
      const defaults = storeConfig.banners || [];
      return defaults
        .filter(b => !deletedBannerIds.has(b.id))
        .map(b => ({
          ...b,
          image: customImages[b.id] || b.image
        }));
    } catch (e) {
      console.warn("Error parsing stored banners:", e);
    }
    return storeConfig.banners || [];
  });

  // Dedicated Category Banners State: separate full-size banner for each category
  const defaultCategoryBanners = {
    lips: '/categories/lips.png',
    eyes: '/categories/eyes.png',
    face: '/categories/face.png',
    nails: '/categories/nails.png',
    skincare: '/categories/skin.png',
    all: '/banners/classic-glow-hero-clean.jpg'
  };

  const [categoryBanners, setCategoryBanners] = useState(() => {
    const custom = {};
    // 1. Read individual guaranteed keys (crash-proof persistence across refresh)
    ['lips', 'eyes', 'face', 'nails', 'skincare', 'all'].forEach(slug => {
      try {
        const val = localStorage.getItem(`glowbasket_banner_${slug}`);
        if (val) custom[slug] = val;
      } catch (e) {}
    });

    // 2. Read any dynamic glowbasket_banner_* keys for user-created categories
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('glowbasket_banner_')) {
          const catSlug = key.replace('glowbasket_banner_', '').toLowerCase();
          const val = localStorage.getItem(key);
          if (val) custom[catSlug] = val;
        }
      }
    } catch (e) {}

    // 3. Read glowbasket_category_banners object
    try {
      const saved = localStorage.getItem('glowbasket_category_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          Object.assign(custom, parsed);
        }
      }
    } catch (e) {}

    // 4. Check categories in localStorage for custom uploaded banners
    try {
      const savedCats = localStorage.getItem('glowbasket_categories');
      if (savedCats) {
        const parsedCats = JSON.parse(savedCats);
        if (Array.isArray(parsedCats)) {
          parsedCats.forEach(c => {
            const slug = (c.slug || c.id || '').toLowerCase();
            if (slug && c.bannerImg && !custom[slug]) {
              custom[slug] = c.bannerImg;
            }
          });
        }
      }
    } catch (e) {}

    return { ...defaultCategoryBanners, ...custom };
  });

  // Categories State (Controlled & Editable from Admin - Lips, Eyes, Face, Nails, Skincare + Custom User Categories)
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      // 1. Collect all custom banners
      let customBanners = {};
      try {
        const savedB = localStorage.getItem('glowbasket_category_banners');
        if (savedB) customBanners = JSON.parse(savedB) || {};
      } catch (e) {}

      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('glowbasket_banner_')) {
            const catSlug = key.replace('glowbasket_banner_', '').toLowerCase();
            const val = localStorage.getItem(key);
            if (val) customBanners[catSlug] = val;
          }
        }
      } catch (e) {}

      // 2. Read explicitly deleted category slugs
      let deletedSlugs = new Set();
      try {
        const d = JSON.parse(localStorage.getItem('glowbasket_deleted_categories') || '[]');
        if (Array.isArray(d)) deletedSlugs = new Set(d.map(s => (s || '').toLowerCase()));
      } catch (e) {}

      // 3. Check saved categories in localStorage
      const saved = localStorage.getItem('glowbasket_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Map user categories and ensure valid slug, banner, and subcategories
          const userCategories = parsed.map(c => {
            const slug = (c.slug || c.id || slugify(c.name || '')).toLowerCase();
            const banner = customBanners[slug] || c.bannerImg || '/banners/classic-glow-hero-clean.jpg';
            return {
              ...c,
              id: c.id || slug,
              slug: slug,
              name: c.name || slug,
              description: c.description || 'Premium beauty & skincare collection',
              bannerImg: banner,
              badge: c.badge || '',
              icon: c.icon || 'Sparkles',
              subcategories: Array.isArray(c.subcategories) ? c.subcategories : []
            };
          });

          // Ensure any default initial categories that haven't been deleted are preserved
          const existingSlugs = new Set(userCategories.map(c => (c.slug || c.id || '').toLowerCase()));
          const missingCore = initialCategories
            .filter(core => {
              const s = (core.slug || core.id || '').toLowerCase();
              return !existingSlugs.has(s) && !deletedSlugs.has(s);
            })
            .map(core => {
              const slug = (core.slug || core.id || '').toLowerCase();
              return {
                ...core,
                bannerImg: customBanners[slug] || core.bannerImg
              };
            });

          return [...userCategories, ...missingCore];
        }
      }

      // 4. Default: initial categories with custom banners if any
      return initialCategories.map(cat => {
        const slug = (cat.slug || cat.id || '').toLowerCase();
        const banner = customBanners[slug] || cat.bannerImg;
        return {
          ...cat,
          bannerImg: banner
        };
      });
    } catch (e) {
      console.warn('Error restoring categoriesList:', e);
      return initialCategories;
    }
  });

  // About Us Section State (Controlled & Editable from Admin)
  const [aboutSection, setAboutSection] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_about_section');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...initialAboutSection, ...parsed };
        }
      }
    } catch (e) {}
    return initialAboutSection;
  });

  // Store Policies & Legal State (Controlled & Editable from Admin)
  const [policies, setPolicies] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_policies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            shippingPolicy: { ...initialPolicies.shippingPolicy, ...(parsed.shippingPolicy || {}) },
            returnPolicy: { ...initialPolicies.returnPolicy, ...(parsed.returnPolicy || {}) },
            privacyPolicy: { ...initialPolicies.privacyPolicy, ...(parsed.privacyPolicy || {}) },
            termsPolicy: { ...initialPolicies.termsPolicy, ...(parsed.termsPolicy || {}) }
          };
        }
      }
    } catch (e) {}
    return initialPolicies;
  });

  // Initial Route parsed synchronously from address bar
  const initialRoute = typeof window !== 'undefined' 
    ? parseUrlPath(window.location.pathname) 
    : { view: 'home', category: 'all', subCategory: 'all', productSlug: null, isAdmin: false, adminTab: 'dashboard' };

  // Navigation / Views
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [adminTab, setAdminTab] = useState(initialRoute.adminTab || 'dashboard');
  const [selectedCategory, setSelectedCategory] = useState(initialRoute.category);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialRoute.subCategory || 'all');
  const [selectedProduct, setSelectedProduct] = useState(() => {
    if (initialRoute.productSlug) {
      let list = initialProducts;
      try {
        const saved = localStorage.getItem('glowbasket_products') || localStorage.getItem('auraglow_products');
        if (saved) list = JSON.parse(saved);
      } catch (e) {}
      const found = list.find(
        p => p.slug === initialRoute.productSlug || 
             slugify(p.name) === initialRoute.productSlug || 
             p.id === initialRoute.productSlug
      );
      return found || null;
    }
    return null;
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_cart') || localStorage.getItem('auraglow_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_wishlist') || localStorage.getItem('auraglow_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders History
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_orders') || localStorage.getItem('auraglow_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [
      {
        orderId: "AG-88412",
        date: "2026-10-28 14:32",
        status: "In Transit",
        trackingNumber: "DLV98421098IN",
        courier: "Delhivery Express",
        estimatedDelivery: "2-3 Days",
        customer: {
          fullName: "Pooja Sharma",
          phone: "+91 98765 43210",
          email: "pooja.s@example.com",
          address: "Flat 402, Golden Heights, Andheri West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400053"
        },
        paymentMethod: "Cash on Delivery (COD)",
        items: [
          {
            id: "prod-1",
            name: "Vita Glow Advanced Night Cream for Radiant Skin",
            price: 1399,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"
          },
          {
            id: "prod-5",
            name: "Chandni Whitening Soap with Natural Milk & Fruit Extracts",
            price: 349,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1607006314647-79a6d05634e7?auto=format&fit=crop&w=400&q=80"
          }
        ],
        subtotal: 2097,
        discount: 209,
        shipping: 0,
        total: 1888,
        timeline: [
          { title: "Order Placed", time: "28 Oct, 02:32 PM", completed: true },
          { title: "Quality Check & Packed", time: "28 Oct, 06:15 PM", completed: true },
          { title: "Dispatched from Mumbai Hub", time: "29 Oct, 09:30 AM", completed: true },
          { title: "Out for Delivery", time: "Expected Tomorrow", completed: false },
          { title: "Delivered", time: "Pending", completed: false }
        ]
      }
    ];
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [priceFilter, setPriceFilter] = useState(3000);

  // Modals & Drawers
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingModalMode, setTrackingModalMode] = useState('track'); // 'track' | 'cancel'
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTrackingQuery, setActiveTrackingQuery] = useState('');

  const openTrackingModal = (mode = 'track', orderId = '') => {
    setTrackingModalMode(mode);
    if (orderId) setActiveTrackingQuery(orderId);
    setIsTrackingModalOpen(true);
  };

  // Authentication State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'admin'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('glowbasket_user') || localStorage.getItem('auraglow_user');
      if (saved) {
        const u = JSON.parse(saved);
        // Clear mock/stale session if it was placeholder "Valued Customer admin"
        if (u && (u.emailOrPhone === 'admin' || (u.name === 'Valued Customer' && !u.email))) {
          localStorage.removeItem('glowbasket_user');
          localStorage.removeItem('auraglow_user');
          return null;
        }
        return u;
      }
    } catch (e) {}
    return null;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return (localStorage.getItem('glowbasket_admin_auth') || localStorage.getItem('auraglow_admin_auth')) === 'true';
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Tracks whether initial async IndexedDB hydration has finished to prevent race condition overwrites
  const hasHydratedIdb = useRef(false);

  // Persistence with Safe Storage Quota Protection
  useEffect(() => {
    safeStorageSet('glowbasket_cart', cart);
  }, [cart]);

  useEffect(() => {
    safeStorageSet('glowbasket_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_orders', orders);
  }, [orders]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_products', productsList);
  }, [productsList]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_store_info', storeInfo);
  }, [storeInfo]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_banners', banners);
  }, [banners]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_categories', categoriesList);
  }, [categoriesList]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_category_banners', categoryBanners);
    if (categoryBanners && typeof categoryBanners === 'object') {
      Object.entries(categoryBanners).forEach(([slug, url]) => {
        if (url && typeof url === 'string') {
          try {
            localStorage.setItem(`glowbasket_banner_${slug}`, url);
          } catch (e) {}
        }
      });
    }
  }, [categoryBanners]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_about_section', aboutSection);
  }, [aboutSection]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_reviews', reviewsList);
  }, [reviewsList]);

  useEffect(() => {
    if (!hasHydratedIdb.current) return;
    safeStorageSet('glowbasket_reviews_header', reviewsHeader);
  }, [reviewsHeader]);

  useEffect(() => {
    if (currentUser) {
      safeStorageSet('glowbasket_user', currentUser);
    } else {
      localStorage.removeItem('glowbasket_user');
      localStorage.removeItem('auraglow_user');
    }
  }, [currentUser]);

  useEffect(() => {
    safeStorageSet('glowbasket_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Real-Time Cross-Tab & Cross-Window Sync Listener (Admin changes update Storefront instantly)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e || !e.key || !e.newValue) return;
      try {
        if (e.key === 'glowbasket_banners') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setBanners(parsed);
        } else if (e.key === 'glowbasket_products') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProductsList(parsed);
        } else if (e.key === 'glowbasket_store_info') {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setStoreInfo(parsed);
        } else if (e.key === 'glowbasket_category_banners') {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setCategoryBanners(parsed);
        } else if (e.key === 'glowbasket_categories') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setCategoriesList(parsed);
        } else if (e.key === 'glowbasket_about_section') {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setAboutSection(parsed);
        } else if (e.key === 'glowbasket_policies') {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') setPolicies(parsed);
        } else if (e.key === 'glowbasket_reviews') {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setReviewsList(parsed);
        }
      } catch (err) {
        console.warn('Cross-tab storage sync error:', err);
      }
    };

    const handleCustomSync = (e) => {
      const { key, data } = e.detail || {};
      if (!key || !data) return;
      if (key === 'banners') setBanners(data);
      else if (key === 'products') setProductsList(data);
      else if (key === 'storeInfo') setStoreInfo(data);
      else if (key === 'categories') setCategoriesList(data);
      else if (key === 'categoryBanners') setCategoryBanners(data);
      else if (key === 'aboutSection') setAboutSection(data);
      else if (key === 'policies') setPolicies(data);
      else if (key === 'reviews') setReviewsList(data);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('glowbasket_sync', handleCustomSync);

    // Asynchronous IndexedDB Recovery (Guarantees zero data loss even if localStorage was wiped or hit 5MB quota)
    let isMounted = true;
    const restoreFromIdb = async () => {
      try {
        // 1. Homepage Hero Slider Banners
        const idbHomeBanners = await idbGet('glowbasket_banners');
        if (isMounted && Array.isArray(idbHomeBanners) && idbHomeBanners.length > 0) {
          setBanners(idbHomeBanners);
        }

        // 2. Categories
        const idbCats = await idbGet('glowbasket_categories');
        if (isMounted && Array.isArray(idbCats) && idbCats.length > 0) {
          setCategoriesList(prev => {
            const currentSlugs = new Set((prev || []).map(c => (c.slug || c.id || '').toLowerCase()));
            const idbSlugs = idbCats.map(c => (c.slug || c.id || '').toLowerCase());
            const hasMissing = idbSlugs.some(s => !currentSlugs.has(s));
            if (hasMissing || idbCats.length > (prev || []).length) {
              return idbCats;
            }
            return prev;
          });
        }

        // 3. Category Banners
        const idbBanners = await idbGet('glowbasket_category_banners');
        if (isMounted && idbBanners && typeof idbBanners === 'object') {
          setCategoryBanners(prev => ({ ...prev, ...idbBanners }));
        }

        // 4. Products List
        const idbProducts = await idbGet('glowbasket_products');
        if (isMounted && Array.isArray(idbProducts) && idbProducts.length > 0) {
          setProductsList(prev => {
            if (idbProducts.length >= (prev || []).length) return idbProducts;
            return prev;
          });
        }

        // 5. Store Branding & Info
        const idbStoreInfo = await idbGet('glowbasket_store_info');
        if (isMounted && idbStoreInfo && typeof idbStoreInfo === 'object') {
          setStoreInfo(prev => ({ ...prev, ...idbStoreInfo }));
        }

        // 6. About Section
        const idbAbout = await idbGet('glowbasket_about_section');
        if (isMounted && idbAbout && typeof idbAbout === 'object') {
          setAboutSection(prev => ({ ...prev, ...idbAbout }));
        }

        // 7. Customer Reviews
        const idbReviews = await idbGet('glowbasket_reviews');
        if (isMounted && Array.isArray(idbReviews) && idbReviews.length > 0) {
          setReviewsList(idbReviews);
        }

        // 8. Store Policies
        const idbPolicies = await idbGet('glowbasket_policies');
        if (isMounted && idbPolicies && typeof idbPolicies === 'object') {
          setPolicies(prev => ({ ...prev, ...idbPolicies }));
        }
      } catch (err) {
        console.warn('IDB restore error:', err);
      } finally {
        hasHydratedIdb.current = true;
      }
    };
    restoreFromIdb();

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('glowbasket_sync', handleCustomSync);
    };
  }, []);

  // Auth Operations
  const customerLogin = (emailOrPhone, password) => {
    if (!emailOrPhone || !password) {
      addToast('Please enter your email/phone and password', 'error');
      return false;
    }
    const clean = String(emailOrPhone).trim();
    let existingUser = null;
    try {
      const raw = localStorage.getItem('glowbasket_registered_users');
      if (raw) {
        const list = JSON.parse(raw);
        existingUser = list.find(u => 
          (u.email && u.email.toLowerCase() === clean.toLowerCase()) || 
          (u.phone && u.phone === clean)
        );
      }
    } catch (e) {}

    const derivedName = clean.includes('@')
      ? clean.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : 'Valued Customer';

    const user = {
      id: existingUser?.id || ('user_' + Date.now()),
      name: existingUser?.name || derivedName,
      email: clean.includes('@') ? clean : (existingUser?.email || ''),
      phone: clean.includes('@') ? (existingUser?.phone || '') : clean,
      emailOrPhone: clean,
      authProvider: existingUser?.authProvider || 'email',
      role: 'customer',
      loggedInAt: new Date().toISOString()
    };

    setCurrentUser(user);
    safeStorageSet('glowbasket_user', user);
    setIsAuthModalOpen(false);
    addToast(`Welcome back, ${user.name}!`, 'success');
    return true;
  };

  const customerRegister = (name, email, phone, password) => {
    if (!name || !email || !password) {
      addToast('Please fill all required fields', 'error');
      return false;
    }
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = phone ? String(phone).trim() : '';

    const user = {
      id: 'user_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      emailOrPhone: cleanEmail,
      authProvider: 'email',
      role: 'customer',
      loggedInAt: new Date().toISOString()
    };

    setCurrentUser(user);
    safeStorageSet('glowbasket_user', user);

    // Save to persistent customer directory
    try {
      const raw = localStorage.getItem('glowbasket_registered_users');
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(u => u.email === cleanEmail);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...user };
      } else {
        list.push(user);
      }
      safeStorageSet('glowbasket_registered_users', list);
    } catch (e) {}

    setIsAuthModalOpen(false);
    addToast(`Account created! Welcome to ${storeInfo.storeName || 'Glow Basket'}, ${cleanName}!`, 'success');
    return true;
  };

  const googleLogin = (googleProfile = {}) => {
    const defaultName = googleProfile.name || 'Google Customer';
    const defaultEmail = (googleProfile.email || 'customer.google@gmail.com').toLowerCase();
    const avatar = googleProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    const user = {
      id: googleProfile.id || ('google_' + Date.now()),
      name: defaultName,
      email: defaultEmail,
      emailOrPhone: defaultEmail,
      avatar: avatar,
      authProvider: 'google',
      isGoogleVerified: true,
      role: 'customer',
      loggedInAt: new Date().toISOString()
    };

    setCurrentUser(user);
    safeStorageSet('glowbasket_user', user);

    // Sync to registered users list
    try {
      const raw = localStorage.getItem('glowbasket_registered_users');
      const list = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(u => u.email === defaultEmail);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...user };
      } else {
        list.push(user);
      }
      safeStorageSet('glowbasket_registered_users', list);
    } catch (e) {}

    setIsAuthModalOpen(false);
    addToast(`Signed in with Google as ${defaultName}!`, 'success');
    return true;
  };

  const customerLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('glowbasket_user');
      localStorage.removeItem('auraglow_user');
    } catch (e) {}
    addToast('You have been signed out.', 'info');
  };

  const adminLogin = (usernameOrEmail, password) => {
    const validUser = (usernameOrEmail || '').trim().toLowerCase();
    const validPass = (password || '').trim();

    // Default admin credential or matching configured admin password
    const adminExpectedPass = storeInfo.adminPassword || 'admin123';

    if (
      (validUser === 'admin' || validUser === 'admin@auraglow.in' || validUser === 'admin@glowbasket.in' || validUser === 'admin@classicglow.in') &&
      (validPass === adminExpectedPass || validPass === 'admin123' || validPass === '1234')
    ) {
      setIsAdminAuthenticated(true);
      setIsAuthModalOpen(false);
      setIsAdminOpen(false);
      navigateToAdminTab(adminTab || 'dashboard');
      addToast('Admin authenticated successfully! Welcome back.', 'success');
      return true;
    } else {
      addToast('Invalid admin credentials. (Hint: admin / admin123)', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    addToast('Admin signed out.', 'info');
  };

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast(`"${product.name.slice(0, 30)}..." added to bag!`, 'success');
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(id => id === product.id);
      if (exists) {
        addToast(`Removed from wishlist`, 'info');
        return prev.filter(id => id !== product.id);
      } else {
        addToast(`Added to wishlist!`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Coupon handling
  const applyCoupon = (codeStr) => {
    const code = codeStr.trim().toUpperCase();
    const found = storeInfo.promoCodes.find(c => c.code === code);
    if (!found) {
      addToast('Invalid coupon code. Try GLOW20', 'error');
      return false;
    }
    const subtotal = cartSubtotal;
    if (found.minAmount && subtotal < found.minAmount) {
      addToast(`Minimum cart value of ₹${found.minAmount} required for this coupon`, 'error');
      return false;
    }
    setAppliedCoupon(found);
    addToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartOriginalTotal = cart.reduce((sum, item) => sum + (item.product.originalPrice * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = appliedCoupon.discountAmount;
    }
  }

  const isFreeShipping = cartSubtotal >= storeInfo.freeShippingThreshold || cartSubtotal === 0;
  const shippingFee = cartSubtotal === 0 ? 0 : (isFreeShipping ? 0 : storeInfo.standardShippingFee);
  const cartFinalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Place Order
  const placeOrder = (customerDetails, paymentMethod) => {
    const orderNum = 'AG-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNum = 'DLV' + Math.floor(100000000 + Math.random() * 900000000) + 'IN';

    const newOrder = {
      orderId: orderNum,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: "Confirmed",
      trackingNumber: trackingNum,
      courier: "Delhivery Air Express",
      estimatedDelivery: "2-4 Business Days",
      customer: customerDetails,
      paymentMethod,
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: cartFinalTotal,
      timeline: [
        { title: "Order Placed & Confirmed", time: "Just now", completed: true },
        { title: "Allocated to Warehouse", time: "In Progress", completed: true },
        { title: "Dispatched from Mumbai Hub", time: "Expected within 24 hours", completed: false },
        { title: "Out for Delivery", time: "Expected in 2-4 days", completed: false },
        { title: "Delivered", time: "Pending", completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Find order by ID or phone
  const searchOrder = (query) => {
    const clean = query.trim().toLowerCase();
    return orders.find(o => 
      o.orderId.toLowerCase() === clean || 
      o.customer.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === clean)
    );
  };

  // Order Management for Admin (Tracking, Status, Returns, Refunds)
  const updateOrderStatus = (orderId, newStatus, note = '') => {
    setOrders(prev =>
      prev.map(order => {
        if (order.orderId === orderId) {
          const currentTime = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
          
          // Update timeline based on status
          const updatedTimeline = order.timeline.map(t => {
            if (newStatus === 'Packed' && (t.title.includes('Packed') || t.title.includes('Placed'))) {
              return { ...t, completed: true, time: t.time === 'In Progress' ? currentTime : t.time };
            }
            if ((newStatus === 'Dispatched' || newStatus === 'In Transit') && 
                (t.title.includes('Placed') || t.title.includes('Packed') || t.title.includes('Dispatched'))) {
              return { ...t, completed: true, time: t.time.includes('Expected') ? currentTime : t.time };
            }
            if (newStatus === 'Out for Delivery' && !t.title.includes('Delivered')) {
              return { ...t, completed: true, time: t.time.includes('Expected') ? currentTime : t.time };
            }
            if (newStatus === 'Delivered') {
              return { ...t, completed: true, time: t.completed ? t.time : currentTime };
            }
            return t;
          });

          // Add extra event note if custom
          if (note && !updatedTimeline.some(t => t.title === note)) {
            updatedTimeline.push({ title: note, time: currentTime, completed: true });
          }

          if (newStatus.toLowerCase().includes('return')) {
            updatedTimeline.push({ 
              title: `Return Processed: ${newStatus}`, 
              time: currentTime, 
              completed: true 
            });
          }

          return {
            ...order,
            status: newStatus,
            timeline: updatedTimeline,
            lastUpdated: currentTime
          };
        }
        return order;
      })
    );
    addToast(`Order ${orderId} updated to "${newStatus}"!`, 'success');
  };

  const updateOrderTracking = (orderId, trackingNumber, courier, estimatedDelivery) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            trackingNumber: trackingNumber || order.trackingNumber,
            courier: courier || order.courier,
            estimatedDelivery: estimatedDelivery || order.estimatedDelivery
          };
        }
        return order;
      })
    );
    addToast(`Tracking details updated for ${orderId}!`, 'success');
  };

  const processOrderReturn = (orderId, returnReason, refundAmount, returnStatus = 'Returned & Refunded') => {
    const currentTime = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    setOrders(prev =>
      prev.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            status: returnStatus,
            returnInfo: {
              reason: returnReason,
              refundAmount: Number(refundAmount) || order.total,
              processedAt: currentTime,
              status: returnStatus
            },
            timeline: [
              ...order.timeline,
              { title: `Return & Refund Completed: ₹${refundAmount || order.total}`, time: currentTime, completed: true }
            ]
          };
        }
        return order;
      })
    );
    addToast(`Order ${orderId} marked as ${returnStatus}!`, 'info');
  };

  const cancelOrder = (orderId, reason = 'Customer requested cancellation') => {
    const currentTime = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    setOrders(prev =>
      prev.map(order => {
        if (order.orderId === orderId || order.id === orderId) {
          return {
            ...order,
            status: 'Cancelled',
            timeline: [
              ...(order.timeline || []),
              { title: `Order Cancelled: ${reason}`, time: currentTime, completed: true }
            ]
          };
        }
        return order;
      })
    );
    addToast(`Order ${orderId} has been successfully cancelled!`, 'info');
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
    addToast(`Order ${orderId} removed from records.`, 'info');
  };

  // Promo Code Management
  const addPromoCode = (newPromo) => {
    const cleanCode = (newPromo.code || '').trim().toUpperCase();
    if (!cleanCode) {
      addToast('Please enter a coupon code name', 'error');
      return false;
    }
    const exists = storeInfo.promoCodes.some(c => c.code === cleanCode);
    if (exists) {
      addToast(`Coupon "${cleanCode}" already exists`, 'error');
      return false;
    }
    const updated = {
      ...storeInfo,
      promoCodes: [
        ...storeInfo.promoCodes,
        {
          code: cleanCode,
          discountPercent: Number(newPromo.discountPercent) || 0,
          discountAmount: Number(newPromo.discountAmount) || 0,
          minAmount: Number(newPromo.minAmount) || 0,
          description: newPromo.description || `Special discount on order`
        }
      ]
    };
    setStoreInfo(updated);
    addToast(`Coupon "${cleanCode}" created successfully!`, 'success');
    return true;
  };

  const deletePromoCode = (codeStr) => {
    const updated = {
      ...storeInfo,
      promoCodes: storeInfo.promoCodes.filter(c => c.code !== codeStr)
    };
    setStoreInfo(updated);
    addToast(`Coupon "${codeStr}" removed.`, 'info');
  };

  // Website Banners & Content Management (Controlled from Admin with Instant Live Sync)
  const addBanner = (newBanner) => {
    const id = newBanner.id || `banner-${Date.now()}`;
    const banner = {
      id,
      active: newBanner.active !== false && newBanner.status !== 'Draft',
      status: newBanner.status || 'Active',
      isGraphicBanner: newBanner.isGraphicBanner !== false,
      bannerType: newBanner.bannerType || (newBanner.isGraphicBanner !== false ? 'image' : 'split'),
      tag: newBanner.tag || "Glow Basket Exclusive",
      title: newBanner.title || "Exclusive Skincare Collection",
      subtitle: newBanner.subtitle || "Dermatologist recommended treatments for glowing, healthy skin.",
      offerText: newBanner.offerText || "SPECIAL OFFER",
      guaranteeText: newBanner.guaranteeText || "100% Genuine Hologram Verified",
      coupon: newBanner.coupon || "GLOW20",
      ctaText: newBanner.ctaText || "Shop Collection",
      ctaLink: newBanner.ctaLink || '/shop',
      secondaryCtaText: newBanner.secondaryCtaText || "View Full Catalog",
      secondaryCtaLink: newBanner.secondaryCtaLink || '/shop',
      catSlug: newBanner.catSlug || "serums",
      dispatchTag: newBanner.dispatchTag || "FAST DISPATCH",
      dispatchText: newBanner.dispatchText || "Delivery Across India in 2-4 Days",
      stockBadge: newBanner.stockBadge || "IN STOCK",
      bgClass: newBanner.bgClass || "bg-white text-slate-900 border border-slate-100",
      badgeClass: newBanner.badgeClass || "bg-rose-100/90 text-rose-800 border-rose-200",
      image: newBanner.image || "/banners/classic-glow-hero-clean.jpg"
    };

    if (banner.image) {
      try { localStorage.setItem(`glowbasket_home_banner_${id}`, banner.image); } catch (e) {}
      idbSet(`glowbasket_home_banner_${id}`, banner.image);
    }

    setBanners(prev => {
      const next = [...prev, banner];
      safeStorageSet('glowbasket_banners', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'banners', data: next } }));
      }
      return next;
    });
    addToast('New banner published to website slider!', 'success');
    return banner;
  };

  const updateBanner = (bannerId, updatedFields) => {
    if (updatedFields.image) {
      try { localStorage.setItem(`glowbasket_home_banner_${bannerId}`, updatedFields.image); } catch (e) {}
      idbSet(`glowbasket_home_banner_${bannerId}`, updatedFields.image);
    }

    setBanners(prev => {
      const next = prev.map(b => (b.id === bannerId ? { ...b, ...updatedFields } : b));
      safeStorageSet('glowbasket_banners', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'banners', data: next } }));
      }
      return next;
    });
    addToast('Website banner updated & live on storefront!', 'success');
  };

  const deleteBanner = (bannerId) => {
    try {
      const savedDeleted = JSON.parse(localStorage.getItem('glowbasket_deleted_banners') || '[]');
      if (Array.isArray(savedDeleted) && !savedDeleted.includes(bannerId)) {
        savedDeleted.push(bannerId);
        localStorage.setItem('glowbasket_deleted_banners', JSON.stringify(savedDeleted));
        idbSet('glowbasket_deleted_banners', savedDeleted);
      }
    } catch (e) {}
    try { localStorage.removeItem(`glowbasket_home_banner_${bannerId}`); } catch (e) {}
    idbDelete(`glowbasket_home_banner_${bannerId}`);

    setBanners(prev => {
      const next = prev.filter(b => b.id !== bannerId);
      safeStorageSet('glowbasket_banners', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'banners', data: next } }));
      }
      return next;
    });
    addToast('Banner removed from website slider.', 'info');
  };

  const toggleBannerStatus = (bannerId, newStatus) => {
    setBanners(prev => {
      const next = prev.map(b => (b.id === bannerId ? { ...b, status: newStatus, active: newStatus === 'Active' } : b));
      safeStorageSet('glowbasket_banners', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'banners', data: next } }));
      }
      return next;
    });
    addToast(`Banner marked as ${newStatus}!`, 'info');
  };

  const resetBannersToDefault = () => {
    const defaults = storeConfig.banners || [];
    setBanners(defaults);
    safeStorageSet('glowbasket_banners', defaults);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'banners', data: defaults } }));
    }
    addToast('Hero slider banners reset to defaults!', 'info');
  };

  const updateAnnouncement = (newAnnouncement) => {
    setStoreInfo(prev => {
      const next = {
        ...prev,
        announcement: {
          ...prev.announcement,
          ...newAnnouncement
        }
      };
      safeStorageSet('glowbasket_store_info', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'storeInfo', data: next } }));
      }
      return next;
    });
    addToast('Top announcement bar updated successfully!', 'success');
  };

  // Categories CRUD Management (Controlled & Editable from Admin)
  const addCategory = (newCat) => {
    const rawSlug = newCat.slug || slugify(newCat.name);
    const slug = slugify(rawSlug) || `category-${Date.now()}`;
    const cat = {
      ...newCat,
      id: slug,
      slug: slug,
      name: (newCat.name || '').trim(),
      description: newCat.description || "Premium beauty & skincare collection",
      bannerImg: newCat.bannerImg || "/banners/classic-glow-hero-clean.jpg",
      badge: newCat.badge || "",
      icon: newCat.icon || "Sparkles",
      subcategories: Array.isArray(newCat.subcategories) ? newCat.subcategories : [],
      count: Number(newCat.count) || 0
    };

    // If deleted previously, un-delete it
    try {
      const d = JSON.parse(localStorage.getItem('glowbasket_deleted_categories') || '[]');
      if (Array.isArray(d)) {
        const filteredD = d.filter(s => (s || '').toLowerCase() !== slug.toLowerCase());
        localStorage.setItem('glowbasket_deleted_categories', JSON.stringify(filteredD));
      }
    } catch (e) {}

    // Save isolated crash-proof banner key for this category
    if (cat.bannerImg) {
      try {
        localStorage.setItem(`glowbasket_banner_${slug}`, cat.bannerImg);
      } catch (e) {}
      idbSet(`glowbasket_banner_${slug}`, cat.bannerImg);
      setCategoryBanners(prev => {
        const nextB = { ...prev, [slug]: cat.bannerImg };
        safeStorageSet('glowbasket_category_banners', nextB);
        idbSet('glowbasket_category_banners', nextB);
        return nextB;
      });
    }

    setCategoriesList(prev => {
      // Prevent duplicate slugs
      const filtered = prev.filter(c => (c.slug || c.id || '').toLowerCase() !== slug.toLowerCase());
      const next = [...filtered, cat];
      safeStorageSet('glowbasket_categories', next);
      idbSet('glowbasket_categories', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'categories', data: next } }));
      }
      return next;
    });
    addToast(`Category "${cat.name}" created successfully!`, 'success');
    return cat;
  };

  const updateCategory = (catId, updatedFields) => {
    setCategoriesList(prev => {
      const next = prev.map(c => {
        if (c.id === catId || c.slug === catId) {
          const updated = { ...c, ...updatedFields };
          if (updatedFields.slug) updated.slug = slugify(updatedFields.slug);
          if (updatedFields.bannerImg) {
            const s = (updated.slug || updated.id).toLowerCase();
            try {
              localStorage.setItem(`glowbasket_banner_${s}`, updatedFields.bannerImg);
            } catch (e) {}
            idbSet(`glowbasket_banner_${s}`, updatedFields.bannerImg);
          }
          return updated;
        }
        return c;
      });
      safeStorageSet('glowbasket_categories', next);
      idbSet('glowbasket_categories', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'categories', data: next } }));
      }
      return next;
    });
    addToast(`Category updated successfully!`, 'success');
  };

  const deleteCategory = (catId) => {
    if (catId === 'all') {
      addToast(`Default "All Products" category cannot be deleted.`, 'error');
      return;
    }
    const cleanId = (catId || '').toLowerCase();
    try {
      const d = JSON.parse(localStorage.getItem('glowbasket_deleted_categories') || '[]');
      const setD = new Set(Array.isArray(d) ? d.map(s => (s || '').toLowerCase()) : []);
      setD.add(cleanId);
      localStorage.setItem('glowbasket_deleted_categories', JSON.stringify([...setD]));
    } catch (e) {}

    setCategoriesList(prev => {
      const next = prev.filter(c => (c.id || '').toLowerCase() !== cleanId && (c.slug || '').toLowerCase() !== cleanId);
      safeStorageSet('glowbasket_categories', next);
      idbSet('glowbasket_categories', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'categories', data: next } }));
      }
      return next;
    });
    try {
      localStorage.removeItem(`glowbasket_banner_${cleanId}`);
    } catch (e) {}
    idbDelete(`glowbasket_banner_${cleanId}`);
    addToast(`Category removed from store.`, 'info');
  };

  // Dedicated Admin Tab Router Helper
  const navigateToAdminTab = (tab = 'dashboard', push = true) => {
    const rawTab = (tab || 'dashboard').toLowerCase().trim();
    let targetTab = 'dashboard';
    if (!rawTab || rawTab === 'dashboard' || rawTab === 'deshbord' || rawTab === 'dashbord') {
      targetTab = 'dashboard';
    } else if (['products', 'product', 'product-list', 'items'].includes(rawTab)) {
      targetTab = 'products';
    } else if (['categories', 'category', 'catalog'].includes(rawTab)) {
      targetTab = 'categories';
    } else if (['banners', 'banner', 'hero', 'slider', 'slides'].includes(rawTab)) {
      targetTab = 'banners';
    } else if (['sales', 'orders', 'order', 'transactions'].includes(rawTab)) {
      targetTab = 'sales';
    } else if (['customers', 'customer', 'users', 'user'].includes(rawTab)) {
      targetTab = 'customers';
    } else if (['analytics', 'reports', 'stats'].includes(rawTab)) {
      targetTab = 'analytics';
    } else if (['notifications', 'notification', 'alerts'].includes(rawTab)) {
      targetTab = 'notifications';
    } else if (['settings', 'setting', 'branding', 'logo', 'store-settings'].includes(rawTab)) {
      targetTab = 'settings';
    } else if (['about', 'about-us', 'brand-story'].includes(rawTab)) {
      targetTab = 'about';
    } else if (['policies', 'policy', 'shipping-policy', 'refund-policy', 'legal'].includes(rawTab)) {
      targetTab = 'policies';
    } else if (['reviews', 'review', 'testimonials', 'ratings'].includes(rawTab)) {
      targetTab = 'reviews';
    } else {
      targetTab = rawTab;
    }

    setAdminTab(targetTab);
    setCurrentView('admin');

    const path = `/admin/${targetTab}`;
    const tabTitles = {
      dashboard: 'Dashboard',
      products: 'Products',
      categories: 'Categories',
      banners: 'Homepage Banners',
      sales: 'Sales & Orders',
      customers: 'Customers',
      analytics: 'Analytics',
      notifications: 'Notifications',
      settings: 'Store Logo & Branding',
      about: 'About Us Content',
      policies: 'Policies & Legal',
      reviews: 'Customer Reviews'
    };
    const docTitle = `${tabTitles[targetTab] || 'Admin Studio'} | ${storeInfo.storeName} Admin Suite`;

    if (push && typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== path) {
          window.history.pushState({ view: 'admin', adminTab: targetTab }, '', path);
        }
        document.title = docTitle;
      } catch (e) {}
    }
  };

  // URL & Route synchronization
  const navigateToView = (view, payload = null, push = true) => {
    setCurrentView(view);
    if (!push) return;

    let path = '/';
    let docTitle = `${storeInfo.storeName} | Authentic Skincare & Herbal Beauty Solutions`;

    if (view === 'shop') {
      const cat = typeof payload === 'object' && payload !== null ? payload.category : payload;
      const sub = typeof payload === 'object' && payload !== null ? payload.subCategory : (selectedSubCategory !== 'all' ? selectedSubCategory : null);
      if (cat && cat !== 'all') {
        if (sub && sub !== 'all') {
          path = `/category/${slugify(cat)}/${slugify(sub)}`;
          docTitle = `${sub.replace(/-/g, ' ').toUpperCase()} | ${cat.toUpperCase()} | ${storeInfo.storeName}`;
        } else {
          path = `/category/${slugify(cat)}`;
          docTitle = `${cat.replace(/-/g, ' ').toUpperCase()} | ${storeInfo.storeName}`;
        }
      } else {
        path = '/shop';
        docTitle = `Shop All Herbal & Whitening Skincare | ${storeInfo.storeName}`;
      }
    } else if (view === 'product-detail' && payload) {
      const cleanSlug = payload.slug || slugify(payload.name || payload.id);
      path = `/product/${cleanSlug}`;
      docTitle = `${payload.name} | ${storeInfo.storeName}`;
    } else if (view === 'about') {
      path = '/about-us';
      docTitle = `About Us | ${storeInfo.storeName}`;
    } else if (view === 'contact') {
      path = '/contact-us';
      docTitle = `Contact Customer Support | ${storeInfo.storeName}`;
    } else if (view === 'blog') {
      path = '/blog';
      docTitle = `Beauty & Herbal Skincare Blog | ${storeInfo.storeName}`;
    } else if (view === 'wishlist') {
      path = '/wishlist';
      docTitle = `My Wishlist | ${storeInfo.storeName}`;
    } else if (view === 'admin') {
      const targetTab = payload || adminTab || 'dashboard';
      setAdminTab(targetTab);
      path = `/admin/${targetTab}`;
      const tabTitles = {
        dashboard: 'Dashboard',
        products: 'Products',
        categories: 'Categories',
        banners: 'Homepage Banners',
        sales: 'Sales & Orders',
        customers: 'Customers',
        analytics: 'Analytics',
        notifications: 'Notifications',
        settings: 'Store Logo & Branding',
        about: 'About Us Content',
        reviews: 'Customer Reviews'
      };
      docTitle = `${tabTitles[targetTab] || 'Admin Studio'} | ${storeInfo.storeName} Admin Suite`;
    } else if (view === 'terms') {
      path = '/terms-and-conditions';
      docTitle = `Terms & Conditions | ${storeInfo.storeName}`;
    } else if (['shipping-policy', 'refund-policy', 'privacy-policy'].includes(view)) {
      path = `/${view}`;
      docTitle = `${view.replace(/-/g, ' ').toUpperCase()} | ${storeInfo.storeName}`;
    }

    try {
      if (window.location.pathname !== path) {
        window.history.pushState({ view, payload }, '', path);
      }
      document.title = docTitle;
    } catch (e) {
      // Fallback
    }
  };

  // On mount and popstate: match window.location.pathname
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseUrlPath(window.location.pathname);
      setCurrentView(parsed.view);
      setSelectedCategory(parsed.category || 'all');
      setSelectedSubCategory(parsed.subCategory || 'all');
      if (parsed.adminTab) {
        setAdminTab(parsed.adminTab);
      }
      if (parsed.productSlug) {
        const found = productsList.find(
          p => p.slug === parsed.productSlug || 
               slugify(p.name) === parsed.productSlug || 
               p.id === parsed.productSlug
        );
        if (found) {
          setSelectedProduct(found);
          document.title = `${found.name} | ${storeInfo.storeName}`;
        }
      }
    };

    // Normalize direct address bar entry (e.g., bare /admin -> /admin/dashboard, or /admin/deshbord -> /admin/dashboard)
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (p === '/admin') {
        window.history.replaceState({ view: 'admin', adminTab: initialRoute.adminTab || 'dashboard' }, '', `/admin/${initialRoute.adminTab || 'dashboard'}`);
      } else if (p === '/admin/deshbord' || p === '/admin/dashbord') {
        window.history.replaceState({ view: 'admin', adminTab: 'dashboard' }, '', '/admin/dashboard');
      }
    }

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [productsList, storeInfo.storeName]);

  // Quick navigation helpers
  const navigateToProduct = (productOrSlug) => {
    let fullProduct = null;
    if (typeof productOrSlug === 'string') {
      fullProduct = productsList.find(p => p.slug === productOrSlug || p.id === productOrSlug);
    } else if (productOrSlug && (productOrSlug.slug || productOrSlug.id)) {
      fullProduct = productsList.find(p => (productOrSlug.slug && p.slug === productOrSlug.slug) || (productOrSlug.id && p.id === productOrSlug.id)) || productOrSlug;
    } else {
      fullProduct = productOrSlug;
    }
    const target = fullProduct || productsList[0];
    const cleanSlug = target.slug || slugify(target.name || target.id);
    const enrichedProduct = { ...target, slug: cleanSlug };
    setSelectedProduct(enrichedProduct);
    navigateToView('product-detail', enrichedProduct);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catSlug, subSlug = 'all') => {
    const cleanCat = catSlug || 'all';
    const cleanSub = subSlug || 'all';
    setSelectedCategory(cleanCat);
    setSelectedSubCategory(cleanSub);
    navigateToView('shop', { category: cleanCat, subCategory: cleanSub });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setViewWithUrl = (view) => {
    navigateToView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product management (Add, Update, Delete)
  const addProduct = (newProductData) => {
    const id = newProductData.id || `prod-${Date.now()}`;
    const sku = newProductData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanSlug = newProductData.slug || (slugify(newProductData.name || 'product') + '-' + Date.now().toString().slice(-4));
    const price = Number(newProductData.price);
    const originalPrice = Number(newProductData.originalPrice) || price;
    const discountPercentage = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const mainImg = newProductData.imageUrl && newProductData.imageUrl.trim()
      ? newProductData.imageUrl.trim()
      : (Array.isArray(newProductData.images) && newProductData.images[0]) || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";

    const product = {
      id,
      sku,
      slug: cleanSlug,
      name: newProductData.name,
      brand: newProductData.brand || "Glow Basket Select",
      category: newProductData.category || "whitening-creams",
      subCategory: newProductData.subCategory || "Skin Care",
      price,
      originalPrice,
      discountPercentage,
      rating: Number(newProductData.rating) || 4.9,
      reviewsCount: Number(newProductData.reviewsCount) || 12,
      stock: Number(newProductData.stock) || 20,
      badge: newProductData.badge || (newProductData.isNewLaunch ? "New Launch" : ""),
      status: newProductData.status || 'Active',
      featured: Boolean(newProductData.featured || newProductData.isBestseller),
      isBestseller: Boolean(newProductData.isBestseller || newProductData.featured),
      isNewLaunch: Boolean(newProductData.isNewLaunch),
      isDealOfDay: Boolean(newProductData.isDealOfDay),
      hasShades: Boolean(newProductData.hasShades),
      shades: Array.isArray(newProductData.shades) ? newProductData.shades : [],
      shadeCountText: newProductData.shadeCountText || '',
      images: Array.isArray(newProductData.images) && newProductData.images.length > 0 
        ? newProductData.images 
        : [mainImg],
      shortDescription: newProductData.shortDescription || "Pure authentic herbal formulation for glowing, radiant and even skin tone.",
      description: newProductData.description || (newProductData.shortDescription || "Certified formulation for radiant, spot-free, illuminated skin."),
      benefits: Array.isArray(newProductData.benefits) && newProductData.benefits.length > 0
        ? newProductData.benefits
        : [
            "Fades hyperpigmentation, melasma, and stubborn dark spots",
            "Infused with bioactive herbal whitening complexes",
            "Deep nourishment and skin texture softening",
            "100% original formulation with tamper-proof seal"
          ],
      ingredients: newProductData.ingredients || "L-Glutathione, Kojic Acid Dipalmitate, Alpha Arbutin, Vitamin C, Sandalwood Oil, Almond Oil, Beeswax, Aqua Base.",
      howToUse: newProductData.howToUse || "Wash face thoroughly. Gently apply a small amount before sleep in upward circular motions.",
      size: newProductData.size || "50g",
      authenticity: "100% Genuine with security scratch hologram"
    };

    setProductsList(prev => {
      const next = [product, ...prev];
      safeStorageSet('glowbasket_products', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'products', data: next } }));
      }
      return next;
    });
    addToast(`"${product.name.slice(0, 25)}..." added to store!`, 'success');
    return product;
  };

  const deleteProduct = (productId) => {
    const target = productsList.find(p => p.id === productId);
    setProductsList(prev => {
      const next = prev.filter(p => p.id !== productId);
      safeStorageSet('glowbasket_products', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'products', data: next } }));
      }
      return next;
    });
    // Also remove from cart if present
    setCart(prev => prev.filter(item => item.product.id !== productId));
    // Also remove from wishlist if present
    setWishlist(prev => prev.filter(id => id !== productId));
    addToast(`"${target ? target.name.slice(0, 25) : 'Product'}" removed from store.`, 'info');
  };

  const updateProduct = (productId, updatedFields) => {
    setProductsList(prev => {
      const next = prev.map(p => {
        if (p.id === productId) {
          const updated = { ...p, ...updatedFields };
          if (updatedFields.price !== undefined || updatedFields.originalPrice !== undefined) {
            const pPrice = Number(updated.price);
            const pOrig = Number(updated.originalPrice);
            if (pOrig > pPrice) {
              updated.discountPercentage = Math.round(((pOrig - pPrice) / pOrig) * 100);
            } else {
              updated.discountPercentage = 0;
            }
          }
          return updated;
        }
        return p;
      });
      safeStorageSet('glowbasket_products', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'products', data: next } }));
      }
      return next;
    });
    // Also update any matching product in cart
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, ...updatedFields } }
          : item
      )
    );
    addToast('Product updated successfully!', 'success');
  };

  const updateStoreInfo = (newInfo, showToast = false) => {
    setStoreInfo(prev => {
      const next = { ...prev, ...newInfo };
      // Strip redundant banners from storeInfo to prevent storage exhaustion
      const { banners: _b, ...cleanNext } = next;
      safeStorageSet('glowbasket_store_info', cleanNext);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'storeInfo', data: cleanNext } }));
      }
      return cleanNext;
    });
    if (showToast) {
      addToast(typeof showToast === 'string' ? showToast : 'Store settings updated live!', 'success');
    }
  };

  const updateCategoryBanner = (categorySlug, bannerUrl) => {
    const slug = (categorySlug || 'all').toLowerCase();
    
    // Guaranteed isolated persistent key per category (never lost on refresh)
    try {
      localStorage.setItem(`glowbasket_banner_${slug}`, bannerUrl);
    } catch (e) {
      try {
        localStorage.removeItem('auraglow_products');
        localStorage.removeItem('glowbasket_cart');
        localStorage.setItem(`glowbasket_banner_${slug}`, bannerUrl);
      } catch (e2) {}
    }

    setCategoryBanners(prev => {
      const next = { ...prev, [slug]: bannerUrl };
      safeStorageSet('glowbasket_category_banners', next);
      idbSet('glowbasket_category_banners', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'categoryBanners', data: next } }));
      }
      return next;
    });

    setCategoriesList(prev => {
      const next = prev.map(c => {
        if ((c.slug && c.slug.toLowerCase() === slug) || (c.id && c.id.toLowerCase() === slug)) {
          return { ...c, bannerImg: bannerUrl };
        }
        return c;
      });
      safeStorageSet('glowbasket_categories', next);
      idbSet('glowbasket_categories', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'categories', data: next } }));
      }
      return next;
    });

    if (slug === 'all') {
      updateStoreInfo({ categoryBannerImage: bannerUrl }, false);
    }

    addToast(`Banner updated & live on website!`, 'success');
  };

  const updateAboutSection = (newAboutData) => {
    setAboutSection(prev => {
      const next = { ...prev, ...newAboutData };
      safeStorageSet('glowbasket_about_section', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'aboutSection', data: next } }));
      }
      return next;
    });
    addToast('About Us section updated successfully!', 'success');
  };

  const updatePolicies = (newPoliciesData) => {
    setPolicies(prev => {
      const next = {
        ...prev,
        ...newPoliciesData
      };
      safeStorageSet('glowbasket_policies', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'policies', data: next } }));
      }
      return next;
    });
    addToast('Store Policies updated and live on website!', 'success');
  };

  const addReview = (newReviewData) => {
    const id = `rev-${Date.now()}`;
    const review = {
      id,
      name: newReviewData.name || "Verified Customer",
      city: newReviewData.city || "India",
      rating: Number(newReviewData.rating) || 5,
      title: newReviewData.title || "Wonderful skin transformation!",
      review: newReviewData.review || "Visible results and genuine quality with authenticated hologram.",
      verified: newReviewData.verified !== false,
      productName: newReviewData.productName || "Vita Glow Advanced Night Cream",
      date: newReviewData.date || "Recently",
      avatar: newReviewData.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    };
    setReviewsList(prev => {
      const next = [review, ...prev];
      safeStorageSet('glowbasket_reviews', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'reviews', data: next } }));
      }
      return next;
    });
    addToast('New customer review added live!', 'success');
    return review;
  };

  const updateReview = (reviewId, updatedFields) => {
    setReviewsList(prev => {
      const next = prev.map(r => r.id === reviewId ? { ...r, ...updatedFields } : r);
      safeStorageSet('glowbasket_reviews', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'reviews', data: next } }));
      }
      return next;
    });
    addToast('Review updated successfully!', 'success');
  };

  const deleteReview = (reviewId) => {
    setReviewsList(prev => {
      const next = prev.filter(r => r.id !== reviewId);
      safeStorageSet('glowbasket_reviews', next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glowbasket_sync', { detail: { key: 'reviews', data: next } }));
      }
      return next;
    });
    addToast('Review deleted from store.', 'info');
  };

  const updateReviewsHeader = (newHeader) => {
    setReviewsHeader(prev => {
      const next = { ...prev, ...newHeader };
      safeStorageSet('glowbasket_reviews_header', next);
      return next;
    });
    addToast('Reviews section settings updated!', 'success');
  };

  const resetProductsToDefault = () => {
    setProductsList(initialProducts);
    localStorage.removeItem('auraglow_products');
    addToast('Catalog restored to default products.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
        updateStoreInfo,
        productsList,
        setProductsList,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartOriginalTotal,
        cartItemCount,
        cartFinalTotal,
        discountAmount,
        shippingFee,
        isFreeShipping,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        searchOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        selectedSort,
        setSelectedSort,
        priceFilter,
        setPriceFilter,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingModalMode,
        setTrackingModalMode,
        openTrackingModal,
        cancelOrder,
        isAdminOpen,
        setIsAdminOpen,
        activeTrackingQuery,
        setActiveTrackingQuery,
        toasts,
        addToast,
        removeToast,
        navigateToProduct,
        navigateToCategory,
        navigateToView,
        setViewWithUrl,
        addProduct,
        deleteProduct,
        updateProduct,
        resetProductsToDefault,
        updateOrderStatus,
        updateOrderTracking,
        processOrderReturn,
        deleteOrder,
        addPromoCode,
        deletePromoCode,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        currentUser,
        setCurrentUser,
        customerLogin,
        customerRegister,
        googleLogin,
        customerLogout,
        banners,
        setBanners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerStatus,
        resetBannersToDefault,
        updateAnnouncement,
        categoriesList,
        setCategoriesList,
        categoryBanners,
        setCategoryBanners,
        updateCategoryBanner,
        addCategory,
        updateCategory,
        deleteCategory,
        aboutSection,
        setAboutSection,
        updateAboutSection,
        policies,
        setPolicies,
        updatePolicies,
        reviewsList,
        setReviewsList,
        reviewsHeader,
        setReviewsHeader,
        addReview,
        updateReview,
        deleteReview,
        updateReviewsHeader,
        adminTab,
        setAdminTab,
        navigateToAdminTab,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

