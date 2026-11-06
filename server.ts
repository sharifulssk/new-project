import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_ORDERS } from './src/data/seedData.js';
import { validateProduct, validateOrder, validateUser } from './src/models/schema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// In-memory data store with initial seed data
let db: any = {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
  coupons: [...INITIAL_COUPONS],
  settings: { ...INITIAL_SETTINGS },
  orders: [...INITIAL_ORDERS],
  users: [
    { id: 'usr-admin', name: 'Store Administrator', email: 'admin@bongomart.com', role: 'admin', phone: '01711002233' },
    { id: 'usr-cust', name: 'Tanvir Rahman', email: 'customer@bongomart.com', role: 'customer', phone: '01812345678' }
  ]
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), totalProducts: db.products.length });
  });

  // Get Store Settings
  app.get('/api/settings', (req, res) => {
    res.json({ success: true, settings: db.settings });
  });

  // Update Store Settings (Admin)
  app.put('/api/settings', (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    res.json({ success: true, settings: db.settings, message: 'Settings updated successfully' });
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    res.json({ success: true, categories: db.categories });
  });

  // Products List (supports search, category, brand, sorting, pagination)
  app.get('/api/products', (req, res) => {
    const { category, search, sort, brand, flashSale, minPrice, maxPrice } = req.query;
    let list = [...db.products];

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    if (brand && brand !== 'all') {
      list = list.filter(p => p.brand === brand);
    }
    if (flashSale === 'true') {
      list = list.filter(p => p.isFlashSale);
    }
    if (minPrice) {
      list = list.filter(p => p.discountPrice >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter(p => p.discountPrice <= Number(maxPrice));
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.nameBn && p.nameBn.includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sort === 'price-low') {
      list.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      list.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    res.json({ success: true, count: list.length, products: list });
  });

  // Get Single Product by ID or Slug
  app.get('/api/products/:identifier', (req, res) => {
    const { identifier } = req.params;
    const product = db.products.find(p => p.id === identifier || p.slug === identifier);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  });

  // Create Product (Admin)
  app.post('/api/products', (req, res) => {
    try {
      const validated = validateProduct(req.body);
      db.products.unshift(validated);
      res.status(201).json({ success: true, product: validated, message: 'Product created successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Update Product (Admin)
  app.put('/api/products/:id', (req, res) => {
    try {
      const idx = db.products.findIndex(p => p.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const updated = validateProduct({ ...db.products[idx], ...req.body, id: req.params.id });
      db.products[idx] = updated;
      res.json({ success: true, product: updated, message: 'Product updated successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Delete Product (Admin)
  app.delete('/api/products/:id', (req, res) => {
    const idx = db.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    db.products.splice(idx, 1);
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  // Add Product Review
  app.post('/api/products/:id/reviews', (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const { user, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }
    const newReview = {
      id: `rev-${Date.now()}`,
      user: user || 'Verified Customer',
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    product.reviews.unshift(newReview);
    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));
    product.reviewCount = product.reviews.length;

    res.json({ success: true, product, message: 'Review submitted successfully' });
  });

  // Coupons Verify
  app.post('/api/coupons/verify', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }
    if (subtotal < coupon.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `This coupon requires a minimum purchase of ৳${coupon.minPurchase.toLocaleString()}` 
      });
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    res.json({ success: true, coupon, discount });
  });

  // List Coupons (Admin)
  app.get('/api/coupons', (req, res) => {
    res.json({ success: true, coupons: db.coupons });
  });

  // Create Coupon (Admin)
  app.post('/api/coupons', (req, res) => {
    const { code, discountPercent, discountAmount, minPurchase, description } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }
    const newCoupon = {
      code: code.trim().toUpperCase(),
      discountPercent: discountPercent ? Number(discountPercent) : 0,
      discountAmount: discountAmount ? Number(discountAmount) : 0,
      minPurchase: Number(minPurchase) || 0,
      description: description || 'Promotional coupon'
    };
    db.coupons.push(newCoupon);
    res.json({ success: true, coupon: newCoupon, message: 'Coupon created successfully' });
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    const { phone, email } = req.query;
    let list = [...db.orders];
    if (phone) {
      list = list.filter(o => o.customer.phone === phone);
    } else if (email) {
      list = list.filter(o => o.customer.email === email);
    }
    res.json({ success: true, count: list.length, orders: list });
  });

  // Place Order (with server-side price & inventory checks)
  app.post('/api/orders', (req, res) => {
    try {
      const order = validateOrder(req.body, db.settings);
      
      // Update inventory stock
      for (const item of order.items) {
        const prod = db.products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }

      db.orders.unshift(order);
      res.status(201).json({ success: true, order, message: 'Order placed successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  // Update Order Status (Admin)
  app.patch('/api/orders/:id/status', (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const { orderStatus, paymentStatus } = req.body;
    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.timeline.push({
        status: `Status changed to ${orderStatus}`,
        time: new Date().toLocaleString('en-GB')
      });
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    res.json({ success: true, order, message: 'Order updated successfully' });
  });

  // --- BANGLADESH PAYMENT VERIFICATION APIS ---

  // bKash Merchant API Verification Sandbox
  app.post('/api/payments/bkash/verify', (req, res) => {
    const { phone, amount, pin, trxId } = req.body;
    if (!phone || phone.length < 11) {
      return res.status(400).json({ success: false, message: 'Invalid bKash mobile number' });
    }
    if (!pin || pin.length < 4) {
      return res.status(400).json({ success: false, message: 'Invalid 4-5 digit bKash PIN' });
    }

    // Simulated authentic bKash gateway verification
    const verifiedTrxId = trxId || `BKS_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    res.json({
      success: true,
      statusCode: '0000',
      statusMessage: 'Successful',
      paymentId: `BKASH_PAY_${Date.now()}`,
      trxID: verifiedTrxId,
      amount: amount,
      currency: 'BDT',
      customerMsisdn: phone,
      merchantInvoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      paymentExecuteTime: new Date().toISOString()
    });
  });

  // Nagad API Verification Sandbox
  app.post('/api/payments/nagad/verify', (req, res) => {
    const { phone, amount, otp, pin } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Invalid Nagad account number' });
    }
    const nagadTrx = `NGD_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    res.json({
      success: true,
      status: 'Success',
      orderId: `NGD_ORD_${Date.now()}`,
      issuerPaymentRefNo: nagadTrx,
      amount: amount,
      message: 'Nagad payment verification passed'
    });
  });

  // SSLCommerz Verification Sandbox
  app.post('/api/payments/sslcommerz/verify', (req, res) => {
    const { cardType, amount, tran_id } = req.body;
    const verifiedTranId = tran_id || `SSLC_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    res.json({
      success: true,
      status: 'VALID',
      tran_id: verifiedTranId,
      val_id: `VAL_${Date.now()}`,
      amount: amount,
      card_type: cardType || 'VISA-BRAC',
      currency: 'BDT',
      bank_tran_id: `BANK_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      card_issuer: 'Dutch-Bangla Bank / City Bank / BRAC Bank'
    });
  });

  // Auth: Mock Login / Session
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    if (role === 'admin' || email?.includes('admin')) {
      const admin = db.users.find(u => u.role === 'admin') || {
        id: 'usr-admin',
        name: 'BongoMart Administrator',
        email: 'admin@bongomart.com',
        role: 'admin',
        phone: '01711002233'
      };
      return res.json({ success: true, user: admin, token: 'session_token_admin_992' });
    }

    const customer = {
      id: 'usr-cust-1',
      name: req.body.name || 'Shariful Islam',
      email: email || 'sharifulssk@gmail.com',
      role: 'customer',
      phone: req.body.phone || '01712345678',
      savedAddresses: [
        {
          id: 'addr-1',
          title: 'Home (Gulshan)',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Gulshan',
          address: 'Apartment 5A, Road 28, Gulshan-1'
        }
      ]
    };
    res.json({ success: true, user: customer, token: 'session_token_customer_101' });
  });

  // Mount Vite in development mode for SPA hot reloading & direct serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[BongoMart Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
