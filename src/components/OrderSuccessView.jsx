import React from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { CheckCircle2, Package, Truck, Printer, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function OrderSuccessView() {
  const { lang, t, lastPlacedOrder, setActiveView } = useStore();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 text-sm">No recent order found.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
        >
          {t.continueShopping}
        </button>
      </div>
    );
  }

  const { id, customer, items, total, subtotal, shippingFee, discount, paymentMethod, paymentStatus, transactionId, orderStatus } = lastPlacedOrder;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.orderConfirmed}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t.thankYou} A confirmation SMS and digital invoice have been dispatched to <b>{customer.phone}</b>.
          </p>
        </div>

        {/* Order Identifier & Payment Details Badge */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
          <div>
            <span className="block text-[11px] text-slate-600">Order ID</span>
            <span className="font-mono font-bold text-slate-900">{id}</span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-600">Payment</span>
            <span className="font-semibold text-slate-900">{paymentMethod}</span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-600">Payment Status</span>
            <span className={`font-semibold ${paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {paymentStatus}
            </span>
          </div>
          <div>
            <span className="block text-[11px] text-slate-600">Transaction ID</span>
            <span className="font-mono font-medium text-slate-800 text-[11px] truncate block" title={transactionId}>
              {transactionId}
            </span>
          </div>
        </div>

        {/* Live Order Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>{t.orderTracking}</span>
          </h4>

          <div className="relative pl-6 border-l-2 border-emerald-500 space-y-4 text-xs">
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
              <p className="font-bold text-slate-900">Order Placed & Verified</p>
              <p className="text-slate-500 text-[11px]">{new Date().toLocaleString('en-GB')}</p>
            </div>
            <div className="relative opacity-70">
              <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
              <p className="font-semibold text-slate-700">Quality Check & Packaging at Gulshan Hub</p>
              <p className="text-slate-500 text-[11px]">Estimated within 6-12 hours</p>
            </div>
            <div className="relative opacity-60">
              <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
              <p className="font-semibold text-slate-700">Courier Handover (Steadfast / Paperfly)</p>
              <p className="text-slate-500 text-[11px]">Tracking number will be sent via SMS</p>
            </div>
            <div className="relative opacity-50">
              <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-slate-100" />
              <p className="font-semibold text-slate-700">Doorstep Delivery in {customer.district}</p>
              <p className="text-slate-500 text-[11px]">Expected within 24-48 hours</p>
            </div>
          </div>
        </div>

        {/* Delivery Address & Customer Snapshot */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Shipping Destination</span>
          </div>
          <p className="text-slate-700 font-medium">{customer.name} · <span className="font-mono">{customer.phone}</span></p>
          <p className="text-slate-600">{customer.address}, {customer.upazila ? `${customer.upazila}, ` : ''}{customer.district}, {customer.division}</p>
          {customer.notes && <p className="text-slate-500 italic">Notes: "{customer.notes}"</p>}
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Purchased Items ({items.length})
          </h4>
          <div className="divide-y divide-slate-100">
            {items.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {it.image && (
                    <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded-md border" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{it.name}</p>
                    <p className="text-slate-500 text-[11px]">Qty: {it.quantity} {it.variant ? `· ${it.variant}` : ''}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {formatBDT(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums text-slate-900">{formatBDT(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-mono tabular-nums">-{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span className="font-mono tabular-nums text-slate-900">
                {shippingFee === 0 ? 'FREE' : formatBDT(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t">
              <span>Total Paid:</span>
              <span className="font-mono tabular-nums text-base">{formatBDT(total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => setActiveView('customer')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <span>Track in Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveView('shop')}
            className="w-full sm:w-auto sm:ml-auto text-xs font-semibold text-emerald-700 hover:underline"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
}
