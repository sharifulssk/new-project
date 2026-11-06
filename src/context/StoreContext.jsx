import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS, INITIAL_ORDERS } from '../data/seedData.js';
import { TRANSLATIONS } from '../lib/translations.js';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Localization
  const [lang, setLang] = useState(() => localStorage.getItem('bongomart_lang') || 'en');
  
  // Active Navigation View: 'home' | 'shop' | 'checkout' | 'order-success' | 'customer' | 'admin'
  const [activeView, setActiveView] = useState('home');

  // Products & Settings
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isLoading, setIsLoading] = useState(false);

  // User Authentication & Role
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bongomart_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'usr-cust-demo',
      name: 'Shariful Islam',
      email: 'sharifulssk@gmail.com',
      role: 'customer',
      phone: '01712345678',
      savedAddresses: [
        {
          id: 'addr-1',
          title: 'Home (Gulshan)',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Gulshan',
          address: 'Apartment 5A, Road 28, Gulshan-1'
        }
      ]
    };
  });

  // Cart (persistent in localStorage)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('bongomart_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        cartId: 'cart-1',
        productId: 'prod-004',
        name: 'Sreemangal Single-Estate Whole Leaf Artisan Tea',
        nameBn: 'শ্রীমঙ্গল সিঙ্গেল-এস্টেট খাঁটি পাতা ব্ল্যাক টি',
        price: 950,
        variant: '250g Tin',
        quantity: 1,
        image: '/src/assets/images/product_tea_artisan_1793971977116.jpg',
        stock: 60
      }
    ];
  });

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Wishlist (persistent)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('bongomart_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['prod-001', 'prod-003'];
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Interactive Payment Gateway Modal (bKash, Nagad, SSLCommerz)
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    method: null,
    amount: 0,
    orderData: null,
    onSuccess: null
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bongomart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bongomart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bongomart_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bongomart_lang', lang);
  }, [lang]);

  // Initial Fetch from Backend Server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, settRes, ordRes] = await Promise.all([
          fetch('/api/products').then(r => r.ok ? r.json() : null),
          fetch('/api/settings').then(r => r.ok ? r.json() : null),
          fetch('/api/orders').then(r => r.ok ? r.json() : null)
        ]);

        if (prodRes?.products) setProducts(prodRes.products);
        if (settRes?.settings) setSettings(settRes.settings);
        if (ordRes?.orders) setOrders(ordRes.orders);
      } catch (err) {
        console.warn('Backend API connection fallback to local seed data:', err);
      }
    };
    fetchData();
  }, []);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Translations shortcut
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Cart operations
  const addToCart = (product, variantName = '', quantity = 1) => {
    const variant = variantName || (product.variants?.sizes?.[0] || product.variants?.colors?.[0] || 'Standard');
    const existingIndex = cart.findIndex(item => item.productId === product.id && item.variant === variant);

    if (existingIndex > -1) {
      setCart(prev => {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      });
      addToast(`Updated quantity for "${product.name}"`, 'success');
    } else {
      const newItem = {
        cartId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        productId: product.id,
        name: product.name,
        nameBn: product.nameBn || product.name,
        price: product.discountPrice || product.regularPrice,
        variant,
        quantity,
        image: product.images?.[0] || '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg',
        stock: product.stock
      };
      setCart(prev => [newItem, ...prev]);
      addToast(`Added "${product.name}" to cart`, 'success');
    }
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQty = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      couponDiscount = appliedCoupon.discountAmount;
    }
  }

  // Delivery estimation (Dhaka vs Outside Dhaka)
  const calculateShipping = (district) => {
    if (cartSubtotal >= settings.freeDeliveryThreshold) return 0;
    if (!district) return settings.insideDhakaDeliveryFee;
    const isDhaka = district.toLowerCase() === 'dhaka';
    return isDhaka ? settings.insideDhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  };

  // Coupons
  const applyCouponCode = async (code) => {
    if (!code) return { success: false, message: 'Please enter a code' };
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        addToast(`Coupon ${data.coupon.code} applied! Saved ৳${data.discount.toLocaleString()}`, 'success');
        return { success: true };
      } else {
        addToast(data.message || 'Invalid coupon', 'error');
        return { success: false, message: data.message };
      }
    } catch (e) {
      // Local fallback
      const found = INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (found) {
        if (cartSubtotal < found.minPurchase) {
          const msg = `Requires minimum purchase of ৳${found.minPurchase.toLocaleString()}`;
          addToast(msg, 'error');
          return { success: false, message: msg };
        }
        setAppliedCoupon(found);
        addToast(`Coupon ${found.code} applied!`, 'success');
        return { success: true };
      }
      addToast('Invalid coupon code', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Submit Order to Server
  const placeOrder = async (orderPayload) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => [data.order, ...prev]);
        setLastPlacedOrder(data.order);
        clearCart();
        setActiveView('order-success');
        addToast('Order confirmed successfully!', 'success');
        return { success: true, order: data.order };
      } else {
        addToast(data.message || 'Order failed', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      // Offline fallback
      const newOrder = {
        ...orderPayload,
        id: `ORD-BD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        orderStatus: 'Pending',
        timeline: [{ status: 'Order Placed', time: new Date().toLocaleString('en-GB') }]
      };
      setOrders(prev => [newOrder, ...prev]);
      setLastPlacedOrder(newOrder);
      clearCart();
      setActiveView('order-success');
      addToast('Order placed successfully!', 'success');
      return { success: true, order: newOrder };
    }
  };

  // Admin Order Status Update
  const updateOrderStatus = async (orderId, newStatus, paymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus, paymentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
      }
    } catch (e) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus, paymentStatus: paymentStatus || o.paymentStatus } : o));
      addToast(`Order updated to ${newStatus}`, 'success');
    }
  };

  // Admin Product Management
  const saveProduct = async (productData) => {
    const isEdit = Boolean(productData.id);
    const url = isEdit ? `/api/products/${productData.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setProducts(prev => prev.map(p => p.id === productData.id ? data.product : p));
          addToast(`Product "${data.product.name}" updated`, 'success');
        } else {
          setProducts(prev => [data.product, ...prev]);
          addToast(`Product "${data.product.name}" created`, 'success');
        }
        return { success: true };
      } else {
        addToast(data.message || 'Failed to save product', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      if (isEdit) {
        setProducts(prev => prev.map(p => p.id === productData.id ? { ...p, ...productData } : p));
        addToast('Product updated locally', 'success');
      } else {
        const newProd = { ...productData, id: `prod-${Date.now()}` };
        setProducts(prev => [newProd, ...prev]);
        addToast('Product added locally', 'success');
      }
      return { success: true };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productId));
      addToast('Product deleted', 'info');
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addToast('Product removed', 'info');
    }
  };

  // Admin Settings Update
  const updateStoreSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        addToast('Store settings updated', 'success');
      }
    } catch (err) {
      setSettings(prev => ({ ...prev, ...newSettings }));
      addToast('Settings updated', 'success');
    }
  };

  // Demo User Switcher (Customer <-> Admin)
  const switchUserRole = (role) => {
    if (role === 'admin') {
      setUser({
        id: 'usr-admin-demo',
        name: 'Store Administrator',
        email: 'admin@bongomart.com',
        role: 'admin',
        phone: '01711002233'
      });
      addToast('Switched to Admin Role', 'info');
    } else {
      setUser({
        id: 'usr-cust-demo',
        name: 'Shariful Islam',
        email: 'sharifulssk@gmail.com',
        role: 'customer',
        phone: '01712345678',
        savedAddresses: [
          {
            id: 'addr-1',
            title: 'Home (Gulshan)',
            division: 'Dhaka',
            district: 'Dhaka',
            upazila: 'Gulshan',
            address: 'Apartment 5A, Road 28, Gulshan-1'
          }
        ]
      });
      addToast('Switched to Customer Role', 'info');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        t,
        activeView,
        setActiveView,
        products,
        setProducts,
        categories,
        settings,
        orders,
        user,
        setUser,
        switchUserRole,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartSubtotal,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        couponDiscount,
        calculateShipping,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedBrand,
        setSelectedBrand,
        toasts,
        addToast,
        removeToast,
        placeOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        updateStoreSettings,
        paymentModal,
        setPaymentModal
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
