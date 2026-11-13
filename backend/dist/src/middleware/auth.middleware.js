"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const prisma_1 = require("../lib/prisma");
const jwt_utils_1 = require("../utils/jwt.utils");
const protect = async (req, res, next) => {
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = (0, jwt_utils_1.verifyAccessToken)(token);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.id },
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
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = (0, prisma_1.withMongoId)(user);
            next();
        }
        catch (error) {
            console.error('Authentication error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
exports.admin = admin;
//# sourceMappingURL=auth.middleware.js.map