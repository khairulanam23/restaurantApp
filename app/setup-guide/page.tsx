import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Code, Database, Server, Smartphone } from "lucide-react"

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Setup Guide</h1>
            <p className="text-muted-foreground">Complete guide to set up and run the FoodDelivery platform</p>
          </div>

          <div className="space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This is a comprehensive food delivery platform built with Next.js, featuring role-based dashboards for
                  customers, riders, restaurant owners, and administrators.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Role-based authentication system</li>
                      <li>• Real-time order tracking</li>
                      <li>• Restaurant management</li>
                      <li>• Shopping cart functionality</li>
                      <li>• Payment processing</li>
                      <li>• Dark/Light theme support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Next.js 14</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                      <Badge variant="secondary">shadcn/ui</Badge>
                      <Badge variant="secondary">React Context</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Installation Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Installation & Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Clone or Download</h4>
                      <p className="text-sm text-muted-foreground">
                        Download the project files from v0 or clone from GitHub
                      </p>
                      <code className="block mt-2 p-2 bg-muted rounded text-sm">git clone [repository-url]</code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Install Dependencies</h4>
                      <p className="text-sm text-muted-foreground">Install all required packages using npm or yarn</p>
                      <code className="block mt-2 p-2 bg-muted rounded text-sm">npm install</code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Environment Setup</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure environment variables for MongoDB and other services
                      </p>
                      <code className="block mt-2 p-2 bg-muted rounded text-sm">cp .env.example .env.local</code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Start Development Server</h4>
                      <p className="text-sm text-muted-foreground">Run the development server on localhost:3000</p>
                      <code className="block mt-2 p-2 bg-muted rounded text-sm">npm run dev</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  User Roles & Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-600">Customer</h4>
                      <p className="text-sm text-muted-foreground mb-2">Browse restaurants and place orders</p>
                      <ul className="text-sm space-y-1">
                        <li>• Browse restaurants and menus</li>
                        <li>• Add items to cart</li>
                        <li>• Place and track orders</li>
                        <li>• Manage addresses and payments</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-600">Rider</h4>
                      <p className="text-sm text-muted-foreground mb-2">Accept and deliver orders</p>
                      <ul className="text-sm space-y-1">
                        <li>• View available deliveries</li>
                        <li>• Accept and manage orders</li>
                        <li>• Track earnings</li>
                        <li>• Update delivery status</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-purple-600">Restaurant Owner</h4>
                      <p className="text-sm text-muted-foreground mb-2">Manage restaurants and orders</p>
                      <ul className="text-sm space-y-1">
                        <li>• Register and manage restaurants</li>
                        <li>• Update menus and pricing</li>
                        <li>• Process incoming orders</li>
                        <li>• Track restaurant analytics</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-600">Admin</h4>
                      <p className="text-sm text-muted-foreground mb-2">Platform administration</p>
                      <ul className="text-sm space-y-1">
                        <li>• Manage all users and restaurants</li>
                        <li>• Monitor platform operations</li>
                        <li>• View analytics and reports</li>
                        <li>• System configuration</li>
                      </ul>
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                        <strong>Admin Login:</strong> admin@example.com / admin@1234
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The application is configured to work with MongoDB. Update your environment variables:</p>

                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fooddelivery
                    <br />
                    JWT_SECRET=your-super-secret-jwt-key-here
                    <br />
                    JWT_EXPIRES_IN=7d
                    <br />
                    NODE_ENV=development
                  </code>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Note</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Currently using mock data for demonstration. In production, integrate with your preferred database
                    and implement proper API endpoints for data persistence.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* URLs and Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Important URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Main Pages</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <code>/</code> - Homepage
                      </li>
                      <li>
                        • <code>/restaurants</code> - Restaurant listing
                      </li>
                      <li>
                        • <code>/cart</code> - Shopping cart
                      </li>
                      <li>
                        • <code>/checkout</code> - Checkout process
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Authentication</h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        • <code>/auth/login</code> - User login
                      </li>
                      <li>
                        • <code>/auth/register</code> - User registration
                      </li>
                      <li>
                        • <code>/dashboard/[role]</code> - Role-based dashboards
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Message */}
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <h4 className="font-semibold">Setup Complete!</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your FoodDelivery platform is ready to use. Start by creating user accounts and exploring the
                  different role-based dashboards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
