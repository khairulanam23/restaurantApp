"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOrderTracking } from "@/contexts/order-tracking-context"
import { Bell, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface RealTimeDashboardProps {
  userRole: "customer" | "rider" | "restaurant" | "admin"
}

export function RealTimeDashboard({ userRole }: RealTimeDashboardProps) {
  const { activeOrders, subscribeToOrder } = useOrderTracking()
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedToday: 0,
    avgDeliveryTime: "28 min",
  })

  // Subscribe to demo orders for real-time updates
  useEffect(() => {
    const demoOrderIds = ["order_001", "order_002", "order_003"]
    demoOrderIds.forEach((id) => subscribeToOrder(id))
  }, [subscribeToOrder])

  // Update stats based on active orders
  useEffect(() => {
    const orders = Array.from(activeOrders.values())
    setStats({
      totalOrders: orders.length,
      activeOrders: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
      completedToday: orders.filter((o) => o.status === "delivered").length,
      avgDeliveryTime: "28 min",
    })
  }, [activeOrders])

  const getRecentUpdates = () => {
    return Array.from(activeOrders.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5)
  }

  const getDashboardTitle = () => {
    switch (userRole) {
      case "customer":
        return "My Orders"
      case "rider":
        return "Delivery Dashboard"
      case "restaurant":
        return "Restaurant Dashboard"
      case "admin":
        return "Platform Overview"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getDashboardTitle()}</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Updates</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+2 from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDeliveryTime}</div>
            <p className="text-xs text-muted-foreground">-3 min from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentUpdates().length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent updates</p>
            ) : (
              getRecentUpdates().map((order) => (
                <div
                  key={`${order.orderId}-${order.timestamp.getTime()}`}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order #{order.orderId.slice(-6)}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.message || `Status updated to ${order.status}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{order.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
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
