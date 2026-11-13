'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { formatEuro } from '@/lib/currency';

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCartDrawer({ isOpen, onClose }: MobileCartDrawerProps) {
  const { items = [], totalPrice, removeItem, updateQuantity } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gst = totalPrice * 0.18;
  const shipping = totalPrice > 1000 ? 0 : 100;
  const total = totalPrice + gst + shipping;

  if (!isClient || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-8">
        <div className="relative w-screen max-w-sm bg-background border-l border-border flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <h2 className="text-xs uppercase tracking-[0.22em] text-foreground">
              Shopping Bag
            </h2>
            <button
              type="button"
              aria-label="Close bag"
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              <XMarkIcon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
                <h3 className="text-lg font-light text-foreground">Your bag is empty</h3>
                <p className="text-xs font-light text-muted-foreground">
                  Explore our suits, shirts, trousers, and Indian wear.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-foreground text-background text-xs uppercase tracking-[0.2em]"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item, idx) => {
                  const rawImg = item.product?.images?.[0] as unknown as string | { data?: string };
                  const imageSrc =
                    typeof rawImg === 'string'
                      ? rawImg
                      : rawImg?.data
                      ? rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                        ? rawImg.data
                        : `data:image/jpeg;base64,${rawImg.data}`
                      : '/images/original-ivory-blazer.jpg';

                  return (
                    <li key={idx} className="py-4 flex gap-4">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-muted relative">
                        <Image
                          src={imageSrc}
                          alt={item.product?.name || 'Item'}
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/product/${item.product?._id}`}
                            onClick={onClose}
                            className="text-xs text-foreground truncate"
                          >
                            {item.product?.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => item.product?._id && removeItem(item.product._id)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Remove item"
                          >
                            <XMarkIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="inline-flex items-center border border-border text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                item.product?._id &&
                                updateQuantity(item.product._id, Math.max(1, item.quantity - 1))
                              }
                              className="px-2 py-0.5 text-muted-foreground hover:text-foreground"
                            >
                              -
                            </button>
                            <span className="px-2 tabular-nums text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                item.product?._id &&
                                updateQuantity(item.product._id, item.quantity + 1)
                              }
                              className="px-2 py-0.5 text-muted-foreground hover:text-foreground"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-xs tabular-nums text-foreground">
                            {formatEuro((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total (incl. VAT)</span>
                <span className="text-foreground tabular-nums">
                  {formatEuro(total)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] text-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
