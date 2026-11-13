"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminReviews = exports.markReviewHelpful = exports.reportReview = exports.deleteReview = exports.updateReview = exports.getProductReviews = exports.createReview = void 0;
const prisma_1 = require("../lib/prisma");
async function syncProductRating(productId) {
    const reviews = await prisma_1.prisma.review.findMany({ where: { productId } });
    const numReviews = reviews.length;
    const averageRating = numReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews : 0;
    await prisma_1.prisma.product.update({
        where: { id: productId },
        data: { numReviews, averageRating },
    });
}
const createReview = async (req, res) => {
    try {
        const { rating, comment, images } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;
        const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const alreadyReviewed = await prisma_1.prisma.review.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        const verifiedPurchase = await prisma_1.prisma.order.findFirst({
            where: {
                userId,
                isPaid: true,
                items: { some: { productId } },
            },
        });
        const review = await prisma_1.prisma.review.create({
            data: {
                userId,
                productId,
                rating: Number(rating),
                comment,
                images: Array.isArray(images) ? images : [],
                isVerifiedPurchase: Boolean(verifiedPurchase),
            },
        });
        await syncProductRating(productId);
        res.status(201).json((0, prisma_1.withMongoId)(review));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createReview = createReview;
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const where = { productId, isApproved: true };
        if (req.query.rating)
            where.rating = Number(req.query.rating);
        if (req.query.verified === 'true')
            where.isVerifiedPurchase = true;
        let orderBy = { createdAt: 'desc' };
        switch (req.query.sortBy) {
            case 'helpful':
                orderBy = { helpfulCount: 'desc' };
                break;
            case 'highest':
                orderBy = { rating: 'desc' };
                break;
            case 'lowest':
                orderBy = { rating: 'asc' };
                break;
        }
        const [count, reviews] = await Promise.all([
            prisma_1.prisma.review.count({ where }),
            prisma_1.prisma.review.findMany({
                where,
                orderBy,
                take: pageSize,
                skip: pageSize * (page - 1),
                include: { user: { select: { id: true, name: true } } },
            }),
        ]);
        res.json({
            reviews: reviews.map((r) => ({
                ...(0, prisma_1.withMongoId)(r),
                user: (0, prisma_1.withMongoId)(r.user),
            })),
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductReviews = getProductReviews;
const updateReview = async (req, res) => {
    try {
        const review = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }
        const { rating, comment, images, isApproved } = req.body;
        const updatedReview = await prisma_1.prisma.review.update({
            where: { id: req.params.id },
            data: {
                rating: rating !== undefined ? Number(rating) : review.rating,
                comment: comment ?? review.comment,
                images: Array.isArray(images) ? images : review.images,
                isApproved: req.user?.role === 'admin' && isApproved !== undefined
                    ? Boolean(isApproved)
                    : review.isApproved,
            },
        });
        await syncProductRating(review.productId);
        res.json((0, prisma_1.withMongoId)(updatedReview));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    try {
        const review = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== req.user.id && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        await prisma_1.prisma.review.delete({ where: { id: req.params.id } });
        await syncProductRating(review.productId);
        res.json({ message: 'Review removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteReview = deleteReview;
const reportReview = async (req, res) => {
    try {
        const review = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        await prisma_1.prisma.review.update({
            where: { id: req.params.id },
            data: {
                isFlagged: true,
                flagReason: req.body.reason || 'Reported by user',
            },
        });
        res.json({ message: 'Review reported successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.reportReview = reportReview;
const markReviewHelpful = async (req, res) => {
    try {
        const review = await prisma_1.prisma.review.findUnique({ where: { id: req.params.id } });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const updated = await prisma_1.prisma.review.update({
            where: { id: req.params.id },
            data: { helpfulCount: { increment: 1 } },
        });
        res.json({ message: 'Review marked as helpful', helpfulCount: updated.helpfulCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markReviewHelpful = markReviewHelpful;
const getAdminReviews = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const where = {};
        if (req.query.flagged === 'true')
            where.isFlagged = true;
        if (req.query.approved === 'false')
            where.isApproved = false;
        const [count, reviews] = await Promise.all([
            prisma_1.prisma.review.count({ where }),
            prisma_1.prisma.review.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: pageSize,
                skip: pageSize * (page - 1),
                include: {
                    user: { select: { id: true, name: true } },
                    product: { select: { id: true, name: true } },
                },
            }),
        ]);
        res.json({
            reviews: reviews.map((r) => ({
                ...(0, prisma_1.withMongoId)(r),
                user: (0, prisma_1.withMongoId)(r.user),
                product: (0, prisma_1.withMongoId)(r.product),
            })),
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAdminReviews = getAdminReviews;
//# sourceMappingURL=review.controller.js.map