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
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price must be positive'],
    },
    images: [
        {
            data: {
                type: String, // Base64 encoded image
                required: [true, 'Please provide an image'],
            },
            alt: {
                type: String,
                default: '',
            },
        },
    ],
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category'],
    },
    filters: {
        type: Map,
        of: [String],
        default: new Map(),
    },
    sizes: [
        {
            type: Number,
            min: 36,
            max: 50,
        },
    ],
    isMakeToOrder: {
        type: Boolean,
        default: true,
    },
    isOutOfStock: {
        type: Boolean,
        default: false,
    },
    fittingOptions: [
        {
            type: String,
            enum: ['Loose', 'Medium', 'Fit'],
            default: 'Medium',
        },
    ],
    stock: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Product = mongoose_1.default.model('Product', ProductSchema);
//# sourceMappingURL=product.model.js.map