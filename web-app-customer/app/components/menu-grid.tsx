"use client"

import { useRouter } from "next/navigation"
import type { MenuItem } from "@/app/lib/types"
import MenuItemCard from "@/app/components/menu-item-card"

interface MenuGridProps {
  items: MenuItem[]
}

export default function MenuGrid({ items }: MenuGridProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {items.map((item) => (
        <div key={item.id} onClick={() => router.push(`/menu/${item.id}`)} className="cursor-pointer">
          <MenuItemCard item={item} />
        </div>
      ))}
    </div>
  )
}
