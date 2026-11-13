'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, CartItem } from '@/contexts/CartContext';
import { productService } from '@/lib/api';
import { Product, MeasurementDetails } from '@/lib/types';
import { toast } from 'react-hot-toast';
import SizeSelector from '@/components/SizeSelector';
import {
  HeartIcon as HeartIconOutline,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { royalMenswearProducts } from '@/lib/royalCatalog';
import { formatEuro } from '@/lib/currency';

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | 'custom'>('custom');
  const [selectedFitting, setSelectedFitting] = useState<'Loose' | 'Medium' | 'Fit'>('Medium');
  const [customMeasurements, setCustomMeasurements] = useState<MeasurementDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let data: Product | null = null;
      try {
        data = await productService.getProductById(id);
      } catch {
        const found = royalMenswearProducts.find(
          (p) => p._id === id || String(p._id) === String(id)
        );
        data = found || royalMenswearProducts[0];
      }

      if (!data) {
        const found = royalMenswearProducts.find(
          (p) => p._id === id || String(p._id) === String(id)
        );
        data = found || royalMenswearProducts[0];
      }

      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.isMakeToOrder && selectedSize === 'custom' && !customMeasurements) {
      toast.error('Please enter your 48-point bespoke measurements');
      return;
    }

    if (!product.isMakeToOrder && selectedSize === 'custom') {
      toast.error('This piece is exclusively ready-to-wear');
      return;
    }

    const cartItem: CartItem = {
      product,
      quantity,
      size: selectedSize === 'custom' ? 'customize' : (selectedSize as number),
      fitting: selectedFitting,
      measurements: selectedSize === 'custom' ? customMeasurements || undefined : undefined,
    };

    addItem(cartItem);
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items to your wishlist');
      return;
    }

    try {
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-light text-foreground">Piece Not Found</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This garment may have been archived or acquired.
          </p>
          <Link
            href="/new-arrivals"
            className="inline-block px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em]"
          >
            Explore New Arrivals
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = product.images?.[imageIndex];
  const imageSrc = primaryImage?.data
    ? primaryImage.data.startsWith('http') || primaryImage.data.startsWith('/')
      ? primaryImage.data
      : `data:image/jpeg;base64,${primaryImage.data}`
    : '/images/original-ivory-blazer.jpg';

  return (
    <main className="bg-background text-foreground min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-10">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category?.name?.toLowerCase() || 'all'}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category?.name || 'Collection'}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse gap-4">
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((img, index) => {
                  const thumbSrc = img.data
                    ? img.data.startsWith('http') || img.data.startsWith('/')
                      ? img.data
                      : `data:image/jpeg;base64,${img.data}`
                    : '/images/original-ivory-blazer.jpg';
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      className={`relative aspect-[3/4] overflow-hidden border transition-opacity ${
                        imageIndex === index
                          ? 'border-foreground opacity-100'
                          : 'border-border opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={thumbSrc}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover object-top"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 border-b border-border pb-6">
              <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                {product.isMakeToOrder ? 'Made to Measure' : 'Ready to Wear'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground leading-snug">
                {product.name}
              </h1>
              <p className="text-xl font-normal text-foreground tabular-nums pt-1">
                {formatEuro(product.price)}
              </p>
              <p className="text-xs font-light text-muted-foreground">
                Inclusive of tailoring and taxes.
              </p>
            </div>

            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              {product.description ||
                'Crafted from handwoven Indian textiles and tailored to 48 anatomical checkpoints for an effortless, architectural silhouette.'}
            </p>

            {/* Size & Bespoke Selector */}
            <div className="border-t border-border pt-6">
              <SizeSelector
                sizes={product.sizes || [46, 48, 50, 52, 54]}
                isMakeToOrder={product.isMakeToOrder ?? true}
                selectedSize={selectedSize}
                selectedFitting={selectedFitting}
                customMeasurements={customMeasurements || undefined}
                onSizeChange={setSelectedSize}
                onFittingChange={setSelectedFitting}
                onMeasurementsChange={setCustomMeasurements}
              />
            </div>

            {/* Quantity */}
            <div className="border-t border-border pt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Quantity
              </span>
              <div className="inline-flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs tabular-nums text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.isOutOfStock}
                className={`flex-1 py-4 px-6 text-xs uppercase tracking-[0.22em] transition-colors ${
                  product.isOutOfStock
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-foreground text-background hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {product.isOutOfStock ? 'Unavailable' : 'Add to Bag'}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className="py-4 px-5 border border-border text-xs uppercase tracking-[0.2em] text-foreground hover:border-foreground transition-colors flex items-center justify-center gap-2"
              >
                {isWishlisted ? (
                  <>
                    <HeartIconSolid className="h-4 w-4 text-foreground" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <HeartIconOutline className="h-4 w-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>

            {/* Provenance Notes */}
            <div className="border-t border-border pt-6 space-y-2 text-xs font-light text-muted-foreground">
              <p>Complimentary virtual consultation and post-delivery alteration</p>
              <p>Handloom &amp; artisanal craft certification included</p>
              <p>Insured white-glove international dispatch</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
