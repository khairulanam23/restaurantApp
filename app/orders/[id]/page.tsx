"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navigation/navbar"
import { LiveOrderTracker } from "@/components/tracking/live-order-tracker"

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
            <p className="text-muted-foreground">Real-time updates for your order</p>
          </div>

          <LiveOrderTracker orderId={orderId} customerView={true} />
        </div>
      </div>
    </div>
  )
}
