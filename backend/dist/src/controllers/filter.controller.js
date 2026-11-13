"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFilterValue = exports.addFilterValue = exports.deleteFilter = exports.updateFilter = exports.createFilter = exports.getFilterById = exports.getFilters = void 0;
const prisma_1 = require("../lib/prisma");
const getFilters = async (_req, res) => {
    try {
        const filters = await prisma_1.prisma.filter.findMany({ orderBy: { name: 'asc' } });
        res.json((0, prisma_1.withMongoIds)(filters));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFilters = getFilters;
const getFilterById = async (req, res) => {
    try {
        const filter = await prisma_1.prisma.filter.findUnique({ where: { id: req.params.id } });
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        res.json((0, prisma_1.withMongoId)(filter));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getFilterById = getFilterById;
const createFilter = async (req, res) => {
    try {
        const { name, values } = req.body;
        const filterExists = await prisma_1.prisma.filter.findUnique({ where: { name } });
        if (filterExists) {
            return res.status(400).json({ message: 'Filter already exists' });
        }
        const filter = await prisma_1.prisma.filter.create({
            data: { name, values: Array.isArray(values) ? values : [] },
        });
        res.status(201).json((0, prisma_1.withMongoId)(filter));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createFilter = createFilter;
const updateFilter = async (req, res) => {
    try {
        const filter = await prisma_1.prisma.filter.findUnique({ where: { id: req.params.id } });
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        const { name, values } = req.body;
        const updatedFilter = await prisma_1.prisma.filter.update({
            where: { id: req.params.id },
            data: {
                name: name ?? filter.name,
                values: values ?? filter.values,
            },
        });
        res.json((0, prisma_1.withMongoId)(updatedFilter));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateFilter = updateFilter;
const deleteFilter = async (req, res) => {
    try {
        const filter = await prisma_1.prisma.filter.findUnique({ where: { id: req.params.id } });
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        await prisma_1.prisma.filter.delete({ where: { id: req.params.id } });
        res.json({ message: 'Filter removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteFilter = deleteFilter;
const addFilterValue = async (req, res) => {
    try {
        const filter = await prisma_1.prisma.filter.findUnique({ where: { id: req.params.id } });
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        const { value } = req.body;
        if (filter.values.includes(value)) {
            return res.status(400).json({ message: 'Value already exists in this filter' });
        }
        const updatedFilter = await prisma_1.prisma.filter.update({
            where: { id: req.params.id },
            data: { values: [...filter.values, value] },
        });
        res.json((0, prisma_1.withMongoId)(updatedFilter));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addFilterValue = addFilterValue;
const removeFilterValue = async (req, res) => {
    try {
        const filter = await prisma_1.prisma.filter.findUnique({ where: { id: req.params.id } });
        if (!filter) {
            return res.status(404).json({ message: 'Filter not found' });
        }
        const valueToRemove = req.params.value;
        if (!filter.values.includes(valueToRemove)) {
            return res.status(400).json({ message: 'Value not found in this filter' });
        }
        const updatedFilter = await prisma_1.prisma.filter.update({
            where: { id: req.params.id },
            data: { values: filter.values.filter((v) => v !== valueToRemove) },
        });
        res.json((0, prisma_1.withMongoId)(updatedFilter));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeFilterValue = removeFilterValue;
//# sourceMappingURL=filter.controller.js.map