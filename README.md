# FoodDelivery Platform

A comprehensive food delivery management platform built with Next.js, featuring role-based dashboards for customers, riders, restaurant owners, and administrators.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Customer, Rider, Restaurant Owner, Admin
- **Restaurant Management**: Browse restaurants, view menus, manage multiple locations
- **Order Management**: Place orders, real-time tracking, order history
- **Cart System**: Add items, modify quantities, cross-restaurant validation
- **Payment Processing**: Secure payment methods, order confirmation
- **Real-time Tracking**: Live order status updates, delivery tracking
- **Customer Support**: Built-in chat system for customer assistance

### User Roles & Capabilities

#### 👤 Customer
- Browse restaurants and menus
- Add items to cart and place orders
- Real-time order tracking
- Order history and reviews
- Address and payment management
- Customer support chat

#### 🚴 Rider
- Accept and manage delivery orders
- Real-time order status updates
- Earnings tracking and history
- Customer and restaurant feedback
- Profile and vehicle management

#### 🏪 Restaurant Owner
- Manage multiple restaurant locations
- Menu customization and pricing
- Order management and fulfillment
- Earnings and analytics dashboard
- Restaurant profile management

#### 👨‍💼 Admin
- Platform-wide user management
- Restaurant approval and oversight
- Order monitoring and analytics
- Customer support management
- System configuration

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: React Context API
- **Authentication**: Role-based access control
- **Real-time**: WebSocket simulation for live updates
- **Database**: MongoDB (configured for backend integration)
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd food-delivery-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your environment variables:
\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://your-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Getting Started

### Default Admin Access
- **Email**: admin@example.com
- **Password**: admin@1234

### User Registration
1. Visit the homepage
2. Click "Get Started" or navigate to registration
3. Select your role (Customer, Rider, or Restaurant Owner)
4. Complete the registration form
5. Access your role-specific dashboard

### Quick Start Guide
1. **Customers**: Browse restaurants → Add items to cart → Checkout → Track order
2. **Riders**: Accept orders → Update status → Complete delivery → View earnings
3. **Restaurant Owners**: Set up restaurant → Manage menu → Process orders → Track earnings
4. **Admins**: Monitor platform → Manage users → Handle support → View analytics

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   ├── restaurants/       # Restaurant browsing
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Order checkout
│   ├── orders/           # Order tracking
│   └── api/              # API routes
├── components/            # Reusable components
│   ├── dashboard/        # Dashboard components
│   ├── navigation/       # Navigation components
│   ├── support/          # Customer support
│   └── ui/               # UI components
├── contexts/             # React contexts
├── lib/                  # Utilities and helpers
├── types/                # TypeScript definitions
└── public/               # Static assets
\`\`\`

## 🔧 Configuration

### Theme Support
The app supports both light and dark themes with automatic system detection.

### Role-Based Access
- Routes are protected based on user roles
- Middleware handles authentication and authorization
- Context providers manage user state

### Real-time Features
- Order status updates
- Live chat support
- Dashboard analytics
- Notification system

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
Ensure all environment variables are configured in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:
- Use the in-app customer support chat
- Check the setup guide at `/setup-guide`
- Review the API documentation

## 🔄 Updates

The platform includes:
- Automatic dependency updates
- Security patches
- Feature enhancements
- Performance optimizations

---

Built with ❤️ using Next.js and modern web technologies.
