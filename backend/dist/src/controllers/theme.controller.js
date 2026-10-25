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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultTheme = exports.deleteTheme = exports.updateTheme = exports.createTheme = exports.getThemeById = exports.getDefaultTheme = exports.getThemes = void 0;
const theme_model_1 = require("../models/theme.model");
// @desc    Get all themes
// @route   GET /api/themes
// @access  Public
const getThemes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const themes = yield theme_model_1.Theme.find({ isActive: true });
        res.json(themes);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getThemes = getThemes;
// @desc    Get default theme
// @route   GET /api/themes/default
// @access  Public
const getDefaultTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theme = yield theme_model_1.Theme.findOne({ isDefault: true, isActive: true });
        if (!theme) {
            // Return a default theme if no default is set
            return res.json({
                name: 'Default',
                description: 'Default store theme',
                isDefault: true,
                isActive: true,
                colors: {
                    primary: '#3b82f6',
                    secondary: '#64748b',
                    accent: '#f59e0b',
                    background: '#ffffff',
                    text: '#1f2937',
                    border: '#e5e7eb',
                },
                fonts: {
                    heading: 'Inter, sans-serif',
                    body: 'Inter, sans-serif',
                },
                layout: {
                    borderRadius: '0.5rem',
                    spacing: '4px',
                },
            });
        }
        res.json(theme);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDefaultTheme = getDefaultTheme;
// @desc    Get theme by ID
// @route   GET /api/themes/:id
// @access  Public
const getThemeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theme = yield theme_model_1.Theme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.json(theme);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getThemeById = getThemeById;
// @desc    Create a new theme
// @route   POST /api/themes
// @access  Private/Admin
const createTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isDefault, colors, fonts, layout, isActive, } = req.body;
        // If this theme is set as default, unset the current default theme
        if (isDefault) {
            yield theme_model_1.Theme.updateMany({ isDefault: true }, { isDefault: false });
        }
        const theme = yield theme_model_1.Theme.create({
            name,
            description,
            isDefault: isDefault || false,
            colors,
            fonts,
            layout,
            isActive: isActive !== undefined ? isActive : true,
        });
        res.status(201).json(theme);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createTheme = createTheme;
// @desc    Update a theme
// @route   PUT /api/themes/:id
// @access  Private/Admin
const updateTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theme = yield theme_model_1.Theme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        const { name, description, isDefault, colors, fonts, layout, isActive, } = req.body;
        // If this theme is set as default, unset the current default theme
        if (isDefault) {
            yield theme_model_1.Theme.updateMany({ isDefault: true }, { isDefault: false });
        }
        // Update fields if provided
        if (name)
            theme.name = name;
        if (description !== undefined)
            theme.description = description;
        if (isDefault !== undefined)
            theme.isDefault = isDefault;
        if (colors)
            theme.colors = colors;
        if (fonts)
            theme.fonts = fonts;
        if (layout)
            theme.layout = layout;
        if (isActive !== undefined)
            theme.isActive = isActive;
        const updatedTheme = yield theme.save();
        res.json(updatedTheme);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateTheme = updateTheme;
// @desc    Delete a theme
// @route   DELETE /api/themes/:id
// @access  Private/Admin
const deleteTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theme = yield theme_model_1.Theme.findById(req.params.id);
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        // Prevent deletion of the default theme
        if (theme.isDefault) {
            return res.status(400).json({ message: 'Cannot delete the default theme' });
        }
        yield theme.deleteOne();
        res.json({ message: 'Theme removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTheme = deleteTheme;
// @desc    Set theme as default
// @route   PUT /api/themes/:id/default
// @access  Private/Admin
const setDefaultTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Unset current default theme
        yield theme_model_1.Theme.updateMany({ isDefault: true }, { isDefault: false });
        // Set new default theme
        const theme = yield theme_model_1.Theme.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true });
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.json(theme);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.setDefaultTheme = setDefaultTheme;
//# sourceMappingURL=theme.controller.js.map