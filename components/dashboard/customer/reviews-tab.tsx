"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Star, MessageSquare, ThumbsUp, Edit } from "lucide-react"

const mockReviews = [
  {
    id: "1",
    orderId: "ORD-001",
    restaurant: "Pizza Palace",
    rating: 5,
    comment: "Amazing pizza! The delivery was quick and the food was still hot. Definitely ordering again!",
    date: "2024-01-15T18:30:00Z",
    helpful: 12,
    response: "Thank you for the wonderful review! We're glad you enjoyed your pizza.",
  },
  {
    id: "2",
    orderId: "ORD-002",
    restaurant: "Burger House",
    rating: 4,
    comment: "Good burgers, but the fries were a bit cold. Overall satisfied with the order.",
    date: "2024-01-14T19:45:00Z",
    helpful: 8,
    response: null,
  },
]

const pendingReviews = [
  {
    id: "ORD-003",
    restaurant: "Sushi Express",
    items: ["California Roll", "Salmon Nigiri", "Miso Soup"],
    total: 32.0,
    date: "2024-01-12T20:15:00Z",
  },
]

export function ReviewsTab() {
  const [reviews, setReviews] = useState(mockReviews)
  const [selectedRating, setSelectedRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const { toast } = useToast()

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    )
  }

  const handleSubmitReview = () => {
    if (selectedRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    // Add the new review to the list
    const newReview = {
      id: Date.now().toString(),
      orderId: pendingReviews[0]?.id || "ORD-NEW",
      restaurant: pendingReviews[0]?.restaurant || "Restaurant",
      rating: selectedRating,
      comment: reviewComment,
      date: new Date().toISOString(),
      helpful: 0,
      response: null,
    }

    setReviews((prev) => [newReview, ...prev])

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback! Your review has been posted.",
    })

    setIsReviewDialogOpen(false)
    setSelectedRating(0)
    setReviewComment("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pending Reviews
            </CardTitle>
            <CardDescription>Orders waiting for your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReviews.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{order.restaurant}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.items.join(", ")}</p>
                        <p className="text-xs text-gray-500">
                          Ordered on {formatDate(order.date)} • ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Star className="h-4 w-4 mr-2" />
                            Write Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rate Your Order</DialogTitle>
                            <DialogDescription>How was your experience with {order.restaurant}?</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Rating</label>
                              {renderStars(selectedRating, true, setSelectedRating)}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Review (Optional)</label>
                              <Textarea
                                placeholder="Share your experience with other customers..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <Button onClick={handleSubmitReview} className="w-full">
                              Submit Review
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            My Reviews
          </CardTitle>
          <CardDescription>Reviews you've written for past orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{review.restaurant}</h3>
                          <Badge variant="outline">Order #{review.orderId}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(review.date)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>

                    {review.response && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Response from {review.restaurant}:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{review.response}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100">
                        <ThumbsUp className="h-4 w-4" />
                        {review.helpful} people found this helpful
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Your reviews will appear here after you rate your orders.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
