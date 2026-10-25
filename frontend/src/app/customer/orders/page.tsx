'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock order data for demonstration
const mockOrders = [
  {
    id: 'ORD-123456',
    date: '2023-10-15',
    total: 4599,
    status: 'Delivered',
    items: [
      { id: 1, name: 'Embroidered Kurta', quantity: 1, price: 2999 },
      { id: 2, name: 'Silk Dhoti Pants', quantity: 1, price: 1600 }
    ]
  },
  {
    id: 'ORD-789012',
    date: '2023-09-28',
    total: 8999,
    status: 'Processing',
    items: [
      { id: 3, name: 'Wedding Sherwani', quantity: 1, price: 8999 }
    ]
  },
  {
    id: 'ORD-345678',
    date: '2023-08-10',
    total: 3499,
    status: 'Shipped',
    items: [
      { id: 4, name: 'Kurta-Jacket Set', quantity: 1, price: 3499 }
    ]
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // In a real application, you would fetch orders from your API
    // if (isAuthenticated) {
    //   fetchOrders().then(data => setOrders(data));
    // }
  }, [isAuthenticated]);

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (isClient && !isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/customer/orders');
    }
  }, [isClient, isLoading, isAuthenticated, router]);

  if (!isClient || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-500">
          Check the status of recent orders, manage returns, and download invoices.
        </p>

        {orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center">
            <p className="text-lg text-muted-foreground">You haven't placed any orders yet.</p>
            <Link
              href="/new-arrivals"
              className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:underline inline-block"
            >
              Start Exploring Atelier Creations
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        ) : (
          <div className="mt-16">
            <h2 className="sr-only">Recent orders</h2>

            <div className="space-y-16">
              {orders.map((order) => (
                <div key={order.id} className="border-t border-b border-border bg-card shadow-sm sm:rounded-2xl sm:border">
                  <div className="flex items-center border-b border-border p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                    <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3">
                      <div>
                        <dt className="font-serif font-bold text-foreground">Order number</dt>
                        <dd className="mt-1 text-muted-foreground font-mono text-xs">{order.id}</dd>
                      </div>
                      <div className="hidden sm:block">
                        <dt className="font-serif font-bold text-foreground">Date placed</dt>
                        <dd className="mt-1 text-muted-foreground">
                          <time dateTime={order.date}>
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-serif font-bold text-foreground">Total amount</dt>
                        <dd className="mt-1 font-serif font-bold text-primary">₹{order.total.toLocaleString()}</dd>
                      </div>
                    </dl>

                    <div className="hidden lg:col-span-1 lg:flex lg:items-center lg:justify-end lg:space-x-3">
                      <Link
                        href={`/customer/orders/${order.id}`}
                        className="btn-luxury-outline px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                      >
                        <span>View Order</span>
                        <span className="sr-only">{order.id}</span>
                      </Link>
                      <Link
                        href={`/customer/orders/${order.id}/invoice`}
                        className="btn-luxury-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                      >
                        <span>Invoice</span>
                        <span className="sr-only">for order {order.id}</span>
                      </Link>
                    </div>
                  </div>

                  {/* Order status */}
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
                    <h4 className="sr-only">Status</h4>
                    <p className="text-sm font-medium text-gray-900">Status: 
                      <span className={`ml-2 ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Processing' ? 'text-blue-600' : 'text-orange-600'}`}>
                        {order.status}
                      </span>
                    </p>
                    <div className="mt-6" aria-hidden="true">
                      <div className="overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className={`h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-600' : order.status === 'Processing' ? 'bg-blue-600 w-1/3' : 'bg-orange-600 w-2/3'}`} 
                          style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Processing' ? '33%' : '66%' }}
                        />
                      </div>
                      <div className="mt-6 hidden grid-cols-3 text-sm font-medium text-gray-600 sm:grid">
                        <div className="text-blue-600">Processing</div>
                        <div className={`text-center ${order.status === 'Shipped' || order.status === 'Delivered' ? 'text-orange-600' : ''}`}>Shipped</div>
                        <div className={`text-right ${order.status === 'Delivered' ? 'text-green-600' : ''}`}>Delivered</div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="border-t border-gray-200">
                    <h3 className="sr-only">Items</h3>
                    <div className="divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <div key={item.id} className="p-4 sm:grid sm:grid-cols-5 sm:gap-6 sm:p-6">
                          <div className="flex items-center sm:col-span-3">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">Image</span>
                            </div>
                            <div className="ml-6">
                              <div className="text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                              </div>
                              <div className="mt-1 text-sm text-gray-500">
                                <p>Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 sm:col-span-2 sm:mt-0 flex justify-end">
                            <p className="text-right text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile view actions */}
                  <div className="flex border-t border-gray-200 px-4 py-6 sm:hidden">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <span>View Order</span>
                      <span className="sr-only">{order.id}</span>
                    </Link>
                    <Link
                      href={`/customer/orders/${order.id}/invoice`}
                      className="ml-4 flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      <span>View Invoice</span>
                      <span className="sr-only">for order {order.id}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}