# Restaurant Management System - Backend

A comprehensive, production-ready backend system for restaurant management built with Node.js, Express.js, Sequelize ORM, and SQLite3.

## Features

### Core Functionality

- **User Management**: Role-based access control (Admin, Manager, Server, Kitchen Staff, Cashier)
- **Table Management**: Real-time table status tracking with occupancy management
- **Menu Management**: Time-based menu availability with category and item management
- **Order Management**: Complete order lifecycle from draft to payment
- **Payment Processing**: Multi-method payment support with refunds and split payments
- **Dashboard & Reporting**: Real-time statistics and comprehensive business reports
- **Audit Logging**: Complete audit trail for compliance and debugging

### Security Features

- JWT authentication with refresh tokens
- Role-based authorization (RBAC)
- Password hashing with bcryptjs
- Rate limiting and brute force protection
- SQL injection prevention via Sequelize parameterization
- XSS protection with input sanitization
- CORS and Helmet security headers

### Business Logic

- Time-based menu availability (breakfast, lunch, dinner, etc.)
- Order priority management
- Kitchen display system support
- Table turning optimization
- Split bill calculations
- Inventory tracking with daily sales limits
- Staff performance reporting
- Table performance analytics

## Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston
- **Password Hashing**: bcryptjs

## Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Setup

1. **Clone and install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit `.env` and update the following:

   - `JWT_SECRET`: Generate a strong secret (min 32 characters)
   - `JWT_REFRESH_SECRET`: Generate another strong secret
   - `PORT`: Server port (default: 3000)
   - `DB_PATH`: Database file location

3. **Initialize database and seed data**
   \`\`\`bash
   npm run migrate:seed
   \`\`\`

4. **Start the server**
   \`\`\`bash

   # Development (with auto-reload)

   npm run dev

   # Production

   npm start
   \`\`\`

The server will start on `http://localhost:3000`

## Default Credentials

After seeding, the following test accounts are available:

| Username | Email                  | Password       | Role          |
| -------- | ---------------------- | -------------- | ------------- |
| admin    | admin@restaurant.com   | Admin@123456   | Admin         |
| manager  | manager@restaurant.com | Manager@123456 | Manager       |
| server1  | server1@restaurant.com | Server@123456  | Server        |
| server2  | server2@restaurant.com | Server@123456  | Server        |
| kitchen  | kitchen@restaurant.com | Kitchen@123456 | Kitchen Staff |
| cashier  | cashier@restaurant.com | Cashier@123456 | Cashier       |

## API Documentation

### Authentication Endpoints

#### Register User

\`\`\`
POST /api/auth/register
Content-Type: application/json

{
"username": "newuser",
"email": "user@example.com",
"password": "SecurePass123",
"role": "server"
}
\`\`\`

#### Login

\`\`\`
POST /api/auth/login
Content-Type: application/json

{
"email": "admin@restaurant.com",
"password": "Admin@123456"
}

Response:
{
"success": true,
"data": {
"user": { ... },
"accessToken": "eyJhbGc...",
"refreshToken": "eyJhbGc..."
}
}
\`\`\`

#### Refresh Token

\`\`\`
POST /api/auth/refresh-token
Content-Type: application/json

{
"refreshToken": "eyJhbGc..."
}
\`\`\`

#### Logout

\`\`\`
POST /api/auth/logout
Authorization: Bearer <accessToken>
\`\`\`

### Table Management Endpoints

#### Get All Tables

\`\`\`
GET /api/tables
Authorization: Bearer <accessToken>
\`\`\`

#### Get Available Tables

\`\`\`
GET /api/tables/available
Authorization: Bearer <accessToken>
\`\`\`

#### Create Table

\`\`\`
POST /api/tables
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"tableNumber": 1,
"tableName": "Table 1",
"capacity": 4,
"location": "main_hall"
}
\`\`\`

#### Update Table Status

\`\`\`
PUT /api/tables/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"status": "occupied"
}
\`\`\`

### Menu Management Endpoints

#### Get All Categories

\`\`\`
GET /api/menu/categories
Authorization: Bearer <accessToken>
\`\`\`

#### Get Active Categories (time-based)

\`\`\`
GET /api/menu/categories/active
Authorization: Bearer <accessToken>
\`\`\`

#### Get Menu Items

\`\`\`
GET /api/menu/items?categoryId=<id>&page=1&limit=20
Authorization: Bearer <accessToken>
\`\`\`

#### Search Menu Items

\`\`\`
GET /api/menu/items/search?q=burger
Authorization: Bearer <accessToken>
\`\`\`

#### Create Menu Item

\`\`\`
POST /api/menu/items
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"name": "Grilled Salmon",
"description": "Fresh Atlantic salmon",
"price": 24.99,
"categoryId": "<category-id>",
"preparationTime": 25,
"allergens": ["seafood"]
}
\`\`\`

### Order Management Endpoints

#### Create Order

\`\`\`
POST /api/orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"tableId": "<table-id>",
"customerCount": 4,
"type": "dine_in"
}
\`\`\`

#### Add Item to Order

\`\`\`
POST /api/orders/:id/items
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"menuItemId": "<item-id>",
"quantity": 2,
"specialInstructions": "No onions"
}
\`\`\`

#### Get Active Orders

\`\`\`
GET /api/orders/active
Authorization: Bearer <accessToken>
\`\`\`

#### Get Kitchen Orders

\`\`\`
GET /api/orders/kitchen
Authorization: Bearer <accessToken>
\`\`\`

#### Confirm Order

\`\`\`
POST /api/orders/:id/confirm
Authorization: Bearer <accessToken>
\`\`\`

#### Update Order Status

\`\`\`
PUT /api/orders/:id/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"status": "served"
}
\`\`\`

#### Cancel Order

\`\`\`
POST /api/orders/:id/cancel
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"reason": "Customer requested cancellation"
}
\`\`\`

### Payment Endpoints

#### Calculate Payment Totals

\`\`\`
POST /api/payments/calculate
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"orderId": "<order-id>",
"discountPercentage": 10,
"serviceChargePercentage": 15,
"taxRate": 0.1
}
\`\`\`

#### Process Payment

\`\`\`
POST /api/payments/process
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"orderId": "<order-id>",
"amount": 54.98,
"paymentMethod": "credit_card",
"tipAmount": 5.00
}
\`\`\`

#### Process Split Payment

\`\`\`
POST /api/payments/split
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"orderId": "<order-id>",
"payments": [
{
"amount": 27.49,
"method": "credit_card",
"tipAmount": 2.50
},
{
"amount": 27.49,
"method": "cash",
"tipAmount": 2.50
}
]
}
\`\`\`

#### Refund Payment

\`\`\`
POST /api/payments/:id/refund
Authorization: Bearer <accessToken>
Content-Type: application/json

{
"reason": "Customer dissatisfied"
}
\`\`\`

### Dashboard & Reporting Endpoints

#### Get Dashboard Stats

\`\`\`
GET /api/dashboard/stats
Authorization: Bearer <accessToken>
\`\`\`

#### Get Daily Sales Report

\`\`\`
GET /api/dashboard/reports/sales/daily?date=2024-01-15
Authorization: Bearer <accessToken>
\`\`\`

#### Get Weekly Sales Report

\`\`\`
GET /api/dashboard/reports/sales/weekly
Authorization: Bearer <accessToken>
\`\`\`

#### Get Popular Items Report

\`\`\`
GET /api/dashboard/reports/items/popular
Authorization: Bearer <accessToken>
\`\`\`

#### Get Staff Performance Report

\`\`\`
GET /api/dashboard/reports/staff/performance
Authorization: Bearer <accessToken>
\`\`\`

### System Endpoints

#### Health Check

\`\`\`
GET /api/system/health
\`\`\`

#### Get System Info

\`\`\`
GET /api/system/info
Authorization: Bearer <accessToken>
\`\`\`

#### Get Audit Logs

\`\`\`
GET /api/system/logs?page=1&limit=50
Authorization: Bearer <accessToken>
\`\`\`

## Database Models

### User

- id (UUID)
- username (String, unique)
- email (String, unique)
- password (String, hashed)
- role (Enum: admin, manager, server, kitchen_staff, cashier)
- isActive (Boolean)
- lastLogin (Date)
- refreshToken (String)
- createdAt, updatedAt

### Table

- id (UUID)
- tableNumber (Integer, unique)
- tableName (String)
- capacity (Integer)
- status (Enum: free, occupied, reserved, cleaning, out_of_order)
- location (Enum: main_hall, patio, private_room, bar_area, terrace)
- minOrderAmount (Decimal)
- currentOrderId (UUID)
- notes (Text)
- isActive (Boolean)
- createdAt, updatedAt

### MenuCategory

- id (UUID)
- name (String)
- description (Text)
- type (Enum: breakfast, lunch, dinner, buffet_lunch, buffet_dinner, all_day, beverages)
- startTime (Time)
- endTime (Time)
- daysAvailable (JSON array)
- displayOrder (Integer)
- imageUrl (String)
- isActive (Boolean)
- createdAt, updatedAt

### MenuItem

- id (UUID)
- name (String)
- description (Text)
- price (Decimal)
- costPrice (Decimal)
- categoryId (UUID, FK)
- preparationTime (Integer)
- isAvailable (Boolean)
- isPopular (Boolean)
- isRecommended (Boolean)
- allergens (JSON array)
- spiceLevel (Enum)
- ingredients (JSON array)
- nutritionalInfo (JSON)
- customizationOptions (JSON)
- maxDailyQuantity (Integer)
- todaySold (Integer)
- createdAt, updatedAt

### Order

- id (UUID)
- orderNumber (String, unique)
- tableId (UUID, FK)
- serverId (UUID, FK)
- customerCount (Integer)
- status (Enum: draft, open, confirmed, in_kitchen, ready, served, cancelled, paid, refunded)
- priority (Enum: low, normal, high, urgent)
- type (Enum: dine_in, takeaway, delivery)
- subtotal (Decimal)
- taxAmount (Decimal)
- discountAmount (Decimal)
- serviceCharge (Decimal)
- grandTotal (Decimal)
- paidAmount (Decimal)
- paidAt (Date)
- servedAt (Date)
- createdAt, updatedAt

### OrderLine

- id (UUID)
- orderId (UUID, FK)
- menuItemId (UUID, FK)
- quantity (Integer)
- unitPrice (Decimal)
- lineTotal (Decimal)
- status (Enum: pending, confirmed, preparing, ready, served, cancelled)
- specialInstructions (Text)
- customization (JSON)
- preparedBy (UUID)
- startedAt (Date)
- completedAt (Date)
- servedAt (Date)
- createdAt, updatedAt

### Payment

- id (UUID)
- orderId (UUID, FK)
- paymentNumber (String, unique)
- amount (Decimal)
- paymentMethod (Enum: cash, credit_card, debit_card, digital_wallet, voucher, multiple)
- tipAmount (Decimal)
- changeGiven (Decimal)
- status (Enum: pending, processing, completed, failed, refunded, partially_refunded)
- processedBy (UUID, FK)
- refundedBy (UUID)
- refundReason (Text)
- completedAt (Date)
- createdAt, updatedAt

### AuditLog

- id (UUID)
- action (String)
- entityType (String)
- entityId (String)
- userId (UUID)
- userRole (String)
- oldValues (JSON)
- newValues (JSON)
- ipAddress (String)
- userAgent (Text)
- severity (Enum: info, warning, error, critical)
- timestamp (Date)

## Error Handling

All errors follow a standardized format:

\`\`\`json
{
"success": false,
"error": {
"code": "ERROR_CODE",
"message": "Human-readable error message",
"timestamp": "2024-01-15T10:30:00Z",
"requestId": "req-123456789",
"details": [
{
"field": "email",
"message": "Must be a valid email"
}
]
}
}
\`\`\`

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_*`: Duplicate resource (e.g., DUPLICATE_TABLE)
- `INVALID_*`: Invalid state or operation
- `SERVICE_UNAVAILABLE`: Database or service unavailable

## Logging

Logs are written to both console and files:

- **Console**: All logs at configured level
- **Files**:
  - `logs/combined.log`: All logs
  - `logs/error.log`: Error logs only

Log levels: error, warn, info, http, debug

## Development

### Running Tests

\`\`\`bash
npm test
\`\`\`

### Database Migrations

\`\`\`bash
npm run migrate
\`\`\`

### Seed Database

\`\`\`bash
npm run seed
\`\`\`

## Production Deployment

1. **Set environment variables**
   \`\`\`bash
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   JWT_REFRESH_SECRET=<strong-random-secret>
   \`\`\`

2. **Use a process manager** (PM2, systemd, etc.)
   \`\`\`bash
   pm2 start src/index.js --name restaurant-api
   \`\`\`

3. **Set up reverse proxy** (Nginx, Apache)

4. **Enable HTTPS** with SSL certificates

5. **Configure database backups**

6. **Monitor logs and performance**

## API Response Format

### Success Response

\`\`\`json
{
"success": true,
"data": {
"key": "value"
}
}
\`\`\`

### Paginated Response

\`\`\`json
{
"success": true,
"data": {
"items": [...],
"pagination": {
"page": 1,
"limit": 20,
"total": 100
}
}
}
\`\`\`

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via `RATE_LIMIT_*` environment variables
- Authentication endpoints have stricter limits

## Security Best Practices

1. **Change default credentials** immediately after deployment
2. **Use strong JWT secrets** (min 32 characters)
3. **Enable HTTPS** in production
4. **Regularly update dependencies**
5. **Monitor audit logs** for suspicious activity
6. **Implement database backups**
7. **Use environment variables** for sensitive data
8. **Enable CORS** only for trusted domains

## Support & Troubleshooting

### Database Connection Issues

- Ensure `DB_PATH` directory exists and is writable
- Check SQLite3 installation

### JWT Token Errors

- Verify `JWT_SECRET` is set correctly
- Check token expiration time
- Ensure token format is `Bearer <token>`

### Port Already in Use

- Change `PORT` in `.env`
- Or kill process using the port

## License

MIT

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.