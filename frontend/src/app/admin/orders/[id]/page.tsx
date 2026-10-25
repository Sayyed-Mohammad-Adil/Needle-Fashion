'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-2023-1001',
    customer: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
    },
    date: '2023-11-15',
    total: 4999,
    subtotal: 4499,
    tax: 500,
    shipping: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    items: [
      {
        id: 1,
        name: 'Embroidered Kurta',
        price: 2999,
        quantity: 1,
        size: 'L',
        color: 'Maroon',
        customizations: 'Standard fit',
      },
      {
        id: 5,
        name: 'Festive Nehru Jacket',
        price: 1500,
        quantity: 1,
        size: 'M',
        color: 'Navy Blue',
        customizations: 'None',
      },
    ],
    timeline: [
      { status: 'ordered', date: '2023-11-15T10:30:00Z', note: 'Order placed' },
      { status: 'processing', date: '2023-11-15T14:20:00Z', note: 'Payment confirmed' },
      { status: 'shipped', date: '2023-11-16T11:45:00Z', note: 'Order shipped via BlueDart Express' },
      { status: 'delivered', date: '2023-11-18T15:10:00Z', note: 'Delivered to customer' },
    ],
  },
  // Other orders would be here
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const orderId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  useEffect(() => {
    // In a real app, fetch order from API
    const fetchOrder = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const foundOrder = mockOrders.find(o => o.id === orderId);
          
          if (foundOrder) {
            setOrder(foundOrder);
            setStatusUpdate(foundOrder.status);
          } else {
            toast.error('Order not found');
            router.push('/admin/orders');
          }
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        toast.error('Failed to load order');
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, router]);
  
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, send to API
      // await updateOrderStatus(orderId, statusUpdate, statusNote);
      
      // Simulate API call
      setTimeout(() => {
        // Update local state
        const updatedOrder = {
          ...order,
          status: statusUpdate,
          timeline: [
            ...order.timeline,
            {
              status: statusUpdate,
              date: new Date().toISOString(),
              note: statusNote || `Order marked as ${statusUpdate}`,
            },
          ],
        };
        
        setOrder(updatedOrder);
        toast.success('Order status updated successfully');
        setStatusNote('');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to update order status');
      setIsLoading(false);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Order not found</h2>
        <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Order {order.id}
            <span
              className={`ml-3 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(order.status)}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Placed on {new Date(order.date).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/orders"
            className="block rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Order Summary</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.paymentMethod}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mt-6 bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Details</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {order.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {item.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          <div>Size: {item.size}</div>
                          <div>Color: {item.color}</div>
                          {item.customizations && <div>Customizations: {item.customizations}</div>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{item.price.toLocaleString()}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.quantity}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row" colSpan={4} className="hidden pl-6 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell">Subtotal</th>
                      <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Subtotal</th>
                      <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-6">₹{order.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th scope="row" colSpan={4} className="hidden pl-6 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell">Tax</th>
                      <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Tax</th>
                      <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-6">₹{order.tax.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th scope="row" colSpan={4} className="hidden pl-6 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell">Shipping</th>
                      <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Shipping</th>
                      <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-6">₹{order.shipping.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th scope="row" colSpan={4} className="hidden pl-6 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell">Total</th>
                      <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total</th>
                      <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">₹{order.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Order Timeline</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ul role="list" className="-mb-8">
                {order.timeline.map((event: any, eventIdx: number) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== order.timeline.length - 1 ? (
                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusBadgeClass(event.status).replace('text-', 'text-white ').replace('bg-', 'bg-')}`}
                          >
                            {/* Icon would go here in a real app */}
                            <span className="text-xs font-bold">{event.status.charAt(0).toUpperCase()}</span>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </span>
                              {event.note && ` - ${event.note}`}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {formatDate(event.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Customer and Shipping Info + Status Update */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Customer Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer.phone}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Shipping Address</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <address className="not-italic text-sm text-gray-900">
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
                <div>{order.shippingAddress.country}</div>
              </address>
            </div>
          </div>
          
          {/* Update Order Status */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Update Order Status</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <form onSubmit={handleStatusUpdate}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                      Note (optional)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add details about this status update"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || statusUpdate === order.status}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}