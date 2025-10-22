"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRestaurantStore } from "@/app/lib/store";
import { formatCurrency } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import type { CartItem } from "@/app/lib/types"; // Import the CartItem type

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const currentOrder = useRestaurantStore((state) => state.currentOrder);
  const tableNumber = useRestaurantStore((state) => state.tableNumber);

  useEffect(() => {
    if (!tableNumber) {
      router.push("/");
    }
  }, [tableNumber, router]);

  if (!currentOrder || !tableNumber) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Your order has been placed successfully
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Order Number */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {orderNumber}
            </p>
          </div>

          {/* Table Number */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Table Number</p>
            <p className="text-xl font-semibold text-gray-900">{tableNumber}</p>
          </div>

          {/* Items */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Items Ordered
            </p>
            <div className="space-y-2">
              {currentOrder.items.map((item :CartItem) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.menuItem.name} x {item.quantity}
                  </span>
                  <span>
                    {formatCurrency(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-amber-600">
                {formatCurrency(currentOrder.total)}
              </span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Estimated Preparation Time:</span>{" "}
              {currentOrder.estimatedTime} minutes
            </p>
          </div>

          {/* Special Instructions */}
          {currentOrder.specialInstructions && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Special Instructions</p>
              <p className="text-gray-700">
                {currentOrder.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push(`/order-tracking/${orderNumber}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Track Order
          </Button>

          <Button
            onClick={() => router.push("/menu")}
            variant="outline"
            className="w-full text-gray-700 border border-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50"
          >
            Order More
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Your order will be delivered to your table</p>
          <p className="mt-1">Thank you for ordering!</p>
        </div>
      </div>
    </main>
  );
}
