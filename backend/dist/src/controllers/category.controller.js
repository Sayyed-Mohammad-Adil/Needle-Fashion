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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const category_model_1 = require("../models/category.model");
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.find({});
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCategories = getCategories;
// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCategoryById = getCategoryById;
// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, image } = req.body;
        // Check if category already exists
        const categoryExists = yield category_model_1.Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        // Create category
        const category = yield category_model_1.Category.create({
            name,
            description,
            image,
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createCategory = createCategory;
// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const { name, description, image } = req.body;
        // Update fields if provided
        if (name)
            category.name = name;
        if (description !== undefined)
            category.description = description;
        if (image !== undefined)
            category.image = image;
        const updatedCategory = yield category.save();
        res.json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateCategory = updateCategory;
// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        yield category.deleteOne();
        res.json({ message: 'Category removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map