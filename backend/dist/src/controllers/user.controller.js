"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.getUserMeasurements = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.removeFromWishlist = exports.addToWishlist = exports.addUserMeasurement = exports.updateUserProfile = exports.getUserProfile = exports.googleAuth = exports.loginUser = exports.refreshToken = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const jwt_utils_1 = require("../utils/jwt.utils");
const google_auth_library_1 = require("google-auth-library");
const mongoose_1 = __importDefault(require("mongoose"));
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, address } = req.body;
        // Check if user already exists
        const userExists = yield user_model_1.User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = yield user_model_1.User.create({
            name,
            email,
            password,
            phone,
            address,
        });
        if (user) {
            const tokens = (0, jwt_utils_1.generateTokenPair)(user);
            res.status(201).json(Object.assign({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address }, tokens));
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        // Verify refresh token
        const decoded = (0, jwt_utils_1.verifyRefreshToken)(refreshToken);
        // Get user from token
        const user = yield user_model_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        // Generate new access token
        const newAccessToken = (0, jwt_utils_1.generateAccessToken)(user);
        res.json({
            accessToken: newAccessToken
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});
exports.refreshToken = refreshToken;
// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield user_model_1.User.findOne({ email }).select('+password');
        // Check if user exists and password matches
        if (user && (yield user.comparePassword(password))) {
            const tokens = (0, jwt_utils_1.generateTokenPair)(user);
            res.json(Object.assign({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address }, tokens));
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
// @desc    Login/Register with Google OAuth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: 'idToken is required' });
        }
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ message: 'Google client ID is not configured on the server' });
        }
        const ticket = yield googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Unable to verify Google account' });
        }
        const email = payload.email;
        const name = payload.name ||
            payload.given_name ||
            email.split('@')[0];
        let user = yield user_model_1.User.findOne({ email });
        // If user doesn't exist, create one
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-12);
            user = yield user_model_1.User.create({
                name,
                email,
                password: randomPassword,
            });
        }
        const tokens = (0, jwt_utils_1.generateTokenPair)(user);
        return res.json(Object.assign({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address }, tokens));
    }
    catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({ message: 'Google authentication failed' });
    }
});
exports.googleAuth = googleAuth;
// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        res.set('Cache-Control', 'no-store');
        if (user) {
            res.json({
                _id: user._id,
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
});
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        // Update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = yield user.save();
        res.json({
            _id: updatedUser._id,
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
});
exports.updateUserProfile = updateUserProfile;
// @desc    Add measurement to user profile
// @route   POST /api/users/measurements
// @access  Private
const addUserMeasurement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { chest, waist, length, sleeve, shoulder, neck, photo } = req.body;
        // Add new measurement
        user.savedMeasurements.push({
            chest,
            waist,
            length,
            sleeve,
            shoulder,
            neck,
            photo,
        });
        yield user.save();
        res.status(201).json(user.savedMeasurements);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addUserMeasurement = addUserMeasurement;
// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.body;
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if product already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        // Add to wishlist
        user.wishlist.push(productId);
        yield user.save();
        res.status(200).json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addToWishlist = addToWishlist;
// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.params;
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Remove from wishlist
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        yield user.save();
        res.status(200).json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeFromWishlist = removeFromWishlist;
// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find({});
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserById = getUserById;
// @desc    Update user by ID (admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = yield user.save();
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
// @desc    Delete user by ID (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Optional: validate MongoDB ObjectId format
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const user = yield user_model_1.User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ message: 'User removed' });
    }
    catch (error) {
        // You can type error as unknown and narrow down if needed
        return res.status(500).json({ message: error.message || 'Server error' });
    }
});
exports.deleteUser = deleteUser;
// @desc    Get user's saved measurements
// @route   GET /api/users/measurements
// @access  Private
const getUserMeasurements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.savedMeasurements);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserMeasurements = getUserMeasurements;
// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.wishlist);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getWishlist = getWishlist;
//# sourceMappingURL=user.controller.js.map