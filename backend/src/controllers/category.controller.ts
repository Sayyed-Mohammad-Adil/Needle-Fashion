import { Request, Response } from 'express';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json(withMongoIds(categories));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(withMongoId(category));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    const categoryExists = await prisma.category.findUnique({ where: { name } });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name, description, image },
    });
    res.status(201).json(withMongoId(category));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, image } = req.body;
    const updatedCategory = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        name: name ?? category.name,
        description: description !== undefined ? description : category.description,
        image: image !== undefined ? image : category.image,
      },
    });
    res.json(withMongoId(updatedCategory));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
