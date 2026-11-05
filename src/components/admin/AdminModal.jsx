import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/categories';
import { 
  X, 
  Settings, 
  Save, 
  Package, 
  ShoppingBag, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Image as ImageIcon, 
  AlertTriangle, 
  Eye, 
  Sparkles, 
  Flame, 
  Check, 
  Tag, 
  LogOut,
  Truck,
  Printer,
  MessageCircle,
  FileText,
  Clock,
  MapPin,
  TrendingUp,
  Percent,
  Banknote,
  Send,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AdminModal = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    storeInfo, 
    setStoreInfo, 
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
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout, 
    addToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // Default to Orders so admin can immediately manage tracking & returns!
  
  // Admin Login Screen state (when not authenticated)
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Orders Management State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null); // When printing / viewing invoice

  // Return / Refund Modal State
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Customer reported defect / wrong size');
  const [refundAmount, setRefundAmount] = useState('');

  // Catalog State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponType, setNewCouponType] = useState('percent'); // 'percent' | 'flat'
  const [newCouponMin, setNewCouponMin] = useState('499');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Form Fields for Add / Edit Product
  const initialFormState = {
    name: '',
    brand: 'Classic Glow Select',
    category: 'whitening-creams',
    subCategory: 'Whitening Creams',
    price: '',
    originalPrice: '',
    stock: 25,
    badge: 'New Arrival',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Advanced herbal formulation for illuminated and radiant glowing skin.',
    size: '50g',
    featured: true,
    isDealOfDay: false
  };
  const [productForm, setProductForm] = useState(initialFormState);

  // Editable Store Info Form
  const [formData, setFormData] = useState({ ...storeInfo });

  if (!isAdminOpen) return null;

  // Preset Beauty Images for quick selection
  const imagePresets = [
    { label: "Night Cream Jar", url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" },
    { label: "Gold Cream Jar", url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" },
    { label: "Face Serum Dropper", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" },
    { label: "Herbal Soap Bar", url: "https://images.unsplash.com/photo-1607006314647-79a6d05634e7?auto=format&fit=crop&w=800&q=80" },
    { label: "Cleanser Tube", url: "https://images.unsplash.com/photo-1556228722-d0b5d045d654?auto=format&fit=crop&w=800&q=80" },
    { label: "Wellness Bottle", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" }
  ];

  const handleAdminAuth = (e) => {
    e.preventDefault();
    setLoginError('');
    const ok = adminLogin(loginUser, loginPass);
    if (!ok) {
      setLoginError('Invalid credentials. Default: admin / admin123');
    }
  };

  const handleSaveBranding = (e) => {
    e.preventDefault();
    setStoreInfo(formData);
    addToast('Store settings & brand identity updated successfully!', 'success');
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const isPct = newCouponType === 'percent';
    const success = addPromoCode({
      code: newCouponCode,
      discountPercent: isPct ? Number(newCouponDiscount) : 0,
      discountAmount: !isPct ? Number(newCouponDiscount) : 0,
      minAmount: Number(newCouponMin) || 0,
      description: newCouponDesc || `${newCouponDiscount}${isPct ? '%' : '₹'} OFF on orders`
    });
    if (success) {
      setNewCouponCode('');
      setNewCouponDiscount('');
      setNewCouponDesc('');
    }
  };

  const handleProductFormSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      addToast('Please provide Product Name and Price', 'error');
      return;
    }
    if (editingProductId) {
      updateProduct(editingProductId, {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
        stock: Number(productForm.stock) || 10,
        images: [productForm.imageUrl]
      });
      setEditingProductId(null);
    } else {
      addProduct({
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
        stock: Number(productForm.stock) || 10,
        images: [productForm.imageUrl]
      });
    }
    setProductForm(initialFormState);
    setIsAddFormOpen(false);
  };

  const startEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      subCategory: prod.subCategory || 'Skin Care',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      badge: prod.badge || '',
      imageUrl: prod.images[0] || '',
      shortDescription: prod.shortDescription || '',
      size: prod.size || '50g',
      featured: Boolean(prod.featured),
      isDealOfDay: Boolean(prod.isDealOfDay)
    });
    setIsAddFormOpen(true);
  };

  const handleConfirmReturn = (e) => {
    e.preventDefault();
    if (!returnModalOrder) return;
    processOrderReturn(
      returnModalOrder.orderId,
      returnReason,
      refundAmount || returnModalOrder.total,
      'Returned & Refunded'
    );
    setReturnModalOrder(null);
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const inTransitCount = orders.filter(o => ['In Transit', 'Dispatched', 'Out for Delivery'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const returnedCount = orders.filter(o => o.status.toLowerCase().includes('return')).length;

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !orderSearch.trim() ||
      order.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.phone.replace(/\D/g, '').includes(orderSearch.replace(/\D/g, '')) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()));
    
    let matchesStatus = true;
    if (orderStatusFilter === 'pending') {
      matchesStatus = ['Confirmed', 'Processing', 'Packed'].includes(order.status);
    } else if (orderStatusFilter === 'transit') {
      matchesStatus = ['In Transit', 'Dispatched', 'Out for Delivery'].includes(order.status);
    } else if (orderStatusFilter === 'delivered') {
      matchesStatus = order.status === 'Delivered';
    } else if (orderStatusFilter === 'returns') {
      matchesStatus = order.status.toLowerCase().includes('return');
    }
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = productsList.filter(prod => {
    const matchesSearch = !catalogSearch.trim() ||
      prod.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      prod.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCat = catalogCategory === 'all' || prod.category === catalogCategory;
    return matchesSearch && matchesCat;
  });

  // GUARD: IF NOT LOGGED IN AS ADMIN
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
        >
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Admin Verification Required</h3>
                <p className="text-[11px] text-slate-400">Only authorized store administrators can login</p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAdminAuth} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin Username *
              </label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin Password *
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900">
              <strong>Admin Credentials:</strong> Username: <code className="font-bold">admin</code> | Password: <code className="font-bold">admin123</code>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl border border-slate-100 my-4 animate-in zoom-in-95 duration-200 flex flex-col max-h-[94vh]"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Store Administration & Fulfillment Suite</h2>
                <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  Admin Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Track shipments, update order milestones, process returns, manage products & coupons
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="Sign out of Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 border-b border-slate-100 bg-slate-50 shrink-0 overflow-x-auto">
          {/* Tab 1: Orders & Tracking */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-500" />
            <span>Orders & Live Tracking</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.2 rounded-full">
              {orders.length}
            </span>
          </button>

          {/* Tab 2: Products */}
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-rose-500" />
            <span>Products Catalog</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {productsList.length}
            </span>
          </button>

          {/* Tab 3: Coupons */}
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Percent className="w-4 h-4 text-emerald-500" />
            <span>Coupons & Discounts</span>
          </button>

          {/* Tab 4: Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-sky-500" />
            <span>Sales & Analytics</span>
          </button>

          {/* Tab 5: Branding */}
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Store Identity</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: ALL ORDERS & TRACKING / RECEIPTS / RETURNS MANAGEMENT             */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Orders</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{totalOrdersCount}</div>
                </div>

                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-bold uppercase">Active In-Transit</span>
                  <div className="text-xl font-black text-amber-600 mt-0.5">{inTransitCount}</div>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Delivered</span>
                  <div className="text-xl font-black text-emerald-600 mt-0.5">{deliveredCount}</div>
                </div>

                <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200">
                  <span className="text-[10px] text-rose-800 font-bold uppercase">Returns / Refunds</span>
                  <div className="text-xl font-black text-rose-600 mt-0.5">{returnedCount}</div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID (AG-...), Customer Name, Phone, AWB..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: 'Pending / Packed' },
                    { id: 'transit', label: 'In Transit' },
                    { id: 'delivered', label: 'Delivered' },
                    { id: 'returns', label: 'Returns' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        orderStatusFilter === tab.id
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List Table */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                    No orders match your search criteria.
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const isExpanded = expandedOrderId === order.orderId;
                    const isReturn = order.status.toLowerCase().includes('return');
                    const isDelivered = order.status === 'Delivered';

                    return (
                      <div
                        key={order.orderId}
                        className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs ${
                          isExpanded ? 'border-rose-300 ring-2 ring-rose-50 shadow-md' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Summary Header Row */}
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${
                              isReturn ? 'bg-rose-600' : isDelivered ? 'bg-emerald-600' : 'bg-slate-900'
                            }`}>
                              {isReturn ? <RotateCcw className="w-5 h-5" /> : isDelivered ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5 text-amber-400" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-sm text-slate-900">{order.orderId}</span>
                                <span className="text-[10px] text-slate-400">{order.date}</span>
                                
                                {/* Status pill */}
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                  isReturn
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : isDelivered
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                                }`}>
                                  {order.status}
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                                <strong>{order.customer.fullName}</strong>
                                <span>•</span>
                                <span>{order.customer.phone}</span>
                                <span>•</span>
                                <span className="text-slate-500">{order.customer.city} ({order.customer.pincode})</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Action Buttons */}
                          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <div className="text-left md:text-right">
                              <div className="text-base font-black text-slate-900">₹{order.total.toLocaleString()}</div>
                              <span className="text-[10px] text-emerald-600 font-semibold">{order.paymentMethod}</span>
                            </div>

                            {/* View / Print Receipt */}
                            <button
                              onClick={() => setInvoiceOrder(order)}
                              className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Print / View Customer Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* WhatsApp Direct */}
                            <a
                              href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(order.customer.fullName)}%2C%20update%20regarding%20your%20Order%20${order.orderId}%20from%20${encodeURIComponent(storeInfo.storeName)}%3A%20Status%20is%20${encodeURIComponent(order.status)}.%20AWB%3A%20${order.trackingNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Send WhatsApp Update to Customer"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Expand / Manage Drawer */}
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                            >
                              <span>Manage</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* EXPANDED CONTROL PANEL FOR THIS ORDER */}
                        {isExpanded && (
                          <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-200">
                            
                            {/* 1. STATUS & TRACKING UPDATE BAR */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                  Update Order Status:
                                </label>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Allocated & Packed">Allocated & Packed</option>
                                  <option value="Dispatched">Dispatched from Hub</option>
                                  <option value="In Transit">In Transit</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Return Requested">Return Requested</option>
                                  <option value="Returned & Refunded">Returned & Refunded</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                  Courier Partner:
                                </label>
                                <select
                                  value={order.courier || 'Delhivery Air Express'}
                                  onChange={(e) => updateOrderTracking(order.orderId, order.trackingNumber, e.target.value, order.estimatedDelivery)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                                >
                                  <option value="Delhivery Air Express">Delhivery Air Express</option>
                                  <option value="BlueDart Express">BlueDart Express</option>
                                  <option value="XpressBees Priority">XpressBees Priority</option>
                                  <option value="DTDC Air Courier">DTDC Air Courier</option>
                                  <option value="Shadowfax Local">Shadowfax Local</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                  AWB Tracking Number:
                                </label>
                                <input
                                  type="text"
                                  defaultValue={order.trackingNumber || ''}
                                  onBlur={(e) => updateOrderTracking(order.orderId, e.target.value, order.courier, order.estimatedDelivery)}
                                  placeholder="e.g. DLV98421098IN"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                                />
                              </div>

                              {/* Process Return Button */}
                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReturnModalOrder(order);
                                    setRefundAmount(order.total);
                                  }}
                                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Process Return / Refund</span>
                                </button>
                              </div>
                            </div>

                            {/* 2. ORDER ITEMS & CUSTOMER ADDRESS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Left: Items list */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                                  <span>Purchased Items ({order.items.length})</span>
                                  <span className="text-slate-400 font-normal">Subtotal: ₹{order.subtotal}</span>
                                </h4>
                                <div className="space-y-2">
                                  {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                                      {item.image && (
                                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                                        <span className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</span>
                                      </div>
                                      <span className="text-xs font-bold text-slate-900">₹{item.price * item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right: Full Shipping Details & Return Log */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                                <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                                  Customer Shipping Destination
                                </h4>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
                                  <p className="font-bold text-slate-900">{order.customer.fullName}</p>
                                  <p>{order.customer.address}</p>
                                  {order.customer.landmark && <p>Landmark: {order.customer.landmark}</p>}
                                  <p>{order.customer.city}, {order.customer.state} - <strong>{order.customer.pincode}</strong></p>
                                  <p>Contact: {order.customer.phone} {order.customer.email ? `• ${order.customer.email}` : ''}</p>
                                </div>

                                {order.returnInfo && (
                                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                                    <div className="font-bold flex items-center gap-1.5 text-xs">
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>Return & Refund Record:</span>
                                    </div>
                                    <p className="text-[11px]">Reason: {order.returnInfo.reason}</p>
                                    <p className="text-[11px]">Refunded: ₹{order.returnInfo.refundAmount} on {order.returnInfo.processedAt}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 3. SHIPMENT TIMELINE RECORD */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Shipment Timeline Milestones (Live on Tracking Page)
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                                {order.timeline.map((step, idx) => (
                                  <div key={idx} className={`p-2.5 rounded-xl border text-[11px] ${
                                    step.completed
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                      : 'bg-slate-50 border-slate-200 text-slate-400'
                                  }`}>
                                    <div className="font-bold flex items-center gap-1">
                                      <span>{step.completed ? '✓' : idx + 1}.</span>
                                      <span className="truncate">{step.title}</span>
                                    </div>
                                    <div className="text-[10px] mt-0.5">{step.time}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCTS CATALOG (ADD / EDIT / DELETE ITEMS)                       */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search items by name, brand, SKU..."
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  <select
                    value={catalogCategory}
                    onChange={(e) => setCatalogCategory(e.target.value)}
                    className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-2 px-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (isAddFormOpen && !editingProductId) {
                      setIsAddFormOpen(false);
                    } else {
                      setEditingProductId(null);
                      setProductForm(initialFormState);
                      setIsAddFormOpen(true);
                    }
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddFormOpen && !editingProductId ? 'Close Form' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add / Edit Form */}
              {isAddFormOpen && (
                <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-5 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {editingProductId ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                      <span>{editingProductId ? 'Edit Product Details' : 'Add New Product to Store'}</span>
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddFormOpen(false);
                        setEditingProductId(null);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleProductFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="e.g. Vita Glow Platinum Cream"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.brand}
                          onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                          placeholder="e.g. Vita Glow"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                        >
                          {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="1399"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Original Price / MRP (₹)</label>
                        <input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          placeholder="1999"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Stock Count *</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          placeholder="25"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                        <select
                          value={productForm.badge}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
                        >
                          <option value="New Arrival">New Arrival</option>
                          <option value="Best Seller">Best Seller</option>
                          <option value="Trending">Trending</option>
                          <option value="Top Rated">Top Rated</option>
                          <option value="100% Herbal">100% Herbal</option>
                          <option value="Doctor Formulated">Doctor Formulated</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Pack Size / Weight</label>
                        <input
                          type="text"
                          value={productForm.size}
                          onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                          placeholder="50g Jar"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                      <input
                        type="url"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none mb-1.5"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400">Presets:</span>
                        {imagePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProductForm({ ...productForm, imageUrl: preset.url })}
                            className="text-[10px] px-2 py-0.5 rounded-lg border bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Short Description *</label>
                      <textarea
                        rows={2}
                        value={productForm.shortDescription}
                        onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="accent-rose-600"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.isDealOfDay}
                          onChange={(e) => setProductForm({ ...productForm, isDealOfDay: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <span>Deal of the Day</span>
                      </label>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddFormOpen(false);
                          setEditingProductId(null);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
                      >
                        {editingProductId ? 'Update Product' : 'Save & Publish Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xs bg-white">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between">
                  <span>Store Products ({filteredProducts.length})</span>
                  <button
                    onClick={resetProductsToDefault}
                    className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Default 12 Products</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                  {filteredProducts.map(prod => (
                    <div key={prod.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-bold text-rose-600 uppercase">{prod.brand}</span>
                            {prod.badge && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">{prod.badge}</span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                          <span className="text-[11px] text-slate-400 capitalize">{prod.category.replace('-', ' ')} • SKU: {prod.sku} • {prod.stock} in stock</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900">₹{prod.price}</span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-slate-400 line-through block">₹{prod.originalPrice}</span>
                          )}
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => startEditProduct(prod)}
                          className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button with Confirmation */}
                        {confirmDeleteId === prod.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl">
                            <span className="text-[10px] font-bold text-rose-700 px-1">Delete?</span>
                            <button
                              onClick={() => {
                                deleteProduct(prod.id);
                                setConfirmDeleteId(null);
                              }}
                              className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-slate-500 text-[10px] px-1 cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(prod.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 cursor-pointer"
                            title="Remove Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: COUPONS & DISCOUNT PROMOTIONS                                      */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              
              {/* Create Promo Code Form */}
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span>Create New Discount Coupon</span>
                </h3>

                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. GLOW25"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="percent">Percentage (% OFF)</option>
                      <option value="flat">Flat Amount (₹ OFF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Discount Value ({newCouponType === 'percent' ? '%' : '₹'}) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      placeholder={newCouponType === 'percent' ? '20' : '200'}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(e.target.value)}
                      placeholder="499"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Coupon</span>
                  </button>
                </form>
              </div>

              {/* Active Coupons List */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-xs bg-white">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                  Active Store Discount Coupons ({storeInfo.promoCodes.length})
                </div>

                <div className="divide-y divide-slate-100">
                  {storeInfo.promoCodes.map((promo, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-mono font-black text-xs flex items-center justify-center">
                          %
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {promo.code}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                              {promo.discountPercent ? `${promo.discountPercent}% OFF` : `₹${promo.discountAmount} OFF`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {promo.description} • Minimum Order: ₹{promo.minAmount}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deletePromoCode(promo.code)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SALES & ANALYTICS OVERVIEW                                         */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-6 rounded-3xl space-y-1 shadow-md">
                  <span className="text-xs text-slate-400 font-bold uppercase">Gross Store Revenue</span>
                  <div className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
                  <p className="text-[11px] text-emerald-400 pt-1">100% of recorded customer checkouts</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-1 shadow-xs">
                  <span className="text-xs text-slate-400 font-bold uppercase">Average Order Value (AOV)</span>
                  <div className="text-3xl font-black text-slate-900">
                    ₹{totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount).toLocaleString() : 0}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">Across all product categories</p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-1 shadow-xs">
                  <span className="text-xs text-slate-400 font-bold uppercase">Successful Delivery Rate</span>
                  <div className="text-3xl font-black text-emerald-600">
                    {totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 100}%
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">Via Delhivery & BlueDart Air</p>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Payment Channels Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Cash On Delivery (COD)</span>
                      <p className="text-[11px] text-slate-500">Most preferred payment method across India</p>
                    </div>
                    <span className="text-base font-black text-slate-900">
                      {orders.filter(o => o.paymentMethod.includes('COD')).length} orders
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Prepaid UPI / Cards / Netbanking</span>
                      <p className="text-[11px] text-slate-500">Zero contact prepaid transactions</p>
                    </div>
                    <span className="text-base font-black text-slate-900">
                      {orders.filter(o => !o.paymentMethod.includes('COD')).length} orders
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: BRANDING IDENTITY & SETTINGS                                       */}
          {/* ========================================================================= */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900">
                <strong>💡 Live Brand Customization:</strong> Change the store name, contact numbers, email, or address. Once you click "Save Brand Updates", the header, logo, footer, announcement banner, and checkout will update instantly!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Store / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Store Tagline</label>
                  <input
                    type="text"
                    value={formData.storeTagline}
                    onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">WhatsApp Helpline Number *</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Phone Call Support Number</label>
                  <input
                    type="text"
                    value={formData.supportPhone}
                    onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Customer Care Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Free Shipping Minimum Threshold (₹)</label>
                  <input
                    type="number"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800 block mb-1">Office / Dispatch Address</label>
                  <textarea
                    rows={2}
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('glowbasket_store_info');
                    localStorage.removeItem('auraglow_store_info');
                    window.location.reload();
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Original Settings</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Brand Updates</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: RETURN / REFUND PROCESSING MODAL ("RETAINT BACK")               */}
      {/* ========================================================================= */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Process Return & Refund</h3>
                  <p className="text-[11px] text-slate-400">Order ID: {returnModalOrder.orderId}</p>
                </div>
              </div>
              <button onClick={() => setReturnModalOrder(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Return *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Customer reported defect / seal issue">Customer reported defect / seal issue</option>
                  <option value="Transit package damage">Transit package damage</option>
                  <option value="Wrong product delivered">Wrong product delivered</option>
                  <option value="Customer requested replacement">Customer requested replacement</option>
                  <option value="Cancelled by customer before dispatch">Cancelled by customer before dispatch</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Refund / Credit Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={String(returnModalOrder.total)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                This action will mark the order as <strong>Returned & Refunded</strong>, add a return milestone to customer tracking, and record the refund entry.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Return & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRINTABLE TAX INVOICE & RECEIPT                                  */}
      {/* ========================================================================= */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Tax Invoice / Order Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button onClick={() => setInvoiceOrder(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Canvas */}
            <div className="space-y-6 text-xs text-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-serif font-black text-slate-900">{storeInfo.storeName}</h2>
                  <p className="text-[11px] text-slate-500">{storeInfo.storeTagline}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{storeInfo.businessAddress}</p>
                  <p className="text-[11px] text-slate-500">Helpline: {storeInfo.supportPhone}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-sm text-slate-900">INVOICE #{invoiceOrder.orderId}</div>
                  <div className="text-[11px] text-slate-400">Date: {invoiceOrder.date}</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1">{invoiceOrder.paymentMethod}</div>
                  <div className="text-[11px] text-slate-500 font-mono">AWB: {invoiceOrder.trackingNumber}</div>
                </div>
              </div>

              {/* Billed to */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Delivery Details:</span>
                <p className="font-bold text-slate-900">{invoiceOrder.customer.fullName}</p>
                <p>{invoiceOrder.customer.address}, {invoiceOrder.customer.city} ({invoiceOrder.customer.pincode})</p>
                <p>Phone: {invoiceOrder.customer.phone}</p>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceOrder.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-2 font-medium">{item.name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">₹{item.price}</td>
                      <td className="py-2 text-right font-bold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Calculations */}
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <div className="w-48 space-y-1 text-right text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{invoiceOrder.subtotal}</span>
                  </div>
                  {invoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-₹{invoiceOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping:</span>
                    <span>{invoiceOrder.shipping === 0 ? 'FREE' : `₹${invoiceOrder.shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-rose-600">₹{invoiceOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100">
                Thank you for shopping with {storeInfo.storeName}! For queries, contact {storeInfo.supportEmail}.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
