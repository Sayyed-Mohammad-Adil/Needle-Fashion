'use client';

import { categoryService } from '@/lib/api/category-service';
import { Category } from '@/lib/types';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // For the add/edit category modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryFeatured, setCategoryFeatured] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.deleteCategory(categoryToDelete);
        setCategories(categories.filter((category) => category._id !== categoryToDelete));
        toast.success('Category deleted successfully');
      } catch (error: any) {
        toast.error('Failed to delete category');
      } finally {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setCategoryFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    // featured is not in the backend yet, but I'll keep it as a placeholder if needed or just remove
    setCategoryFeatured(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (isEditing && currentCategory) {
        // Update existing category
        const updatedCategory = await categoryService.updateCategory(currentCategory._id, {
          name: categoryName,
          description: categoryDescription,
        });

        setCategories(categories.map((cat) => (cat._id === currentCategory._id ? updatedCategory : cat)));
        toast.success('Category updated successfully');
      } else {
        // Add new category
        const newCategory = await categoryService.createCategory({
          name: categoryName,
          description: categoryDescription,
        });

        setCategories([...categories, newCategory]);
        toast.success('Category added successfully');
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const toggleFeatured = (id: string) => {
    // Placeholder as featured is not in backend Category model yet
    toast.error('Featured toggle not implemented in backend');
  };

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-foreground">Categories</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage product categories for your store.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openAddModal}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span className="flex items-center">
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Category
            </span>
          </button>
        </div>
      </div>

      {/* Categories table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-table-header">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">
                      Category Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Products
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Featured
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">Loading categories...</td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No categories found</td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category._id} className="hover:bg-table-row-hover transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                          {category.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-muted-foreground">{category.description}</td>
                        <td className="px-3 py-4 text-sm text-muted-foreground">
                          {/* productCount is not in backend yet, but we could add it later */}
                          -
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <button
                            onClick={() => toggleFeatured(category._id)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted`}
                            role="switch"
                            aria-checked={false}
                            disabled
                          >
                            <span className="sr-only">Featured</span>
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0`}
                            />
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <span className="sr-only">Edit {category.name}</span>
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <span className="sr-only">Delete {category.name}</span>
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-card px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-border">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100/10 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-foreground">Delete Category</h3>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this category? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:mt-0 sm:w-auto"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-card px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-border">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-card text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <span className="h-6 w-6 text-xl font-bold">&times;</span>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3 className="text-base font-semibold leading-6 text-foreground">
                    {isEditing ? 'Edit Category' : 'Add Category'}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                          Category Name *
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="block w-full rounded-md border-border bg-input text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            className="block w-full rounded-md border-border bg-input text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="featured"
                          name="featured"
                          type="checkbox"
                          checked={categoryFeatured}
                          onChange={(e) => setCategoryFeatured(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                          Featured Category
                        </label>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:ml-3 sm:w-auto"
                      >
                        {isEditing ? 'Save Changes' : 'Add Category'}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:mt-0 sm:w-auto"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}