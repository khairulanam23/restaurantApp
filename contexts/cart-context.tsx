"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, MenuItem } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface CartState {
  items: CartItem[]
  restaurantId: string | null
  totalAmount: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; quantity?: number; specialInstructions?: string } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const initialState: CartState = {
  items: [],
  restaurantId: null,
  totalAmount: 0,
  itemCount: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, quantity = 1, specialInstructions } = action.payload

      // Check if adding from different restaurant
      if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
        return state // Don't add, will be handled by component
      }

      const existingItemIndex = state.items.findIndex(
        (item) => item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions,
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity,
          specialInstructions,
        }
        newItems = [...state.items, newItem]
      }

      const totalAmount = newItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        restaurantId: menuItem.restaurantId,
        totalAmount,
        itemCount,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const totalAmount = newItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        restaurantId: newItems.length > 0 ? state.restaurantId : null,
        totalAmount,
        itemCount,
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: id })
      }

      const newItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      const totalAmount = newItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return {
        items: newItems,
        restaurantId: state.restaurantId,
        totalAmount,
        itemCount,
      }
    }

    case "CLEAR_CART":
      return initialState

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => boolean
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartData })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state))
  }, [state])

  const addItem = (menuItem: MenuItem, quantity = 1, specialInstructions?: string): boolean => {
    // Check if adding from different restaurant
    if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
      toast({
        title: "Different Restaurant",
        description:
          "You can only order from one restaurant at a time. Clear your cart to order from a different restaurant.",
        variant: "destructive",
      })
      return false
    }

    dispatch({ type: "ADD_ITEM", payload: { menuItem, quantity, specialInstructions } })
    toast({
      title: "Added to Cart",
      description: `${menuItem.name} has been added to your cart.`,
    })
    return true
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
