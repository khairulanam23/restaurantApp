"use client";

import { useRouter } from "next/navigation";
import { restaurantStore } from "@/app/lib/store";
import {
  formatCurrency,
  calculateTax,
  calculateServiceCharge,
} from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import CartItemRow from "@/app/components/cart-item-row";

export default function CartPage() {
  const router = useRouter();
  const tableNumber = restaurantStore.getTableNumber();
  const cart = restaurantStore.getCart();

  if (!tableNumber) {
    router.push("/");
    return null;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const tax = calculateTax(subtotal);
  const serviceCharge = calculateServiceCharge(subtotal);
  const total = subtotal + tax + serviceCharge;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>

          <div className="bg-card rounded-lg shadow-lg p-12 text-center border border-border">
            <p className="text-muted-foreground text-lg mb-6">
              Your cart is empty
            </p>
            <Button
              onClick={() => router.push("/menu")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-2 mb-3 md:mb-4 text-sm md:text-base transition-colors"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Table {tableNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
              {cart.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={(quantity) =>
                    restaurantStore.updateCartItem(item.id, quantity)
                  }
                  onRemove={() => restaurantStore.removeFromCart(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-lg p-6 sticky top-6 border border-border">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-muted-foreground text-sm md:text-base">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm md:text-base">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm md:text-base">
                  <span>Service Charge (18%)</span>
                  <span>{formatCurrency(serviceCharge)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base md:text-lg font-semibold text-foreground">
                  Total
                </span>
                <span className="text-xl md:text-2xl font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 md:py-3 rounded-lg transition-colors mb-3 text-sm md:text-base"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => router.push("/menu")}
                variant="outline"
                className="w-full text-foreground border border-border font-semibold py-2 md:py-3 rounded-lg hover:bg-muted text-sm md:text-base"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
