import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Settings, 
  Save, 
  Package, 
  ShoppingBag, 
  IndianRupee, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2,
  TrendingUp,
  Tag
} from 'lucide-react';

export const AdminModal = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    storeInfo, 
    setStoreInfo, 
    orders, 
    productsList, 
    setProductsList,
    addToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'orders' | 'products'

  // Editable Store Info Form
  const [formData, setFormData] = useState({ ...storeInfo });

  if (!isAdminOpen) return null;

  const handleSaveBranding = (e) => {
    e.preventDefault();
    setStoreInfo(formData);
    addToast('Store settings & brand identity updated successfully!', 'success');
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('auraglow_store_info');
    window.location.reload();
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Store Admin & Customization Center</h2>
              <p className="text-[11px] text-slate-400">Rename your store, update contacts, view orders & manage products</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Brand Name & Contact Settings
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Live Orders</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-white text-rose-600 border-t-2 border-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Catalog ({productsList.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* TAB 1: BRANDING & DETAILS */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900">
                <strong>💡 Tip:</strong> You can type any new brand name below (e.g. <em>"GlowHaven"</em>, <em>"AuraGlow"</em>, <em>"LumiSkin"</em>, <em>"GlowCart"</em>). Once you click "Save Changes", the header, logo, footer, announcement banner, and checkout will instantly update across the whole site!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Store / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.storeTagline}
                    onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    WhatsApp Helpline Number *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Phone Call Support Number
                  </label>
                  <input
                    type="text"
                    value={formData.supportPhone}
                    onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Customer Care Email
                  </label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Free Shipping Minimum Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Office / Dispatch Address
                  </label>
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
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800"
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

          {/* TAB 2: LIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Store Orders</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Revenue</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalRevenue.toLocaleString()}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Average Order Value</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount).toLocaleString() : 0}
                  </div>
                </div>
              </div>

              {/* Orders table */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {orders.map(order => (
                  <div key={order.orderId} className="p-4 bg-white hover:bg-slate-50/60 transition-colors space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-rose-600">{order.orderId}</span>
                        <span className="text-[10px] text-slate-400">{order.date}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 flex flex-wrap justify-between gap-2">
                      <div>
                        <strong>{order.customer.fullName}</strong> ({order.customer.phone})
                        <div className="text-[11px] text-slate-500">{order.customer.city}, {order.customer.state}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹{order.total.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{order.paymentMethod}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Manage catalog prices, stock and items.</span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {productsList.map(prod => (
                  <div key={prod.id} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                    <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400">{prod.brand} • {prod.category} • SKU: {prod.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-slate-900">₹{prod.price}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{prod.stock} in stock</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
