"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface EnhancedToastProps {
  type?: "success" | "error" | "info" | "warning"
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

export function useEnhancedToast() {
  const { toast } = useToast()

  const showToast = ({ type = "info", title, description, action, persistent = false }: EnhancedToastProps) => {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      info: Info,
      warning: AlertCircle,
    }

    const colors = {
      success: "text-green-600",
      error: "text-red-600",
      info: "text-blue-600",
      warning: "text-yellow-600",
    }

    const Icon = icons[type]

    toast({
      title: (
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${colors[type]}`} />
          {title}
        </div>
      ),
      description,
      action: action ? (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : undefined,
      duration: persistent ? Number.POSITIVE_INFINITY : 5000,
    })
  }

  const showOrderNotification = (orderId: string, status: string, message: string) => {
    showToast({
      type: "success",
      title: `Order #${orderId.slice(-6)} Updated`,
      description: message,
      action: {
        label: "View Order",
        onClick: () => window.open(`/orders/${orderId}`, "_blank"),
      },
    })
  }

  const showErrorNotification = (title: string, description?: string, retry?: () => void) => {
    showToast({
      type: "error",
      title,
      description,
      action: retry
        ? {
            label: "Retry",
            onClick: retry,
          }
        : undefined,
      persistent: true,
    })
  }

  return {
    showToast,
    showOrderNotification,
    showErrorNotification,
  }
}
