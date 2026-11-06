import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { 
  LayoutDashboard, Package, ShoppingCart, Tag, Settings, Plus, Edit2, 
  Trash2, ShieldCheck, CheckCircle2, TrendingUp, DollarSign, Users, AlertCircle, RefreshCw
} from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function AdminDashboard() {
  const {
    lang,
    t,
    user,
    switchUserRole,
    products,
    categories,
    orders,
    settings,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
    updateStoreSettings,
    addToast
  } = useStore();

  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'products' | 'orders' | 'coupons' | 'settings'

  // Product form modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    nameBn: '',
    category: 'electronics',
    brand: 'BongoCraft',
    regularPrice: 0,
    discountPrice: 0,
    stock: 10,
    sku: '',
    description: '',
    isFeatured: false,
    isFlashSale: false,
    variants: { colors: ['Standard'], sizes: ['Standard'] }
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    insideDhakaDeliveryFee: settings.insideDhakaDeliveryFee || 60,
    outsideDhakaDeliveryFee: settings.outsideDhakaDeliveryFee || 120,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 5000,
    announcementTextEn: settings.announcementTextEn || '',
    announcementTextBn: settings.announcementTextBn || '',
    contactPhone: settings.contactPhone || ''
  });

  // Coupon form state
  const [coupons, setCoupons] = useState([
    { code: 'BONGO10', discountPercent: 10, minPurchase: 2000, description: '10% off over ৳2,000' },
    { code: 'EID20', discountPercent: 20, minPurchase: 10000, description: '20% Eid discount over ৳10,000' },
    { code: 'WELCOME500', discountAmount: 500, minPurchase: 3000, description: '৳500 flat off over ৳3,000' }
  ]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: 10, minPurchase: 1500, description: '' });

  // If user is not admin, offer 1-click switch
  if (user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Authorization Required</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You are currently signed in as a customer ({user.email}). Switch to the verified Administrator role to manage store inventory, orders, and payment settings.
        </p>
        <button
          onClick={() => switchUserRole('admin')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          Sign In as Admin (Sharifulssk / Shariful Islam)
        </button>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing');
  const lowStockItems = products.filter(p => (p.stock || 0) <= 5);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      nameBn: '',
      category: 'electronics',
      brand: 'BongoCraft',
      regularPrice: 2500,
      discountPrice: 2100,
      stock: 15,
      sku: `BNG-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      description: 'Authentic Bangladeshi craftsmanship with modern finish.',
      isFeatured: true,
      isFlashSale: false,
      variants: { colors: ['Black', 'Navy'], sizes: ['Standard'] }
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      nameBn: prod.nameBn || prod.name,
      category: prod.category || 'electronics',
      brand: prod.brand || 'BongoCraft',
      regularPrice: prod.regularPrice,
      discountPrice: prod.discountPrice,
      stock: prod.stock,
      sku: prod.sku,
      description: prod.description,
      isFeatured: Boolean(prod.isFeatured),
      isFlashSale: Boolean(prod.isFlashSale),
      variants: prod.variants || { colors: ['Standard'], sizes: ['Standard'] }
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      id: editingProduct ? editingProduct.id : undefined,
      regularPrice: Number(productForm.regularPrice),
      discountPrice: Number(productForm.discountPrice),
      stock: Number(productForm.stock),
      images: editingProduct?.images || ['/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg']
    };
    await saveProduct(payload);
    setIsProductModalOpen(false);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    setCoupons(prev => [
      {
        code: newCoupon.code.toUpperCase().trim(),
        discountPercent: Number(newCoupon.discountPercent),
        minPurchase: Number(newCoupon.minPurchase),
        description: newCoupon.description || 'Admin promotional coupon'
      },
      ...prev
    ]);
    setNewCoupon({ code: '', discountPercent: 10, minPurchase: 1500, description: '' });
    addToast('Coupon created successfully', 'success');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateStoreSettings({
      insideDhakaDeliveryFee: Number(settingsForm.insideDhakaDeliveryFee),
      outsideDhakaDeliveryFee: Number(settingsForm.outsideDhakaDeliveryFee),
      freeDeliveryThreshold: Number(settingsForm.freeDeliveryThreshold),
      announcementTextEn: settingsForm.announcementTextEn,
      announcementTextBn: settingsForm.announcementTextBn,
      contactPhone: settingsForm.contactPhone
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">BongoMart Administrative Portal</h2>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Superuser: {user.name} ({user.email}) · Bangladesh Multi-Gateway & Inventory Control
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openNewProductModal}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => switchUserRole('customer')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
          >
            Switch to Customer View
          </button>
        </div>
      </div>

      {/* Admin Subnav */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeSection === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
          <span>Overview & Sales</span>
        </button>

        <button
          onClick={() => setActiveSection('products')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeSection === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-blue-600" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('orders')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeSection === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-purple-600" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('coupons')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeSection === 'coupons' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-600" />
          <span>Coupons & Promos</span>
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            activeSection === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-600" />
          <span>Shipping & Fees</span>
        </button>
      </div>

      {/* SECTION 1: OVERVIEW & ANALYTICS */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales (BDT)</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {formatBDT(totalRevenue)}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">Verified via bKash, Nagad & COD</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {orders.length}
              </div>
              <p className="text-[11px] text-slate-500">{pendingOrders.length} pending dispatch</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog Items</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {products.length}
              </div>
              <p className="text-[11px] text-slate-500">Across 6 BD categories</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alert</span>
              <div className="text-2xl font-extrabold text-amber-600 font-mono">
                {lowStockItems.length}
              </div>
              <p className="text-[11px] text-slate-500">Items with &le; 5 units</p>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Recent Customer Transactions</h3>
              <button
                onClick={() => setActiveSection('orders')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                View All Orders &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{order.id}</span>
                    <span className="text-slate-400 mx-1.5">·</span>
                    <span className="font-semibold text-slate-800">{order.customer.name}</span>
                    <span className="text-slate-400 mx-1.5">·</span>
                    <span className="text-slate-500">{order.customer.district}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">{formatBDT(order.total)}</span>
                    <span className="text-slate-500">via {order.paymentMethod}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUCTS MANAGER */}
      {activeSection === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Inventory Management ({products.length})</h3>
            <button
              onClick={openNewProductModal}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md border" />
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                          <div className="text-slate-400 text-[11px]">{p.brand}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium">{p.sku}</td>
                      <td className="px-4 py-3 capitalize">{p.category}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {formatBDT(p.discountPrice || p.regularPrice)}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold">
                        <span className={p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ORDERS MANAGER */}
      {activeSection === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Customer Orders & Dispatch ({orders.length})</h3>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5 text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{ord.id}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-semibold text-slate-800">{ord.customer.name}</span>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="font-mono text-slate-600">{ord.customer.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status updater */}
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => updateOrderStatus(ord.id, ord.orderStatus, 'Paid')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {ord.paymentStatus === 'Paid' ? 'Payment Verified' : 'Mark as Paid'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-slate-700">Delivery Address:</p>
                    <p className="text-slate-500">
                      {ord.customer.address}, {ord.customer.upazila ? `${ord.customer.upazila}, ` : ''}{ord.customer.district}, {ord.customer.division}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1 font-mono">TRX: {ord.transactionId}</p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold text-slate-700">Order Items: {ord.items.length}</p>
                    <p className="text-slate-500">
                      Subtotal: {formatBDT(ord.subtotal)} | Delivery: {formatBDT(ord.shippingFee)}
                    </p>
                    <p className="text-sm font-bold text-slate-900 font-mono mt-1">
                      Grand Total: {formatBDT(ord.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: COUPONS */}
      {activeSection === 'coupons' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateCoupon} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Create New Promotional Coupon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Coupon Code (e.g. EID30)"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
              />
              <input
                type="number"
                placeholder="Discount % (e.g. 15)"
                value={newCoupon.discountPercent}
                onChange={(e) => setNewCoupon(p => ({ ...p, discountPercent: e.target.value }))}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
              <input
                type="number"
                placeholder="Min Spend ৳ (e.g. 2000)"
                value={newCoupon.minPurchase}
                onChange={(e) => setNewCoupon(p => ({ ...p, minPurchase: e.target.value }))}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
            >
              Publish Coupon
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 text-xs">
                <span className="font-mono font-bold text-emerald-800 text-sm">{c.code}</span>
                <p className="text-slate-600 font-semibold">{c.discountPercent}% Discount</p>
                <p className="text-slate-400 text-[11px]">Minimum order: {formatBDT(c.minPurchase)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: SETTINGS */}
      {activeSection === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            Nationwide Shipping Rates & Store Announcements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Inside Dhaka Delivery Fee (৳)</label>
              <input
                type="number"
                value={settingsForm.insideDhakaDeliveryFee}
                onChange={(e) => setSettingsForm(p => ({ ...p, insideDhakaDeliveryFee: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Outside Dhaka Delivery Fee (৳)</label>
              <input
                type="number"
                value={settingsForm.outsideDhakaDeliveryFee}
                onChange={(e) => setSettingsForm(p => ({ ...p, outsideDhakaDeliveryFee: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Free Delivery Threshold (৳)</label>
              <input
                type="number"
                value={settingsForm.freeDeliveryThreshold}
                onChange={(e) => setSettingsForm(p => ({ ...p, freeDeliveryThreshold: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Announcement Bar (English)</label>
              <input
                type="text"
                value={settingsForm.announcementTextEn}
                onChange={(e) => setSettingsForm(p => ({ ...p, announcementTextEn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Announcement Bar (Bengali)</label>
              <input
                type="text"
                value={settingsForm.announcementTextBn}
                onChange={(e) => setSettingsForm(p => ({ ...p, announcementTextBn: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Save Store Configuration
          </button>
        </form>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Product Title (English) *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Product Title (Bengali)</label>
                <input
                  type="text"
                  value={productForm.nameBn}
                  onChange={(e) => setProductForm(p => ({ ...p, nameBn: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg capitalize"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm(p => ({ ...p, brand: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Regular Price ৳</label>
                  <input
                    type="number"
                    value={productForm.regularPrice}
                    onChange={(e) => setProductForm(p => ({ ...p, regularPrice: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Discount Price ৳</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm(p => ({ ...p, discountPrice: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(p => ({ ...p, stock: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm(p => ({ ...p, isFeatured: e.target.checked }))}
                    className="rounded text-emerald-600"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFlashSale}
                    onChange={(e) => setProductForm(p => ({ ...p, isFlashSale: e.target.checked }))}
                    className="rounded text-emerald-600"
                  />
                  <span>Festive Flash Sale</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
