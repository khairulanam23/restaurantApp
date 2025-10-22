"use client"

import type { MenuItem } from "@/app/lib/types"
import { formatCurrency } from "@/app/lib/utils"
import { restaurantStore } from "@/app/lib/store"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart?: (item: MenuItem) => void
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const favorite = restaurantStore.isFavorite(item.id)

  const handleToggleFavorite = () => {
    restaurantStore.toggleFavorite(item.id)
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border">
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden group">
        <img
          src={item.image || "/placeholder.svg?height=200&width=300&query=food"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!item.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className={`text-xl ${favorite ? "text-red-500" : "text-gray-400"}`}>♥</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

        {/* Dietary Tags */}
        {item.dietary && item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietary.map((tag) => (
              <span key={tag} className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatCurrency(item.price)}</span>
          {item.rating && (
            <span className="text-sm text-muted-foreground">
              ⭐ {item.rating.toFixed(1)} ({item.reviews})
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
