import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  targetUsers: 'all' | 'specific' | 'admin';
  userIds?: mongoose.Types.ObjectId[];
  isRead: boolean;
  readBy: mongoose.Types.ObjectId[];
  expiresAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a notification title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a notification message'],
      maxlength: [500, 'Message cannot be more than 500 characters'],
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    targetUsers: {
      type: String,
      enum: ['all', 'specific', 'admin'],
      default: 'all',
    },
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    expiresAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
NotificationSchema.index({ targetUsers: 1, isRead: 1 });
NotificationSchema.index({ userIds: 1 });
NotificationSchema.index({ expiresAt: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);