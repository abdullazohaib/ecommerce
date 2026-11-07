import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { compressBannerImage } from '../../utils/helpers';
import { 
  Upload, 
  Sparkles, 
  Eye, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'lips', slug: 'lips', name: 'Lips', icon: '💄', defaultBanner: '/categories/lips.png', route: '/category/lips' },
  { id: 'eyes', slug: 'eyes', name: 'Eyes', icon: '👁️', defaultBanner: '/categories/eyes.png', route: '/category/eyes' },
  { id: 'face', slug: 'face', name: 'Face', icon: '✨', defaultBanner: '/categories/face.png', route: '/category/face' },
  { id: 'nails', slug: 'nails', name: 'Nails', icon: '💅', defaultBanner: '/categories/nails.png', route: '/category/nails' },
  { id: 'skincare', slug: 'skincare', name: 'Skincare', icon: '🌿', defaultBanner: '/categories/skin.png', route: '/category/skincare' },
  { id: 'all', slug: 'all', name: 'All Products (Shop)', icon: '🛍️', defaultBanner: '/banners/classic-glow-hero-clean.jpg', route: '/shop' }
];

export const CategoryBannersManager = () => {
  const { 
    categoryBanners, 
    updateCategoryBanner, 
    navigateToCategory,
    navigateToView 
  } = useStore();

  const [activeSlug, setActiveSlug] = useState('lips');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentCategory = CATEGORY_ITEMS.find(c => c.slug === activeSlug) || CATEGORY_ITEMS[0];
  const currentBanner = (categoryBanners && categoryBanners[activeSlug]) || currentCategory.defaultBanner;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg('');
    setUploadSuccess(false);

    try {
      // Direct, fast, high-DPI compression to ~50KB-70KB
      const compressedDataUrl = await compressBannerImage(file, 1400, 500, 0.80);
      
      // Instantly save to state, categories, localStorage & broadcast live to storefront
      updateCategoryBanner(activeSlug, compressedDataUrl);
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4500);
    } catch (err) {
      console.error('Banner upload error:', err);
      setErrorMsg(err.message || 'Failed to process image. Please try another photo.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input so same file can be chosen again if desired
    }
  };

  const handleResetDefault = () => {
    updateCategoryBanner(activeSlug, currentCategory.defaultBanner);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleOpenStorefront = () => {
    if (activeSlug === 'all') {
      navigateToView('shop');
    } else {
      navigateToCategory(activeSlug);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7 space-y-6">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Category Page Banners</h2>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              Different Banner for Each Category
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload custom full-size banners for Lips, Eyes, Face, Nails, Skincare, or All Products. Changes appear on the website immediately!
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenStorefront}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5B4DF5] hover:bg-indigo-50 border border-indigo-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>View {currentCategory.name} on Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Category Switcher Tabs */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2">
          Select Category to Change Banner:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = cat.slug === activeSlug;
            const hasCustom = categoryBanners && categoryBanners[cat.slug] && categoryBanners[cat.slug] !== cat.defaultBanner;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setActiveSlug(cat.slug);
                  setUploadSuccess(false);
                  setErrorMsg('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#5B4DF5] text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {hasCustom && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} title="Custom banner active" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Category Banner Preview ("shore what we change in admin page") */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#5B4DF5]" />
            <span>Currently Active {currentCategory.name} Banner:</span>
          </span>

          <span className="text-[11px] font-mono text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-0.5 rounded-md">
            {currentCategory.route}
          </span>
        </div>

        {/* Live Banner Preview Box matching storefront full-width size */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-950">
          <div className="w-full aspect-[16/9] sm:aspect-[2.2/1] md:aspect-[2.6/1] lg:aspect-[3/1] max-h-[380px] flex items-center justify-center overflow-hidden bg-neutral-900">
            <img
              src={currentBanner}
              alt={`${currentCategory.name} Banner`}
              className="w-full h-full object-cover object-center transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = currentCategory.defaultBanner;
              }}
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
              {currentCategory.icon} {currentCategory.name} Collection
            </span>
            <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Live on Storefront
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
              📐 1400 × 500 px Full-Width
            </span>
          </div>
        </div>
      </div>

      {/* 3. ONLY ONE FEATURE: DIRECT UPLOAD BANNER FROM GALLERY */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 block">
          Upload New {currentCategory.name} Banner:
        </label>

        <label 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 p-6 sm:p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isUploading 
              ? 'border-indigo-400 bg-indigo-50/50 cursor-wait'
              : 'border-[#5B4DF5]/40 hover:border-[#5B4DF5] hover:bg-indigo-50/40 bg-slate-50/60 shadow-xs'
          }`}
        >
          {/* Native file input - directly triggers phone gallery or file picker */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-100/80 text-[#5B4DF5] flex items-center justify-center shrink-0 shadow-xs">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-[#5B4DF5] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-7 h-7 stroke-[2.2]" />
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-sm font-bold text-slate-900 hover:text-[#5B4DF5] transition-colors">
                {isUploading ? 'Compressing & uploading banner...' : `Tap to Upload ${currentCategory.name} Banner from Gallery`}
              </span>
              <span className="bg-[#5B4DF5] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                1-Step Direct Upload
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Select any image (JPG, PNG, WEBP) from your phone gallery or computer. Automatically updates website immediately!
            </p>
          </div>
        </label>

        {/* Upload feedback states */}
        {uploadSuccess && (
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">
                ✓ {currentCategory.name} banner updated successfully! Live on website now.
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenStorefront}
              className="text-emerald-700 underline font-semibold hover:text-emerald-900 cursor-pointer"
            >
              View on Website ↗
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Quick Reset to Default Link */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-slate-400 text-[11px]">
            Banner dimensions: 1400×500 px or 1920×600 px (3:1 / 2.6:1 wide ratio recommended).
          </span>

          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset {currentCategory.name} to Default</span>
          </button>
        </div>
      </div>

      {/* 4. ALL CATEGORY BANNERS AT A GLANCE (Overview) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>All Category Banners at a Glance:</span>
          </span>
          <span className="text-[11px] text-slate-400">Click any card to change its banner</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = cat.slug === activeSlug;
            const bannerUrl = (categoryBanners && categoryBanners[cat.slug]) || cat.defaultBanner;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setActiveSlug(cat.slug);
                  setUploadSuccess(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#5B4DF5] bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-[#5B4DF5]/60 hover:bg-slate-50'
                }`}
              >
                <div className="w-full aspect-[2/1] rounded-lg overflow-hidden bg-slate-900 mb-2 border border-slate-200">
                  <img
                    src={bannerUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cat.defaultBanner;
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold truncate ${
                    isSelected ? 'text-[#5B4DF5]' : 'text-slate-800 group-hover:text-[#5B4DF5]'
                  }`}>
                    {cat.icon} {cat.name}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 group-hover:text-[#5B4DF5]">
                    Change ↗
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CategoryBannersManager;
