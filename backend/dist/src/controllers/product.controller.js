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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../models/product.model");
const category_model_1 = require("../models/category.model");
const analytics_model_1 = require("../models/analytics.model");
// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        // Build filter object
        const filterObj = {};
        // Category filter
        if (req.query.category) {
            filterObj.category = req.query.category;
        }
        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filterObj.price = {};
            if (req.query.minPrice)
                filterObj.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice)
                filterObj.price.$lte = Number(req.query.maxPrice);
        }
        // Size filter
        if (req.query.size) {
            filterObj.sizes = Number(req.query.size);
        }
        // Out of stock filter
        if (req.query.inStock === 'true') {
            filterObj.isOutOfStock = false;
        }
        // Make to order filter
        if (req.query.isMakeToOrder) {
            filterObj.isMakeToOrder = req.query.isMakeToOrder === 'true';
        }
        // Dynamic filters (color, fabric, etc.)
        const dynamicFilters = req.query.filters;
        if (dynamicFilters && typeof dynamicFilters === 'object') {
            Object.entries(dynamicFilters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    filterObj[`filters.${key}`] = { $in: value };
                }
                else {
                    filterObj[`filters.${key}`] = value;
                }
            });
        }
        // Search by name or description
        if (req.query.keyword) {
            filterObj.$or = [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
            ];
        }
        // Sort options
        let sortOption = {};
        const sortBy = req.query.sortBy;
        if (sortBy) {
            switch (sortBy) {
                case 'priceAsc':
                    sortOption = { price: 1 };
                    break;
                case 'priceDesc':
                    sortOption = { price: -1 };
                    break;
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                case 'rating':
                    sortOption = { averageRating: -1 };
                    break;
                case 'popularity':
                    sortOption = { numReviews: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }
        else {
            sortOption = { createdAt: -1 };
        }
        // Execute query with pagination
        const count = yield product_model_1.Product.countDocuments(filterObj);
        const products = yield product_model_1.Product.find(filterObj)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('category', 'name');
        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProducts = getProducts;
// @desc    Get single product by ID with reviews
// @route   GET /api/products/:id
// @access  Public
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = yield product_model_1.Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Track product view for analytics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const viewAnalytics = yield analytics_model_1.ViewAnalytics.findOne({
            product: product._id,
            date: { $gte: today },
        });
        if (viewAnalytics) {
            viewAnalytics.views += 1;
            yield viewAnalytics.save();
        }
        else {
            yield analytics_model_1.ViewAnalytics.create({
                product: product._id,
                views: 1,
                date: today,
            });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProductById = getProductById;
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, images, category, filters, sizes, isMakeToOrder, fittingOptions, stock, } = req.body;
        // Validate category exists
        const categoryExists = yield category_model_1.Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        // Create product
        const product = yield product_model_1.Product.create({
            name,
            description,
            price,
            images,
            category,
            filters: new Map(Object.entries(filters || {})),
            sizes,
            isMakeToOrder,
            fittingOptions,
            stock,
            isOutOfStock: stock <= 0,
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { name, description, price, images, category, filters, sizes, isMakeToOrder, fittingOptions, stock, isOutOfStock, } = req.body;
        // Update fields if provided
        if (name)
            product.name = name;
        if (description)
            product.description = description;
        if (price)
            product.price = price;
        if (images)
            product.images = images;
        if (category) {
            // Validate category exists
            const categoryExists = yield category_model_1.Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid category' });
            }
            product.category = category;
        }
        if (filters)
            product.filters = new Map(Object.entries(filters));
        if (sizes)
            product.sizes = sizes;
        if (isMakeToOrder !== undefined)
            product.isMakeToOrder = isMakeToOrder;
        if (fittingOptions)
            product.fittingOptions = fittingOptions;
        if (stock !== undefined) {
            product.stock = stock;
            product.isOutOfStock = stock <= 0;
        }
        if (isOutOfStock !== undefined)
            product.isOutOfStock = isOutOfStock;
        const updatedProduct = yield product.save();
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateProduct = updateProduct;
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        yield product.deleteOne();
        res.json({ message: 'Product removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 5;
        const products = yield product_model_1.Product.find({})
            .sort({ averageRating: -1 })
            .limit(limit);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTopProducts = getTopProducts;
//# sourceMappingURL=product.controller.js.map