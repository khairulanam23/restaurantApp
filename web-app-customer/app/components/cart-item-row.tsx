"use client"

import type { CartItem } from "@/app/lib/types"
import { formatCurrency } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="border-b border-gray-200 p-6 last:border-b-0">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.menuItem.image || "/placeholder.svg?height=100&width=100&query=food"}
            alt={item.menuItem.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{item.menuItem.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{formatCurrency(item.menuItem.price)} each</p>

          {item.specialInstructions && (
            <p className="text-sm text-gray-500 italic mb-2">Note: {item.specialInstructions}</p>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Price and Remove */}
        <div className="text-right flex flex-col justify-between">
          <span className="font-bold text-amber-600">{formatCurrency(item.menuItem.price * item.quantity)}</span>
          <Button
            onClick={onRemove}
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
