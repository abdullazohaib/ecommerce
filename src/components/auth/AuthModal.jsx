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
  Eye, 
  EyeOff,
  ShoppingBag,
  ExternalLink,
  Heart,
  Truck,
  RotateCcw,
  Sparkles
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
    googleLogin,
    customerLogout, 
    isAdminAuthenticated, 
    adminLogin, 
    setViewWithUrl,
    setCurrentView,
    openTrackingModal,
    setIsCartOpen,
    storeInfo
  } = useStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Admin Login form state
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  // Google Sign-In Sheet State
  const [showGoogleSheet, setShowGoogleSheet] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Allow switching view even if currentUser is set
  const [forceFormView, setForceFormView] = useState(false);

  if (!isAuthModalOpen) return null;

  const storeName = storeInfo?.storeName || 'Glow Basket';

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

  // Google OAuth Flow
  const handleSelectGoogleAccount = (profile) => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      googleLogin(profile);
      setIsGoogleLoading(false);
      setShowGoogleSheet(false);
    }, 500);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    const name = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    handleSelectGoogleAccount({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: customGoogleEmail.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
  };

  const sampleGoogleAccounts = [
    {
      name: 'Abdul Zohaib',
      email: 'abdul.zohaib@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const GoogleLogoSvg = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200/80 my-8 animate-in zoom-in-95 duration-200"
      >
        {/* ==================== GOOGLE ACCOUNT CHOOSER SHEET ==================== */}
        {showGoogleSheet ? (
          <div className="p-6 space-y-5 animate-in fade-in duration-150">
            {/* Google Brand Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <GoogleLogoSvg />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-500">to continue to {storeName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleSheet(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">Choose an account:</p>

            {/* List of Google Accounts */}
            <div className="space-y-2">
              {sampleGoogleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={() => handleSelectGoogleAccount(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left cursor-pointer group disabled:opacity-60"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                  </span>
                </button>
              ))}

              {/* Enter custom Google account */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-all text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">Use another Google account</p>
                    <p className="text-[11px] text-slate-400">Enter any name or Gmail</p>
                  </div>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="Your Full Name (e.g. Sara Ali)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    required
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isGoogleLoading || !customGoogleEmail.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      {isGoogleLoading ? 'Connecting...' : 'Sign In with This Google ID'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {isGoogleLoading && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-blue-600 font-bold">
                <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating with Google...</span>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowGoogleSheet(false)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                ← Back to email sign in
              </button>
            </div>
          </div>
        ) : (
          /* ==================== STANDARD AUTH MODAL CONTENT ==================== */
          <>
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-md ${
                  authModalTab === 'admin' 
                    ? 'bg-slate-900 shadow-slate-900/20' 
                    : currentUser && !forceFormView
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-600/20'
                    : 'bg-gradient-to-tr from-rose-600 to-pink-600 shadow-rose-600/20'
                }`}>
                  {authModalTab === 'admin' ? (
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  ) : currentUser && !forceFormView ? (
                    currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-2xl object-cover" />
                    ) : (
                      <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
                    )
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {currentUser && !forceFormView && authModalTab !== 'admin'
                      ? 'My Account'
                      : authModalTab === 'admin'
                      ? 'Administrator Portal'
                      : authModalTab === 'register'
                      ? 'Create Account'
                      : 'Customer Sign In'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {authModalTab === 'admin'
                      ? 'Restricted to store managers & administrators'
                      : `Welcome to ${storeName}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setForceFormView(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ==================== 1. LOGGED IN CUSTOMER DASHBOARD ==================== */}
            {currentUser && !forceFormView && authModalTab !== 'admin' ? (
              <div className="p-6 space-y-5">
                {/* Profile Card */}
                <div className="p-4 bg-gradient-to-br from-rose-50/80 via-white to-pink-50/50 rounded-2xl border border-rose-100/80 shadow-xs flex items-center gap-3.5">
                  <div className="relative">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {currentUser.authProvider === 'google' && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100">
                        <GoogleLogoSvg />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email || currentUser.emailOrPhone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {currentUser.authProvider === 'google' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          Google Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Verified Customer
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Navigation Options */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      openTrackingModal('track');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800 cursor-pointer shadow-2xs group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span>My Orders & Live Tracking</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setCurrentView('wishlist');
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800 cursor-pointer shadow-2xs group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Wishlist</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800 cursor-pointer shadow-2xs group"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>View Shopping Cart</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Switch Account or Log Out */}
                <div className="pt-2 space-y-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setForceFormView(true);
                      setAuthModalTab('login');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Switch / Sign in with another account</span>
                  </button>

                  {isAdminAuthenticated && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(false);
                        setViewWithUrl('admin');
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Open Store Admin Suite (/admin)</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        customerLogout();
                        setForceFormView(true);
                        setAuthModalTab('login');
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthModalTab('admin')}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Admin Gateway →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ==================== 2. NOT LOGGED IN / AUTH FORMS ==================== */
              <div className="p-6">
                
                {/* Modern Tab Switcher */}
                {authModalTab !== 'admin' && (
                  <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('login');
                        setForceFormView(true);
                      }}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        authModalTab === 'login'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('register');
                        setForceFormView(true);
                      }}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        authModalTab === 'register'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                )}

                {/* -------------------- TAB: CUSTOMER SIGN IN -------------------- */}
                {authModalTab === 'login' && (
                  <div className="space-y-4">
                    {/* Prominent Continue with Google Button */}
                    <button
                      type="button"
                      onClick={() => setShowGoogleSheet(true)}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs text-xs sm:text-sm font-semibold text-slate-800 transition-all cursor-pointer group active:scale-98"
                    >
                      <GoogleLogoSvg />
                      <span>Continue with Google</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        1-Click
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="border-t border-slate-200 w-full"></div>
                      <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                        or sign in with email
                      </span>
                    </div>

                    <form onSubmit={handleCustomerLogin} className="space-y-3.5">
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">Password *</label>
                          <a 
                            href="#forgot" 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              alert("Password reset instructions have been sent to your email or registered phone."); 
                            }} 
                            className="text-[11px] text-rose-600 font-semibold hover:underline"
                          >
                            Forgot Password?
                          </a>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer">
                          Keep me signed in on this device
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-rose-600/25 active:scale-98 transition-all cursor-pointer"
                      >
                        Sign In to Account
                      </button>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
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
                  </div>
                )}

                {/* -------------------- TAB: CREATE ACCOUNT (SIGN UP) -------------------- */}
                {authModalTab === 'register' && (
                  <div className="space-y-4">
                    {/* Prominent Continue with Google Button */}
                    <button
                      type="button"
                      onClick={() => setShowGoogleSheet(true)}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs text-xs sm:text-sm font-semibold text-slate-800 transition-all cursor-pointer group active:scale-98"
                    >
                      <GoogleLogoSvg />
                      <span>Sign up with Google</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Instant Setup
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="border-t border-slate-200 w-full"></div>
                      <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
                        or sign up with email
                      </span>
                    </div>

                    <form onSubmit={handleCustomerRegister} className="space-y-3">
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
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
                            placeholder="+91 98765 43210 (For order updates)"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Create Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showRegPassword ? "text" : "password"}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-rose-600/25 active:scale-98 transition-all cursor-pointer"
                      >
                        Create My Account
                      </button>

                      <p className="text-[11px] text-slate-400 text-center">
                        By registering, you agree to receive order notifications and authentic skincare updates.
                      </p>
                    </form>
                  </div>
                )}

                {/* -------------------- TAB: ADMIN ONLY LOGIN GATE -------------------- */}
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
                        Only authorized store managers can log in to manage products, banners, and orders.
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

                      {/* Dev note helper */}
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
                          onClick={() => {
                            setAuthModalTab('login');
                            setForceFormView(true);
                          }}
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
          </>
        )}
      </div>
    </div>
  );
};
