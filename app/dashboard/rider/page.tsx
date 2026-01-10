"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { RiderProfileTab } from "@/components/dashboard/rider/rider-profile-tab"
import { RiderOrderHistoryTab } from "@/components/dashboard/rider/rider-order-history-tab"
import { RiderEarningsTab } from "@/components/dashboard/rider/rider-earnings-tab"
import { RiderFeedbackTab } from "@/components/dashboard/rider/rider-feedback-tab"
import { OrderManagement } from "@/components/orders/order-management"
import { RealTimeDashboard } from "@/components/tracking/real-time-dashboard"
import { LogOut, Clock, DollarSign, Star, User, Navigation } from "lucide-react"

export default function RiderDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user || user.role !== "rider") {
      router.push("/auth/login?role=rider")
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
                Rider
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
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
              <User className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Order Status</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Earnings</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Feedback</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealTimeDashboard userRole="rider" />
          </TabsContent>

          <TabsContent value="profile">
            <RiderProfileTab user={user} />
          </TabsContent>

          <TabsContent value="status">
            <OrderManagement userRole="rider" />
          </TabsContent>

          <TabsContent value="history">
            <RiderOrderHistoryTab />
          </TabsContent>

          <TabsContent value="earnings">
            <RiderEarningsTab />
          </TabsContent>

          <TabsContent value="feedback">
            <RiderFeedbackTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
