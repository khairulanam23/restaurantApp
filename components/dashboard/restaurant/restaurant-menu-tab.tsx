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
import { Plus, Edit, Trash2, Menu, DollarSign, Clock, AlertCircle } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  preparationTime: number
  image?: string
  allergens: string[]
  popular: boolean
}

interface MenuCategory {
  id: string
  name: string
  description: string
  items: MenuItem[]
}

const mockMenuData: MenuCategory[] = [
  {
    id: "1",
    name: "Pizzas",
    description: "Our signature wood-fired pizzas",
    items: [
      {
        id: "1",
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, basil, olive oil",
        price: 18.99,
        category: "Pizzas",
        available: true,
        preparationTime: 15,
        allergens: ["gluten", "dairy"],
        popular: true,
      },
      {
        id: "2",
        name: "Pepperoni Pizza",
        description: "Pepperoni, mozzarella cheese, tomato sauce",
        price: 21.99,
        category: "Pizzas",
        available: true,
        preparationTime: 15,
        allergens: ["gluten", "dairy"],
        popular: true,
      },
    ],
  },
  {
    id: "2",
    name: "Appetizers",
    description: "Start your meal right",
    items: [
      {
        id: "3",
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter and herbs",
        price: 8.99,
        category: "Appetizers",
        available: true,
        preparationTime: 8,
        allergens: ["gluten", "dairy"],
        popular: false,
      },
      {
        id: "4",
        name: "Caesar Salad",
        description: "Romaine lettuce, parmesan, croutons, caesar dressing",
        price: 12.99,
        category: "Appetizers",
        available: false,
        preparationTime: 5,
        allergens: ["dairy", "eggs"],
        popular: false,
      },
    ],
  },
]

interface RestaurantMenuTabProps {
  restaurant: { id: string; name: string }
}

export function RestaurantMenuTab({ restaurant }: RestaurantMenuTabProps) {
  const [menuData, setMenuData] = useState(mockMenuData)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
    allergens: [] as string[],
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  const handleAddItem = () => {
    toast({
      title: "Menu item added",
      description: `${newItem.name} has been added to your menu.`,
    })
    setIsAddItemDialogOpen(false)
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
      preparationTime: "",
      allergens: [],
    })
  }

  const handleAddCategory = () => {
    toast({
      title: "Category added",
      description: `${newCategory.name} category has been added to your menu.`,
    })
    setIsAddCategoryDialogOpen(false)
    setNewCategory({ name: "", description: "" })
  }

  const handleToggleAvailability = (categoryId: string, itemId: string) => {
    setMenuData((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, available: !item.available } : item,
              ),
            }
          : category,
      ),
    )
    toast({
      title: "Availability updated",
      description: "Menu item availability has been updated.",
    })
  }

  const handleEditMenuItem = (categoryId: string, itemId: string) => {
    console.log("[v0] Editing menu item:", itemId, "in category:", categoryId)
    const category = menuData.find((c) => c.id === categoryId)
    const item = category?.items.find((i) => i.id === itemId)
    if (item) {
      setEditingItem(item)
      setIsAddItemDialogOpen(true)
      toast({
        title: "Edit Menu Item",
        description: "Menu item editing functionality will be available soon.",
      })
    }
  }

  const handleDeleteMenuItem = (categoryId: string, itemId: string) => {
    console.log("[v0] Deleting menu item:", itemId, "from category:", categoryId)
    if (confirm("Are you sure you want to delete this menu item?")) {
      setMenuData((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? { ...category, items: category.items.filter((item) => item.id !== itemId) }
            : category,
        ),
      )
      toast({
        title: "Menu item deleted",
        description: "The menu item has been removed successfully.",
      })
    }
  }

  const totalItems = menuData.reduce((sum, category) => sum + category.items.length, 0)
  const availableItems = menuData.reduce(
    (sum, category) => sum + category.items.filter((item) => item.available).length,
    0,
  )
  const popularItems = menuData.reduce((sum, category) => sum + category.items.filter((item) => item.popular).length, 0)

  return (
    <div className="space-y-6">
      {/* Menu Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Menu className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold">{availableItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold">{menuData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Popular</p>
                <p className="text-2xl font-bold">{popularItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                Menu Management - {restaurant.name}
              </CardTitle>
              <CardDescription>Manage your restaurant menu items and categories</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Menu Category</DialogTitle>
                    <DialogDescription>Create a new category for your menu items</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddCategory()
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="category-name">Category Name</Label>
                      <Input
                        id="category-name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Desserts, Beverages"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-description">Description</Label>
                      <Textarea
                        id="category-description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this category"
                        rows={2}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Category
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Menu Item</DialogTitle>
                    <DialogDescription>Add a new item to your menu</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddItem()
                    }}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input
                          id="item-name"
                          value={newItem.name}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Margherita Pizza"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item-category">Category</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {menuData.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item-description">Description</Label>
                      <Textarea
                        id="item-description"
                        value={newItem.description}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your menu item..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="item-price">Price ($)</Label>
                        <Input
                          id="item-price"
                          type="number"
                          step="0.01"
                          value={newItem.price}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="18.99"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prep-time">Preparation Time (mins)</Label>
                        <Input
                          id="prep-time"
                          type="number"
                          value={newItem.preparationTime}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, preparationTime: e.target.value }))}
                          placeholder="15"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Allergens</Label>
                      <div className="flex flex-wrap gap-2">
                        {["gluten", "dairy", "nuts", "eggs", "soy", "shellfish"].map((allergen) => (
                          <div key={allergen} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={allergen}
                              checked={newItem.allergens.includes(allergen)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewItem((prev) => ({ ...prev, allergens: [...prev.allergens, allergen] }))
                                } else {
                                  setNewItem((prev) => ({
                                    ...prev,
                                    allergens: prev.allergens.filter((a) => a !== allergen),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={allergen} className="capitalize">
                              {allergen}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Add Menu Item
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {menuData.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  </div>
                  <Badge variant="outline">{category.items.length} items</Badge>
                </div>

                <div className="grid gap-4">
                  {category.items.map((item) => (
                    <Card key={item.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{item.name}</h4>
                              {item.popular && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  Popular
                                </Badge>
                              )}
                              <Badge
                                variant={item.available ? "default" : "secondary"}
                                className={
                                  item.available
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }
                              >
                                {item.available ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.preparationTime} mins
                              </span>
                              {item.allergens.length > 0 && (
                                <span className="text-orange-600">Allergens: {item.allergens.join(", ")}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={item.available}
                              onCheckedChange={() => handleToggleAvailability(category.id, item.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMenuItem(category.id, item.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMenuItem(category.id, item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
