import React from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { ArrowRight, ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';

export default function HeroBanner() {
  const { lang, t, setActiveView, setActiveCategory } = useStore();

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span>{lang === 'bn' ? 'বাংলাদেশি ঐতিহ্য ও আধুনিক প্রযুক্তি' : 'Curated Bangladeshi Craft & Modern Tech'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              {lang === 'bn' 
                ? 'অনন্য আভিজাত্য ও বিশ্বস্ত কেনাকাটা' 
                : 'Pristine Craftsmanship, Delivered Across Bangladesh.'}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {lang === 'bn'
                ? 'খাঁটি রূপগঞ্জের জামদানি সিল্ক থেকে শুরু করে উন্নত স্টুডিও হেডফোন ও চামড়ার সামগ্রী। ৬৪ জেলায় দ্রুততম ডেলিভারি ও সুরক্ষিত পেমেন্ট।'
                : 'From heirloom Narayanganj Jamdani silk to studio-grade acoustics and full-grain leather goods. Verified authenticity with nationwide express delivery.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('shop')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>{lang === 'bn' ? 'পণ্যসমূহ ঘুরে দেখুন' : 'Explore Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveCategory('heritage');
                  setActiveView('shop');
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-colors"
              >
                {lang === 'bn' ? 'ঐতিহ্যবাহী পোশাক' : 'Heritage Fashion'}
              </button>
            </div>

            {/* Quick delivery callout */}
            <div className="pt-3 flex items-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                {lang === 'bn' ? 'ঢাকায় ২৪ ঘণ্টার মধ্যে' : '24h Delivery in Dhaka'}
              </span>
              <span>·</span>
              <span>{lang === 'bn' ? 'বিকাশ ও ক্যাশ অন ডেলিভারি' : 'bKash, Nagad & COD'}</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 aspect-16/9 lg:aspect-auto lg:h-[430px]">
              <img
                src="/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg"
                alt="BongoMart Premium Collection"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs backdrop-blur-md bg-slate-900/60 p-3 rounded-xl border border-white/10">
                <div>
                  <p className="font-bold text-sm">{lang === 'bn' ? 'উন্নত কারিগরি ও লাইফস্টাইল' : 'Artisanal Heritage & Modern Living'}</p>
                  <p className="text-slate-300 text-[11px]">{lang === 'bn' ? 'নতুন কালেকশন এখনই উপলভ্য' : 'New curated drops available nationwide'}</p>
                </div>
                <button
                  onClick={() => setActiveView('shop')}
                  className="px-3 py-1.5 bg-white text-slate-900 font-semibold rounded text-xs hover:bg-slate-100 transition-colors shrink-0"
                >
                  {lang === 'bn' ? 'অর্ডার করুন' : 'Shop Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Trust Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.trustTitle1}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.trustDesc1}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.trustTitle2}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.trustDesc2}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.trustTitle3}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.trustDesc3}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.trustTitle4}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.trustDesc4}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
