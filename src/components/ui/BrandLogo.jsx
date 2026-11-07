import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { getAutoMonogram } from '../../utils/helpers';

/**
 * BrandLogo Component
 * Renders the signature luxury aesthetic requested by the user:
 * - Soft blush/pink uppercase Serif monogram in the background (e.g. CG for Classic Glow, GB for Glow Basket)
 * - Flowing rose-terracotta cursive handwriting script overlaid across it (e.g. classic glow)
 * - Or uploaded logo image if logoType is set to 'image' (with graceful typographic fallback)
 */
export const BrandLogo = ({ className = "", size = "normal" }) => {
  const { storeInfo = {} } = useStore();
  const [imgError, setImgError] = useState(false);

  const storeName = storeInfo?.storeName || 'Classic Glow';
  const monogram = getAutoMonogram(storeName, storeInfo?.monogram);
  const logoType = storeInfo?.logoType || 'image'; // Default to the user's uploaded logo image
  const logoUrl = storeInfo?.logoUrl || '/logo.png';

  // Automatically reset image error whenever logo URL or type changes
  React.useEffect(() => {
    setImgError(false);
  }, [logoUrl, logoType]);

  // Height sizing
  const imgHeights = {
    small: 'h-8 sm:h-9',
    normal: 'h-10 sm:h-12',
    large: 'h-14 sm:h-16',
    footer: 'h-11 sm:h-12'
  };

  // If Image Logo is active
  if (logoType === 'image' && logoUrl && !imgError) {
    const isDefaultGlowBasketImage = logoUrl === '/logo.png' || logoUrl === '/glow-basket-logo.png';
    const hasCustomStoreName = storeName && storeName.trim().toLowerCase() !== 'glow basket';

    // If still using default /logo.png but user changed store name to another brand (e.g. Classic Glow),
    // show dynamic typographic luxury monogram logo with their new name instead of showing old "Glow Basket" image pixels
    if (!isDefaultGlowBasketImage || !hasCustomStoreName) {
      return (
        <div className={`inline-flex items-center select-none ${className}`}>
          <img
            key={logoUrl}
            src={logoUrl}
            alt={storeName}
            className={`${imgHeights[size] || imgHeights.normal} w-auto object-contain transition-transform group-hover:scale-102`}
            onError={() => setImgError(true)}
          />
        </div>
      );
    }
  }

  // Text + Watermark Monogram Luxury Typographic Logo (Pixel-matched to user's uploaded image)
  const fontSizes = {
    small: { mono: 'text-3xl', script: 'text-xl' },
    normal: { mono: 'text-4xl sm:text-5xl', script: 'text-2xl sm:text-3xl' },
    large: { mono: 'text-6xl sm:text-7xl', script: 'text-4xl sm:text-5xl' },
    footer: { mono: 'text-4xl sm:text-5xl', script: 'text-2xl sm:text-3xl' }
  };

  const currentFont = fontSizes[size] || fontSizes.normal;

  return (
    <div className={`relative inline-flex items-center justify-center select-none py-1 px-2 ${className}`}>
      {/* Background Soft Blush Serif Monogram Letters (CG) */}
      <span 
        className={`font-serif font-bold text-[#fcd8dc] tracking-tight leading-none pointer-events-none select-none ${currentFont.mono}`}
        style={{ letterSpacing: '-0.03em' }}
      >
        {monogram}
      </span>

      {/* Foreground Elegant Cursive Script Signature (classic glow) */}
      <span 
        className={`absolute inset-0 flex items-center justify-center font-script text-[#ba5d5d] whitespace-nowrap drop-shadow-2xs pointer-events-none leading-none ${currentFont.script}`}
        style={{ transform: 'translateY(-2px)' }}
      >
        {storeName}
      </span>
    </div>
  );
};

export default BrandLogo;

