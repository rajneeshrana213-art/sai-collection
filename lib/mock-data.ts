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
  parentId?: string;
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

export const CATEGORIES: Category[] = [];
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_ORDERS: Order[] = [];
export const MOCK_CUSTOMERS: Customer[] = [];
export const MOCK_COUPONS: Coupon[] = [];
export const MOCK_ADDRESSES: SavedAddress[] = [];
export const MOCK_REVIEWS: ProductReview[] = [];

export const TESTIMONIALS: Testimonial[] = [];
export const INSTAGRAM_POSTS: InstagramPost[] = [];
