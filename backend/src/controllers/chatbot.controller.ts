import { Request, Response } from 'express';
import { ChatSession } from '../models/chatbot.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

// @desc    Get chat session
// @route   GET /api/chat/sessions/:sessionId
// @access  Public
export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await ChatSession.find({ isActive: true })
      .sort({ updatedAt: -1 })
      .populate('userId', 'name email');
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?._id;

    // Find existing session
    let session = await ChatSession.findOne({
      sessionId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    // If no session found, create a new one
    if (!session) {
      session = await ChatSession.create({
        sessionId,
        userId,
        messages: [],
        context: {},
      });
    }

    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message to chatbot
// @route   POST /api/chat/sessions/:sessionId/messages
// @access  Public
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message, context } = req.body;
    const userId = req.user?._id;

    // Find or create session
    let session = await ChatSession.findOne({
      sessionId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      session = await ChatSession.create({
        sessionId,
        userId,
        messages: [],
        context: context || {},
      });
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Generate bot response based on message content and context
    const botResponse = await generateBotResponse(message, session.context);

    // Add bot response to session
    session.messages.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date(),
    });

    // Update context if provided in the response
    if (context) {
      session.context = { ...session.context, ...context };
    }

    // Extend expiration
    session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Update last message summary
    session.lastMessage = {
      content: botResponse,
      role: 'assistant',
      timestamp: new Date()
    };

    const updatedSession = await session.save();
    res.json(updatedSession);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End chat session
// @route   PUT /api/chat/sessions/:sessionId/end
// @access  Public
export const endChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOneAndUpdate(
      { sessionId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Chat session not found or already ended' });
    }

    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history for user
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const count = await ChatSession.countDocuments({
      userId: req.user?._id,
      isActive: false,
    });

    const sessions = await ChatSession.find({
      userId: req.user?._id,
      isActive: false,
    })
      .sort({ updatedAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      sessions,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Simple bot response generation function
const generateBotResponse = async (userMessage: string, context: any): Promise<string> => {
  userMessage = userMessage.toLowerCase();

  // Handle order tracking requests
  if (userMessage.includes('order') && userMessage.includes('status')) {
    if (context.orderId) {
      try {
        const order = await Order.findById(context.orderId).select('status');
        if (order) {
          return `Your order #${context.orderId} is currently ${order.status}.`;
        }
      } catch (error) {
        // Ignore error and continue with generic response
      }
    }
    return "I can help you track your order. Please provide your order ID or check your order history in your account.";
  }

  // Handle product inquiries
  if (userMessage.includes('product') || userMessage.includes('kurta') || userMessage.includes('sherwani')) {
    if (context.productId) {
      try {
        const product = await Product.findById(context.productId).select('name price');
        if (product) {
          return `The ${product.name} is available for ₹${product.price}. Would you like to know more about this product?`;
        }
      } catch (error) {
        // Ignore error and continue with generic response
      }
    }
    return "We have a wide range of ethnic wear including kurtas, sherwanis, and kurta-jacket sets. Would you like me to recommend some products based on your preferences?";
  }

  // Handle size and measurement questions
  if (userMessage.includes('size') || userMessage.includes('measurement') || userMessage.includes('fit')) {
    return "For the perfect fit, you can choose from standard sizes (36-50) or opt for custom measurements. Our make-to-order service ensures a perfect fit based on your measurements. Would you like to know more about our custom fitting options?";
  }

  // Handle pricing and offers
  if (userMessage.includes('price') || userMessage.includes('offer') || userMessage.includes('discount')) {
    return "We regularly offer discounts and special promotions. Check our offers page or subscribe to our newsletter to stay updated on the latest deals. Is there a specific product you're interested in?";
  }

  // Handle shipping and delivery
  if (userMessage.includes('shipping') || userMessage.includes('delivery') || userMessage.includes('return')) {
    return "We offer free shipping on orders above ₹2000. Standard delivery takes 5-7 business days. Returns are accepted within 15 days of delivery. Would you like more details about our shipping or return policy?";
  }

  // Handle account and login
  if (userMessage.includes('account') || userMessage.includes('login') || userMessage.includes('register')) {
    return "You can create an account or log in to access your order history, save your measurements, and manage your wishlist. Would you like me to guide you through the process?";
  }

  // Default response
  return "I'm here to help you with your shopping experience. You can ask me about products, orders, sizing, offers, or any other questions you might have. How can I assist you today?";
};