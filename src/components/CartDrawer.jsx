import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function CartDrawer() {
  const {
    lang,
    t,
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    couponDiscount,
    settings,
    setActiveView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 5000;
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    setIsApplying(true);
    await applyCouponCode(code);
    setIsApplying(false);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t.cart} ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Goal Progress */}
        <div className="px-5 py-3 bg-emerald-50/60 border-b border-emerald-100 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-emerald-900 font-medium mb-1.5">
              {lang === 'bn' 
                ? `ফ্রি ডেলিভারির জন্য আরও ${formatBDT(remainingForFreeShipping)} টাকার পণ্য যোগ করুন`
                : `Add ${formatBDT(remainingForFreeShipping)} more to unlock Free Nationwide Delivery!`}
            </p>
          ) : (
            <p className="text-emerald-800 font-bold flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? '🎉 আপনি ফ্রি ডেলিভারি পাচ্ছেন!' : '🎉 You have unlocked Free Delivery across Bangladesh!'}</span>
            </p>
          )}
          <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900">{t.emptyCart}</h3>
              <p className="text-xs text-slate-500 max-w-xs">{t.emptyCartDesc}</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('shop');
                }}
                className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="flex gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 items-center"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg bg-white overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {lang === 'bn' ? (item.nameBn || item.name) : item.name}
                  </h4>
                  {item.variant && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.variant}
                    </p>
                  )}
                  <div className="text-xs font-bold text-slate-900 font-mono tabular-nums mt-1">
                    {formatBDT(item.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-md bg-white">
                  <button
                    onClick={() => updateCartQty(item.cartId, item.quantity - 1)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.cartId, item.quantity + 1)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout (Only if cart has items) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3.5">
            {/* Coupon Section */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-900">{appliedCoupon.code}</span>
                  <span className="text-emerald-700">(-{formatBDT(couponDiscount)})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-slate-400 hover:text-rose-600 font-semibold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon: BONGO10 or EID20"
                    className="flex-1 px-3 py-1.5 text-xs uppercase bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 font-mono"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplying || !couponInput.trim()}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {isApplying ? '...' : t.applyCoupon}
                  </button>
                </div>
                {/* 1-Click Coupon Suggestions */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Try:</span>
                  <button
                    onClick={() => handleApplyCoupon('BONGO10')}
                    className="text-emerald-700 underline font-mono font-medium"
                  >
                    BONGO10
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => handleApplyCoupon('EID20')}
                    className="text-emerald-700 underline font-mono font-medium"
                  >
                    EID20
                  </button>
                </div>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono tabular-nums text-slate-900">{formatBDT(cartSubtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{t.discount}</span>
                  <span className="font-mono tabular-nums">-{formatBDT(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {cartSubtotal >= freeDeliveryThreshold ? (
                    <span className="text-emerald-700 font-bold">{t.freeShipping}</span>
                  ) : (
                    lang === 'bn' ? 'চেকআউটে নির্ধারিত হবে' : 'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t.grandTotal}</span>
                <span className="font-mono tabular-nums text-base">
                  {formatBDT(Math.max(0, cartSubtotal - couponDiscount))}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
