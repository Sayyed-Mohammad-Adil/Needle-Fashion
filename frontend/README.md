# Needle Fashion Frontend

A modern e-commerce frontend for men's ethnic wear built with Next.js, TypeScript, and TailwindCSS.

## Features

- **Responsive Design**: Mobile-first design with TailwindCSS
- **Theme Support**: Light/Dark theme toggle with next-themes
- **Authentication**: JWT-based authentication with context management
- **Product Catalog**: Dynamic product listing with advanced filtering
- **Shopping Cart**: Persistent cart with localStorage
- **Order Management**: Complete checkout flow with GST calculation
- **Admin Dashboard**: Comprehensive admin panel for business management
- **Search & Filtering**: Advanced search with dynamic filters
- **FAQ System**: Interactive FAQ with chatbot integration
- **SEO Optimized**: Next.js SSR/SSG for better performance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Theme**: next-themes for dark mode

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_NAME=Needle Fashion
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── customer/          # Customer pages
│   ├── faq/               # FAQ page
│   └── product/           # Product pages
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── product/           # Product-related components
│   └── ui/                # UI components
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api/               # API service functions
│   └── types.ts           # TypeScript type definitions
└── styles/                # Global styles
```

## Key Features

### Theme System
- Light/Dark theme toggle
- Persistent theme preference
- CSS custom properties for theming
- Golden accent color (#FFD700) for brand consistency

### Authentication
- JWT-based authentication
- Protected routes
- Role-based access control
- Automatic token refresh

### Product Catalog
- Dynamic product loading from API
- Advanced filtering system
- Search functionality
- Pagination
- Grid/List view toggle

### Shopping Cart
- Persistent cart with localStorage
- Custom measurements for make-to-order items
- GST calculation
- Multiple fitting options

### Admin Dashboard
- Revenue and sales analytics
- Order management
- Product management
- Customer management
- Expense tracking
- FAQ management

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Styling
- TailwindCSS v4 with custom theme
- CSS custom properties for dynamic theming
- Responsive design with mobile-first approach
- Component-based styling

### State Management
- React Context for global state
- Local state with useState/useReducer
- Persistent state with localStorage
- Form state with React Hook Form

## API Integration

The frontend integrates with the backend API through service functions:

- `authService` - Authentication operations
- `productService` - Product management
- `categoryService` - Category operations
- `orderService` - Order management
- `analyticsService` - Analytics data
- `faqService` - FAQ management

## Components

### Layout Components
- `Header` - Navigation with theme toggle
- `Footer` - Site footer with links
- `ThemeProviderWrapper` - Theme context provider

### Product Components
- Product cards with image placeholders
- Product detail pages
- Filter components
- Search functionality

### Admin Components
- Dashboard with analytics
- Product management forms
- Order management interface
- Customer management

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all screen sizes

## Performance

- Next.js App Router for optimal performance
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- SEO optimization with metadata

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `out` directory to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.