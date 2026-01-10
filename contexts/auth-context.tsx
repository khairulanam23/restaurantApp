"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type UserRole = "customer" | "rider" | "restaurant" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - replace with actual API call
      if (email === "admin@example.com" && password === "admin@1234") {
        const adminUser: User = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
        }
        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))
        return true
      }

      // Mock other users for demo - role is determined by backend based on email
      const mockUsers: Record<string, User> = {
        "customer@example.com": {
          id: "2",
          email: "customer@example.com",
          name: "John Customer",
          role: "customer",
        },
        "rider@example.com": {
          id: "3",
          email: "rider@example.com",
          name: "Mike Rider",
          role: "rider",
        },
        "restaurant@example.com": {
          id: "4",
          email: "restaurant@example.com",
          name: "Restaurant Owner",
          role: "restaurant",
        },
      }

      if (mockUsers[email] && password === "password") {
        const mockUser = mockUsers[email]
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    try {
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
