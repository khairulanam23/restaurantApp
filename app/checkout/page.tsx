"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { mockRestaurants } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { MapPin, CreditCard, Wallet, DollarSign } from "lucide-react"

interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "cash"
  label: string
  details?: string
  isDefault: boolean
}

const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "2",
    label: "Work",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
  },
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "card",
    label: "Credit Card",
    details: "**** **** **** 1234",
    isDefault: true,
  },
  {
    id: "2",
    type: "paypal",
    label: "PayPal",
    details: "user@example.com",
    isDefault: false,
  },
  {
    id: "3",
    type: "cash",
    label: "Cash on Delivery",
    isDefault: false,
  },
]

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0]?.id || "")
  const [selectedPayment, setSelectedPayment] = useState(mockPaymentMethods[0]?.id || "")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const restaurant = cartState.restaurantId ? mockRestaurants.find((r) => r.id === cartState.restaurantId) : null

  const subtotal = cartState.totalAmount
  const deliveryFee = restaurant?.deliveryFee || 0
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (cartState.items.length === 0) {
    router.push("/cart")
    return null
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create order object
      const order = {
        id: `order_${Date.now()}`,
        customerId: user.id,
        restaurantId: cartState.restaurantId,
        items: cartState.items,
        status: "pending" as const,
        totalAmount: total,
        deliveryFee,
        deliveryAddress: mockAddresses.find((a) => a.id === selectedAddress)?.street || "",
        customerPhone: user.phone || "",
        specialInstructions: specialInstructions || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Clear cart
      clearCart()

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.slice(-6)} has been placed and is being prepared.`,
      })

      // Redirect to order tracking
      router.push(`/orders/${order.id}`)
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {mockAddresses.map((address) => (
                      <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{address.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button variant="outline" className="mt-4 bg-transparent" size="sm">
                    Add New Address
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                    {mockPaymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            {method.type === "card" && <CreditCard className="h-4 w-4" />}
                            {method.type === "paypal" && <Wallet className="h-4 w-4" />}
                            {method.type === "cash" && <DollarSign className="h-4 w-4" />}
                            <span className="font-medium">{method.label}</span>
                          </div>
                          {method.details && <div className="text-sm text-muted-foreground">{method.details}</div>}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button variant="outline" className="mt-4 bg-transparent" size="sm">
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for the restaurant or delivery..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {restaurant && (
                    <div className="text-sm">
                      <div className="font-medium">{restaurant.name}</div>
                      <div className="text-muted-foreground">Estimated delivery: {restaurant.deliveryTime}</div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !selectedAddress || !selectedPayment}
                  >
                    {isPlacingOrder ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
