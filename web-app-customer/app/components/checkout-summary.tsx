"use client"

import { formatCurrency } from "@/app/lib/utils"

interface CheckoutSummaryProps {
  subtotal: number
  tax: number
  serviceCharge: number
  total: number
}

export default function CheckoutSummary({ subtotal, tax, serviceCharge, total }: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Service Charge (18%)</span>
          <span>{formatCurrency(serviceCharge)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-amber-600">{formatCurrency(total)}</span>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-700">
          <span className="font-semibold">Estimated Time:</span> 30 minutes
        </p>
      </div>
    </div>
  )
}
