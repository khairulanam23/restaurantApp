export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "rider" | "restaurant" | "admin"
  phone?: string
  avatar?: string
  createdAt: Date
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  cuisine: string[]
  rating: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  isOpen: boolean
  address: string
  phone: string
  ownerId: string
  createdAt: Date
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  ingredients?: string[]
  allergens?: string[]
}

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  customerId: string
  restaurantId: string
  riderId?: string
  items: CartItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled"
  totalAmount: number
  deliveryFee: number
  deliveryAddress: string
  customerPhone: string
  specialInstructions?: string
  estimatedDeliveryTime?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "paypal" | "cash"
  cardNumber?: string
  expiryDate?: string
  cardholderName?: string
  isDefault: boolean
}
