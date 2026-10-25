'use client';

import { productService } from '@/lib/api/product-service';
import { Product } from '@/lib/types';
import { toast } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import {
    CubeIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function InventoryPage() {
    const [inventory, setInventory] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts({ pageSize: 100 });
            setInventory(response.products || []);
        } catch (error: any) {
            console.error('Failed to fetch inventory:', error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item._id && item._id.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesStatus = true;
        if (statusFilter === 'Low Stock') {
            matchesStatus = item.stock > 0 && item.stock <= 10; // Threshold of 10
        } else if (statusFilter === 'Out of Stock') {
            matchesStatus = item.stock === 0;
        } else if (statusFilter === 'In Stock') {
            matchesStatus = item.stock > 10;
        }

        return matchesSearch && matchesStatus;
    });

    const lowStockCount = inventory.filter(item => item.stock > 0 && item.stock <= 10).length;
    const outOfStockCount = inventory.filter(item => item.stock === 0).length;

    return (
        <div className="py-6 space-y-8">
            <div className="sm:flex sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Inventory Management</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Track your product stock levels, set low-stock alerts, and manage SKU data.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-semibold text-foreground border border-border shadow-sm hover:bg-muted/80">
                        <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                        Sync Stock
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                        Update Stock
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-card border border-border overflow-hidden shadow rounded-lg p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
                            <CubeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-muted-foreground truncate">Total SKU Count</dt>
                            <dd className="text-2xl font-semibold text-foreground">{inventory.length}</dd>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border overflow-hidden shadow rounded-lg p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500/10 rounded-md p-3">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-muted-foreground truncate">Low Stock Items</dt>
                            <dd className="text-2xl font-semibold text-foreground">{lowStockCount}</dd>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border overflow-hidden shadow rounded-lg p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-500/10 rounded-md p-3">
                            <CubeIcon className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-muted-foreground truncate">Out of Stock</dt>
                            <dd className="text-2xl font-semibold text-foreground">{outOfStockCount}</dd>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-border bg-background py-1.5 pl-10 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                        placeholder="Search by product name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="rounded-md border-border bg-background text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </div>

            {/* Inventory Table */}
            <div className="bg-card border border-border shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">Loading inventory...</td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">No items found</td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => {
                                    const status = item.stock === 0 ? 'Out of Stock' : item.stock <= 10 ? 'Low Stock' : 'In Stock';
                                    return (
                                        <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-foreground">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-mono">{item._id.substring(0, 8).toUpperCase()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.category?.name || 'Uncategorized'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`font-semibold ${item.stock === 0 ? 'text-red-500' :
                                                    item.stock <= 10 ? 'text-yellow-600' :
                                                        'text-foreground'
                                                    }`}>
                                                    {item.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                                    status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="bg-muted/50 px-6 py-3 flex items-center justify-between border-t border-border">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInventory.length}</span> of <span className="font-medium">{filteredInventory.length}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button className="p-1 rounded border border-border bg-background text-muted-foreground disabled:opacity-50" disabled>
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button className="p-1 rounded border border-border bg-background text-muted-foreground disabled:opacity-50" disabled>
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
