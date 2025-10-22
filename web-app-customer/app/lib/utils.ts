export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function calculateTax(subtotal: number, taxRate = 0.08): number {
  return Math.round(subtotal * taxRate * 100) / 100
}

export function calculateServiceCharge(subtotal: number, rate = 0.18): number {
  return Math.round(subtotal * rate * 100) / 100
}

export function generateOrderNumber(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function calculateOrderTotal(
  subtotal: number,
  taxRate = 0.08,
  serviceRate = 0.18,
): {
  tax: number
  serviceCharge: number
  total: number
} {
  const tax = calculateTax(subtotal, taxRate)
  const serviceCharge = calculateServiceCharge(subtotal, serviceRate)
  return {
    tax,
    serviceCharge,
    total: subtotal + tax + serviceCharge,
  }
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    received: "Order Received",
    preparing: "Being Prepared",
    ready: "Ready for Pickup",
    completed: "Completed",
  }
  return labels[status] || status
}
