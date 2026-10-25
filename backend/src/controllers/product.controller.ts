import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Product, IProduct } from '../models/product.model';
import { Category } from '../models/category.model';
import { ViewAnalytics } from '../models/analytics.model';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    // Build filter object
    const filterObj: any = {};

    // Category filter
    if (req.query.category) {
      filterObj.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filterObj.price = {};
      if (req.query.minPrice) filterObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filterObj.price.$lte = Number(req.query.maxPrice);
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
      Object.entries(dynamicFilters as Record<string, any>).forEach(
        ([key, value]) => {
          if (Array.isArray(value)) {
            filterObj[`filters.${key}`] = { $in: value };
          } else {
            filterObj[`filters.${key}`] = value;
          }
        }
      );
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
    const sortBy = req.query.sortBy as string;
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
    } else {
      sortOption = { createdAt: -1 };
    }

    // Execute query with pagination
    const count = await Product.countDocuments(filterObj);
    const products = await Product.find(filterObj)
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID with reviews
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Track product view for analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const viewAnalytics = await ViewAnalytics.findOne({
      product: product._id,
      date: { $gte: today },
    });

    if (viewAnalytics) {
      viewAnalytics.views += 1;
      await viewAnalytics.save();
    } else {
      await ViewAnalytics.create({
        product: product._id,
        views: 1,
        date: today,
      });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
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

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Create product
    const product = await Product.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

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

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (images) product.images = images;
    if (category) {
      // Validate category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      product.category = category;
    }
    if (filters) product.filters = new Map(Object.entries(filters));
    if (sizes) product.sizes = sizes;
    if (isMakeToOrder !== undefined) product.isMakeToOrder = isMakeToOrder;
    if (fittingOptions) product.fittingOptions = fittingOptions;
    if (stock !== undefined) {
      product.stock = stock;
      product.isOutOfStock = stock <= 0;
    }
    if (isOutOfStock !== undefined) product.isOutOfStock = isOutOfStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const products = await Product.find({})
      .sort({ averageRating: -1 })
      .limit(limit);

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};