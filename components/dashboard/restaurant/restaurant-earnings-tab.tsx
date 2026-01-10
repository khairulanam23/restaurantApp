"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, ShoppingBag, Percent, Download, Calendar } from "lucide-react"

const mockEarningsData = {
  today: {
    orders: 47,
    revenue: 1247.8,
    commission: 187.17, // 15% commission
    netEarnings: 1060.63,
    avgOrderValue: 26.55,
  },
  week: {
    orders: 312,
    revenue: 8234.6,
    commission: 1235.19,
    netEarnings: 6999.41,
    avgOrderValue: 26.39,
  },
  month: {
    orders: 1284,
    revenue: 34567.2,
    commission: 5185.08,
    netEarnings: 29382.12,
    avgOrderValue: 26.92,
  },
}

const mockDailyEarnings = [
  { date: "2024-01-15", orders: 47, revenue: 1247.8, commission: 187.17, netEarnings: 1060.63 },
  { date: "2024-01-14", orders: 38, revenue: 987.4, commission: 148.11, netEarnings: 839.29 },
  { date: "2024-01-13", orders: 52, revenue: 1389.6, commission: 208.44, netEarnings: 1181.16 },
  { date: "2024-01-12", orders: 41, revenue: 1098.7, commission: 164.81, netEarnings: 933.89 },
  { date: "2024-01-11", orders: 49, revenue: 1267.3, commission: 190.1, netEarnings: 1077.2 },
  { date: "2024-01-10", orders: 35, revenue: 892.5, commission: 133.88, netEarnings: 758.62 },
  { date: "2024-01-09", orders: 50, revenue: 1351.5, commission: 202.73, netEarnings: 1148.77 },
]

interface RestaurantEarningsTabProps {
  restaurant: { id: string; name: string }
}

export function RestaurantEarningsTab({ restaurant }: RestaurantEarningsTabProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const currentData = mockEarningsData[selectedPeriod as keyof typeof mockEarningsData]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const commissionRate = 15 // 15% commission rate

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Earnings Overview - {restaurant.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your restaurant revenue and performance</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(currentData.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentData.revenue / currentData.orders)} per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(currentData.commission)}</div>
            <p className="text-xs text-muted-foreground">{commissionRate}% of gross revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentData.netEarnings)}</div>
            <p className="text-xs text-muted-foreground">After platform fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.orders}</div>
            <p className="text-xs text-muted-foreground">Average: {formatCurrency(currentData.avgOrderValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Breakdown</CardTitle>
              <CardDescription>Your earnings breakdown for the past 7 days</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDailyEarnings.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-medium">{formatDate(day.date)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{day.orders} orders</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">Gross Revenue</p>
                    <p className="text-green-600">{formatCurrency(day.revenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Commission</p>
                    <p className="text-red-600">-{formatCurrency(day.commission)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Net Earnings</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(day.netEarnings)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Tips to maximize your restaurant revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Peak Hours</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your busiest hours are 6-8 PM on weekends. Consider offering special promotions during slower periods to
                increase orders.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Popular Items</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Margherita and Pepperoni pizzas account for 60% of your orders. Consider creating combo deals with these
                items.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Order Value</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Your average order value is ${currentData.avgOrderValue.toFixed(2)}. Upselling appetizers and drinks
                could increase this by 15-20%.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Monthly Goal</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You're 87% towards your monthly goal of $40,000. Just 156 more orders to reach it!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
