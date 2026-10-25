'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { productService, categoryService, filterService } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { toast } from 'react-hot-toast';

// Interface for frontend product display
interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
  category: string;
  makeToOrder: boolean;
  stock?: number;
  // Additional properties that might be used for filtering
  [key: string]: any;
}

// Initial empty products array
const initialProducts: DisplayProduct[] = [];

// Initial state for filters - will be replaced with API data
const initialFilters = {
  category: [
    { value: 'kurta', label: 'Kurta' },
    { value: 'sherwani', label: 'Sherwani' },
    { value: 'kurta-jacket-set', label: 'Kurta-Jacket Set' },
  ],
  price: [
    { value: '0-5000', label: 'Under ₹5,000' },
    { value: '5000-10000', label: 'Between ₹5,000 - ₹10,000' },
    { value: '10000-20000', label: 'Between ₹10,000 - ₹20,000' },
    { value: '20000-plus', label: 'Above ₹20,000' },
  ],
  size: [
    { value: '36', label: '36' },
    { value: '38', label: '38' },
    { value: '40', label: '40' },
    { value: '42', label: '42' },
    { value: '44', label: '44' },
    { value: '46', label: '46' },
    { value: '48', label: '48' },
    { value: '50', label: '50' },
    { value: 'customize', label: 'Customize' },
  ],
  fitting: [
    { value: 'loose', label: 'Loose' },
    { value: 'medium', label: 'Medium' },
    { value: 'fit', label: 'Fit' },
  ],
  color: [
    { value: 'black', label: 'Black' },
    { value: 'blue', label: 'Blue' },
    { value: 'navy-blue', label: 'Navy Blue' },
    { value: 'maroon', label: 'Maroon' },
    { value: 'green', label: 'Green' },
    { value: 'beige', label: 'Beige' },
  ],
  fabric: [
    { value: 'cotton', label: 'Cotton' },
    { value: 'silk', label: 'Silk' },
    { value: 'cotton-blend', label: 'Cotton Blend' },
    { value: 'cotton-silk', label: 'Cotton Silk' },
  ],
  work: [
    { value: 'embroidery', label: 'Embroidery' },
    { value: 'zari', label: 'Zari' },
    { value: 'printed', label: 'Printed' },
  ],
  pattern: [
    { value: 'solid', label: 'Solid' },
    { value: 'embellished', label: 'Embellished' },
    { value: 'floral', label: 'Floral' },
  ],
  store: [
    { value: 'main-store', label: 'Main Store' },
    { value: 'branch-store', label: 'Branch Store' },
  ],
  makeToOrder: [
    { value: 'true', label: 'Make-to-Order' },
    { value: 'false', label: 'Ready-Made' },
  ],
};

// Sort options
const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
];

export default function CatalogPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [products, setProducts] = useState<DisplayProduct[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<DisplayProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    category: [],
    price: [],
    size: [],
    fitting: [],
    color: [],
    fabric: [],
    work: [],
    pattern: [],
    store: [],
    makeToOrder: [],
  });

  const searchParams = useSearchParams();
  
  // Fetch products, categories, and filters from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch products
        const productsResponse: any = await productService.getProducts();
        const productList = Array.isArray(productsResponse) ? productsResponse : (productsResponse?.products || []);
        
        // Map API products to DisplayProduct format
        const mappedProducts: DisplayProduct[] = productList.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          imageSrc: product.images && product.images.length > 0 ? (product.images[0].data || product.images[0].url || product.images[0]) : '/images/placeholder.jpg',
          imageAlt: product.name,
          href: `/product/${product._id}`,
          category: product.category?.name || 'Uncategorized',
          makeToOrder: product.isMakeToOrder ?? product.makeToOrder ?? false,
          stock: product.stock ?? product.countInStock ?? 10,
          // Map other properties if available
          ...(product.filters && { ...product.filters }),
        }));
        
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        
        // Fetch categories
        const categoriesResponse: any = await categoryService.getCategories();
        setCategories(categoriesResponse);
        
        // Update category filters from API data
        if (categoriesResponse && categoriesResponse.length > 0) {
          const categoryFilters = categoriesResponse.map((cat: any) => ({
            value: cat.slug || cat.name?.toLowerCase() || 'cat',
            label: cat.name || 'Category'
          }));
          
          setFilters(prev => ({
            ...prev,
            category: categoryFilters
          }));
        }
        
        // Fetch filters if available
        try {
          const filtersResponse = await filterService.getFilters();
          if (filtersResponse) {
            // Update filters with API data
            setFilters(prev => ({
              ...prev,
              ...filtersResponse
            }));
          }
        } catch (filterError) {
          console.error('Error fetching filters:', filterError);
          // Continue with default filters if filter API fails
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle URL parameters
  useEffect(() => {
    // Initialize filters from URL params if any
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const page = searchParams.get('page');
    
    if (category) {
      setActiveFilters(prev => ({
        ...prev,
        category: [category.toLowerCase()]
      }));
    }
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (page) {
      setCurrentPage(parseInt(page, 10));
    } else {
      setCurrentPage(1);
    }
    
    // Apply filters when products are loaded
    if (products.length > 0) {
      applyFilters();
    }
  }, [searchParams, products.length]);

  const applyFilters = () => {
    let result = [...products];
    
    // Apply search query if exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.fabric && product.fabric.toLowerCase().includes(query)) ||
          (product.work && product.work.toLowerCase().includes(query)) ||
          (product.pattern && product.pattern.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply each filter
    Object.entries(activeFilters).forEach(([filterType, values]) => {
      if (values.length > 0) {
        if (filterType === 'price') {
          result = result.filter(product => {
            return values.some(range => {
              if (range === '0-5000') return product.price < 5000;
              if (range === '5000-10000') return product.price >= 5000 && product.price < 10000;
              if (range === '10000-20000') return product.price >= 10000 && product.price < 20000;
              if (range === '20000-plus') return product.price >= 20000;
              return true;
            });
          });
        } else if (filterType === 'makeToOrder') {
          result = result.filter(product => {
            return values.some(value => {
              return product.makeToOrder === (value === 'true');
            });
          });
        } else {
          result = result.filter(product => {
            // Handle potentially undefined properties safely
            const productValue = (product as any)[filterType];
            if (productValue === undefined) return false;
            
            const productValueStr = typeof productValue === 'string' 
              ? productValue.toLowerCase() 
              : String(productValue).toLowerCase();
              
            return values.some(value => productValueStr.includes(value.toLowerCase()));
          });
        }
      }
    });
    
    setFilteredProducts(result);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      const updatedFilters = { ...prev };
      
      if (updatedFilters[filterType].includes(value)) {
        // Remove the filter if already selected
        updatedFilters[filterType] = updatedFilters[filterType].filter(v => v !== value);
      } else {
        // Add the filter
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      
      return updatedFilters;
    });
    
    // Apply filters after state update
    setTimeout(applyFilters, 0);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      price: [],
      size: [],
      fitting: [],
      color: [],
      fabric: [],
      work: [],
      pattern: [],
      store: [],
      makeToOrder: [],
    });
    setSearchQuery('');
    setTimeout(applyFilters, 0);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
    setTimeout(applyFilters, 0);
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Calculate page numbers
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="bg-white">
      {/* Loading and Error states */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-20">
          <div className="text-red-500 text-xl">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && (
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Mobile Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    {Object.entries(filters).map(([filterType, options]) => (
                      <Disclosure as="div" key={filterType} className="border-t border-gray-200 px-4 py-6">
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900 capitalize">{filterType}</span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${filterType}-${optionIdx}`}
                                      name={`${filterType}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={activeFilters[filterType].includes(option.value)}
                                      onChange={() => handleFilterChange(filterType, option.value)}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${filterType}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Products</h1>

            <div className="flex items-center">
              <div className="relative mr-4 flex-grow max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search products"
                />
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={`
                                ${option.current ? 'font-medium text-gray-900' : 'text-gray-500'}
                                ${active ? 'bg-gray-100' : ''}
                                block px-4 py-2 text-sm
                              `}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
                onClick={() => setViewMode('grid')}
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className={`h-5 w-5 ${viewMode === 'grid' ? 'text-indigo-600' : ''}`} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setViewMode('list')}
              >
                <span className="sr-only">View list</span>
                <ListBulletIcon className={`h-5 w-5 ${viewMode === 'list' ? 'text-indigo-600' : ''}`} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Clear all
                  </button>
                </div>

                {Object.entries(filters).map(([filterType, options]) => (
                  <Disclosure as="div" key={filterType} className="border-b border-gray-200 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900 capitalize">{filterType}</span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${filterType}-${optionIdx}`}
                                  name={`${filterType}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  checked={activeFilters[filterType].includes(option.value)}
                                  onChange={() => handleFilterChange(filterType, option.value)}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${filterType}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Product grid header with view toggle and count */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium">{filteredProducts.length}</span> products
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    >
                      <Squares2X2Icon className="h-5 w-5 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    >
                      <ListBulletIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {/* No products message */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">{product.name} Image</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-sm text-gray-700">
                              <Link href={product.href}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center rounded-md ${product.makeToOrder ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'} px-2 py-1 text-xs font-medium`}>
                            {product.makeToOrder ? 'Make-to-Order' : 'Ready-Made'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-4 border border-gray-200 rounded-lg">
                        <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">{product.name} Image</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link href={product.href}>
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-lg font-medium text-gray-900">₹{product.price.toLocaleString()}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <p className="text-sm text-gray-500"><span className="font-medium">Size:</span> {product.size}</p>
                            <p className="text-sm text-gray-500"><span className="font-medium">Fitting:</span> {product.fitting}</p>
                            <p className="text-sm text-gray-500"><span className="font-medium">Color:</span> {product.color}</p>
                            <p className="text-sm text-gray-500"><span className="font-medium">Fabric:</span> {product.fabric}</p>
                          </div>
                          <div className="mt-4 flex items-center gap-4">
                            <span className={`inline-flex items-center rounded-md ${product.makeToOrder ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'} px-2 py-1 text-xs font-medium`}>
                              {product.makeToOrder ? 'Make-to-Order' : 'Ready-Made'}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                              Stock: {product.stock}
                            </span>
                            <Link 
                              href={product.href}
                              className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {filteredProducts.length > 0 && (
                  <div className="mt-8 flex items-center justify-center border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronDownIcon className="h-5 w-5 rotate-90" aria-hidden="true" />
                          </button>
                          
                          {/* Page numbers */}
                          {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pageNumber === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-gray-50'}`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Next</span>
                            <ChevronDownIcon className="h-5 w-5 -rotate-90" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      )}
    </div>
  );
}