import { Request, Response } from 'express';
import { Filter } from '../models/filter.model';

// @desc    Get all filters
// @route   GET /api/filters
// @access  Public
export const getFilters = async (req: Request, res: Response) => {
  try {
    const filters = await Filter.find({});
    res.json(filters);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single filter by ID
// @route   GET /api/filters/:id
// @access  Public
export const getFilterById = async (req: Request, res: Response) => {
  try {
    const filter = await Filter.findById(req.params.id);

    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    res.json(filter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a filter
// @route   POST /api/filters
// @access  Private/Admin
export const createFilter = async (req: Request, res: Response) => {
  try {
    const { name, values } = req.body;

    // Check if filter already exists
    const filterExists = await Filter.findOne({ name });
    if (filterExists) {
      return res.status(400).json({ message: 'Filter already exists' });
    }

    // Create filter
    const filter = await Filter.create({
      name,
      values,
    });

    res.status(201).json(filter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a filter
// @route   PUT /api/filters/:id
// @access  Private/Admin
export const updateFilter = async (req: Request, res: Response) => {
  try {
    const filter = await Filter.findById(req.params.id);

    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    const { name, values } = req.body;

    // Update fields if provided
    if (name) filter.name = name;
    if (values) filter.values = values;

    const updatedFilter = await filter.save();
    res.json(updatedFilter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a filter
// @route   DELETE /api/filters/:id
// @access  Private/Admin
export const deleteFilter = async (req: Request, res: Response) => {
  try {
    const filter = await Filter.findById(req.params.id);

    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    await filter.deleteOne();
    res.json({ message: 'Filter removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add value to filter
// @route   POST /api/filters/:id/values
// @access  Private/Admin
export const addFilterValue = async (req: Request, res: Response) => {
  try {
    const filter = await Filter.findById(req.params.id);

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
    const updatedFilter = await filter.save();

    res.json(updatedFilter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove value from filter
// @route   DELETE /api/filters/:id/values/:value
// @access  Private/Admin
export const removeFilterValue = async (req: Request, res: Response) => {
  try {
    const filter = await Filter.findById(req.params.id);

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
    const updatedFilter = await filter.save();

    res.json(updatedFilter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};