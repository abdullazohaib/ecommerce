import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    currentUser, 
    customerLogin, 
    customerRegister, 
    customerLogout, 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout,
    setViewWithUrl,
    setCurrentView,
    orders,
    storeInfo
  } = useStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Admin Login form state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    customerLogin(loginEmail, loginPassword);
  };

  const handleCustomerRegister = (e) => {
    e.preventDefault();
    customerRegister(regName, regEmail, regPhone, regPassword);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    const success = adminLogin(adminUser, adminPass);
    if (!success) {
      setAdminError('Invalid admin credentials. Use admin / admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold ${
              authModalTab === 'admin' ? 'bg-slate-900' : 'bg-rose-600'
            }`}>
              {authModalTab === 'admin' ? <ShieldCheck className="w-5 h-5 text-amber-400" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {currentUser && authModalTab !== 'admin'
                  ? 'My Account'
                  : authModalTab === 'admin'
                  ? 'Administrator Login'
                  : authModalTab === 'register'
                  ? 'Create Customer Account'
                  : 'Customer Login'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {authModalTab === 'admin'
                  ? 'Restricted to store managers & administrators'
                  : `Welcome to ${storeInfo.storeName}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED IN CUSTOMER VIEW */}
        {currentUser && authModalTab !== 'admin' ? (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-bold text-lg flex items-center justify-center">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentUser.name}</h3>
                  <p className="text-xs text-slate-500">{currentUser.emailOrPhone || currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setCurrentView('wishlist');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <span>My Wishlist</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setCurrentView('shop');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setViewWithUrl('admin');
                }}
                className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Open Store Admin Suite (/admin)</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={customerLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={() => setAuthModalTab('admin')}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Admin Gateway →
              </button>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN / FORM VIEW */
          <div className="p-6">
            
            {/* Tab switchers if customer mode */}
            {authModalTab !== 'admin' && (
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    authModalTab === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    authModalTab === 'register'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* 1. CUSTOMER LOGIN */}
            {authModalTab === 'login' && (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email or Mobile Number *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="yourname@gmail.com or 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password *</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset instructions sent to your email/phone."); }} className="text-[11px] text-rose-600 hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Sign In to Account
                </button>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Need store management?</span>
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('admin')}
                    className="font-bold text-slate-900 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                    <span>Admin Login</span>
                  </button>
                </div>
              </form>
            )}

            {/* 2. CUSTOMER REGISTER */}
            {authModalTab === 'register' && (
              <form onSubmit={handleCustomerRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  Create Account
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  By registering, you agree to receive order notifications and authenticity updates.
                </p>
              </form>
            )}

            {/* 3. ADMIN ONLY LOGIN GATE */}
            {authModalTab === 'admin' && (
              <div className="space-y-4">
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Admin Portal Gateway
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Only authorized store managers can log in to add/remove products and view orders.
                  </p>
                </div>

                {adminError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                    {adminError}
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Admin Username *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="admin"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Admin Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Dev note helper for the user */}
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-800">
                    <strong>Admin Credentials:</strong> Username: <code className="font-bold">admin</code> / Password: <code className="font-bold">admin123</code>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Authorize Admin Access</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('login')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      ← Back to Customer Login
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

