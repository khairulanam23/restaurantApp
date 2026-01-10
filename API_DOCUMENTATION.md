# API Documentation

## Authentication Endpoints

### POST /api/auth/login
Login user with email and password.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "customer",
    "name": "John Doe"
  },
  "token": "jwt_token"
}
\`\`\`

### POST /api/auth/register
Register new user.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
\`\`\`

## Order Management

### GET /api/orders
Get user orders with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by order status
- `restaurant`: Filter by restaurant ID

### POST /api/orders
Create new order.

**Request Body:**
\`\`\`json
{
  "restaurantId": "restaurant_id",
  "items": [
    {
      "id": "item_id",
      "quantity": 2,
      "price": 12.99
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "City",
    "zipCode": "12345"
  },
  "paymentMethod": "card"
}
\`\`\`

### PUT /api/orders/[id]
Update order status (riders and restaurants).

**Request Body:**
\`\`\`json
{
  "status": "preparing",
  "estimatedTime": 30
}
\`\`\`

## Restaurant Management

### GET /api/restaurants
Get restaurants with filtering and search.

**Query Parameters:**
- `search`: Search term
- `cuisine`: Filter by cuisine type
- `rating`: Minimum rating
- `delivery`: Delivery availability

### POST /api/restaurants
Create new restaurant (restaurant owners).

### PUT /api/restaurants/[id]
Update restaurant information.

### GET /api/restaurants/[id]/menu
Get restaurant menu items.

### POST /api/restaurants/[id]/menu
Add menu item.

## User Management (Admin)

### GET /api/admin/users
Get all users with pagination.

### PUT /api/admin/users/[id]
Update user status or role.

### GET /api/admin/analytics
Get platform analytics data.

## Support Chat

### GET /api/support/conversations
Get support conversations.

### POST /api/support/conversations
Create new support conversation.

### POST /api/support/conversations/[id]/messages
Send message in conversation.

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
\`\`\`

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
