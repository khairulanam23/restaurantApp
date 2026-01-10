"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSupportChat } from "@/contexts/support-chat-context"
import { useAuth } from "@/contexts/auth-context"
import { Send, Clock, User, X, MessageCircle } from "lucide-react"

export function AdminChatDashboard() {
  const { user } = useAuth()
  const { activeSessions, selectedSession, selectSession, sendAdminMessage, closeSession } = useSupportChat()

  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedSession?.messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && selectedSession) {
      sendAdminMessage(selectedSession.id, message.trim())
      setMessage("")
    }
  }

  // Only show for admin
  if (!user || user.role !== "admin") {
    return null
  }

  const unreadCount = (session: any) =>
    session.messages.filter((msg: any) => !msg.isRead && msg.senderRole === "customer").length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Sessions List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Active Chats ({activeSessions.filter((s) => s.status === "active").length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {activeSessions
              .filter((s) => s.status === "active")
              .map((session) => (
                <div
                  key={session.id}
                  onClick={() => selectSession(session.id)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedSession?.id === session.id
                      ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{session.customerName}</h4>
                    {unreadCount(session) > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount(session)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.messages[session.messages.length - 1]?.content || "No messages"}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {session.lastActivity.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            {activeSessions.filter((s) => s.status === "active").length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active chat sessions</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2">
        {selectedSession ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{selectedSession.customerName}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Started {selectedSession.createdAt.toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => closeSession(selectedSession.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Close Chat
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col h-[450px] p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedSession.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.senderRole === "admin"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderRole === "admin" ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {msg.senderName} •{" "}
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[500px]">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Select a chat session</p>
              <p>Choose a customer from the list to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
