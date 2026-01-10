"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, Upload } from "lucide-react"

interface RestaurantFormData {
  name: string
  description: string
  address: string
  phone: string
  cuisine: string[]
  minimumOrder: number
  deliveryFee: number
  image: string
}

export function RestaurantOnboarding() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    description: "",
    address: "",
    phone: "",
    cuisine: [],
    minimumOrder: 15,
    deliveryFee: 2.99,
    image: "",
  })
  const [newCuisine, setNewCuisine] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof RestaurantFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addCuisine = () => {
    if (newCuisine.trim() && !formData.cuisine.includes(newCuisine.trim())) {
      setFormData((prev) => ({
        ...prev,
        cuisine: [...prev.cuisine, newCuisine.trim()],
      }))
      setNewCuisine("")
    }
  }

  const removeCuisine = (cuisine: string) => {
    setFormData((prev) => ({
      ...prev,
      cuisine: prev.cuisine.filter((c) => c !== cuisine),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Restaurant Registered!",
        description: "Your restaurant has been successfully registered and is pending approval.",
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        address: "",
        phone: "",
        cuisine: [],
        minimumOrder: 15,
        deliveryFee: 2.99,
        image: "",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering your restaurant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-green-600">Register Your Restaurant</CardTitle>
          <CardDescription>
            Fill out the information below to get your restaurant listed on our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter restaurant name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your restaurant and cuisine"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                required
              />
            </div>

            <div>
              <Label>Cuisine Types *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCuisine}
                  onChange={(e) => setNewCuisine(e.target.value)}
                  placeholder="e.g., Italian, Chinese, Mexican"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCuisine())}
                />
                <Button type="button" onClick={addCuisine} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cuisine.map((cuisine) => (
                  <Badge key={cuisine} variant="secondary" className="flex items-center gap-1">
                    {cuisine}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCuisine(cuisine)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minimumOrder">Minimum Order ($)</Label>
                <Input
                  id="minimumOrder"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimumOrder}
                  onChange={(e) => handleInputChange("minimumOrder", Number.parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={(e) => handleInputChange("deliveryFee", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Restaurant Image</Label>
              <div className="mt-2 flex items-center gap-4">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <span className="text-sm text-muted-foreground">Upload a high-quality image of your restaurant</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || !formData.name || !formData.description || formData.cuisine.length === 0}
            >
              {isSubmitting ? "Registering..." : "Register Restaurant"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
