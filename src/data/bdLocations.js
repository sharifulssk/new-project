/**
 * Bangladesh administrative divisions, districts, and phone validation helpers.
 */

export const BD_DIVISIONS = [
  {
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      'Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 
      'Manikganj', 'Munshiganj', 'Narsingdi', 'Gopalganj', 'Madaripur', 
      'Rajbari', 'Shariatpur', 'Kishoreganj'
    ]
  },
  {
    name: 'Chattogram',
    nameBn: 'চট্টগ্রাম',
    districts: [
      'Chattogram', "Cox's Bazar", 'Cumilla', 'Feni', 'Brahmanbaria', 
      'Noakhali', 'Chandpur', 'Lakshmipur', 'Khagrachhari', 'Rangamati', 'Bandarban'
    ]
  },
  {
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      'Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapai Nawabganj', 'Joypurhat'
    ]
  },
  {
    name: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      'Khulna', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah', 'Chuadanga', 'Magura', 'Meherpur', 'Narail'
    ]
  },
  {
    name: 'Barishal',
    nameBn: 'বরিশাল',
    districts: [
      'Barishal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Barguna', 'Jhalokati'
    ]
  },
  {
    name: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'
    ]
  },
  {
    name: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      'Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari', 'Lalmonirhat', 'Thakurgaon', 'Panchagarh'
    ]
  },
  {
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      'Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'
    ]
  }
];

/**
 * Validates Bangladeshi mobile phone numbers:
 * Starts with 01, followed by 3-9, and exactly 8 more digits (total 11 digits)
 * E.g., 01712345678, 01812345678, 01912345678, 016..., 013..., 014...
 */
export function validateBdPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-+]/g, '');
  // Allows with or without 88 country code
  const regex = /^(?:\+?8801|01)[3-9]\d{8}$/;
  return regex.test(clean);
}

/**
 * Formats BDT currency cleanly
 */
export function formatBDT(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '৳ 0';
  return `৳ ${Math.round(amount).toLocaleString('en-IN')}`;
}
