import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';
import {
  generateTokenPair,
  verifyRefreshToken,
  generateAccessToken,
} from '../utils/jwt.utils';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
      },
    });

    const tokens = generateTokenPair(user);
    res.status(201).json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      ...tokens,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = generateTokenPair(user);
      res.json({
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        ...tokens,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'idToken is required' });
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google client ID is not configured on the server' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Unable to verify Google account' });
    }

    const email = payload.email;
    const name = payload.name || payload.given_name || email.split('@')[0];

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const randomPassword = await hashPassword(Math.random().toString(36).slice(-12));
      user = await prisma.user.create({
        data: { name, email, password: randomPassword },
      });
    }

    const tokens = generateTokenPair(user);
    return res.json({
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      ...tokens,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({ message: 'Google authentication failed' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    res.set('Cache-Control', 'no-store');
    if (user) {
      res.json({
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        savedMeasurements: user.savedMeasurements,
        wishlist: user.wishlist,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const data: any = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone !== undefined ? req.body.phone : user.phone,
      address: req.body.address !== undefined ? req.body.address : user.address,
    };

    if (req.body.password) {
      data.password = await hashPassword(req.body.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data,
    });

    res.json({
      _id: updatedUser.id,
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      accessToken: generateAccessToken(updatedUser),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserMeasurement = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { chest, waist, length, sleeve, shoulder, neck, photo } = req.body;
    const current = Array.isArray(user.savedMeasurements)
      ? (user.savedMeasurements as any[])
      : [];

    const nextMeasurements = [
      ...current,
      { chest, waist, length, sleeve, shoulder, neck, photo },
    ];

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { savedMeasurements: nextMeasurements },
    });

    res.status(201).json(updated.savedMeasurements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { wishlist: [...user.wishlist, productId] },
    });

    res.status(200).json(updated.wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: { wishlist: user.wishlist.filter((id) => id !== productId) },
    });

    res.status(200).json(updated.wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        savedMeasurements: true,
        wishlist: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(withMongoIds(users));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        savedMeasurements: true,
        wishlist: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (user) {
      res.json(withMongoId(user));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const data: any = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      role: req.body.role || user.role,
      phone: req.body.phone !== undefined ? req.body.phone : user.phone,
      address: req.body.address !== undefined ? req.body.address : user.address,
    };

    if (req.body.password) {
      data.password = await hashPassword(req.body.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });

    res.json(withMongoId(updatedUser));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'User removed' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message || 'Server error' });
  }
};

export const getUserMeasurements = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedMeasurements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.wishlist);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
