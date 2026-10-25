"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    images: [
        {
            type: String, // Base64 encoded images
        },
    ],
    isVerifiedPurchase: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: true, // Can be set to false if admin approval is required
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    flagReason: {
        type: String,
        maxlength: [200, 'Flag reason cannot be more than 200 characters'],
    },
    helpfulCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// Prevent duplicate reviews from the same user for the same product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
exports.Review = mongoose_1.default.model('Review', ReviewSchema);
//# sourceMappingURL=review.model.js.map