'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { formatEuro } from '@/lib/currency';

export default function CartPage() {
  const { items = [], updateQuantity, removeItem, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = (items || []).reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + gst + (subtotal === 0 ? 0 : shipping);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-border pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
              Selected Pieces
            </p>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              Shopping Bag
            </h1>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Complimentary White-Glove Delivery
          </p>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-14">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping bag
            </h2>

            {items.length === 0 ? (
              <div className="py-20 text-center border-b border-border space-y-5">
                <h3 className="text-2xl font-light text-foreground">Your bag is empty</h3>
                <p className="text-sm font-light text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Explore our tailored suits, handloom shirts, trousers, and ceremonial Indian wear.
                </p>
                <div className="pt-2">
                  <Link
                    href="/new-arrivals"
                    className="inline-block px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Explore New Arrivals
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <ul role="list" className="divide-y divide-border border-b border-border">
                  {items.map((item, itemIdx) => {
                    const product = item.product;
                    const rawImg = product?.images?.[0] as unknown as string | { data?: string };
                    const imageSrc: string =
                      typeof rawImg === 'string'
                        ? rawImg
                        : rawImg?.data
                        ? rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                          ? rawImg.data
                          : `data:image/jpeg;base64,${rawImg.data}`
                        : '/images/original-ivory-blazer.jpg';

                    return (
                      <li key={itemIdx} className="py-6 flex gap-6 items-start">
                        <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-muted">
                          <Image
                            src={imageSrc}
                            alt={product?.name || 'Garment'}
                            fill
                            sizes="96px"
                            className="object-cover object-top"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                              <h3 className="text-sm sm:text-base font-normal text-foreground">
                                <Link
                                  href={`/product/${product?._id}`}
                                  className="hover:text-accent transition-colors"
                                >
                                  {product?.name || 'Tailored Garment'}
                                </Link>
                              </h3>
                              <p className="text-xs font-light text-muted-foreground">
                                Size: {item.size === 'customize' ? '48-Point Bespoke' : item.size} &middot; Fit: {item.fitting}
                              </p>
                              {item.measurements && (
                                <p className="text-[11px] font-mono text-muted-foreground pt-1">
                                  Chest {item.measurements.chest}&quot; &middot; Waist {item.measurements.waist}&quot; &middot; Shoulder {item.measurements.shoulder}&quot;
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (product?._id) {
                                  removeItem(product._id);
                                  toast.success('Removed from bag');
                                }
                              }}
                              aria-label="Remove item"
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-5 flex items-center justify-between">
                            <div className="inline-flex items-center border border-border">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => {
                                  if (product?._id) {
                                    updateQuantity(product._id, Math.max(1, item.quantity - 1));
                                  }
                                }}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs tabular-nums text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => {
                                  if (product?._id) {
                                    updateQuantity(product._id, item.quantity + 1);
                                  }
                                }}
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>

                            <p className="text-sm text-foreground tabular-nums">
                              {formatEuro((product?.price || 0) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      toast.success('Bag cleared');
                    }}
                    className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Order Summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-12 lg:mt-0 lg:col-span-5 border border-border p-8"
          >
            <h2
              id="summary-heading"
              className="text-xs uppercase tracking-[0.24em] text-muted-foreground pb-4 border-b border-border"
            >
              Order Summary
            </h2>

            <dl className="mt-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground tabular-nums">{formatEuro(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">VAT / Duty (18%)</dt>
                <dd className="text-foreground tabular-nums">
                  {formatEuro(gst)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="text-foreground">
                  {shipping === 0 ? 'Complimentary' : formatEuro(shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
                <dt className="font-normal text-foreground">Total</dt>
                <dd className="font-normal text-foreground tabular-nums">
                  {formatEuro(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link
                href={items.length > 0 ? '/checkout' : '#'}
                className={`w-full py-4 text-xs uppercase tracking-[0.22em] flex items-center justify-center transition-colors ${
                  items.length > 0
                    ? 'bg-foreground text-background hover:bg-accent hover:text-accent-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (items.length === 0) {
                    e.preventDefault();
                    toast.error('Your shopping bag is empty');
                  }
                }}
              >
                Proceed to Checkout
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/new-arrivals"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
