import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore, slugify } from '../../context/StoreContext';
import { categories as defaultCategories } from '../../data/categories';
import { initialAboutSection } from '../../config/storeConfig';
import ImageUploadField from './ImageUploadField';
import MultiImageUploadField from './MultiImageUploadField';
import { 
  LayoutGrid, 
  Package, 
  Tag, 
  Users, 
  Activity, 
  Bell, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  LogOut, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy, 
  Check, 
  Truck, 
  Printer, 
  MessageCircle, 
  RotateCcw, 
  CheckCircle2, 
  Image as ImageIcon, 
  SlidersHorizontal, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  X, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Percent,
  CheckSquare,
  Square,
  ArrowRight,
  Palette,
  Layers,
  Radio,
  Sliders,
  BookOpen,
  Star
} from 'lucide-react';

export const AdminPage = () => {
  const { 
    storeInfo, 
    setStoreInfo, 
    updateStoreInfo,
    orders, 
    productsList, 
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
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    resetBannersToDefault,
    updateAnnouncement,
    categoriesList,
    addCategory,
    updateCategory,
    deleteCategory,
    aboutSection,
    updateAboutSection,
    reviewsList,
    reviewsHeader,
    addReview,
    updateReview,
    deleteReview,
    updateReviewsHeader,
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout, 
    setViewWithUrl,
    navigateToProduct,
    navigateToCategory,
    addToast,
    adminTab,
    navigateToAdminTab
  } = useStore();

  // Navigation tab state synced with dedicated URL routes (/admin/:tab)
  // 'dashboard' | 'products' | 'categories' | 'banners' | 'sales' | 'customers' | 'analytics' | 'notifications' | 'settings' | 'about' | 'reviews'
  const activeTab = adminTab || 'dashboard';
  const setActiveTab = (tab) => {
    navigateToAdminTab(tab);
  };
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);

  // Admin Login state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Products Table States
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Active' | 'Scheduled' | 'Draft'
  const [dealFilter, setDealFilter] = useState('all'); // 'all' | 'deal'
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Category Management States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const initialCategoryForm = {
    name: '',
    slug: '',
    description: '',
    bannerImg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    badge: '',
    subcategories: [],
    subcategoriesStr: ''
  };
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);

  // New / Edit Product Form State
  const initialProductForm = {
    name: '',
    brand: 'Classic Glow',
    category: 'lips',
    subCategory: 'Lip Oil',
    price: '',
    originalPrice: '',
    stock: 75,
    status: 'Active',
    badge: 'New Arrival',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    images: [],
    shortDescription: 'Advanced herbal formulation for illuminated and radiant glowing skin.',
    size: '50g',
    featured: true,
    isDealOfDay: false
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // Banners Management State (Matches every element in user's uploaded banner screenshot)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const initialBannerForm = {
    title: '',
    subtitle: '',
    tag: 'Glow Basket Exclusive',
    offerText: 'NEW LAUNCH • SPECIAL OFFERS',
    guaranteeText: '100% Genuine & Authentic',
    coupon: 'GLOW20',
    ctaText: 'Shop Collection',
    ctaLink: '/shop',
    secondaryCtaText: 'View Full Catalog',
    secondaryCtaLink: '/shop',
    catSlug: 'all',
    dispatchTag: 'FAST DISPATCH',
    dispatchText: 'Delivery Across India in 2-4 Days',
    stockBadge: 'IN STOCK',
    bgClass: 'bg-white text-slate-900 border border-slate-100',
    status: 'Active',
    active: true,
    isGraphicBanner: true,
    bannerType: 'image',
    image: '/banners/classic-glow-hero-clean.jpg'
  };
  const [bannerForm, setBannerForm] = useState(initialBannerForm);

  // Announcement Bar State
  const [announcementFormData, setAnnouncementFormData] = useState({
    badge: storeInfo?.announcement?.badge || 'Special Sale',
    text: storeInfo?.announcement?.text || 'Flat 20% OFF on all Night Creams & Glutathione Combos! Use Code:',
    code: storeInfo?.announcement?.code || 'GLOW20'
  });

  // Orders Management States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Store Settings & Logo State
  const [brandingForm, setBrandingForm] = useState({ 
    storeName: storeInfo?.storeName || 'Glow Basket',
    storeTagline: storeInfo?.storeTagline || 'Luxury Skincare, Cosmetic Glam & Radiant Beauty Formulations',
    domainName: storeInfo?.domainName || 'glowbasket.in',
    siteUrl: storeInfo?.siteUrl || 'https://glowbasket.in',
    logoType: storeInfo?.logoType || 'image', // 'image' | 'text'
    logoUrl: storeInfo?.logoUrl || '/logo.png',
    monogram: storeInfo?.monogram || 'GB',
    supportPhone: storeInfo?.supportPhone || '+91 98200 45678',
    whatsappNumber: storeInfo?.whatsappNumber || '+91 98200 45678',
    whatsappPromptText: storeInfo?.whatsappPromptText || 'Need help choosing a cream? Chat with us!',
    whatsappEnabled: storeInfo?.whatsappEnabled !== false,
    supportEmail: storeInfo?.supportEmail || 'care@glowbasket.in',
    businessAddress: storeInfo?.businessAddress || '402, Lotus Corporate Park, Goregaon (East), Mumbai - 400063',
    freeShippingThreshold: storeInfo?.freeShippingThreshold || 999
  });

  // Live auto-save handler: updates component state, context store, and localStorage instantly
  const handleBrandingFieldChange = (field, value) => {
    setBrandingForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'storeName' && value) {
        // Auto-generate monogram if not explicitly customized or currently using default
        const words = value.trim().split(/\s+/).filter(Boolean);
        const autoMono = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : value.trim().slice(0, 2).toUpperCase();
        if (!prev.monogram || prev.monogram === 'GB' || prev.monogram === 'CG') {
          updated.monogram = autoMono;
        }
      }
      updateStoreInfo(updated, false);
      return updated;
    });
  };

  // Keep branding form synchronized with store changes
  useEffect(() => {
    if (storeInfo && typeof storeInfo === 'object') {
      setBrandingForm(prev => ({
        ...prev,
        ...storeInfo,
        storeName: storeInfo.storeName || prev.storeName,
        monogram: storeInfo.monogram || prev.monogram,
        logoType: storeInfo.logoType || prev.logoType,
        logoUrl: storeInfo.logoUrl || prev.logoUrl
      }));
    }
  }, [storeInfo]);

  // About Us Page State (Editable from Admin)
  const [aboutFormData, setAboutFormData] = useState(() => aboutSection || initialAboutSection);

  // Sync with aboutSection from store if changed
  React.useEffect(() => {
    if (aboutSection) {
      setAboutFormData(aboutSection);
    }
  }, [aboutSection]);

  // Customer Reviews State (Editable from Admin)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const initialReviewForm = {
    name: '',
    city: 'Mumbai, Maharashtra',
    rating: 5,
    title: '',
    review: '',
    verified: true,
    productName: 'Vita Glow Advanced Night Cream',
    date: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  };
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewsHeaderForm, setReviewsHeaderForm] = useState(() => reviewsHeader || {
    badge: "Verified Experiences",
    title: "Real Transformations, Real Stories",
    subtitle: "Read what authentic buyers have to say about our creams, soaps, and wellness formulas.",
    aggregateRating: "4.9",
    reviewCountText: "Based on 2,840+ genuine buyer reviews"
  });

  React.useEffect(() => {
    if (reviewsHeader) {
      setReviewsHeaderForm(reviewsHeader);
    }
  }, [reviewsHeader]);

  // Curated Image Presets for Quick Selection
  const imagePresets = [
    { label: "Night Cream Jar (Gold)", url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" },
    { label: "Night Cream (White Jar)", url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" },
    { label: "Face Serum (Dropper)", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" },
    { label: "Herbal Soap Bar", url: "https://images.unsplash.com/photo-1607006314647-79a6d05634e7?auto=format&fit=crop&w=800&q=80" },
    { label: "Purple Tube Cream", url: "https://images.unsplash.com/photo-1556228722-d0b5d045d654?auto=format&fit=crop&w=800&q=80" },
    { label: "Wellness Supplement", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" }
  ];

  const logoPresets = [
    { label: "Glow Basket Signature (GB + Script)", type: "image", url: "/logo.png" },
    { label: "Cursive Script + Watermark Monogram", type: "text", monogram: "GB" },
    { label: "Minimalist Crown Logo", type: "image", url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80" },
    { label: "Natural Botanical Leaf", type: "image", url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80" }
  ];

  const cats = Array.isArray(categoriesList) && categoriesList.length > 0 
    ? categoriesList 
    : (Array.isArray(defaultCategories) ? defaultCategories : []);

  // Auth Handler
  const handleAdminAuth = (e) => {
    e.preventDefault();
    setLoginError('');
    const ok = adminLogin(loginUser, loginPass);
    if (!ok) {
      setLoginError('Invalid admin credentials. Use admin / admin123');
    }
  };

  // Product CRUD
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      addToast('Please enter Product Name and Price', 'error');
      return;
    }

    const allImages = [
      productForm.imageUrl,
      ...(Array.isArray(productForm.images) ? productForm.images : [])
    ].filter(Boolean);
    const finalImages = Array.from(new Set(allImages));
    if (finalImages.length === 0) {
      finalImages.push("https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80");
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
        stock: Number(productForm.stock) || 10,
        status: productForm.status,
        imageUrl: finalImages[0],
        images: finalImages
      });
      setEditingProductId(null);
    } else {
      addProduct({
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
        stock: Number(productForm.stock) || 10,
        status: productForm.status,
        imageUrl: finalImages[0],
        images: finalImages
      });
    }
    setProductForm(initialProductForm);
    setIsAddProductModalOpen(false);
  };

  const handleEditProduct = (prod) => {
    setEditingProductId(prod.id);
    const prodImages = Array.isArray(prod.images) ? prod.images : (prod.imageUrl ? [prod.imageUrl] : []);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      subCategory: prod.subCategory || 'Skin Care',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock || 20,
      status: prod.status || 'Active',
      badge: prod.badge || '',
      imageUrl: prodImages[0] || prod.imageUrl || '',
      images: prodImages.slice(1),
      shortDescription: prod.shortDescription || '',
      size: prod.size || '50g',
      featured: Boolean(prod.featured),
      isDealOfDay: Boolean(prod.isDealOfDay)
    });
    setIsAddProductModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Category CRUD
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      addToast('Please enter Category Name', 'error');
      return;
    }
    const slug = categoryForm.slug ? slugify(categoryForm.slug) : slugify(categoryForm.name);
    const subcats = categoryForm.subcategories && categoryForm.subcategories.length > 0
      ? categoryForm.subcategories
      : (categoryForm.subcategoriesStr
          ? categoryForm.subcategoriesStr.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ id: slugify(name), name, slug: slugify(name) }))
          : []);

    const payload = {
      ...categoryForm,
      slug,
      subcategories: subcats
    };
    delete payload.subcategoriesStr;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, payload);
      setEditingCategoryId(null);
    } else {
      addCategory(payload);
    }
    setCategoryForm(initialCategoryForm);
    setIsCategoryModalOpen(false);
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    const subStr = cat.subcategories ? cat.subcategories.map(s => s.name).join(', ') : '';
    setCategoryForm({
      name: cat.name,
      slug: cat.slug || cat.id,
      description: cat.description || '',
      bannerImg: cat.bannerImg || '',
      badge: cat.badge || '',
      subcategories: cat.subcategories || [],
      subcategoriesStr: subStr
    });
    setIsCategoryModalOpen(true);
  };

  // Banner CRUD (Matches all 10 elements in user's screenshot)
  const handleBannerSubmit = (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      addToast('Please enter a Banner Title', 'error');
      return;
    }
    if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
      setEditingBannerId(null);
    } else {
      addBanner(bannerForm);
    }
    setBannerForm(initialBannerForm);
    setIsBannerModalOpen(false);
  };

  const handleEditBanner = (b) => {
    setEditingBannerId(b.id);
    setBannerForm({
      title: b.title || '',
      subtitle: b.subtitle || '',
      tag: b.tag || 'Glow Basket Exclusive',
      offerText: b.offerText || 'NEW LAUNCH • SPECIAL OFFERS',
      guaranteeText: b.guaranteeText || '100% Genuine & Authentic',
      coupon: b.coupon || 'GLOW20',
      ctaText: b.ctaText || 'Shop Collection',
      ctaLink: b.ctaLink || '/shop',
      secondaryCtaText: b.secondaryCtaText || 'View Full Catalog',
      secondaryCtaLink: b.secondaryCtaLink || '/shop',
      catSlug: b.catSlug || 'all',
      dispatchTag: b.dispatchTag || 'FAST DISPATCH',
      dispatchText: b.dispatchText || 'Delivery Across India in 2-4 Days',
      stockBadge: b.stockBadge || 'IN STOCK',
      bgClass: b.bgClass || 'bg-white text-slate-900 border border-slate-100',
      status: b.status || (b.active !== false ? 'Active' : 'Draft'),
      active: b.active !== false,
      isGraphicBanner: b.isGraphicBanner !== false,
      bannerType: b.bannerType || (b.isGraphicBanner !== false ? 'image' : 'split'),
      image: b.image || ''
    });
    setIsBannerModalOpen(true);
  };

  // Announcement & Store Identity
  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    updateAnnouncement(announcementFormData);
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    updateStoreInfo(brandingForm, true);
  };

  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAboutSection(aboutFormData);
  };

  // Customer Reviews Handlers
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.review.trim()) {
      addToast('Please enter Customer Name and Review message', 'error');
      return;
    }
    if (editingReviewId) {
      updateReview(editingReviewId, reviewForm);
      setEditingReviewId(null);
    } else {
      addReview(reviewForm);
    }
    setReviewForm(initialReviewForm);
    setIsReviewModalOpen(false);
  };

  const handleEditReview = (rev) => {
    setEditingReviewId(rev.id);
    setReviewForm({
      name: rev.name || '',
      city: rev.city || '',
      rating: Number(rev.rating) || 5,
      title: rev.title || '',
      review: rev.review || '',
      verified: rev.verified !== false,
      productName: rev.productName || '',
      date: rev.date || 'Recently',
      avatar: rev.avatar || ''
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReviewsHeader = (e) => {
    e.preventDefault();
    updateReviewsHeader(reviewsHeaderForm);
  };

  // Filtered Products
  const safeProducts = Array.isArray(productsList) ? productsList : [];
  const filteredProducts = safeProducts.filter(prod => {
    if (!prod) return false;
    const name = String(prod.name || '').toLowerCase();
    const brand = String(prod.brand || '').toLowerCase();
    const sku = String(prod.sku || '').toLowerCase();
    const query = productSearch.trim().toLowerCase();
    const matchesSearch = !query || name.includes(query) || brand.includes(query) || sku.includes(query);
    const matchesCat = selectedCategoryFilter === 'all' || prod.category === selectedCategoryFilter;
    const matchesSubCat = selectedSubCategoryFilter === 'all' || 
      prod.subCategory === selectedSubCategoryFilter || 
      (prod.subCategory && slugify(prod.subCategory) === slugify(selectedSubCategoryFilter));
    const matchesStatus = statusFilter === 'all' || (prod.status || 'Active') === statusFilter;
    const matchesDeal = dealFilter === 'all' || (dealFilter === 'deal' && Boolean(prod.isDealOfDay));
    return matchesSearch && matchesCat && matchesSubCat && matchesStatus && matchesDeal;
  });

  // Filtered Orders
  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter(order => {
    if (!order) return false;
    const orderId = String(order.orderId || '').toLowerCase();
    const fullName = String(order.customer?.fullName || '').toLowerCase();
    const rawPhone = String(order.customer?.phone || '');
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const cleanSearch = orderSearch.trim().toLowerCase();
    const cleanPhoneSearch = cleanSearch.replace(/\D/g, '');

    const matchesSearch = !cleanSearch ||
      orderId.includes(cleanSearch) ||
      fullName.includes(cleanSearch) ||
      (cleanPhoneSearch && cleanPhone.includes(cleanPhoneSearch));

    let matchesStatus = true;
    const currentStatus = String(order.status || '');
    if (orderStatusFilter === 'pending') {
      matchesStatus = ['Confirmed', 'Processing', 'Packed'].includes(currentStatus);
    } else if (orderStatusFilter === 'transit') {
      matchesStatus = ['In Transit', 'Dispatched', 'Out for Delivery'].includes(currentStatus);
    } else if (orderStatusFilter === 'delivered') {
      matchesStatus = currentStatus === 'Delivered';
    } else if (orderStatusFilter === 'returns') {
      matchesStatus = currentStatus.toLowerCase().includes('return');
    }
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = safeOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (WHEN NOT LOGGED IN)
  // =========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-between font-sans text-slate-800">
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5B4DF5] text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 text-xs tracking-wider">
              <span className="font-serif font-black">{storeInfo?.monogram || 'GB'}</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {storeInfo?.storeName || 'Glow Basket'} <span className="text-xs text-[#5B4DF5] font-bold uppercase ml-1">Admin</span>
            </span>
          </div>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setViewWithUrl('home');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl px-3.5 py-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </a>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl max-w-md w-full p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5B4DF5] flex items-center justify-center mx-auto border border-indigo-100">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Sign in to Admin Dashboard</h2>
              <p className="text-xs text-slate-500">
                Manage products, categories, hero banners, store logo, and orders in one place.
              </p>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                />
              </div>

              <div className="bg-indigo-50/60 border border-indigo-100 p-3 rounded-xl text-xs text-indigo-900">
                <strong>Credentials:</strong> User: <code className="font-bold">admin</code> • Pass: <code className="font-bold">admin123</code>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Sign In to Dashboard
              </button>

              <div className="text-center pt-2">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewWithUrl('home');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  ← Return to Store Website
                </a>
              </div>
            </form>
          </div>
        </div>

        <footer className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-400">
          Store Administration Portal • Dedicated URL: <code>http://localhost:3000/admin</code>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED MODERN SAAS DASHBOARD (MATCHING USER SCREENSHOT)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex font-sans text-slate-800">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Logo at top */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5B4DF5] text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/25 text-sm tracking-wider">
                <span className="font-serif font-black">{storeInfo?.monogram || 'GB'}</span>
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-slate-900 tracking-tight block truncate">
                  {storeInfo?.storeName || 'Glow Basket'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider block -mt-0.5">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1 text-xs font-semibold text-slate-600">
            {/* Dashboard */}
            <a
              href="/admin/dashboard"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold shadow-2xs'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </a>

            {/* Products (Expandable Submenu matching screenshot) */}
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'products' || activeTab === 'categories'
                    ? 'text-[#5B4DF5] font-bold'
                    : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Products</span>
                </div>
                {productsMenuOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {productsMenuOpen && (
                <div className="pl-9 pr-2 space-y-1">
                  {/* Product List Sub-item */}
                  <a
                    href="/admin/products"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('products');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      activeTab === 'products'
                        ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Product List
                  </a>

                  <a
                    href="/admin/categories"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('categories');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      activeTab === 'categories'
                        ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Categories
                  </a>
                </div>
              )}
            </div>

            {/* BANNERS & HOMEPAGE CONTENT */}
            <a
              href="/admin/banners"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('banners');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Banners & Content</span>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full">
                Live
              </span>
            </a>

            {/* Sales / Orders */}
            <a
              href="/admin/sales"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('sales');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-slate-500" />
                <span>Sales</span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            </a>

            {/* Customers */}
            <a
              href="/admin/customers"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('customers');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Customers</span>
            </a>

            {/* Analytics */}
            <a
              href="/admin/analytics"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('analytics');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Analytics</span>
            </a>

            {/* Notifications */}
            <a
              href="/admin/notifications"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('notifications');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-500" />
                <span>Notifications</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            </a>

            {/* Store Logo & Branding Settings */}
            <a
              href="/admin/settings"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('settings');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-slate-500" />
                <span>Logo & Branding</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">
                Logo
              </span>
            </a>

            {/* About Us Page Content */}
            <a
              href="/admin/about"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('about');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>About Us Page</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded-md">
                Page
              </span>
            </a>

            {/* Customer Reviews & Testimonials */}
            <a
              href="/admin/reviews"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('reviews');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-indigo-50 text-[#5B4DF5] font-bold'
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-slate-500" />
                <span>Customer Reviews</span>
              </div>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                {reviewsList.length}
              </span>
            </a>
          </nav>
        </div>

        {/* User Card at bottom of sidebar matching screenshot */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Rubel Ahmed"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate block">Rubel Ahmed</span>
                <span className="text-[10px] text-emerald-600 font-medium block">Available for work</span>
              </div>
            </div>

            <button
              onClick={adminLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar matching screenshot */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">
              {activeTab === 'products' ? 'Products' :
               activeTab === 'categories' ? 'Categories Management' :
               activeTab === 'banners' ? 'Homepage Hero Banners & Content' :
               activeTab === 'about' ? 'About Us Page Content & Brand Story' :
               activeTab === 'reviews' ? 'Customer Reviews & Testimonials' :
               activeTab === 'settings' ? 'Store Logo & Brand Identity' :
               activeTab === 'sales' ? 'Sales & Orders' :
               activeTab === 'customers' ? 'Customers' :
               activeTab === 'analytics' ? 'Analytics' : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setActiveTab('notifications')}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {/* View Live Storefront Button */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setViewWithUrl('home');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-black transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>View Storefront</span>
            </a>

            {/* Pill button */}
            <button
              onClick={() => setActiveTab('banners')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Live Sync Active
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 space-y-6">

          {/* ================================================================= */}
          {/* TAB 1: PRODUCTS LIST (MATCHING SCREENSHOT)                        */}
          {/* ================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Products list</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage all {productsList.length} catalog items, inventory stock, pricing, and live status.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        showFilterDrawer
                          ? 'border-[#5B4DF5] text-[#5B4DF5] bg-indigo-50/50'
                          : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filter</span>
                    </button>

                    <button
                      onClick={() => {
                        setProductSearch('');
                        setSelectedCategoryFilter('all');
                        setStatusFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      See All
                    </button>

                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setProductForm(initialProductForm);
                        setIsAddProductModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Add Product</span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls Row */}
                {showFilterDrawer && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product name, SKU..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                      />
                    </div>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => {
                        setSelectedCategoryFilter(e.target.value);
                        setSelectedSubCategoryFilter('all');
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    >
                      <option value="all">All Categories</option>
                      {cats.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    {/* Subcategory Filter */}
                    {(() => {
                      const activeCat = cats.find(c => c.id === selectedCategoryFilter || c.slug === selectedCategoryFilter);
                      const subOptions = activeCat?.subcategories || [];
                      if (subOptions.length === 0) return null;
                      return (
                        <select
                          value={selectedSubCategoryFilter}
                          onChange={(e) => setSelectedSubCategoryFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                        >
                          <option value="all">All Subcategories</option>
                          {subOptions.map(sub => (
                            <option key={sub.id || sub.slug} value={sub.name}>{sub.name}</option>
                          ))}
                        </select>
                      );
                    })()}

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setDealFilter(prev => prev === 'deal' ? 'all' : 'deal')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        dealFilter === 'deal'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Filter products by Deals of the Day"
                    >
                      <span>⚡ Deals of Day</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        dealFilter === 'deal' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {safeProducts.filter(p => p.isDealOfDay).length}
                      </span>
                    </button>
                  </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold">
                        <th className="py-3 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                            onChange={toggleSelectAll}
                            className="rounded border-slate-300 accent-[#5B4DF5] cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-500">
                          Product Name <span className="inline-block text-[10px]">˅</span>
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-500">
                          Category <span className="inline-block text-[10px]">˅</span>
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-500">
                          Price <span className="inline-block text-[10px]">˅</span>
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-500">
                          Stock <span className="inline-block text-[10px]">˅</span>
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-500 text-center">
                          Deal of Day
                        </th>
                        <th className="py-3 px-3 font-semibold text-slate-500">
                          Status <span className="inline-block text-[10px]">˅</span>
                        </th>
                        <th className="py-3 px-3 text-right font-semibold text-slate-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(prod => {
                        const isSelected = selectedProductIds.includes(prod.id);
                        const cleanSlug = prod.slug || slugify(prod.name || prod.id);
                        const directUrl = `/product/${cleanSlug}`;
                        const currentStatus = prod.status || (prod.stock > 10 ? 'Active' : prod.stock > 0 ? 'Scheduled' : 'Draft');

                        return (
                          <tr 
                            key={prod.id}
                            className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}
                          >
                            <td className="py-3.5 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectProduct(prod.id)}
                                className="rounded border-slate-300 accent-[#5B4DF5] cursor-pointer"
                              />
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  className="w-11 h-11 rounded-xl object-cover border border-slate-200/80 shrink-0 bg-slate-50"
                                />
                                <div className="min-w-0">
                                  <a
                                    href={directUrl}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigateToProduct(prod);
                                    }}
                                    className="font-bold text-slate-900 hover:text-[#5B4DF5] transition-colors truncate block max-w-xs"
                                    title={prod.name}
                                  >
                                    {prod.name}
                                  </a>
                                  <span className="text-[11px] text-slate-400 block mt-0.5">
                                    {prod.brand} • SKU: {prod.sku || prod.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 text-slate-600 font-medium capitalize">
                              <span className="font-bold text-slate-900 block">{prod.category.replace(/-/g, ' ')}</span>
                              {prod.subCategory && (
                                <span className="text-[11px] text-slate-500 block">{prod.subCategory}</span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 font-semibold text-slate-900">
                              ₹{prod.price.toLocaleString()}.00
                            </td>

                            <td className="py-3.5 px-3 text-slate-600 font-medium">
                              {prod.stock}
                            </td>

                            <td className="py-3.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedDeal = !prod.isDealOfDay;
                                  updateProduct(prod.id, { isDealOfDay: updatedDeal });
                                  addToast(
                                    updatedDeal 
                                      ? `Added "${prod.name}" to Deals of the Day!` 
                                      : `Removed "${prod.name}" from Deals of the Day`,
                                    'success'
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 ${
                                  prod.isDealOfDay
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-2xs'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                                }`}
                                title={prod.isDealOfDay ? 'Featured in Deals of the Day. Click to remove.' : 'Click to feature in Deals of the Day'}
                              >
                                <span>⚡</span>
                                <span>{prod.isDealOfDay ? 'Deal Active' : '+ Make Deal'}</span>
                              </button>
                            </td>

                            <td className="py-3.5 px-3">
                              {currentStatus === 'Scheduled' && (
                                <span className="inline-block bg-blue-50/80 text-blue-600 border border-blue-200 text-[11px] font-semibold px-3 py-1 rounded-full">
                                  Scheduled
                                </span>
                              )}
                              {currentStatus === 'Active' && (
                                <span className="inline-block bg-emerald-50/80 text-emerald-600 border border-emerald-200 text-[11px] font-semibold px-3 py-1 rounded-full">
                                  Active
                                </span>
                              )}
                              {currentStatus === 'Draft' && (
                                <span className="inline-block bg-amber-50/80 text-amber-700 border border-amber-200 text-[11px] font-semibold px-3 py-1 rounded-full">
                                  Draft
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={directUrl}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigateToProduct(prod);
                                  }}
                                  className="text-xs font-semibold text-[#5B4DF5] hover:text-[#4335da] hover:underline px-2 py-1 rounded-md"
                                >
                                  Details
                                </a>

                                <button
                                  onClick={() => handleEditProduct(prod)}
                                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete "${prod.name}" from store catalog?`)) {
                                      deleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Showing {filteredProducts.length} of {productsList.length} products
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm("Reset products catalog to original standard items?")) {
                        resetProductsToDefault();
                      }
                    }}
                    className="text-slate-400 hover:text-[#5B4DF5] underline cursor-pointer text-[11px]"
                  >
                    Reset Catalog to Defaults
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: CATEGORIES MANAGEMENT (USER'S REQUEST: CHANGE CATEGORY)     */}
          {/* ================================================================= */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Categories Management</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Add, edit, or delete categories. Updates immediately across the homepage grid, shop filters, and menu!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryForm(initialCategoryForm);
                    setIsCategoryModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Add New Category</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cats.map(cat => {
                  const prodCount = cat.id === 'all'
                    ? productsList.length
                    : productsList.filter(p => p.category === cat.id || p.category === cat.slug).length;

                  return (
                    <div 
                      key={cat.id} 
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={cat.bannerImg || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"}
                          alt={cat.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 bg-white"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{cat.name}</h4>
                            {cat.badge && (
                              <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-700 px-2 py-0.2 rounded-full shrink-0">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-indigo-600 block mt-0.5">/category/{cat.slug || cat.id}</span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{cat.description || "Authentic skincare collection"}</p>
                          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
                            {prodCount} Products in category
                          </span>

                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {cat.subcategories.map(sub => (
                                <span key={sub.id || sub.slug} className="text-[10px] bg-white border border-slate-200/90 px-2 py-0.5 rounded-md text-slate-700 font-medium shadow-2xs">
                                  {sub.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
                        <a
                          href={`/category/${cat.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToCategory(cat.id);
                          }}
                          className="text-xs font-semibold text-[#5B4DF5] hover:underline"
                        >
                          View in Shop →
                        </a>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {cat.id !== 'all' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}"? Products in this category won't be deleted.`)) {
                                  deleteCategory(cat.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: BANNERS & HOMEPAGE CONTENT (MATCHES USER SCREENSHOT)       */}
          {/* ================================================================= */}
          {activeTab === 'banners' && (
            <div className="space-y-8">
              
              {/* Hero Slider Banners Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">Homepage Hero Slider Banners</h2>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Live on Storefront
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Change the headline, purple bottle image, discount pill, buttons, and delivery guarantee. Every change updates the website instantly!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm('Reset all hero banners to default original settings?')) {
                          resetBannersToDefault();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Restore original preset banners"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingBannerId(null);
                        setBannerForm(initialBannerForm);
                        setIsBannerModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Add New Banner</span>
                    </button>
                  </div>
                </div>

                {/* Banner Size Guidelines & Canva Specifications */}
                <div className="bg-gradient-to-r from-neutral-950 via-slate-900 to-neutral-900 text-white rounded-2xl p-5 shadow-lg border border-neutral-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          📐 Recommended Banner Sizes
                        </span>
                        <span className="text-xs text-slate-400">Canva & Photoshop Guide</span>
                      </div>
                      <h3 className="text-base font-bold text-white">Homepage Hero Banner Resolution & Aspect Ratio</h3>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                        For razor-sharp, edge-to-edge promotional banners like Dr. Sheth's AM-to-PM and Lakmé 9 to 5, use these optimal sizes:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs shrink-0">
                      <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                        <div className="text-amber-300 font-bold flex items-center justify-between gap-2">
                          <span>🖥️ Desktop Full-Width:</span>
                          <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-white font-black text-xs">1920 × 600 px</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">Aspect Ratio 3.2:1 (or 1600 × 500 px)</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                        <div className="text-emerald-300 font-bold flex items-center justify-between gap-2">
                          <span>📱 Mobile Responsive:</span>
                          <span className="font-mono bg-black/60 px-2 py-0.5 rounded text-white font-black text-xs">1080 × 1080 px</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">1:1 Square (or 1080 × 600 px)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300">🎨 Canva Tip:</span>
                      <span>Click <strong>"Create a design"</strong> &gt; <strong>"Custom size"</strong> &gt; enter <strong>1920 × 600 px</strong> for exact full-width fit.</span>
                    </div>
                    <span className="text-slate-400">Spotlight Product Box Size: <strong>800 × 800 px</strong> (Square)</span>
                  </div>
                </div>

                {/* Banners Grid with Visual Cards matching user screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((b, idx) => (
                    <div 
                      key={b.id || idx}
                      className="bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                    >
                      {/* Image Preview Box */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 p-2 flex items-center justify-center">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-full object-contain rounded-xl"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/banners/classic-glow-hero-clean.jpg";
                          }}
                        />
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-xs ${
                          b.active !== false && b.status !== 'Draft'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}>
                          {b.status || (b.active ? 'Active' : 'Draft')}
                        </span>
                        <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                          Slide #{idx + 1}
                        </span>
                        <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-md">
                          {b.isGraphicBanner !== false ? '📐 1920×600 px Full-Width' : '📐 800×800 px Split'}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#5B4DF5] uppercase tracking-wider block">
                            {b.tag}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                            {b.title}
                          </h3>
                          <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">
                            {b.subtitle}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                              {b.offerText}
                            </span>
                            <span className="font-mono font-bold text-slate-600">
                              Coupon: {b.coupon}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{b.guaranteeText || "100% Genuine Hologram Verified"}</span>
                          </p>

                          {/* Live Button Target URL Badge */}
                          <div className="mt-2 p-2 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <ExternalLink className="w-3 h-3 text-[#5B4DF5] shrink-0" />
                              <span className="font-semibold text-slate-700 truncate">
                                Button Link: <span className="font-mono text-[#5B4DF5] font-bold">{b.ctaLink || (b.id === 'banner-1' ? '/product/vita-glow-advanced-night-cream' : `/category/${b.catSlug || 'night-creams'}`)}</span>
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEditBanner(b)}
                              className="text-[10px] font-bold text-[#5B4DF5] hover:underline shrink-0 ml-1.5 cursor-pointer"
                            >
                              Edit URL
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                        <button
                          onClick={() => toggleBannerStatus(b.id, b.status === 'Active' ? 'Draft' : 'Active')}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          {b.status === 'Active' ? 'Set as Draft' : 'Publish Live'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditBanner(b)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Banner Content"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete banner "${b.title}"?`)) {
                                deleteBanner(b.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Banner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcement Bar Customizer */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Website Top Announcement Bar</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Edit the promotional ticker displayed at the top of every page.
                  </p>
                </div>

                <form onSubmit={handleSaveAnnouncement} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={announcementFormData.badge}
                      onChange={(e) => setAnnouncementFormData({ ...announcementFormData, badge: e.target.value })}
                      placeholder="Special Sale"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={announcementFormData.code}
                      onChange={(e) => setAnnouncementFormData({ ...announcementFormData, code: e.target.value.toUpperCase() })}
                      placeholder="GLOW20"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono uppercase focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Save Announcement
                    </button>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Announcement Message</label>
                    <input
                      type="text"
                      value={announcementFormData.text}
                      onChange={(e) => setAnnouncementFormData({ ...announcementFormData, text: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: LOGO & STORE BRANDING (USER'S REQUEST: CHANGE LOGO)        */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveBranding} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-8 shadow-xs text-xs">
              
              {/* Logo Customizer Section */}
              <div className="space-y-5 pb-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-[#5B4DF5]" />
                      <h2 className="text-lg font-bold text-slate-900">Website Logo & Branding</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Changes save automatically in real time and sync across storefront header, footer, and mobile nav.
                    </p>
                  </div>

                  {/* Immediate Save & Apply Logo Button */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Auto-Save Active
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateStoreInfo({
                          logoType: brandingForm.logoType,
                          logoUrl: brandingForm.logoUrl,
                          storeName: brandingForm.storeName,
                          monogram: brandingForm.monogram
                        }, true);
                      }}
                      className="flex items-center gap-1.5 bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Live</span>
                    </button>
                  </div>
                </div>

                {/* Primary Brand Name & Monogram inputs (ALWAYS VISIBLE for all modes!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Store Brand Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={brandingForm.storeName}
                      onChange={(e) => handleBrandingFieldChange('storeName', e.target.value)}
                      placeholder="e.g. Glow Basket"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-[#5B4DF5] outline-none text-xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Reflects instantly across the header, footer, page titles, and live logo.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Monogram Letters (Watermark)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={brandingForm.monogram}
                      onChange={(e) => handleBrandingFieldChange('monogram', e.target.value.toUpperCase())}
                      placeholder="GB"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono font-bold uppercase text-slate-900 focus:ring-2 focus:ring-[#5B4DF5] outline-none text-xs"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      2-3 initials shown as soft blush watermark letters behind script name (e.g. GB, DS).
                    </p>
                  </div>
                </div>

                {/* Logo Presentation Style Selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-2">Logo Presentation Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      brandingForm.logoType === 'text' ? 'border-[#5B4DF5] bg-indigo-50/40 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="logoType"
                        value="text"
                        checked={brandingForm.logoType === 'text'}
                        onChange={() => handleBrandingFieldChange('logoType', 'text')}
                        className="accent-[#5B4DF5] mt-1"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">Cursive Script Logo + Monogram</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Signature luxury look: elegant cursive brand signature with soft pink watermark monogram.
                        </span>
                      </div>
                    </label>

                    <label className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      brandingForm.logoType === 'image' ? 'border-[#5B4DF5] bg-indigo-50/40 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="logoType"
                        value="image"
                        checked={brandingForm.logoType === 'image'}
                        onChange={() => handleBrandingFieldChange('logoType', 'image')}
                        className="accent-[#5B4DF5] mt-1"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">Custom Image Logo (Upload / Link)</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Display your own brand logo file (transparent PNG, WebP, or SVG recommended).
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* If Custom Image Logo is Selected */}
                {brandingForm.logoType === 'image' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <ImageUploadField
                      label="Upload or Paste Brand Logo Image"
                      value={brandingForm.logoUrl}
                      onChange={(newVal) => handleBrandingFieldChange('logoUrl', newVal)}
                      aspect="contain"
                      presets={logoPresets.filter(p => p.type === 'image')}
                      helperText="Supports transparent PNG, WebP, SVG, and high-res image links."
                    />

                    {/* Live Image Logo Preview */}
                    {brandingForm.logoUrl && (
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-semibold">Live Storefront Header Preview:</span>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-100">
                          <img src={brandingForm.logoUrl} alt="Logo Preview" className="h-10 w-auto object-contain" />
                          <span className="text-xs font-bold text-slate-800">{brandingForm.storeName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* If Cursive Script Logo is Selected */}
                {brandingForm.logoType === 'text' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[11px] font-bold text-slate-600 block">Live Script Logo Preview (As Rendered in Header):</span>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden h-24 shadow-2xs">
                      <span className="absolute text-6xl font-serif font-black text-[#fce5e8] pointer-events-none select-none tracking-tight">
                        {brandingForm.monogram || 'GB'}
                      </span>
                      <span 
                        className="relative z-10 text-3xl sm:text-4xl text-[#ba5d5d] drop-shadow-2xs select-none"
                        style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }}
                      >
                        {brandingForm.storeName || 'Glow Basket'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating WhatsApp Live Chat Settings */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">WhatsApp Floating Chat Widget</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Configure the green WhatsApp support button and speech prompt shown in the bottom right corner.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">WhatsApp Phone Number</label>
                    <input
                      type="text"
                      value={brandingForm.whatsappNumber}
                      onChange={(e) => handleBrandingFieldChange('whatsappNumber', e.target.value)}
                      placeholder="+91 98200 45678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Chat Speech Bubble Text</label>
                    <input
                      type="text"
                      value={brandingForm.whatsappPromptText}
                      onChange={(e) => handleBrandingFieldChange('whatsappPromptText', e.target.value)}
                      placeholder="Need help choosing a cream? Chat with us!"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* General Business Information */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Business Helpline & Shipping Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Helpline Phone Number</label>
                    <input
                      type="text"
                      value={brandingForm.supportPhone}
                      onChange={(e) => handleBrandingFieldChange('supportPhone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Official Support Email</label>
                    <input
                      type="email"
                      value={brandingForm.supportEmail}
                      onChange={(e) => handleBrandingFieldChange('supportEmail', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Free Shipping Order Value (₹)</label>
                    <input
                      type="number"
                      value={brandingForm.freeShippingThreshold}
                      onChange={(e) => handleBrandingFieldChange('freeShippingThreshold', Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Store Tagline</label>
                    <input
                      type="text"
                      value={brandingForm.storeTagline}
                      onChange={(e) => handleBrandingFieldChange('storeTagline', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Website Domain Name</label>
                    <input
                      type="text"
                      value={brandingForm.domainName || ''}
                      onChange={(e) => handleBrandingFieldChange('domainName', e.target.value)}
                      placeholder="glowbasket.in"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Store Website Base URL</label>
                    <input
                      type="text"
                      value={brandingForm.siteUrl || ''}
                      onChange={(e) => handleBrandingFieldChange('siteUrl', e.target.value)}
                      placeholder="https://glowbasket.in"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Registered Business Address</label>
                    <input
                      type="text"
                      value={brandingForm.businessAddress}
                      onChange={(e) => handleBrandingFieldChange('businessAddress', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer text-xs"
                >
                  Save All Store Identity & Logo Settings
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* TAB: ABOUT US PAGE CONTENT EDITOR (USER'S REQUEST)                */}
          {/* ================================================================= */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveAbout} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-8 shadow-xs text-xs">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#5B4DF5]" />
                    <h2 className="text-lg font-bold text-slate-900">About Us Page Content & Brand Story</h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Edit your brand heritage, founder story, mission statement, trust pillars, and WhatsApp specialist banner.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/about"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Page</span>
                  </a>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save About Section</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: MAIN HEADING & BADGES */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Page Heading & Mission</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Top Badge Tag</label>
                    <input
                      type="text"
                      value={aboutFormData.badge || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, badge: e.target.value })}
                      placeholder="e.g. Our Heritage & Mission"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Main Heading Title</label>
                    <input
                      type="text"
                      value={aboutFormData.title || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, title: e.target.value })}
                      placeholder="e.g. Crafted for Pure Radiance & Authenticity"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Subtitle / Mission Statement</label>
                    <textarea
                      rows={2}
                      value={aboutFormData.subtitle || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, subtitle: e.target.value })}
                      placeholder="Brief overview of your store mission..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Established Note</label>
                    <input
                      type="text"
                      value={aboutFormData.establishedYear || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, establishedYear: e.target.value })}
                      placeholder="e.g. Est. 2018"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Counter Number</label>
                    <input
                      type="text"
                      value={aboutFormData.statNumber || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, statNumber: e.target.value })}
                      placeholder="e.g. 50,000+"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Counter Label</label>
                    <input
                      type="text"
                      value={aboutFormData.statLabel || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, statLabel: e.target.value })}
                      placeholder="e.g. Happy Skin Transformations"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BRAND STORY & IMAGE */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Brand Story & Image</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Story Section Title</label>
                    <input
                      type="text"
                      value={aboutFormData.storyTitle || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, storyTitle: e.target.value })}
                      placeholder="e.g. Who We Are"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Story Paragraph 1 (Origins & Vision)</label>
                    <textarea
                      rows={3}
                      value={aboutFormData.storyParagraph1 || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, storyParagraph1: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Story Paragraph 2 (Hologram Purity & Authenticity)</label>
                    <textarea
                      rows={3}
                      value={aboutFormData.storyParagraph2 || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, storyParagraph2: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  {/* Brand / Story Image using ImageUploadField */}
                  <div className="pt-2">
                    <ImageUploadField
                      label="About Page Brand / Heritage Image"
                      value={aboutFormData.storyImage || ''}
                      onChange={(newVal) => setAboutFormData({ ...aboutFormData, storyImage: newVal })}
                      aspect="wide"
                      presets={imagePresets}
                      helperText="Upload official brand photo, lab formulation, or holographic packaging picture directly from gallery or files."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: CORE PILLARS */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">3 Core Trust Promises & Pillars</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(aboutFormData.pillars || []).map((pillar, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px]">Pillar #{idx + 1}</span>
                        <input
                          type="text"
                          value={pillar.badge || ''}
                          onChange={(e) => {
                            const next = [...(aboutFormData.pillars || [])];
                            next[idx] = { ...next[idx], badge: e.target.value };
                            setAboutFormData({ ...aboutFormData, pillars: next });
                          }}
                          placeholder="Badge"
                          className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] w-24 text-right"
                        />
                      </div>

                      <input
                        type="text"
                        value={pillar.title || ''}
                        onChange={(e) => {
                          const next = [...(aboutFormData.pillars || [])];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setAboutFormData({ ...aboutFormData, pillars: next });
                        }}
                        placeholder="Pillar Title"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                      />

                      <textarea
                        rows={2}
                        value={pillar.desc || ''}
                        onChange={(e) => {
                          const next = [...(aboutFormData.pillars || [])];
                          next[idx] = { ...next[idx], desc: e.target.value };
                          setAboutFormData({ ...aboutFormData, pillars: next });
                        }}
                        placeholder="Description..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: WHATSAPP SPECIALIST CTA BANNER */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Bottom Skincare Advisory Call-To-Action Banner</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Banner Title</label>
                    <input
                      type="text"
                      value={aboutFormData.ctaTitle || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, ctaTitle: e.target.value })}
                      placeholder="e.g. Have questions about our formulations?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={aboutFormData.ctaButtonText || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, ctaButtonText: e.target.value })}
                      placeholder="e.g. Chat with Skincare Specialist"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Banner Subtitle Note</label>
                    <input
                      type="text"
                      value={aboutFormData.ctaSubtitle || ''}
                      onChange={(e) => setAboutFormData({ ...aboutFormData, ctaSubtitle: e.target.value })}
                      placeholder="e.g. Our skincare advisory team is available on WhatsApp 7 days a week."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes to About Us Page</span>
                </button>
              </div>

            </form>
          )}

          {/* ================================================================= */}
          {/* TAB: CUSTOMER REVIEWS & REAL BUYER TESTIMONIALS (USER REQUEST)    */}
          {/* ================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Header Customizer Box */}
              <form onSubmit={handleSaveReviewsHeader} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                      <span>Customer Reviews Section Settings</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure the headline, aggregate score, and review count badge displayed on the homepage.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewForm(initialReviewForm);
                        setIsReviewModalOpen(true);
                      }}
                      className="bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Customer Review</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Section Settings</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Section Top Badge</label>
                    <input
                      type="text"
                      value={reviewsHeaderForm.badge || ''}
                      onChange={(e) => setReviewsHeaderForm({ ...reviewsHeaderForm, badge: e.target.value })}
                      placeholder="e.g. Verified Experiences"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Section Main Heading</label>
                    <input
                      type="text"
                      value={reviewsHeaderForm.title || ''}
                      onChange={(e) => setReviewsHeaderForm({ ...reviewsHeaderForm, title: e.target.value })}
                      placeholder="e.g. Real Transformations, Real Stories"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-slate-700 block mb-1">Section Subtitle</label>
                    <input
                      type="text"
                      value={reviewsHeaderForm.subtitle || ''}
                      onChange={(e) => setReviewsHeaderForm({ ...reviewsHeaderForm, subtitle: e.target.value })}
                      placeholder="e.g. Read what authentic buyers have to say..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Aggregate Score Number</label>
                    <input
                      type="text"
                      value={reviewsHeaderForm.aggregateRating || ''}
                      onChange={(e) => setReviewsHeaderForm({ ...reviewsHeaderForm, aggregateRating: e.target.value })}
                      placeholder="e.g. 4.9"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Review Count Note</label>
                    <input
                      type="text"
                      value={reviewsHeaderForm.reviewCountText || ''}
                      onChange={(e) => setReviewsHeaderForm({ ...reviewsHeaderForm, reviewCountText: e.target.value })}
                      placeholder="e.g. Based on 2,840+ genuine buyer reviews"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </form>

              {/* Reviews Cards Grid */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Verified Customer Reviews ({reviewsList.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReviewId(null);
                      setReviewForm(initialReviewForm);
                      setIsReviewModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#5B4DF5] hover:text-[#4E3FE3] cursor-pointer"
                  >
                    + Add New Review
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviewsList.map((item) => {
                    const safeStars = Math.max(1, Math.min(5, Math.floor(Number(item.rating) || 5)));
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#5B4DF5]/40 transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          {/* Rating Stars & Verified Pill */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(safeStars)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            {item.verified !== false && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            "{item.title}"
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic">
                            "{item.review}"
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                          {item.productName && (
                            <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block truncate">
                              Item: {item.productName}
                            </span>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"}
                                alt={item.name}
                                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80";
                                }}
                              />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 block truncate">{item.name}</span>
                                <span className="text-[10px] text-slate-400 block truncate">{item.city} • {item.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditReview(item)}
                                className="p-1.5 text-slate-400 hover:text-[#5B4DF5] hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                                title="Edit Review"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteReview(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                title="Delete Review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: SALES & SHIPMENTS                                          */}
          {/* ================================================================= */}
          {activeTab === 'sales' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Sales & Fulfillment Orders</h2>
                  <p className="text-xs text-slate-500 mt-1">Track customer shipments, change live milestones, and process invoices.</p>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'pending', 'transit', 'delivered', 'returns'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-[#5B4DF5] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards */}
              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <div key={order.orderId} className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#5B4DF5] flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{order.orderId}</span>
                          <span className="text-[11px] text-slate-400">{order.date}</span>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.customer?.fullName || 'Customer'} • {order.customer?.phone || 'No phone'} • {order.customer?.city || ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-sm text-slate-900">₹{(Number(order.total) || 0).toLocaleString()}</span>
                        <span className="block text-[10px] text-slate-500">{order.paymentMethod || 'Prepaid'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-black hover:bg-slate-50 transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://wa.me/${String(order.customer?.phone || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customer?.fullName || '')},%20update%20for%20order%20${order.orderId || ''}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: CUSTOMERS DIRECTORY                                        */}
          {/* ================================================================= */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Customer Directory</h2>
                <p className="text-xs text-slate-500 mt-1">Verified customers from store orders and registrations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((o, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#5B4DF5] text-white flex items-center justify-center font-bold">
                        {o.customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{o.customer.fullName}</span>
                        <span className="text-slate-400 text-[11px] block">{o.customer.city}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-0.5">
                      <p>Phone: {o.customer.phone}</p>
                      <p>Address: {o.customer.address}</p>
                      <p className="font-bold text-emerald-700">Total Spend: ₹{o.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: ANALYTICS                                                  */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Gross Sales Revenue</span>
                  <span className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</span>
                  <span className="text-xs text-emerald-600 block mt-2">100% verified orders</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Total Catalog Formulations</span>
                  <span className="text-3xl font-black text-slate-900">{productsList.length}</span>
                  <span className="text-xs text-indigo-600 block mt-2">Active skincare solutions</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Average Order Value</span>
                  <span className="text-3xl font-black text-slate-900">
                    ₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}
                  </span>
                  <span className="text-xs text-slate-500 block mt-2">Across all customer checkouts</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: DASHBOARD OVERVIEW                                         */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block">Orders Count</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">{orders.length}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block">Categories Count</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">{cats.length}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                  <span className="text-xs text-slate-400 font-semibold block">Homepage Banners</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">{banners.length}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap gap-3">
                <a
                  href="/admin/products"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('products');
                  }}
                  className="bg-indigo-50 text-[#5B4DF5] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors inline-block"
                >
                  Manage Product List →
                </a>
                <a
                  href="/admin/categories"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('categories');
                  }}
                  className="bg-indigo-50 text-[#5B4DF5] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors inline-block"
                >
                  Manage Categories ({cats.length}) →
                </a>
                <a
                  href="/admin/banners"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('banners');
                  }}
                  className="bg-emerald-50 text-emerald-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors inline-block"
                >
                  Manage Website Banners →
                </a>
                <a
                  href="/admin/settings"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('settings');
                  }}
                  className="bg-rose-50 text-rose-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors inline-block"
                >
                  Customize Store Logo →
                </a>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: NOTIFICATIONS                                              */}
          {/* ================================================================= */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">System Notifications</h2>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-slate-700 flex items-center justify-between">
                  <span>Categories and Logo customizers are active and connected to the storefront.</span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 flex items-center justify-between">
                  <span>Website Hero Banners synchronized with real-time updates.</span>
                  <span className="text-[10px] text-slate-400">Today</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT (FULL-SCREEN STUDIO)                           */}
      {/* ========================================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Top Fullscreen Header Navigation Bar */}
          <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs z-20 shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B4DF5]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingProductId ? 'Edit Product Catalog Item' : 'Add New Product to Catalog'}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Full-Screen Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Comprehensive catalog manager with multi-photo gallery upload, pricing, and live inventory
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProductSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingProductId ? 'Update Product' : 'Add to Catalog'}</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <div className="max-w-5xl mx-auto">
              <form onSubmit={handleProductSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Vita Glow Advanced Night Cream"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="Glow Basket Select"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const catObj = cats.find(c => c.id === newCat || c.slug === newCat);
                        const firstSub = catObj?.subcategories?.[0]?.name || '';
                        setProductForm({ 
                          ...productForm, 
                          category: newCat,
                          subCategory: firstSub || productForm.subCategory
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    >
                      {cats.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subcategory</label>
                    {(() => {
                      const activeCat = cats.find(c => c.id === productForm.category || c.slug === productForm.category);
                      const subOptions = activeCat?.subcategories || [];

                      return (
                        <select
                          value={productForm.subCategory}
                          onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none font-semibold text-slate-800"
                        >
                          <option value="">Select Subcategory</option>
                          {subOptions.map(sub => (
                            <option key={sub.id || sub.slug} value={sub.name}>{sub.name}</option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="1399"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-[#5B4DF5] focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="75"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catalog Status</label>
                  <div className="flex items-center gap-3">
                    {['Active', 'Scheduled', 'Draft'].map(st => (
                      <label key={st} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="productStatus"
                          value={st}
                          checked={productForm.status === st}
                          onChange={() => setProductForm({ ...productForm, status: st })}
                          className="accent-[#5B4DF5]"
                        />
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                          st === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {st}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deal of the Day Toggle */}
                <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                      <span>⚡</span> Feature in "Deals of the Day" on Homepage
                    </span>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      Highlight this product in the limited-time Deal of the Day countdown section.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(productForm.isDealOfDay)}
                      onChange={(e) => setProductForm({ ...productForm, isDealOfDay: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Primary Product Photo */}
                <ImageUploadField
                  label="Primary Product Cover Photo *"
                  value={productForm.imageUrl}
                  onChange={(newVal) => setProductForm({ ...productForm, imageUrl: newVal })}
                  presets={imagePresets}
                  aspect="square"
                  helperText="Upload main product picture directly from device gallery or files."
                />

                {/* Additional Gallery Photos */}
                <MultiImageUploadField
                  label="Additional Product Gallery Photos"
                  images={productForm.images || []}
                  onChange={(nextList) => setProductForm({ ...productForm, images: nextList })}
                  helperText="Upload more angles, box packaging, back label, or texture photos from your gallery."
                />

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Product changes save instantly and sync across the entire website.
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddProductModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProductId ? 'Update Product' : 'Add to Catalog'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT CATEGORY (FULL-SCREEN STUDIO)                         */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Top Fullscreen Header Navigation Bar */}
          <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs z-20 shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Categories</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B4DF5]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingCategoryId ? 'Edit Category' : 'Create New Category'}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Full-Screen Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Category taxonomy, banners, badges, and direct navigation routes
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCategorySubmit}
                className="px-6 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingCategoryId ? 'Save Category Changes' : 'Create Category'}</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleCategorySubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g. Night Creams, Whitening Creams, Body Lotions"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">URL Slug (Auto or custom)</label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      placeholder="e.g. lips, eyes, face, nails, skincare"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={categoryForm.badge}
                    onChange={(e) => setCategoryForm({ ...categoryForm, badge: e.target.value })}
                    placeholder="e.g. Best Seller, Trending, New"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  />
                </div>

                <ImageUploadField
                  label="Category Card Thumbnail / Banner *"
                  value={categoryForm.bannerImg}
                  onChange={(newVal) => setCategoryForm({ ...categoryForm, bannerImg: newVal })}
                  aspect="wide"
                  presets={imagePresets.slice(0, 4)}
                  helperText="Upload category card banner directly from gallery or files (high-resolution landscape recommended)."
                />

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Short summary of this collection..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Subcategories (Inside this Category)
                  </label>
                  <input
                    type="text"
                    value={categoryForm.subcategoriesStr !== undefined ? categoryForm.subcategoriesStr : (categoryForm.subcategories ? categoryForm.subcategories.map(s => s.name).join(', ') : '')}
                    onChange={(e) => {
                      const str = e.target.value;
                      const arr = str.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
                        id: slugify(name),
                        name,
                        slug: slugify(name)
                      }));
                      setCategoryForm({
                        ...categoryForm,
                        subcategoriesStr: str,
                        subcategories: arr
                      });
                    }}
                    placeholder="e.g. Lip Oil, Lipsticks & Liners, Liquid Lipsticks, Gloss (comma-separated)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none text-xs"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Separate subcategory names with commas. Products will be organized inside these subcategories.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Category will update across the navigation bar and category grid.
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingCategoryId ? 'Save Category Changes' : 'Create Category'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: HERO SLIDER BANNER (FULL-SCREEN EDITOR STUDIO)                   */}
      {/* ========================================================================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Top Fullscreen Header Navigation Bar */}
          <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs z-20 shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Admin</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5B4DF5]">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingBannerId ? 'Edit Hero Slider Slide' : 'Create New Hero Slider Slide'}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Full-Screen Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Customize titles, promotional badges, button destinations, and photography with live sync
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBannerSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingBannerId ? 'Update Live Slide' : 'Publish Slide to Website'}</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <div className="max-w-5xl mx-auto">
              <form onSubmit={handleBannerSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-xs">
                
                {/* 📐 RECOMMENDED BANNER SIZES & RESOLUTIONS CALLOUT */}
                <div className="bg-gradient-to-r from-neutral-950 via-slate-900 to-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-md">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          📐 Recommended Banner Sizes
                        </span>
                        <span className="text-xs text-slate-400">Canva & Studio Specification</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Recommended Image Dimensions for High Conversions:</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs w-full md:w-auto">
                      <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                        <span className="text-slate-300 font-medium">🖥️ Desktop Full-Width:</span>
                        <span className="font-mono bg-black/60 text-amber-300 font-bold px-2 py-0.5 rounded text-xs">1920 × 600 px</span>
                      </div>
                      <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                        <span className="text-slate-300 font-medium">📱 Mobile Friendly:</span>
                        <span className="font-mono bg-black/60 text-emerald-300 font-bold px-2 py-0.5 rounded text-xs">1080 × 1080 px</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300">🎨 Canva Users:</span>
                      <span>Click <strong>"Create a design"</strong> &gt; <strong>"Custom size"</strong> &gt; enter <strong>1920 × 600 px</strong> (or 1600 × 500 px) for full-width layout.</span>
                    </div>
                    <span className="text-slate-400">Split Spotlight Image: <strong>800 × 800 px (1:1 Square)</strong></span>
                  </div>
                </div>

                {/* BANNER LAYOUT TYPE SELECTOR */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <span>Select Banner Layout Style</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Choose how your banner appears on the storefront</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div 
                      onClick={() => setBannerForm({ ...bannerForm, isGraphicBanner: true, bannerType: 'image' })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        bannerForm.isGraphicBanner 
                          ? 'border-[#5B4DF5] bg-indigo-50/50 shadow-xs ring-2 ring-indigo-200/50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        id="layoutGraphic"
                        name="bannerLayoutType"
                        checked={bannerForm.isGraphicBanner}
                        onChange={() => setBannerForm({ ...bannerForm, isGraphicBanner: true, bannerType: 'image' })}
                        className="mt-1 accent-[#5B4DF5]"
                      />
                      <label htmlFor="layoutGraphic" className="cursor-pointer space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">🖥️ Full-Width Graphic Banner</span>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">Recommended</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Matches Dr. Sheth's & Lakmé design. Displays your full <strong>1920 × 600 px</strong> panoramic artwork edge-to-edge with customizable floating action button.
                        </p>
                      </label>
                    </div>

                    <div 
                      onClick={() => setBannerForm({ ...bannerForm, isGraphicBanner: false, bannerType: 'split' })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        !bannerForm.isGraphicBanner 
                          ? 'border-[#5B4DF5] bg-indigo-50/50 shadow-xs ring-2 ring-indigo-200/50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        id="layoutSplit"
                        name="bannerLayoutType"
                        checked={!bannerForm.isGraphicBanner}
                        onChange={() => setBannerForm({ ...bannerForm, isGraphicBanner: false, bannerType: 'split' })}
                        className="mt-1 accent-[#5B4DF5]"
                      />
                      <label htmlFor="layoutSplit" className="cursor-pointer space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">✨ Split Layout (Text + Spotlight Card)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Displays headline, offer pills, and 2 CTA buttons on left, with a square <strong>800 × 800 px</strong> product card on the right.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Headline Title (Big Bold Text) *</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="Vita Glow Advanced Night Creams"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Top Tagline Badge</label>
                    <input
                      type="text"
                      value={bannerForm.tag}
                      onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                      placeholder="India's #1 Night Cream Formula"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subtitle Description Text</label>
                  <textarea
                    rows={2}
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="Unleash overnight radiance with pure L-Glutathione & Kojic Acid. Visibly reduces dark spots, pigmentation & sun tan in 7 days."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Offer Pill Text</label>
                    <input
                      type="text"
                      value={bannerForm.offerText}
                      onChange={(e) => setBannerForm({ ...bannerForm, offerText: e.target.value })}
                      placeholder="FLAT 30% OFF + FREE COD"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Authenticity Text</label>
                    <input
                      type="text"
                      value={bannerForm.guaranteeText}
                      onChange={(e) => setBannerForm({ ...bannerForm, guaranteeText: e.target.value })}
                      placeholder="100% Genuine Hologram Verified"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={bannerForm.coupon}
                      onChange={(e) => setBannerForm({ ...bannerForm, coupon: e.target.value.toUpperCase() })}
                      placeholder="GLOW20"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono uppercase focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>

                {/* Buttons CTA & URL Link Settings */}
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-indigo-100/80">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#5B4DF5]" />
                      <span className="font-bold text-slate-900 text-xs">
                        Banner Buttons & Target URL Links
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Customize where the buttons navigate (product page, category, catalog, or custom URL)
                    </span>
                  </div>

                  {/* Primary Button URL Settings */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Primary Button Label (Main Action Button) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bannerForm.ctaText}
                          onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                          placeholder="Shop Night Creams"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Primary Button Target URL Link *
                        </label>
                        <input
                          type="text"
                          required
                          value={bannerForm.ctaLink}
                          onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                          placeholder="/product/vita-glow-advanced-night-cream"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-[#5B4DF5] font-bold focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Select Target Dropdown */}
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        ⚡ Quick Select Destination URL (Auto-fills URL):
                      </label>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            setBannerForm({ ...bannerForm, ctaLink: e.target.value });
                          }
                        }}
                        className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#5B4DF5] outline-none cursor-pointer"
                      >
                        <option value="">-- Choose a Product, Category, or Page to auto-set URL --</option>
                        <optgroup label="Popular Products (Direct Product Page)">
                          {productsList.map(p => (
                            <option key={p.id} value={`/product/${p.slug || slugify(p.name)}`}>
                              {p.name} (/product/{p.slug || slugify(p.name)})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Store Categories">
                          {cats.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={`/category/${cat.slug || cat.id}`}>
                              {cat.name} (/category/{cat.slug || cat.id})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Standard Store Pages">
                          <option value="/shop">All Products Catalog (/shop)</option>
                          <option value="/about-us">About Us Page (/about-us)</option>
                          <option value="/contact-us">Customer Support (/contact-us)</option>
                          <option value="/blog">Herbal Skincare Blog (/blog)</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Preset Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">One-Click Presets:</span>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, ctaLink: '/product/vita-glow-advanced-night-cream' })}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold transition-colors cursor-pointer"
                      >
                        ✨ Vita Glow Product
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, ctaLink: '/category/skincare' })}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold transition-colors cursor-pointer"
                      >
                        🧴 Skincare Category
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, ctaLink: '/category/lips' })}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold transition-colors cursor-pointer"
                      >
                        💄 Lips Category
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, ctaLink: '/shop' })}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
                      >
                        🛍️ Full Catalog (/shop)
                      </button>
                    </div>
                  </div>

                  {/* Secondary Button Settings */}
                  <div className="pt-3 border-t border-indigo-100/70 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Secondary Button Label (White Button)
                      </label>
                      <input
                        type="text"
                        value={bannerForm.secondaryCtaText}
                        onChange={(e) => setBannerForm({ ...bannerForm, secondaryCtaText: e.target.value })}
                        placeholder="View Full Catalog"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Secondary Button Target URL Link
                      </label>
                      <input
                        type="text"
                        value={bannerForm.secondaryCtaLink}
                        onChange={(e) => setBannerForm({ ...bannerForm, secondaryCtaLink: e.target.value })}
                        placeholder="/shop"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-[#5B4DF5] font-semibold focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload Customizer with Exact Dimensions */}
                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">
                        {bannerForm.isGraphicBanner ? '🖥️ Full-Width Graphic Banner Artwork' : '📦 Spotlight Product Card Photo & Badges'}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        {bannerForm.isGraphicBanner 
                          ? 'This image will stretch edge-to-edge across the entire website header.'
                          : 'This image will sit inside the right-hand spotlight product box.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-slate-500">Required Size:</span>
                      <span className="font-mono text-[11px] font-black bg-white text-[#5B4DF5] px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                        {bannerForm.isGraphicBanner ? '1920 × 600 px (Wide)' : '800 × 800 px (Square)'}
                      </span>
                    </div>
                  </div>

                  <ImageUploadField
                    label={bannerForm.isGraphicBanner ? "Full-Width Graphic Artwork (1920 × 600 px) *" : "Spotlight Product Card Photo (800 × 800 px) *"}
                    value={bannerForm.image}
                    onChange={(newVal) => setBannerForm({ ...bannerForm, image: newVal })}
                    aspect={bannerForm.isGraphicBanner ? "banner" : "contain"}
                    presets={[
                      { label: "Dr. Sheth's AM-to-PM (1920×600)", url: "/banners/dr-sheths-am-pm-routine.jpg" },
                      { label: "Lakmé 9 to 5 Hya Glam (1920×600)", url: "/banners/classic-glow-hero-clean.jpg" },
                      { label: "Herbal Beauty Formulations (1200×600)", url: "https://images.unsplash.com/photo-1608248597359-25f0a8ea74f5?auto=format&fit=crop&w=1200&q=80" },
                      { label: "Vita Glow Night Cream Jar (800×800)", url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" },
                      { label: "Handcrafted Herbal Soap Bar (800×800)", url: "https://images.unsplash.com/photo-1607006314647-79a6d05634e7?auto=format&fit=crop&w=800&q=80" },
                      { label: "Face Serum Dropper Bottle (800×800)", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" }
                    ]}
                    helperText={
                      bannerForm.isGraphicBanner 
                        ? "Upload your 1920 × 600 px Canva or Photoshop panoramic artwork directly from gallery or device files."
                        : "Upload an 800 × 800 px square product picture or jar photo for the right-hand card."
                    }
                  />

                  {/* Badges for Split Layout */}
                  {!bannerForm.isGraphicBanner && (
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Product Card Floating Badges:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Card Tag</label>
                          <input
                            type="text"
                            value={bannerForm.dispatchTag}
                            onChange={(e) => setBannerForm({ ...bannerForm, dispatchTag: e.target.value })}
                            placeholder="Fast Dispatch"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Delivery Description</label>
                          <input
                            type="text"
                            value={bannerForm.dispatchText}
                            onChange={(e) => setBannerForm({ ...bannerForm, dispatchText: e.target.value })}
                            placeholder="Delivery Across India in 2-4 Days"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Stock Badge</label>
                          <input
                            type="text"
                            value={bannerForm.stockBadge}
                            onChange={(e) => setBannerForm({ ...bannerForm, stockBadge: e.target.value })}
                            placeholder="In Stock"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Radio */}
                <div className="flex items-center gap-3">
                  <label className="font-bold text-slate-700">Banner Live Status:</label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="modalBannerStatus"
                      value="Active"
                      checked={bannerForm.status === 'Active'}
                      onChange={() => setBannerForm({ ...bannerForm, status: 'Active', active: true })}
                      className="accent-[#5B4DF5]"
                    />
                    <span className="text-emerald-700 font-bold">Active (Live on Website)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="modalBannerStatus"
                      value="Draft"
                      checked={bannerForm.status === 'Draft'}
                      onChange={() => setBannerForm({ ...bannerForm, status: 'Draft', active: false })}
                      className="accent-[#5B4DF5]"
                    />
                    <span className="text-amber-700 font-bold">Draft (Hidden)</span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Changes will reflect instantly on your live homepage slider.
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBannerModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingBannerId ? 'Update Live Slide' : 'Publish Slide to Website'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CUSTOMER REVIEW (FULL-SCREEN STUDIO)                     */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Top Fullscreen Header Navigation Bar */}
          <div className="bg-white border-b border-slate-200 px-6 sm:px-10 py-4 flex items-center justify-between shadow-xs z-20 shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Reviews</span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {editingReviewId ? 'Edit Customer Review' : 'Add New Customer Review'}
                    </h3>
                    <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Full-Screen Studio
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Manage buyer testimonial, ratings, verified buyer badge, and customer photo
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingReviewId ? 'Update Review' : 'Save Review'}</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleReviewSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="e.g. Pooja Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / State</label>
                    <input
                      type="text"
                      value={reviewForm.city}
                      onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Rating (Stars)</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                      <option value={2}>★★☆☆☆ (2 Stars)</option>
                      <option value={1}>★☆☆☆☆ (1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Review Date</label>
                    <input
                      type="text"
                      value={reviewForm.date}
                      onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                      placeholder="e.g. 2 days ago"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                    />
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={reviewForm.verified}
                        onChange={(e) => setReviewForm({ ...reviewForm, verified: e.target.checked })}
                        className="accent-[#5B4DF5] rounded w-4 h-4"
                      />
                      <span className="font-bold text-slate-700">Verified Buyer</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Purchased</label>
                  <input
                    type="text"
                    value={reviewForm.productName}
                    onChange={(e) => setReviewForm({ ...reviewForm, productName: e.target.value })}
                    placeholder="e.g. Vita Glow Advanced Night Cream"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Review Headline / Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="e.g. Visible results in just 10 days!"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Review Message / Feedback *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                    placeholder="Customer's honest experience and product review..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-[#5B4DF5] outline-none"
                  />
                </div>

                {/* Customer Photo Upload (Gallery / Files / URL) */}
                <ImageUploadField
                  label="Customer Profile Photo / Avatar"
                  value={reviewForm.avatar}
                  onChange={(newVal) => setReviewForm({ ...reviewForm, avatar: newVal })}
                  aspect="square"
                  presets={[
                    { label: "Pooja (Female 1)", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
                    { label: "Sneha (Female 2)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
                    { label: "Rahul (Male 1)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
                    { label: "Ananya (Female 3)", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }
                  ]}
                  helperText="Upload customer photo from gallery or device files."
                />

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Review will display in the Customer Reviews section on the homepage.
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-[#5B4DF5] hover:bg-[#4E3FE3] text-white font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingReviewId ? 'Update Review' : 'Add to Website Reviews'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PRINTABLE TAX INVOICE                                            */}
      {/* ========================================================================= */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl border border-slate-200 my-8 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#5B4DF5]" />
                <h3 className="text-base font-bold text-slate-900">Tax Invoice / Slip</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#5B4DF5] text-white px-3 py-1.5 rounded-xl font-bold hover:bg-[#4E3FE3] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button onClick={() => setInvoiceOrder(null)} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-black text-lg text-slate-900">{storeInfo?.storeName || 'Glow Basket'}</h4>
                  <p className="text-[11px] text-slate-400">{storeInfo?.businessAddress || ''}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-900">#{invoiceOrder.orderId}</span>
                  <span className="block text-[11px] text-slate-400">{invoiceOrder.date}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="font-bold text-slate-900">{invoiceOrder.customer?.fullName || 'Customer'}</p>
                <p>{invoiceOrder.customer?.address || ''}, {invoiceOrder.customer?.city || ''} ({invoiceOrder.customer?.pincode || ''})</p>
                <p>Phone: {invoiceOrder.customer?.phone || ''}</p>
              </div>

              <div className="divide-y divide-slate-100">
                {(Array.isArray(invoiceOrder?.items) ? invoiceOrder.items : []).map(item => (
                  <div key={item.id} className="py-2 flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-base text-slate-900">
                <span>Total Amount:</span>
                <span className="text-[#5B4DF5]">₹{invoiceOrder.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
