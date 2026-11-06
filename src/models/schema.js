/**
 * Mongoose-style Schemas and Data Models for BongoMart
 * Represents MongoDB collections with validation and relational references.
 */

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * User Schema:
 * Roles: 'customer' | 'admin'
 */
export function validateUser(user) {
  if (!user.name || typeof user.name !== 'string') {
    throw new ValidationError('User name is required', 'name');
  }
  if (!user.email || !user.email.includes('@')) {
    throw new ValidationError('Valid email is required', 'email');
  }
  if (!user.role || !['customer', 'admin'].includes(user.role)) {
    user.role = 'customer';
  }
  return {
    id: user.id || `usr-${Date.now()}`,
    name: user.name.trim(),
    email: user.email.toLowerCase().trim(),
    role: user.role,
    phone: user.phone || '',
    savedAddresses: user.savedAddresses || [],
    createdAt: user.createdAt || new Date().toISOString()
  };
}

/**
 * Product Schema:
 * References Category and Brand
 */
export function validateProduct(product) {
  if (!product.name || product.name.trim().length < 2) {
    throw new ValidationError('Product title is required (min 2 chars)', 'name');
  }
  if (product.regularPrice === undefined || product.regularPrice < 0) {
    throw new ValidationError('Regular price must be non-negative', 'regularPrice');
  }
  const discountPrice = Number(product.discountPrice) || Number(product.regularPrice);
  if (discountPrice > Number(product.regularPrice)) {
    throw new ValidationError('Discount price cannot exceed regular price', 'discountPrice');
  }

  return {
    id: product.id || `prod-${Date.now()}`,
    name: product.name.trim(),
    nameBn: product.nameBn || product.name.trim(),
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    sku: product.sku || `BNG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    category: product.category || 'all',
    brand: product.brand || 'BongoCraft',
    regularPrice: Number(product.regularPrice),
    discountPrice: discountPrice,
    images: Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : ['/src/assets/images/hero_lifestyle_showcase_1793971974518.jpg'],
    stock: product.stock !== undefined ? Math.max(0, parseInt(product.stock, 10)) : 10,
    rating: product.rating !== undefined ? Number(product.rating) : 5.0,
    reviewCount: product.reviewCount !== undefined ? Number(product.reviewCount) : 0,
    isFeatured: Boolean(product.isFeatured),
    isFlashSale: Boolean(product.isFlashSale),
    variants: {
      colors: Array.isArray(product.variants?.colors) ? product.variants.colors : [],
      sizes: Array.isArray(product.variants?.sizes) ? product.variants.sizes : []
    },
    tags: Array.isArray(product.tags) ? product.tags : [],
    description: product.description || '',
    descriptionBn: product.descriptionBn || product.description || '',
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    createdAt: product.createdAt || new Date().toISOString()
  };
}

/**
 * Order Schema:
 * Validates shipping, Bangladesh location, phone number, and items.
 */
export function validateOrder(order, settings = { insideDhakaDeliveryFee: 60, outsideDhakaDeliveryFee: 120, freeDeliveryThreshold: 5000 }) {
  if (!order.customer || !order.customer.name) {
    throw new ValidationError('Customer name is required', 'customer.name');
  }
  if (!order.customer.phone || order.customer.phone.trim().length < 11) {
    throw new ValidationError('Valid Bangladeshi phone number is required', 'customer.phone');
  }
  if (!order.customer.division || !order.customer.district) {
    throw new ValidationError('Division and District are required', 'customer.district');
  }
  if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new ValidationError('Cart cannot be empty', 'items');
  }

  // Recalculate subtotal
  const subtotal = order.items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  
  // Calculate Bangladesh shipping based on division/district
  const isDhaka = (order.customer.district || '').toLowerCase() === 'dhaka' || (order.customer.division || '').toLowerCase() === 'dhaka';
  let shippingFee = isDhaka ? settings.insideDhakaDeliveryFee : settings.outsideDhakaDeliveryFee;
  if (subtotal >= settings.freeDeliveryThreshold) {
    shippingFee = 0;
  }

  const discount = Math.max(0, Number(order.discount) || 0);
  const total = Math.max(0, subtotal + shippingFee - discount);

  return {
    id: order.id || `ORD-BD-${Date.now().toString().slice(-6)}`,
    customer: {
      name: order.customer.name.trim(),
      phone: order.customer.phone.trim(),
      email: (order.customer.email || '').trim(),
      division: order.customer.division,
      district: order.customer.district,
      upazila: order.customer.upazila || '',
      address: order.customer.address || '',
      notes: order.customer.notes || ''
    },
    items: order.items.map(item => ({
      productId: item.productId || item.id,
      name: item.name,
      variant: item.variant || '',
      price: Number(item.price),
      quantity: Math.max(1, parseInt(item.quantity, 10)),
      image: item.image || ''
    })),
    subtotal,
    shippingFee,
    discount,
    couponCode: order.couponCode || '',
    total,
    paymentMethod: order.paymentMethod || 'Cash on Delivery',
    paymentStatus: order.paymentStatus || (order.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'),
    transactionId: order.transactionId || (order.paymentMethod === 'Cash on Delivery' ? 'COD_PENDING' : `TXN_${Date.now()}`),
    orderStatus: order.orderStatus || 'Pending',
    timeline: [
      { status: 'Order Placed', time: new Date().toLocaleString('en-GB') }
    ],
    createdAt: new Date().toISOString()
  };
}
