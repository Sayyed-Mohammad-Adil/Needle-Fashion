// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: any;
  savedMeasurements?: any[];
  wishlist?: any[];
  createdAt?: string;
  updatedAt?: string;
}

// Product types
export interface ProductImage {
  data: string; // Base64 encoded image or URL
  alt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  category: Category;
  filters: Record<string, string[]>; // Filter type to values mapping
  sizes: number[];
  isMakeToOrder: boolean;
  makeToOrder?: boolean;
  isOutOfStock: boolean;
  fittingOptions: string[];
  stock: number;
  countInStock?: number;
  averageRating: number;
  numReviews: number;
  fabric?: string;
  color?: string;
  work?: string;
  pattern?: string;
  store?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Filter types
export interface FilterValue {
  _id: string;
  value: string;
}

export interface Filter {
  _id: string;
  name: string; // e.g., "Color", "Size", "Fabric"
  values: FilterValue[];
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface MeasurementDetails {
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  armLength: number;
  inseam: number;
  neck: number;
  photo?: string; // Base64 encoded image
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  size: number | 'customize';
  fitting: 'Loose' | 'Medium' | 'Fit';
  measurements?: MeasurementDetails;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
    emailAddress: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Expense types
export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics types
export interface SearchAnalytics {
  _id: string;
  term: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface ViewAnalytics {
  _id: string;
  productId: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesAnalytics {
  _id: string;
  productId: string;
  count: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

// FAQ types
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
  message?: string;
}