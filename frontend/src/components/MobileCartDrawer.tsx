'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCartDrawer({ isOpen, onClose }: MobileCartDrawerProps) {
  const { items = [], totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over cart */}
      <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-10">
        <div className="relative w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll glass-panel-gold shadow-2xl border-l border-[#C5A059]/30">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-5 sm:px-6">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <span>⚜</span> Atelier Shopping Bag
              </h2>
              <button
                type="button"
                className="glass-pill h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <ShoppingBagIcon className="mx-auto h-12 w-12 text-[#C5A059] opacity-40" />
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">Your bag is empty</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Discover bespoke mens couture pieces</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-glass-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                    >
                      Explore Runway
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="space-y-3.5">
                    {items.map((item, idx) => {
                      const rawImg = item.product?.images?.[0] as any;
                      const imageSrc = typeof rawImg === 'string'
                        ? rawImg
                        : rawImg?.data
                          ? (rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                              ? rawImg.data
                              : `data:image/jpeg;base64,${rawImg.data}`)
                          : '/images/category-kurta.jpg';

                      return (
                        <li key={idx} className="glass-panel p-3.5 rounded-2xl flex gap-3.5 border border-border/50">
                          <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[#C5A059]/30 bg-muted/40 relative">
                            <Image src={imageSrc} alt={item.product?.name || 'Garment'} fill className="object-cover" />
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between text-xs font-serif font-bold text-foreground">
                                <h3 className="truncate max-w-[160px]">
                                  <Link href={`/product/${item.product?._id}`}>{item.product?.name}</Link>
                                </h3>
                                <p className="text-[#C5A059]">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                              </div>
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                Size: {item.size === 'customize' ? 'Bespoke 48-Pt' : item.size} • Fit: {item.fitting}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border/30">
                              <div className="flex items-center glass-pill px-2 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product?._id, Math.max(1, item.quantity - 1))}
                                  className="p-0.5 text-muted-foreground hover:text-foreground text-xs"
                                >
                                  -
                                </button>
                                <span className="mx-2 text-foreground font-bold text-xs">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                                  className="p-0.5 text-muted-foreground hover:text-foreground text-xs"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.product?._id)}
                                className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Checkout section */}
            {items.length > 0 && (
              <div className="border-t border-border/50 px-4 py-5 sm:px-6 glass-panel-gold">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-foreground">
                    <p>Subtotal</p>
                    <p className="font-semibold">₹{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <p>GST (18%)</p>
                    <p>₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <p>Shipping</p>
                    <p className="text-[#C5A059]">{shipping === 0 ? 'Complimentary' : `₹${shipping.toLocaleString()}`}</p>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-[#C5A059]/30 pt-2 text-foreground">
                    <p>Total</p>
                    <p className="text-[#C5A059]">₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href={isAuthenticated ? "/checkout" : "/auth/login?redirect=/checkout"}
                    onClick={onClose}
                    className="w-full btn-glass-gold py-3 text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center text-center shadow-lg"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}