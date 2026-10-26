'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ClockIcon,
  TruckIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { orderService, OrderFilters } from '@/lib/api/order-service';
import { Order } from '@/lib/types';
import { toast } from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters: OrderFilters = {};
      if (statusFilter) {
        filters.status = statusFilter as any;
      }

      const response = await orderService.getOrders(filters);
      setOrders(response.data.items || []);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchOrders();
    }
  }, [statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Safe search filtering
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const orderId = (order._id || '').toLowerCase();
    const userName = (typeof order.user === 'object' && order.user?.name ? order.user.name : '').toLowerCase();
    const userEmail = (typeof order.user === 'object' && order.user?.email ? order.user.email : '').toLowerCase();

    return orderId.includes(term) || userName.includes(term) || userEmail.includes(term);
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/30';
    }
  };

  const getPaymentStatusBadgeClass = (isPaid: boolean) => {
    return isPaid
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter((o) => o.status?.toLowerCase() === 'processing').length;
  const shippedCount = orders.filter((o) => o.status?.toLowerCase() === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status?.toLowerCase() === 'delivered').length;

  if (!isClient) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <ShoppingBagIcon className="w-3.5 h-3.5" />
            <span>Fulfillment Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Bespoke Client Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor bespoke commissions, tailoring statuses, dispatch logistics, and client anatomical measurements.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-sm font-medium transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingBagIcon className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground mt-2">{orders.length}</p>
          <p className="text-[11px] text-muted-foreground mt-1">₹{totalRevenue.toLocaleString()} booked</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider">
            <span>In Processing</span>
            <ClockIcon className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground mt-2">{pendingCount}</p>
          <p className="text-[11px] text-amber-500/90 mt-1">Atelier tailoring stage</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider">
            <span>In Transit</span>
            <TruckIcon className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground mt-2">{shippedCount}</p>
          <p className="text-[11px] text-blue-400/90 mt-1">Diplomatic dispatch</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wider">
            <span>Fulfilled</span>
            <CheckBadgeIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-foreground mt-2">{deliveredCount}</p>
          <p className="text-[11px] text-emerald-400/90 mt-1">Hand-delivered</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by order ID, client name, or email..."
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All Order Statuses</option>
            <option value="processing">Processing (Atelier)</option>
            <option value="shipped">Shipped (Dispatch)</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Order ID
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Client / Patron
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Garments
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Atelier Status
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment
                </th>
                <th className="py-3.5 pl-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span>Loading ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const clientName = typeof order.user === 'object' && order.user?.name ? order.user.name : 'Patron Client';
                  const clientEmail = typeof order.user === 'object' && order.user?.email ? order.user.email : '';
                  const hasCustomMeasurements = order.items?.some(
                    (i: any) => (i.measurements && Object.keys(i.measurements).length > 0) ||
                                (i.customMeasurements && Object.keys(i.customMeasurements).length > 0)
                  );

                  return (
                    <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 font-mono text-xs font-bold text-foreground">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>

                      <td className="px-3 py-4 text-xs">
                        <div className="font-semibold text-foreground">{clientName}</div>
                        {clientEmail && <div className="text-muted-foreground text-[11px]">{clientEmail}</div>}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-xs">
                        <span className="font-medium text-foreground">{order.items?.length || 0} pcs</span>
                        {hasCustomMeasurements && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                            Custom Fit
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 font-semibold text-foreground text-xs">
                        ₹{order.totalPrice.toLocaleString()}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPaymentStatusBadgeClass(
                            order.isPaid
                          )}`}
                        >
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right font-medium">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                          <span>Manage</span>
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}