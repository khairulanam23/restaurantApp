"use client"

import type { MenuItem } from "@/app/lib/types"
import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"

interface ItemDetailViewProps {
  item: MenuItem
  quantity: number
  onQuantityChange: (quantity: number) => void
  specialInstructions: string
  onSpecialInstructionsChange: (instructions: string) => void
  onAddToCart: () => Promise<void>
  isAdding: boolean
}

export default function ItemDetailView({
  item,
  quantity,
  onQuantityChange,
  specialInstructions,
  onSpecialInstructionsChange,
  onAddToCart,
  isAdding,
}: ItemDetailViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image */}
      <div className="h-96 bg-gray-200 overflow-hidden">
        <img
          src={item.image || "/placeholder.svg?height=400&width=600&query=food"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
          <p className="text-gray-600 text-lg mb-4">{item.description}</p>

          {/* Dietary Tags */}
          {item.dietary && item.dietary.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.dietary.map((tag) => (
                <span key={tag} className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          {item.rating && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>⭐ {item.rating.toFixed(1)}</span>
              <span>({item.reviews} reviews)</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-4xl font-bold text-amber-600">{formatCurrency(item.price)}</p>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              −
            </button>
            <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            id="instructions"
            value={specialInstructions}
            onChange={(e) => onSpecialInstructionsChange(e.target.value)}
            placeholder="e.g., No onions, extra sauce..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            rows={3}
          />
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={onAddToCart}
          disabled={isAdding || !item.availability}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isAdding ? "Adding..." : !item.availability ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* Availability Status */}
        {!item.availability && (
          <p className="text-center text-red-600 text-sm mt-2">This item is currently unavailable</p>
        )}
      </div>
    </div>
  )
}
