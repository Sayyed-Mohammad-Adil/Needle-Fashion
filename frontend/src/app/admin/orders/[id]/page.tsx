'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/lib/api/order-service';
import { toast } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  SparklesIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CreditCardIcon,
  ScissorsIcon,
  CheckCircleIcon,
  ClockIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrderById(orderId);
      if (data) {
        setOrder(data);
        setStatusUpdate(data.status || 'Processing');
      } else {
        toast.error('Order not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order dossier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUpdate) return;

    try {
      setIsUpdating(true);
      const updated = await orderService.updateOrderStatus(orderId, statusUpdate as any);
      setOrder(updated);
      toast.success(`Order status updated to ${statusUpdate}`);
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/30';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/30';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getItemImage = (item: any) => {
    if (item.product?.images && item.product.images.length > 0) {
      const img = item.product.images[0].data;
      if (img.startsWith('http') || img.startsWith('/')) return img;
      return `data:image/jpeg;base64,${img}`;
    }
    return '/images/hero-ethnic.jpg';
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
        <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Opening Patron Order Dossier...</p>
      </div>
    );
  }

  if (!order) return null;

  const customerName = typeof order.user === 'object' ? order.user?.name : 'Patron';
  const customerEmail = typeof order.user === 'object' ? order.user?.email : 'Not provided';
  const customerPhone = typeof order.user === 'object' ? order.user?.phone : 'Not provided';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              Order #{order._id.substring(0, 8).toUpperCase()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:border-primary transition-colors flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Items & Measurements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-border/60 flex items-center justify-between">
              <span>Commissioned Garments ({order.items?.length || 0})</span>
              <span className="text-xs text-muted-foreground font-normal">Haute Tailoring</span>
            </h3>

            <div className="divide-y divide-border/60">
              {order.items?.map((item: any, idx: number) => {
                const productName = item.product?.name || `Garment Item #${idx + 1}`;
                const hasCustom = item.customMeasurements && Object.keys(item.customMeasurements).length > 0;

                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                        <img
                          src={getItemImage(item)}
                          alt={productName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-base text-foreground">
                            {productName}
                          </h4>
                          <span className="font-serif font-bold text-base text-primary">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>Qty: <strong className="text-foreground">{item.quantity}</strong></span>
                          <span>•</span>
                          <span>Size: <strong className="text-foreground">{item.size}</strong></span>
                          <span>•</span>
                          <span>Fitting Silhouette: <strong className="text-foreground">{item.fitting || 'Medium'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Custom Anatomical Measurements Block */}
                    {hasCustom && (
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          <ScissorsIcon className="w-3.5 h-3.5" />
                          <span>48-Point Bespoke Anatomical Measurements (Inches)</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                          {Object.entries(item.customMeasurements).map(([key, val]) => {
                            if (key === 'photo' || val === undefined) return null;
                            return (
                              <div key={key} className="p-2 rounded-xl bg-card border border-border/70">
                                <span className="text-[9px] uppercase text-muted-foreground font-bold block">{key}</span>
                                <span className="font-serif font-bold text-foreground mt-0.5 block">{String(val)}"</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing & Valuation Summary */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-3 text-xs">
            <h3 className="font-serif text-base font-bold text-foreground pb-2 border-b border-border/60">
              Billing &amp; Financial Breakdown
            </h3>
            <div className="flex justify-between py-1 text-muted-foreground">
              <span>Items Subtotal</span>
              <span className="font-serif font-bold text-foreground">₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 text-muted-foreground">
              <span>White-Glove Insured Shipping</span>
              <span className="font-serif font-bold text-foreground">
                {order.shippingPrice === 0 ? 'Complimentary' : `₹${order.shippingPrice?.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between py-1 text-muted-foreground">
              <span>Applicable Luxury GST</span>
              <span className="font-serif font-bold text-foreground">₹{order.taxPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border font-serif text-lg font-bold text-foreground">
              <span>Total Commission Amount</span>
              <span className="text-primary">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Status Dispatch Controls */}
        <div className="space-y-6">
          {/* Status Update Control */}
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground">
              Dispatch &amp; Order Status
            </h3>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Update Atelier Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Processing">Processing (In Atelier)</option>
                  <option value="Shipped">Shipped (White-Glove Transit)</option>
                  <option value="Delivered">Delivered (Handed to Patron)</option>
                  <option value="Cancelled">Cancelled (Archived)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full btn-luxury-gold py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                {isUpdating ? 'Updating Status...' : 'Apply Status Update'}
              </button>
            </form>

            <div className="pt-2 text-[11px] space-y-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${order.isPaid ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {order.isPaid ? 'Paid in Full' : 'Pending Payment'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium text-foreground">{order.paymentMethod || 'Razorpay / Card'}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" />
              <span>Patron Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Name</span>
                <p className="font-serif font-bold text-sm text-foreground mt-0.5">{customerName}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Email</span>
                <a href={`mailto:${customerEmail}`} className="text-primary hover:underline mt-0.5 block">
                  {customerEmail}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">Phone</span>
                <a href={`tel:${customerPhone}`} className="text-foreground hover:underline font-semibold mt-0.5 block">
                  {customerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-primary" />
              <span>Delivery Destination</span>
            </h3>

            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country || 'India'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}