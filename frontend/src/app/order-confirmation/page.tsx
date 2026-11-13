'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { orderService } from '@/lib/api';
import { Order } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { formatEuro } from '@/lib/currency';

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
      a.download = `needle-fashion-invoice-${orderId}.pdf`;
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
        <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-light text-foreground">Order Not Found</h1>
          <p className="text-xs text-muted-foreground">
            The requested order record could not be retrieved.
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-8 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em]"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="border-b border-border pb-8 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.26em] text-accent">
            Order Confirmed
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Thank You for Your Order
          </h1>
          <p className="text-sm font-light text-muted-foreground">
            Your commission has been registered with our atelier. Reference: <span className="font-mono text-foreground">{order._id}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-border pb-8 text-xs">
          <div className="space-y-2">
            <p className="uppercase tracking-[0.2em] text-muted-foreground">Delivery Address</p>
            <p className="text-sm text-foreground">{order.shippingAddress.address}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
          </div>
          <div className="space-y-2">
            <p className="uppercase tracking-[0.2em] text-muted-foreground">Status</p>
            <p className="text-sm text-foreground">{order.status}</p>
            <p className="text-muted-foreground">
              {order.isPaid ? 'Payment Settled' : 'Payment Pending'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pieces</p>
          <div className="divide-y divide-border border-y border-border">
            {order.items.map((item, index) => {
              const rawImg = item.product?.images?.[0] as unknown as string | { data?: string };
              const imageSrc: string =
                typeof rawImg === 'string'
                  ? rawImg
                  : rawImg?.data
                  ? rawImg.data.startsWith('http') || rawImg.data.startsWith('/')
                    ? rawImg.data
                    : `data:image/jpeg;base64,${rawImg.data}`
                  : '/images/original-ivory-blazer.jpg';
              return (
                <div key={index} className="py-5 flex items-center gap-5">
                  <div className="relative w-16 h-20 flex-shrink-0 bg-muted overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={item.product?.name || 'Item'}
                      fill
                      sizes="64px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-normal text-foreground truncate">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm tabular-nums text-foreground">
                        {formatEuro(item.price * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs font-light text-muted-foreground">
                      Qty: {item.quantity} &middot; Size: {item.size === 'customize' ? 'Bespoke' : item.size} &middot; Fit: {item.fitting}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 text-xs border-b border-border pb-8">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums text-foreground">{formatEuro(order.itemsPrice)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span className="text-foreground">
              {order.shippingPrice === 0 ? 'Complimentary' : formatEuro(order.shippingPrice)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>VAT / Duty (18%)</span>
            <span className="tabular-nums text-foreground">{formatEuro(order.taxPrice)}</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-border text-foreground">
            <span>Total</span>
            <span className="tabular-nums">{formatEuro(order.totalPrice)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="flex-1 py-4 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors"
          >
            Download Invoice
          </button>
          <Link
            href="/new-arrivals"
            className="flex-1 py-4 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors text-center"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
