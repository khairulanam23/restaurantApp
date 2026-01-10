"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AdminChatDashboard } from "@/components/support/admin-chat-dashboard"
import {
  Users,
  Store,
  Bike,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  MessageCircle,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleViewUser = (userId: number) => {
    console.log("[v0] Viewing user:", userId)
    // TODO: Implement user details modal
  }

  const handleEditUser = (userId: number) => {
    console.log("[v0] Editing user:", userId)
    // TODO: Implement user edit modal
  }

  const handleDeleteUser = (userId: number) => {
    console.log("[v0] Deleting user:", userId)
    if (confirm("Are you sure you want to delete this user?")) {
      // TODO: Implement user deletion
    }
  }

  const handleApproveRestaurant = (restaurantId: number) => {
    console.log("[v0] Approving restaurant:", restaurantId)
    // TODO: Implement restaurant approval
  }

  const handleRejectRestaurant = (restaurantId: number) => {
    console.log("[v0] Rejecting restaurant:", restaurantId)
    if (confirm("Are you sure you want to reject this restaurant application?")) {
      // TODO: Implement restaurant rejection
    }
  }

  // Mock data
  const stats = {
    totalUsers: 15420,
    totalRiders: 1250,
    totalRestaurants: 890,
    totalOrders: 45680,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
  }

  const recentOrders = [
    {
      id: "#12345",
      customer: "John Doe",
      restaurant: "Pizza Palace",
      rider: "Mike Johnson",
      status: "delivered",
      amount: 25.99,
      time: "2 mins ago",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      restaurant: "Burger King",
      rider: "Sarah Wilson",
      status: "in-transit",
      amount: 18.5,
      time: "5 mins ago",
    },
    {
      id: "#12347",
      customer: "Bob Wilson",
      restaurant: "Sushi Express",
      rider: "Tom Brown",
      status: "preparing",
      amount: 42.75,
      time: "8 mins ago",
    },
  ]

  const pendingRestaurants = [
    { id: 1, name: "New Thai Kitchen", owner: "Lisa Chen", submitted: "2 days ago", documents: "Complete" },
    { id: 2, name: "Italian Corner", owner: "Marco Rossi", submitted: "1 day ago", documents: "Pending" },
    { id: 3, name: "Healthy Bowls", owner: "Emma Davis", submitted: "3 hours ago", documents: "Complete" },
  ]

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "customer", status: "active", joined: "2024-01-15" },
    { id: 2, name: "Mike Johnson", email: "mike@example.com", role: "rider", status: "active", joined: "2024-02-20" },
    { id: 3, name: "Lisa Chen", email: "lisa@example.com", role: "restaurant", status: "active", joined: "2024-01-10" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your food delivery platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="riders">Riders</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
                  <Bike className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.totalRiders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Restaurants</CardTitle>
                  <Store className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.totalRestaurants.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.totalOrders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+22% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.monthlyGrowth}%</div>
                  <p className="text-xs text-muted-foreground">Monthly growth</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Recent Orders</CardTitle>
                  <CardDescription>Latest orders from the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer} • {order.restaurant}
                          </p>
                          <p className="text-xs text-muted-foreground">Rider: {order.rider}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "in-transit"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="text-sm font-medium">${order.amount}</p>
                          <p className="text-xs text-muted-foreground">{order.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Pending Restaurant Approvals</CardTitle>
                  <CardDescription>Restaurants waiting for approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRestaurants.map((restaurant) => (
                      <div key={restaurant.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{restaurant.name}</p>
                          <p className="text-sm text-muted-foreground">Owner: {restaurant.owner}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {restaurant.submitted}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={restaurant.documents === "Complete" ? "default" : "secondary"}>
                            {restaurant.documents}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                              onClick={() => handleApproveRestaurant(restaurant.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                              onClick={() => handleRejectRestaurant(restaurant.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">User Management</CardTitle>
                <CardDescription>Manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Search users..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="rider">Rider</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`/abstract-geometric-shapes.png?height=32&width=32&query=${user.name}`}
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleViewUser(user.id)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Restaurant Management</CardTitle>
                <CardDescription>Manage restaurants and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Store className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Restaurant Management</h3>
                  <p className="text-muted-foreground">Detailed restaurant management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="riders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Rider Management</CardTitle>
                <CardDescription>Manage delivery riders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bike className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Rider Management</h3>
                  <p className="text-muted-foreground">Detailed rider management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Order Management</CardTitle>
                <CardDescription>Monitor and manage all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Order Management</h3>
                  <p className="text-muted-foreground">Detailed order management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Analytics & Reports</CardTitle>
                <CardDescription>Platform analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Detailed analytics and reporting features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <MessageCircle className="h-5 w-5" />
                  Customer Support
                </CardTitle>
                <CardDescription>Manage customer support conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminChatDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
