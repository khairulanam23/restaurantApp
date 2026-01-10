"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Store, Edit, Settings, MapPin, Phone, Star } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  type: string
  status: string
  address: string
  phone: string
  rating: number
  totalOrders: number
}

interface RestaurantManagementTabProps {
  restaurants: Restaurant[]
  selectedRestaurant: Restaurant
}

export function RestaurantManagementTab({ restaurants, selectedRestaurant }: RestaurantManagementTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const { toast } = useToast()

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    type: "",
    address: "",
    phone: "",
    description: "",
    cuisine: "",
    priceRange: "",
    deliveryFee: "",
    minimumOrder: "",
    preparationTime: "",
    operatingHours: {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "23:00", closed: false },
      saturday: { open: "09:00", close: "23:00", closed: false },
      sunday: { open: "10:00", close: "21:00", closed: false },
    },
  })

  const handleAddRestaurant = () => {
    toast({
      title: "Restaurant added",
      description: `${newRestaurant.name} has been successfully added to your account.`,
    })
    setIsAddDialogOpen(false)
    setNewRestaurant({
      name: "",
      type: "",
      address: "",
      phone: "",
      description: "",
      cuisine: "",
      priceRange: "",
      deliveryFee: "",
      minimumOrder: "",
      preparationTime: "",
      operatingHours: {
        monday: { open: "09:00", close: "22:00", closed: false },
        tuesday: { open: "09:00", close: "22:00", closed: false },
        wednesday: { open: "09:00", close: "22:00", closed: false },
        thursday: { open: "09:00", close: "22:00", closed: false },
        friday: { open: "09:00", close: "23:00", closed: false },
        saturday: { open: "09:00", close: "23:00", closed: false },
        sunday: { open: "10:00", close: "21:00", closed: false },
      },
    })
  }

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant)
    setIsEditDialogOpen(true)
  }

  const handleUpdateRestaurant = () => {
    toast({
      title: "Restaurant updated",
      description: `${editingRestaurant?.name} has been successfully updated.`,
    })
    setIsEditDialogOpen(false)
    setEditingRestaurant(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                My Restaurants ({restaurants.length})
              </CardTitle>
              <CardDescription>Manage your restaurant locations and settings</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Restaurant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Restaurant</DialogTitle>
                  <DialogDescription>Add a new restaurant location to your account</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddRestaurant()
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-name">Restaurant Name</Label>
                      <Input
                        id="restaurant-name"
                        value={newRestaurant.name}
                        onChange={(e) => setNewRestaurant((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Pizza Palace Downtown"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuisine-type">Cuisine Type</Label>
                      <Select
                        value={newRestaurant.cuisine}
                        onValueChange={(value) => setNewRestaurant((prev) => ({ ...prev, cuisine: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="american">American</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="mexican">Mexican</SelectItem>
                          <SelectItem value="indian">Indian</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                          <SelectItem value="thai">Thai</SelectItem>
                          <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restaurant-address">Address</Label>
                    <Input
                      id="restaurant-address"
                      value={newRestaurant.address}
                      onChange={(e) => setNewRestaurant((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main Street, City, State 12345"
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-phone">Phone Number</Label>
                      <Input
                        id="restaurant-phone"
                        value={newRestaurant.phone}
                        onChange={(e) => setNewRestaurant((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-range">Price Range</Label>
                      <Select
                        value={newRestaurant.priceRange}
                        onValueChange={(value) => setNewRestaurant((prev) => ({ ...prev, priceRange: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$">$ - Budget Friendly</SelectItem>
                          <SelectItem value="$$">$$ - Moderate</SelectItem>
                          <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                          <SelectItem value="$$$$">$$$$ - Very Expensive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restaurant-description">Description</Label>
                    <Textarea
                      id="restaurant-description"
                      value={newRestaurant.description}
                      onChange={(e) => setNewRestaurant((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your restaurant..."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="delivery-fee">Delivery Fee ($)</Label>
                      <Input
                        id="delivery-fee"
                        type="number"
                        step="0.01"
                        value={newRestaurant.deliveryFee}
                        onChange={(e) => setNewRestaurant((prev) => ({ ...prev, deliveryFee: e.target.value }))}
                        placeholder="2.99"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimum-order">Minimum Order ($)</Label>
                      <Input
                        id="minimum-order"
                        type="number"
                        step="0.01"
                        value={newRestaurant.minimumOrder}
                        onChange={(e) => setNewRestaurant((prev) => ({ ...prev, minimumOrder: e.target.value }))}
                        placeholder="15.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prep-time">Prep Time (mins)</Label>
                      <Input
                        id="prep-time"
                        type="number"
                        value={newRestaurant.preparationTime}
                        onChange={(e) => setNewRestaurant((prev) => ({ ...prev, preparationTime: e.target.value }))}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Operating Hours</Label>
                    {Object.entries(newRestaurant.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-20">
                          <Label className="capitalize">{day}</Label>
                        </div>
                        <Switch
                          checked={!hours.closed}
                          onCheckedChange={(checked) =>
                            setNewRestaurant((prev) => ({
                              ...prev,
                              operatingHours: {
                                ...prev.operatingHours,
                                [day]: { ...hours, closed: !checked },
                              },
                            }))
                          }
                        />
                        {!hours.closed && (
                          <>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                setNewRestaurant((prev) => ({
                                  ...prev,
                                  operatingHours: {
                                    ...prev.operatingHours,
                                    [day]: { ...hours, open: e.target.value },
                                  },
                                }))
                              }
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                setNewRestaurant((prev) => ({
                                  ...prev,
                                  operatingHours: {
                                    ...prev.operatingHours,
                                    [day]: { ...hours, close: e.target.value },
                                  },
                                }))
                              }
                              className="w-32"
                            />
                          </>
                        )}
                        {hours.closed && <span className="text-gray-500">Closed</span>}
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full">
                    Add Restaurant
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className={`border-l-4 ${
                  restaurant.id === selectedRestaurant.id
                    ? "border-l-green-500 bg-green-50 dark:bg-green-900/10"
                    : "border-l-gray-300"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                        <Badge className={getStatusColor(restaurant.status)}>
                          {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">{restaurant.type}</Badge>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{restaurant.rating}/5.0 Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>{restaurant.totalOrders.toLocaleString()} Orders</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditRestaurant(restaurant)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Restaurant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
            <DialogDescription>Update your restaurant information</DialogDescription>
          </DialogHeader>
          {editingRestaurant && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateRestaurant()
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Restaurant Name</Label>
                  <Input id="edit-name" defaultValue={editingRestaurant.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Cuisine Type</Label>
                  <Input id="edit-type" defaultValue={editingRestaurant.type} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" defaultValue={editingRestaurant.address} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" defaultValue={editingRestaurant.phone} />
              </div>
              <Button type="submit" className="w-full">
                Update Restaurant
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
