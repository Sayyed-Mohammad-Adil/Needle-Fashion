"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.getUserMeasurements = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.removeFromWishlist = exports.addToWishlist = exports.addUserMeasurement = exports.updateUserProfile = exports.getUserProfile = exports.googleAuth = exports.loginUser = exports.refreshToken = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const prisma_1 = require("../lib/prisma");
const jwt_utils_1 = require("../utils/jwt.utils");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function hashPassword(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
}
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const userExists = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                address,
            },
        });
        const tokens = (0, jwt_utils_1.generateTokenPair)(user);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        const decoded = (0, jwt_utils_1.verifyRefreshToken)(refreshToken);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const newAccessToken = (0, jwt_utils_1.generateAccessToken)(user);
        res.json({ accessToken: newAccessToken });
    }
    catch {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (user && (await bcryptjs_1.default.compare(password, user.password))) {
            const tokens = (0, jwt_utils_1.generateTokenPair)(user);
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
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const googleAuth = async (req, res) => {
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
        let user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            const randomPassword = await hashPassword(Math.random().toString(36).slice(-12));
            user = await prisma_1.prisma.user.create({
                data: { name, email, password: randomPassword },
            });
        }
        const tokens = (0, jwt_utils_1.generateTokenPair)(user);
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
    }
    catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({ message: 'Google authentication failed' });
    }
};
exports.googleAuth = googleAuth;
const getUserProfile = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
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
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const data = {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
            phone: req.body.phone !== undefined ? req.body.phone : user.phone,
            address: req.body.address !== undefined ? req.body.address : user.address,
        };
        if (req.body.password) {
            data.password = await hashPassword(req.body.password);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
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
            accessToken: (0, jwt_utils_1.generateAccessToken)(updatedUser),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateUserProfile = updateUserProfile;
const addUserMeasurement = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { chest, waist, length, sleeve, shoulder, neck, photo } = req.body;
        const current = Array.isArray(user.savedMeasurements)
            ? user.savedMeasurements
            : [];
        const nextMeasurements = [
            ...current,
            { chest, waist, length, sleeve, shoulder, neck, photo },
        ];
        const updated = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: { savedMeasurements: nextMeasurements },
        });
        res.status(201).json(updated.savedMeasurements);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addUserMeasurement = addUserMeasurement;
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        const updated = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: { wishlist: [...user.wishlist, productId] },
        });
        res.status(200).json(updated.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updated = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: { wishlist: user.wishlist.filter((id) => id !== productId) },
        });
        res.status(200).json(updated.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeFromWishlist = removeFromWishlist;
const getUsers = async (_req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany({
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
        res.json((0, prisma_1.withMongoIds)(users));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
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
            res.json((0, prisma_1.withMongoId)(user));
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const data = {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
            role: req.body.role || user.role,
            phone: req.body.phone !== undefined ? req.body.phone : user.phone,
            address: req.body.address !== undefined ? req.body.address : user.address,
        };
        if (req.body.password) {
            data.password = await hashPassword(req.body.password);
        }
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id: req.params.id },
            data,
        });
        res.json((0, prisma_1.withMongoId)(updatedUser));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const existing = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: 'User not found' });
        }
        await prisma_1.prisma.user.delete({ where: { id } });
        return res.json({ message: 'User removed' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Server error' });
    }
};
exports.deleteUser = deleteUser;
const getUserMeasurements = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.savedMeasurements);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserMeasurements = getUserMeasurements;
const getWishlist = async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getWishlist = getWishlist;
//# sourceMappingURL=user.controller.js.map