export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  availability: boolean;
  dietary: string[];
  rating?: number;
  reviews?: number;
  allergens?: string[];
  ingredients?: string[];
}

export interface Customization {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  customizations?: Record<string, string>;
}

export interface Order {
  orderNumber: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  status: "received" | "preparing" | "ready" | "completed";
  estimatedTime: number;
  createdAt: Date;
  specialInstructions?: string;
  // Add these missing properties
  data?: any; // For API responses that wrap the order in a data property
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type TableNumberInput = {
  tableNumber: string;
};

export type CheckoutInput = {
  specialInstructions?: string;
  tableNumber: string;
};

export interface SessionData {
  token: string;
  tableNumber: string;
  expiresAt: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  expiresAt: number;
  message?: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId: string;
  status: "completed" | "failed" | "pending";
  message?: string;
}

// Validation functions
export const validateTableNumber = (
  value: string
): { valid: boolean; error?: string } => {
  if (!value || value.trim() === "") {
    return { valid: false, error: "Table number is required" };
  }
  if (!/^\d+$/.test(value)) {
    return { valid: false, error: "Must be a valid number" };
  }
  return { valid: true };
};

export const validateCheckout = (
  value: CheckoutInput
): { valid: boolean; error?: string } => {
  if (!value.tableNumber || value.tableNumber.trim() === "") {
    return { valid: false, error: "Table number is required" };
  }
  return { valid: true };
};
