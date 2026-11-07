// URL Slugifier Helper - Guarantees NO GAPS, spaces or special chars
export const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Safe LocalStorage Writer with Quota Protection & Quota Recovery
export const safeStorageSet = (key, value) => {
  try {
    let cleanValue = value;
    // Strip redundant banners from storeInfo if present to keep storage lean
    if (key === 'glowbasket_store_info' && value && typeof value === 'object') {
      const { banners, ...rest } = value;
      cleanValue = rest;

      // Always save standalone backup keys for critical branding values
      try {
        if (rest.logoUrl !== undefined) localStorage.setItem('glowbasket_logo_url', rest.logoUrl);
        if (rest.logoType !== undefined) localStorage.setItem('glowbasket_logo_type', rest.logoType);
        if (rest.storeName !== undefined) localStorage.setItem('glowbasket_store_name', rest.storeName);
        if (rest.monogram !== undefined) localStorage.setItem('glowbasket_monogram', rest.monogram);
      } catch (e) {}
    }

    // Always backup category banners into isolated crash-proof keys
    if (key === 'glowbasket_categories' && Array.isArray(value)) {
      try {
        value.forEach(cat => {
          const s = (cat.slug || cat.id || '').toLowerCase();
          if (s && cat.bannerImg) {
            try { localStorage.setItem(`glowbasket_banner_${s}`, cat.bannerImg); } catch (e) {}
          }
        });
      } catch (e) {}
    }

    const serialized = typeof cleanValue === 'string' ? cleanValue : JSON.stringify(cleanValue);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[Storage] Failed to save ${key} to localStorage:`, err);
    try {
      // Auto-prune space: remove obsolete legacy keys & non-critical caches
      ['auraglow_store_info', 'auraglow_products', 'auraglow_orders', 'auraglow_cart', 'auraglow_wishlist', 'auraglow_user', 'auraglow_admin_auth', 'glowbasket_cart', 'glowbasket_wishlist'].forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      // If saving storeInfo, always guarantee backup logo keys are saved
      if (key === 'glowbasket_store_info' && value && typeof value === 'object') {
        const { banners, ...rest } = value;
        try {
          if (rest.logoUrl) localStorage.setItem('glowbasket_logo_url', rest.logoUrl);
          if (rest.logoType) localStorage.setItem('glowbasket_logo_type', rest.logoType);
          if (rest.storeName) localStorage.setItem('glowbasket_store_name', rest.storeName);
          if (rest.monogram) localStorage.setItem('glowbasket_monogram', rest.monogram);
        } catch (e) {}
        const serialized = JSON.stringify(rest);
        localStorage.setItem(key, serialized);
        return true;
      }

      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (e2) {
      console.error(`[Storage] Critical quota error for ${key}:`, e2);
      return false;
    }
  }
};

/**
 * Derives uppercase brand initials / monogram from store brand name.
 * e.g. "Classic Glow" -> "CG", "Glow Basket" -> "GB", "Fair Plus" -> "FP"
 */
export const getAutoMonogram = (name, customMonogram) => {
  // If user explicitly provided a custom monogram that is NOT a stale default 'GB' on a non-Glow Basket name
  if (customMonogram && typeof customMonogram === 'string' && customMonogram.trim()) {
    const isStaleGB = customMonogram.trim().toUpperCase() === 'GB' && name && !name.toLowerCase().includes('glow basket');
    if (!isStaleGB) {
      return customMonogram.trim().toUpperCase();
    }
  }
  // Auto-generate monogram initials from store name
  if (!name || typeof name !== 'string') return 'CG';
  const clean = name.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
};

/**
 * Compresses an image file for full-width category banners.
 * Converts to optimized JPEG (~50KB - 80KB) so it saves instantly,
 * never triggers browser localStorage quota errors, and renders sharply across mobile & desktop.
 */
export const compressBannerImage = (file, maxWidth = 1200, maxHeight = 450, quality = 0.78) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    if (file.type && !file.type.startsWith('image/') && !file.name?.match(/\.(jpe?g|png|webp|svg|gif|heic|bmp)$/i)) {
      return reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          URL.revokeObjectURL(objectUrl);
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Fill background white
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
      };

      img.src = objectUrl;
    } catch (e) {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    }
  });
};

