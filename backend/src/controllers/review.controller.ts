import { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, images } = req.body;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user?._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product (for verified purchase badge)
    const verifiedPurchase = await Order.findOne({
      user: req.user?._id,
      'items.product': productId,
      isPaid: true,
    });

    // Create review
    const review = await Review.create({
      user: req.user?._id,
      product: productId,
      rating,
      comment,
      images,
      isVerifiedPurchase: !!verifiedPurchase,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.averageRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    // Build filter object
    const filterObj: any = { product: productId };

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
    const sortBy = req.query.sortBy as string;
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
    } else {
      sortOption = { createdAt: -1 };
    }

    // Execute query with pagination
    const count = await Review.countDocuments(filterObj);
    const reviews = await Review.find(filterObj)
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is authorized to update review
    if (
      review.user.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, comment, images } = req.body;

    // Update review fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    // If admin is updating, they can change approval status
    if (req.user?.role === 'admin' && req.body.isApproved !== undefined) {
      review.isApproved = req.body.isApproved;
    }

    const updatedReview = await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      const reviews = await Review.find({ product: review.product });
      product.numReviews = reviews.length;
      product.averageRating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      await product.save();
    }

    res.json(updatedReview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is authorized to delete review
    if (
      review.user.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      const reviews = await Review.find({ product: review.product });
      product.numReviews = reviews.length;
      product.averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
          : 0;

      await product.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
export const reportReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const { reason } = req.body;

    review.isFlagged = true;
    review.flagReason = reason || 'Reported by user';

    await review.save();

    res.json({ message: 'Review reported successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpfulCount += 1;
    await review.save();

    res.json({ message: 'Review marked as helpful', helpfulCount: review.helpfulCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for admin (including flagged and pending)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    // Build filter object
    const filterObj: any = {};

    // Filter by flagged status
    if (req.query.flagged === 'true') {
      filterObj.isFlagged = true;
    }

    // Filter by approval status
    if (req.query.approved === 'false') {
      filterObj.isApproved = false;
    }

    // Execute query with pagination
    const count = await Review.countDocuments(filterObj);
    const reviews = await Review.find(filterObj)
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};