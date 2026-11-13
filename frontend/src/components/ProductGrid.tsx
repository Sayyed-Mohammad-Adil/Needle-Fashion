'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatEuro } from '@/lib/currency';

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
    setSelectedProducts((prev) => ({ ...prev, [product._id]: true }));
    toast.success(`${product.name} added to your bag`);

    setTimeout(() => {
      setSelectedProducts((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="aspect-[3/4] w-full bg-muted" />
            <div className="space-y-2">
              <div className="h-3.5 bg-muted w-3/4" />
              <div className="h-3 bg-muted w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border-t border-b border-border">
        <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
          Selection Empty
        </p>
        <h3 className="text-lg font-light text-foreground">
          No pieces match the selected criteria
        </h3>
        <p className="mt-2 text-xs text-muted-foreground font-light">
          Adjust your filters or explore another category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const primaryImage = product.images && product.images[0];
        const imageSrc = primaryImage?.data
          ? primaryImage.data.startsWith('http') || primaryImage.data.startsWith('/')
            ? primaryImage.data
            : `data:image/jpeg;base64,${primaryImage.data}`
          : '/images/original-ivory-blazer.jpg';
        const imageAlt = primaryImage?.alt || product.name;
        const isAdded = selectedProducts[product._id];

        return (
          <article key={product._id} className="group flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted mb-4">
              <Link href={`/product/${product._id}`} className="block w-full h-full">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </Link>

              <button
                type="button"
                onClick={() => handleQuickAdd(product)}
                disabled={product.isOutOfStock || isAdded}
                aria-label={`Add ${product.name} to bag`}
                className="absolute bottom-3 right-3 h-9 w-9 flex items-center justify-center bg-background/90 text-foreground border border-border opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50"
              >
                {isAdded ? (
                  <CheckIcon className="w-4 h-4 stroke-[1.5]" />
                ) : (
                  <PlusIcon className="w-4 h-4 stroke-[1.5]" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {product.isMakeToOrder ? 'Made to Measure' : product.category?.name || 'Ready to Wear'}
              </p>
              <Link
                href={`/product/${product._id}`}
                className="block text-sm font-normal text-foreground hover:text-accent transition-colors line-clamp-1"
              >
                {product.name}
              </Link>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-foreground tabular-nums">
                  {formatEuro(product.price)}
                </p>
                {product.isOutOfStock ? (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Reserved
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    EU {(product.sizes?.length ? product.sizes : [46, 48, 50, 52, 54]).join(' · ')}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
