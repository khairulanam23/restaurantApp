"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Clock, Target, Download, Calendar } from "lucide-react"

const mockEarningsData = {
  today: {
    deliveries: 12,
    earnings: 156.8,
    tips: 45.2,
    hours: 6.5,
    avgPerDelivery: 13.07,
  },
  week: {
    deliveries: 67,
    earnings: 892.4,
    tips: 234.6,
    hours: 38.5,
    avgPerDelivery: 13.32,
  },
  month: {
    deliveries: 284,
    earnings: 3567.2,
    tips: 987.4,
    hours: 156.2,
    avgPerDelivery: 12.56,
  },
}

const mockDailyEarnings = [
  { date: "2024-01-15", deliveries: 12, earnings: 156.8, tips: 45.2, hours: 6.5 },
  { date: "2024-01-14", deliveries: 8, earnings: 98.4, tips: 28.6, hours: 4.2 },
  { date: "2024-01-13", deliveries: 15, earnings: 189.5, tips: 52.3, hours: 7.8 },
  { date: "2024-01-12", deliveries: 10, earnings: 124.7, tips: 35.8, hours: 5.5 },
  { date: "2024-01-11", deliveries: 14, earnings: 167.2, tips: 48.9, hours: 6.9 },
  { date: "2024-01-10", deliveries: 8, earnings: 95.8, tips: 24.2, hours: 4.1 },
  { date: "2024-01-09", deliveries: 0, earnings: 0, tips: 0, hours: 0 },
]

export function RiderEarningsTab() {
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

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Earnings Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your delivery earnings and performance</p>
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
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(currentData.earnings)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentData.earnings / currentData.deliveries)} per delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tips Received</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentData.tips)}</div>
            <p className="text-xs text-muted-foreground">
              {((currentData.tips / (currentData.earnings + currentData.tips)) * 100).toFixed(1)}% of total income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.deliveries}</div>
            <p className="text-xs text-muted-foreground">
              {(currentData.deliveries / currentData.hours).toFixed(1)} per hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.hours}h</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(currentData.earnings / currentData.hours)} per hour
            </p>
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
                    {day.deliveries === 0 ? (
                      <Badge variant="secondary">Day Off</Badge>
                    ) : (
                      <Badge variant="outline">{day.deliveries} deliveries</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-600 dark:text-gray-400">{day.hours}h</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tips</p>
                    <p className="text-blue-600">{formatCurrency(day.tips)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Earnings</p>
                    <p className="text-green-600 font-semibold">{formatCurrency(day.earnings)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Total</p>
                    <p className="text-lg font-bold">{formatCurrency(day.earnings + day.tips)}</p>
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
          <CardDescription>Tips to maximize your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Peak Hours</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your best earning hours are 6-8 PM on weekdays. Consider working more during these times to maximize
                income.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Tip Optimization</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your average tip rate is 18.5%. Excellent customer service and timely deliveries help maintain high
                tips.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Efficiency</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                You complete 1.8 deliveries per hour on average. Focus on shorter distance orders to increase this rate.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Weekly Goal</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You're 89% towards your weekly goal of $1000. Just 11 more deliveries to reach it!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
