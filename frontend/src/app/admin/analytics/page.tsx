'use client';

import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [salesAnalytics, setSalesAnalytics] = useState<any>(null);
  const [productAnalytics, setProductAnalytics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data in parallel
      const [dashboardData, salesData, productData, userData] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getSalesAnalytics(),
        analyticsService.getProductAnalytics(),
        analyticsService.getUserAnalytics()
      ]);

      setDashboardStats(dashboardData);
      setSalesAnalytics(salesData);
      setProductAnalytics(productData);
      setUserAnalytics(userData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your business performance and key metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary rounded-md p-3">
                <CurrencyRupeeIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Revenue</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-foreground">
                    {formatCurrency(dashboardStats?.totalRevenue || 0)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary rounded-md p-3">
                <ShoppingBagIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Orders</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-foreground">
                    {formatNumber(dashboardStats?.totalOrders || 0)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Customers</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-foreground">
                    {formatNumber(dashboardStats?.totalUsers || 0)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary rounded-md p-3">
                <CubeIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-muted-foreground truncate">Total Products</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-foreground">
                    {formatNumber(dashboardStats?.totalProducts || 0)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-card border border-border shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Revenue Overview</h2>
          <div className="h-80">
            {salesAnalytics?.salesByDate && salesAnalytics.salesByDate.length > 0 ? (
              <div className="space-y-4">
                {salesAnalytics.salesByDate.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-muted-foreground">
                      {new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {formatCurrency(item.totalSales)}
                        </span>
                        <span className="text-muted-foreground">
                          {item.orderCount} orders
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (item.totalSales / Math.max(...salesAnalytics.salesByDate.map((d: any) => d.totalSales))) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-card border border-border shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Sales by Category</h2>
          <div className="h-80">
            {salesAnalytics?.salesByCategory && salesAnalytics.salesByCategory.length > 0 ? (
              <div className="space-y-4">
                {salesAnalytics.salesByCategory.map((category: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-muted-foreground truncate">
                      {category.categoryName}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {formatCurrency(category.totalSales)}
                        </span>
                        <span className="text-muted-foreground">
                          {category.itemsSold} items
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (category.totalSales / Math.max(...salesAnalytics.salesByCategory.map((c: any) => c.totalSales))) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-card border border-border shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Top Selling Products</h2>
          <div className="flow-root">
            <ul className="divide-y divide-border">
              {dashboardStats?.topSellingProducts && dashboardStats.topSellingProducts.length > 0 ? (
                dashboardStats.topSellingProducts.map((product: any, index: number) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Image</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{product.name}</div>
                          <div className="text-sm text-muted-foreground">Sold: {product.totalSold}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {formatCurrency(product.totalRevenue)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-muted-foreground">
                  No product data available
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-card border border-border shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-foreground mb-4">Order Status Distribution</h2>
          <div className="flow-root">
            <ul className="divide-y divide-border">
              {dashboardStats?.orderStatusCounts && dashboardStats.orderStatusCounts.length > 0 ? (
                dashboardStats.orderStatusCounts.map((status: any, index: number) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-3 w-3 rounded-full ${status._id === 'Delivered' ? 'bg-green-500' :
                            status._id === 'Shipped' ? 'bg-blue-500' :
                              status._id === 'Processing' ? 'bg-yellow-500' :
                                'bg-muted-foreground'
                          }`}></div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-foreground">{status._id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{status.count}</div>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${status._id === 'Delivered' ? 'bg-green-500' :
                            status._id === 'Shipped' ? 'bg-blue-500' :
                              status._id === 'Processing' ? 'bg-yellow-500' :
                                'bg-muted-foreground'
                          }`}
                        style={{
                          width: `${Math.min(100, (status.count / dashboardStats.orderStatusCounts.reduce((sum: number, s: any) => sum + s.count, 0)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-muted-foreground">
                  No order status data available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple CurrencyRupeeIcon component since it's not in Heroicons
function CurrencyRupeeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}