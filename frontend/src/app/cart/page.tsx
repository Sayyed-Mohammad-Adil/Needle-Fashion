'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon, SparklesIcon, ShoppingBagIcon, ShieldCheckIcon, TruckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

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
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">Retrieving Salon Bag...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        <div className="border-b border-border/50 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-1">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Commissioned Pieces</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Bespoke Shopping Bag
            </h1>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="glass-pill px-3 py-1 text-[#C5A059] border border-[#C5A059]/40">
              ⚜ Insured White-Glove Dispatch
            </span>
          </div>
        </div>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            {items.length === 0 ? (
              <div className="py-20 text-center glass-panel rounded-3xl p-8 my-4 shadow-xl border border-[#C5A059]/30">
                <div className="w-16 h-16 rounded-full glass-pill mx-auto flex items-center justify-center text-[#C5A059] mb-4">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Your Salon Bag is Empty</h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
                  Discover our handcrafted royal sherwanis, 24K gold zari bandhgalas, and pure silk kurtas.
                </p>
                <div className="mt-8">
                  <Link
                    href="/new-arrivals"
                    className="btn-glass-gold inline-flex px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em]"
                  >
                    Explore Atelier Collections &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <ul role="list" className="space-y-4">
                  {items.map((item, itemIdx) => {
                    const product = item.product;
                    const rawImg = product?.images?.[0] as any;
                    const imageSrc: string = typeof rawImg === 'string'
                      ? rawImg
                      : rawImg?.data
                        ? (rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                            ? rawImg.data
                            : `data:image/jpeg;base64,${rawImg.data}`)
                        : '/images/category-kurta.jpg';

                    return (
                      <li key={itemIdx} className="glass-card p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <div className="relative h-28 w-24 flex-shrink-0 rounded-2xl overflow-hidden border border-[#C5A059]/40 bg-muted/40 shadow-sm">
                          <Image
                            src={imageSrc}
                            alt={product?.name || 'Couture item'}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between w-full">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-serif text-base font-bold">
                                <Link href={`/product/${product?._id}`} className="text-foreground hover:text-[#C5A059] transition-colors">
                                  {product?.name || 'Heirloom Garment'}
                                </Link>
                              </h3>
                              <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                                <span className="glass-pill px-2.5 py-0.5 border border-border/50">
                                  Size: {item.size === 'customize' ? 'Bespoke 48-Pt' : item.size}
                                </span>
                                <span className="glass-pill px-2.5 py-0.5 border border-border/50">
                                  Silhouette: {item.fitting}
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-serif font-bold text-[#C5A059]">
                                ₹{((product?.price || 0) * item.quantity).toLocaleString()}
                              </p>

                              {item.measurements && (
                                <div className="mt-2 text-[10px] text-muted-foreground font-mono glass-panel p-2 rounded-xl border border-border/40 inline-block">
                                  <span>Chest: {item.measurements.chest}&quot; | </span>
                                  <span>Waist: {item.measurements.waist}&quot; | </span>
                                  <span>Shoulder: {item.measurements.shoulder}&quot;</span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (product?._id) {
                                  removeItem(product._id);
                                  toast.success('Piece removed from bag');
                                }
                              }}
                              className="h-8 w-8 rounded-full glass-pill flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40">
                            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                              Artisan Quantity
                            </span>
                            <div className="flex items-center glass-pill p-1 border border-border/50">
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#C5A059]/20 transition-colors"
                                onClick={() => {
                                  if (product?._id) {
                                    updateQuantity(product._id, Math.max(1, item.quantity - 1));
                                  }
                                }}
                              >
                                <MinusIcon className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#C5A059]/20 transition-colors"
                                onClick={() => {
                                  if (product?._id) {
                                    updateQuantity(product._id, item.quantity + 1);
                                  }
                                }}
                              >
                                <PlusIcon className="h-3 w-3" />
                              </button>
                            </div>
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
                      toast.success('Shopping bag cleared');
                    }}
                    className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Clear Salon Bag
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Order Investment Summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-12 rounded-3xl glass-panel-gold border border-[#C5A059]/30 shadow-2xl p-6 sm:p-8 lg:col-span-5 lg:mt-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Atelier Investment</span>
            </div>
            <h2 id="summary-heading" className="font-serif text-2xl font-bold text-foreground">
              Order Ledger
            </h2>

            <dl className="mt-6 space-y-3.5 text-xs divide-y divide-border/40">
              <div className="flex items-center justify-between pt-2">
                <dt className="text-muted-foreground">Handloom Subtotal</dt>
                <dd className="font-semibold text-foreground">₹{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex items-center justify-between pt-3">
                <dt className="text-muted-foreground">GST (18% Imperial Duty)</dt>
                <dd className="font-semibold text-foreground">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</dd>
              </div>
              <div className="flex items-center justify-between pt-3">
                <dt className="text-muted-foreground">White-Glove Insured Delivery</dt>
                <dd className="font-semibold text-[#C5A059]">
                  {shipping === 0 ? 'Complimentary' : `₹${shipping.toLocaleString()}`}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#C5A059]/40">
                <dt className="font-serif text-base font-bold text-foreground">Total Investment</dt>
                <dd className="font-serif text-xl font-bold text-[#C5A059]">₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Link
                href={items.length > 0 ? "/checkout" : "#"}
                className={`w-full ${
                  items.length > 0
                    ? 'btn-glass-gold shadow-xl'
                    : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                } py-4 text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center text-center`}
                onClick={(e) => {
                  if (items.length === 0) {
                    e.preventDefault();
                    toast.error('Your shopping bag is empty');
                  }
                }}
              >
                Proceed to Bespoke Checkout
              </Link>
            </div>

            <div className="mt-6 space-y-2 border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-[#C5A059]" />
                <span>100% Genuine Handloom & Zari Certification</span>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-[#C5A059]" />
                <span>Complimentary Master Tailor Adjustment Protocol</span>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>
                or{' '}
                <Link href="/new-arrivals" className="font-semibold text-[#C5A059] hover:underline">
                  Continue Browsing Atelier
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}