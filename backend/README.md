# Needle Fashion Backend

A comprehensive e-commerce backend for men's ethnic wear built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Customer and admin roles with profile management
- **Product Management**: CRUD operations with dynamic categories and filters
- **Order Management**: Complete order lifecycle with GST invoice generation
- **Analytics**: Search, view, and sales tracking
- **Expense Management**: Business expense tracking and reporting
- **FAQ System**: Dynamic chatbot and FAQ management
- **Review System**: Product reviews with moderation
- **File Upload**: Base64 image support for products and measurements

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Processing**: PDFKit for invoice generation
- **Validation**: Built-in validation with error handling

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/needle-fashion

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/refresh` - Refresh access token
- `GET /api/users/me` - Get current user profile

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order payment
- `PUT /api/orders/:id/deliver` - Mark order as delivered (admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/sales` - Get sales analytics
- `GET /api/analytics/products` - Get product analytics
- `POST /api/analytics/search` - Track search terms

## Database Models

### User
- Basic profile information
- Role-based access (customer/admin)
- Saved measurements for custom orders
- Wishlist functionality

### Product
- Product details with Base64 images
- Dynamic category assignment
- Filter-based attributes
- Stock management
- Make-to-order vs ready-made options

### Order
- Complete order information
- Customer measurements for custom orders
- GST calculation and invoice generation
- Order status tracking

### Category
- Dynamic category management
- Category-based product organization

### Filter
- Dynamic filter system
- Filter values for product attributes

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run clean` - Clean build directory

### Project Structure
```
src/
├── controllers/     # Route handlers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.