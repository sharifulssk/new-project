import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { BD_DIVISIONS, validateBdPhone, formatBDT } from '../data/bdLocations.js';
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Check, AlertCircle, ShoppingBag } from 'lucide-react';

export default function CheckoutView() {
  const {
    lang,
    t,
    cart,
    cartSubtotal,
    appliedCoupon,
    couponDiscount,
    settings,
    placeOrder,
    setActiveView,
    addToast,
    setPaymentModal,
    user
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('');
  const [address, setAddress] = useState(user?.savedAddresses?.[0]?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash'); // 'bKash' | 'Cash on Delivery' | 'Nagad' | 'SSLCommerz'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current districts based on selected division
  const currentDivisionObj = BD_DIVISIONS.find(d => d.name === division) || BD_DIVISIONS[0];
  const availableDistricts = currentDivisionObj.districts;

  // Calculate Shipping Charge (Dhaka vs Outside Dhaka)
  const isDhaka = district.toLowerCase() === 'dhaka' || division.toLowerCase() === 'dhaka';
  let shippingFee = isDhaka ? settings.insideDhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  if (cartSubtotal >= settings.freeDeliveryThreshold) {
    shippingFee = 0;
  }

  const grandTotal = Math.max(0, cartSubtotal + shippingFee - couponDiscount);

  const handleSubmitCheckout = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!validateBdPhone(phone)) {
      addToast('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX)', 'error');
      return;
    }
    if (!address.trim()) {
      addToast('Please enter your detailed delivery street address', 'error');
      return;
    }
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    const orderPayload = {
      customer: {
        name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        division,
        district,
        upazila: upazila.trim(),
        address: address.trim(),
        notes: notes.trim()
      },
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        variant: item.variant,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: cartSubtotal,
      shippingFee,
      discount: couponDiscount,
      couponCode: appliedCoupon?.code || '',
      total: grandTotal,
      paymentMethod
    };

    // If Cash on Delivery, place directly
    if (paymentMethod === 'Cash on Delivery') {
      setIsSubmitting(true);
      placeOrder({
        ...orderPayload,
        paymentStatus: 'Pending',
        transactionId: `COD_${Date.now().toString().slice(-6)}`
      }).finally(() => setIsSubmitting(false));
      return;
    }

    // Otherwise, launch interactive Payment Gateway Sandbox modal for authentic verification!
    setPaymentModal({
      isOpen: true,
      method: paymentMethod,
      amount: grandTotal,
      orderData: orderPayload,
      onSuccess: (paymentResult) => {
        setIsSubmitting(true);
        placeOrder({
          ...orderPayload,
          paymentStatus: paymentResult.paymentStatus,
          transactionId: paymentResult.transactionId
        }).finally(() => setIsSubmitting(false));
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t.emptyCart}</h2>
        <p className="text-xs text-slate-500">{t.emptyCartDesc}</p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
        >
          {t.continueShopping}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => setActiveView('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Delivery Details Form (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmitCheckout} id="checkout-form" className="space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <span>{lang === 'bn' ? 'গ্রাহকের যোগাযোগের তথ্য' : 'Customer Information'}</span>
                </h3>
                <span className="text-[11px] text-slate-500">BD Mobile Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Shariful Islam"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">{t.phone} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">{t.email} (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For digital invoice & tracking"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2: Delivery Address (Division & District) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <span>{lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Nationwide Shipping Address'}</span>
                </h3>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {isDhaka ? `Inside Dhaka: ৳${settings.insideDhakaDeliveryFee}` : `Outside Dhaka: ৳${settings.outsideDhakaDeliveryFee}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">{t.division} *</label>
                  <select
                    value={division}
                    onChange={(e) => {
                      const newDiv = e.target.value;
                      setDivision(newDiv);
                      const divObj = BD_DIVISIONS.find(d => d.name === newDiv);
                      if (divObj && divObj.districts.length > 0) {
                        setDistrict(divObj.districts[0]);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div.name} value={div.name}>
                        {div.name} ({div.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">{t.district} *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                  >
                    {availableDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">{t.upazila} / Area</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder="e.g. Gulshan / Banani / Mirpur / Sadar"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">{t.deliveryAddress} *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, road number, flat/floor details"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">{t.orderNotes}</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, leave with guard"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  <span>{t.paymentMethod}</span>
                </h3>
                <span className="text-[11px] text-emerald-700 font-mono font-medium">100% Verified Gateway</span>
              </div>

              <div className="space-y-2.5">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 text-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{t.cod}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Zero Fee</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.codDesc}</p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'bKash'
                      ? 'border-[#E2136E] bg-pink-50/40 ring-1 ring-[#E2136E]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bKash"
                    checked={paymentMethod === 'bKash'}
                    onChange={() => setPaymentMethod('bKash')}
                    className="mt-1 text-[#E2136E]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="text-[#E2136E]">bKash</span> {t.bkash}
                      </span>
                      <span className="text-[10px] bg-pink-100 text-[#E2136E] font-bold px-2 py-0.5 rounded">Instant Sandbox</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.bkashDesc}</p>
                  </div>
                </label>

                {/* Nagad */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'border-[#F7931E] bg-orange-50/40 ring-1 ring-[#F7931E]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Nagad"
                    checked={paymentMethod === 'Nagad'}
                    onChange={() => setPaymentMethod('Nagad')}
                    className="mt-1 text-[#F7931E]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="text-[#F7931E]">নগদ</span> {t.nagad}
                      </span>
                      <span className="text-[10px] bg-orange-100 text-[#F7931E] font-bold px-2 py-0.5 rounded">Fast Pay</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.nagadDesc}</p>
                  </div>
                </label>

                {/* SSLCommerz */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'SSLCommerz'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="SSLCommerz"
                    checked={paymentMethod === 'SSLCommerz'}
                    onChange={() => setPaymentMethod('SSLCommerz')}
                    className="mt-1 text-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{t.sslcommerz}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">Cards & Banking</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.sslcommerzDesc}</p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary & Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              {lang === 'bn' ? 'অর্ডারের বিবরণ' : 'Order Summary'} ({cart.reduce((s, i) => s + i.quantity, 0)} {t.items})
            </h3>

            {/* Item list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-3 text-xs items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {lang === 'bn' ? (item.nameBn || item.name) : item.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} {item.variant ? `· ${item.variant}` : ''}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-mono tabular-nums text-slate-900">{formatBDT(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{t.discount} ({appliedCoupon?.code})</span>
                  <span className="font-mono tabular-nums">-{formatBDT(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>
                  {t.shipping} ({isDhaka ? 'Dhaka' : 'Outside Dhaka'})
                </span>
                <span className="font-mono tabular-nums text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">{t.freeShipping}</span>
                  ) : (
                    formatBDT(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">{t.grandTotal}</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatBDT(grandTotal)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Processing Order...'
                  : paymentMethod === 'Cash on Delivery'
                  ? `Confirm Order (${formatBDT(grandTotal)})`
                  : `Proceed to ${paymentMethod} (${formatBDT(grandTotal)})`}
              </span>
            </button>

            <div className="text-[11px] text-slate-500 text-center space-y-1">
              <p>🔒 256-Bit SSL Encrypted & Verified Server Processing</p>
              <p>{lang === 'bn' ? 'সরাসরি অফিসিয়াল পেমেন্ট এপিআই ও এসএমএস ট্র্যাকিং' : 'Real-time Payment API & SMS tracking notifications'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
