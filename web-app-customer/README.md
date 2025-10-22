# Restaurant Ordering Web App

A modern, customer-facing restaurant ordering system built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Customers can enter their table number, browse the menu, add items to cart, and place orders with real-time tracking.

## Features

- **Table-Based Ordering**: Customers enter their table number to start ordering
- **Menu Browsing**: Browse items by category with search functionality
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Review order and confirm before submission
- **Order Tracking**: Real-time order status updates with timeline
- **Favorites System**: Save favorite items for quick access
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **UI Components**: Shadcn/ui
- **State Management**: Custom store with localStorage persistence
- **HTTP Client**: Native Fetch API
- **Form Handling**: React Hook Form
- **Icons**: Unicode and CSS-based icons

## Project Structure

\`\`\`
├── app/
│ ├── layout.tsx # Root layout with theme provider
│ ├── globals.css # Global styles and design tokens
│ ├── page.tsx # Landing page (table entry)
│ ├── menu/
│ │ ├── page.tsx # Menu browsing page
│ │ └── [id]/
│ │ └── page.tsx # Item detail page
│ ├── cart/
│ │ └── page.tsx # Shopping cart page
│ ├── checkout/
│ │ └── page.tsx # Checkout page
│ ├── order-confirmation/
│ │ └── [orderNumber]/
│ │ └── page.tsx # Order confirmation page
│ └── order-tracking/
│ └── [orderNumber]/
│ └── page.tsx # Order tracking page
├── components/
│ ├── ui/ # Shadcn/ui components
│ ├── table-entry-form.tsx # Table number entry form
│ ├── menu-header.tsx # Menu page header
│ ├── category-tabs.tsx # Category filter tabs
│ ├── menu-grid.tsx # Menu items grid
│ ├── menu-item-card.tsx # Individual menu item card
│ ├── item-detail-view.tsx # Item detail modal/view
│ ├── cart-item-row.tsx # Cart item row
│ ├── checkout-summary.tsx # Order summary
│ ├── order-status-timeline.tsx # Order status timeline
│ ├── cart-button.tsx # Floating cart button
│ └── theme-provider.tsx # Theme toggle provider
├── lib/
│ ├── types.ts # TypeScript type definitions
│ ├── api-client.ts # API client with fetch
│ ├── store.ts # State management store
│ └── utils.ts # Utility functions
└── public/
└── placeholder.svg # Placeholder images
\`\`\`

## Installation

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd restaurant-ordering-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   \`\`\`

   Update `NEXT_PUBLIC_API_URL` to point to your backend API server.

4. **Run the development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

5. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## API Configuration

The app communicates with a backend API. Configure the API endpoint in your environment variables:

\`\`\`env
NEXT_PUBLIC_API_URL=http://your-api-server.com/api
\`\`\`

### Required API Endpoints

The backend should provide the following endpoints:

- `GET /api/categories` - Get all menu categories
- `GET /api/items` - Get all menu items
- `GET /api/items/:id` - Get item details
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order details
- `GET /api/orders/:orderNumber/status` - Get order status

See the specification document for detailed API response formats.

## Development

### Running Tests

\`\`\`bash
npm run test

# or

yarn test
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start

# or

yarn build
yarn start
\`\`\`

### Code Quality

The project uses TypeScript strict mode for type safety. Ensure all code is properly typed.

\`\`\`bash
npm run type-check
\`\`\`

## Design System

### Color Palette

The app uses a green-based color system with light and dark mode support:

**Light Mode:**

- Primary: `#16a34a` (Green-600)
- Accent: `#22c55e` (Green-500)
- Background: `#ffffff` (White)
- Foreground: `#1f2937` (Gray-800)

**Dark Mode:**

- Primary: `#22c55e` (Green-500)
- Accent: `#4ade80` (Green-400)
- Background: `#0f172a` (Slate-900)
- Foreground: `#f1f5f9` (Slate-100)

### Typography

- **Headings**: Geist Sans (bold, 600-700 weight)
- **Body**: Geist Sans (regular, 400 weight)
- **Monospace**: Geist Mono (for code)

### Spacing

Uses Tailwind's standard spacing scale (4px base unit):

- `p-4` = 16px padding
- `gap-4` = 16px gap
- `mb-6` = 24px margin-bottom

## Usage Guide

### For Customers

1. **Enter Table Number**: Start by entering your table number on the landing page
2. **Browse Menu**: Explore items by category or use search
3. **View Details**: Click on an item to see full details and customization options
4. **Add to Cart**: Select quantity and add items to your cart
5. **Review Cart**: Check your cart and modify items as needed
6. **Checkout**: Review order summary and confirm
7. **Track Order**: Monitor your order status in real-time

### For Developers

#### Adding a New Page

1. Create a new folder in `app/` directory
2. Add `page.tsx` file
3. Import necessary components and hooks
4. Use the store for state management
5. Follow the existing component patterns

#### Adding a New Component

1. Create component file in `components/` directory
2. Use TypeScript for type safety
3. Import design tokens from `lib/utils.ts`
4. Add proper ARIA labels for accessibility
5. Export as default export

#### Styling Components

Use Tailwind CSS classes with design tokens:

\`\`\`tsx

<div className="bg-primary text-primary-foreground p-4 rounded-lg">
  Content
</div>
\`\`\`

## Performance Optimization

- **Image Optimization**: Use Next.js Image component for images
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: Implement proper cache headers for API responses
- **Lazy Loading**: Components are code-split automatically
- **Bundle Size**: Monitor with `npm run analyze`

## Accessibility

The app follows WCAG 2.1 AA standards:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Focus management
- Screen reader support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Troubleshooting

### API Connection Issues

If you see "Failed to fetch menu items":

1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Verify backend server is running
3. Check CORS configuration on backend
4. Review browser console for detailed errors

### Theme Not Persisting

If dark mode preference doesn't persist:

1. Check browser localStorage is enabled
2. Clear browser cache and reload
3. Check browser console for errors

### Cart Items Disappearing

If cart items are lost on page refresh:

1. Verify localStorage is enabled
2. Check browser storage quota
3. Clear browser cache and try again

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

\`\`\`bash
vercel deploy
\`\`\`

### Deploy to Other Platforms

The app can be deployed to any platform supporting Node.js:

- Netlify
- AWS Amplify
- DigitalOcean
- Heroku
- Self-hosted servers

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions:

1. Check existing documentation
2. Review the specification document
3. Check browser console for errors
4. Contact the development team

## Changelog

### Version 1.0.0

- Initial release
- Core ordering functionality
- Menu browsing and cart management
- Order tracking
- Dark/light mode support
- Mobile optimization