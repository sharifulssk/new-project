/**
 * Seed data for BongoMart E-Commerce Platform
 * Features authentic Bangladeshi products, luxury imports, and local artisanal craft.
 */

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Products', nameBn: 'সকল পণ্য', slug: 'all', icon: 'Sparkles' },
  { id: 'electronics', name: 'Electronics & Audio', nameBn: 'ইলেকট্রনিক্স ও অডিও', slug: 'electronics', icon: 'Headphones' },
  { id: 'heritage', name: 'Heritage Fashion', nameBn: 'ঐতিহ্যবাহী পোশাক', slug: 'heritage-fashion', icon: 'Shirt' },
  { id: 'leather', name: 'Leather Goods', nameBn: 'চামড়ার সামগ্রী', slug: 'leather-goods', icon: 'Briefcase' },
  { id: 'artisan', name: 'Organic & Food', nameBn: 'অর্গানিক ও খাদ্য', slug: 'organic-food', icon: 'Coffee' },
  { id: 'home', name: 'Living & Decor', nameBn: 'গৃহস্থালি ও সাজসজ্জা', slug: 'living-decor', icon: 'Home' }
];

export const INITIAL_BRANDS = [
  'BongoCraft', 'Eclipse Audio', 'Aarong Heritage', 'Apex Leather', 'Sreemangal Organic', 'Bengal Essentials'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Handcrafted Jamdani Pure Silk Saree',
    nameBn: 'হস্তশিল্প জামদানি খাঁটি সিল্ক শাড়ি',
    slug: 'handcrafted-jamdani-pure-silk-saree',
    sku: 'JAM-DHK-001',
    category: 'heritage',
    brand: 'Aarong Heritage',
    regularPrice: 18500,
    discountPrice: 15900,
    images: [
      '/src/assets/images/product_jamdani_heritage_1793971974016.jpg',
      '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'
    ],
    stock: 12,
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    isFlashSale: true,
    variants: {
      colors: ['Midnight Navy & Gold', 'Crimson Red', 'Royal Emerald'],
      sizes: ['Standard 12 Haat']
    },
    tags: ['Traditional', 'Silk', 'Wedding', 'Handmade'],
    description: 'Authentic 84-count pure Mulberry silk Jamdani hand-woven by master weavers in Rupganj, Narayanganj. Features traditional "Panna Hajar" and intricate gold zari floral motifs. Ideal for weddings, cultural festivals, and heirloom collections.',
    descriptionBn: 'নারায়ণগঞ্জের রূপগঞ্জের ঐতিহ্যবাহী তাঁতিদের হাতে বোনা খাঁটি ৮৪-কাউন্ট তুত রেশম জামদানি শাড়ি। এতে রয়েছে পান্না হাজার ও সূক্ষ্ম সোনালী জরি কাজের নকশা।',
    reviews: [
      { id: 'rev-1', user: 'Farzana Rahman', rating: 5, date: '2026-10-15', comment: 'Absolutely breathtaking craftsmanship! The zari work glistens subtly in daylight.' },
      { id: 'rev-2', user: 'Tanzina Ahmed', rating: 5, date: '2026-10-28', comment: 'Authentic Jamdani texture. Delivered inside Dhaka within 24 hours.' }
    ]
  },
  {
    id: 'prod-002',
    name: 'Eclipse Pro Active Noise Cancelling Headphones',
    nameBn: 'এক্লিপ্স প্রো অ্যাক্টিভ নয়েজ ক্যানসেলিং হেডফোন',
    slug: 'eclipse-pro-anc-headphones',
    sku: 'ECL-ANC-900',
    category: 'electronics',
    brand: 'Eclipse Audio',
    regularPrice: 14500,
    discountPrice: 11990,
    images: [
      '/src/assets/images/product_wireless_headphones_1793971975067.jpg',
      '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'
    ],
    stock: 24,
    rating: 4.8,
    reviewCount: 64,
    isFeatured: true,
    isFlashSale: false,
    variants: {
      colors: ['Matte Black', 'Graphite Silver'],
      sizes: ['Over-Ear']
    },
    tags: ['Wireless', 'Bluetooth 5.4', 'ANC', 'Hi-Res Audio'],
    description: 'Engineered for pristine acoustic clarity and studio-grade audio. Features hybrid -42dB active noise cancellation, custom 40mm graphene drivers, dual environmental beamforming mics, and 45-hour continuous battery life.',
    descriptionBn: 'স্টুডিও মানের শব্দ ও হাইব্রিড নয়েজ ক্যানসেলেশন সহ প্রিমিয়াম হেডফোন। এক চার্জে ৪৫ ঘণ্টা পর্যন্ত ব্যাটারি ব্যাকআপ।',
    reviews: [
      { id: 'rev-3', user: 'Shahriar Kabir', rating: 5, date: '2026-10-20', comment: 'The ANC blocks out Dhaka traffic noise completely on my daily commute.' }
    ]
  },
  {
    id: 'prod-003',
    name: 'Artisan Full-Grain Leather Messenger Briefcase',
    nameBn: 'হাতে তৈরি খাঁটি লেদার মেসেঞ্জার ব্রিফকেস',
    slug: 'artisan-full-grain-leather-messenger',
    sku: 'APX-LTH-402',
    category: 'leather',
    brand: 'Apex Leather',
    regularPrice: 9200,
    discountPrice: 7950,
    images: [
      '/src/assets/images/product_leather_bag_1793971976397.jpg',
      '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'
    ],
    stock: 18,
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    isFlashSale: false,
    variants: {
      colors: ['Caramel Tan', 'Vintage Espresso', 'Charcoal Black'],
      sizes: ['15-inch Laptop', '16-inch Pro']
    },
    tags: ['Genuine Leather', 'Handmade', 'Water-Resistant', 'Workwear'],
    description: 'Crafted from premium Bangladeshi cowhide leather with natural vegetable tanning. Features solid antique brass hardware, padded 15.6" laptop compartment, organizer pockets, and an adjustable ergonomic shoulder strap.',
    descriptionBn: 'শতভাগ খাঁটি দেশীয় চামড়ায় তৈরি প্রিমিয়াম ল্যাপটপ ব্যাগ। টেকসই কারিগরি এবং মজবুত ব্রাস বাকলযুক্ত।',
    reviews: [
      { id: 'rev-4', user: 'Rafiqul Islam', rating: 5, date: '2026-11-01', comment: 'Supreme leather smell and grain texture. Holds my MacBook Pro securely.' }
    ]
  },
  {
    id: 'prod-004',
    name: 'Sreemangal Single-Estate Whole Leaf Artisan Tea',
    nameBn: 'শ্রীমঙ্গল সিঙ্গেল-এস্টেট খাঁটি পাতা ব্ল্যাক টি',
    slug: 'sreemangal-single-estate-artisan-tea',
    sku: 'SRM-TEA-250',
    category: 'artisan',
    brand: 'Sreemangal Organic',
    regularPrice: 1250,
    discountPrice: 950,
    images: [
      '/src/assets/images/product_tea_artisan_1793971977116.jpg',
      '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'
    ],
    stock: 60,
    rating: 5.0,
    reviewCount: 89,
    isFeatured: true,
    isFlashSale: true,
    variants: {
      colors: ['Airtight Black Tin'],
      sizes: ['250g Tin', '500g Reserve']
    },
    tags: ['Organic', 'Single Estate', 'Antioxidant', 'Loose Leaf'],
    description: 'Hand-picked first-flush whole leaf black tea harvested from mist-covered slopes of Sreemangal, Moulvibazar. Delivers notes of wild honey, toasted malt, and a smooth golden liquor.',
    descriptionBn: 'মৌলভীবাজারের শ্রীমঙ্গলের পাহাড় থেকে সংগৃহীত শতভাগ অর্গানিক ও সুগন্ধযুক্ত খাঁটি চা পাতা।',
    reviews: [
      { id: 'rev-5', user: 'Nasreen Akhter', rating: 5, date: '2026-11-03', comment: 'The aroma when opening the tin is extraordinary. True taste of Sylhet.' }
    ]
  },
  {
    id: 'prod-005',
    name: 'Bespoke Walnut Desk Organizer & Clock',
    nameBn: 'প্রিমিয়াম কাঠ ডেস্ক অর্গানাইজার ও ঘড়ি',
    slug: 'bespoke-walnut-desk-organizer',
    sku: 'BNG-WOD-105',
    category: 'home',
    brand: 'BongoCraft',
    regularPrice: 4200,
    discountPrice: 3500,
    images: [
      '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'
    ],
    stock: 22,
    rating: 4.7,
    reviewCount: 19,
    isFeatured: false,
    isFlashSale: false,
    variants: {
      colors: ['Natural Walnut', 'Teak Gold'],
      sizes: ['Compact', 'Standard']
    },
    tags: ['Handcrafted', 'Solid Wood', 'Minimalist', 'Home Office'],
    description: 'Precision milled solid hardwood desk tray with magnetic cable channels, dedicated phone dock, and silent brass analog movement.',
    descriptionBn: 'প্রাকৃতিক কাঠের তৈরি আভিজাত্যপূর্ণ ডেস্ক অর্গানাইজার ও টেবিল ঘড়ি।',
    reviews: []
  },
  {
    id: 'prod-006',
    name: 'Mechanical Tactile Wireless Keyboard',
    nameBn: 'মেকানিক্যাল ওয়্যারলেস কিবোর্ড',
    slug: 'mechanical-tactile-wireless-keyboard',
    sku: 'ECL-KEY-87',
    category: 'electronics',
    brand: 'Eclipse Audio',
    regularPrice: 7800,
    discountPrice: 6500,
    images: [
      '/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'
    ],
    stock: 15,
    rating: 4.8,
    reviewCount: 31,
    isFeatured: false,
    isFlashSale: false,
    variants: {
      colors: ['Smoke Gray', 'Chalk White'],
      sizes: ['Tenkeyless 80%', 'Compact 65%']
    },
    tags: ['Mechanical', 'Hot-Swap', 'Bluetooth & 2.4Ghz', 'RGB Backlight'],
    description: 'Compact 75% mechanical keyboard with custom pre-lubed tactile switches, PBT double-shot keycaps, and Mac/Windows dual compatibility.',
    descriptionBn: 'প্রিমিয়াম টেকটাইল মেকানিক্যাল সুইচ এবং চমৎকার টাইপিং অনুভূতি সম্পন্ন ওয়্যারলেস কিবোর্ড।',
    reviews: []
  }
];

export const INITIAL_COUPONS = [
  { code: 'BONGO10', discountPercent: 10, minPurchase: 2000, description: '10% off on orders above ৳2,000' },
  { code: 'EID20', discountPercent: 20, minPurchase: 10000, description: '20% Eid festive discount on orders above ৳10,000' },
  { code: 'WELCOME500', discountAmount: 500, minPurchase: 3000, description: '৳500 flat discount on orders above ৳3,000' }
];

export const INITIAL_SETTINGS = {
  storeName: 'BongoMart',
  storeTagline: 'Bangladesh’s Premier Lifestyle & Tech Store',
  contactPhone: '+880 1711-002233',
  supportEmail: 'support@bongomart.com.bd',
  insideDhakaDeliveryFee: 60,
  outsideDhakaDeliveryFee: 120,
  freeDeliveryThreshold: 5000,
  announcementTextEn: '✨ Free express delivery across Bangladesh on orders over ৳5,000 | Safe bKash & COD',
  announcementTextBn: '✨ ৫,০০০ টাকার অধিক অর্ডারে সারাদেশে ফ্রি ডেলিভারি | বিকাশ ও ক্যাশ অন ডেলিভারি প্রযোজ্য',
  address: 'Level 4, Navana Tower, Gulshan-2, Dhaka-1212, Bangladesh',
  vatPercent: 0
};

export const INITIAL_ORDERS = [
  {
    id: 'ORD-BD-9821',
    customer: {
      name: 'Tanvir Hossain',
      phone: '01712345678',
      email: 'tanvir@gmail.com',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Gulshan',
      address: 'House 42, Road 11, Block D, Banani'
    },
    items: [
      {
        productId: 'prod-002',
        name: 'Eclipse Pro Active Noise Cancelling Headphones',
        variant: 'Matte Black',
        price: 11990,
        quantity: 1,
        image: '/src/assets/images/product_wireless_headphones_1793971975067.jpg'
      }
    ],
    subtotal: 11990,
    shippingFee: 0,
    discount: 1000,
    couponCode: 'WELCOME500',
    total: 10990,
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    transactionId: 'BKASH_TXN_99812A',
    orderStatus: 'Shipped',
    timeline: [
      { status: 'Order Placed', time: '2026-11-04 14:20' },
      { status: 'Payment Verified', time: '2026-11-04 14:22' },
      { status: 'Packed & Dispatched', time: '2026-11-05 10:15' },
      { status: 'In Transit via Paperfly', time: '2026-11-06 08:30' }
    ],
    createdAt: '2026-11-04T14:20:00.000Z'
  },
  {
    id: 'ORD-BD-9822',
    customer: {
      name: 'Sabrina Mostafa',
      phone: '01819876543',
      email: 'sabrina.m@yahoo.com',
      division: 'Chattogram',
      district: 'Chattogram',
      upazila: 'Panchlaish',
      address: 'Flat 4B, Hill View Residential Area'
    },
    items: [
      {
        productId: 'prod-004',
        name: 'Sreemangal Single-Estate Whole Leaf Artisan Tea',
        variant: '250g Tin',
        price: 950,
        quantity: 2,
        image: '/src/assets/images/product_tea_artisan_1793971977116.jpg'
      }
    ],
    subtotal: 1900,
    shippingFee: 120,
    discount: 0,
    couponCode: '',
    total: 2020,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    transactionId: 'COD_VERIFIED',
    orderStatus: 'Processing',
    timeline: [
      { status: 'Order Placed', time: '2026-11-05 18:40' },
      { status: 'Phone Confirmed by Agent', time: '2026-11-05 19:00' }
    ],
    createdAt: '2026-11-05T18:40:00.000Z'
  }
];
