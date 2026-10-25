import mongoose, { Document, Schema } from 'mongoose';

export interface IFilter extends Document {
  name: string; // e.g., 'Color', 'Fabric', 'Work'
  values: string[]; // e.g., ['Red', 'Blue', 'Green'] for Color
  createdAt: Date;
  updatedAt: Date;
}

const FilterSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a filter name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    values: [
      {
        type: String,
        required: [true, 'Please provide filter values'],
      },
    ],
  },
  { timestamps: true }
);

export const Filter = mongoose.model<IFilter>('Filter', FilterSchema);