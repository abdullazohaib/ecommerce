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

    const serialized = typeof cleanValue === 'string' ? cleanValue : JSON.stringify(cleanValue);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[Storage] Failed to save ${key} to localStorage:`, err);
    try {
      // Auto-prune space: remove obsolete legacy keys & non-critical caches
      localStorage.removeItem('auraglow_store_info');
      localStorage.removeItem('auraglow_products');
      localStorage.removeItem('auraglow_orders');
      localStorage.removeItem('auraglow_cart');
      localStorage.removeItem('auraglow_wishlist');
      localStorage.removeItem('auraglow_user');
      localStorage.removeItem('auraglow_admin_auth');

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

