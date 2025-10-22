import type { Order, MenuItem, MenuCategory, ApiResponse, AuthResponse, PaymentResponse } from "./types"
import { restaurantStore } from "./store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2403/api"

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private getAuthHeaders(): Record<string, string> {
    const token = restaurantStore.getToken() || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmMTk4NWQ1LTBjNzctNDI5NC1iZWJiLWFiMWFlNDcxNGYxZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTE3NDUxOCwiZXhwIjoxNzYxMTc1NDE4fQ.7q8v2xRjNB68RjC9l8yPP1id9g12T-mh-CmhKC9pdIc"
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 401) {
        restaurantStore.clearSession()
        throw new Error("Session expired. Please enter your table number again.")
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[API Error]", error)
      throw error
    }
  }

  async getCategories(): Promise<MenuCategory[]> {
    try {
      const response = await this.request<ApiResponse<MenuCategory[]> | MenuCategory[]>("/menu/categories")
      return Array.isArray(response) ? response : response.data || []
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      throw new Error("Failed to fetch categories")
    }
  }

  async getMenuItems(filters?: { category?: string; search?: string }): Promise<MenuItem[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append("category", filters.category)
      if (filters?.search) params.append("search", filters.search)

      const queryString = params.toString()
      const endpoint = `/menu/items${queryString ? `?${queryString}` : ""}`

      const response = await this.request<ApiResponse<MenuItem[]> | MenuItem[]>(endpoint)
      return Array.isArray(response) ? response : response.data || []
    } catch (error) {
      console.error("Failed to fetch menu items:", error)
      throw new Error("Failed to fetch menu items")
    }
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    try {
      const response = await this.request<ApiResponse<MenuItem> | MenuItem>(`/menu/items/${id}`)
      const data = Array.isArray(response) ? response[0] : ('data' in response ? response.data : response)
      if (!data) throw new Error("Item not found")
      return data
    } catch (error) {
      console.error("Failed to fetch item details:", error)
      throw new Error("Failed to fetch item details")
    }
  }

  async validateTableNumber(tableNumber: string): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>(`/tables/${tableNumber}`)

      if (response.token && response.expiresAt) {
        restaurantStore.setSession(response.token, response.expiresAt)
      }

      return response
    } catch (error) {
      console.error("Failed to validate table:", error)
      throw new Error("Invalid table number")
    }
  }

  async createOrder(order: Omit<Order, "orderNumber" | "createdAt">): Promise<Order> {
    try {
      const response = await this.request<ApiResponse<Order>>("/orders", {
        method: "POST",
        body: JSON.stringify(order),
      })
      if (!response.data) throw new Error("Order creation failed")
      return response.data
    } catch (error) {
      console.error("Failed to create order:", error)
      throw new Error("Failed to create order")
    }
  }

  async getOrderStatus(orderNumber: string): Promise<Order> {
    try {
      const response = await this.request<ApiResponse<Order>>(`/orders/${orderNumber}`)
      if (!response.data) throw new Error("Order not found")
      return response.data
    } catch (error) {
      console.error("Failed to fetch order status:", error)
      throw new Error("Failed to fetch order status")
    }
  }

  async processPayment(orderId: string, amount: number): Promise<PaymentResponse> {
    try {
      const response = await this.request<PaymentResponse>("/payments/process", {
        method: "POST",
        body: JSON.stringify({ orderId, amount }),
      })

      if (response.success && response.status === "completed") {
        restaurantStore.resetSessionAfterPayment()
      }

      return response
    } catch (error) {
      console.error("Failed to process payment:", error)
      throw new Error("Payment processing failed")
    }
  }
}

export const apiClient = new ApiClient()
