"use client";

import { useRouter } from "next/navigation";
import { useRestaurantStore } from "@/app/lib/store";

export default function CartButton() {
  const router = useRouter();
  const cartItems = useRestaurantStore((state) => state.cart);
  interface CartItem {
    quantity: number;
  }
  const itemCount: number = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  if (itemCount === 0) {
    return null;
  }

  return (
    <button
      onClick={() => router.push("/cart")}
      className="fixed bottom-6 right-4 md:right-6 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-3 md:p-4 shadow-lg flex items-center gap-2 transition-all hover:scale-110 z-50"
    >
      <span className="text-lg md:text-xl">🛒</span>
      <span className="font-semibold text-sm md:text-base">{itemCount}</span>
    </button>
  );
}
