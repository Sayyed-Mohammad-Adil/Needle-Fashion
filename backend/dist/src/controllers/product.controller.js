"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductPricing = exports.getTopProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const prisma_1 = require("../lib/prisma");
function formatProduct(p) {
    return {
        ...(0, prisma_1.withMongoId)(p),
        category: p.category ? (0, prisma_1.withMongoId)(p.category) : p.categoryId,
    };
}
const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        const where = {};
        if (req.query.category) {
            where.categoryId = String(req.query.category);
        }
        if (req.query.minPrice || req.query.maxPrice) {
            where.price = {};
            if (req.query.minPrice)
                where.price.gte = Number(req.query.minPrice);
            if (req.query.maxPrice)
                where.price.lte = Number(req.query.maxPrice);
        }
        if (req.query.size) {
            where.sizes = { has: Number(req.query.size) };
        }
        if (req.query.inStock === 'true') {
            where.isOutOfStock = false;
        }
        else if (req.query.inStock === 'false') {
            where.isOutOfStock = true;
        }
        if (req.query.isMakeToOrder !== undefined) {
            where.isMakeToOrder = req.query.isMakeToOrder === 'true';
        }
        if (req.query.keyword) {
            const kw = String(req.query.keyword);
            where.OR = [
                { name: { contains: kw, mode: 'insensitive' } },
                { description: { contains: kw, mode: 'insensitive' } },
            ];
        }
        let orderBy = { createdAt: 'desc' };
        switch (req.query.sortBy) {
            case 'priceAsc':
                orderBy = { price: 'asc' };
                break;
            case 'priceDesc':
                orderBy = { price: 'desc' };
                break;
            case 'rating':
                orderBy = { averageRating: 'desc' };
                break;
            case 'popularity':
                orderBy = { numReviews: 'desc' };
                break;
        }
        let products = await prisma_1.prisma.product.findMany({
            where,
            orderBy,
            include: { category: { select: { id: true, name: true } } },
        });
        // Apply dynamic JSON filters if provided
        const dynamicFilters = req.query.filters;
        if (dynamicFilters && typeof dynamicFilters === 'object') {
            const entries = Object.entries(dynamicFilters);
            products = products.filter((prod) => {
                const prodFilters = prod.filters || {};
                return entries.every(([key, value]) => {
                    const vals = prodFilters[key] || [];
                    if (Array.isArray(value)) {
                        return value.some((v) => vals.includes(String(v)));
                    }
                    return vals.includes(String(value));
                });
            });
        }
        const total = products.length;
        const paged = products.slice(pageSize * (page - 1), pageSize * page);
        res.json({
            products: paged.map(formatProduct),
            page,
            pages: Math.ceil(total / pageSize),
            total,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: req.params.id },
            include: { category: { select: { id: true, name: true } } },
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingView = await prisma_1.prisma.viewAnalytics.findFirst({
            where: {
                productId: product.id,
                date: { gte: today },
            },
        });
        if (existingView) {
            await prisma_1.prisma.viewAnalytics.update({
                where: { id: existingView.id },
                data: { views: { increment: 1 } },
            });
        }
        else {
            await prisma_1.prisma.viewAnalytics.create({
                data: { productId: product.id, views: 1, date: today },
            });
        }
        res.json(formatProduct(product));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, images, category, filters, sizes, isMakeToOrder, fittingOptions, stock, } = req.body;
        const categoryExists = await prisma_1.prisma.category.findUnique({
            where: { id: String(category) },
        });
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        const formattedImages = Array.isArray(images)
            ? images.map((img) => typeof img === 'string'
                ? { data: img, alt: name || '' }
                : { data: img.data || img.url || '', alt: img.alt || '' })
            : [];
        const numericStock = Number(stock ?? 0);
        const product = await prisma_1.prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                images: formattedImages,
                categoryId: categoryExists.id,
                filters: filters || {},
                sizes: Array.isArray(sizes) ? sizes.map(Number) : [],
                isMakeToOrder: Boolean(isMakeToOrder),
                fittingOptions: Array.isArray(fittingOptions)
                    ? fittingOptions
                    : ['Loose', 'Medium', 'Fit'],
                stock: numericStock,
                isOutOfStock: numericStock <= 0,
            },
            include: { category: { select: { id: true, name: true } } },
        });
        res.status(201).json(formatProduct(product));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const product = await prisma_1.prisma.product.findUnique({ where: { id: req.params.id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { name, description, price, images, category, filters, sizes, isMakeToOrder, fittingOptions, stock, isOutOfStock, } = req.body;
        let categoryId = product.categoryId;
        if (category) {
            const categoryExists = await prisma_1.prisma.category.findUnique({
                where: { id: String(category) },
            });
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid category' });
            }
            categoryId = categoryExists.id;
        }
        const formattedImages = images
            ? Array.isArray(images)
                ? images.map((img) => typeof img === 'string'
                    ? { data: img, alt: name || product.name || '' }
                    : { data: img.data || img.url || '', alt: img.alt || '' })
                : images
            : product.images;
        const nextStock = stock !== undefined ? Number(stock) : product.stock;
        const nextOutOfStock = isOutOfStock !== undefined
            ? Boolean(isOutOfStock)
            : stock !== undefined
                ? nextStock <= 0
                : product.isOutOfStock;
        const updatedProduct = await prisma_1.prisma.product.update({
            where: { id: req.params.id },
            data: {
                name: name ?? product.name,
                description: description ?? product.description,
                price: price !== undefined ? Number(price) : product.price,
                images: formattedImages,
                categoryId,
                filters: filters !== undefined ? filters : product.filters,
                sizes: Array.isArray(sizes) ? sizes.map(Number) : product.sizes,
                isMakeToOrder: isMakeToOrder !== undefined ? Boolean(isMakeToOrder) : product.isMakeToOrder,
                fittingOptions: Array.isArray(fittingOptions)
                    ? fittingOptions
                    : product.fittingOptions,
                stock: nextStock,
                isOutOfStock: nextOutOfStock,
            },
            include: { category: { select: { id: true, name: true } } },
        });
        res.json(formatProduct(updatedProduct));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await prisma_1.prisma.product.findUnique({ where: { id: req.params.id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await prisma_1.prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
const getTopProducts = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 5;
        const products = await prisma_1.prisma.product.findMany({
            orderBy: { averageRating: 'desc' },
            take: limit,
            include: { category: { select: { id: true, name: true } } },
        });
        res.json(products.map(formatProduct));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTopProducts = getTopProducts;
const updateProductPricing = async (req, res) => {
    try {
        const product = await prisma_1.prisma.product.findUnique({ where: { id: req.params.id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { price, stock, isOutOfStock } = req.body;
        const nextPrice = price !== undefined && !isNaN(Number(price)) ? Number(price) : product.price;
        const nextStock = stock !== undefined && !isNaN(Number(stock)) ? Number(stock) : product.stock;
        const nextOutOfStock = isOutOfStock !== undefined
            ? Boolean(isOutOfStock)
            : stock !== undefined && !isNaN(Number(stock))
                ? Number(stock) <= 0
                : product.isOutOfStock;
        const updated = await prisma_1.prisma.product.update({
            where: { id: req.params.id },
            data: {
                price: nextPrice,
                stock: nextStock,
                isOutOfStock: nextOutOfStock,
            },
            include: { category: { select: { id: true, name: true } } },
        });
        res.json({
            success: true,
            message: 'Product pricing updated successfully',
            product: formatProduct(updated),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProductPricing = updateProductPricing;
//# sourceMappingURL=product.controller.js.map