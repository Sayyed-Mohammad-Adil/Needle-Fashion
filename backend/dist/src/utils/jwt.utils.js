"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokenPair = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate access token
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id.toString(),
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};
exports.generateAccessToken = generateAccessToken;
// Generate refresh token
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id.toString(),
        email: user.email
    }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
// Generate both tokens
const generateTokenPair = (user) => {
    return {
        accessToken: (0, exports.generateAccessToken)(user),
        refreshToken: (0, exports.generateRefreshToken)(user)
    };
};
exports.generateTokenPair = generateTokenPair;
// Verify access token
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    }
    catch (error) {
        throw new Error('Invalid access token');
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
// Legacy function for backward compatibility
exports.generateToken = exports.generateAccessToken;
exports.verifyToken = exports.verifyAccessToken;
//# sourceMappingURL=jwt.utils.js.map