import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId?: mongoose.Types.ObjectId;
  userName?: string;
  sessionId: string;
  messages: IChatMessage[];
  lastMessage?: {
    content: string;
    role: string;
    timestamp: Date;
  };
  context: {
    productId?: mongoose.Types.ObjectId;
    orderId?: mongoose.Types.ObjectId;
    category?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const ChatMessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'admin'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatSessionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: String, // Cache name for admin UI
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    messages: [ChatMessageSchema],
    lastMessage: {
      content: String,
      role: String,
      timestamp: Date
    },
    context: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      category: {
        type: String,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
  },
  { timestamps: true }
);

// Index for efficient querying
ChatSessionSchema.index({ userId: 1 });
ChatSessionSchema.index({ sessionId: 1 });
ChatSessionSchema.index({ isActive: 1 });
ChatSessionSchema.index({ expiresAt: 1 });

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);