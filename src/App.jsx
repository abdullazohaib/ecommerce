import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopAnnouncementBar } from './components/layout/TopAnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

import { HeroSlider } from './components/home/HeroSlider';
import { CategoryGrid } from './components/home/CategoryGrid';
import { BestsellersRow } from './components/home/BestsellersRow';
import { NewLaunchesRow } from './components/home/NewLaunchesRow';

import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { WishlistPage } from './components/pages/WishlistPage';
import { PolicyPage } from './components/pages/PolicyPage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { BlogPage } from './components/pages/BlogPage';

import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/tracking/OrderTrackingModal';
import { AdminPage } from './components/admin/AdminPage';
import { AuthModal } from './components/auth/AuthModal';
import { Toast } from './components/ui/Toast';
import { LiveChatAssistant } from './components/ui/LiveChatAssistant';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const MainContent = () => {
  const { currentView, storeInfo } = useStore();

  // Dynamic document title matching view
  useEffect(() => {
    if (currentView === 'home') {
      document.title = `${storeInfo.storeName} | Buy Authentic Skin Whitening Creams, Herbal Soaps & Beauty Solutions`;
    } else if (currentView === 'shop') {
      document.title = `Shop All Herbal & Whitening Skincare | ${storeInfo.storeName}`;
    } else if (currentView === 'about') {
      document.title = `About Us | ${storeInfo.storeName}`;
    } else if (currentView === 'contact') {
      document.title = `Contact Customer Support | ${storeInfo.storeName}`;
    } else if (currentView === 'blog') {
      document.title = `Beauty & Herbal Skincare Blog | ${storeInfo.storeName}`;
    } else if (currentView === 'wishlist') {
      document.title = `My Saved Wishlist | ${storeInfo.storeName}`;
    } else if (currentView === 'admin') {
      document.title = `Store Administration Suite | ${storeInfo.storeName}`;
    }
  }, [currentView, storeInfo.storeName]);

  // Dedicated Standalone Admin Page at /admin (NOT an overlay popup)
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900">
        <AdminPage />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <div>
        {/* Top Announcement Bar */}
        <TopAnnouncementBar />

        {/* Clean Luxury Header (Search, Wishlist, HOME, SHOP, BLOG, Logo, ABOUT US, CONTACT US, User, Cart) */}
        <Header />

        {/* Main Dynamic View Router */}
        <main>
          {currentView === 'home' && (
            <>
              <HeroSlider />
              <CategoryGrid />
              <BestsellersRow />
              <NewLaunchesRow />
            </>
          )}

          {currentView === 'shop' && <ShopPage />}
          {currentView === 'product-detail' && <ProductDetailPage />}
          {currentView === 'wishlist' && <WishlistPage />}
          {currentView === 'about' && <AboutUsPage />}
          {currentView === 'contact' && <ContactUsPage />}
          {currentView === 'blog' && <BlogPage />}
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
      <AuthModal />
      <Toast />
      <LiveChatAssistant />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
