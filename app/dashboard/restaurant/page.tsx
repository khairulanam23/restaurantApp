"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { RestaurantProfileTab } from "@/components/dashboard/restaurant/restaurant-profile-tab"
import { RestaurantEarningsTab } from "@/components/dashboard/restaurant/restaurant-earnings-tab"
import { RestaurantManagementTab } from "@/components/dashboard/restaurant/restaurant-management-tab"
import { RestaurantMenuTab } from "@/components/dashboard/restaurant/restaurant-menu-tab"
import { OrderManagement } from "@/components/orders/order-management"
import { RealTimeDashboard } from "@/components/tracking/real-time-dashboard"
import { LogOut, Store, DollarSign, Settings, Menu, User, ShoppingBag } from "lucide-react"

const mockRestaurants = [
  {
    id: "1",
    name: "Pizza Palace",
    type: "Italian",
    status: "active",
    address: "789 Restaurant St",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    totalOrders: 1247,
  },
  {
    id: "2",
    name: "Burger Express",
    type: "American",
    status: "active",
    address: "456 Food Ave",
    phone: "+1 (555) 234-5678",
    rating: 4.6,
    totalOrders: 892,
  },
]

export default function RestaurantDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRestaurant, setSelectedRestaurant] = useState(mockRestaurants[0])

  useEffect(() => {
    if (!user || user.role !== "restaurant") {
      router.push("/auth/login?role=restaurant")
    }
  }, [user, router])

  if (!user) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400"><a href="/restaurants">FoodDelivery</a></h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Restaurant Owner
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Restaurant Selector */}
              <Select
                value={selectedRestaurant.id}
                onValueChange={(value) => {
                  const restaurant = mockRestaurants.find((r) => r.id === value)
                  if (restaurant) setSelectedRestaurant(restaurant)
                }}
              >
                <SelectTrigger className="w-48">
                  <Store className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockRestaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
              </div>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Restaurants</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center space-x-2">
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Earnings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealTimeDashboard userRole="restaurant" />
          </TabsContent>

          <TabsContent value="profile">
            <RestaurantProfileTab user={user} />
          </TabsContent>

          <TabsContent value="restaurants">
            <RestaurantManagementTab restaurants={mockRestaurants} selectedRestaurant={selectedRestaurant} />
          </TabsContent>

          <TabsContent value="menu">
            <RestaurantMenuTab restaurant={selectedRestaurant} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement userRole="restaurant" />
          </TabsContent>

          <TabsContent value="earnings">
            <RestaurantEarningsTab restaurant={selectedRestaurant} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
