import { Request, Response } from 'express';
import { prisma, withMongoId } from '../lib/prisma';

async function syncProductRating(productId: string) {
  const reviews = await prisma.review.findMany({ where: { productId } });
  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews : 0;

  await prisma.product.update({
    where: { id: productId },
    data: { numReviews, averageRating },
  });
}

export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, images } = req.body;
    const productId = req.params.id;
    const userId = req.user!.id;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const verifiedPurchase = await prisma.order.findFirst({
      where: {
        userId,
        isPaid: true,
        items: { some: { productId } },
      },
    });

    const review = await prisma.review.create({
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
    res.status(201).json(withMongoId(review));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const where: any = { productId, isApproved: true };
    if (req.query.rating) where.rating = Number(req.query.rating);
    if (req.query.verified === 'true') where.isVerifiedPurchase = true;

    let orderBy: any = { createdAt: 'desc' };
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
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        orderBy,
        take: pageSize,
        skip: pageSize * (page - 1),
        include: { user: { select: { id: true, name: true } } },
      }),
    ]);

    res.json({
      reviews: reviews.map((r) => ({
        ...withMongoId(r),
        user: withMongoId(r.user),
      })),
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user!.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, comment, images, isApproved } = req.body;
    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        rating: rating !== undefined ? Number(rating) : review.rating,
        comment: comment ?? review.comment,
        images: Array.isArray(images) ? images : review.images,
        isApproved:
          req.user?.role === 'admin' && isApproved !== undefined
            ? Boolean(isApproved)
            : review.isApproved,
      },
    });

    await syncProductRating(review.productId);
    res.json(withMongoId(updatedReview));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId !== req.user!.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    await syncProductRating(review.productId);
    res.json({ message: 'Review removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const reportReview = async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await prisma.review.update({
      where: { id: req.params.id },
      data: {
        isFlagged: true,
        flagReason: req.body.reason || 'Reported by user',
      },
    });

    res.json({ message: 'Review reported successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: { helpfulCount: { increment: 1 } },
    });

    res.json({ message: 'Review marked as helpful', helpfulCount: updated.helpfulCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const where: any = {};
    if (req.query.flagged === 'true') where.isFlagged = true;
    if (req.query.approved === 'false') where.isApproved = false;

    const [count, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
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
        ...withMongoId(r),
        user: withMongoId(r.user),
        product: withMongoId(r.product),
      })),
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
