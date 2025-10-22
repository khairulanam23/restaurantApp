"use client"

import { useEffect, useState } from "react"
import { restaurantStore } from "@/app/lib/store"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<"light" | "dark">("light")

  useEffect(() => {
    setMounted(true)
    const currentTheme = restaurantStore.getTheme()
    setThemeState(currentTheme)
    // Apply theme on mount
    const root = document.documentElement
    if (currentTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

  if (!mounted) return null

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setThemeState(newTheme)
    restaurantStore.setTheme(newTheme)
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  )
}
