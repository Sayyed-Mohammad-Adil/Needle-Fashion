import { Request, Response } from 'express';
import { prisma, withMongoId } from '../lib/prisma';

function formatProduct(p: any) {
  return {
    ...withMongoId(p),
    category: p.category ? withMongoId(p.category) : p.categoryId,
  };
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    const where: any = {};

    if (req.query.category) {
      where.categoryId = String(req.query.category);
    }

    if (req.query.minPrice || req.query.maxPrice) {
      where.price = {};
      if (req.query.minPrice) where.price.gte = Number(req.query.minPrice);
      if (req.query.maxPrice) where.price.lte = Number(req.query.maxPrice);
    }

    if (req.query.size) {
      where.sizes = { has: Number(req.query.size) };
    }

    if (req.query.inStock === 'true') {
      where.isOutOfStock = false;
    } else if (req.query.inStock === 'false') {
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

    let orderBy: any = { createdAt: 'desc' };
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

    let products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { id: true, name: true } } },
    });

    // Apply dynamic JSON filters if provided
    const dynamicFilters = req.query.filters;
    if (dynamicFilters && typeof dynamicFilters === 'object') {
      const entries = Object.entries(dynamicFilters as Record<string, any>);
      products = products.filter((prod) => {
        const prodFilters = (prod.filters as Record<string, string[]>) || {};
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: { select: { id: true, name: true } } },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await prisma.viewAnalytics.findFirst({
      where: {
        productId: product.id,
        date: { gte: today },
      },
    });

    if (existingView) {
      await prisma.viewAnalytics.update({
        where: { id: existingView.id },
        data: { views: { increment: 1 } },
      });
    } else {
      await prisma.viewAnalytics.create({
        data: { productId: product.id, views: 1, date: today },
      });
    }

    res.json(formatProduct(product));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      filters,
      sizes,
      isMakeToOrder,
      fittingOptions,
      stock,
    } = req.body;

    const categoryExists = await prisma.category.findUnique({
      where: { id: String(category) },
    });
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const formattedImages = Array.isArray(images)
      ? images.map((img: any) =>
          typeof img === 'string'
            ? { data: img, alt: name || '' }
            : { data: img.data || img.url || '', alt: img.alt || '' }
        )
      : [];

    const numericStock = Number(stock ?? 0);
    const product = await prisma.product.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      images,
      category,
      filters,
      sizes,
      isMakeToOrder,
      fittingOptions,
      stock,
      isOutOfStock,
    } = req.body;

    let categoryId = product.categoryId;
    if (category) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: String(category) },
      });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      categoryId = categoryExists.id;
    }

    const formattedImages = images
      ? Array.isArray(images)
        ? images.map((img: any) =>
            typeof img === 'string'
              ? { data: img, alt: name || product.name || '' }
              : { data: img.data || img.url || '', alt: img.alt || '' }
          )
        : images
      : product.images;

    const nextStock = stock !== undefined ? Number(stock) : product.stock;
    const nextOutOfStock =
      isOutOfStock !== undefined
        ? Boolean(isOutOfStock)
        : stock !== undefined
          ? nextStock <= 0
          : product.isOutOfStock;

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: name ?? product.name,
        description: description ?? product.description,
        price: price !== undefined ? Number(price) : product.price,
        images: formattedImages as any,
        categoryId,
        filters: filters !== undefined ? filters : (product.filters as any),
        sizes: Array.isArray(sizes) ? sizes.map(Number) : product.sizes,
        isMakeToOrder:
          isMakeToOrder !== undefined ? Boolean(isMakeToOrder) : product.isMakeToOrder,
        fittingOptions: Array.isArray(fittingOptions)
          ? fittingOptions
          : product.fittingOptions,
        stock: nextStock,
        isOutOfStock: nextOutOfStock,
      },
      include: { category: { select: { id: true, name: true } } },
    });

    res.json(formatProduct(updatedProduct));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const products = await prisma.product.findMany({
      orderBy: { averageRating: 'desc' },
      take: limit,
      include: { category: { select: { id: true, name: true } } },
    });
    res.json(products.map(formatProduct));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductPricing = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { price, stock, isOutOfStock } = req.body;
    const nextPrice =
      price !== undefined && !isNaN(Number(price)) ? Number(price) : product.price;
    const nextStock =
      stock !== undefined && !isNaN(Number(stock)) ? Number(stock) : product.stock;
    const nextOutOfStock =
      isOutOfStock !== undefined
        ? Boolean(isOutOfStock)
        : stock !== undefined && !isNaN(Number(stock))
          ? Number(stock) <= 0
          : product.isOutOfStock;

    const updated = await prisma.product.update({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
