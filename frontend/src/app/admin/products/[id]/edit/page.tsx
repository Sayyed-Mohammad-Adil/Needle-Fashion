'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/lib/api/product-service';
import { categoryService } from '@/lib/api/category-service';
import { Product, Category } from '@/lib/types';
import ProductPhotoManager, { FormattedImage } from '@/components/admin/ProductPhotoManager';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  SparklesIcon,
  CheckIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = params.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isMakeToOrder, setIsMakeToOrder] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([38, 40, 42, 44]);
  const [images, setImages] = useState<FormattedImage[]>([]);

  const availableSizes = [36, 38, 40, 42, 44, 46, 48, 50];

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [cats, prod] = await Promise.all([
        categoryService.getCategories(),
        productService.getProductById(productId),
      ]);

      setCategories(Array.isArray(cats) ? cats : []);

      if (prod) {
        setName(prod.name || '');
        setDescription(prod.description || '');
        const catId = typeof prod.category === 'object' ? prod.category?._id : prod.category;
        setCategory(catId || '');
        setPrice(String(prod.price || ''));
        setStock(String(prod.stock || 0));
        setIsOutOfStock(Boolean(prod.isOutOfStock));
        setIsMakeToOrder(prod.isMakeToOrder !== undefined ? prod.isMakeToOrder : true);
        setSelectedSizes(prod.sizes || [38, 40, 42]);

        // Normalize images
        const formatted = Array.isArray(prod.images)
          ? prod.images.map((img: any) => ({
              data: img.data || img.url || '',
              alt: img.alt || '',
            }))
          : [];
        setImages(formatted);
      }
    } catch (error) {
      console.error('Failed to load piece:', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeToggle = (size: number) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a, b) => a - b));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please specify a garment title');
      return;
    }
    if (!category) {
      toast.error('Please assign an archival category');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Please enter a valid price in INR');
      return;
    }

    try {
      setIsSaving(true);

      const updatePayload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock) || 0,
        isOutOfStock,
        category,
        isMakeToOrder,
        sizes: selectedSizes,
        images: images.length > 0 ? images : [{ data: '/images/hero-ethnic.jpg', alt: name }],
      };

      await productService.updateProduct(productId, updatePayload);
      toast.success('Piece details and pricing updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast.error(error.response?.data?.message || 'Failed to update piece');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you wish to permanently delete this piece from the catalog?')) return;
    try {
      await productService.deleteProduct(productId);
      toast.success('Piece deleted from catalogue');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to delete piece');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
        <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Loading Creation Specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
              <SparklesIcon className="w-3 h-3" />
              <span>Modify Creation Details</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {name || 'Edit Product'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/product/${productId}`}
            target="_blank"
            className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <EyeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">View on Store</span>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete Piece"
          >
            <TrashIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-luxury-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo Management Docket */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
          <ProductPhotoManager images={images} onChange={setImages} />
        </div>

        {/* Pricing & Inventory Docket */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-border/60">
            Pricing, Valuation &amp; Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Base Retail Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">₹</span>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-2.5 text-sm font-serif font-bold text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Available Physical Units
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  setIsOutOfStock(Number(e.target.value) <= 0);
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Catalogue Stock Status
              </label>
              <select
                value={isOutOfStock ? 'out' : 'in'}
                onChange={(e) => setIsOutOfStock(e.target.value === 'out')}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              >
                <option value="in">In Stock / Available</option>
                <option value="out">Out of Stock (Archive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Garment Details Docket */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-border/60">
            Garment Details &amp; Provenance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Garment Title / Model Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Atelier Description &amp; Provenance
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Archival Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="editMakeToOrder"
                checked={isMakeToOrder}
                onChange={(e) => setIsMakeToOrder(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <label htmlFor="editMakeToOrder" className="text-xs font-bold text-foreground cursor-pointer">
                Available for Bespoke 48-Point Anatomical Tailoring
              </label>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-foreground pb-2 border-b border-border/60">
            Available Menswear Chest Sizes (Inches)
          </h3>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {availableSizes.map((sz) => {
              const isSelected = selectedSizes.includes(sz);
              return (
                <button
                  type="button"
                  key={sz}
                  onClick={() => handleSizeToggle(sz)}
                  className={`w-14 h-12 rounded-xl text-xs font-serif font-bold transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'border border-border bg-background text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <span>{sz}</span>
                  <span className="text-[9px] font-sans font-normal opacity-75">Chest</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-luxury-gold px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all"
          >
            {isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}