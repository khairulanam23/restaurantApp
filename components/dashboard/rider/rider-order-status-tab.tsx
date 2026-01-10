"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Navigation, Clock, MapPin, Phone, CheckCircle, AlertCircle, Bike } from "lucide-react"

const mockActiveOrders = [
  {
    id: "DEL-001",
    orderId: "ORD-456",
    restaurant: {
      name: "Pizza Palace",
      address: "789 Restaurant St",
      phone: "+1 (555) 123-4567",
    },
    customer: {
      name: "John Doe",
      address: "123 Main St, Apt 4B",
      phone: "+1 (555) 987-6543",
    },
    items: ["Margherita Pizza", "Garlic Bread"],
    total: 24.5,
    status: "picked_up",
    estimatedTime: "8 mins",
    distance: "1.2 km",
    pickupTime: "18:30",
    deliveryTime: "18:45",
  },
  {
    id: "DEL-002",
    orderId: "ORD-457",
    restaurant: {
      name: "Burger House",
      address: "456 Food Ave",
      phone: "+1 (555) 234-5678",
    },
    customer: {
      name: "Sarah Miller",
      address: "456 Oak Ave, Unit 12",
      phone: "+1 (555) 876-5432",
    },
    items: ["Double Cheeseburger", "French Fries"],
    total: 18.9,
    status: "preparing",
    estimatedTime: "15 mins",
    distance: "2.1 km",
    pickupTime: "19:00",
    deliveryTime: "19:20",
  },
]

export function RiderOrderStatusTab() {
  const [isOnline, setIsOnline] = useState(true)
  const [activeOrders, setActiveOrders] = useState(mockActiveOrders)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "picked_up":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "ready":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "delivered":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "picked_up":
        return <Bike className="h-4 w-4" />
      case "preparing":
        return <Clock className="h-4 w-4" />
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setActiveOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    toast({
      title: "Status updated",
      description: `Order status updated to ${newStatus.replace("_", " ")}`,
    })
  }

  const handleToggleOnline = (online: boolean) => {
    setIsOnline(online)
    toast({
      title: online ? "You're now online" : "You're now offline",
      description: online ? "You can receive new delivery requests" : "You won't receive new delivery requests",
    })
  }

  return (
    <div className="space-y-6">
      {/* Online Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Delivery Status
          </CardTitle>
          <CardDescription>Manage your availability and active deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
              <div>
                <p className="font-medium">{isOnline ? "Online" : "Offline"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isOnline ? "Available for deliveries" : "Not accepting new orders"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="online-status">Go Online</Label>
              <Switch id="online-status" checked={isOnline} onCheckedChange={handleToggleOnline} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Active Orders ({activeOrders.length})
          </CardTitle>
          <CardDescription>Orders currently assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="text-center py-8">
              <Bike className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No active orders</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {isOnline ? "Waiting for new delivery requests..." : "Go online to receive orders"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {order.status.replace("_", " ").toUpperCase()}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Items: {order.items.join(", ")} • ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">ETA: {order.estimatedTime}</p>
                        </div>
                      </div>

                      {/* Restaurant & Customer Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-600 dark:text-green-400">Pickup From:</h4>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="font-medium">{order.restaurant.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.restaurant.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.restaurant.phone}
                            </p>
                            <p className="text-xs text-gray-500">Pickup by: {order.pickupTime}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Deliver To:</h4>
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.customer.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.customer.phone}
                            </p>
                            <p className="text-xs text-gray-500">Deliver by: {order.deliveryTime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        {order.status === "preparing" && (
                          <Button
                            onClick={() => handleStatusUpdate(order.id, "ready")}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Mark as Ready for Pickup
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            onClick={() => handleStatusUpdate(order.id, "picked_up")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark as Picked Up
                          </Button>
                        )}
                        {order.status === "picked_up" && (
                          <Button
                            onClick={() => handleStatusUpdate(order.id, "delivered")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                        <Button variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
