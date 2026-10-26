import mongoose, { Document, Schema } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  type: 'Bespoke Commission' | 'Atelier Fitting' | 'Custom Measurement' | 'Order Inquiry' | 'General';
  subject: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  productId?: mongoose.Types.ObjectId;
  productName?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    sleeve?: number;
    shoulder?: number;
    neck?: number;
    fitting?: string;
  };
  status: 'Pending' | 'Contacted' | 'Fitting Scheduled' | 'In Progress' | 'Fulfilled' | 'Archived';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide client contact number'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'Bespoke Commission',
        'Atelier Fitting',
        'Custom Measurement',
        'Order Inquiry',
        'General',
      ],
      default: 'Bespoke Commission',
    },
    subject: {
      type: String,
      required: [true, 'Please provide request subject'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please provide request details'],
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    preferredDate: {
      type: String,
    },
    preferredTime: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    productName: {
      type: String,
    },
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      length: { type: Number },
      sleeve: { type: Number },
      shoulder: { type: Number },
      neck: { type: Number },
      fitting: { type: String, default: 'Medium' },
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Contacted',
        'Fitting Scheduled',
        'In Progress',
        'Fulfilled',
        'Archived',
      ],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance searching
InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ email: 1 });
InquirySchema.index({ phone: 1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
