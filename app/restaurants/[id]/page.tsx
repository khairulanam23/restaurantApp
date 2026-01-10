"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { mockRestaurants, mockMenuItems } from "@/lib/mock-data"
import { useCart } from "@/contexts/cart-context"
import { Star, Clock, DollarSign, MapPin, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function RestaurantPage() {
  const params = useParams()
  const restaurantId = params.id as string
  const { addItem } = useCart()
  const { toast } = useToast()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")

  const restaurant = mockRestaurants.find((r) => r.id === restaurantId)
  const menuItems = mockMenuItems.filter((item) => item.restaurantId === restaurantId)

  const categories = useMemo(() => {
    const cats = new Set<string>()
    menuItems.forEach((item) => cats.add(item.category))
    return Array.from(cats)
  }, [menuItems])

  const filteredMenuItems = useMemo(() => {
    return selectedCategory ? menuItems.filter((item) => item.category === selectedCategory) : menuItems
  }, [menuItems, selectedCategory])

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
            <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      const success = addItem(selectedItem, quantity, specialInstructions || undefined)
      if (success) {
        setDialogOpen(false)
        setQuantity(1)
        setSpecialInstructions("")
        setSelectedItem(null)
      }
    }
  }

  const openItemDialog = (item: any) => {
    setSelectedItem(item)
    setQuantity(1)
    setSpecialInstructions("")
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <div className="mb-8">
          <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
            <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
            {!restaurant.isOpen && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-xl">Currently Closed</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground mb-4">{restaurant.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisine.map((cuisine) => (
                  <Badge key={cuisine} variant="secondary">
                    {cuisine}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>${restaurant.deliveryFee} delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Min ${restaurant.minimumOrder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={
                selectedCategory === null ? "bg-orange-600 hover:bg-orange-700 text-white" : "hover:bg-orange-50"
              }
            >
              All Items
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category ? "bg-orange-600 hover:bg-orange-700 text-white" : "hover:bg-orange-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        <div className="grid gap-4">
          {filteredMenuItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow border-2 hover:border-orange-200">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <div className="absolute bottom-0 right-0 bg-green-600 text-white px-2 py-1 rounded-tl-lg text-xs font-bold">
                      ${item.price}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                        <span className="text-sm">4.5</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                    {item.ingredients && (
                      <p className="text-xs text-muted-foreground mb-3">{item.ingredients.join(", ")}</p>
                    )}

                    <div className="flex justify-between items-center">
                      <Badge
                        variant={item.isAvailable ? "secondary" : "destructive"}
                        className={item.isAvailable ? "bg-green-100 text-green-800" : ""}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </Badge>

                      {restaurant.isOpen && item.isAvailable && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => openItemDialog(item)}
                              className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add to Cart</DialogTitle>
                              <DialogDescription>Customize your {selectedItem?.name}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="flex gap-4 p-4 bg-orange-50 rounded-lg">
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={selectedItem?.image || "/placeholder.svg"}
                                    alt={selectedItem?.name || ""}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{selectedItem?.name}</h4>
                                  <p className="text-sm text-muted-foreground">${selectedItem?.price}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="font-medium">Quantity</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="hover:bg-orange-50"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">{quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="hover:bg-orange-50"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Special Instructions (Optional)
                                </label>
                                <Textarea
                                  placeholder="Any special requests..."
                                  value={specialInstructions}
                                  onChange={(e) => setSpecialInstructions(e.target.value)}
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                onClick={handleAddToCart}
                                className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                              >
                                Add to Cart - ${((selectedItem?.price || 0) * quantity).toFixed(2)}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">This category doesn't have any items yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
