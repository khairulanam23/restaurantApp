"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restaurantStore } from "@/app/lib/store";
import { apiClient } from "@/app/lib/api-client";
import TableEntryForm from "@/app/components/table-entry-form";
import { ThemeToggle } from "@/app/components/theme-provider";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTableSubmit = async (tableNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.validateTableNumber(tableNumber);

      if (!response.success) {
        throw new Error(response.message || "Invalid table number");
      }

      restaurantStore.setTableNumber(tableNumber);
      router.push("/menu");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid table number. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="mb-4 md:mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Order delicious food from your table
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-border">
          <TableEntryForm
            onSubmit={handleTableSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Info Section */}
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  Enter Your Table
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Start by entering your table number
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  Browse Menu
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Explore our delicious menu items
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  Place Order
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Quick checkout and order confirmation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 md:mt-8 text-xs md:text-sm text-muted-foreground">
          <p>Hours: 11:00 AM - 10:00 PM</p>
          <p className="mt-1">Questions? Ask your server for assistance</p>
        </div>
      </div>
    </main>
  );
}
