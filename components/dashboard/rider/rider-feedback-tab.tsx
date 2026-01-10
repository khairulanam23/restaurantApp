"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MessageSquare, ThumbsUp, AlertCircle, TrendingUp } from "lucide-react"

const mockFeedback = [
  {
    id: "1",
    orderId: "ORD-456",
    type: "customer",
    from: "John Doe",
    rating: 5,
    comment: "Super fast delivery! The food was still hot when it arrived. Great job!",
    date: "2024-01-15T18:45:00Z",
    response: null,
  },
  {
    id: "2",
    orderId: "ORD-457",
    type: "customer",
    from: "Sarah Miller",
    rating: 4,
    comment: "Good delivery, but had trouble finding the apartment. Maybe call next time?",
    date: "2024-01-14T19:50:00Z",
    response: "Thank you for the feedback! I'll make sure to call for apartment deliveries in the future.",
  },
  {
    id: "3",
    orderId: "ORD-458",
    type: "restaurant",
    from: "Pizza Palace Manager",
    rating: 5,
    comment: "Always professional and on time. One of our best delivery partners!",
    date: "2024-01-12T20:30:00Z",
    response: "Thank you! I really appreciate working with your team.",
  },
  {
    id: "4",
    orderId: "ORD-459",
    type: "customer",
    from: "Mike Johnson",
    rating: 3,
    comment: "Delivery was late and the food was cold. Not sure if it was the restaurant or delivery issue.",
    date: "2024-01-10T19:15:00Z",
    response: null,
  },
]

export function RiderFeedbackTab() {
  const [feedback, setFeedback] = useState(mockFeedback)
  const [filterType, setFilterType] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [responseText, setResponseText] = useState("")
  const [respondingTo, setRespondingTo] = useState<string | null>(null)

  const filteredFeedback = feedback.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType
    const matchesRating = filterRating === "all" || item.rating.toString() === filterRating
    return matchesType && matchesRating
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "restaurant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const handleSubmitResponse = (feedbackId: string) => {
    setFeedback((prev) => prev.map((item) => (item.id === feedbackId ? { ...item, response: responseText } : item)))
    setResponseText("")
    setRespondingTo(null)
  }

  // Calculate stats
  const averageRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
  const customerFeedback = feedback.filter((item) => item.type === "customer")
  const restaurantFeedback = feedback.filter((item) => item.type === "restaurant")
  const recentFeedback = feedback.filter((item) => new Date(item.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold">{feedback.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Reviews</p>
                <p className="text-2xl font-bold">{customerFeedback.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold">{recentFeedback.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer & Restaurant Feedback
              </CardTitle>
              <CardDescription>Reviews and ratings from customers and restaurant partners</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Feedback</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="restaurant">Restaurants</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredFeedback.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{item.from}</h3>
                          <Badge className={getTypeColor(item.type)}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                          <Badge variant="outline">Order #{item.orderId}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(item.rating)}
                          <span className={`font-medium ${getRatingColor(item.rating)}`}>{item.rating}/5</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(item.date)}</span>
                        </div>
                      </div>
                      {item.rating <= 3 && !item.response && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" title="Needs attention" />
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">{item.comment}</p>

                    {item.response ? (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Your Response:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.response}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {respondingTo === item.id ? (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Write your response..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSubmitResponse(item.id)}>
                                Submit Response
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setRespondingTo(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRespondingTo(item.id)}
                            className="bg-transparent"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Respond
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFeedback.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No feedback found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
