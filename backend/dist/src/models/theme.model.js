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
exports.Theme = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ThemeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a theme name'],
        trim: true,
        unique: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    colors: {
        primary: {
            type: String,
            required: [true, 'Please provide a primary color'],
        },
        secondary: {
            type: String,
            required: [true, 'Please provide a secondary color'],
        },
        accent: {
            type: String,
            required: [true, 'Please provide an accent color'],
        },
        background: {
            type: String,
            required: [true, 'Please provide a background color'],
        },
        text: {
            type: String,
            required: [true, 'Please provide a text color'],
        },
        border: {
            type: String,
            required: [true, 'Please provide a border color'],
        },
    },
    fonts: {
        heading: {
            type: String,
            required: [true, 'Please provide a heading font'],
        },
        body: {
            type: String,
            required: [true, 'Please provide a body font'],
        },
    },
    layout: {
        borderRadius: {
            type: String,
            required: [true, 'Please provide a border radius'],
        },
        spacing: {
            type: String,
            required: [true, 'Please provide spacing'],
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.Theme = mongoose_1.default.model('Theme', ThemeSchema);
//# sourceMappingURL=theme.model.js.map