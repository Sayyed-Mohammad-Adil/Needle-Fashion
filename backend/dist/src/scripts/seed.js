"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const siteConfig_controller_1 = require("../controllers/siteConfig.controller");
dotenv_1.default.config();
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
}
async function seed() {
    console.log('Starting PostgreSQL seed via Prisma...');
    // 1. Users
    const users = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            phone: '1234567890',
            address: '123 Admin St, Mumbai',
        },
        {
            name: 'Nido Adil Sayyed',
            email: 'nidoadilsayyed@gmail.com',
            password: 'Password123',
            role: 'admin',
            phone: '8888888888',
            address: 'Atelier Residence, Mumbai',
        },
        {
            name: 'Monte Carlo Patron',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
            phone: '9876543210',
            address: 'Avenue de Monte-Carlo, Monaco',
        },
    ];
    for (const u of users) {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: u.email } });
        if (!existing) {
            await prisma_1.prisma.user.create({
                data: {
                    ...u,
                    password: await hashPassword(u.password),
                },
            });
            console.log(`Created user: ${u.email}`);
        }
    }
    // 2. Categories
    const categoriesData = [
        {
            name: 'Suits',
            description: 'Embroidered blazers, two-piece suits, coats & evening tuxedos',
            image: '/images/original-sage-suit.jpg',
        },
        {
            name: 'Shirts',
            description: 'Handloom linen shirts, crisp dress shirts & Supima t-shirts',
            image: '/images/original-rose-bandhgala-shirt.jpg',
        },
        {
            name: 'Pants',
            description: 'Pleated tailored trousers, tuxedo pants & relaxed linens',
            image: '/images/original-ivory-achkan.jpg',
        },
        {
            name: 'Accessories',
            description: 'Cashmere doshalas, silk pocket squares, safas & cufflinks',
            image: '/images/menswear-accessories.jpg',
        },
        {
            name: 'Indian Wear',
            description: 'Kurta pyjama sets, imperial sherwanis & Jodhpur bandhgalas',
            image: '/images/original-noir-bandhgala.jpg',
        },
    ];
    const categoryMap = new Map();
    for (const c of categoriesData) {
        const cat = await prisma_1.prisma.category.upsert({
            where: { name: c.name },
            update: { description: c.description, image: c.image },
            create: c,
        });
        categoryMap.set(cat.name, cat.id);
    }
    // 3. Products
    const existingProductsCount = await prisma_1.prisma.product.count();
    if (existingProductsCount === 0) {
        const productsData = [
            {
                name: 'Mughal Jaali Ivory Tailored Suit',
                description: 'Handloom ivory wool-silk tailored two-piece suit accented with tonal Mughal jaali threadwork.',
                price: 32999,
                images: [{ data: '/images/original-ivory-blazer.jpg', alt: 'Mughal Jaali Ivory Tailored Suit' }],
                categoryId: categoryMap.get('Suits'),
                sizes: [46, 48, 50, 52, 54],
                isMakeToOrder: true,
                stock: 8,
                filters: { Color: ['Ivory'], Fabric: ['Silk Wool'], Occasion: ['Gala', 'Ceremonial'] },
            },
            {
                name: 'Sage Heritage Embroidered Suit',
                description: 'Refined sage-green bespoke suit with subtle artisanal embroidery along the lapel.',
                price: 34499,
                images: [{ data: '/images/original-sage-suit.jpg', alt: 'Sage Heritage Embroidered Suit' }],
                categoryId: categoryMap.get('Suits'),
                sizes: [46, 48, 50, 52, 54],
                isMakeToOrder: true,
                stock: 6,
                filters: { Color: ['Sage'], Fabric: ['Raw Silk'], Occasion: ['Reception', 'Cocktail'] },
            },
            {
                name: 'Rose Ombré Jacket & Supima Tee',
                description: 'Lightweight hand-dyed ombré tailored jacket paired with a Supima cotton crew neck.',
                price: 21999,
                images: [{ data: '/images/original-rose-jacket-tee.jpg', alt: 'Rose Ombré Jacket & Supima Tee' }],
                categoryId: categoryMap.get('Shirts'),
                sizes: [46, 48, 50, 52, 54],
                isMakeToOrder: false,
                stock: 12,
                filters: { Color: ['Rose'], Fabric: ['Supima Cotton & Linen'] },
            },
            {
                name: 'Noir Kashmiri Paisley Coat',
                description: 'Midnight black wool-cashmere coat featuring intricate Kashmiri paisley embroidery.',
                price: 36999,
                images: [{ data: '/images/original-noir-bandhgala.jpg', alt: 'Noir Kashmiri Paisley Coat' }],
                categoryId: categoryMap.get('Indian Wear'),
                sizes: [46, 48, 50, 52, 54],
                isMakeToOrder: true,
                stock: 5,
                filters: { Color: ['Black'], Fabric: ['Cashmere Wool'], Work: ['Sozni'] },
            },
            {
                name: 'Ivory Botanical Achkan & Trousers',
                description: 'Architectural ivory achkan paired with crisp pleated wool-linen trousers.',
                price: 29499,
                images: [{ data: '/images/original-ivory-achkan.jpg', alt: 'Ivory Botanical Achkan & Trousers' }],
                categoryId: categoryMap.get('Pants'),
                sizes: [46, 48, 50, 52, 54],
                isMakeToOrder: true,
                stock: 10,
                filters: { Color: ['Ivory'], Fabric: ['Linen Silk'] },
            },
        ];
        for (const p of productsData) {
            await prisma_1.prisma.product.create({ data: p });
        }
        console.log(`Seeded ${productsData.length} signature products.`);
    }
    // 4. Default SiteConfig
    await prisma_1.prisma.siteConfig.upsert({
        where: { key: 'default' },
        update: {},
        create: {
            key: 'default',
            commerce: siteConfig_controller_1.DEFAULT_COMMERCE_SETTINGS,
            sections: siteConfig_controller_1.DEFAULT_SECTIONS,
            navigation: siteConfig_controller_1.DEFAULT_NAVIGATION,
            footer: siteConfig_controller_1.DEFAULT_FOOTER,
        },
    });
    // 5. Default Theme
    await prisma_1.prisma.theme.upsert({
        where: { name: 'Understated Ivory & Obsidian' },
        update: {},
        create: {
            name: 'Understated Ivory & Obsidian',
            description: 'Default Needle Fashion minimalist luxury theme',
            isDefault: true,
            isActive: true,
            colors: {
                primary: '#141414',
                secondary: '#F5F3EE',
                accent: '#C5A059',
                background: '#FAF9F6',
                text: '#141414',
                border: '#E5E1D8',
            },
            fonts: {
                heading: 'Inter, sans-serif',
                body: 'Inter, sans-serif',
            },
            layout: {
                borderRadius: '0px',
                spacing: '4px',
            },
        },
    });
    console.log('PostgreSQL seed complete!');
}
seed()
    .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map