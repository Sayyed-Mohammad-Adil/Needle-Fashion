'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Product } from '@/lib/types';

interface Category {
  _id: string;
  name: string;
}

interface FilterOption {
  _id: string;
  name: string;
}

interface ResponsiveProductFormProps {
  product?: Product;
  categories: Category[];
  filters: Record<string, FilterOption[]>;
  onSubmit: (productData: any) => Promise<void>;
}

export default function ResponsiveProductForm({
  product,
  categories,
  filters,
  onSubmit
}: ResponsiveProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category?._id || '',
    sizes: product?.sizes?.join(',') || '',
    stock: product?.stock || 0,
    isMakeToOrder: product?.isMakeToOrder || false,
    isOutOfStock: product?.isOutOfStock || false,
    images: [] as string[],
    fabric: product?.fabric || '',
    color: product?.color || '',
    work: product?.work || '',
    pattern: product?.pattern || '',
    store: product?.store || '',
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images?.map((img: any) => img.data || img) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          newImages.push(result);
          newPreviews.push(result);
          
          // Update state when all images are processed
          if (newPreviews.length === files.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages]
            }));
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!formData.sizes) {
      toast.error('Please enter at least one size');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const productData = {
        ...formData,
        sizes: formData.sizes.split(',').map(size => parseInt(size.trim())).filter(size => !isNaN(size)),
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      
      await onSubmit(productData);
      
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
                Available Sizes *
              </label>
              <input
                type="text"
                id="sizes"
                value={formData.sizes}
                onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                placeholder="Enter sizes separated by commas (e.g., 38, 40, 42)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Enter sizes separated by commas</p>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Product Type */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Type</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="isMakeToOrder"
                name="product-type"
                type="radio"
                checked={formData.isMakeToOrder}
                onChange={() => setFormData({...formData, isMakeToOrder: true, isOutOfStock: false})}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isMakeToOrder" className="ml-3 block text-sm font-medium text-gray-700">
                Make to Order
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="isReadyMade"
                name="product-type"
                type="radio"
                checked={!formData.isMakeToOrder}
                onChange={() => setFormData({...formData, isMakeToOrder: false})}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isReadyMade" className="ml-3 block text-sm font-medium text-gray-700">
                Ready Made
              </label>
            </div>
            
            {!formData.isMakeToOrder && (
              <div className="flex items-center">
                <input
                  id="isOutOfStock"
                  name="stock-status"
                  type="checkbox"
                  checked={formData.isOutOfStock}
                  onChange={(e) => setFormData({...formData, isOutOfStock: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isOutOfStock" className="ml-3 block text-sm font-medium text-gray-700">
                  Mark as Out of Stock
                </label>
              </div>
            )}
          </div>
        </div>
        
        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          
          <div className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Add Images
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="mt-1 text-sm text-gray-500">Upload up to 5 images (max 5MB each)</p>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fabric" className="block text-sm font-medium text-gray-700">
                Fabric
              </label>
              <select
                id="fabric"
                value={formData.fabric}
                onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select fabric</option>
                {filters.fabric?.map((option) => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <select
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select color</option>
                {filters.color?.map((option) => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="work" className="block text-sm font-medium text-gray-700">
                Work
              </label>
              <select
                id="work"
                value={formData.work}
                onChange={(e) => setFormData({...formData, work: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select work</option>
                {filters.work?.map((option) => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="pattern" className="block text-sm font-medium text-gray-700">
                Pattern
              </label>
              <select
                id="pattern"
                value={formData.pattern}
                onChange={(e) => setFormData({...formData, pattern: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select pattern</option>
                {filters['Prints & Patterns']?.map((option) => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                Store
              </label>
              <select
                id="store"
                value={formData.store}
                onChange={(e) => setFormData({...formData, store: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select store</option>
                {filters.Stores?.map((option) => (
                  <option key={option._id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}