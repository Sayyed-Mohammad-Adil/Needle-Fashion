'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatEuro } from '@/lib/currency';

const mockOrders = [
  {
    id: 'ORD-123456',
    date: '2025-10-15',
    total: 32999,
    status: 'Delivered',
    items: [
      { id: 1, name: 'Mughal Jaali Ivory Tailored Suit', quantity: 1, price: 32999 },
    ],
  },
  {
    id: 'ORD-789012',
    date: '2025-09-28',
    total: 24999,
    status: 'Processing',
    items: [
      { id: 2, name: 'Rose Bandhgala & Linen Shirt', quantity: 1, price: 24999 },
    ],
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [orders] = useState(mockOrders);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/customer/orders');
    }
  }, [isClient, isLoading, isAuthenticated, router]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-border pb-8 mb-12">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
            Client Account
          </p>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Order History
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Track current commissions, review past orders, and download invoices.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="text-lg font-light text-muted-foreground">
              You have not placed any orders yet.
            </p>
            <Link
              href="/new-arrivals"
              className="inline-block px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em]"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order.id} className="border border-border">
                <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-muted-foreground">Order</dt>
                      <dd className="mt-1 font-mono text-foreground">{order.id}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-muted-foreground">Date</dt>
                      <dd className="mt-1 text-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.2em] text-muted-foreground">Total</dt>
                      <dd className="mt-1 tabular-nums text-foreground">
                        {formatEuro(order.total)}
                      </dd>
                    </div>
                  </dl>

                  <span className="text-[11px] uppercase tracking-[0.2em] text-accent">
                    {order.status}
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-normal text-foreground">{item.name}</p>
                        <p className="text-xs font-light text-muted-foreground mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm tabular-nums text-foreground">
                        {formatEuro(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
