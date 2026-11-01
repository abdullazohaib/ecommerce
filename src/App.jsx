import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopAnnouncementBar } from './components/layout/TopAnnouncementBar';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

import { HeroSlider } from './components/home/HeroSlider';
import { CategoryGrid } from './components/home/CategoryGrid';
import { TrustBadges } from './components/home/TrustBadges';
import { FlashSaleCountdown } from './components/home/FlashSaleCountdown';
import { ProductGrid } from './components/home/ProductGrid';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CustomerReviews } from './components/home/CustomerReviews';
import { BlogHighlights } from './components/home/BlogHighlights';

import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { WishlistPage } from './components/pages/WishlistPage';
import { PolicyPage } from './components/pages/PolicyPage';

import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { AdminModal } from './components/admin/AdminModal';
import { Toast } from './components/ui/Toast';
import { WhatsAppFloating } from './components/ui/WhatsAppFloating';

const MainContent = () => {
  const { currentView, storeInfo } = useStore();

  // Dynamic document title
  useEffect(() => {
    document.title = `${storeInfo.storeName} | Buy Authentic Skin Whitening Creams, Soaps & Serums (COD Available)`;
  }, [storeInfo.storeName]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Top Announcement Bar */}
        <TopAnnouncementBar />

        {/* Main Header & Navbar */}
        <Header />
        <Navbar />

        {/* Main Dynamic View Router */}
        <main>
          {currentView === 'home' && (
            <>
              <HeroSlider />
              <CategoryGrid />
              <TrustBadges />
              <FlashSaleCountdown />
              <ProductGrid />
              <WhyChooseUs />
              <CustomerReviews />
              <BlogHighlights />
            </>
          )}

          {currentView === 'shop' && <ShopPage />}
          {currentView === 'product-detail' && <ProductDetailPage />}
          {currentView === 'wishlist' && <WishlistPage />}
          {['shipping-policy', 'refund-policy', 'privacy-policy', 'terms'].includes(currentView) && (
            <PolicyPage type={currentView} />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AdminModal />
      <ProductDetailModal />
      <Toast />
      <WhatsAppFloating />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
