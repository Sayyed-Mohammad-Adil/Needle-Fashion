# Needle Fashion Backend

A full-featured e-commerce & bespoke menswear atelier backend built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Socket.IO**.

## Features

- **Authentication & Authorization**: JWT access/refresh authentication, Google Auth support, and role-based access control (`customer` / `admin`).
- **Product, Category & Dynamic Filter Management**: CRUD operations for menswear items, categories, dynamic filter attributes, and stock/make-to-order configurations.
- **Order & GST Invoice Engine**: Complete order lifecycle with custom 48-point measurement storage and automated PDF GST invoice generation (`PDFKit`).
- **Bespoke Inquiry & Fitting Dossier**: Dedicated `/api/inquiries` pipeline for private salon fittings and bespoke commissions.
- **Analytics & Expense Tracking**: Dashboard KPIs, search term tracking, product view/sales analytics, and business expense tracking.
- **Real-Time Communication**: Socket.IO support for live customer-admin chat and instant notifications.
- **Dynamic Theme & FAQ/Chatbot System**: Configurable storefront themes, product reviews, and FAQ/chatbot responses.
- **Media Upload**: File/image upload handling via Multer and Base64 support.

## Tech Stack

- **Runtime & Framework**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Real-Time**: Socket.IO
- **Security**: Helmet, CORS, `express-rate-limit`, bcryptjs, JWT, input sanitization & NoSQL injection protection
- **Documents & Uploads**: PDFKit, Multer

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/needle-fashion
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. (Optional) Seed sample data:
   ```bash
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints Overview

All API routes are mounted in `src/routes/index.ts` with input sanitization, NoSQL injection prevention, and `Cache-Control: no-store`:

- `GET /api/health` — Server health check
- `/api/users` — Registration, login, token refresh, profile, saved measurements, wishlist
- `/api/products` — Product catalog, filtering, search, CRUD (admin)
- `/api/categories` — Category listing & management
- `/api/filters` — Dynamic filter definitions & values
- `/api/orders` — Order creation, user order history, payment & delivery status, GST PDF invoices
- `/api/reviews` — Product reviews & moderation
- `/api/inquiries` — Bespoke commission & atelier fitting requests
- `/api/analytics` — Dashboard statistics, sales, product views, search terms
- `/api/expenses` — Business expense tracking (admin)
- `/api/themes` — Storefront theme configuration
- `/api/faqs` — FAQ management
- `/api/chat` — Live chat & chatbot endpoints
- `/api/notifications` — User/admin notifications
- `/api/upload` — Media upload endpoints

*(See `needle-fashion-backend.postman_collection.json` in the repository root for detailed request examples.)*

## Scripts

- `npm run dev` — Start development server with `ts-node-dev`
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run compiled server (`dist/server.js`)
- `npm run seed` — Run database seed script (`src/scripts/seed.ts`)
- `npm run clean` — Remove `dist/`

## Project Structure

```
src/
├── config/         # Database & environment configuration
├── controllers/    # Route controllers (analytics, chatbot, expense, faq, filter, inquiry, notification, order, product, review, theme, user, category)
├── middleware/     # Auth, error handling, and security middleware
├── models/         # Mongoose schemas
├── routes/         # Express route definitions (mounted in index.ts)
├── scripts/        # Database seeding script
├── socket/         # Socket.IO handlers
├── utils/          # JWT & PDF invoice utilities
└── index.ts        # Express app setup
```

## License

ISC License.
