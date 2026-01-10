"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, MapPin, DollarSign, Search, Filter, User, Phone } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-789",
    customer: {
      name: "John Doe",
      phone: "+1 (555) 987-6543",
      address: "123 Main St, Apt 4B",
    },
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 18.99 },
      { name: "Garlic Bread", quantity: 1, price: 8.99 },
    ],
    total: 27.98,
    status: "delivered",
    date: "2024-01-15T18:30:00Z",
    preparationTime: 18,
    deliveryTime: 25,
    paymentMethod: "Credit Card",
    notes: "Extra cheese please",
  },
  {
    id: "ORD-790",
    customer: {
      name: "Sarah Miller",
      phone: "+1 (555) 876-5432",
      address: "456 Oak Ave, Unit 12",
    },
    items: [
      { name: "Pepperoni Pizza", quantity: 2, price: 21.99 },
      { name: "Caesar Salad", quantity: 1, price: 12.99 },
    ],
    total: 56.97,
    status: "delivered",
    date: "2024-01-14T19:45:00Z",
    preparationTime: 22,
    deliveryTime: 30,
    paymentMethod: "Cash",
    notes: "",
  },
  {
    id: "ORD-791",
    customer: {
      name: "Mike Johnson",
      phone: "+1 (555) 765-4321",
      address: "789 Pine St",
    },
    items: [{ name: "Margherita Pizza", quantity: 1, price: 18.99 }],
    total: 18.99,
    status: "cancelled",
    date: "2024-01-12T20:15:00Z",
    preparationTime: 0,
    deliveryTime: 0,
    paymentMethod: "Credit Card",
    notes: "Customer cancelled - address issue",
  },
  {
    id: "ORD-792",
    customer: {
      name: "Emma Wilson",
      phone: "+1 (555) 654-3210",
      address: "321 Elm St",
    },
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 21.99 },
      { name: "Garlic Bread", quantity: 2, price: 8.99 },
    ],
    total: 39.97,
    status: "delivered",
    date: "2024-01-10T17:20:00Z",
    preparationTime: 15,
    deliveryTime: 28,
    paymentMethod: "Credit Card",
    notes: "",
  },
]

interface RestaurantOrderHistoryTabProps {
  restaurant: { id: string; name: string }
}

export function RestaurantOrderHistoryTab({ restaurant }: RestaurantOrderHistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const handleViewOrderDetails = (orderId: string) => {
    console.log("[v0] Viewing order details:", orderId)
    // TODO: Navigate to order details page or open modal
    window.location.href = `/orders/${orderId}`
  }

  const handlePrintReceipt = (orderId: string) => {
    console.log("[v0] Printing receipt for order:", orderId)
    // TODO: Implement receipt printing
    alert("Receipt printing functionality will be available soon.")
  }

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "ready":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
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

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.status === "delivered" ? order.total : 0), 0)
  const completedOrders = filteredOrders.filter((order) => order.status === "delivered").length
  const cancelledOrders = filteredOrders.filter((order) => order.status === "cancelled").length
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Orders</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Order</p>
                <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
                <p className="text-2xl font-bold">{cancelledOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History - {restaurant.name}</CardTitle>
          <CardDescription>View and manage your restaurant orders</CardDescription>
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
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Customer Information</h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              {order.customer.name}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {order.customer.phone}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {order.customer.address}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-green-600 dark:text-green-400">Order Details</h4>
                          <div className="space-y-1 text-sm">
                            {order.items.map((item, index) => (
                              <p key={index}>
                                {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            ))}
                            {order.notes && (
                              <p className="text-gray-600 dark:text-gray-400 italic">Note: {order.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(order.date)}
                        </span>
                        {order.status === "delivered" && (
                          <>
                            <span>Prep: {order.preparationTime}m</span>
                            <span>Delivery: {order.deliveryTime}m</span>
                          </>
                        )}
                        <span>Payment: {order.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrderDetails(order.id)}>
                          View Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm" onClick={() => handlePrintReceipt(order.id)}>
                            Print Receipt
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
