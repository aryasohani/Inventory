export type Role = "admin" | "staff";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

export type BackendProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorder_threshold: number;
  expiry_date?: string;
  supplier_id?: string;
  stock_status: "ok" | "low" | "critical";
  description?: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderLevel: number;
  expiryDate: string;
  supplierId: string;
  status: "ok" | "low" | "critical";
  velocity: number; // units / day
  image?: string;
  description?: string;
};

export type BackendSupplier = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  categories_list?: string[];
  categories?: string;
  lead_time_days: number;
  is_active: boolean;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  categories: string[];
  leadTimeDays: number;
  rating: number;
  totalOrders: number;
  status: "active" | "paused";
};

export type POStatus = "draft" | "sent" | "acknowledged" | "received";

export type BackendPOItem = {
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type POItem = {
  productId: string;
  productName: string;
  sku?: string;
  qty: number;
  unitPrice: number;
};

export type BackendPurchaseOrder = {
  id: string;
  supplier_id: string;
  status: POStatus;
  created_at: string;
  sent_at?: string;
  total_amount: number;
  items?: BackendPOItem[];
};

export type PurchaseOrder = {
  id: string;
  supplierId: string;
  supplierName: string;
  status: POStatus;
  createdAt: string;
  expectedAt: string;
  total: number;
  itemCount: number;
  items: POItem[];
};

export type BackendAutomationLog = {
  id: string;
  job_name: string;
  started_at: string;
  status: string;
  message?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  toolCall?: { name: string; result: string };
};

export type BackendInvoiceLineItem = {
  name: string;
  qty: number;
  unit_price: number;
  total: number;
};

export type ForecastPoint = {
  day: string;
  date: string;
  forecast: number;
  lower: number;
  upper: number;
  confidence: number;
};

export type BackendInventoryLog = {
  created_at: string;
  quantity_after: number;
  change_type: string;
};

export type Invoice = {
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  items: {
    name: string;
    qty: number;
    price: number;
    total: number;
  }[];
  grandTotal: number;
  parseConfidence: string;
};
