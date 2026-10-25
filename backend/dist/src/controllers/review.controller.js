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
exports.getAdminReviews = exports.markReviewHelpful = exports.reportReview = exports.deleteReview = exports.updateReview = exports.getProductReviews = exports.createReview = void 0;
const review_model_1 = require("../models/review.model");
const product_model_1 = require("../models/product.model");
const order_model_1 = require("../models/order.model");
// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { rating, comment, images } = req.body;
        const productId = req.params.id;
        // Check if product exists
        const product = yield product_model_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if user already reviewed this product
        const alreadyReviewed = yield review_model_1.Review.findOne({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            product: productId,
        });
        if (alreadyReviewed) {
            return res
                .status(400)
                .json({ message: 'You have already reviewed this product' });
        }
        // Check if user has purchased this product (for verified purchase badge)
        const verifiedPurchase = yield order_model_1.Order.findOne({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            'items.product': productId,
            isPaid: true,
        });
        // Create review
        const review = yield review_model_1.Review.create({
            user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
            product: productId,
            rating,
            comment,
            images,
            isVerifiedPurchase: !!verifiedPurchase,
        });
        // Update product rating
        const reviews = yield review_model_1.Review.find({ product: productId });
        product.numReviews = reviews.length;
        product.averageRating =
            reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        yield product.save();
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createReview = createReview;
// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        // Build filter object
        const filterObj = { product: productId };
        // Filter by rating
        if (req.query.rating) {
            filterObj.rating = Number(req.query.rating);
        }
        // Filter by verified purchase
        if (req.query.verified === 'true') {
            filterObj.isVerifiedPurchase = true;
        }
        // Only show approved reviews
        filterObj.isApproved = true;
        // Sort options
        let sortOption = {};
        const sortBy = req.query.sortBy;
        if (sortBy) {
            switch (sortBy) {
                case 'helpful':
                    sortOption = { helpfulCount: -1 };
                    break;
                case 'recent':
                    sortOption = { createdAt: -1 };
                    break;
                case 'highest':
                    sortOption = { rating: -1 };
                    break;
                case 'lowest':
                    sortOption = { rating: 1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }
        else {
            sortOption = { createdAt: -1 };
        }
        // Execute query with pagination
        const count = yield review_model_1.Review.countDocuments(filterObj);
        const reviews = yield review_model_1.Review.find(filterObj)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('user', 'name');
        res.json({
            reviews,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProductReviews = getProductReviews;
// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const review = yield review_model_1.Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Check if user is authorized to update review
        if (review.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) &&
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }
        const { rating, comment, images } = req.body;
        // Update review fields
        if (rating)
            review.rating = rating;
        if (comment)
            review.comment = comment;
        if (images)
            review.images = images;
        // If admin is updating, they can change approval status
        if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === 'admin' && req.body.isApproved !== undefined) {
            review.isApproved = req.body.isApproved;
        }
        const updatedReview = yield review.save();
        // Update product rating
        const product = yield product_model_1.Product.findById(review.product);
        if (product) {
            const reviews = yield review_model_1.Review.find({ product: review.product });
            product.numReviews = reviews.length;
            product.averageRating =
                reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            yield product.save();
        }
        res.json(updatedReview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateReview = updateReview;
// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const review = yield review_model_1.Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Check if user is authorized to delete review
        if (review.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) &&
            ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        yield review.deleteOne();
        // Update product rating
        const product = yield product_model_1.Product.findById(review.product);
        if (product) {
            const reviews = yield review_model_1.Review.find({ product: review.product });
            product.numReviews = reviews.length;
            product.averageRating =
                reviews.length > 0
                    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
                    : 0;
            yield product.save();
        }
        res.json({ message: 'Review removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteReview = deleteReview;
// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
const reportReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_model_1.Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const { reason } = req.body;
        review.isFlagged = true;
        review.flagReason = reason || 'Reported by user';
        yield review.save();
        res.json({ message: 'Review reported successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.reportReview = reportReview;
// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markReviewHelpful = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield review_model_1.Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        review.helpfulCount += 1;
        yield review.save();
        res.json({ message: 'Review marked as helpful', helpfulCount: review.helpfulCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.markReviewHelpful = markReviewHelpful;
// @desc    Get all reviews for admin (including flagged and pending)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAdminReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        // Build filter object
        const filterObj = {};
        // Filter by flagged status
        if (req.query.flagged === 'true') {
            filterObj.isFlagged = true;
        }
        // Filter by approval status
        if (req.query.approved === 'false') {
            filterObj.isApproved = false;
        }
        // Execute query with pagination
        const count = yield review_model_1.Review.countDocuments(filterObj);
        const reviews = yield review_model_1.Review.find(filterObj)
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('user', 'name')
            .populate('product', 'name');
        res.json({
            reviews,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAdminReviews = getAdminReviews;
//# sourceMappingURL=review.controller.js.map