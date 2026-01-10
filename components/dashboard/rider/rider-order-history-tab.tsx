"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, MapPin, DollarSign, Search, Filter, Star } from "lucide-react"

const mockDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-456",
    restaurant: "Pizza Palace",
    customer: "John Doe",
    customerAddress: "123 Main St, Apt 4B",
    items: ["Margherita Pizza", "Garlic Bread"],
    total: 24.5,
    tip: 5.0,
    earnings: 8.5,
    status: "delivered",
    date: "2024-01-15T18:30:00Z",
    deliveryTime: "25 mins",
    distance: "1.2 km",
    rating: 5,
  },
  {
    id: "DEL-002",
    orderId: "ORD-457",
    restaurant: "Burger House",
    customer: "Sarah Miller",
    customerAddress: "456 Oak Ave, Unit 12",
    items: ["Double Cheeseburger", "French Fries", "Milkshake"],
    total: 18.9,
    tip: 3.0,
    earnings: 7.2,
    status: "delivered",
    date: "2024-01-14T19:45:00Z",
    deliveryTime: "30 mins",
    distance: "2.1 km",
    rating: 4,
  },
  {
    id: "DEL-003",
    orderId: "ORD-458",
    restaurant: "Sushi Express",
    customer: "Mike Johnson",
    customerAddress: "789 Pine St",
    items: ["California Roll", "Salmon Nigiri"],
    total: 32.0,
    tip: 6.0,
    earnings: 10.5,
    status: "delivered",
    date: "2024-01-12T20:15:00Z",
    deliveryTime: "35 mins",
    distance: "3.5 km",
    rating: 5,
  },
  {
    id: "DEL-004",
    orderId: "ORD-459",
    restaurant: "Taco Fiesta",
    customer: "Emma Wilson",
    customerAddress: "321 Elm St",
    items: ["Chicken Tacos", "Guacamole"],
    total: 21.75,
    tip: 0,
    earnings: 6.8,
    status: "cancelled",
    date: "2024-01-10T17:20:00Z",
    deliveryTime: "N/A",
    distance: "1.8 km",
    rating: 0,
  },
]

export function RiderOrderHistoryTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    const matchesSearch =
      delivery.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    )
  }

  const totalEarnings = filteredDeliveries.reduce((sum, delivery) => sum + delivery.earnings, 0)
  const totalTips = filteredDeliveries.reduce((sum, delivery) => sum + delivery.tip, 0)
  const completedDeliveries = filteredDeliveries.filter((d) => d.status === "delivered").length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tips</p>
                <p className="text-xl font-bold">${totalTips.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-xl font-bold">{completedDeliveries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-xl font-bold">4.7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>View your past deliveries and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search deliveries..."
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
                <SelectItem value="all">All Deliveries</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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

          {/* Deliveries List */}
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <Card key={delivery.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">Order #{delivery.orderId}</h3>
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <strong>Restaurant:</strong> {delivery.restaurant}
                        </p>
                        <p>
                          <strong>Customer:</strong> {delivery.customer}
                        </p>
                        <p>
                          <strong>Items:</strong> {delivery.items.join(", ")}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(delivery.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {delivery.distance}
                          </span>
                          {delivery.deliveryTime !== "N/A" && <span>Delivered in {delivery.deliveryTime}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${delivery.earnings.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Order: ${delivery.total.toFixed(2)} • Tip: ${delivery.tip.toFixed(2)}
                        </p>
                      </div>

                      {delivery.status === "delivered" && delivery.rating > 0 && (
                        <div className="flex items-center gap-2">
                          {renderStars(delivery.rating)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">{delivery.rating}/5</span>
                        </div>
                      )}

                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDeliveries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No deliveries found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
