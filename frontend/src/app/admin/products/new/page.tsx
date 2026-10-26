'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/lib/api/product-service';
import { categoryService } from '@/lib/api/category-service';
import { Category } from '@/lib/types';
import ProductPhotoManager, { FormattedImage } from '@/components/admin/ProductPhotoManager';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  SparklesIcon,
  CheckIcon,
  ScissorsIcon,
} from '@heroicons/react/24/outline';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [isMakeToOrder, setIsMakeToOrder] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([38, 40, 42, 44]);
  const [fittingOptions, setFittingOptions] = useState<string[]>(['Loose', 'Medium', 'Fit']);
  const [images, setImages] = useState<FormattedImage[]>([]);

  // Standard Menswear Chest Sizes in Inches
  const availableSizes = [36, 38, 40, 42, 44, 46, 48, 50];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
        setCategory(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load product categories');
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
      toast.error('Please assign a category');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Please enter a valid price in INR');
      return;
    }

    try {
      setIsLoading(true);

      const productPayload = {
        name: name.trim(),
        description: description.trim() || 'Handcrafted bespoke piece from the Needle Fashion royal atelier.',
        price: Number(price),
        stock: Number(stock) || 0,
        category,
        isMakeToOrder,
        sizes: selectedSizes,
        fittingOptions,
        images: images.length > 0 ? images : [{ data: '/images/hero-ethnic.jpg', alt: name }],
        filters: {
          Fabric: ['Mulberry Silk', 'Banarasi Brocade'],
          Occasion: ['Wedding Gala', 'Royal Coronation'],
        },
      };

      await productService.createProduct(productPayload);
      toast.success('New piece created and published to catalogue!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast.error(error.response?.data?.message || 'Failed to create piece');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
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
              <span>Catalog Commission</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Add New Haute Creation
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn-luxury-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <CheckIcon className="w-4 h-4" />
          <span>{isLoading ? 'Publishing...' : 'Publish Piece'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo Management Docket */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
          <ProductPhotoManager images={images} onChange={setImages} />
        </div>

        {/* Essential Information Docket */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-border/60">
            Garment Specifications
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
                placeholder="e.g. Imperial Ivory Sherwani with 24K Antique Zardozi"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Atelier Description &amp; Provenance
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the fabric weaves, bullion wire zardozi embroidery, pit-loom origins, and royal carriage..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Base Retail Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 38999"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground font-serif font-bold text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Initial Stock Allocation
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="makeToOrder"
                checked={isMakeToOrder}
                onChange={(e) => setIsMakeToOrder(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
              />
              <label htmlFor="makeToOrder" className="text-xs font-bold text-foreground cursor-pointer">
                Available for Bespoke 48-Point Anatomical Tailoring
              </label>
            </div>
          </div>
        </div>

        {/* Sizes and Sizing Options */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-foreground pb-2 border-b border-border/60">
            Available Menswear Chest Sizes (Inches)
          </h3>
          <p className="text-xs text-muted-foreground">
            Select standard ready-to-wear sizes offered for this silhouette.
          </p>

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

        {/* Form Action Footer */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-luxury-gold px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all"
          >
            {isLoading ? 'Publishing Creation...' : 'Publish to Store Catalogue'}
          </button>
        </div>
      </form>
    </div>
  );
}