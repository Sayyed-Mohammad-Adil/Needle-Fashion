'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Theme, getThemes, createTheme, updateTheme, deleteTheme, setDefaultTheme } from '@/lib/api/theme.service';

export default function ThemeManagement() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  const [formData, setFormData] = useState<Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    isDefault: false,
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

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const data = await getThemes();
      setThemes(data);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTheme) {
        // Update existing theme
        await updateTheme(editingTheme._id!, formData);
        toast.success('Theme updated successfully');
      } else {
        // Create new theme
        await createTheme(formData);
        toast.success('Theme created successfully');
      }

      // Reset form and refresh themes
      setFormData({
        name: '',
        description: '',
        isDefault: false,
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
      setEditingTheme(null);
      setIsCreating(false);
      fetchThemes();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
    }
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      description: theme.description || '',
      isDefault: theme.isDefault,
      isActive: theme.isActive,
      colors: theme.colors,
      fonts: theme.fonts,
      layout: theme.layout,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    try {
      await deleteTheme(id);
      toast.success('Theme deleted successfully');
      fetchThemes();

      // If we were editing this theme, reset the form
      if (editingTheme?._id === id) {
        setEditingTheme(null);
        setIsCreating(false);
        setFormData({
          name: '',
          description: '',
          isDefault: false,
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
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Failed to delete theme');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultTheme(id);
      toast.success('Default theme updated successfully');
      fetchThemes();
    } catch (error) {
      console.error('Error setting default theme:', error);
      toast.error('Failed to set default theme');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTheme(null);
    setFormData({
      name: '',
      description: '',
      isDefault: false,
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Theme Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create New Theme
        </button>
      </div>

      {isCreating || editingTheme ? (
        <div className="bg-card shadow rounded-lg p-6 mb-8 border border-border">
          <h2 className="text-xl font-semibold mb-4">
            {editingTheme ? 'Edit Theme' : 'Create New Theme'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Theme Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-foreground">
                  Set as Default Theme
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-foreground">
                  Active
                </label>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-muted-foreground mb-1 capitalize">
                      {key}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setFormData({
                          ...formData,
                          colors: {
                            ...formData.colors,
                            [key]: e.target.value
                          }
                        })}
                        className="w-10 h-10 border border-border rounded cursor-pointer bg-input"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setFormData({
                          ...formData,
                          colors: {
                            ...formData.colors,
                            [key]: e.target.value
                          }
                        })}
                        className="ml-2 px-2 py-1 border border-border bg-input text-foreground rounded text-sm w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Fonts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Heading Font
                  </label>
                  <input
                    type="text"
                    value={formData.fonts.heading}
                    onChange={(e) => setFormData({
                      ...formData,
                      fonts: {
                        ...formData.fonts,
                        heading: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Body Font
                  </label>
                  <input
                    type="text"
                    value={formData.fonts.body}
                    onChange={(e) => setFormData({
                      ...formData,
                      fonts: {
                        ...formData.fonts,
                        body: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Border Radius
                  </label>
                  <input
                    type="text"
                    value={formData.layout.borderRadius}
                    onChange={(e) => setFormData({
                      ...formData,
                      layout: {
                        ...formData.layout,
                        borderRadius: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Spacing
                  </label>
                  <input
                    type="text"
                    value={formData.layout.spacing}
                    onChange={(e) => setFormData({
                      ...formData,
                      layout: {
                        ...formData.layout,
                        spacing: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-border bg-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                {editingTheme ? 'Update Theme' : 'Create Theme'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-card shadow rounded-lg overflow-hidden border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">Existing Themes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-table-header">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Default
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {themes.map((theme) => (
                <tr key={theme._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{theme.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">{theme.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${theme.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {theme.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {theme.isDefault ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(theme._id!)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Set as Default
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(theme)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      Edit
                    </button>
                    {!theme.isDefault && (
                      <button
                        onClick={() => handleDelete(theme._id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {themes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No themes found.</p>
          </div>
        )}
      </div>
    </div>
  );
}