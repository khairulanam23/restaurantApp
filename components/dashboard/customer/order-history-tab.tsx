"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, MapPin, Star, Search, Filter } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    restaurant: "Pizza Palace",
    items: ["Margherita Pizza", "Garlic Bread", "Coca Cola"],
    total: 24.5,
    status: "delivered",
    date: "2024-01-15T18:30:00Z",
    deliveryTime: "25 mins",
    address: "123 Main St, Apt 4B",
    rating: 5,
  },
  {
    id: "ORD-002",
    restaurant: "Burger House",
    items: ["Double Cheeseburger", "French Fries", "Milkshake"],
    total: 18.9,
    status: "delivered",
    date: "2024-01-14T19:45:00Z",
    deliveryTime: "30 mins",
    address: "123 Main St, Apt 4B",
    rating: 4,
  },
  {
    id: "ORD-003",
    restaurant: "Sushi Express",
    items: ["California Roll", "Salmon Nigiri", "Miso Soup"],
    total: 32.0,
    status: "delivered",
    date: "2024-01-12T20:15:00Z",
    deliveryTime: "35 mins",
    address: "456 Oak Ave",
    rating: 0, // Not rated yet
  },
  {
    id: "ORD-004",
    restaurant: "Taco Fiesta",
    items: ["Chicken Tacos", "Guacamole", "Churros"],
    total: 21.75,
    status: "cancelled",
    date: "2024-01-10T17:20:00Z",
    deliveryTime: "N/A",
    address: "123 Main St, Apt 4B",
    rating: 0,
  },
]

export function OrderHistoryTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleViewOrderDetails = (orderId: string) => {
    console.log("[v0] Viewing order details:", orderId)
    // TODO: Navigate to order details page or open modal
    window.location.href = `/orders/${orderId}`
  }

  const handleReorder = (orderId: string) => {
    console.log("[v0] Reordering:", orderId)
    const order = mockOrders.find((o) => o.id === orderId)
    if (order) {
      // TODO: Add items to cart and redirect to restaurant
      alert(`Reordering from ${order.restaurant}. Items will be added to your cart.`)
    }
  }

  const handleRateOrder = (orderId: string) => {
    console.log("[v0] Rating order:", orderId)
    // TODO: Open rating modal
    alert("Rating functionality will be available soon.")
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and manage your past orders</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{order.restaurant}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <strong>Items:</strong> {order.items.join(", ")}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(order.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.address}
                          </span>
                          {order.deliveryTime !== "N/A" && <span>Delivered in {order.deliveryTime}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xl font-bold">${order.total.toFixed(2)}</div>

                      {order.status === "delivered" && (
                        <div className="flex items-center gap-2">
                          {order.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{order.rating}/5</span>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleRateOrder(order.id)}>
                              <Star className="h-4 w-4 mr-1" />
                              Rate Order
                            </Button>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order.id)}>
                          View Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm" onClick={() => handleReorder(order.id)}>
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No orders found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
