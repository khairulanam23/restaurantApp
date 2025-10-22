"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

interface MenuHeaderProps {
  tableNumber: string
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function MenuHeader({ tableNumber, searchQuery, onSearchChange }: MenuHeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
            <p className="text-sm text-gray-600">Table {tableNumber}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/")
            }}
            className="text-gray-700"
          >
            Change Table
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </header>
  )
}
