"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface OrderUpdate {
  orderId: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled"
  estimatedTime?: string
  riderLocation?: { lat: number; lng: number }
  message?: string
  timestamp: Date
}

interface OrderTrackingContextType {
  activeOrders: Map<string, OrderUpdate>
  subscribeToOrder: (orderId: string) => void
  unsubscribeFromOrder: (orderId: string) => void
  updateOrderStatus: (orderId: string, status: OrderUpdate["status"], message?: string) => void
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined)

export function OrderTrackingProvider({ children }: { children: React.ReactNode }) {
  const [activeOrders, setActiveOrders] = useState<Map<string, OrderUpdate>>(new Map())
  const [subscribedOrders, setSubscribedOrders] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random order updates for subscribed orders
      subscribedOrders.forEach((orderId) => {
        if (Math.random() < 0.1) {
          // 10% chance of update every 5 seconds
          const currentOrder = activeOrders.get(orderId)
          if (currentOrder && currentOrder.status !== "delivered" && currentOrder.status !== "cancelled") {
            const statusProgression = ["pending", "confirmed", "preparing", "ready", "picked_up", "delivered"]
            const currentIndex = statusProgression.indexOf(currentOrder.status)
            if (currentIndex < statusProgression.length - 1) {
              const nextStatus = statusProgression[currentIndex + 1] as OrderUpdate["status"]
              updateOrderStatus(orderId, nextStatus, getStatusMessage(nextStatus))
            }
          }
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [subscribedOrders, activeOrders])

  const getStatusMessage = (status: OrderUpdate["status"]): string => {
    switch (status) {
      case "confirmed":
        return "Your order has been confirmed by the restaurant"
      case "preparing":
        return "The restaurant is preparing your order"
      case "ready":
        return "Your order is ready for pickup"
      case "picked_up":
        return "Your order is on the way"
      case "delivered":
        return "Your order has been delivered"
      default:
        return "Order status updated"
    }
  }

  const subscribeToOrder = useCallback(
    (orderId: string) => {
      setSubscribedOrders((prev) => new Set([...prev, orderId]))

      // Initialize order if not exists
      if (!activeOrders.has(orderId)) {
        setActiveOrders(
          (prev) =>
            new Map([
              ...prev,
              [
                orderId,
                {
                  orderId,
                  status: "pending",
                  timestamp: new Date(),
                },
              ],
            ]),
        )
      }
    },
    [activeOrders],
  )

  const unsubscribeFromOrder = useCallback((orderId: string) => {
    setSubscribedOrders((prev) => {
      const newSet = new Set(prev)
      newSet.delete(orderId)
      return newSet
    })
  }, [])

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderUpdate["status"], message?: string) => {
      setActiveOrders((prev) => {
        const newMap = new Map(prev)
        const currentOrder = newMap.get(orderId)

        newMap.set(orderId, {
          ...currentOrder,
          orderId,
          status,
          message,
          timestamp: new Date(),
          // Simulate rider location for picked_up status
          riderLocation: status === "picked_up" ? { lat: 40.7128, lng: -74.006 } : currentOrder?.riderLocation,
        })

        return newMap
      })

      // Show toast notification for status updates
      if (subscribedOrders.has(orderId)) {
        toast({
          title: "Order Update",
          description: message || getStatusMessage(status),
        })
      }
    },
    [subscribedOrders, toast],
  )

  return (
    <OrderTrackingContext.Provider
      value={{
        activeOrders,
        subscribeToOrder,
        unsubscribeFromOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderTrackingContext.Provider>
  )
}

export function useOrderTracking() {
  const context = useContext(OrderTrackingContext)
  if (context === undefined) {
    throw new Error("useOrderTracking must be used within an OrderTrackingProvider")
  }
  return context
}
