import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { storeConfig } from '../config/storeConfig';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Store Branding & Settings
  const [storeInfo, setStoreInfo] = useState(() => {
    const saved = localStorage.getItem('auraglow_store_info');
    return saved ? JSON.parse(saved) : storeConfig;
  });

  // Products state (can be edited/added in admin panel)
  const [productsList, setProductsList] = useState(() => {
    const saved = localStorage.getItem('auraglow_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Navigation / Views
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('auraglow_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('auraglow_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders History
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('auraglow_orders');
    return saved ? JSON.parse(saved) : [
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [priceFilter, setPriceFilter] = useState(3000);

  // Modals & Drawers
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTrackingQuery, setActiveTrackingQuery] = useState('');

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('auraglow_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('auraglow_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('auraglow_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('auraglow_products', JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    localStorage.setItem('auraglow_store_info', JSON.stringify(storeInfo));
  }, [storeInfo]);

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

  // Quick navigation helpers
  const navigateToProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
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
        isAdminOpen,
        setIsAdminOpen,
        activeTrackingQuery,
        setActiveTrackingQuery,
        toasts,
        addToast,
        removeToast,
        navigateToProduct,
        navigateToCategory
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
