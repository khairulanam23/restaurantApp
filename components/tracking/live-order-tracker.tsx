"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useOrderTracking } from "@/contexts/order-tracking-context"
import { CheckCircle, Clock, Truck, MapPin, Phone, MessageCircle } from "lucide-react"

interface LiveOrderTrackerProps {
  orderId: string
  customerView?: boolean
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: CheckCircle },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Clock },
  { key: "ready", label: "Ready for Pickup", icon: CheckCircle },
  { key: "picked_up", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
]

export function LiveOrderTracker({ orderId, customerView = true }: LiveOrderTrackerProps) {
  const { activeOrders, subscribeToOrder, unsubscribeFromOrder } = useOrderTracking()
  const [estimatedTime, setEstimatedTime] = useState("25-35 min")

  const orderUpdate = activeOrders.get(orderId)
  const currentStepIndex = statusSteps.findIndex((step) => step.key === orderUpdate?.status)
  const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / statusSteps.length) * 100 : 0

  useEffect(() => {
    subscribeToOrder(orderId)
    return () => unsubscribeFromOrder(orderId)
  }, [orderId, subscribeToOrder, unsubscribeFromOrder])

  // Simulate estimated time updates
  useEffect(() => {
    if (orderUpdate?.status === "preparing") {
      setEstimatedTime("15-20 min")
    } else if (orderUpdate?.status === "picked_up") {
      setEstimatedTime("5-10 min")
    }
  }, [orderUpdate?.status])

  if (!orderUpdate) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Order Status...</h3>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Live Tracking
              </CardTitle>
              <p className="text-sm text-muted-foreground">Order #{orderId.slice(-6)}</p>
            </div>
            <Badge className={`${getStatusColor(orderUpdate.status)} text-white`}>
              {orderUpdate.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {orderUpdate.status !== "delivered" && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{estimatedTime}</div>
                <div className="text-sm text-muted-foreground">Estimated delivery time</div>
              </div>
            )}

            {orderUpdate.message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">{orderUpdate.message}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const isActive = orderUpdate.status === step.key

              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium transition-colors ${
                        isCurrent ? "text-green-600" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </div>
                    {isActive && orderUpdate.timestamp && (
                      <div className="text-sm text-muted-foreground">{orderUpdate.timestamp.toLocaleTimeString()}</div>
                    )}
                  </div>
                  {isCurrent && <Badge className="bg-green-600 animate-pulse">Active</Badge>}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Map (Simulated) */}
      {orderUpdate.status === "picked_up" && customerView && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Delivery Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Live map tracking would appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Your rider is on the way!</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Rider
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Rider
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500"
    case "confirmed":
      return "bg-blue-500"
    case "preparing":
      return "bg-orange-500"
    case "ready":
      return "bg-green-500"
    case "picked_up":
      return "bg-purple-500"
    case "delivered":
      return "bg-green-600"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}
