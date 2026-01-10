"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Clock, CheckCircle, Phone, MapPin } from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: Array<{ name: string; quantity: number; price: number }>
  status: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled"
  totalAmount: number
  deliveryAddress: string
  createdAt: Date
  estimatedTime?: string
}

const mockOrders: Order[] = [
  {
    id: "order_001",
    customerName: "John Doe",
    customerPhone: "+1234567890",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 14.99 },
      { name: "Pepperoni Pizza", quantity: 1, price: 16.99 },
    ],
    status: "pending",
    totalAmount: 34.53,
    deliveryAddress: "123 Main St, New York, NY 10001",
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    estimatedTime: "25-30 min",
  },
  {
    id: "order_002",
    customerName: "Jane Smith",
    customerPhone: "+1234567891",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 12.99 },
      { name: "Crispy Fries", quantity: 1, price: 4.99 },
    ],
    status: "preparing",
    totalAmount: 33.45,
    deliveryAddress: "456 Oak Ave, New York, NY 10002",
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    estimatedTime: "15-20 min",
  },
  {
    id: "order_003",
    customerName: "Mike Johnson",
    customerPhone: "+1234567892",
    items: [
      { name: "Salmon Roll", quantity: 2, price: 8.99 },
      { name: "Tuna Sashimi", quantity: 1, price: 12.99 },
    ],
    status: "ready",
    totalAmount: 33.45,
    deliveryAddress: "789 Pine St, New York, NY 10003",
    createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
  },
]

interface OrderManagementProps {
  userRole: "restaurant" | "rider"
}

export function OrderManagement({ userRole }: OrderManagementProps) {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [activeTab, setActiveTab] = useState("active")

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    toast({
      title: "Order Updated",
      description: `Order #${orderId.slice(-3)} status updated to ${newStatus}.`,
    })
  }

  const getStatusColor = (status: Order["status"]) => {
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

  const getAvailableActions = (order: Order) => {
    if (userRole === "restaurant") {
      switch (order.status) {
        case "pending":
          return [
            { label: "Accept", status: "confirmed" as const, variant: "default" as const },
            { label: "Reject", status: "cancelled" as const, variant: "destructive" as const },
          ]
        case "confirmed":
          return [{ label: "Start Preparing", status: "preparing" as const, variant: "default" as const }]
        case "preparing":
          return [{ label: "Ready for Pickup", status: "ready" as const, variant: "default" as const }]
        default:
          return []
      }
    } else {
      // rider
      switch (order.status) {
        case "ready":
          return [{ label: "Pick Up", status: "picked_up" as const, variant: "default" as const }]
        case "picked_up":
          return [{ label: "Mark Delivered", status: "delivered" as const, variant: "default" as const }]
        default:
          return []
      }
    }
  }

  const filterOrders = (status: string) => {
    if (status === "active") {
      return orders.filter((order) => !["delivered", "cancelled"].includes(order.status))
    } else if (status === "completed") {
      return orders.filter((order) => ["delivered", "cancelled"].includes(order.status))
    }
    return orders
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card key={order.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {order.createdAt.toLocaleTimeString()} • {order.customerName}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{order.deliveryAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{order.customerPhone}</span>
          </div>
          {order.estimatedTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Est. {order.estimatedTime}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {getAvailableActions(order).map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="sm"
              onClick={() => updateOrderStatus(order.id, action.status)}
              className={action.variant === "default" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {action.label}
            </Button>
          ))}
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-1" />
            Call Customer
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {userRole === "restaurant" ? "Order Management" : "Available Deliveries"}
        </h2>
        <p className="text-muted-foreground">
          {userRole === "restaurant"
            ? "Manage incoming orders and update their status"
            : "View and accept delivery orders"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="space-y-4">
            {filterOrders("active").length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Orders</h3>
                  <p className="text-muted-foreground">
                    {userRole === "restaurant"
                      ? "New orders will appear here when customers place them."
                      : "Available delivery orders will appear here."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filterOrders("active").map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {filterOrders("completed").length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Orders</h3>
                  <p className="text-muted-foreground">Completed orders will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              filterOrders("completed").map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
