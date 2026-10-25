'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  CubeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  salesByDate: {
    _id: string;
    totalSales: number;
    orderCount: number;
  }[];
  salesByCategory: {
    categoryName: string;
    totalSales: number;
    itemsSold: number;
  }[];
  topSellingProducts: {
    name: string;
    totalSold: number;
    totalRevenue: number;
  }[];
  orderStatusCounts: {
    _id: string;
    count: number;
  }[];
}

export default function ResponsiveAnalyticsDashboard({ data }: { data: AnalyticsData }) {
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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
              <CurrencyRupeeIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">Total Revenue</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(data.totalRevenue || 0)}
                </div>
              </dd>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
              <ShoppingBagIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">Total Orders</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatNumber(data.totalOrders || 0)}
                </div>
              </dd>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
              <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">Total Customers</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatNumber(data.totalUsers || 0)}
                </div>
              </dd>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
              <CubeIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="truncate text-sm font-medium text-gray-500">Total Products</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatNumber(data.totalProducts || 0)}
                </div>
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Mobile friendly grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h2>
            <div className="h-80 overflow-y-auto">
              {data.salesByDate && data.salesByDate.length > 0 ? (
                <div className="space-y-4">
                  {data.salesByDate.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-sm text-gray-500 truncate">
                        {new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.totalSales)}
                          </span>
                          <span className="text-gray-500">
                            {item.orderCount} orders
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (item.totalSales / Math.max(...data.salesByDate.map(d => d.totalSales))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No revenue data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h2>
            <div className="h-80 overflow-y-auto">
              {data.salesByCategory && data.salesByCategory.length > 0 ? (
                <div className="space-y-4">
                  {data.salesByCategory.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 text-sm text-gray-500 truncate">
                        {category.categoryName}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(category.totalSales)}
                          </span>
                          <span className="text-gray-500">
                            {category.itemsSold} items
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (category.totalSales / Math.max(...data.salesByCategory.map(c => c.totalSales))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No category data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
            <div className="overflow-y-auto max-h-80">
              <ul className="divide-y divide-gray-200">
                {data.topSellingProducts && data.topSellingProducts.length > 0 ? (
                  data.topSellingProducts.map((product, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-500">Image</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">Sold: {product.totalSold}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(product.totalRevenue)}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    No product data available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h2>
            <div className="overflow-y-auto max-h-80">
              <ul className="divide-y divide-gray-200">
                {data.orderStatusCounts && data.orderStatusCounts.length > 0 ? (
                  data.orderStatusCounts.map((status, index) => (
                    <li key={index} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-3 w-3 rounded-full ${
                            status._id === 'Delivered' ? 'bg-green-500' :
                            status._id === 'Shipped' ? 'bg-blue-500' :
                            status._id === 'Processing' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}></div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{status._id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{status.count}</div>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status._id === 'Delivered' ? 'bg-green-500' :
                            status._id === 'Shipped' ? 'bg-blue-500' :
                            status._id === 'Processing' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`} 
                          style={{ 
                            width: `${Math.min(100, (status.count / data.orderStatusCounts.reduce((sum, s) => sum + s.count, 0)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    No order status data available
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}