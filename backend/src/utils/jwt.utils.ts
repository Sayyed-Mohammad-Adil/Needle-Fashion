import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Generate access token
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id.toString(),
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions
  );
};

// Generate refresh token
export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id.toString(),
      email: user.email
    },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    } as jwt.SignOptions
  );
};

// Generate both tokens
export const generateTokenPair = (user: IUser): TokenPair => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as TokenPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Legacy function for backward compatibility
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;