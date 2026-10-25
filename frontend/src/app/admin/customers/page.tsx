'use client';

import React, { useState, useEffect } from 'react';
import {
    UsersIcon,
    UserPlusIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    EllipsisHorizontalIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { userService } from '@/lib/api/user-service';
import { User } from '@/lib/types';
import { toast } from 'react-hot-toast';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers(1, 100);
            // The response might be PaginatedResponse or just the array depending on how it's implemented.
            // My user-service.ts said it returns PaginatedResponse<User>.
            const users = (response as any).data?.items || response || [];
            setCustomers(users);
        } catch (error: any) {
            console.error('Failed to fetch customers:', error);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || customer.role === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const totalCustomers = customers.length;
    const adminCount = customers.filter(c => c.role === 'admin').length;
    const customerCount = customers.filter(c => c.role === 'customer').length;

    // New this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = customers.filter(c => c.createdAt ? new Date(c.createdAt) >= firstDayOfMonth : false).length;

    return (
        <div className="py-6 space-y-8">
            <div className="sm:flex sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Customer Management</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        View and manage your customer database, their orders, and account status.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0">
                    <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                        <UserPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-card border border-border overflow-hidden shadow rounded-lg p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
                            <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-muted-foreground truncate">Total Customers</dt>
                            <dd className="text-2xl font-semibold text-foreground">{customerCount}</dd>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border overflow-hidden shadow rounded-lg p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500/10 rounded-md p-3">
                            <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-muted-foreground truncate">Admins</dt>
                            <dd className="text-2xl font-semibold text-foreground">{adminCount}</dd>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border overflow-hidden shadow rounded-lg p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500/10 rounded-md p-3">
                            <UserPlusIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5">
                            <dt className="text-sm font-medium text-muted-foreground truncate">New This Month</dt>
                            <dd className="text-2xl font-semibold text-foreground">{newThisMonth}</dd>
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
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="rounded-md border-border bg-background text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>

            {/* Customers Table */}
            <div className="bg-card border border-border shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">Loading customers...</td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">No customers found</td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-foreground">{customer.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {customer.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{customer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-primary hover:text-primary/80">
                                                <EllipsisHorizontalIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="bg-muted/50 px-6 py-3 flex items-center justify-between border-t border-border">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{filteredCustomers.length}</span> results
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
