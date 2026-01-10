"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockRestaurants } from "@/lib/mock-data"
import { Search, Star, Clock, DollarSign, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [deliveryRadius, setDeliveryRadius] = useState<string>("all")

  const allCuisines = useMemo(() => {
    const cuisines = new Set<string>()
    mockRestaurants.forEach((restaurant) => {
      restaurant.cuisine.forEach((c) => cuisines.add(c))
    })
    return Array.from(cuisines)
  }, [])

  const allLocations = useMemo(() => {
    const locations = new Set<string>()
    mockRestaurants.forEach((restaurant) => {
      // Extract city/area from address (assuming format: "Street, City, State")
      const addressParts = restaurant.address.split(", ")
      if (addressParts.length >= 2) {
        locations.add(addressParts[1]) // City/Area
      }
    })
    return Array.from(locations)
  }, [])

  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCuisine = !selectedCuisine || restaurant.cuisine.includes(selectedCuisine)

      const matchesLocation = !selectedLocation || restaurant.address.includes(selectedLocation)

      const matchesRadius =
        deliveryRadius === "all" ||
        (deliveryRadius === "5km" && Number.parseFloat(restaurant.deliveryFee) <= 3) ||
        (deliveryRadius === "10km" && Number.parseFloat(restaurant.deliveryFee) <= 5) ||
        (deliveryRadius === "15km" && Number.parseFloat(restaurant.deliveryFee) <= 7)

      return matchesSearch && matchesCuisine && matchesLocation && matchesRadius && restaurant.isOpen
    })
  }, [searchQuery, selectedCuisine, selectedLocation, deliveryRadius])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Restaurants Near You</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedLocation || "all"} onValueChange={(value) => setSelectedLocation(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {allLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={deliveryRadius} onValueChange={setDeliveryRadius}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Distances</SelectItem>
                  <SelectItem value="5km">Within 5km</SelectItem>
                  <SelectItem value="10km">Within 10km</SelectItem>
                  <SelectItem value="15km">Within 15km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCuisine === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCuisine(null)}
              className={
                selectedCuisine === null ? "bg-orange-600 hover:bg-orange-700 text-white" : "hover:bg-orange-50"
              }
            >
              All Cuisines
            </Button>
            {allCuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine)}
                className={
                  selectedCuisine === cuisine ? "bg-orange-600 hover:bg-orange-700 text-white" : "hover:bg-orange-50"
                }
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 hover:border-orange-200">
                <div className="relative h-48 w-full">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <span className="text-white font-semibold">Closed</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {restaurant.deliveryTime}
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.cuisine.map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>${restaurant.deliveryFee} delivery</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>

                  <Button
                    className="w-full mt-3 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                    size="sm"
                  >
                    View Details & Menu
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">Try adjusting your search, location, or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
