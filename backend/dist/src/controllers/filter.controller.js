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
exports.removeFilterValue = exports.addFilterValue = exports.deleteFilter = exports.updateFilter = exports.createFilter = exports.getFilterById = exports.getFilters = void 0;
const filter_model_1 = require("../models/filter.model");
// @desc    Get all filters
// @route   GET /api/filters
// @access  Public
const getFilters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = yield filter_model_1.Filter.find({});
        res.json(filters);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFilters = getFilters;
// @desc    Get single filter by ID
// @route   GET /api/filters/:id
// @access  Public
const getFilterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = yield filter_model_1.Filter.findById(req.params.id);
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        res.json(filter);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getFilterById = getFilterById;
// @desc    Create a filter
// @route   POST /api/filters
// @access  Private/Admin
const createFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, values } = req.body;
        // Check if filter already exists
        const filterExists = yield filter_model_1.Filter.findOne({ name });
        if (filterExists) {
            return res.status(400).json({ message: 'Filter already exists' });
        }
        // Create filter
        const filter = yield filter_model_1.Filter.create({
            name,
            values,
        });
        res.status(201).json(filter);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createFilter = createFilter;
// @desc    Update a filter
// @route   PUT /api/filters/:id
// @access  Private/Admin
const updateFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = yield filter_model_1.Filter.findById(req.params.id);
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        const { name, values } = req.body;
        // Update fields if provided
        if (name)
            filter.name = name;
        if (values)
            filter.values = values;
        const updatedFilter = yield filter.save();
        res.json(updatedFilter);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateFilter = updateFilter;
// @desc    Delete a filter
// @route   DELETE /api/filters/:id
// @access  Private/Admin
const deleteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = yield filter_model_1.Filter.findById(req.params.id);
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        yield filter.deleteOne();
        res.json({ message: 'Filter removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteFilter = deleteFilter;
// @desc    Add value to filter
// @route   POST /api/filters/:id/values
// @access  Private/Admin
const addFilterValue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = yield filter_model_1.Filter.findById(req.params.id);
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        const { value } = req.body;
        // Check if value already exists
        if (filter.values.includes(value)) {
            return res.status(400).json({ message: 'Value already exists in this filter' });
        }
        // Add value
        filter.values.push(value);
        const updatedFilter = yield filter.save();
        res.json(updatedFilter);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addFilterValue = addFilterValue;
// @desc    Remove value from filter
// @route   DELETE /api/filters/:id/values/:value
// @access  Private/Admin
const removeFilterValue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = yield filter_model_1.Filter.findById(req.params.id);
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        const valueToRemove = req.params.value;
        // Check if value exists
        if (!filter.values.includes(valueToRemove)) {
            return res.status(400).json({ message: 'Value not found in this filter' });
        }
        // Remove value
        filter.values = filter.values.filter(value => value !== valueToRemove);
        const updatedFilter = yield filter.save();
        res.json(updatedFilter);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeFilterValue = removeFilterValue;
//# sourceMappingURL=filter.controller.js.map