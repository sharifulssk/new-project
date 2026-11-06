import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { User, Package, Heart, MapPin, Shield, CheckCircle2, Clock, Truck, Plus, Trash2, ArrowRight } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function CustomerDashboard() {
  const {
    lang,
    t,
    user,
    setUser,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    setSelectedProduct,
    setActiveView,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'wishlist' | 'addresses' | 'profile'
  const [newAddress, setNewAddress] = useState({
    title: 'Work / Office',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Banani',
    address: 'Road 11, Block D, House 24'
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Filter orders for current user phone or demo
  const userOrders = orders; // Show user orders in demo

  // Get wishlist products
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.address.trim()) {
      addToast('Please enter address details', 'error');
      return;
    }
    const created = {
      id: `addr-${Date.now()}`,
      ...newAddress
    };
    setUser(prev => ({
      ...prev,
      savedAddresses: [...(prev.savedAddresses || []), created]
    }));
    setShowAddAddress(false);
    addToast('New delivery address saved!', 'success');
  };

  const handleDeleteAddress = (id) => {
    setUser(prev => ({
      ...prev,
      savedAddresses: (prev.savedAddresses || []).filter(a => a.id !== id)
    }));
    addToast('Address removed', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Overview Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium capitalize">
                {user.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {user.phone} · {user.email}
            </p>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-6 text-xs border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <span className="block text-slate-400 font-medium">Orders Placed</span>
            <span className="text-base font-bold text-slate-900 font-mono">{userOrders.length}</span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium">Wishlist Items</span>
            <span className="text-base font-bold text-slate-900 font-mono">{wishlist.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Functional segmented tabs) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit mb-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'} ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'wishlist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{lang === 'bn' ? 'পছন্দের তালিকা' : 'Wishlist'} ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'addresses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>{lang === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Saved Addresses'}</span>
        </button>
      </div>

      {/* Tab 1: Orders with Live Tracking */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">You have no active orders yet.</p>
              <button
                onClick={() => setActiveView('shop')}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            userOrders.map((order) => {
              const isDelivered = order.orderStatus === 'Delivered';
              const isShipped = order.orderStatus === 'Shipped';
              const isProcessing = order.orderStatus === 'Processing';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : isShipped
                            ? 'bg-blue-100 text-blue-800'
                            : isProcessing
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Tracking visual bar */}
                  <div className="py-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                      <span className="text-emerald-700 font-bold">1. Order Placed</span>
                      <span className={order.orderStatus !== 'Pending' ? 'text-emerald-700 font-bold' : ''}>2. Processing</span>
                      <span className={isShipped || isDelivered ? 'text-emerald-700 font-bold' : ''}>3. Shipped</span>
                      <span className={isDelivered ? 'text-emerald-700 font-bold' : ''}>4. Delivered</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-600 h-full w-1/4" />
                      <div className={`h-full w-1/4 ${order.orderStatus !== 'Pending' ? 'bg-emerald-600' : 'bg-transparent'}`} />
                      <div className={`h-full w-1/4 ${isShipped || isDelivered ? 'bg-emerald-600' : 'bg-transparent'}`} />
                      <div className={`h-full w-1/4 ${isDelivered ? 'bg-emerald-600' : 'bg-transparent'}`} />
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="divide-y divide-slate-100 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md border" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p className="text-slate-500 text-[11px]">
                              Qty: {item.quantity} {item.variant ? `· ${item.variant}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {formatBDT(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Shipping details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                      <span>Ship to: </span>
                      <span className="text-slate-800 font-medium">
                        {order.customer.address}, {order.customer.district} ({order.customer.phone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Total:</span>
                      <span className="font-mono font-bold text-base text-slate-900">
                        {formatBDT(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">Your wishlist is currently empty.</p>
              <button
                onClick={() => setActiveView('shop')}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col p-4 space-y-3">
                  <div 
                    onClick={() => setSelectedProduct(prod)}
                    className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 
                      onClick={() => setSelectedProduct(prod)}
                      className="font-semibold text-xs text-slate-900 hover:text-emerald-700 cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h4>
                    <div className="text-xs font-bold font-mono text-slate-900 mt-1">
                      {formatBDT(prod.discountPrice || prod.regularPrice)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => addToCart(prod)}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Delivery Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Registered Delivery Locations</h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New address form */}
          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Add Destination in Bangladesh</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Address Label (e.g. Home, Office)"
                  value={newAddress.title}
                  onChange={(e) => setNewAddress(p => ({ ...p, title: e.target.value }))}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="District (e.g. Dhaka, Chattogram)"
                  value={newAddress.district}
                  onChange={(e) => setNewAddress(p => ({ ...p, district: e.target.value }))}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Upazila / Thana"
                  value={newAddress.upazila}
                  onChange={(e) => setNewAddress(p => ({ ...p, upazila: e.target.value }))}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <textarea
                rows={2}
                placeholder="House, road, flat details"
                value={newAddress.address}
                onChange={(e) => setNewAddress(p => ({ ...p, address: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List of saved addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(user.savedAddresses || []).map((addr) => (
              <div key={addr.id} className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{addr.title}</span>
                  </span>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-600">{addr.address}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {addr.upazila ? `${addr.upazila}, ` : ''}{addr.district}, {addr.division}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
