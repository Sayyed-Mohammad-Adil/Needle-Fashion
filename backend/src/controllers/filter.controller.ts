import { Request, Response } from 'express';
import { prisma, withMongoId, withMongoIds } from '../lib/prisma';

export const getFilters = async (_req: Request, res: Response) => {
  try {
    const filters = await prisma.filter.findMany({ orderBy: { name: 'asc' } });
    res.json(withMongoIds(filters));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilterById = async (req: Request, res: Response) => {
  try {
    const filter = await prisma.filter.findUnique({ where: { id: req.params.id } });
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }
    res.json(withMongoId(filter));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createFilter = async (req: Request, res: Response) => {
  try {
    const { name, values } = req.body;
    const filterExists = await prisma.filter.findUnique({ where: { name } });
    if (filterExists) {
      return res.status(400).json({ message: 'Filter already exists' });
    }

    const filter = await prisma.filter.create({
      data: { name, values: Array.isArray(values) ? values : [] },
    });
    res.status(201).json(withMongoId(filter));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFilter = async (req: Request, res: Response) => {
  try {
    const filter = await prisma.filter.findUnique({ where: { id: req.params.id } });
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    const { name, values } = req.body;
    const updatedFilter = await prisma.filter.update({
      where: { id: req.params.id },
      data: {
        name: name ?? filter.name,
        values: values ?? filter.values,
      },
    });
    res.json(withMongoId(updatedFilter));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFilter = async (req: Request, res: Response) => {
  try {
    const filter = await prisma.filter.findUnique({ where: { id: req.params.id } });
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    await prisma.filter.delete({ where: { id: req.params.id } });
    res.json({ message: 'Filter removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addFilterValue = async (req: Request, res: Response) => {
  try {
    const filter = await prisma.filter.findUnique({ where: { id: req.params.id } });
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    const { value } = req.body;
    if (filter.values.includes(value)) {
      return res.status(400).json({ message: 'Value already exists in this filter' });
    }

    const updatedFilter = await prisma.filter.update({
      where: { id: req.params.id },
      data: { values: [...filter.values, value] },
    });
    res.json(withMongoId(updatedFilter));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFilterValue = async (req: Request, res: Response) => {
  try {
    const filter = await prisma.filter.findUnique({ where: { id: req.params.id } });
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    const valueToRemove = req.params.value;
    if (!filter.values.includes(valueToRemove)) {
      return res.status(400).json({ message: 'Value not found in this filter' });
    }

    const updatedFilter = await prisma.filter.update({
      where: { id: req.params.id },
      data: { values: filter.values.filter((v) => v !== valueToRemove) },
    });
    res.json(withMongoId(updatedFilter));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
