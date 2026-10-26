'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/lib/api/product-service';
import { categoryService } from '@/lib/api/category-service';
import { Product, Category } from '@/lib/types';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CurrencyRupeeIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  SparklesIcon,
  PhotoIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Quick Inline Pricing State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  // Delete State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter, stockFilter]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        pageSize: 15,
      };

      if (searchTerm) filters.keyword = searchTerm;
      if (categoryFilter) filters.category = categoryFilter;
      if (stockFilter === 'in-stock') filters.inStock = true;
      if (stockFilter === 'out-of-stock') filters.inStock = false;

      const response = await productService.getProducts(filters);
      setProducts(response.products || []);
      setTotalPages(response.pages || 1);
      setTotalProducts(response.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load catalog pieces');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleStartEditPrice = (product: Product) => {
    setEditingPriceId(product._id);
    setEditingPriceValue(String(product.price));
  };

  const handleCancelEditPrice = () => {
    setEditingPriceId(null);
    setEditingPriceValue('');
  };

  const handleSavePrice = async (productId: string) => {
    const numPrice = Number(editingPriceValue);
    if (isNaN(numPrice) || numPrice < 0) {
      toast.error('Please enter a valid price amount');
      return;
    }

    try {
      setIsSavingPrice(true);
      await productService.updateProductPricing(productId, { price: numPrice });
      toast.success('Price updated successfully');
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, price: numPrice } : p))
      );
      setEditingPriceId(null);
    } catch (error) {
      toast.error('Failed to update price');
    } finally {
      setIsSavingPrice(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newStockStatus = !product.isOutOfStock;
    try {
      await productService.updateProductPricing(product._id, {
        isOutOfStock: newStockStatus,
      });
      toast.success(newStockStatus ? 'Marked as Out of Stock' : 'Marked as In Stock');
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isOutOfStock: newStockStatus } : p
        )
      );
    } catch (error) {
      toast.error('Failed to update stock status');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete._id);
      toast.success('Product deleted successfully');
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const img = product.images[0].data;
      if (img.startsWith('http') || img.startsWith('/')) return img;
      return `data:image/jpeg;base64,${img}`;
    }
    return '/images/hero-ethnic.jpg';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.24em] uppercase text-primary mb-1">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Royal Haute Catalog</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Products &amp; Pricing Management
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your haute couture catalogue, lookbook photography, base pricing, and inventory allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-border bg-card text-foreground hover:border-primary transition-all shadow-sm"
            title="Refresh Products"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/products/new"
            className="btn-luxury-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Haute Creation</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Total Catalog Pieces
          </span>
          <p className="font-serif text-3xl font-black text-foreground mt-2">{totalProducts}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Exhibited pieces</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-primary/30 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary block">
            Active Ready-Made Pieces
          </span>
          <p className="font-serif text-3xl font-black text-primary mt-2">
            {products.filter((p) => !p.isOutOfStock).length}
          </p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Ready for white-glove dispatch</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Make-To-Order Runway
          </span>
          <p className="font-serif text-3xl font-black text-foreground mt-2">
            {products.filter((p) => p.isMakeToOrder).length}
          </p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Bespoke 48-point tailoring</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Archival Categories
          </span>
          <p className="font-serif text-3xl font-black text-foreground mt-2">{categories.length}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">Sherwani, Kurta, Accessories</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search piece by name, fabric, silhouette..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Stock Status</option>
            <option value="in-stock">In Stock / Available</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Loading Catalogue Pieces...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-card rounded-3xl border border-border p-8">
          <PhotoIcon className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" />
          <h3 className="font-serif text-lg font-bold text-foreground">No Products Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new piece to the collection.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-4 pl-6 pr-3">Garment / Photo</th>
                  <th className="px-3 py-4">Archival Category</th>
                  <th className="px-3 py-4">
                    <span className="flex items-center gap-1 text-primary">
                      <span>Pricing (₹)</span>
                      <span className="text-[8px] font-normal lowercase">(quick edit)</span>
                    </span>
                  </th>
                  <th className="px-3 py-4">Stock Status</th>
                  <th className="px-3 py-4">Tailoring Mode</th>
                  <th className="py-4 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((product) => {
                  const isEditingPrice = editingPriceId === product._id;
                  const categoryName = typeof product.category === 'object' && product.category?.name
                    ? product.category.name
                    : 'Ethnic Wear';

                  return (
                    <tr key={product._id} className="hover:bg-muted/30 transition-colors">
                      {/* Product & Photo */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border shadow-sm">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover object-top"
                            />
                            {product.images?.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] text-white px-1 font-mono font-bold">
                                +{product.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                              title={product.name}
                            >
                              {product.name}
                            </Link>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-3.5 text-muted-foreground font-medium">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {categoryName}
                        </span>
                      </td>

                      {/* Pricing with Quick Inline Editor */}
                      <td className="px-3 py-3.5">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground text-xs">₹</span>
                            <input
                              type="number"
                              value={editingPriceValue}
                              onChange={(e) => setEditingPriceValue(e.target.value)}
                              className="w-24 rounded-lg border border-primary bg-background px-2 py-1 text-xs font-bold text-foreground focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSavePrice(product._id)}
                              disabled={isSavingPrice}
                              className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm"
                              title="Save Price"
                            >
                              <CheckIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditPrice}
                              className="p-1 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Cancel"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="group/price flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-foreground">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditPrice(product)}
                              className="opacity-0 group-hover/price:opacity-100 p-1 text-primary hover:bg-primary/10 rounded transition-all"
                              title="Quick edit price"
                            >
                              <PencilIcon className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Stock Status with Quick Toggle */}
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStock(product)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            !product.isOutOfStock
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20'
                          }`}
                          title="Click to toggle stock status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${!product.isOutOfStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span>{!product.isOutOfStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Tailoring Mode */}
                      <td className="px-3 py-3.5 text-muted-foreground text-[11px]">
                        {product.isMakeToOrder ? (
                          <span className="text-primary font-medium">Bespoke / Made-to-Order</span>
                        ) : (
                          <span>Ready-to-Wear</span>
                        )}
                      </td>

                      {/* Action Links */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/product/${product._id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="View on Storefront"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            title="Edit Photos & Pricing"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete Piece"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-xl border border-border disabled:opacity-40 hover:bg-muted"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-xl border border-border disabled:opacity-40 hover:bg-muted"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
          <div className="bg-card max-w-md w-full rounded-3xl border border-red-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Delete Catalogue Piece?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you wish to delete <span className="text-foreground font-semibold">"{productToDelete.name}"</span>? This will permanently remove the piece, lookbook photos, and pricing records.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 shadow-sm"
              >
                Delete Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}