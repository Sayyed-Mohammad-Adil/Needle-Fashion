import mongoose, { Document, Schema } from 'mongoose';

export interface ITheme extends Document {
  name: string;
  description?: string;
  isDefault: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    borderRadius: string;
    spacing: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a theme name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    colors: {
      primary: {
        type: String,
        required: [true, 'Please provide a primary color'],
      },
      secondary: {
        type: String,
        required: [true, 'Please provide a secondary color'],
      },
      accent: {
        type: String,
        required: [true, 'Please provide an accent color'],
      },
      background: {
        type: String,
        required: [true, 'Please provide a background color'],
      },
      text: {
        type: String,
        required: [true, 'Please provide a text color'],
      },
      border: {
        type: String,
        required: [true, 'Please provide a border color'],
      },
    },
    fonts: {
      heading: {
        type: String,
        required: [true, 'Please provide a heading font'],
      },
      body: {
        type: String,
        required: [true, 'Please provide a body font'],
      },
    },
    layout: {
      borderRadius: {
        type: String,
        required: [true, 'Please provide a border radius'],
      },
      spacing: {
        type: String,
        required: [true, 'Please provide spacing'],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Theme = mongoose.model<ITheme>('Theme', ThemeSchema);