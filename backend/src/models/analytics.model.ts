import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchAnalytics extends Document {
  keyword: string;
  count: number;
  date: Date;
}

export interface IViewAnalytics extends Document {
  product: mongoose.Types.ObjectId;
  views: number;
  date: Date;
}

export interface ISalesAnalytics extends Document {
  product: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  quantity: number;
  revenue: number;
  date: Date;
  isMakeToOrder: boolean;
  size: number | 'custom';
  filters: Map<string, string>;
}

const SearchAnalyticsSchema: Schema = new Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ViewAnalyticsSchema: Schema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    views: {
      type: Number,
      default: 1,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const SalesAnalyticsSchema: Schema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    revenue: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isMakeToOrder: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Schema.Types.Mixed, // Can be a number or 'custom'
      required: true,
    },
    filters: {
      type: Map,
      of: String,
      default: new Map(),
    },
  },
  { timestamps: true }
);

export const SearchAnalytics = mongoose.model<ISearchAnalytics>(
  'SearchAnalytics',
  SearchAnalyticsSchema
);

export const ViewAnalytics = mongoose.model<IViewAnalytics>(
  'ViewAnalytics',
  ViewAnalyticsSchema
);

export const SalesAnalytics = mongoose.model<ISalesAnalytics>(
  'SalesAnalytics',
  SalesAnalyticsSchema
);