import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  data: string; // Base64 encoded image
  alt?: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: IProductImage[];
  category: mongoose.Types.ObjectId;
  filters: Map<string, string[]>; // Filter type to values mapping
  sizes: number[];
  isMakeToOrder: boolean;
  isOutOfStock: boolean;
  fittingOptions: string[];
  stock: number;
  averageRating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be positive'],
    },
    images: [
      {
        data: {
          type: String, // Base64 encoded image
          required: [true, 'Please provide an image'],
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    filters: {
      type: Map,
      of: [String],
      default: new Map(),
    },
    sizes: [
      {
        type: Number,
        min: 36,
        max: 50,
      },
    ],
    isMakeToOrder: {
      type: Boolean,
      default: true,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
    fittingOptions: [
      {
        type: String,
        enum: ['Loose', 'Medium', 'Fit'],
        default: 'Medium',
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);