"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { restaurantStore } from "@/app/lib/store";
import { apiClient } from "@/app/lib/api-client";
import {
  formatCurrency,
  calculateTax,
  calculateServiceCharge,
  generateOrderNumber,
} from "@/app/lib/utils";
import type { Order } from "@/app/lib/types";
import { Button } from "@/app/components/ui/button";
import CheckoutSummary from "@/app/components/checkout-summary";
import { Spinner } from "@/app/components/ui/spinner";

export default function CheckoutPage() {
  const router = useRouter();
  const tableNumber = restaurantStore.getTableNumber();
  const cart = restaurantStore.getCart();

  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableNumber || cart.length === 0) {
      router.push("/");
    }
  }, [tableNumber, cart, router]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const tax = calculateTax(subtotal);
  const serviceCharge = calculateServiceCharge(subtotal);
  const total = subtotal + tax + serviceCharge;

  const handlePlaceOrder = async () => {
    if (!tableNumber) return;

    setIsPlacing(true);
    setError(null);

    try {
      const orderNumber = generateOrderNumber();

      const order: Omit<Order, "orderNumber" | "createdAt"> = {
        tableNumber,
        items: cart,
        subtotal,
        tax,
        serviceCharge,
        total,
        status: "received",
        estimatedTime: 30,
        specialInstructions: specialInstructions || undefined,
      };

      // Create order via API
      const response = await apiClient.createOrder(order);

      // Store order in state
      const createdOrder: Order = {
        ...order,
        orderNumber: response.orderNumber || orderNumber,
        createdAt: new Date(),
      };

      restaurantStore.setCurrentOrder(createdOrder);
      restaurantStore.clearCart();

      // Redirect to confirmation
      router.push(`/order-confirmation/${createdOrder.orderNumber}`);
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setIsPlacing(false);
    }
  };

  if (!tableNumber || cart.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-2 mb-3 md:mb-4 text-sm md:text-base transition-colors"
            aria-label="Go back to cart"
          >
            ← Back to Cart
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border border-border">
              {/* Order Review */}
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Order Review
                </h2>
                <div className="space-y-3 pb-6 border-b border-border">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-foreground text-sm md:text-base"
                    >
                      <span>
                        {item.menuItem.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Confirmation */}
              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Delivery Details
                </h2>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-foreground text-sm md:text-base">
                    <span className="font-semibold">Table Number:</span>{" "}
                    {tableNumber}
                  </p>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-8">
                <label
                  htmlFor="special-instructions"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Special Instructions for Order (Optional)
                </label>
                <textarea
                  id="special-instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., Please prepare quickly, allergies, etc."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none text-sm md:text-base"
                  rows={4}
                  aria-label="Special instructions for order"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 text-destructive text-sm md:text-base">
                  {error}
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 md:py-3 rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base flex items-center justify-center gap-2"
                aria-busy={isPlacing}
              >
                {isPlacing && <Spinner className="h-4 w-4" />}
                {isPlacing ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              tax={tax}
              serviceCharge={serviceCharge}
              total={total}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
