import jwt from 'jsonwebtoken';

export interface AuthUserLike {
  id: string;
  _id?: string;
  email: string;
  role: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessToken = (user: AuthUserLike): string => {
  const userId = user.id || user._id || '';
  return jwt.sign(
    {
      id: userId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as jwt.SignOptions
  );
};

export const generateRefreshToken = (user: AuthUserLike): string => {
  const userId = user.id || user._id || '';
  return jwt.sign(
    {
      id: userId,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    } as jwt.SignOptions
  );
};

export const generateTokenPair = (user: AuthUserLike): TokenPair => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as TokenPayload;
  } catch {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
  } catch {
    throw new Error('Invalid refresh token');
  }
};

export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
