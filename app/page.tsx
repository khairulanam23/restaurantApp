import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Truck, Store, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">FoodDelivery</h1>
          <div className="flex items-center gap-4">
            <Link href="/setup-guide">
              <Button variant="outline" size="sm">
                Setup Guide
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to FoodDelivery Platform</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Connect customers, riders, restaurants, and manage everything from one platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/restaurants">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Browse Restaurants
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Real-time Tracking
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Fast Delivery
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Store className="h-3 w-3" />
              Multiple Restaurants
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure Payments
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Customer</CardTitle>
              <CardDescription>Order your favorite food</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Browse restaurants, place orders, track deliveries
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">Customer Login</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Rider</CardTitle>
              <CardDescription>Deliver orders and earn</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Accept deliveries, track earnings, manage orders
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">Rider Login</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Restaurant</CardTitle>
              <CardDescription>Manage your restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Update menus, manage orders, track earnings
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">Restaurant Login</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Admin</CardTitle>
              <CardDescription>Platform management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Manage users, restaurants, and platform operations
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-green-600 hover:bg-green-700">Admin Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300">
            New to the platform?{" "}
            <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
