'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Embroidered Kurta',
    description: 'Handcrafted embroidered kurta with traditional designs perfect for festive occasions.',
    category: 'Kurta',
    price: 2999,
    stock: 15,
    sku: 'KRT-EMB-001',
    featured: true,
    images: [
      '/images/products/kurta1.jpg',
      '/images/products/kurta1-alt.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Maroon', 'Navy Blue', 'Beige'],
    customizable: true,
  },
  // Other products would be here
];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = parseInt(params.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [featured, setFeatured] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [customizable, setCustomizable] = useState(false);
  
  // Available options
  const availableCategories = ['Kurta', 'Sherwani', 'Kurta-Jacket Set', 'Jacket', 'Dhoti', 'Accessories'];
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const availableColors = ['Maroon', 'Navy Blue', 'Black', 'Beige', 'White', 'Gold', 'Green', 'Red'];
  
  useEffect(() => {
    // In a real app, fetch product from API
    const fetchProduct = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const foundProduct = mockProducts.find(p => p.id === productId);
          
          if (foundProduct) {
            setProduct(foundProduct);
            // Populate form fields
            setName(foundProduct.name);
            setDescription(foundProduct.description || '');
            setCategory(foundProduct.category);
            setPrice(foundProduct.price.toString());
            setStock(foundProduct.stock.toString());
            setSku(foundProduct.sku);
            setFeatured(foundProduct.featured);
            setSizes(foundProduct.sizes || []);
            setColors(foundProduct.colors || []);
            setCustomizable(foundProduct.customizable || false);
          } else {
            toast.error('Product not found');
            router.push('/admin/products');
          }
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        toast.error('Failed to load product');
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form
      if (!name || !category || !price || !sku) {
        toast.error('Please fill all required fields');
        setIsLoading(false);
        return;
      }
      
      // Prepare updated product data
      const updatedProduct = {
        ...product,
        name,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        sku,
        featured,
        sizes,
        colors,
        customizable,
      };
      
      // In a real app, send to API
      // await updateProduct(productId, updatedProduct);
      
      // Simulate API call
      setTimeout(() => {
        toast.success('Product updated successfully');
        router.push('/admin/products');
      }, 1000);
    } catch (error) {
      toast.error('Failed to update product');
      setIsLoading(false);
    }
  };
  
  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };
  
  const handleColorToggle = (color: string) => {
    if (colors.includes(color)) {
      setColors(colors.filter(c => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update the details for {product?.name}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/products"
            className="block rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Back to Products
          </Link>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹) *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="sku"
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Product
                  </label>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    id="customizable"
                    name="customizable"
                    type="checkbox"
                    checked={customizable}
                    onChange={(e) => setCustomizable(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="customizable" className="ml-2 block text-sm text-gray-900">
                    Customizable
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Variants */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Product Variants</h3>
            
            {/* Sizes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Available Sizes</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium ${sizes.includes(size) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Available Colors</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium ${colors.includes(color) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Upload - In a real app, you would implement file uploads */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Product Images</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload images of your product. The first image will be used as the featured image.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Upload Images
              </button>
            </div>
            
            {/* Display existing images */}
            {product?.images && product.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {product.images.map((image: string, index: number) => (
                  <div key={index} className="relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <div className="h-40 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                        [Image Placeholder]
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Submit buttons */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/products"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}