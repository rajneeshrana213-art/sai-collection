export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number; // in paise
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  subCategorySlug?: string;
  basePrice: number; // in paise
  originalPrice?: number; // in paise
  badge?: "NEW" | "BEST SELLER" | "SALE" | "TRENDING";
  rating: number;
  reviewsCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  fabric?: string;
  craft?: string;
  isAvailableForCOD: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  imageUrl: string;
  badge?: string;
  parentId?: string; // null for parent category, category ID for subcategory
  parentName?: string;
  subCategories?: Category[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  date: string;
  productBought: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  title: string;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: string;
  comments: string;
  caption: string;
  link: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantSize: string;
  variantColor: string;
  quantity: number;
  price: number; // in paise
}

export interface Order {
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "RAZORPAY" | "COD";
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number; // in paise
  joinedDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENT" | "FLAT";
  value: number; // percent or paise
  minOrderValue?: number; // paise
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    description: "Royal Anarkalis, Chanderi suits, Sarees & Phulkari dupattas",
    itemCount: 65,
    imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
    badge: "Signature",
    subCategories: [
      {
        id: "sub-1a",
        name: "Anarkali Suit Sets",
        slug: "anarkali-suit-sets",
        description: "Heavy flared velvet & organza Anarkali sets",
        itemCount: 28,
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        parentId: "cat-1",
        parentName: "Ethnic Wear"
      },
      {
        id: "sub-1b",
        name: "Chanderi Straight Suits",
        slug: "chanderi-straight-suits",
        description: "Breathable silk straight kurtas with pants",
        itemCount: 22,
        imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
        parentId: "cat-1",
        parentName: "Ethnic Wear"
      },
      {
        id: "sub-1c",
        name: "Tissue Silk Sarees",
        slug: "tissue-silk-sarees",
        description: "Golden tissue woven sarees with zari borders",
        itemCount: 15,
        imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
        parentId: "cat-1",
        parentName: "Ethnic Wear"
      }
    ]
  },
  {
    id: "cat-2",
    name: "Trending Cordsets",
    slug: "trending-cordsets",
    description: "Chic matching 2-piece cordsets in silk, linen & velvet",
    itemCount: 34,
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    badge: "Viral Hit",
    subCategories: [
      {
        id: "sub-2a",
        name: "Silk Printed Cordsets",
        slug: "silk-printed-cordsets",
        description: "Digital block printed 2-piece sets",
        itemCount: 20,
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
        parentId: "cat-2",
        parentName: "Trending Cordsets"
      },
      {
        id: "sub-2b",
        name: "Velvet Winter Cordsets",
        slug: "velvet-winter-cordsets",
        description: "Warm plush velvet cordsets with embroidery",
        itemCount: 14,
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        parentId: "cat-2",
        parentName: "Trending Cordsets"
      }
    ]
  },
  {
    id: "cat-3",
    name: "Dresses 👗",
    slug: "dresses",
    description: "Flowy maxi dresses, floral prints & midi outfits",
    itemCount: 39,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
    badge: "Must Have",
    subCategories: [
      {
        id: "sub-3a",
        name: "Floral Maxi Dresses",
        slug: "floral-maxi-dresses",
        description: "Tiered chiffon maxi dresses",
        itemCount: 25,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
        parentId: "cat-3",
        parentName: "Dresses 👗"
      }
    ]
  },
  {
    id: "cat-4",
    name: "New Arrival",
    slug: "new-arrivals",
    description: "Fresh drop releases direct from Panipat workshops",
    itemCount: 48,
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    badge: "Fresh Drop"
  },
  {
    id: "cat-5",
    name: "Small / Medium / Large Section",
    slug: "sml-sizes",
    description: "Tailored fitting fits across S, M, and L sizes",
    itemCount: 52,
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cat-6",
    name: "Plus-Size",
    slug: "plus-size",
    description: "Inclusive size fits (3XL to 5XL) designed for comfort & poise",
    itemCount: 29,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
    badge: "Inclusive Fits"
  },
  {
    id: "cat-7",
    name: "Partywear",
    slug: "partywear",
    description: "Sequined, zari-embroidered & metallic festive eveningwear",
    itemCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800",
    badge: "Glam"
  },
  {
    id: "cat-8",
    name: "Denim Wear",
    slug: "denim-wear",
    description: "Embroidered denim jackets, jeans & shirt dresses",
    itemCount: 22,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cat-9",
    name: "Bottom Wear",
    slug: "bottom-wear",
    description: "Palazzos, straight pants, shararas & churidars",
    itemCount: 31,
    imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cat-10",
    name: "Night Suits",
    slug: "night-suits",
    description: "Ultra-soft satin & cotton loungewear night sets",
    itemCount: 26,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cat-11",
    name: "T-Shirts / Top / Tunics",
    slug: "tops-tunics",
    description: "Casual cotton tees, embroidered tunics & everyday tops",
    itemCount: 40,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cat-12",
    name: "Sale Articles",
    slug: "sale-articles",
    description: "Exclusive clearance discounts up to 50% OFF",
    itemCount: 50,
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800",
    badge: "50% OFF"
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Panipat Velvet Anarkali Suit Set",
    slug: "panipat-royal-velvet-anarkali-suit-set",
    description: "Exquisite dark maroon velvet Anarkali suit with intricate zari and gota patti embroidery. Paired with a heavy organza dupatta.",
    category: "Ethnic Wear",
    categorySlug: "ethnic-wear",
    subCategory: "Anarkali Suit Sets",
    subCategorySlug: "anarkali-suit-sets",
    basePrice: 349900,
    originalPrice: 499900,
    badge: "BEST SELLER",
    rating: 4.9,
    reviewsCount: 128,
    fabric: "Micro Velvet & Organza",
    craft: "Panipat Hand Zari",
    isAvailableForCOD: true,
    images: [
      {
        id: "img-1a",
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        altText: "Panipat Royal Velvet Anarkali Suit"
      }
    ],
    variants: [
      { id: "v1-s", size: "S", color: "Maroon", sku: "SAI-ANR-MRN-S", price: 349900, stock: 12 },
      { id: "v1-m", size: "M", color: "Maroon", sku: "SAI-ANR-MRN-M", price: 349900, stock: 18 },
      { id: "v1-l", size: "L", color: "Maroon", sku: "SAI-ANR-MRN-L", price: 349900, stock: 9 }
    ]
  },
  {
    id: "prod-2",
    name: "Luxury Silk Printed 2-Piece Cordset",
    slug: "luxury-silk-printed-2-piece-cordset",
    description: "Trending printed silk 2-piece cordset with shirt collared tunic and flared trousers. Chic, comfortable and ideal for day events.",
    category: "Trending Cordsets",
    categorySlug: "trending-cordsets",
    subCategory: "Silk Printed Cordsets",
    subCategorySlug: "silk-printed-cordsets",
    basePrice: 199900,
    originalPrice: 279900,
    badge: "TRENDING",
    rating: 4.9,
    reviewsCount: 86,
    fabric: "Pure Silk Blend",
    craft: "Digital Block Print",
    isAvailableForCOD: true,
    images: [
      {
        id: "img-2a",
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
        altText: "Trending Silk Cordset"
      }
    ],
    variants: [
      { id: "v2-s", size: "S", color: "Sage Green", sku: "SAI-CRD-GRN-S", price: 199900, stock: 15 },
      { id: "v2-m", size: "M", color: "Sage Green", sku: "SAI-CRD-GRN-M", price: 199900, stock: 22 },
      { id: "v2-l", size: "L", color: "Sage Green", sku: "SAI-CRD-GRN-L", price: 199900, stock: 14 }
    ]
  },
  {
    id: "prod-3",
    name: "Floral Chiffon Tiered Maxi Dress 👗",
    slug: "floral-chiffon-tiered-maxi-dress",
    description: "Flowy pastel floral print tiered maxi dress with balloon sleeves and waist sash. High comfort summer fashion.",
    category: "Dresses 👗",
    categorySlug: "dresses",
    subCategory: "Floral Maxi Dresses",
    subCategorySlug: "floral-maxi-dresses",
    basePrice: 169900,
    originalPrice: 249900,
    badge: "NEW",
    rating: 4.8,
    reviewsCount: 42,
    fabric: "Georgette Chiffon",
    craft: "Floral Digital Print",
    isAvailableForCOD: true,
    images: [
      {
        id: "img-3a",
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800",
        altText: "Floral Maxi Dress"
      }
    ],
    variants: [
      { id: "v3-s", size: "S", color: "Lilac Floral", sku: "SAI-DRS-LLC-S", price: 169900, stock: 10 },
      { id: "v3-m", size: "M", color: "Lilac Floral", sku: "SAI-DRS-LLC-M", price: 169900, stock: 15 }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    orderNumber: "SAI-ORD-2026-8841",
    date: "August 10, 2026",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        productName: "Panipat Velvet Anarkali Suit Set",
        productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        variantSize: "M",
        variantColor: "Maroon",
        quantity: 1,
        price: 349900
      }
    ],
    subtotal: 349900,
    discount: 34990,
    shippingFee: 0,
    total: 314910,
    status: "SHIPPED",
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    shippingAddress: {
      fullName: "Pooja Sharma",
      phone: "+91 98765 43210",
      line1: "House No. 42, Sector 14",
      line2: "Near Model Town Market",
      city: "Panipat",
      state: "Haryana",
      pincode: "132103"
    },
    trackingNumber: "DELHIVERY8841920",
    courierName: "Delhivery Express",
    estimatedDelivery: "August 14, 2026"
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Pooja Sharma",
    email: "pooja.sharma@example.com",
    phone: "+91 98765 43210",
    city: "Panipat",
    totalOrders: 4,
    totalSpent: 1144610,
    joinedDate: "Jan 12, 2026"
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "SAI10",
    type: "PERCENT",
    value: 10,
    minOrderValue: 99900,
    usedCount: 142,
    isActive: true,
    expiresAt: "2026-12-31"
  }
];

export const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    fullName: "Pooja Sharma",
    phone: "+91 98765 43210",
    line1: "House No. 42, Sector 14",
    line2: "Near Model Town Market",
    city: "Panipat",
    state: "Haryana",
    pincode: "132103",
    isDefault: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Pooja Sharma",
    location: "Chandigarh",
    rating: 5,
    comment: "Ordered the Royal Velvet Anarkali for a family wedding. The fitting was custom-tier perfect, and the fabric was far superior to what I expected at this price point! Received so many compliments.",
    verifiedBuyer: true,
    date: "August 2026",
    productBought: "Panipat Royal Velvet Anarkali Suit Set"
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    likes: "1,420",
    comments: "84",
    caption: "Spotted in Panipat! Our bestseller Velvet Anarkali on our customer @priya_m ✨ Tap link in bio to shop now.",
    link: "https://instagram.com/saicollectionpnp"
  }
];

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    productName: "Panipat Royal Velvet Anarkali Suit Set",
    productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    customerName: "Pooja Sharma",
    customerPhone: "+91 98765 43210",
    rating: 5,
    title: "Breathtaking Velvet & Craftsmanship!",
    comment: "Ordered this for my sister's sangeet in Panipat. The embroidery and flare of the Anarkali surpassed expectations! Fast delivery too.",
    status: "APPROVED",
    verifiedPurchase: true,
    createdAt: "Aug 10, 2026"
  },
  {
    id: "rev-2",
    productId: "prod-2",
    productName: "Handcrafted Chanderi Silk Suit Set",
    productImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    customerName: "Sunita Verma",
    customerPhone: "+91 98123 45678",
    rating: 4,
    title: "Elegant Color & Lightweight Fabric",
    comment: "The silk touch is genuine and lightweight for summer weddings. Dupatta threadwork is extremely neat.",
    status: "PENDING",
    verifiedPurchase: true,
    createdAt: "Aug 11, 2026"
  },
  {
    id: "rev-3",
    productId: "prod-3",
    productName: "Panipat Heavy Phulkari Embroidered Dupatta",
    productImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    customerName: "Neha Kapoor",
    customerPhone: "+91 99887 76655",
    rating: 5,
    title: "Authentic Panipat Handloom Dupatta!",
    comment: "Heavy traditional embroidery. Perfectly pairs with plain white or cream kurtas. Worth every rupee!",
    status: "APPROVED",
    verifiedPurchase: true,
    createdAt: "Aug 09, 2026"
  },
  {
    id: "rev-4",
    productId: "prod-4",
    productName: "Festive Embroidered Straight Suit",
    productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    customerName: "Ritu Saini",
    customerPhone: "+91 97290 12345",
    rating: 2,
    title: "Sizing ran slightly small",
    comment: "The fabric quality is good but size M was a bit tight around shoulders. Requesting an exchange to L.",
    status: "PENDING",
    verifiedPurchase: false,
    createdAt: "Aug 12, 2026"
  }
];
