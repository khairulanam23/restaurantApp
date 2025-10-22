"use client"

import type { Order } from "@/app/lib/types"

interface OrderStatusTimelineProps {
  status: Order["status"]
}

export default function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const statuses: Array<{ key: Order["status"]; label: string; icon: string }> = [
    { key: "received", label: "Order Received", icon: "✓" },
    { key: "preparing", label: "Being Prepared", icon: "👨‍🍳" },
    { key: "ready", label: "Ready for Pickup", icon: "✓" },
    { key: "completed", label: "Completed", icon: "✓" },
  ]

  const currentIndex = statuses.findIndex((s) => s.key === status)

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>

      <div className="space-y-4">
        {statuses.map((s, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={s.key} className="flex items-center gap-4">
              {/* Status Circle */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-amber-500 text-white animate-pulse"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {s.icon}
              </div>

              {/* Status Label */}
              <div className="flex-1">
                <p className={`font-semibold ${isCompleted ? "text-gray-900" : "text-gray-500"}`}>{s.label}</p>
              </div>

              {/* Connector Line */}
              {index < statuses.length - 1 && (
                <div
                  className={`absolute left-6 top-20 w-1 h-12 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                  style={{ marginLeft: "20px" }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
