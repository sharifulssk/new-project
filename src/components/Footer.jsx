import React from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const { lang, t, settings, setActiveView, setActiveCategory } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* Newsletter Strip */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              {t.newsletterTitle}
            </h3>
            <p className="text-slate-400 text-xs">
              {t.newsletterDesc}
            </p>
          </div>

          <div className="flex w-full md:w-auto max-w-sm gap-2">
            <input
              type="email"
              placeholder={lang === 'bn' ? 'আপনার ইমেইল অ্যাড্রেস...' : 'Enter your email...'}
              className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => alert(lang === 'bn' ? 'সাবস্ক্রিপশনের জন্য ধন্যবাদ!' : 'Thank you for subscribing to BongoMart!')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors shrink-0"
            >
              {t.subscribe}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="text-xl font-black text-white tracking-tight">
              Bongo<span className="text-emerald-400">Mart</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {lang === 'bn' 
                ? 'বাংলাদেশের ঐতিহ্যবাহী কারুশিল্প ও আধুনিক প্রযুক্তির বিশ্বস্ত মেলবন্ধন। শতভাগ খাঁটি পণ্য ও নিরাপদ দেশীয় পেমেন্ট।'
                : 'Bangladesh’s premier destination for verified artisan crafts, luxury lifestyle goods, and authentic audio & computing hardware.'}
            </p>
            <div className="pt-1 text-[11px] text-slate-500">
              Trade License: TRAD/DNCC/029182/2026
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => { setActiveCategory('heritage'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Handcrafted Jamdani Silk
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('electronics'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Pro Wireless Audio & Tech
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('leather'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Full-Grain Leather Goods
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('artisan'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Sreemangal Single-Estate Teas
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActiveView('customer')} className="hover:text-white transition-colors">
                  Track Your Parcel
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('customer')} className="hover:text-white transition-colors">
                  7-Day Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('customer')} className="hover:text-white transition-colors">
                  Nationwide Shipping Rates
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Admin & Inventory Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Physical Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Office</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Partners & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span>Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800 font-bold">bKash</span>
            <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 font-bold">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">SSLCommerz</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">Cash on Delivery</span>
          </div>

          <p className="text-[11px] text-slate-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} BongoMart Bangladesh. Built with passion for Bangladeshi commerce.
          </p>
        </div>
      </div>
    </footer>
  );
}
