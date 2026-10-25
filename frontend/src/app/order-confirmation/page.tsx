'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { orderService } from '@/lib/api';
import { Order } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, ArrowDownTrayIcon, ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      router.push('/');
    }
  }, [orderId, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId!);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const blob = await orderService.generateInvoice(orderId!);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `needle-atelier-commission-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Securing Commission Record...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-2xl font-bold text-foreground">Commission Record Not Found</h1>
          <p className="mt-2 text-xs text-muted-foreground">The requested order docket could not be retrieved.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 btn-luxury-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Return to Atelier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 text-primary mb-4 shadow-sm">
            <CheckCircleIcon className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-3 block mx-auto w-fit">
            <SparklesIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Royal Commission Confirmed</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Thank You for Your Patronage
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Your bespoke garment commission has been dispatched to our master karigars for artisanal crafting.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Top metadata strip */}
          <div className="p-6 sm:p-8 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Commission Dossier ID</span>
              <p className="font-mono text-sm font-bold text-primary mt-0.5">{order._id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${
                order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                order.status === 'Shipped' ? 'bg-sky-500/10 text-sky-600 border-sky-500/30' :
                'bg-primary/10 text-primary border-primary/30'
              }`}>
                {order.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${
                order.isPaid ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
              }`}>
                {order.isPaid ? 'Investment Settled' : 'Payment Pending'}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {/* Shipping Address */}
            <div className="p-5 rounded-2xl bg-background border border-border">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">White-Glove Delivery Destination</span>
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p className="font-serif font-bold text-foreground">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Bespoke Pieces</span>
              <div className="mt-3 divide-y divide-border border-y border-border">
                {order.items.map((item, index) => {
                  const rawImg = item.product?.images?.[0] as any;
                  const imageSrc: string = typeof rawImg === 'string'
                    ? rawImg
                    : rawImg?.data
                      ? (rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                          ? rawImg.data
                          : `data:image/jpeg;base64,${rawImg.data}`)
                      : '/images/category-kurta.jpg';
                  return (
                    <div key={index} className="py-4 flex items-center gap-4">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-muted/40">
                          <Image
                            src={imageSrc}
                            alt={item.product?.name || 'Couture Item'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif text-sm font-bold text-foreground truncate">{item.product?.name}</h3>
                        <p className="font-serif font-bold text-sm text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-full bg-card border border-border">Qty: {item.quantity}</span>
                        <span className="px-2 py-0.5 rounded-full bg-card border border-border">Size: {item.size === 'customize' ? 'Custom Measurement' : item.size}</span>
                        <span className="px-2 py-0.5 rounded-full bg-card border border-border">Silhouette: {item.fitting}</span>
                      </div>
                      {item.measurements && (
                        <div className="mt-2 text-[10px] text-primary font-mono flex gap-3">
                          <span>Chest: {item.measurements.chest}&quot;</span>
                          <span>Waist: {item.measurements.waist}&quot;</span>
                          <span>Shoulder: {item.measurements.shoulder}&quot;</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="p-6 rounded-2xl bg-background border border-border space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Atelier Subtotal</span>
                <span>₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Insured White-Glove Dispatch</span>
                <span className="text-primary font-semibold">
                  {order.shippingPrice === 0 ? 'Complimentary' : `₹${order.shippingPrice.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18% Imperial Duty)</span>
                <span>₹{order.taxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-foreground font-bold text-base pt-3 border-t border-border font-serif">
                <span>Total Investment</span>
                <span className="text-primary font-serif">₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleDownloadInvoice}
                className="w-full sm:flex-1 btn-luxury-outline py-3.5 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-primary" />
                <span>Download Atelier Invoice</span>
              </button>
              <Link
                href="/new-arrivals"
                className="w-full sm:flex-1 btn-luxury-gold py-3.5 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 text-center"
              >
                <ShoppingBagIcon className="w-4 h-4" />
                <span>Explore Further Creations</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}