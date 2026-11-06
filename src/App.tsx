import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.jsx';
import Navbar from './components/Navbar.jsx';
import HomeView from './components/HomeView.jsx';
import CatalogView from './components/CatalogView.jsx';
import CheckoutView from './components/CheckoutView.jsx';
import OrderSuccessView from './components/OrderSuccessView.jsx';
import CustomerDashboard from './components/CustomerDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import Footer from './components/Footer.jsx';

function AppContent() {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'shop' && <CatalogView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'order-success' && <OrderSuccessView />}
        {activeView === 'customer' && <CustomerDashboard />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Overlays and Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <PaymentModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
