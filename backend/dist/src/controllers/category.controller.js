"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const prisma_1 = require("../lib/prisma");
const getCategories = async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({ orderBy: { name: 'asc' } });
        res.json((0, prisma_1.withMongoIds)(categories));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await prisma_1.prisma.category.findUnique({ where: { id: req.params.id } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json((0, prisma_1.withMongoId)(category));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const categoryExists = await prisma_1.prisma.category.findUnique({ where: { name } });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = await prisma_1.prisma.category.create({
            data: { name, description, image },
        });
        res.status(201).json((0, prisma_1.withMongoId)(category));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const category = await prisma_1.prisma.category.findUnique({ where: { id: req.params.id } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const { name, description, image } = req.body;
        const updatedCategory = await prisma_1.prisma.category.update({
            where: { id: req.params.id },
            data: {
                name: name ?? category.name,
                description: description !== undefined ? description : category.description,
                image: image !== undefined ? image : category.image,
            },
        });
        res.json((0, prisma_1.withMongoId)(updatedCategory));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await prisma_1.prisma.category.findUnique({ where: { id: req.params.id } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await prisma_1.prisma.category.delete({ where: { id: req.params.id } });
        res.json({ message: 'Category removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=category.controller.js.map