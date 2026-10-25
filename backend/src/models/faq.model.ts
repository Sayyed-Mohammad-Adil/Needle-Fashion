import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Please provide a question'],
      trim: true,
      maxlength: [200, 'Question cannot be more than 200 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Please provide an answer'],
      trim: true,
      maxlength: [1000, 'Answer cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);