// import { Product } from './types';
export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageAsset {
  asset_ref: string;
  url?: string;
  _key?: string;
}

export interface Product extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  price: number;
  quantity?: number;
  discount: number;
  stock: number;
  status: "new" | "hot" | "sale" | "regular";
  variant?: string;
  brand: string | Brand; // Can be ID or Populated
  categories: string[];
  images: ImageAsset[];
}

export interface Category extends BaseDocument {
  title: string;
  slug: string;
  description?: string;
  featured: boolean;
  image?: string;
  productCount: number;
}

export interface Brand extends BaseDocument {
  title: string;
  slug: string;
  description?: string;
  image?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order extends BaseDocument {
  orderNumber: string;
  customerName: string;
  email: string;
  clerkUserId?: string;
  stripeCheckoutSessionId?: string;
  totalPrice: number;
  currency: string;
  status: OrderStatus;
  address: {
    city: string;
    state: string;
    zip: string;
    address: string;
  };
  products: Array<{
    product: string | Product;
    quantity: number;
  }>;
}

export interface OrderSummary {
  _id: string;
  email: string;
  orderNumber: string;
  customerName: string;
  amountDiscount: number;
  totalPrice: number;
  status: string;
  products: Array<Product>;
  invoice: {
    number: number;
    hosted_invoice_url: string;
  };
  createdAt: string;
  orderDate: string;
}

export interface BlogCategory extends BaseDocument {
  title: string;
  slug: string;
  description?: string;
}

export interface Blog extends BaseDocument {
  title: string;
  slug: string;
  author: string;
  blogcategories: Array<string | BlogCategory>;
  mainImage?: string;
  body: any[]; // Array of Portable Text blocks or HTML
  isLatest: boolean;
  publishedAt: string;
}
