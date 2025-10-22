"use client"

import type { MenuCategory } from "@/app/lib/types"

interface CategoryTabsProps {
  categories: MenuCategory[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-amber-500"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
