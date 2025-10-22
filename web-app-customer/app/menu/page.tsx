"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { restaurantStore } from "@/app/lib/store";
import { apiClient } from "@/app/lib/api-client";
import type { MenuItem, MenuCategory } from "@/app/lib/types";
import MenuHeader from "@/app/components/menu-header";
import CategoryTabs from "@/app/components/category-tabs";
import MenuGrid from "@/app/components/menu-grid";
import CartButton from "@/app/components/cart-button";
import { Spinner } from "@/app/components/ui/spinner";

export default function MenuPage() {
  const router = useRouter();
  const tableNumber = restaurantStore.getTableNumber();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no table number
  useEffect(() => {
    if (!tableNumber) {
      router.push("/");
    }
  }, [tableNumber, router]);

  // Fetch categories and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Handle API response structure properly
        const categoriesResponse = await apiClient.getCategories();
        const itemsResponse = await apiClient.getCategories();

        // Extract data based on API response structure
        const categoriesData =
          categoriesResponse?.data || categoriesResponse || [];
        const itemsData = itemsResponse?.data || itemsResponse || [];

        // Ensure we have arrays
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setItems(Array.isArray(itemsData) ? itemsData : []);

        // Set first category as default
        if (
          categoriesData &&
          Array.isArray(categoriesData) &&
          categoriesData.length > 0
        ) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (err) {
        setError("Failed to load menu. Please try again.");
        console.error("Error fetching menu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on category and search
  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        const matchesCategory =
          !selectedCategory || item.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  if (!tableNumber) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <MenuHeader
        tableNumber={tableNumber}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Category Tabs */}
        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Menu Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner className="h-12 w-12 mb-4 mx-auto" />
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive">
            {error}
          </div>
        ) : filteredItems.length > 0 ? (
          <MenuGrid items={filteredItems} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {Array.isArray(items) && items.length === 0
                ? "No menu items available"
                : "No items found matching your criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartButton />
    </main>
  );
}
