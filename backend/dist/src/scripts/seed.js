"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const theme_model_1 = require("../models/theme.model");
const user_model_1 = require("../models/user.model");
const category_model_1 = require("../models/category.model");
const product_model_1 = require("../models/product.model");
const order_model_1 = require("../models/order.model");
const review_model_1 = require("../models/review.model");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/needle-fashion';
// 1x1 white pixel JPEG base64 (without prefix, frontend adds it)
const PLACEHOLDER_IMAGE = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
function fetchImageAsBase64(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            return buffer.toString('base64');
        }
        catch (error) {
            console.error(`Failed to fetch image from ${url}:`, error);
            return PLACEHOLDER_IMAGE;
        }
    });
}
function seedDummyData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting dummy data seed...');
        // 1. Users
        console.log('Seeding Users...');
        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                phone: '1234567890',
                address: '123 Admin St, Admin City, 12345',
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: 'password123',
                role: 'user',
                phone: '9876543210',
                address: '456 User Lane, User Town, 67890',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user',
                phone: '5555555555',
                address: '789 Jane Dr, Janeville, 11223',
            },
            {
                name: 'Nido Adil Sayyed',
                email: 'nidoadilsayyed@gmail.com',
                password: 'Password123',
                role: 'admin',
                phone: '8888888888',
                address: 'Admin Residence, City',
            },
        ];
        for (const userData of users) {
            const existing = yield user_model_1.User.findOne({ email: userData.email });
            if (!existing) {
                yield user_model_1.User.create(userData);
                console.log(`User ${userData.email} created.`);
            }
            else {
                console.log(`User ${userData.email} already exists.`);
            }
        }
        const allUsers = yield user_model_1.User.find();
        const adminUser = allUsers.find(u => u.role === 'admin') || allUsers[0];
        const regularUser = allUsers.find(u => u.email === 'user@example.com') || allUsers[1];
        // 2. Categories
        console.log('Seeding Categories...');
        const categories = [
            {
                name: 'Kurta',
                description: 'Traditional and stylish kurtas for men.',
                image: yield fetchImageAsBase64('https://images.unsplash.com/photo-1583394838336-acd977732f90?auto=format&fit=crop&w=400&h=400&q=80')
            },
            {
                name: 'Sherwani',
                description: 'Elegant sherwanis for weddings and festive occasions.',
                image: yield fetchImageAsBase64('https://images.unsplash.com/photo-1597910037310-7dd8ddb93e24?auto=format&fit=crop&w=400&h=400&q=80')
            },
            {
                name: 'Accessories',
                description: 'Complement your look with our accessories.',
                image: yield fetchImageAsBase64('https://images.unsplash.com/photo-1507679799987-c73774586594?auto=format&fit=crop&w=400&h=400&q=80')
            },
        ];
        for (const catData of categories) {
            const existing = yield category_model_1.Category.findOne({ name: catData.name });
            if (!existing) {
                yield category_model_1.Category.create(catData);
                console.log(`Category ${catData.name} created.`);
            }
        }
        const allCategories = yield category_model_1.Category.find();
        const kurtaCat = allCategories.find(c => c.name === 'Kurta');
        const sherwaniCat = allCategories.find(c => c.name === 'Sherwani');
        // 3. Products
        console.log('Seeding Products...');
        if (kurtaCat && sherwaniCat) {
            const products = [
                {
                    name: 'Classic Cotton Kurta',
                    description: 'A comfortable classic cotton kurta perfect for daily wear. Breathable fabric and elegant design.',
                    price: 1299,
                    category: kurtaCat._id,
                    stock: 50,
                    images: [{
                            data: yield fetchImageAsBase64('https://images.unsplash.com/photo-1583394838336-acd977732f90?auto=format&fit=crop&w=800&q=80'),
                            alt: 'Classic Cotton Kurta'
                        }],
                    sizes: [38, 40, 42, 44],
                    fittingOptions: ['Loose', 'Medium', 'Fit'],
                    isMakeToOrder: false,
                },
                {
                    name: 'Embroidered Silk Kurta',
                    description: 'Luxurious silk kurta with intricate embroidery. Ideal for festivals and special gatherings.',
                    price: 2499,
                    category: kurtaCat._id,
                    stock: 20,
                    images: [{
                            data: yield fetchImageAsBase64('https://images.unsplash.com/photo-1598033129183-c4f50c717678?auto=format&fit=crop&w=800&q=80'),
                            alt: 'Embroidered Silk Kurta'
                        }],
                    sizes: [38, 40, 42],
                    fittingOptions: ['Medium', 'Fit'],
                    isMakeToOrder: true,
                },
                {
                    name: 'Royal Wedding Sherwani',
                    description: 'Magnificent sherwani handcrafted for your special day. Features premium fabric and royal detailing.',
                    price: 15999,
                    category: sherwaniCat._id,
                    stock: 5,
                    images: [{
                            data: yield fetchImageAsBase64('https://images.unsplash.com/photo-1597910037242-451e64906d2c?auto=format&fit=crop&w=800&q=80'),
                            alt: 'Royal Wedding Sherwani'
                        }],
                    sizes: [40, 42, 44],
                    fittingOptions: ['Fit'],
                    isMakeToOrder: true,
                },
                {
                    name: 'Modern Indo-Western Sherwani',
                    description: 'Contemporary style meets traditional elegance. A perfect fusion for the modern groom.',
                    price: 8999,
                    category: sherwaniCat._id,
                    stock: 10,
                    images: [{
                            data: yield fetchImageAsBase64('https://images.unsplash.com/photo-1597910037310-7dd8ddb93e24?auto=format&fit=crop&w=800&q=80'),
                            alt: 'Modern Indo-Western Sherwani'
                        }],
                    sizes: [38, 40, 42, 44],
                    fittingOptions: ['Medium', 'Fit'],
                    isMakeToOrder: true,
                },
                {
                    name: 'Summer Linen Kurta',
                    description: 'Stay cool and stylish this summer with our linen kurta collection. Available in pastel shades.',
                    price: 1499,
                    category: kurtaCat._id,
                    stock: 30,
                    images: [{
                            data: yield fetchImageAsBase64('https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80'),
                            alt: 'Summer Linen Kurta'
                        }],
                    sizes: [38, 40, 42, 44, 46],
                    fittingOptions: ['Loose', 'Medium'],
                    isMakeToOrder: false,
                },
            ];
            for (const prodData of products) {
                const existing = yield product_model_1.Product.findOne({ name: prodData.name });
                if (!existing) {
                    yield product_model_1.Product.create(prodData);
                    console.log(`Product ${prodData.name} created.`);
                }
            }
        }
        // 4. Products Refetch for Relations
        const allProducts = yield product_model_1.Product.find();
        const firstProduct = allProducts[0];
        // 5. Reviews
        console.log('Seeding Reviews...');
        if (firstProduct && regularUser) {
            const existingReview = yield review_model_1.Review.findOne({ user: regularUser._id, product: firstProduct._id });
            if (!existingReview) {
                yield review_model_1.Review.create({
                    user: regularUser._id,
                    product: firstProduct._id,
                    rating: 5,
                    comment: 'Amazing product! Fits perfectly and the fabric quality is top-notch.',
                    isVerifiedPurchase: true,
                });
                console.log('Dummy review created.');
                // Update product rating
                firstProduct.numReviews = 1;
                firstProduct.averageRating = 5;
                yield firstProduct.save();
            }
        }
        // 6. Orders
        console.log('Seeding Orders...');
        if (firstProduct && regularUser) {
            const existingOrder = yield order_model_1.Order.findOne({ user: regularUser._id });
            if (!existingOrder) {
                yield order_model_1.Order.create({
                    user: regularUser._id,
                    items: [
                        {
                            product: firstProduct._id,
                            quantity: 1,
                            price: firstProduct.price,
                            size: 40,
                            fitting: 'Medium'
                        }
                    ],
                    shippingAddress: {
                        address: '456 User Lane',
                        city: 'User Town',
                        postalCode: '67890',
                        state: 'State',
                        country: 'India'
                    },
                    paymentMethod: 'UPI',
                    itemsPrice: firstProduct.price,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: firstProduct.price,
                    isPaid: true,
                    paidAt: new Date(),
                    status: 'Processing'
                });
                console.log('Dummy order created.');
            }
        }
        console.log('Dummy data seeding completed.');
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Connecting to MongoDB...');
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log('MongoDB connected');
            // Seed default theme if none exists
            const existingDefault = yield theme_model_1.Theme.findOne({ isDefault: true });
            if (existingDefault) {
                console.log('Default theme already exists, skipping creation.');
            }
            else {
                console.log('Creating default theme...');
                yield theme_model_1.Theme.create({
                    name: 'Default',
                    description: 'Default store theme',
                    isDefault: true,
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#64748b',
                        accent: '#f59e0b',
                        background: '#ffffff',
                        text: '#1f2937',
                        border: '#e5e7eb',
                    },
                    fonts: {
                        heading: 'Inter, sans-serif',
                        body: 'Inter, sans-serif',
                    },
                    layout: {
                        borderRadius: '0.5rem',
                        spacing: '4px',
                    },
                    isActive: true,
                });
                console.log('Default theme created.');
            }
            // Seed Dark theme
            const existingDark = yield theme_model_1.Theme.findOne({ name: 'Dark' });
            if (existingDark) {
                console.log('Dark theme already exists, skipping creation.');
            }
            else {
                console.log('Creating Dark theme...');
                yield theme_model_1.Theme.create({
                    name: 'Dark',
                    description: 'Dark mode theme',
                    isDefault: false,
                    colors: {
                        primary: '#FFD700', // Gold
                        secondary: '#444444',
                        accent: '#FFD700',
                        background: '#1E1E1E',
                        text: '#FFFFFF',
                        border: '#444444',
                    },
                    fonts: {
                        heading: 'Inter, sans-serif',
                        body: 'Inter, sans-serif',
                    },
                    layout: {
                        borderRadius: '0.5rem',
                        spacing: '4px',
                    },
                    isActive: true,
                });
                console.log('Dark theme created.');
            }
            // Seed Ocean theme
            const existingOcean = yield theme_model_1.Theme.findOne({ name: 'Ocean' });
            if (existingOcean) {
                console.log('Ocean theme already exists, skipping creation.');
            }
            else {
                console.log('Creating Ocean theme...');
                yield theme_model_1.Theme.create({
                    name: 'Ocean',
                    description: 'Calm and refreshing ocean theme',
                    isDefault: false,
                    colors: {
                        primary: '#0ea5e9', // Sky 500
                        secondary: '#64748b',
                        accent: '#38bdf8', // Sky 400
                        background: '#f0f9ff', // Sky 50
                        text: '#0c4a6e', // Sky 900
                        border: '#bae6fd', // Sky 200
                    },
                    fonts: {
                        heading: 'Inter, sans-serif',
                        body: 'Inter, sans-serif',
                    },
                    layout: {
                        borderRadius: '0.75rem',
                        spacing: '6px',
                    },
                    isActive: true,
                });
                console.log('Ocean theme created.');
            }
            // Seed Forest theme
            const existingForest = yield theme_model_1.Theme.findOne({ name: 'Forest' });
            if (existingForest) {
                console.log('Forest theme already exists, skipping creation.');
            }
            else {
                console.log('Creating Forest theme...');
                yield theme_model_1.Theme.create({
                    name: 'Forest',
                    description: 'Natural and earthy forest theme',
                    isDefault: false,
                    colors: {
                        primary: '#22c55e', // Green 500
                        secondary: '#713f12', // Yellow 900 (wood)
                        accent: '#84cc16', // Lime 500
                        background: '#f0fdf4', // Green 50
                        text: '#14532d', // Green 900
                        border: '#bbf7d0', // Green 200
                    },
                    fonts: {
                        heading: 'Inter, sans-serif',
                        body: 'Inter, sans-serif',
                    },
                    layout: {
                        borderRadius: '0.25rem',
                        spacing: '4px',
                    },
                    isActive: true,
                });
                console.log('Forest theme created.');
            }
            // Seed Sunset theme
            const existingSunset = yield theme_model_1.Theme.findOne({ name: 'Sunset' });
            if (existingSunset) {
                console.log('Sunset theme already exists, skipping creation.');
            }
            else {
                console.log('Creating Sunset theme...');
                yield theme_model_1.Theme.create({
                    name: 'Sunset',
                    description: 'Warm and vibrant sunset theme',
                    isDefault: false,
                    colors: {
                        primary: '#f97316', // Orange 500
                        secondary: '#be185d', // Pink 700
                        accent: '#facc15', // Yellow 400
                        background: '#fff7ed', // Orange 50
                        text: '#7c2d12', // Orange 900
                        border: '#fed7aa', // Orange 200
                    },
                    fonts: {
                        heading: 'Inter, sans-serif',
                        body: 'Inter, sans-serif',
                    },
                    layout: {
                        borderRadius: '1rem',
                        spacing: '8px',
                    },
                    isActive: true,
                });
                console.log('Sunset theme created.');
            }
            // Call dummy data seeder
            yield seedDummyData();
            console.log('Seeding completed successfully.');
            yield mongoose_1.default.disconnect();
            process.exit(0);
        }
        catch (err) {
            console.error('Seeding failed:', err);
            yield mongoose_1.default.disconnect().catch(() => undefined);
            process.exit(1);
        }
    });
}
seed();
//# sourceMappingURL=seed.js.map