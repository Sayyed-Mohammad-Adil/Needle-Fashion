import { Request, Response } from 'express';
import { Theme } from '../models/theme.model';

// @desc    Get all themes
// @route   GET /api/themes
// @access  Public
export const getThemes = async (req: Request, res: Response) => {
  try {
    const themes = await Theme.find({ isActive: true });
    res.json(themes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get default theme
// @route   GET /api/themes/default
// @access  Public
export const getDefaultTheme = async (req: Request, res: Response) => {
  try {
    const theme = await Theme.findOne({ isDefault: true, isActive: true });
    
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get theme by ID
// @route   GET /api/themes/:id
// @access  Public
export const getThemeById = async (req: Request, res: Response) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    res.json(theme);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new theme
// @route   POST /api/themes
// @access  Private/Admin
export const createTheme = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      isDefault,
      colors,
      fonts,
      layout,
      isActive,
    } = req.body;

    // If this theme is set as default, unset the current default theme
    if (isDefault) {
      await Theme.updateMany({ isDefault: true }, { isDefault: false });
    }

    const theme = await Theme.create({
      name,
      description,
      isDefault: isDefault || false,
      colors,
      fonts,
      layout,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(theme);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a theme
// @route   PUT /api/themes/:id
// @access  Private/Admin
export const updateTheme = async (req: Request, res: Response) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const {
      name,
      description,
      isDefault,
      colors,
      fonts,
      layout,
      isActive,
    } = req.body;

    // If this theme is set as default, unset the current default theme
    if (isDefault) {
      await Theme.updateMany({ isDefault: true }, { isDefault: false });
    }

    // Update fields if provided
    if (name) theme.name = name;
    if (description !== undefined) theme.description = description;
    if (isDefault !== undefined) theme.isDefault = isDefault;
    if (colors) theme.colors = colors;
    if (fonts) theme.fonts = fonts;
    if (layout) theme.layout = layout;
    if (isActive !== undefined) theme.isActive = isActive;

    const updatedTheme = await theme.save();
    res.json(updatedTheme);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a theme
// @route   DELETE /api/themes/:id
// @access  Private/Admin
export const deleteTheme = async (req: Request, res: Response) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // Prevent deletion of the default theme
    if (theme.isDefault) {
      return res.status(400).json({ message: 'Cannot delete the default theme' });
    }

    await theme.deleteOne();
    res.json({ message: 'Theme removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set theme as default
// @route   PUT /api/themes/:id/default
// @access  Private/Admin
export const setDefaultTheme = async (req: Request, res: Response) => {
  try {
    // Unset current default theme
    await Theme.updateMany({ isDefault: true }, { isDefault: false });

    // Set new default theme
    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      { isDefault: true },
      { new: true }
    );

    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    res.json(theme);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};