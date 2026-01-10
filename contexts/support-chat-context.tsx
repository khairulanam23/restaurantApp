"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "customer" | "admin"
  content: string
  timestamp: Date
  isRead: boolean
}

interface ChatSession {
  id: string
  customerId: string
  customerName: string
  status: "active" | "closed"
  messages: Message[]
  createdAt: Date
  lastActivity: Date
}

interface SupportChatContextType {
  // Customer functions
  sendMessage: (content: string) => void
  customerMessages: Message[]
  isChatOpen: boolean
  openChat: () => void
  closeChat: () => void

  // Admin functions
  activeSessions: ChatSession[]
  selectedSession: ChatSession | null
  selectSession: (sessionId: string) => void
  sendAdminMessage: (sessionId: string, content: string) => void
  closeSession: (sessionId: string) => void

  // Shared
  isLoading: boolean
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined)

export function SupportChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [customerMessages, setCustomerMessages] = useState<Message[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demo
  useEffect(() => {
    if (user?.role === "admin") {
      // Load mock chat sessions for admin
      const mockSessions: ChatSession[] = [
        {
          id: "session-1",
          customerId: "customer-1",
          customerName: "John Doe",
          status: "active",
          createdAt: new Date(Date.now() - 3600000),
          lastActivity: new Date(Date.now() - 300000),
          messages: [
            {
              id: "msg-1",
              senderId: "customer-1",
              senderName: "John Doe",
              senderRole: "customer",
              content: "Hi, I have an issue with my recent order. It was delivered to the wrong address.",
              timestamp: new Date(Date.now() - 3600000),
              isRead: true,
            },
            {
              id: "msg-2",
              senderId: "admin-1",
              senderName: "Support Team",
              senderRole: "admin",
              content:
                "Hello John! I'm sorry to hear about the delivery issue. Let me help you with that. Can you please provide your order number?",
              timestamp: new Date(Date.now() - 3500000),
              isRead: true,
            },
            {
              id: "msg-3",
              senderId: "customer-1",
              senderName: "John Doe",
              senderRole: "customer",
              content: "Sure, my order number is #ORD-2024-001. I ordered from Mario's Pizza.",
              timestamp: new Date(Date.now() - 300000),
              isRead: false,
            },
          ],
        },
        {
          id: "session-2",
          customerId: "customer-2",
          customerName: "Sarah Wilson",
          status: "active",
          createdAt: new Date(Date.now() - 1800000),
          lastActivity: new Date(Date.now() - 600000),
          messages: [
            {
              id: "msg-4",
              senderId: "customer-2",
              senderName: "Sarah Wilson",
              senderRole: "customer",
              content: "Hello, I'm having trouble with the payment method. My card keeps getting declined.",
              timestamp: new Date(Date.now() - 1800000),
              isRead: true,
            },
            {
              id: "msg-5",
              senderId: "admin-1",
              senderName: "Support Team",
              senderRole: "admin",
              content:
                "Hi Sarah! I can help you with payment issues. Have you tried using a different card or payment method?",
              timestamp: new Date(Date.now() - 600000),
              isRead: true,
            },
          ],
        },
      ]
      setActiveSessions(mockSessions)
    }
  }, [user])

  const sendMessage = (content: string) => {
    if (!user || user.role !== "customer") return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: "customer",
      content,
      timestamp: new Date(),
      isRead: false,
    }

    setCustomerMessages((prev) => [...prev, newMessage])

    // Simulate admin response after 2-5 seconds
    setTimeout(
      () => {
        const adminResponse: Message = {
          id: `msg-${Date.now()}-admin`,
          senderId: "admin-1",
          senderName: "Support Team",
          senderRole: "admin",
          content: "Thank you for contacting us! A support agent will be with you shortly to assist with your inquiry.",
          timestamp: new Date(),
          isRead: false,
        }
        setCustomerMessages((prev) => [...prev, adminResponse])
      },
      Math.random() * 3000 + 2000,
    )

    toast({
      title: "Message Sent",
      description: "Your message has been sent to our support team.",
    })
  }

  const sendAdminMessage = (sessionId: string, content: string) => {
    if (!user || user.role !== "admin") return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: "Support Team",
      senderRole: "admin",
      content,
      timestamp: new Date(),
      isRead: false,
    }

    setActiveSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              lastActivity: new Date(),
            }
          : session,
      ),
    )

    if (selectedSession?.id === sessionId) {
      setSelectedSession((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMessage],
              lastActivity: new Date(),
            }
          : null,
      )
    }

    toast({
      title: "Message Sent",
      description: "Your response has been sent to the customer.",
    })
  }

  const selectSession = (sessionId: string) => {
    const session = activeSessions.find((s) => s.id === sessionId)
    if (session) {
      setSelectedSession(session)
      // Mark messages as read
      setActiveSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: s.messages.map((m) => ({ ...m, isRead: true })) } : s)),
      )
    }
  }

  const closeSession = (sessionId: string) => {
    setActiveSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, status: "closed" as const } : session)),
    )

    if (selectedSession?.id === sessionId) {
      setSelectedSession(null)
    }

    toast({
      title: "Session Closed",
      description: "The chat session has been closed.",
    })
  }

  const openChat = () => {
    setIsChatOpen(true)
    if (customerMessages.length === 0) {
      // Send welcome message
      const welcomeMessage: Message = {
        id: "welcome-msg",
        senderId: "system",
        senderName: "Support Bot",
        senderRole: "admin",
        content: "Hello! Welcome to FoodDelivery support. How can we help you today?",
        timestamp: new Date(),
        isRead: false,
      }
      setCustomerMessages([welcomeMessage])
    }
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  return (
    <SupportChatContext.Provider
      value={{
        sendMessage,
        customerMessages,
        isChatOpen,
        openChat,
        closeChat,
        activeSessions,
        selectedSession,
        selectSession,
        sendAdminMessage,
        closeSession,
        isLoading,
      }}
    >
      {children}
    </SupportChatContext.Provider>
  )
}

export function useSupportChat() {
  const context = useContext(SupportChatContext)
  if (context === undefined) {
    throw new Error("useSupportChat must be used within a SupportChatProvider")
  }
  return context
}
