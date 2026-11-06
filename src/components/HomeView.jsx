import React from 'react';
import { useStore } from '../context/StoreContext.jsx';
import HeroBanner from './HeroBanner.jsx';
import ProductCard from './ProductCard.jsx';
import { ArrowRight, Sparkles, Flame, Award, HeartHandshake } from 'lucide-react';

export default function HomeView() {
  const { lang, t, products, setActiveView, setActiveCategory } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 3);
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Storefront Hero */}
      <HeroBanner />

      {/* 2. Featured Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'বিশেষ নির্বাচন' : 'Editorial Selection'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t.featuredCollection}
            </h2>
          </div>

          <button
            onClick={() => setActiveView('shop')}
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'View Full Catalog'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Craftsmanship Story Section */}
      <section className="bg-slate-900 text-white py-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                <Award className="w-3.5 h-3.5" />
                <span>Heritage & Provenance</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
                {lang === 'bn' 
                  ? 'বাংলার মাটি, দেশীয় কারিগর ও নিখুঁত মান' 
                  : 'Rooted in Heritage. Crafted for the Modern World.'}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {lang === 'bn'
                  ? 'আমরা রূপগঞ্জের ঐতিহ্যবাহী তাঁতিদের খাঁটি সিল্ক সুতা থেকে শুরু করে শ্রীমঙ্গলের প্রথম পাতার অর্গানিক ব্ল্যাক টি সরাসরি সংগ্রহ করি। মধ্যস্বত্বভোগীহীনভাবে পণ্যের বিশুদ্ধতা এবং ন্যায্য মূল্য নিশ্চিত করাই আমাদের ব্রত।'
                  : 'Every piece in our catalog embodies authentic provenance. From pure Mulberry silk Jamdani woven in Narayanganj to ethically sourced whole-leaf teas from the hills of Moulvibazar, BongoMart bridges timeless artisan heritage with modern convenience.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <div className="border border-slate-800 p-3 rounded-xl bg-slate-800/40">
                  <span className="block text-emerald-400 font-bold text-lg">100%</span>
                  <span className="text-slate-400">Authentic Materials</span>
                </div>
                <div className="border border-slate-800 p-3 rounded-xl bg-slate-800/40">
                  <span className="block text-emerald-400 font-bold text-lg">64</span>
                  <span className="text-slate-400">Districts Delivered</span>
                </div>
                <div className="border border-slate-800 p-3 rounded-xl bg-slate-800/40">
                  <span className="block text-emerald-400 font-bold text-lg">24-48h</span>
                  <span className="text-slate-400">Dhaka Dispatch</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-4/3">
                <img
                  src="/src/assets/images/product_jamdani_heritage_1793971974016.jpg"
                  alt="Authentic Jamdani Weaving"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300">
                  <p className="font-semibold text-white">Hand-woven Jamdani Loom Detail</p>
                  <p className="text-[11px] text-slate-400">Master craft preserved over generations in Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Festive Flash Deals / Seasonal Special */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'bn' ? 'উৎসবের বিশেষ মূল্যছাড়' : 'Limited Festive Deals'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t.flashSale}
            </h2>
          </div>

          <button
            onClick={() => setActiveView('shop')}
            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
          >
            <span>{lang === 'bn' ? 'সব অফার দেখুন' : 'Explore All Offers'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Trusted Nationwide
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Loved by Customers in All 64 Districts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 text-xs">
            <p className="text-slate-700 leading-relaxed italic">
              "Ordered the Jamdani saree for my sister's wedding in Gulshan. Delivered within 24 hours with authentic verification tags. The gold zari weave is impeccable."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Nabila Chowdhury</h4>
                <p className="text-slate-500 text-[11px]">Gulshan-2, Dhaka</p>
              </div>
              <span className="text-emerald-700 font-semibold font-mono">bKash Verified</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 text-xs">
            <p className="text-slate-700 leading-relaxed italic">
              "The Eclipse ANC Headphones are unmatched for this price. Blocks out construction noise completely during work calls. Prompt delivery to Chattogram."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Dr. Tariqul Islam</h4>
                <p className="text-slate-500 text-[11px]">Panchlaish, Chattogram</p>
              </div>
              <span className="text-emerald-700 font-semibold font-mono">COD Customer</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 text-xs">
            <p className="text-slate-700 leading-relaxed italic">
              "The Sreemangal artisan whole-leaf tea has that unmistakable malt aroma. Packaging keeps it perfectly crisp. A true pride of Sylhet."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">Samira Ahsan</h4>
                <p className="text-slate-500 text-[11px]">Zindabazar, Sylhet</p>
              </div>
              <span className="text-emerald-700 font-semibold font-mono">Nagad Verified</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
