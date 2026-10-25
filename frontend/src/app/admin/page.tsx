'use client';

import { useState, useEffect } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { analyticsService } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Default data for the dashboard
const defaultStats = [
  {
    name: 'Total Revenue',
    value: '₹0',
    change: '+0%',
    changeType: 'increase',
    icon: CurrencyRupeeIcon,
  },
  {
    name: 'Total Orders',
    value: '0',
    change: '+0%',
    changeType: 'increase',
    icon: ShoppingBagIcon,
  },
  {
    name: 'New Customers',
    value: '0',
    change: '+0%',
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    name: 'Conversion Rate',
    value: '0%',
    change: '+0%',
    changeType: 'increase',
    icon: ArrowDownIcon,
  },
];

const defaultLowStockItems: any[] = [];
const defaultRecentOrders: any[] = [];
const defaultTopProducts: any[] = [];

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(defaultStats);
  const [lowStockItems, setLowStockItems] = useState(defaultLowStockItems);
  const [recentOrders, setRecentOrders] = useState(defaultRecentOrders);
  const [topProducts, setTopProducts] = useState(defaultTopProducts);

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await analyticsService.getDashboardStats();

      // Update stats
      setStats([
        {
          name: 'Total Revenue',
          value: `₹${dashboardData.totalRevenue?.toLocaleString() || '0'}`,
          change: '+12.5%', // TODO: Calculate actual change
          changeType: 'increase',
          icon: CurrencyRupeeIcon,
        },
        {
          name: 'Total Orders',
          value: dashboardData.totalOrders?.toString() || '0',
          change: '+5.2%', // TODO: Calculate actual change
          changeType: 'increase',
          icon: ShoppingBagIcon,
        },
        {
          name: 'New Customers',
          value: dashboardData.totalUsers?.toString() || '0',
          change: '+8.1%', // TODO: Calculate actual change
          changeType: 'increase',
          icon: UsersIcon,
        },
        {
          name: 'Conversion Rate',
          value: '3.6%', // TODO: Calculate actual conversion rate
          change: '-0.5%',
          changeType: 'decrease',
          icon: ArrowDownIcon,
        },
      ]);

      // Update low stock items
      if (dashboardData.lowStockProducts) {
        setLowStockItems(dashboardData.lowStockProducts);
      }

      // Update recent orders
      if (dashboardData.recentOrders) {
        setRecentOrders(dashboardData.recentOrders);
      }

      // Update top selling products
      if (dashboardData.topSellingProducts) {
        setTopProducts(dashboardData.topSellingProducts);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-card px-4 py-5 shadow sm:p-6 border border-border">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-muted-foreground">{item.name}</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-foreground">{item.value}</div>
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                    ) : (
                      <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                    </span>
                    {item.change}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <div className="overflow-hidden rounded-lg bg-card shadow border border-border">
          <div className="p-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
              <h2 className="ml-3 text-lg font-medium text-foreground">Low Stock Alerts</h2>
            </div>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Product
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Category
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Stock
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {lowStockItems.length > 0 ? (
                        lowStockItems.map((item) => (
                          <tr key={item._id || item.id} className="hover:bg-table-row-hover transition-colors">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-0">
                              {item.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{item.category?.name || item.category}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{item.stock || item.countInStock}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${(item.stock || item.countInStock) === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {(item.stock || item.countInStock) === 0 ? 'Out of Stock' : 'Low Stock'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-gray-500">
                            No low stock items
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-lg bg-card shadow border border-border">
          <div className="p-6">
            <h2 className="text-lg font-medium text-foreground">Recent Orders</h2>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Order ID
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Customer
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground sm:pl-0">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr key={order._id || order.id} className="hover:bg-table-row-hover transition-colors">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-muted-foreground">
                              {order._id || order.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground sm:pl-0">{order.user?.name || order.customer}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground sm:pl-0">₹{order.totalPrice?.toLocaleString() || order.amount}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'Shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                  }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-gray-500">
                            No recent orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-8 overflow-hidden rounded-lg bg-card shadow border border-border">
        <div className="p-6">
          <h2 className="text-lg font-medium text-foreground">Top Selling Products</h2>
          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-0">
                        Product
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                        Category
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                        Units Sold
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topProducts.length > 0 ? (
                      topProducts.map((product) => (
                        <tr key={product._id || product.id} className="hover:bg-table-row-hover transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-0">
                            {product.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{product.category?.name || product.category}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{product.totalSold || product.sold}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">₹{product.totalRevenue?.toLocaleString() || product.revenue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-muted-foreground">
                          No product data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}