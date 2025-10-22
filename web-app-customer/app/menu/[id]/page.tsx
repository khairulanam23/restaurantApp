"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { restaurantStore } from "@/app/lib/store";
import { apiClient } from "@/app/lib/api-client";
import type { MenuItem, CartItem } from "@/app/lib/types";
import { Button } from "@/app/components/ui/button";
import ItemDetailView from "@/app/components/item-detail-view";

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getMenuItem(itemId);
        setItem(data);
      } catch (err) {
        setError("Failed to load item details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleAddToCart = async () => {
    if (!item) return;

    setIsAdding(true);
    try {
      const cartItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        menuItem: item,
        quantity,
        specialInstructions: specialInstructions || undefined,
      };

      restaurantStore.addToCart(cartItem);

      // Show success message
      alert(`${item.name} added to cart!`);

      // Redirect back to menu
      router.back();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Item not found"}</p>
          <Button
            onClick={() => router.back()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground font-medium flex items-center gap-2"
        >
          ← Back to Menu
        </button>

        <ItemDetailView
          item={item}
          quantity={quantity}
          onQuantityChange={setQuantity}
          specialInstructions={specialInstructions}
          onSpecialInstructionsChange={setSpecialInstructions}
          onAddToCart={handleAddToCart}
          isAdding={isAdding}
        />
      </div>
    </main>
  );
}
