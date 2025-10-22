"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRestaurantStore } from "@/app/lib/store";
import { apiClient } from "@/app/lib/api-client";
import type { Order } from "@/app/lib/types";
import { formatCurrency } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import OrderStatusTimeline from "@/app/components/order-status-timeline";

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const tableNumber = useRestaurantStore((state) => state.tableNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Fetch order status
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getOrderStatus(orderNumber);
        setOrder(data.data);
        setTimeRemaining(data.data?.estimatedTime || null);
      } catch (err) {
        setError("Failed to load order status");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  // Countdown timer
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [timeRemaining]);

  if (!tableNumber) {
    router.push("/");
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-gray-600">Loading order status...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <Button
            onClick={() => router.push("/menu")}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Back to Menu
          </Button>
        </div>
      </main>
    );
  }

  const statusMessages = {
    received: "Your order has been received",
    preparing: "Your order is being prepared",
    ready: "Your order is ready for pickup",
    completed: "Order completed",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
        </div>

        {/* Order Number and Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-xl font-bold text-gray-900 font-mono">
                {orderNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Table Number</p>
              <p className="text-xl font-bold text-gray-900">
                {order.tableNumber}
              </p>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700 font-semibold">
              {statusMessages[order.status]}
            </p>
          </div>

          {/* Time Remaining */}
          {order.status !== "completed" && timeRemaining !== null && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-700">
                <span className="font-semibold">Estimated Time Remaining:</span>{" "}
                {timeRemaining} minutes
              </p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <OrderStatusTimeline status={order.status} />

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Items in Order
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between pb-3 border-b border-gray-200 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.menuItem.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-500 italic">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <p className="font-semibold text-amber-600">
                  {formatCurrency(item.menuItem.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 pb-4 border-b border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service Charge</span>
              <span>{formatCurrency(order.serviceCharge)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-amber-600">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {order.status === "ready" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700 font-semibold">
                Your order is ready! Please pick it up from the counter.
              </p>
            </div>
          )}

          <Button
            onClick={() => router.push("/menu")}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Order More
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full text-gray-700 border border-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
