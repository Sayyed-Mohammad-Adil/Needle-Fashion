'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import { ShoppingBagIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  const { addItem } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (product: Product) => {
    const cartItem = {
      product,
      quantity: 1,
      size: product.sizes.length > 0 ? product.sizes[0] : 40,
      fitting: 'Medium' as const,
    };
    
    addItem(cartItem);
    setSelectedProducts(prev => ({ ...prev, [product._id]: true }));
    toast.success(`${product.name} added to your shopping bag`);
    
    setTimeout(() => {
      setSelectedProducts(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="glass-card rounded-3xl p-3 animate-pulse">
            <div className="aspect-[3/4] w-full rounded-2xl bg-secondary/60" />
            <div className="mt-4 px-2 space-y-2">
              <div className="h-4 bg-secondary/80 rounded w-3/4" />
              <div className="h-3 bg-secondary/60 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl glass-panel p-8">
        <ShoppingBagIcon className="mx-auto h-12 w-12 text-primary/60" />
        <h3 className="mt-3 font-serif text-lg font-bold text-foreground">No Royal Masterpieces Located</h3>
        <p className="mt-1 text-xs text-muted-foreground">Adjust your refinement filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="group relative glass-card rounded-3xl p-3 flex flex-col justify-between border border-border/80 hover:border-primary/50 transition-all duration-300"
        >
          <div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondary/50">
              {(() => {
                const primaryImage = product.images && product.images[0];
                const imageSrc = primaryImage?.data
                  ? (primaryImage.data.startsWith('http') || primaryImage.data.startsWith('/')
                      ? primaryImage.data
                      : `data:image/jpeg;base64,${primaryImage.data}`)
                  : '/images/category-sherwani.jpg';
                const imageAlt = primaryImage?.alt || product.name;
                return (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                );
              })()}

              {/* Floating Top Tag */}
              <div className="absolute top-3 left-3">
                <span className="glass-pill px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-primary font-bold shadow-md">
                  {product.isMakeToOrder ? 'Bespoke Fit' : 'Ready to Wear'}
                </span>
              </div>
            </div>

            <div className="mt-4 px-2">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  <Link href={`/product/${product._id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
              </div>
              
              <p className="font-serif text-sm font-bold text-primary mt-1">
                ₹{product.price.toLocaleString()}
              </p>

              <div className="mt-1.5 flex items-center">
                <div className="flex items-center text-primary">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <span
                      key={rating}
                      className={`text-xs ${
                        rating < Math.floor(product.averageRating || 5)
                          ? 'text-[#C5A059]'
                          : 'text-border'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1.5 text-[10px] text-muted-foreground font-mono">
                    ({product.numReviews || 12})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 px-2 pt-3 border-t border-border/50 flex items-center justify-between relative z-10">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {product.isOutOfStock ? (
                <span className="text-red-500 font-semibold">Reserved</span>
              ) : (
                <span className="text-primary flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Atelier Stock
                </span>
              )}
            </span>

            <button
              onClick={() => handleQuickAdd(product)}
              disabled={product.isOutOfStock || selectedProducts[product._id]}
              className={`inline-flex items-center px-3.5 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider transition-all shadow-md ${
                product.isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                  : selectedProducts[product._id]
                  ? 'bg-emerald-600 text-white'
                  : 'btn-glass-gold'
              }`}
            >
              {selectedProducts[product._id] ? (
                <span className="flex items-center gap-1">
                  <CheckIcon className="w-3 h-3" /> Added
                </span>
              ) : (
                'Quick Bag'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}