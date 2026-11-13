import { Request, Response } from 'express';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';

export const getThemes = async (_req: Request, res: Response) => {
  try {
    const themes = await prisma.theme.findMany({ where: { isActive: true } });
    res.json(withMongoIds(themes));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDefaultTheme = async (_req: Request, res: Response) => {
  try {
    const theme = await prisma.theme.findFirst({
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

    res.json(withMongoId(theme));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getThemeById = async (req: Request, res: Response) => {
  try {
    const theme = await prisma.theme.findUnique({ where: { id: req.params.id } });
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    res.json(withMongoId(theme));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTheme = async (req: Request, res: Response) => {
  try {
    const { name, description, isDefault, colors, fonts, layout, isActive } = req.body;

    if (isDefault) {
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const theme = await prisma.theme.create({
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

    res.status(201).json(withMongoId(theme));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTheme = async (req: Request, res: Response) => {
  try {
    const theme = await prisma.theme.findUnique({ where: { id: req.params.id } });
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const { name, description, isDefault, colors, fonts, layout, isActive } = req.body;
    if (isDefault) {
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedTheme = await prisma.theme.update({
      where: { id: req.params.id },
      data: {
        name: name ?? theme.name,
        description: description !== undefined ? description : theme.description,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : theme.isDefault,
        colors: colors ?? (theme.colors as any),
        fonts: fonts ?? (theme.fonts as any),
        layout: layout ?? (theme.layout as any),
        isActive: isActive !== undefined ? Boolean(isActive) : theme.isActive,
      },
    });

    res.json(withMongoId(updatedTheme));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTheme = async (req: Request, res: Response) => {
  try {
    const theme = await prisma.theme.findUnique({ where: { id: req.params.id } });
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    if (theme.isDefault) {
      return res.status(400).json({ message: 'Cannot delete the default theme' });
    }

    await prisma.theme.delete({ where: { id: req.params.id } });
    res.json({ message: 'Theme removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const setDefaultTheme = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.theme.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    await prisma.theme.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    const theme = await prisma.theme.update({
      where: { id: req.params.id },
      data: { isDefault: true },
    });

    res.json(withMongoId(theme));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
