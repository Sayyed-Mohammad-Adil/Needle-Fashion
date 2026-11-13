"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultTheme = exports.deleteTheme = exports.updateTheme = exports.createTheme = exports.getThemeById = exports.getDefaultTheme = exports.getThemes = void 0;
const prisma_1 = require("../lib/prisma");
const getThemes = async (_req, res) => {
    try {
        const themes = await prisma_1.prisma.theme.findMany({ where: { isActive: true } });
        res.json((0, prisma_1.withMongoIds)(themes));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getThemes = getThemes;
const getDefaultTheme = async (_req, res) => {
    try {
        const theme = await prisma_1.prisma.theme.findFirst({
            where: { isDefault: true, isActive: true },
        });
        if (!theme) {
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
        res.json((0, prisma_1.withMongoId)(theme));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDefaultTheme = getDefaultTheme;
const getThemeById = async (req, res) => {
    try {
        const theme = await prisma_1.prisma.theme.findUnique({ where: { id: req.params.id } });
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.json((0, prisma_1.withMongoId)(theme));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getThemeById = getThemeById;
const createTheme = async (req, res) => {
    try {
        const { name, description, isDefault, colors, fonts, layout, isActive } = req.body;
        if (isDefault) {
            await prisma_1.prisma.theme.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }
        const theme = await prisma_1.prisma.theme.create({
            data: {
                name,
                description,
                isDefault: Boolean(isDefault),
                colors: colors || {},
                fonts: fonts || {},
                layout: layout || {},
                isActive: isActive !== undefined ? Boolean(isActive) : true,
            },
        });
        res.status(201).json((0, prisma_1.withMongoId)(theme));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTheme = createTheme;
const updateTheme = async (req, res) => {
    try {
        const theme = await prisma_1.prisma.theme.findUnique({ where: { id: req.params.id } });
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        const { name, description, isDefault, colors, fonts, layout, isActive } = req.body;
        if (isDefault) {
            await prisma_1.prisma.theme.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }
        const updatedTheme = await prisma_1.prisma.theme.update({
            where: { id: req.params.id },
            data: {
                name: name ?? theme.name,
                description: description !== undefined ? description : theme.description,
                isDefault: isDefault !== undefined ? Boolean(isDefault) : theme.isDefault,
                colors: colors ?? theme.colors,
                fonts: fonts ?? theme.fonts,
                layout: layout ?? theme.layout,
                isActive: isActive !== undefined ? Boolean(isActive) : theme.isActive,
            },
        });
        res.json((0, prisma_1.withMongoId)(updatedTheme));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTheme = updateTheme;
const deleteTheme = async (req, res) => {
    try {
        const theme = await prisma_1.prisma.theme.findUnique({ where: { id: req.params.id } });
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        if (theme.isDefault) {
            return res.status(400).json({ message: 'Cannot delete the default theme' });
        }
        await prisma_1.prisma.theme.delete({ where: { id: req.params.id } });
        res.json({ message: 'Theme removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteTheme = deleteTheme;
const setDefaultTheme = async (req, res) => {
    try {
        const existing = await prisma_1.prisma.theme.findUnique({ where: { id: req.params.id } });
        if (!existing) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        await prisma_1.prisma.theme.updateMany({
            where: { isDefault: true },
            data: { isDefault: false },
        });
        const theme = await prisma_1.prisma.theme.update({
            where: { id: req.params.id },
            data: { isDefault: true },
        });
        res.json((0, prisma_1.withMongoId)(theme));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.setDefaultTheme = setDefaultTheme;
//# sourceMappingURL=theme.controller.js.map