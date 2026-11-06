import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';
import { ShoppingBag, Heart, Search, User, ShieldCheck, Globe, Menu, X, ArrowRight } from 'lucide-react';
import { formatBDT } from '../data/bdLocations.js';

export default function Navbar() {
  const {
    lang,
    setLang,
    t,
    cart,
    wishlist,
    cartSubtotal,
    setIsCartOpen,
    activeView,
    setActiveView,
    user,
    switchUserRole,
    searchQuery,
    setSearchQuery,
    settings
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const announcement = lang === 'bn' ? settings.announcementTextBn : settings.announcementTextEn;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-slate-900 text-slate-100 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <span>{announcement}</span>
        </div>
      )}

      {/* Main Navigation (One-row, 3-zone contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              Bongo<span className="text-emerald-600">Mart</span>
            </button>
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              BD ৳
            </span>
          </div>

          {/* Zone 2: 4-5 Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${
                activeView === 'home' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              {lang === 'bn' ? 'হোমপেজ' : 'Storefront'}
            </button>
            <button
              onClick={() => setActiveView('shop')}
              className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${
                activeView === 'shop' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              {lang === 'bn' ? 'সব পণ্য' : 'Catalog'}
            </button>
            <button
              onClick={() => {
                setActiveView('customer');
              }}
              className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${
                activeView === 'customer' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              {lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 hover:text-emerald-600 transition-colors whitespace-nowrap ${
                activeView === 'admin' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Portal'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search Input / Trigger */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'shop') setActiveView('shop');
                }}
                placeholder={lang === 'bn' ? 'পণ্য খুঁজুন...' : 'Search collection...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-slate-900 rounded-lg border border-transparent focus:border-slate-300 focus:outline-none transition-all placeholder:text-slate-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Role Demo Switcher */}
            <div className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => switchUserRole('customer')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  user.role === 'customer'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  user.role === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveView('customer')}
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Primary Action: Shopping Cart Drawer Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-xs"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{totalCartCount}</span>
              <span className="hidden sm:inline border-l border-slate-700 pl-2 font-mono tabular-nums text-slate-300">
                {formatBDT(cartSubtotal)}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') setActiveView('shop');
              }}
              placeholder={lang === 'bn' ? 'পণ্য খুঁজুন...' : 'Search items...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 focus:bg-white text-slate-900 rounded-lg border border-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-2">
            <button
              onClick={() => {
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              {lang === 'bn' ? 'হোমপেজ' : 'Storefront'}
            </button>
            <button
              onClick={() => {
                setActiveView('shop');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              {lang === 'bn' ? 'সব পণ্য' : 'Catalog'}
            </button>
            <button
              onClick={() => {
                setActiveView('customer');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              {lang === 'bn' ? 'গ্রাহক ড্যাশবোর্ড ও ট্র্যাকিং' : 'My Account & Orders'}
            </button>
            <button
              onClick={() => {
                setActiveView('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md flex items-center justify-between"
            >
              <span>{lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Portal'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3 text-xs text-slate-500">
              <span>Current Role: {user.role.toUpperCase()}</span>
              <button
                onClick={() => switchUserRole(user.role === 'admin' ? 'customer' : 'admin')}
                className="text-emerald-600 font-semibold underline"
              >
                Switch to {user.role === 'admin' ? 'Customer' : 'Admin'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
