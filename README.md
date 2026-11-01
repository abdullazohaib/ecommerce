# AuraGlow - Premium Herbal & Skin Whitening E-Commerce Platform

A production-grade, high-converting e-commerce web application inspired by **GlowBasket.in**, featuring an enhanced modern design, complete checkout flow, live order tracking, dynamic cart, and instant brand re-naming capabilities.

---

## 🌟 Key Features

1. **Exact Niche & Catalog Matching GlowBasket**:
   - **Whitening Creams**: Vita Glow, Glow Plus Gold, Fair Plus, Active White L-Glutathione.
   - **Night Creams**: Deep overnight repair and melanin control formulas.
   - **Herbal Soaps**: Chandni Whitening Soap, Dr. James Glutathione Soap.
   - **Concentrated Serums**: Gluta White 20% Vitamin C & Glutathione Booster.
   - **Lotions & Cleansers**: Fair & White AHA Lotion, Vita Glow Face Wash, YC Melasma Cleanser.
   - **Health & Wellness**: Health Tone Herbal Weight Gain Capsules, Sada Bahar Halwa.

2. **Tailored for Indian E-Commerce Conversions**:
   - **Cash on Delivery (COD)** default payment method.
   - **Instant UPI / QR Code** support (Google Pay, PhonePe, Paytm).
   - **1-Click WhatsApp Order Confirmation** with pre-filled order receipt details.
   - **Live Pincode Checker**: Enter 6-digit Indian PIN code for instant delivery estimation.
   - **Free Shipping Meter**: Live visual progress bar ("Add ₹X more for FREE Express Delivery").
   - **Deal of the Day**: Live ticking countdown timer (Hours : Mins : Secs).

3. **Live Order Tracking System**:
   - Track shipments by Order ID (e.g. `AG-88412`) or 10-digit mobile number.
   - Milestone timeline (Order Placed → Quality Checked → Dispatched from Mumbai Hub → Out for Delivery → Delivered).
   - Courier partner details (Delhivery / BlueDart).

4. **1-Click Brand Name Customization**:
   - **In UI**: Click the **"Store Admin"** button in the top navigation to rename your store to any custom brand name with instant live preview!
   - **In Code**: Centralized configuration in [`src/config/storeConfig.js`](src/config/storeConfig.js).

5. **Store Admin Dashboard**:
   - View live customer orders, revenue analytics, and average order value.
   - Manage product catalog, prices, and stock counts.
   - Update phone number, WhatsApp contact, support email, and warehouse address.

---

## 🚀 Quick Start Guide

### 1. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port indicated in terminal).

### 2. Build for Production
```bash
npm run build
```
This compiles optimized static HTML, CSS, and JS bundles into the `dist/` directory, ready to be deployed to Vercel, Netlify, Cloudflare Pages, AWS, or any web hosting provider.

---

## 🛠️ How to Customize Your Brand Name

Open [`src/config/storeConfig.js`](src/config/storeConfig.js) to customize:
```javascript
export const storeConfig = {
  storeName: "YourBrandName", // Change this to whatever you want!
  storeTagline: "Authentic Skincare & Herbal Beauty Solutions",
  supportPhone: "+91 98200 45678",
  whatsappNumber: "+91 98200 45678",
  supportEmail: "care@yourdomain.in",
  freeShippingThreshold: 999,
  // ...
};
```
Alternatively, open the website, click **Store Admin** in the header, change the name in the input box, and click **Save Brand Updates**. The change takes effect across the entire site immediately!
