'use client';

import { useState, useEffect } from 'react';
import { expenseService } from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [summary, setSummary] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    description: '',
    receipt: ''
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
    fetchSummary();
  }, [currentPage, searchTerm, categoryFilter, dateFilter]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        pageSize: 10,
      };

      if (searchTerm) {
        filters.keyword = searchTerm;
      }

      if (categoryFilter) {
        filters.category = categoryFilter;
      }

      if (dateFilter) {
        const today = new Date();
        const startDate = new Date();

        switch (dateFilter) {
          case 'today':
            filters.startDate = today.toISOString().split('T')[0];
            filters.endDate = today.toISOString().split('T')[0];
            break;
          case 'week':
            startDate.setDate(today.getDate() - 7);
            filters.startDate = startDate.toISOString().split('T')[0];
            filters.endDate = today.toISOString().split('T')[0];
            break;
          case 'month':
            startDate.setMonth(today.getMonth() - 1);
            filters.startDate = startDate.toISOString().split('T')[0];
            filters.endDate = today.toISOString().split('T')[0];
            break;
        }
      }

      const response = await expenseService.getExpenses(filters);
      setExpenses(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalExpenses(response.data.total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await expenseService.getExpenseCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryData = await expenseService.getExpenseSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateClick = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      receipt: ''
    });
    setShowModal(true);
  };

  const handleEditClick = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.split('T')[0],
      description: expense.description || '',
      receipt: expense.receipt || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expenseService.deleteExpense(id);
      toast.success('Expense deleted successfully');
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await expenseService.createExpense(expenseData);
        toast.success('Expense created successfully');
      }

      setShowModal(false);
      fetchExpenses();
      fetchSummary();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-foreground">Expense Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your business expenses and track spending
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={handleCreateClick}
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="flex items-center">
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Expense
            </span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-6">
          <div className="bg-card overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-destructive rounded-md p-3">
                  <CurrencyRupeeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-muted-foreground truncate">Total Expenses</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-foreground">
                      {formatCurrency(summary.totalAmount)}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <CurrencyRupeeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-muted-foreground truncate">Total Count</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-foreground">
                      {summary.totalCount}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <CurrencyRupeeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-muted-foreground truncate">Avg. Expense</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-foreground">
                      {formatCurrency(summary.totalCount > 0 ? summary.totalAmount / summary.totalCount : 0)}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full rounded-md border-border py-1.5 pl-10 text-foreground bg-background ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Search expenses"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="category" className="sr-only">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="block w-full rounded-md border-border py-1.5 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="date" className="sr-only">
            Date Range
          </label>
          <select
            id="date"
            name="date"
            value={dateFilter}
            onChange={handleDateFilter}
            className="block w-full rounded-md border-border py-1.5 text-foreground bg-background shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Expenses table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        No expenses found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                          {expense.title}
                          {expense.description && (
                            <div className="text-muted-foreground text-xs mt-1">{expense.description}</div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{expense.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-foreground font-medium">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(expense)}
                              className="text-primary hover:text-primary/80"
                            >
                              <span className="sr-only">Edit {expense.title}</span>
                              <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(expense._id)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <span className="sr-only">Delete {expense.title}</span>
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-foreground">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-foreground bg-background ring-1 ring-inset ring-border hover:bg-muted focus:outline-offset-0 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-card border border-border px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-foreground">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                  </h3>
                </div>
                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-foreground">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-background border-border text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-foreground">
                        Amount
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-muted-foreground sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="block w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-foreground">
                        Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-background border-border text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-foreground">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-background border-border text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-background border-border text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-start-2"
                    >
                      {editingExpense ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:col-start-1 sm:mt-0"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}