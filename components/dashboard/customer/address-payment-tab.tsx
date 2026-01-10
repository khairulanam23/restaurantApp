"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEnhancedToast } from "@/components/notifications/enhanced-toast"
import { Plus, MapPin, CreditCard, Edit, Trash2, Home, Building, MapIcon } from "lucide-react"

const mockAddresses = [
  {
    id: "1",
    type: "home",
    label: "Home",
    address: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    label: "Work",
    address: "456 Business Ave, Floor 12",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
  },
]

const mockPaymentMethods = [
  {
    id: "1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
]

export function AddressPaymentTab() {
  const [addresses, setAddresses] = useState(mockAddresses)
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const { showToast } = useEnhancedToast()

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />
      case "work":
        return <Building className="h-4 w-4" />
      default:
        return <MapIcon className="h-4 w-4" />
    }
  }

  const getCardBrandColor = (brand: string) => {
    switch (brand) {
      case "visa":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "mastercard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "amex":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleAddAddress = () => {
    showToast({
      type: "success",
      title: "Address added",
      description: "Your new address has been saved successfully.",
    })
    setIsAddressDialogOpen(false)
  }

  const handleAddPaymentMethod = () => {
    showToast({
      type: "success",
      title: "Payment method added",
      description: "Your new payment method has been saved successfully.",
    })
    setIsPaymentDialogOpen(false)
  }

  const handleEditAddress = (addressId: string) => {
    console.log("[v0] Editing address:", addressId)
    showToast({
      type: "info",
      title: "Edit Address",
      description: "Address editing functionality will be available soon.",
    })
  }

  const handleDeleteAddress = (addressId: string) => {
    console.log("[v0] Deleting address:", addressId)
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
      showToast({
        type: "success",
        title: "Address deleted",
        description: "Your address has been removed successfully.",
      })
    }
  }

  const handleEditPaymentMethod = (paymentId: string) => {
    console.log("Editing payment method:", paymentId)
    showToast({
      type: "info",
      title: "Edit Payment Method",
      description: "Payment method editing functionality will be available soon.",
    })
  }

  const handleDeletePaymentMethod = (paymentId: string) => {
    console.log("[v0] Deleting payment method:", paymentId)
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== paymentId))
      showToast({
        type: "success",
        title: "Payment method deleted",
        description: "Your payment method has been removed successfully.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Addresses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Addresses
              </CardTitle>
              <CardDescription>Manage your saved delivery addresses</CardDescription>
            </div>
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                  <DialogDescription>Add a new delivery address to your account</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddAddress()
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="address-type">Address Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select address type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-label">Label</Label>
                    <Input id="address-label" placeholder="e.g., Home, Work, Mom's House" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street-address">Street Address</Label>
                    <Input id="street-address" placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip-code">ZIP Code</Label>
                    <Input id="zip-code" placeholder="10001" />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Add Address
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAddressIcon(address.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{address.label}</h3>
                          {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{address.address}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditAddress(address.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </div>
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>Add a new credit or debit card</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddPaymentMethod()
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardholder-name">Cardholder Name</Label>
                    <Input id="cardholder-name" placeholder="John Doe" />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Add Payment Method
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getCardBrandColor(method.brand)}>{method.brand.toUpperCase()}</Badge>
                          <span className="font-medium">•••• {method.last4}</span>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditPaymentMethod(method.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletePaymentMethod(method.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
