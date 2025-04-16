import { User } from "./authTypes";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discount: number;
  slug: string;
  images: string[];
  stock: number;
  salesCount: number;
  bestSeller: boolean;
  featured: boolean;
  reviewCount: number;
  averageRating: number;
  category?: Category | null;
  categoryId?: string | null;
}

export interface Order {
  order_no: string;
  amount: number;
  order_date: Date;
  user: User;
  userId: string;
  products: Product[];
  tracking?: TrackingDetail | null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  order: Order;
  product: Product;
}

export interface Payment {
  id: string;
  method: string;
  amount: number;
  user: User;
  userId: string;
}

export interface Address {
  id: string;
  city: string;
  state: string;
  country: string;
  user: User;
  userId: string;
}

export interface TrackingDetail {
  id: string;
  status: string;
  order: Order;
  order_no: string;
}

export interface Cart {
  cart_id: string;
  user: User;
  userId: string;
  products: Product[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  products: Product[];
}
