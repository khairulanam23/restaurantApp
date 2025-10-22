"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { validateTableNumber } from "@/app/lib/types"

interface TableEntryFormProps {
  onSubmit: (tableNumber: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export default function TableEntryForm({ onSubmit, isLoading, error }: TableEntryFormProps) {
  const [tableNumber, setTableNumber] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const validation = validateTableNumber(tableNumber)
    if (!validation.valid) {
      setValidationError(validation.error || "Invalid input")
      return
    }

    try {
      await onSubmit(tableNumber)
    } catch (err) {
      console.error("Form submission error:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="table-number" className="block text-sm font-medium text-foreground mb-2">
          Table Number
        </label>
        <Input
          id="table-number"
          type="text"
          placeholder="Enter your table number"
          disabled={isLoading}
          className="text-lg py-3"
          autoFocus
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          aria-invalid={!!validationError || !!error}
          aria-describedby={validationError || error ? "error-message" : undefined}
        />
        {(validationError || error) && (
          <p id="error-message" className="text-sm text-destructive mt-1">
            {validationError || error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        aria-busy={isLoading}
      >
        {isLoading ? "Validating..." : "Start Ordering"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your table number helps us deliver your order to the right place
      </p>
    </form>
  )
}
